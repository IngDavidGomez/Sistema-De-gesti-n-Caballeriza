import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, authStore } from '../api';
import { ShieldCheck } from 'lucide-react';
import LoginHero from '../components/LoginHero';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { LanguageSelector, useI18n } from '../i18n';

const LOGIN_LOGOS = {
  es: '/media/logo-establo-horizonte.png',
  en: '/media/logo-establo-horizonte-en.png',
  fr: '/media/logo-establo-horizonte-fr.png',
};

export default function Login() {
  const { language } = useI18n();
  const [form, setForm] = useState({ email: '', password: '' }),
    [mode, setMode] = useState('login'),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const nav = useNavigate();
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await api(
        mode === 'login' ? '/auth/login' : '/auth/register',
        { method: 'POST', body: JSON.stringify(form) }
      );
      authStore.set(data);
      nav('/');
    } catch (reason) {
      setError(reason.message);
    } finally {
      setBusy(false);
    }
  }
  const googleLogin = useCallback(async (credential) => {
    setBusy(true);
    setError('');
    try {
      const data = await api('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential }),
      });
      authStore.set(data);
      nav('/');
    } catch (reason) {
      setError(reason.message);
    } finally {
      setBusy(false);
    }
  }, [nav]);
  const googleError = useCallback((reason) => setError(reason.message), []);
  function switchMode() {
    setError('');
    setMode(mode === 'login' ? 'register' : 'login');
    setForm({ name: '', email: '', password: '' });
  }

  return (
    <div className="login">
      <LoginHero
        eyebrow="GESTIÓN ECUESTRE"
        title={
          <>
            Cuidado excepcional,
            <br />
            gestión inteligente.
          </>
        }
        description="Todo lo que su caballeriza necesita en un solo lugar."
      />
      <form className="login-card" onSubmit={submit}>
        <LanguageSelector className="login-language" />
        <div className="login-logo login-brand-logo">
          <img
            src={LOGIN_LOGOS[language] || LOGIN_LOGOS.es}
            alt="Logo de Establo Horizonte"
          />
        </div>
        <h2>{mode === 'login' ? 'Bienvenido' : 'Crear cuenta'}</h2>
        <p>
          {mode === 'login'
            ? 'Ingrese sus credenciales para continuar'
            : 'Regístrese como cliente de la caballeriza'}
        </p>
        {error && <div className="form-error">{error}</div>}
        {mode === 'register' && (
          <label>
            Nombre completo
            <input
              value={form.name || ''}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              required
            />
          </label>
        )}
        <label>
          Correo electrónico
          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
            required
            minLength="8"
          />
        </label>
        {mode === 'login' && (
          <Link className="forgot-link" to="/olvide-contrasena">
            ¿Olvidó su contraseña?
          </Link>
        )}
        <button className="primary wide" disabled={busy}>
          {busy
            ? 'Procesando...'
            : mode === 'login'
              ? 'Iniciar sesión'
              : 'Crear cuenta'}
        </button>
        {mode === 'login' && (
          <>
            <div className="auth-divider"><span>o</span></div>
            <GoogleSignInButton
              onCredential={googleLogin}
              onError={googleError}
              language={language}
              disabled={busy}
            />
          </>
        )}
        <button className="auth-switch" type="button" onClick={switchMode}>
          {mode === 'login'
            ? '¿No tiene cuenta? Registrarse'
            : '¿Ya tiene cuenta? Iniciar sesión'}
        </button>
        <small className="secure">
          <ShieldCheck size={16} /> Acceso protegido mediante JWT
        </small>
      </form>
    </div>
  );
}
