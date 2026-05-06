import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { game } from '../../src/lib/state.svelte.js';

vi.mock('../../src/lib/router.svelte.js', () => ({ navigate: vi.fn() }));

import ResultModal from '../../src/components/ResultModal.svelte';

beforeEach(() => {
  game.names  = { X: 'ANA', O: 'BOB' };
  game.scores = { X: 2, O: 1 };
});

// ── Render resultado win ───────────────────────────────────────────────────────

describe('ResultModal — win', () => {
  it('muestra el nombre del ganador en el título', () => {
    render(ResultModal, { props: { result: 'win', winnerName: 'ANA' } });
    expect(screen.getByRole('heading')).toHaveTextContent('¡ANA GANÓ!');
  });

  it('muestra el marcador con los nombres correctos', () => {
    render(ResultModal, { props: { result: 'win', winnerName: 'ANA' } });
    expect(screen.getByText(/ANA.*BOB|BOB.*ANA/)).toBeInTheDocument();
  });

  it('muestra el marcador con los scores', () => {
    render(ResultModal, { props: { result: 'win', winnerName: 'ANA' } });
    expect(screen.getByText(/2.*1|1.*2/)).toBeInTheDocument();
  });
});

// ── Render resultado draw ─────────────────────────────────────────────────────

describe('ResultModal — draw', () => {
  it('muestra EMPATE en el título', () => {
    render(ResultModal, { props: { result: 'draw' } });
    expect(screen.getByRole('heading')).toHaveTextContent('EMPATE');
  });

  it('muestra texto de empate en el cuerpo', () => {
    render(ResultModal, { props: { result: 'draw' } });
    expect(screen.getByText(/nadie gana/i)).toBeInTheDocument();
  });
});

// ── Callbacks ─────────────────────────────────────────────────────────────────

describe('ResultModal — callbacks', () => {
  it('click en "Jugar otra" invoca onNextRound', async () => {
    const onNextRound = vi.fn();
    render(ResultModal, { props: { result: 'win', winnerName: 'ANA', onNextRound } });
    await fireEvent.click(screen.getByText(/Jugar otra/));
    expect(onNextRound).toHaveBeenCalledOnce();
  });

  it('click en "Salir" invoca onExit', async () => {
    const onExit = vi.fn();
    render(ResultModal, { props: { result: 'win', winnerName: 'ANA', onExit } });
    await fireEvent.click(screen.getByText(/Salir/));
    expect(onExit).toHaveBeenCalledOnce();
  });
});
