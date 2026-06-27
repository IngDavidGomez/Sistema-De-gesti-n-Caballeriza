import { useEffect, useRef, useState } from 'react';

const SCRIPT_ID = 'google-identity-services';

function loadGoogleIdentity() {
  if (window.google?.accounts?.id) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const current = document.getElementById(SCRIPT_ID);
    if (current) {
      current.addEventListener('load', resolve, { once: true });
      current.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function GoogleSignInButton({
  onCredential,
  onError,
  language = 'es',
  disabled = false,
  clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID,
}) {
  const container = useRef(null);
  const [available, setAvailable] = useState(Boolean(clientId));

  useEffect(() => {
    if (!clientId) return undefined;
    let active = true;
    loadGoogleIdentity()
      .then(() => {
        if (!active || !container.current) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: ({ credential }) => onCredential(credential),
          cancel_on_tap_outside: true,
        });
        container.current.replaceChildren();
        window.google.accounts.id.renderButton(container.current, {
          type: 'standard',
          theme: document.documentElement.dataset.theme === 'dark' ? 'filled_black' : 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: Math.min(container.current.clientWidth || 360, 400),
          locale: language,
        });
        setAvailable(true);
      })
      .catch(() => {
        if (active) {
          setAvailable(false);
          onError?.(new Error('No fue posible cargar el acceso con Google'));
        }
      });
    return () => {
      active = false;
    };
  }, [clientId, language, onCredential, onError]);

  if (!clientId || !available) return null;
  return (
    <div
      className={`google-signin ${disabled ? 'disabled' : ''}`}
      ref={container}
      aria-label="Continuar con Google"
    />
  );
}
