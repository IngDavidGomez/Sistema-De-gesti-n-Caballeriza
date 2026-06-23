import { act, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import LoginHero from './LoginHero';
afterEach(() => vi.useRealTimers());
it('cambia automáticamente la imagen cada cinco segundos', () => {
  vi.useFakeTimers();
  const { container } = render(
    <LoginHero eyebrow="Prueba" title="Título" description="Descripción" />
  );
  expect(
    container.querySelector('.login-slide.active').style.backgroundImage
  ).toContain('aurora.png');
  act(() => vi.advanceTimersByTime(5000));
  expect(
    container.querySelector('.login-slide.active').style.backgroundImage
  ).toContain('relampago.png');
});
