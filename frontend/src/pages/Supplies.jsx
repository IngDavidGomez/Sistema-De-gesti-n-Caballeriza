import { useEffect, useState } from 'react';
import { api, authStore } from '../api';
import {
  PageHeader,
  DataTable,
  Modal,
  Field,
  Select,
  Toast,
} from '../components/UI';
import { ArrowDownToLine, ArrowUpFromLine, Trash2 } from 'lucide-react';
import { useI18n } from '../i18n';

const blank = {
  itemId: '',
  date: new Date().toISOString().slice(0, 16),
  type: 'IN',
  quantity: '',
  responsible: '',
  notes: '',
};

export default function Supplies() {
  const { locale, t } = useI18n();
  const [rows, setRows] = useState([]),
    [items, setItems] = useState([]),
    [form, setForm] = useState(null),
    [msg, setMsg] = useState('');
  const role = authStore.get()?.role,
    can = ['ADMIN', 'CAREGIVER'].includes(role);
  const load = () =>
    Promise.all([api('/supply-records'), api('/inventory')])
      .then(([records, inventory]) => {
        setRows(records);
        setItems(inventory);
      })
      .catch((error) => setMsg(error.message));
  useEffect(() => {
    load();
  }, []);

  async function save(event) {
    event.preventDefault();
    try {
      await api('/supply-records', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          itemId: Number(form.itemId),
          quantity: Number(form.quantity),
        }),
      });
      setForm(null);
      load();
    } catch (error) {
      setMsg(error.message);
    }
  }
  async function remove(id) {
    if (confirm('¿Revertir este movimiento?')) {
      try {
        await api(`/supply-records/${id}`, { method: 'DELETE' });
        load();
      } catch (error) {
        setMsg(error.message);
      }
    }
  }

  const columns = [
    {
      key: 'date',
      label: 'Fecha',
      render: (value) => new Date(value).toLocaleString(locale),
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (value) => (
        <span className={`supply-type ${value === 'IN' ? 'in' : 'out'}`}>
          {value === 'IN' ? <ArrowDownToLine /> : <ArrowUpFromLine />}
          {value === 'IN' ? 'Entrada' : 'Salida'}
        </span>
      ),
    },
    { key: 'itemName', label: 'Insumo', render: (value) => <b>{value}</b> },
    {
      key: 'quantity',
      label: 'Cantidad',
      render: (value, row) => `${value} ${row.unit}`,
    },
    { key: 'responsible', label: 'Responsable' },
    { key: 'notes', label: 'Detalle' },
  ];

  return (
    <>
      <PageHeader
        title="Movimientos de suministros"
        subtitle="Entradas y salidas con fecha, cantidad y responsable"
        onAdd={can ? () => setForm(blank) : null}
        addLabel="Registrar movimiento"
      />
      <Toast message={msg} />
      <DataTable
        rows={rows}
        columns={columns}
        actions={
          role === 'ADMIN'
            ? (row) => (
                <button
                  aria-label="Revertir movimiento"
                  className="danger"
                  onClick={() => remove(row.id)}
                >
                  <Trash2 />
                </button>
              )
            : null
        }
      />
      {form && (
        <Modal title="Registrar movimiento" onClose={() => setForm(null)}>
          <form className="form-grid" onSubmit={save}>
            <Select
              label="Insumo *"
              value={form.itemId}
              onChange={(event) =>
                setForm({ ...form, itemId: event.target.value })
              }
              required
            >
              <option value="">Seleccione...</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {t(item.name)} ({item.quantity} {t(item.unit)})
                </option>
              ))}
            </Select>
            <Select
              label="Tipo *"
              value={form.type}
              onChange={(event) =>
                setForm({ ...form, type: event.target.value })
              }
            >
              <option value="IN">Entrada</option>
              <option value="OUT">Salida</option>
            </Select>
            <Field
              label="Fecha y hora *"
              type="datetime-local"
              value={form.date}
              onChange={(event) =>
                setForm({ ...form, date: event.target.value })
              }
              required
            />
            <Field
              label="Cantidad *"
              type="number"
              min="0.01"
              step="0.01"
              value={form.quantity}
              onChange={(event) =>
                setForm({ ...form, quantity: event.target.value })
              }
              required
            />
            <Field
              label="Responsable *"
              value={form.responsible}
              onChange={(event) =>
                setForm({ ...form, responsible: event.target.value })
              }
              required
            />
            <Field
              label="Detalle"
              value={form.notes}
              onChange={(event) =>
                setForm({ ...form, notes: event.target.value })
              }
            />
            <div className="form-actions">
              <button type="button" onClick={() => setForm(null)}>
                Cancelar
              </button>
              <button className="primary">Registrar</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
