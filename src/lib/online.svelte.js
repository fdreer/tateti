import { db, ensureAuth } from './firebase.js';
import { game, room } from './state.svelte.js';
import { generateCode, applyMove } from './gameLogic.js';
import { navigate } from './router.svelte.js';
import {
  ref, set, update, get, onValue, onDisconnect, serverTimestamp,
} from 'firebase/database';

// Module-level singleton state
let _code   = null;
let _slot   = null;   // 'X' | 'O'
let _uid    = null;
let _unsub  = null;   // room onValue unsubscribe
let _infoUnsub = null; // .info/connected unsubscribe

// ── Helpers ──────────────────────────────────────────────────────────────────

function _boardToFB(board) {
  return board.reduce((o, v, i) => ({ ...o, [i]: v ?? '' }), {});
}

function _boardFromFB(fb) {
  if (!fb) return Array(9).fill(null);
  return Array.from({ length: 9 }, (_, i) => {
    const v = fb[i];
    return (v === '' || v === undefined || v === null) ? null : v;
  });
}

function _comboToFB(combo) {
  if (!combo) return null;
  return { 0: combo[0], 1: combo[1], 2: combo[2] };
}

function _comboFromFB(fb) {
  if (!fb) return null;
  return [fb[0], fb[1], fb[2]];
}

function _mapToState(data) {
  if (!data) return;
  const g = data.game ?? {};

  game.board        = _boardFromFB(g.board);
  game.current      = g.current  ?? 'X';
  game.round        = g.round    ?? 1;
  game.scores       = g.scores   ?? { X: 0, O: 0 };
  game.over         = !!g.over;
  game.winningCombo = _comboFromFB(g.winningCombo);

  if (data.players?.X?.name) game.names.X = data.players.X.name;
  if (data.players?.O?.name) game.names.O = data.players.O.name;
}

function _subscribe(code) {
  if (_unsub) _unsub();
  _unsub = onValue(ref(db, `rooms/${code}`), (snap) => {
    const data = snap.val();
    if (!data) return;

    _mapToState(data);

    // Reconnect overlay: show when other player dropped
    if (_slot) {
      const other = _slot === 'X' ? 'O' : 'X';
      const otherPlayer = data.players?.[other];
      if (data.players?.O && otherPlayer?.connected === false) {
        room.status = 'reconnecting';
      } else if (room.status === 'reconnecting' && otherPlayer?.connected === true) {
        room.status = 'playing';
      }
    }

    // Host auto-navigates to /game when O joins
    if (_slot === 'X' && data.status === 'playing' && data.players?.O) {
      if (room.status === 'waiting') {
        room.status = 'playing';
        navigate('/game');
      }
    }
  });
}

function _setupPresence(code, slot) {
  const slotRef = ref(db, `rooms/${code}/players/${slot}`);

  // Register onDisconnect before marking connected, so it's always set
  const disc = onDisconnect(slotRef);
  disc.update({ connected: false, lastSeen: serverTimestamp() });

  // Reconnect: re-register onDisconnect and mark connected again
  if (_infoUnsub) _infoUnsub();
  _infoUnsub = onValue(ref(db, '.info/connected'), (snap) => {
    if (snap.val() !== true) return;
    disc.cancel();
    update(slotRef, { connected: true, lastSeen: serverTimestamp() });
    disc.update({ connected: false, lastSeen: serverTimestamp() });
  });
}

// ── Internal helpers exported for unit testing (prefix signals non-public API) ─
export const _internal = { _boardToFB, _boardFromFB, _comboToFB, _comboFromFB, _mapToState };

// ── Public API ────────────────────────────────────────────────────────────────

