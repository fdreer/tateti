import { describe, it, expect, beforeEach } from 'vitest';
import { game, room, resetBoard, nextRound, resetGame } from '../../src/lib/state.svelte.js';

function dirtyState() {
  game.board        = ['X', 'O', null, null, 'X', null, null, null, 'O'];
  game.current      = 'O';
  game.over         = true;
  game.winningCombo = [0, 4, 8];
  game.scores       = { X: 3, O: 1 };
  game.round        = 5;
}

beforeEach(dirtyState);

// ── resetBoard ────────────────────────────────────────────────────────────────

describe('resetBoard', () => {
  it('limpia el tablero a 9 nulls', () => {
    resetBoard();
    expect(game.board).toEqual(Array(9).fill(null));
  });

  it('restaura current a X', () => {
    resetBoard();
    expect(game.current).toBe('X');
  });

  it('pone over en false', () => {
    resetBoard();
    expect(game.over).toBe(false);
  });

  it('pone winningCombo en null', () => {
    resetBoard();
    expect(game.winningCombo).toBeNull();
  });

  it('preserva scores sin cambiarlos', () => {
    const scoresBefore = { ...game.scores };
    resetBoard();
    expect(game.scores).toEqual(scoresBefore);
  });

  it('preserva round sin cambiarlo', () => {
    const roundBefore = game.round;
    resetBoard();
    expect(game.round).toBe(roundBefore);
  });
});

// ── nextRound ─────────────────────────────────────────────────────────────────

describe('nextRound', () => {
  it('incrementa round en 1', () => {
    const before = game.round;
    nextRound();
    expect(game.round).toBe(before + 1);
  });

  it('resetea el tablero', () => {
    nextRound();
    expect(game.board).toEqual(Array(9).fill(null));
    expect(game.current).toBe('X');
    expect(game.over).toBe(false);
    expect(game.winningCombo).toBeNull();
  });

  it('preserva los scores', () => {
    const scoresBefore = { X: game.scores.X, O: game.scores.O };
    nextRound();
    expect(game.scores).toEqual(scoresBefore);
  });
});

// ── resetGame ─────────────────────────────────────────────────────────────────

describe('resetGame', () => {
  it('resetea scores a 0-0', () => {
    resetGame();
    expect(game.scores).toEqual({ X: 0, O: 0 });
  });

  it('resetea round a 1', () => {
    resetGame();
    expect(game.round).toBe(1);
  });

  it('resetea el tablero', () => {
    resetGame();
    expect(game.board).toEqual(Array(9).fill(null));
    expect(game.current).toBe('X');
    expect(game.over).toBe(false);
    expect(game.winningCombo).toBeNull();
  });
});

// ── Estado inicial ────────────────────────────────────────────────────────────

describe('forma del estado', () => {
  it('game tiene todos los campos esperados', () => {
    expect(game).toMatchObject({
      mode: expect.any(String),
      names: { X: expect.any(String), O: expect.any(String) },
      board: expect.any(Array),
      current: expect.stringMatching(/^[XO]$/),
      scores: { X: expect.any(Number), O: expect.any(Number) },
      round: expect.any(Number),
      over: expect.any(Boolean),
    });
    expect(game.board).toHaveLength(9);
  });

  it('room tiene todos los campos esperados', () => {
    expect(room).toMatchObject({
      code: expect.any(String),
      isHost: expect.any(Boolean),
      status: expect.any(String),
    });
  });
});
