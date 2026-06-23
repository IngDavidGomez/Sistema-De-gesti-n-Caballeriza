import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { api } from '../api';
import LoginHero from '../components/LoginHero';
import { LanguageSelector } from '../i18n';

export default function PasswordRecovery({ reset = false }) {
  const [params] = useSearchParams(),
    [form, setForm] = useState({ email: '', password: '', confirm: '' }),
    [message, setMessage] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setError('');
    if (reset && form.password !== form.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setBusy(true);
    try {
      const body = reset
        ? { token: params.get('token') || '', password: form.password }
        : { email: form.email };
      const data = await api(
        reset ? '/auth/reset-password' : '/auth/forgot-password',
        { method: 'POST', body: JSON.stringify(body) }
      );
      setMessage(data.message);
    } catch (reason) {
      setError(reason.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="login">
      <LoginHero
        eyebrow="SEGURIDAD DE LA CUENTA"
        title={
          <>
            Recupere el acceso
            <br />
            de forma segura.
          </>
        }
        description="Los enlaces son personales y vencen automáticamente."
      />
      <form className="login-card recovery-card" onSubmit={submit}>
        <LanguageSelector className="login-language" />
        <div className="login-logo">
          {reset ? <KeyRound size={21} /> : <Mail size={21} />}
        </div>
        <h2>{reset ? 'Nueva contraseña' : 'Recuperar acceso'}</h2>
        <p>
          {reset
            ? 'Cree una contraseña segura para su cuenta.'
            : 'Le enviaremos un enlace si el correo está registrado.'}
        </p>
        {error && <div className="form-error">{error}</div>}
        {message ? (
          <div className="form-success">{message}</div>
        ) : (
          <>
            {reset ? (
              <>
                <label>
                  Nueva contraseña
                  <input
                    type="password"
                    minLength="8"
                    maxLength="128"
                    value={form.password}
                    onChange={(event) =>
                      setForm({ ...form, password: event.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Confirmar contraseña
                  <input
                    type="password"
                    minLength="8"
                    maxLength="128"
                    value={form.confirm}
                    onChange={(event) =>
                      setForm({ ...form, confirm: event.target.value })
                    }
                    required
                  />
                </label>
              </>
            ) : (
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
            )}
            <button className="primary wide" disabled={busy}>
              {busy
                ? 'Procesando...'
                : reset
                  ? 'Actualizar contraseña'
                  : 'Enviar instrucciones'}
            </button>
          </>
        )}
        <Link className="auth-switch recovery-back" to="/login">
          Volver al inicio de sesión
        </Link>
        <small className="secure">
          <ShieldCheck size={16} /> Enlace cifrado y válido por 30 minutos
        </small>
      </form>
    </div>
  );
}
