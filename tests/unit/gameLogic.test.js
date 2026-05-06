import { describe, it, expect } from 'vitest';
import { WIN_COMBOS, checkWinner, isDraw, generateCode } from '../../src/lib/gameLogic.js';

// ── checkWinner ───────────────────────────────────────────────────────────────

describe('checkWinner', () => {
  it.each(WIN_COMBOS)('detecta X ganando en combo %s', (a, b, c) => {
    const board = Array(9).fill(null);
    board[a] = 'X'; board[b] = 'X'; board[c] = 'X';
    expect(checkWinner(board)).toEqual([a, b, c]);
  });

  it.each(WIN_COMBOS)('detecta O ganando en combo %s', (a, b, c) => {
    const board = Array(9).fill(null);
    board[a] = 'O'; board[b] = 'O'; board[c] = 'O';
    expect(checkWinner(board)).toEqual([a, b, c]);
  });

  it('devuelve null para tablero vacío', () => {
    expect(checkWinner(Array(9).fill(null))).toBeNull();
  });

  it('devuelve null para tablero parcial sin ganador', () => {
    const board = [null, 'X', null, 'O', null, 'X', null, null, null];
    expect(checkWinner(board)).toBeNull();
  });

  it('devuelve null para tablero lleno sin ganador (empate)', () => {
    // X O X / O X O / O X O — sin línea ganadora
    const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
    expect(checkWinner(board)).toBeNull();
  });

  it('no detecta falso positivo: línea mixta X-O-X', () => {
    const board = ['X', 'O', 'X', null, null, null, null, null, null];
    expect(checkWinner(board)).toBeNull();
  });

  it('funciona con cadena vacía en lugar de null (formato Firebase)', () => {
    // El helper _boardFromFB convierte '' → null, pero si llega '' no debe ganar
    const board = ['', 'X', '', 'X', '', 'X', '', '', ''];
    // '' es falsy, la condición board[a] && ... falla → no detecta ganador
    expect(checkWinner(board)).toBeNull();
  });
});

// ── isDraw ─────────────────────────────────────────────────────────────────────

describe('isDraw', () => {
  it('devuelve true para tablero lleno sin ganador', () => {
    const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
    expect(isDraw(board)).toBe(true);
  });

  it('devuelve false cuando hay ganador aunque el tablero esté lleno', () => {
    // X X X en fila 0 → hay ganador, no empate
    const board = ['X', 'X', 'X', 'O', 'O', 'X', 'O', 'X', 'O'];
    expect(isDraw(board)).toBe(false);
  });

  it('devuelve false para tablero parcial', () => {
    const board = ['X', null, 'O', null, null, null, null, null, null];
    expect(isDraw(board)).toBe(false);
  });

  it('devuelve false para tablero vacío', () => {
    expect(isDraw(Array(9).fill(null))).toBe(false);
  });
});

// ── generateCode ──────────────────────────────────────────────────────────────

describe('generateCode', () => {
  const VALID_CHARS = new Set('ABCDEFGHJKLMNPQRSTUVWXYZ23456789');

  it('genera código de exactamente 5 caracteres', () => {
    expect(generateCode()).toHaveLength(5);
  });

  it('solo usa caracteres del set válido (sin I, O, 0, 1)', () => {
    for (let i = 0; i < 50; i++) {
      const code = generateCode();
      for (const ch of code) {
        expect(VALID_CHARS.has(ch)).toBe(true);
      }
    }
  });

  it('genera valores distintos en múltiples ejecuciones (distribución no constante)', () => {
    const codes = new Set(Array.from({ length: 100 }, generateCode));
    expect(codes.size).toBeGreaterThan(90);
  });
});
