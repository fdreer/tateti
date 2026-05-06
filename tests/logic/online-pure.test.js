import { describe, it, expect, vi, beforeEach } from 'vitest';

// firebase.js se mockeó globalmente en setup.js (firebase/app, firebase/database, firebase/auth)
// Acá necesitamos mockear el módulo local firebase.js que online.svelte.js importa
vi.mock('../../src/lib/firebase.js', () => ({
  db: {},
  ensureAuth: vi.fn(() => Promise.resolve({ uid: 'test-uid' })),
}));

// router.svelte.js también es necesario para que online.svelte.js cargue
vi.mock('../../src/lib/router.svelte.js', () => ({
  navigate: vi.fn(),
}));

import { _internal } from '../../src/lib/online.svelte.js';
import { game } from '../../src/lib/state.svelte.js';

const { _boardToFB, _boardFromFB, _comboToFB, _comboFromFB, _mapToState } = _internal;

// ── _boardToFB / _boardFromFB round-trip ──────────────────────────────────────

describe('_boardToFB + _boardFromFB', () => {
  it('convierte board a objeto Firebase y vuelve al array original', () => {
    const board = ['X', null, 'O', null, 'X', null, null, 'O', null];
    const fb    = _boardToFB(board);
    expect(_boardFromFB(fb)).toEqual(board);
  });

  it('representa null como string vacío en Firebase', () => {
    const fb = _boardToFB([null, 'X', null]);
    expect(fb[0]).toBe('');
    expect(fb[1]).toBe('X');
    expect(fb[2]).toBe('');
  });

  it('_boardFromFB convierte cadena vacía a null', () => {
    const fb = { 0: '', 1: 'X', 2: '', 3: 'O', 4: '', 5: '', 6: '', 7: '', 8: '' };
    const board = _boardFromFB(fb);
    expect(board[0]).toBeNull();
    expect(board[1]).toBe('X');
    expect(board[3]).toBe('O');
  });

  it('_boardFromFB con null devuelve tablero vacío', () => {
    expect(_boardFromFB(null)).toEqual(Array(9).fill(null));
  });

  it('tablero vacío round-trip', () => {
    const board = Array(9).fill(null);
    expect(_boardFromFB(_boardToFB(board))).toEqual(board);
  });
});

// ── _comboToFB / _comboFromFB round-trip ──────────────────────────────────────

describe('_comboToFB + _comboFromFB', () => {
  it('convierte combo a objeto Firebase y vuelve al array original', () => {
    const combo = [0, 4, 8];
    expect(_comboFromFB(_comboToFB(combo))).toEqual(combo);
  });

  it('_comboToFB con null devuelve null', () => {
    expect(_comboToFB(null)).toBeNull();
  });

  it('_comboFromFB con null devuelve null', () => {
    expect(_comboFromFB(null)).toBeNull();
  });
});

// ── _mapToState ───────────────────────────────────────────────────────────────

describe('_mapToState', () => {
  beforeEach(() => {
    game.board        = Array(9).fill(null);
    game.current      = 'X';
    game.round        = 1;
    game.scores       = { X: 0, O: 0 };
    game.over         = false;
    game.winningCombo = null;
    game.names        = { X: 'JUGADOR 1', O: 'JUGADOR 2' };
  });

  it('mapea datos remotos al estado local', () => {
    const data = {
      game: {
        board:   { 0: 'X', 1: '', 2: 'O', 3: '', 4: 'X', 5: '', 6: '', 7: '', 8: '' },
        current: 'O',
        round:   2,
        scores:  { X: 1, O: 0 },
        over:    false,
        winningCombo: null,
      },
    };
    _mapToState(data);
    expect(game.current).toBe('O');
    expect(game.round).toBe(2);
    expect(game.scores).toEqual({ X: 1, O: 0 });
    expect(game.board[0]).toBe('X');
    expect(game.board[1]).toBeNull();
  });

  it('mapea names de players cuando están presentes', () => {
    const data = {
      game: { board: {}, current: 'X', round: 1, scores: { X: 0, O: 0 }, over: false, winningCombo: null },
      players: { X: { name: 'ANA' }, O: { name: 'BOB' } },
    };
    _mapToState(data);
    expect(game.names.X).toBe('ANA');
    expect(game.names.O).toBe('BOB');
  });

  it('no falla con data null/undefined', () => {
    expect(() => _mapToState(null)).not.toThrow();
    expect(() => _mapToState(undefined)).not.toThrow();
  });
});
