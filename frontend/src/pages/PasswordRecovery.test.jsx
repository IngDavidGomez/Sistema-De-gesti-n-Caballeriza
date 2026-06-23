import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PasswordRecovery from './PasswordRecovery';
vi.mock('../api', () => ({ api: vi.fn(), assetUrl: (value) => value }));
import { api } from '../api';
describe('PasswordRecovery', () => {
  beforeEach(() => vi.clearAllMocks());
  it('solicita instrucciones sin revelar la existencia de la cuenta', async () => {
    api.mockResolvedValue({
      message: 'Si el correo está registrado, recibirá instrucciones',
    });
    render(
      <MemoryRouter>
        <PasswordRecovery />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'ana@test.com' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Enviar instrucciones' })
    );
    await waitFor(() =>
      expect(api).toHaveBeenCalledWith(
        '/auth/forgot-password',
        expect.objectContaining({ method: 'POST' })
      )
    );
    expect(
      await screen.findByText(/Si el correo está registrado/)
    ).toBeTruthy();
  });
  it('valida que las contraseñas coincidan', () => {
    render(
      <MemoryRouter initialEntries={['/restablecer-contrasena?token=abc']}>
        <PasswordRecovery reset />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText('Nueva contraseña'), {
      target: { value: 'Nueva123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), {
      target: { value: 'Distinta123!' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Actualizar contraseña' })
    );
    expect(screen.getByText('Las contraseñas no coinciden')).toBeTruthy();
    expect(api).not.toHaveBeenCalled();
  });
});
