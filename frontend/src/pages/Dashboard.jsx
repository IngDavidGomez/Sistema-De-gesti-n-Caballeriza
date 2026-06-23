import { useEffect, useState } from 'react';
import { api, authStore } from '../api';
import {
  PawPrint,
  Users,
  CalendarDays,
  TriangleAlert,
  ArrowRight,
  HeartPulse,
  ClipboardList,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

export default function Dashboard() {
  const [d, setD] = useState({
    horses: 0,
    employees: 0,
    reservations: 0,
    lowStock: 0,
    alerts: [],
  });
  const user = authStore.get();
  const { locale } = useI18n();
  useEffect(() => {
    api('/dashboard').then(setD);
  }, []);
  const cards = [
    [d.horses, 'Caballos registrados', PawPrint, '/caballos'],
    [
      d.employees,
      'Personal activo',
      Users,
      user?.role === 'ADMIN' ? '/personal' : '/',
    ],
    [d.reservations, 'Reservas totales', CalendarDays, '/reservas'],
    [d.lowStock, 'Stock bajo', TriangleAlert, '/inventario'],
  ];
  const date = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
  const quick = [
    [
      ['ADMIN', 'CAREGIVER'].includes(user?.role)
        ? 'Registrar caballo'
        : 'Ver caballos',
      '/caballos',
      PawPrint,
    ],
    ['Agendar reserva', '/reservas', CalendarDays],
    ...(['ADMIN', 'VETERINARIAN'].includes(user?.role)
      ? [['Añadir control médico', '/salud', HeartPulse]]
      : []),
    ...(['ADMIN', 'CAREGIVER'].includes(user?.role)
      ? [['Registrar suministro', '/suministros', ClipboardList]]
      : []),
  ];
  return (
    <>
      <div className="welcome">
        <video
          className="welcome-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/media/dashboard-horses.mp4" type="video/mp4" />
        </video>
        <div className="welcome-copy">
          <span>{date.toUpperCase()} · OPERACIÓN DIARIA</span>
          <h1>Buenos días, {user?.name?.split(' ')[0]}</h1>
          <p>Todo lo importante de su caballeriza, en un solo lugar.</p>
        </div>
        <div className="operation">
          <i>✓</i>
          <div>
            <b>Operación al día</b>
            <small>Servicios funcionando correctamente</small>
          </div>
        </div>
      </div>
      <div className="stats">
        {cards.map(([n, t, I, l], index) => (
          <Link to={l} className={`stat stat-${index + 1}`} key={t}>
            <I />
            <div>
              <strong>{n}</strong>
              <span>{t}</span>
            </div>
            <ArrowRight size={18} />
          </Link>
        ))}
      </div>
      <div className="grid-2">
        <div className="panel card">
          <div className="card-title">
            <div>
              <span>SEGUIMIENTO</span>
              <h2>Alertas y notificaciones</h2>
            </div>
            <Link to="/inventario">Ver detalles</Link>
          </div>
          {d.alerts.map((a, i) => (
            <div
              className={`alert ${a.type === 'STOCK' ? 'stock' : 'health'}`}
              key={i}
            >
              <TriangleAlert />
              <div>
                <b>{a.title || 'Alerta'}</b>
                <p>{a.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="panel card">
          <div className="card-title">
            <div>
              <span>GESTIÓN</span>
              <h2>Accesos rápidos</h2>
            </div>
          </div>
          <div className="quick">
            {quick.map(([title, path, Icon]) => (
              <Link to={path} key={title}>
                <Icon />
                {title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
