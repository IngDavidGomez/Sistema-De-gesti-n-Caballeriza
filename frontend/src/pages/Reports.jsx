import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CalendarCheck,
  Download,
  FileText,
  HeartPulse,
  PackageSearch,
  Printer,
  RefreshCw,
  UsersRound,
  Wheat,
} from 'lucide-react';
import { api, downloadApi } from '../api';
import { DataTable, Field, PageHeader, Select, Toast } from '../components/UI';
import { useI18n } from '../i18n';
const iso = (d) => d.toISOString().slice(0, 10),
  today = new Date(),
  monthAgo = new Date(Date.now() - 29 * 86400000);
const tabs = [
  ['summary', 'Resumen', Activity],
  ['health', 'Salud', HeartPulse],
  ['inventory', 'Inventario', PackageSearch],
  ['activities', 'Reservas', CalendarCheck],
  ['staff', 'Personal', UsersRound],
  ['feeding', 'Alimentación', Wheat],
];
const pct = (v) => `${Number(v || 0).toFixed(1)}%`;
const badge = (v, t = (value) => value) => (
  <span
    className={`badge ${['VENCIDO', 'BAJO', 'SIN PLAN'].includes(v) ? 'off' : ['PRÓXIMO'].includes(v) ? 'warn' : 'ok'}`}
  >
    {t(v)}
  </span>
);
export default function Reports() {
  const { locale, t } = useI18n();
  const date = (v) =>
    v ? new Date(v + 'T12:00:00').toLocaleDateString(locale) : '—';
  const [from, setFrom] = useState(iso(monthAgo)),
    [to, setTo] = useState(iso(today)),
    [data, setData] = useState(null),
    [tab, setTab] = useState('summary'),
    [error, setError] = useState(''),
    [loading, setLoading] = useState(true),
    [pdfBusy, setPdfBusy] = useState(false),
    [healthScope, setHealthScope] = useState('period'),
    [appliedHealthScope, setAppliedHealthScope] = useState('period');
  const requestSequence = useRef(0);
  const validRange = Boolean(from && to && from <= to);
  const filtersApplied = Boolean(
    data &&
    data.from === from &&
    data.to === to &&
    appliedHealthScope === healthScope
  );
  async function load(rangeFrom = from, rangeTo = to, scope = healthScope) {
    if (!rangeFrom || !rangeTo || rangeFrom > rangeTo) {
      setError('La fecha inicial no puede ser posterior a la final');
      return;
    }
    const requestId = ++requestSequence.current;
    setLoading(true);
    setError('');
    try {
      const response = await api(
        `/reports/overview?from=${rangeFrom}&to=${rangeTo}&allHorses=${scope === 'all'}`
      );
      if (requestId === requestSequence.current) {
        setData(response);
        setAppliedHealthScope(scope);
      }
    } catch (e) {
      if (requestId === requestSequence.current) setError(e.message);
    } finally {
      if (requestId === requestSequence.current) setLoading(false);
    }
  }
  useEffect(() => {
    if (!validRange) {
      requestSequence.current += 1;
      setLoading(false);
      setError('La fecha inicial no puede ser posterior a la final');
      return;
    }
    const timer = setTimeout(() => load(from, to, healthScope), 300);
    return () => clearTimeout(timer);
  }, [from, to, healthScope]);
  const current = useMemo(() => {
    if (!data) return { name: 'reporte', headers: [], rows: [] };
    if (tab === 'health')
      return {
        name: 'salud',
        headers: [
          'Caballo',
          'Código',
          'Último registro',
          'Registros período',
          'Próximos',
          'Vencidos',
          'Próximo vencimiento',
          'Estado',
        ],
        rows: data.health.map((x) => [
          x.horse,
          x.code,
          x.lastRecord || '',
          x.recordsInPeriod,
          x.upcoming,
          x.overdue,
          x.nextDueDate || '',
          x.risk,
        ]),
      };
    if (tab === 'inventory')
      return {
        name: 'inventario',
        headers: [
          'Insumo',
          'Categoría',
          'Stock',
          'Mínimo',
          'Unidad',
          'Entradas',
          'Salidas',
          'Estado',
        ],
        rows: data.inventory.map((x) => [
          x.item,
          x.category,
          x.stock,
          x.minimum,
          x.unit,
          x.inbound,
          x.outbound,
          x.status,
        ]),
      };
    if (tab === 'activities')
      return {
        name: 'reservas',
        headers: [
          'Actividad',
          'Reservas',
          'Canceladas',
          'Participantes',
          'Capacidad',
          'Ocupación',
        ],
        rows: data.activities.map((x) => [
          x.activity,
          x.reservations,
          x.cancelled,
          x.participants,
          x.capacity,
          pct(x.occupancyPercent),
        ]),
      };
    if (tab === 'staff')
      return {
        name: 'personal',
        headers: [
          'Empleado',
          'Rol',
          'Turno',
          'Reservas asignadas',
          'Tareas',
          'Activo',
        ],
        rows: data.staff.map((x) => [
          x.employee,
          x.role,
          x.shift || '',
          x.assignedReservations,
          x.taskCount,
          x.active ? 'Sí' : 'No',
        ]),
      };
    if (tab === 'feeding')
      return {
        name: 'alimentacion',
        headers: ['Caballo', 'Planes', 'Alimentos', 'Horarios', 'Estado'],
        rows: data.feeding.map((x) => [
          x.horse,
          x.planCount,
          x.feedTypes,
          x.schedules,
          x.status,
        ]),
      };
    return {
      name: 'resumen',
      headers: ['Indicador', 'Valor'],
      rows: [
        ['Caballos activos', data.summary.activeHorses],
        ['Eventos médicos', data.summary.medicalEvents],
        ['Atenciones próximas', data.summary.upcomingCare],
        ['Atenciones vencidas', data.summary.overdueCare],
        ['Reservas', data.summary.reservations],
        ['Reservas canceladas', data.summary.cancelledReservations],
        ['Participantes', data.summary.participants],
        ['Cupos disponibles', data.summary.totalCapacity],
        ['Insumos con stock bajo', data.summary.lowStockItems],
        ['Cobertura alimentaria', pct(data.summary.feedingCoveragePercent)],
      ],
    };
  }, [data, tab]);
  function csv() {
    const quote = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`,
      content = [current.headers, ...current.rows]
        .map((r) => r.map(quote).join(','))
        .join('\r\n');
    const url = URL.createObjectURL(
      new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8' })
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-${current.name}-${from}-${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  async function pdf() {
    if (!data || !filtersApplied) return;
    setPdfBusy(true);
    setError('');
    try {
      await downloadApi(
        `/reports/overview.pdf?from=${data.from}&to=${data.to}&allHorses=${appliedHealthScope === 'all'}`,
        `reporte-operativo-${data.from}-${data.to}.pdf`
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setPdfBusy(false);
    }
  }
  return (
    <>
      <PageHeader
        title="Reportes operativos"
        subtitle="Indicadores para decisiones clínicas, logísticas y administrativas"
      />
      <Toast message={error} />
      <div className="report-controls panel">
        <Field
          label="Desde"
          type="date"
          value={from}
          max={to}
          onChange={(e) => setFrom(e.target.value)}
        />
        <Field
          label="Hasta"
          type="date"
          value={to}
          min={from}
          onChange={(e) => setTo(e.target.value)}
        />
        <button
          className="primary"
          onClick={() => load(from, to, healthScope)}
          disabled={loading || !validRange}
        >
          <RefreshCw size={16} />
          {loading ? 'Generando...' : 'Actualizar'}
        </button>
        <button
          className="pdf-action"
          onClick={pdf}
          disabled={!data || !filtersApplied || pdfBusy}
        >
          <FileText size={16} />
          {pdfBusy ? 'Generando PDF...' : 'PDF completo'}
        </button>
        <button onClick={csv} disabled={!data || !filtersApplied}>
          <Download size={16} />
          CSV
        </button>
        <button
          onClick={() => window.print()}
          disabled={!data || !filtersApplied}
        >
          <Printer size={16} />
          Imprimir
        </button>
      </div>
      <div className="report-tabs" role="tablist">
        {tabs.map(([key, label, Icon]) => (
          <button
            role="tab"
            aria-selected={tab === key}
            className={tab === key ? 'active' : ''}
            key={key}
            onClick={() => setTab(key)}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </div>
      {loading && !data ? (
        <div className="panel report-loading">Generando indicadores...</div>
      ) : (
        data && (
          <section className="report-sheet">
            <div className="report-meta">
              <span>
                Período:{' '}
                <b>
                  {date(data.from)} — {date(data.to)}
                </b>
              </span>
              <span>
                Generado: {new Date(data.generatedAt).toLocaleString(locale)}
              </span>
            </div>
            {tab === 'summary' && <Summary s={data.summary} />}{' '}
            {tab === 'health' && (
              <>
                <div className="report-scope">
                  <Select
                    label="Mostrar"
                    value={healthScope}
                    onChange={(event) => setHealthScope(event.target.value)}
                  >
                    <option value="period">Con registros en el período</option>
                    <option value="all">Todos los caballos</option>
                  </Select>
                </div>
                <DataTable
                  rows={data.health}
                  empty="No hay registros médicos en el período"
                  columns={[
                    {
                      key: 'horse',
                      label: 'Caballo',
                      render: (v, r) => (
                        <div>
                          <b>{v}</b>
                          <small className="table-sub">{r.code}</small>
                        </div>
                      ),
                    },
                    {
                      key: 'lastRecord',
                      label: 'Último registro',
                      render: date,
                    },
                    { key: 'recordsInPeriod', label: 'Eventos período' },
                    { key: 'upcoming', label: 'Próximos 30 días' },
                    { key: 'overdue', label: 'Vencidos' },
                    {
                      key: 'nextDueDate',
                      label: 'Próximo vencimiento',
                      render: date,
                    },
                    {
                      key: 'risk',
                      label: 'Estado',
                      render: (v) => badge(v, t),
                    },
                  ]}
                />
              </>
            )}{' '}
            {tab === 'inventory' && (
              <DataTable
                rows={data.inventory}
                columns={[
                  {
                    key: 'item',
                    label: 'Insumo',
                    render: (v, r) => (
                      <div>
                        <b>{v}</b>
                        <small className="table-sub">{r.category}</small>
                      </div>
                    ),
                  },
                  {
                    key: 'stock',
                    label: 'Disponible',
                    render: (v, r) => `${v} ${r.unit}`,
                  },
                  {
                    key: 'minimum',
                    label: 'Mínimo',
                    render: (v, r) => `${v} ${r.unit}`,
                  },
                  {
                    key: 'inbound',
                    label: 'Entradas',
                    render: (v, r) => `${v} ${r.unit}`,
                  },
                  {
                    key: 'outbound',
                    label: 'Salidas',
                    render: (v, r) => `${v} ${r.unit}`,
                  },
                  {
                    key: 'status',
                    label: 'Estado',
                    render: (v) => badge(v, t),
                  },
                ]}
              />
            )}{' '}
            {tab === 'activities' && (
              <DataTable
                rows={data.activities}
                empty="No hay reservas en el período"
                columns={[
                  {
                    key: 'activity',
                    label: 'Actividad',
                    render: (v) => <b>{t(v)}</b>,
                  },
                  { key: 'reservations', label: 'Reservas' },
                  { key: 'cancelled', label: 'Canceladas' },
                  { key: 'participants', label: 'Participantes' },
                  { key: 'capacity', label: 'Capacidad' },
                  {
                    key: 'occupancyPercent',
                    label: 'Ocupación',
                    render: (v) => <strong>{pct(v)}</strong>,
                  },
                ]}
              />
            )}{' '}
            {tab === 'staff' && (
              <DataTable
                rows={data.staff}
                columns={[
                  {
                    key: 'employee',
                    label: 'Empleado',
                    render: (v) => <b>{v}</b>,
                  },
                  { key: 'role', label: 'Rol', render: (v) => t(v) },
                  { key: 'shift', label: 'Turno' },
                  { key: 'assignedReservations', label: 'Reservas asignadas' },
                  { key: 'taskCount', label: 'Tareas' },
                  {
                    key: 'active',
                    label: 'Estado',
                    render: (v) => badge(v ? 'AL DÍA' : 'INACTIVO', t),
                  },
                ]}
              />
            )}{' '}
            {tab === 'feeding' && (
              <DataTable
                rows={data.feeding}
                columns={[
                  { key: 'horse', label: 'Caballo', render: (v) => <b>{v}</b> },
                  { key: 'planCount', label: 'Planes' },
                  { key: 'feedTypes', label: 'Alimentos' },
                  { key: 'schedules', label: 'Horarios' },
                  {
                    key: 'status',
                    label: 'Cobertura',
                    render: (v) => badge(v, t),
                  },
                ]}
              />
            )}
          </section>
        )
      )}
    </>
  );
}
function Summary({ s }) {
  const cards = [
    [HeartPulse, 'Atenciones vencidas', s.overdueCare, 'danger'],
    [AlertTriangle, 'Stock bajo', s.lowStockItems, 'warning'],
    [CalendarCheck, 'Reservas del período', s.reservations, 'blue'],
    [UsersRound, 'Participantes', s.participants, 'teal'],
    [Wheat, 'Cobertura alimentaria', pct(s.feedingCoveragePercent), 'brown'],
    [Activity, 'Eventos médicos', s.medicalEvents, 'violet'],
  ];
  return (
    <div className="report-summary">
      {cards.map(([Icon, label, value, tone]) => (
        <article className={`report-kpi ${tone}`} key={label}>
          <Icon />
          <div>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}
