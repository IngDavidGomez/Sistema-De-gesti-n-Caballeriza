import { render, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import GoogleSignInButton from './GoogleSignInButton';

afterEach(() => { delete window.google; });

it('inicializa Google Identity Services con el client ID configurado', async () => {
  const initialize=vi.fn(), renderButton=vi.fn((element)=>element.appendChild(document.createElement('button')));
  window.google={accounts:{id:{initialize,renderButton}}};
  render(<GoogleSignInButton clientId="client.apps.googleusercontent.com" onCredential={()=>{}} />);
  await waitFor(()=>expect(initialize).toHaveBeenCalled());
  expect(initialize.mock.calls[0][0].client_id).toBe('client.apps.googleusercontent.com');
  expect(renderButton).toHaveBeenCalled();
});

it('no muestra un botón incompleto cuando falta configuración', () => {
  const { container }=render(<GoogleSignInButton clientId="" onCredential={()=>{}} />);
  expect(container.innerHTML).toBe('');
});
