import { useEffect, useRef, useState } from 'react';
import { api, downloadApi } from '../api';
import { DataTable, Toast } from '../components/UI';
import {
  FileDown,
  Search,
  RotateCcw,
  ShieldCheck,
  Users,
  TriangleAlert,
} from 'lucide-react';
import { useI18n } from '../i18n';

const ACTIONS = {
  CREAR: 'Crear',
  ACTUALIZAR: 'Actualizar',
  ELIMINAR: 'Eliminar',
  MODIFICAR: 'Modificar',
  CANCELAR: 'Cancelar',
  CAMBIAR_ESTADO: 'Cambiar estado',
  CAMBIAR_ROL: 'Cambiar rol',
  MARCAR_LEIDO: 'Marcar leído',
  GENERAR_REPORTE: 'Generar reporte',
};
const ROLES = {
  ADMIN: 'Administrador',
  CAREGIVER: 'Cuidador',
  VETERINARIAN: 'Veterinario',
  CLIENT: 'Cliente',
};
const initial = { username: '', action: '', from: '', to: '' };

export default function Audit() {
  const { locale } = useI18n();
  const [filters, setFilters] = useState(initial),
    [applied, setApplied] = useState(initial),
    [page, setPage] = useState({ content: [], totalElements: 0 }),
    [message, setMessage] = useState(''),
    [loading, setLoading] = useState(false);
  const requestSequence = useRef(0),
    validRange = !filters.from || !filters.to || filters.from <= filters.to;
  const params = (values) => {
    const query = new URLSearchParams({ size: '100', sort: 'occurredAt,desc' });
    Object.entries(values).forEach(
      ([key, value]) => value && query.set(key, value)
    );
    return query.toString();
  };
  const load = (values) => {
    const requestId = ++requestSequence.current;
    setLoading(true);
    setMessage('');
    api(`/audit?${params(values)}`)
      .then(
        (result) => requestId === requestSequence.current && setPage(result)
      )
      .catch(
        (error) =>
          requestId === requestSequence.current && setMessage(error.message)
      )
      .finally(
        () => requestId === requestSequence.current && setLoading(false)
      );
  };
  useEffect(() => {
    load(applied);
  }, [applied]);
  const apply = (event) => {
    event.preventDefault();
    if (!validRange) {
      setMessage('La fecha inicial no puede ser posterior a la final');
      return;
    }
    setApplied({ ...filters });
  };
  const clear = () => {
    setFilters(initial);
    setApplied({ ...initial });
  };
  const exportPdf = async () => {
    try {
      setMessage('');
      await downloadApi(
        `/audit/pdf?${params(applied)}`,
        `auditoria-sistema-${new Date().toISOString().slice(0, 10)}.pdf`
      );
    } catch (error) {
      setMessage(error.message);
    }
  };
  const success = page.content.filter((row) => row.success).length,
    failed = page.content.length - success,
    users = new Set(page.content.map((row) => row.username)).size;

  return (
    <div className="audit-page">
      <div className="page-head">
        <div>
          <h1>Auditoría del sistema</h1>
          <p>Trazabilidad de acciones, usuarios y controles de seguridad</p>
        </div>
        <button className="primary" onClick={exportPdf}>
          <FileDown size={18} />
          Generar PDF
        </button>
      </div>
      <Toast message={message} />
      <div className="audit-summary">
        <div>
          <ShieldCheck />
          <span>
            <b>{page.totalElements}</b>Eventos registrados
          </span>
        </div>
        <div>
          <Users />
          <span>
            <b>{users}</b>Usuarios en la vista
          </span>
        </div>
        <div className={failed ? 'has-failures' : ''}>
          <TriangleAlert />
          <span>
            <b>
              {success} / {failed}
            </b>
            Correctos / fallidos
          </span>
        </div>
      </div>
      <form className="audit-filters panel" onSubmit={apply}>
        <label>
          <span>Usuario</span>
          <input
            value={filters.username}
            onChange={(event) =>
              setFilters({ ...filters, username: event.target.value })
            }
            placeholder="Correo o usuario"
          />
        </label>
        <label>
          <span>Acción</span>
          <select
            value={filters.action}
            onChange={(event) =>
              setFilters({ ...filters, action: event.target.value })
            }
          >
            <option value="">Todas</option>
            {Object.entries(ACTIONS).map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Desde</span>
          <input
            type="date"
            value={filters.from}
            onChange={(event) =>
              setFilters({ ...filters, from: event.target.value })
            }
          />
        </label>
        <label>
          <span>Hasta</span>
          <input
            type="date"
            value={filters.to}
            onChange={(event) =>
              setFilters({ ...filters, to: event.target.value })
            }
          />
        </label>
        <div className="audit-filter-actions">
          <button type="button" onClick={clear}>
            <RotateCcw size={16} />
            Limpiar
          </button>
          <button className="primary" disabled={!validRange || loading}>
            <Search size={16} />
            Aplicar
          </button>
        </div>
      </form>
      <DataTable
        empty={
          loading
            ? 'Cargando auditoría...'
            : 'No hay eventos para los filtros seleccionados'
        }
        rows={page.content}
        columns={[
          {
            key: 'occurredAt',
            label: 'Fecha',
            render: (value) => new Date(value).toLocaleString(locale),
          },
          {
            key: 'username',
            label: 'Usuario',
            render: (value) => <b>{value}</b>,
          },
          {
            key: 'role',
            label: 'Rol',
            render: (value) => ROLES[value] || value,
          },
          {
            key: 'action',
            label: 'Acción',
            render: (value) => (
              <span className="audit-action">{ACTIONS[value] || value}</span>
            ),
          },
          { key: 'resource', label: 'Módulo' },
          { key: 'details', label: 'Detalle' },
          {
            key: 'success',
            label: 'Resultado',
            render: (value) => (
              <span className={`badge ${value ? 'ok' : 'off'}`}>
                {value ? 'Correcto' : 'Fallido'}
              </span>
            ),
          },
          { key: 'ipAddress', label: 'IP' },
        ]}
      />
    </div>
  );
}
