import { useEffect, useMemo, useState } from 'react';
import { api, authStore } from '../api';
import {
  PageHeader,
  DataTable,
  Modal,
  Field,
  Select,
  Toast,
} from '../components/UI';
import {
  Ban,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  List,
  Pencil,
} from 'lucide-react';
import { useI18n } from '../i18n';

const blank = {
  horseId: '',
  startAt: '',
  endAt: '',
  activityType: 'MONTA',
  responsible: '',
  status: 'SCHEDULED',
  observations: '',
  capacity: 1,
  participants: 1,
};
const activityNames = {
  MONTA: 'Monta',
  PASEO: 'Paseo',
  ENTRENAMIENTO: 'Entrenamiento',
  VETERINARIA: 'Cita veterinaria',
};

function CalendarView({ rows, month, onMonth }) {
  const { locale, language } = useI18n(),
    year = month.getFullYear(),
    monthIndex = month.getMonth();
  const leading = (new Date(year, monthIndex, 1).getDay() + 6) % 7,
    total = new Date(year, monthIndex + 1, 0).getDate(),
    cells = Array.from({ length: leading + total }, (_, index) =>
      index < leading ? null : index - leading + 1
    );
  const weekdays = {
    es: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fr: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  }[language];
  return (
    <div className="calendar panel">
      <div className="calendar-head">
        <button
          aria-label="Mes anterior"
          onClick={() => onMonth(new Date(year, monthIndex - 1, 1))}
        >
          <ChevronLeft />
        </button>
        <h2>
          {new Intl.DateTimeFormat(locale, {
            month: 'long',
            year: 'numeric',
          }).format(month)}
        </h2>
        <button
          aria-label="Mes siguiente"
          onClick={() => onMonth(new Date(year, monthIndex + 1, 1))}
        >
          <ChevronRight />
        </button>
      </div>
      <div className="calendar-grid weekdays">
        {weekdays.map((day) => (
          <b key={day}>{day}</b>
        ))}
      </div>
      <div className="calendar-grid">
        {cells.map((day, index) => {
          const events = day
            ? rows.filter((row) => {
                const eventDate = new Date(row.startAt);
                return (
                  eventDate.getFullYear() === year &&
                  eventDate.getMonth() === monthIndex &&
                  eventDate.getDate() === day
                );
              })
            : [];
          return (
            <div className={`calendar-day ${!day ? 'muted' : ''}`} key={index}>
              {day && <span>{day}</span>}
              {events.map((event) => (
                <article
                  className={event.status === 'CANCELLED' ? 'cancelled' : ''}
                  key={event.id}
                >
                  <b>
                    {new Date(event.startAt).toLocaleTimeString(locale, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </b>
                  <small>
                    {event.horseName} · {activityNames[event.activityType]}
                  </small>
                </article>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Reservations() {
  const [rows, setRows] = useState([]),
    [horses, setHorses] = useState([]),
    [form, setForm] = useState(null),
    [msg, setMsg] = useState(''),
    [view, setView] = useState('list'),
    [type, setType] = useState(''),
    [date, setDate] = useState(''),
    [month, setMonth] = useState(new Date());
  const { locale } = useI18n(),
    role = authStore.get()?.role,
    canManage = ['ADMIN', 'CAREGIVER'].includes(role);
  const load = () =>
    api('/reservations')
      .then(setRows)
      .catch((error) => setMsg(error.message));
  useEffect(() => {
    load();
    api('/horses').then(setHorses);
  }, []);
  const filtered = useMemo(
    () =>
      rows.filter(
        (row) =>
          (!type || row.activityType === type) &&
          (!date || row.startAt.slice(0, 10) === date)
      ),
    [rows, type, date]
  );
  async function save(event) {
    event.preventDefault();
    try {
      await api('/reservations' + (form.id ? `/${form.id}` : ''), {
        method: form.id ? 'PUT' : 'POST',
        body: JSON.stringify({
          ...form,
          horseId: Number(form.horseId),
          capacity: Number(form.capacity),
          participants: Number(form.participants),
        }),
      });
      setForm(null);
      load();
    } catch (error) {
      setMsg(error.message);
    }
  }
  async function cancel(id) {
    if (confirm('¿Cancelar esta reserva?')) {
      try {
        await api(`/reservations/${id}/cancel`, { method: 'PATCH' });
        load();
      } catch (error) {
        setMsg(error.message);
      }
    }
  }

  return (
    <>
      <PageHeader
        title="Agenda y reservas"
        subtitle="Citas veterinarias, montas, paseos y entrenamientos"
        onAdd={() => setForm({ ...blank })}
        addLabel="Nueva reserva"
      />
      <Toast message={msg} />
      <div className="filter-bar panel">
        <Select
          label="Tipo de actividad"
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option value="">Todas</option>
          {Object.entries(activityNames).map(([value, name]) => (
            <option value={value} key={value}>
              {name}
            </option>
          ))}
        </Select>
        <Field
          label="Fecha"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <button
          className="clear-filter"
          onClick={() => {
            setType('');
            setDate('');
          }}
        >
          Limpiar filtros
        </button>
        <div className="view-toggle">
          <button
            className={view === 'list' ? 'active' : ''}
            onClick={() => setView('list')}
          >
            <List />
            Lista
          </button>
          <button
            className={view === 'calendar' ? 'active' : ''}
            onClick={() => setView('calendar')}
          >
            <CalendarDays />
            Calendario
          </button>
        </div>
      </div>
      {view === 'calendar' ? (
        <CalendarView rows={filtered} month={month} onMonth={setMonth} />
      ) : (
        <DataTable
          rows={filtered}
          columns={[
            {
              key: 'startAt',
              label: 'Fecha y hora',
              render: (value) => new Date(value).toLocaleString(locale),
            },
            {
              key: 'horseName',
              label: 'Caballo',
              render: (value) => <b>{value}</b>,
            },
            {
              key: 'activityType',
              label: 'Actividad',
              render: (value) => activityNames[value] || value,
            },
            { key: 'responsible', label: 'Responsable' },
            {
              key: 'capacity',
              label: 'Cupo',
              render: (value, row) => `${row.participants}/${value}`,
            },
            {
              key: 'status',
              label: 'Estado',
              render: (value) => (
                <span
                  className={`badge ${value === 'CANCELLED' ? 'off' : 'ok'}`}
                >
                  {value === 'CANCELLED' ? 'Cancelada' : 'Programada'}
                </span>
              ),
            },
          ]}
          actions={
            canManage
              ? (row) => (
                  <>
                    {row.status !== 'CANCELLED' && (
                      <button
                        aria-label="Editar reserva"
                        onClick={() => setForm(row)}
                      >
                        <Pencil />
                      </button>
                    )}
                    {row.status !== 'CANCELLED' && (
                      <button
                        aria-label="Cancelar reserva"
                        className="danger"
                        onClick={() => cancel(row.id)}
                      >
                        <Ban />
                      </button>
                    )}
                  </>
                )
              : null
          }
        />
      )}
      {form && (
        <Modal
          title={form.id ? 'Editar reserva' : 'Nueva reserva'}
          onClose={() => setForm(null)}
        >
          <form className="form-grid" onSubmit={save}>
            <Select
              label="Caballo *"
              value={form.horseId}
              onChange={(event) =>
                setForm({ ...form, horseId: event.target.value })
              }
              required
            >
              <option value="">Seleccione...</option>
              {horses.map((horse) => (
                <option key={horse.id} value={horse.id}>
                  {horse.name}
                </option>
              ))}
            </Select>
            <Select
              label="Actividad *"
              value={form.activityType}
              onChange={(event) =>
                setForm({
                  ...form,
                  activityType: event.target.value,
                  capacity: event.target.value === 'PASEO' ? 6 : 1,
                })
              }
            >
              {Object.entries(activityNames).map(([value, name]) => (
                <option value={value} key={value}>
                  {name}
                </option>
              ))}
            </Select>
            <Field
              label="Inicio *"
              type="datetime-local"
              value={form.startAt}
              onChange={(event) =>
                setForm({ ...form, startAt: event.target.value })
              }
              required
            />
            <Field
              label="Final *"
              type="datetime-local"
              value={form.endAt}
              onChange={(event) =>
                setForm({ ...form, endAt: event.target.value })
              }
              required
            />
            <Field
              label="Cliente o responsable *"
              value={form.responsible}
              onChange={(event) =>
                setForm({ ...form, responsible: event.target.value })
              }
              required
            />
            <Field
              label="Observaciones"
              value={form.observations || ''}
              onChange={(event) =>
                setForm({ ...form, observations: event.target.value })
              }
            />
            <Field
              label="Capacidad *"
              type="number"
              min="1"
              value={form.capacity}
              onChange={(event) =>
                setForm({ ...form, capacity: event.target.value })
              }
              required
            />
            <Field
              label="Participantes *"
              type="number"
              min="1"
              max={form.capacity}
              value={form.participants}
              onChange={(event) =>
                setForm({ ...form, participants: event.target.value })
              }
              required
            />
            <div className="form-actions">
              <button type="button" onClick={() => setForm(null)}>
                Cancelar
              </button>
              <button className="primary">Guardar reserva</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
