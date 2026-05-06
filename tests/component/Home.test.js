import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { game } from '../../src/lib/state.svelte.js';

// vi.mock es hoisted — no puede referenciar variables declaradas con const/let fuera
vi.mock('../../src/lib/router.svelte.js', () => ({ navigate: vi.fn() }));

// Importamos el mock ya inicializado para poder inspeccionarlo
import { navigate } from '../../src/lib/router.svelte.js';

import Home from '../../src/routes/Home.svelte';

beforeEach(() => {
  vi.mocked(navigate).mockClear();
  game.names = { X: 'JUGADOR 1', O: 'JUGADOR 2' };
  game.mode  = 'local';
});

describe('Home — input de nombre', () => {
  it('acepta texto en el input', async () => {
    render(Home);
    const input = screen.getByRole('textbox');
    await fireEvent.input(input, { target: { value: 'JUGADOR 1' } });
    expect(input.value).toBe('JUGADOR 1');
  });
});

describe('Home — botón "Jugar acá"', () => {
  it('usa nombre por defecto cuando el input está vacío', async () => {
    render(Home);
    await fireEvent.click(screen.getByText(/Jugar acá/));
    expect(game.names.X).toBe('JUGADOR 1');
  });

  it('navega a /game al hacer click', async () => {
    render(Home);
    await fireEvent.click(screen.getByText(/Jugar acá/));
    expect(navigate).toHaveBeenCalledWith('/game');
  });

  it('mode queda como local', async () => {
    render(Home);
    await fireEvent.click(screen.getByText(/Jugar acá/));
    expect(game.mode).toBe('local');
  });
});

describe('Home — botón "Jugar online"', () => {
  it('navega a /online', async () => {
    render(Home);
    await fireEvent.click(screen.getByText(/Jugar online/));
    expect(navigate).toHaveBeenCalledWith('/online');
  });
});
