import { Search, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '../i18n';

const normalizeSearch = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase();
const FILTER_ALIASES = {
  ADMIN: ['Administrador'],
  ADMINISTRATOR: ['Administrador'],
  CAREGIVER: ['Cuidador'],
  VETERINARIAN: ['Veterinario'],
  FARRIER: ['Potrador'],
  CLIENT: ['Cliente'],
  MONTA: ['Monta'],
  PASEO: ['Paseo'],
  ENTRENAMIENTO: ['Entrenamiento'],
  VETERINARIA: ['Cita veterinaria'],
  SCHEDULED: ['Programada'],
  CANCELLED: ['Cancelada'],
  IN: ['Entrada'],
  OUT: ['Salida'],
  true: ['Activo', 'Correcto', 'Sí'],
  false: ['Inactivo', 'Fallido', 'No'],
};

export function PageHeader({
  title,
  subtitle,
  onAdd,
  addLabel = 'Nuevo registro',
}) {
  const { t } = useI18n();
  return (
    <div className="page-head">
      <div>
        <h1>{t(title)}</h1>
        <p>{t(subtitle)}</p>
      </div>
      {onAdd && (
        <button className="primary" onClick={onAdd}>
          <Plus size={18} />
          {t(addLabel)}
        </button>
      )}
    </div>
  );
}
export function DataTable({
  columns,
  rows,
  actions,
  empty = 'No hay registros',
}) {
  const [q, setQ] = useState('');
  const { t } = useI18n();
  const query = normalizeSearch(q.trim());
  const data = rows.filter((row) => {
    if (!query) return true;
    const raw = JSON.stringify(row);
    const translated = Object.values(row)
      .flatMap((value) => {
        const aliases = FILTER_ALIASES[String(value)] ?? [];
        return [
          value,
          typeof value === 'string' ? t(value) : value,
          ...aliases,
          ...aliases.map(t),
        ];
      })
      .join(' ');
    return normalizeSearch(`${raw} ${translated}`).includes(query);
  });
  return (
    <div className="panel data-panel">
      <div className="toolbar">
        <div className="search-box">
          <Search size={17} />
          <input
            aria-label={t('Buscar registros')}
            placeholder={t('Buscar registros...')}
            value={q}
            onChange={(event) => setQ(event.target.value)}
          />
        </div>
        <span>
          {data.length} {t(data.length === 1 ? 'registro' : 'registros')}
        </span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{t(column.label)}</th>
              ))}
              {actions && <th>{t('Acciones')}</th>}
            </tr>
          </thead>
          <tbody>
            {data.length ? (
              data.map((row, index) => (
                <tr key={row.id || index}>
                  {columns.map((column) => (
                    <td data-label={t(column.label)} key={column.key}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : (row[column.key] ?? '—')}
                    </td>
                  ))}
                  {actions && (
                    <td data-label={t('Acciones')} className="actions">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="empty">
                  {t(empty)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export function Modal({ title, onClose, children }) {
  const { t } = useI18n();
  return (
    <div
      className="overlay"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-head">
          <h2>{t(title)}</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
export function Field({ label, error, ...props }) {
  const { t } = useI18n();
  return (
    <label className="field">
      <span>{t(label)}</span>
      <input {...props} />
      {error && <small>{t(error)}</small>}
    </label>
  );
}
export function Select({ label, children, ...props }) {
  const { t } = useI18n();
  return (
    <label className="field">
      <span>{t(label)}</span>
      <select {...props}>{children}</select>
    </label>
  );
}
export function Toast({ message, type = 'error' }) {
  return message ? <div className={`toast ${type}`}>{message}</div> : null;
}
