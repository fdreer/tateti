export const screen = $state({ current: 'home' });

export const game = $state({
  mode: 'local',
  names: { X: 'JUGADOR 1', O: 'JUGADOR 2' },
  board: Array(9).fill(null),
  current: 'X',
  scores: { X: 0, O: 0 },
  round: 1,
  over: false,
  winningCombo: null,
});

export const room = $state({ code: '', isHost: false, status: 'idle' });

export function resetBoard() {
  game.board = Array(9).fill(null);
  game.current = 'X';
  game.over = false;
  game.winningCombo = null;
}

export function nextRound() {
  game.round++;
  resetBoard();
}

export function resetGame() {
  game.scores = { X: 0, O: 0 };
  game.round = 1;
  resetBoard();
}
