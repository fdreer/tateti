import { describe, it, expect } from 'vitest';
import { applyMove } from '../../src/lib/gameLogic.js';

const empty = () => Array(9).fill(null);

// ── Validación ─────────────────────────────────────────────────────────────────

describe('applyMove — celda ocupada', () => {
  it('rechaza movimiento en celda con X', () => {
    const board = empty();
    board[4] = 'X';
    const r = applyMove(board, 4, 'O');
    expect(r.ok).toBe(false);
    expect(r.reason).toBe('occupied');
  });

  it('rechaza movimiento en celda con O', () => {
    const board = empty();
    board[0] = 'O';
    const r = applyMove(board, 0, 'X');
    expect(r.ok).toBe(false);
    expect(r.reason).toBe('occupied');
  });
});

// ── Movimiento válido sin ganar ────────────────────────────────────────────────

describe('applyMove — movimiento normal', () => {
  it('retorna ok:true y actualiza el tablero', () => {
    const board = empty();
    const r = applyMove(board, 4, 'X');
    expect(r.ok).toBe(true);
    expect(r.board[4]).toBe('X');
  });

  it('alterna el turno de X → O', () => {
    const r = applyMove(empty(), 0, 'X');
    expect(r.nextTurn).toBe('O');
  });

  it('alterna el turno de O → X', () => {
    const r = applyMove(empty(), 0, 'O');
    expect(r.nextTurn).toBe('X');
  });

  it('no marca over ni result', () => {
    const r = applyMove(empty(), 3, 'X');
    expect(r.over).toBe(false);
    expect(r.result).toBeNull();
    expect(r.winningCombo).toBeNull();
  });

  it('no muta el tablero original', () => {
    const board = empty();
    const snapshot = [...board];
    applyMove(board, 5, 'X');
    expect(board).toEqual(snapshot);
  });
});

// ── Movimiento ganador ────────────────────────────────────────────────────────

describe('applyMove — movimiento ganador', () => {
  it('detecta victoria y retorna over:true, result:win', () => {
    // X gana en fila 0: posiciones 0,1 ya ocupadas, pone 2
    const board = [null, 'X', 'X', null, null, null, null, null, null];
    board[1] = 'X'; board[2] = 'X'; // ya puestos arriba
    const b = empty();
    b[1] = 'X'; b[2] = 'X';
    const r = applyMove(b, 0, 'X');
    expect(r.ok).toBe(true);
    expect(r.over).toBe(true);
    expect(r.result).toBe('win');
    expect(r.winningCombo).toEqual([0, 1, 2]);
  });

  it('nextTurn queda como el ganador (no alterna)', () => {
    const b = empty();
    b[1] = 'X'; b[2] = 'X';
    const r = applyMove(b, 0, 'X');
    expect(r.nextTurn).toBe('X');
  });

  it('detecta victoria en columna', () => {
    const b = empty();
    b[0] = 'O'; b[3] = 'O';
    const r = applyMove(b, 6, 'O');
    expect(r.over).toBe(true);
    expect(r.winningCombo).toEqual([0, 3, 6]);
  });

  it('detecta victoria en diagonal', () => {
    const b = empty();
    b[0] = 'X'; b[4] = 'X';
    const r = applyMove(b, 8, 'X');
    expect(r.over).toBe(true);
    expect(r.winningCombo).toEqual([0, 4, 8]);
  });
});

// ── Empate ────────────────────────────────────────────────────────────────────

describe('applyMove — empate', () => {
  it('detecta empate y retorna over:true, result:draw, sin winningCombo', () => {
    // Tablero a punto de empatar: 8 celdas llenas, última celda libre (idx 8)
    // X O X / O X O / O X ?   → último movimiento es O en idx 8 → empate
    const b = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null];
    const r = applyMove(b, 8, 'O');
    expect(r.ok).toBe(true);
    expect(r.over).toBe(true);
    expect(r.result).toBe('draw');
    expect(r.winningCombo).toBeNull();
  });

  it('nextTurn queda en current al empatar', () => {
    const b = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null];
    const r = applyMove(b, 8, 'O');
    expect(r.nextTurn).toBe('O');
  });
});
