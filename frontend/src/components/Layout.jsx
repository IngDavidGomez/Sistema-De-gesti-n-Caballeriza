import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PawPrint,
  CalendarDays,
  Users,
  Package,
  HeartPulse,
  Wheat,
  LogOut,
  Menu,
  X,
  Bell,
  ShieldCheck,
  Sun,
  Moon,
  ClipboardList,
  ScrollText,
  CheckCheck,
  BarChart3,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { api, authStore } from '../api';
import { LanguageSelector, useI18n } from '../i18n';

const links = [
  ['/', 'Resumen', LayoutDashboard],
  ['/caballos', 'Caballos', PawPrint],
  ['/salud', 'Historial médico', HeartPulse],
  ['/reservas', 'Agenda', CalendarDays],
  ['/alimentacion', 'Alimentación', Wheat],
  ['/inventario', 'Inventario', Package],
  ['/suministros', 'Suministros', ClipboardList],
  ['/reportes', 'Reportes', BarChart3],
  ['/personal', 'Personal', Users],
  ['/auditoria', 'Auditoría del sistema', ScrollText],
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false),
    [theme, setTheme] = useState(
      () => localStorage.getItem('theme') || 'light'
    ),
    [tray, setTray] = useState(false),
    [notifications, setNotifications] = useState([]);
  const user = authStore.get(),
    nav = useNavigate();
  const { t, locale } = useI18n();
  const loadNotifications = () =>
    api('/notifications')
      .then(setNotifications)
      .catch(() => {});
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);
  useEffect(() => {
    loadNotifications();
  }, []);
  const visibleLinks = links
    .filter(
      ([path]) =>
        !['/personal', '/auditoria'].includes(path) || user?.role === 'ADMIN'
    )
    .filter(
      ([path]) =>
        path != '/salud' || ['ADMIN', 'VETERINARIAN'].includes(user?.role)
    )
    .filter(
      ([path]) =>
        !['/alimentacion', '/suministros'].includes(path) ||
        ['ADMIN', 'CAREGIVER'].includes(user?.role)
    );
  const roleLinks = visibleLinks.filter(
    ([path]) =>
      path != '/reportes' ||
      ['ADMIN', 'CAREGIVER', 'VETERINARIAN'].includes(user?.role)
  );
  async function markRead(notification) {
    if (!notification.read) {
      await api(`/notifications/${notification.id}/read`, { method: 'PATCH' });
      loadNotifications();
    }
  }
  async function markAll() {
    await api('/notifications/read-all', { method: 'PATCH' });
    loadNotifications();
  }
  const unread = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div className="shell">
      <aside className={open ? 'open' : ''}>
        <div className="brand">
          <span className="brand-logo">
            <img
              src="/media/logo-establo-horizonte.png"
              alt="Logo de Establo Horizonte"
            />
          </span>
          <div>
            Establo Horizonte<small>{t('Gestión ecuestre')}</small>
          </div>
        </div>
        <nav>
          <p className="nav-label">{t('MENÚ PRINCIPAL')}</p>
          {roleLinks.map(([path, title, Icon]) => (
            <NavLink key={path} to={path} onClick={() => setOpen(false)}>
              <Icon size={19} />
              <span>{t(title)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="profile">
          <div className="avatar">{user?.name?.[0]}</div>
          <div>
            <b>{user?.name}</b>
            <small>
              {t(
                user?.role === 'ADMIN'
                  ? 'Administrador'
                  : user?.role === 'CAREGIVER'
                    ? 'Cuidador'
                    : user?.role === 'VETERINARIAN'
                      ? 'Veterinario'
                      : 'Cliente'
              )}
            </small>
          </div>
          <button
            aria-label={t('Cerrar sesión')}
            onClick={() => {
              authStore.clear();
              nav('/login');
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      {open ? (
        <button
          className="sidebar-backdrop"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <main>
        <header>
          <button
            className="menu"
            aria-label={t('Abrir menú')}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <div className="topbar-title">
            <b>{t('Panel de administración')}</b>
            <small>{t('Control integral de la caballeriza')}</small>
          </div>
          <div className="header-actions">
            <span className="status">
              <ShieldCheck size={15} /> Ing_JonathanG
            </span>
            <LanguageSelector />
            <button
              className={`theme-toggle ${theme}`}
              aria-label={t(
                theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'
              )}
              onClick={() =>
                setTheme((value) => (value === 'light' ? 'dark' : 'light'))
              }
            >
              <Sun className={theme === 'light' ? 'active' : ''} size={16} />
              <Moon className={theme === 'dark' ? 'active' : ''} size={15} />
            </button>
            <button
              className="notification"
              aria-label={t('Notificaciones')}
              onClick={() => {
                setTray(!tray);
                if (!tray) loadNotifications();
              }}
            >
              <Bell size={19} />
              {unread > 0 ? (
                <strong>{unread > 9 ? '9+' : unread}</strong>
              ) : null}
            </button>
          </div>
          {tray ? (
            <div className="notification-tray">
              <div className="tray-head">
                <div>
                  <span>{t('ALERTAS')}</span>
                  <h3>{t('Notificaciones')}</h3>
                </div>
                <button onClick={markAll}>
                  <CheckCheck />
                  {t('Marcar leídas')}
                </button>
              </div>
              <div className="tray-list">
                {notifications.length ? (
                  notifications.map((notification) => (
                    <button
                      className={notification.read ? 'read' : ''}
                      key={notification.id}
                      onClick={() => markRead(notification)}
                    >
                      <i className={notification.category.toLowerCase()} />
                      <div>
                        <b>{t(notification.title)}</b>
                        <p>{notification.message}</p>
                        <small>
                          {new Date(notification.createdAt).toLocaleString(
                            locale
                          )}
                        </small>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="tray-empty">{t('No hay alertas activas.')}</p>
                )}
              </div>
            </div>
          ) : null}
        </header>
        <section className="content">{children}</section>
      </main>
    </div>
  );
}
