import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { LanguageProvider } from '../i18n';

afterEach(() => localStorage.clear());

it('cambia el logotipo del login según el idioma seleccionado', () => {
  localStorage.setItem('language', 'en');
  render(
    <LanguageProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </LanguageProvider>
  );
  const logo = screen.getByAltText('Logo de Establo Horizonte');
  expect(logo.getAttribute('src')).toBe('/media/logo-establo-horizonte-en.png');
  fireEvent.change(screen.getByLabelText('Language'), {
    target: { value: 'fr' },
  });
  expect(logo.getAttribute('src')).toBe('/media/logo-establo-horizonte-fr.png');
  fireEvent.change(screen.getByLabelText('Langue'), {
    target: { value: 'es' },
  });
  expect(logo.getAttribute('src')).toBe('/media/logo-establo-horizonte.png');
});

it('no expone perfiles ni credenciales de demostración', () => {
  render(
    <LanguageProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </LanguageProvider>
  );
  expect(screen.queryByText('PERFILES DE DEMOSTRACIÓN')).toBeNull();
  expect(screen.getByLabelText('Correo electrónico').value).toBe('');
  expect(screen.getByLabelText('Contraseña').value).toBe('');
});
