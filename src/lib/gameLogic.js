export const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

export const WIN_LINES = {
  '0,1,2': [8,17,92,17], '3,4,5': [8,50,92,50], '6,7,8': [8,83,92,83],
  '0,3,6': [17,8,17,92], '1,4,7': [50,8,50,92], '2,5,8': [83,8,83,92],
  '0,4,8': [8,8,92,92],  '2,4,6': [92,8,8,92],
};

/** @param {(string|null)[]} board @returns {number[]|null} */
export function checkWinner(board) {
  for (const [a, b, c] of WIN_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [a, b, c];
    }
  }
  return null;
}

/** @param {(string|null)[]} board @returns {boolean} */
export function isDraw(board) {
  return board.every(c => c !== null) && !checkWinner(board);
}

/** @returns {string} */
export function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 5 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}