export async function createRoom(name) {
  const user = await ensureAuth();
  _uid  = user.uid;
  _slot = 'X';

  const initialGame = {
    board:        _boardToFB(Array(9).fill(null)),
    current:      'X',
    round:        1,
    scores:       { X: 0, O: 0 },
    over:         false,
    winningCombo: null,
    lastMoveBy:   null,
  };

  for (let i = 0; i < 5; i++) {
    const code = generateCode();
    try {
      await set(ref(db, `rooms/${code}`), {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status:    'waiting',
        players: {
          X: { uid: user.uid, name, connected: true, lastSeen: serverTimestamp() },
        },
        game: initialGame,
      });

      _code = code;
      _setupPresence(code, 'X');
      _subscribe(code);

      game.mode     = 'online';
      game.names    = { X: name, O: '—' };
      Object.assign(game, { board: Array(9).fill(null), current: 'X', round: 1, scores: { X: 0, O: 0 }, over: false, winningCombo: null });
      room.code     = code;
      room.isHost   = true;
      room.slot     = 'X';
      room.status   = 'waiting';
      room.error    = null;

      return code;
    } catch (err) {
      console.warn(`createRoom attempt ${i + 1} failed:`, err.code ?? err.message);
      if (i === 4) throw new Error('No se pudo crear la sala. Intentá de nuevo.');
    }
  }
}

export async function joinRoom(code, name) {
  const user = await ensureAuth();
  _uid  = user.uid;
  _slot = 'O';

  const snap = await get(ref(db, `rooms/${code}`));
  if (!snap.exists())                     throw new Error('Sala no encontrada');
  const data = snap.val();
  if (data.status !== 'waiting')          throw new Error('La sala ya está en juego');
  if (data.players?.O)                    throw new Error('La sala está llena');

  await update(ref(db, `rooms/${code}`), {
    'players/O': { uid: user.uid, name, connected: true, lastSeen: serverTimestamp() },
    status:      'playing',
    updatedAt:   serverTimestamp(),
  });

  _code = code;
  _setupPresence(code, 'O');
  _subscribe(code);

  game.mode   = 'online';
  game.names.O = name;
  room.code   = code;
  room.isHost = false;
  room.slot   = 'O';
  room.status = 'playing';
  room.error  = null;
}

export async function sendMove(idx) {
  if (!_code || !_slot || game.over || game.board[idx]) return;

  const r = applyMove(game.board, idx, _slot);
  if (!r.ok) return;

  const newScores = { ...game.scores };
  if (r.result === 'win') newScores[_slot]++;

  await update(ref(db, `rooms/${_code}`), {
    'game/board':        _boardToFB(r.board),
    'game/current':      r.nextTurn,
    'game/over':         r.over,
    'game/winningCombo': _comboToFB(r.winningCombo),
    'game/scores':       newScores,
    'game/lastMoveBy':   _uid,
    updatedAt:           serverTimestamp(),
  });
}

export async function nextRoundOnline() {
  if (!_code) return;

  // Loser goes first; draw → X goes first
  const nextCurrent = game.winningCombo
    ? (game.current === 'X' ? 'O' : 'X')
    : 'X';

  await update(ref(db, `rooms/${_code}`), {
    'game/board':        _boardToFB(Array(9).fill(null)),
    'game/current':      nextCurrent,
    'game/over':         false,
    'game/winningCombo': null,
    'game/round':        game.round + 1,
    'game/lastMoveBy':   null,
    updatedAt:           serverTimestamp(),
  });
}

export async function leaveRoom() {
  if (_code && _slot) {
    try {
      await update(ref(db, `rooms/${_code}/players/${_slot}`), {
        connected: false,
        lastSeen:  serverTimestamp(),
      });
    } catch (_) { /* ignore — might be offline */ }
  }

  if (_unsub)     { _unsub();     _unsub = null; }
  if (_infoUnsub) { _infoUnsub(); _infoUnsub = null; }

  _code = null;
  _slot = null;
  _uid  = null;

  game.mode  = 'local';
  room.slot  = null;
  room.code  = '';
  room.status = 'idle';
  room.error = null;
}
