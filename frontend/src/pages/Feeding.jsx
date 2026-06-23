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
import { Pencil, Trash2 } from 'lucide-react';
const blank = {
  horseId: '',
  feedType: '',
  quantity: '',
  unit: 'kg',
  scheduleTime: '07:00',
  notes: '',
};
export default function Feeding() {
  const [rows, setRows] = useState([]),
    [horses, setHorses] = useState([]),
    [form, setForm] = useState(null),
    [msg, setMsg] = useState('');
  const role = authStore.get()?.role,
    can = ['ADMIN', 'CAREGIVER'].includes(role);
  const load = () =>
    api('/feeding-plans')
      .then(setRows)
      .catch((e) => setMsg(e.message));
  useEffect(() => {
    load();
    api('/horses').then(setHorses);
  }, []);
  async function save(e) {
    e.preventDefault();
    try {
      const time =
        form.scheduleTime.length === 5
          ? form.scheduleTime + ':00'
          : form.scheduleTime;
      await api('/feeding-plans' + (form.id ? `/${form.id}` : ''), {
        method: form.id ? 'PUT' : 'POST',
        body: JSON.stringify({
          ...form,
          horseId: Number(form.horseId),
          quantity: Number(form.quantity),
          scheduleTime: time,
        }),
      });
      setForm(null);
      load();
    } catch (e) {
      setMsg(e.message);
    }
  }
  async function del(id) {
    if (confirm('¿Eliminar este plan?')) {
      await api(`/feeding-plans/${id}`, { method: 'DELETE' });
      load();
    }
  }
  return (
    <>
      <PageHeader
        title="Alimentación"
        subtitle="Planes y horarios de alimentación por caballo"
        onAdd={can ? () => setForm(blank) : null}
        addLabel="Nuevo plan"
      />
      <Toast message={msg} />
      <DataTable
        rows={rows}
        columns={[
          { key: 'horseName', label: 'Caballo', render: (v) => <b>{v}</b> },
          { key: 'feedType', label: 'Alimento' },
          {
            key: 'quantity',
            label: 'Cantidad',
            render: (v, r) => `${v} ${r.unit}`,
          },
          { key: 'scheduleTime', label: 'Horario' },
          { key: 'notes', label: 'Notas' },
        ]}
        actions={
          can
            ? (r) => (
                <>
                  <button aria-label="Editar plan" onClick={() => setForm(r)}>
                    <Pencil />
                  </button>
                  {role === 'ADMIN' && (
                    <button
                      aria-label="Eliminar plan"
                      className="danger"
                      onClick={() => del(r.id)}
                    >
                      <Trash2 />
                    </button>
                  )}
                </>
              )
            : null
        }
      />
      {form && (
        <Modal
          title={form.id ? 'Editar plan' : 'Plan de alimentación'}
          onClose={() => setForm(null)}
        >
          <form className="form-grid" onSubmit={save}>
            <Select
              label="Caballo *"
              value={form.horseId}
              onChange={(e) => setForm({ ...form, horseId: e.target.value })}
              required
            >
              <option value="">Seleccione...</option>
              {horses.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </Select>
            <Field
              label="Tipo de alimento *"
              value={form.feedType}
              onChange={(e) => setForm({ ...form, feedType: e.target.value })}
              required
            />
            <Field
              label="Cantidad *"
              type="number"
              min="0.1"
              step="0.1"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              required
            />
            <Field
              label="Unidad *"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              required
            />
            <Field
              label="Hora *"
              type="time"
              value={form.scheduleTime?.slice(0, 5)}
              onChange={(e) =>
                setForm({ ...form, scheduleTime: e.target.value })
              }
              required
            />
            <Field
              label="Notas"
              value={form.notes || ''}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
            <div className="form-actions">
              <button type="button" onClick={() => setForm(null)}>
                Cancelar
              </button>
              <button className="primary">Guardar</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
