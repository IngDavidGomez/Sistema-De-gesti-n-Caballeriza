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
  date: new Date().toISOString().slice(0, 10),
  type: 'VACUNA',
  description: '',
  responsible: '',
  nextDueDate: '',
  observations: '',
};
export default function Medical() {
  const [horses, setHorses] = useState([]),
    [selected, setSelected] = useState(''),
    [rows, setRows] = useState([]),
    [form, setForm] = useState(null),
    [msg, setMsg] = useState('');
  const can = ['ADMIN', 'VETERINARIAN'].includes(authStore.get()?.role);
  useEffect(() => {
    api('/horses').then((h) => {
      setHorses(h);
      if (h[0]) setSelected(String(h[0].id));
    });
  }, []);
  const load = () =>
    selected && can
      ? api(`/medical-records/horse/${selected}`)
          .then(setRows)
          .catch((e) => setMsg(e.message))
      : Promise.resolve();
  useEffect(() => {
    load();
  }, [selected]);
  async function save(e) {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        horseId: Number(form.horseId),
        nextDueDate: form.nextDueDate || null,
      };
      await api('/medical-records' + (form.id ? `/${form.id}` : ''), {
        method: form.id ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });
      setForm(null);
      load();
    } catch (e) {
      setMsg(e.message);
    }
  }
  async function del(id) {
    if (confirm('¿Eliminar este registro médico?')) {
      await api(`/medical-records/${id}`, { method: 'DELETE' });
      load();
    }
  }
  if (!can)
    return (
      <>
        <PageHeader
          title="Historial médico"
          subtitle="Información restringida al personal veterinario"
        />
        <div className="panel card empty">
          Su rol no tiene permiso para consultar expedientes médicos.
        </div>
      </>
    );
  return (
    <>
      <PageHeader
        title="Historial médico"
        subtitle="Vacunas, tratamientos, alergias y observaciones"
        onAdd={
          horses.length ? () => setForm({ ...blank, horseId: selected }) : null
        }
        addLabel="Nuevo registro"
      />
      <Toast message={msg} />
      <label className="horse-filter">
        Caballo{' '}
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          {horses.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name}
            </option>
          ))}
        </select>
      </label>
      <DataTable
        rows={rows}
        columns={[
          { key: 'date', label: 'Fecha' },
          {
            key: 'type',
            label: 'Tipo',
            render: (v) => <span className="badge ok">{v}</span>,
          },
          { key: 'description', label: 'Descripción' },
          { key: 'responsible', label: 'Responsable' },
          { key: 'nextDueDate', label: 'Próximo control' },
          { key: 'observations', label: 'Observaciones' },
        ]}
        actions={(r) => (
          <>
            <button
              aria-label="Editar registro"
              onClick={() =>
                setForm({ ...r, nextDueDate: r.nextDueDate || '' })
              }
            >
              <Pencil />
            </button>
            <button
              aria-label="Eliminar registro"
              className="danger"
              onClick={() => del(r.id)}
            >
              <Trash2 />
            </button>
          </>
        )}
      />
      {form && (
        <Modal
          title={form.id ? 'Editar registro médico' : 'Nuevo registro médico'}
          onClose={() => setForm(null)}
        >
          <form className="form-grid" onSubmit={save}>
            <Select
              label="Caballo *"
              value={form.horseId}
              onChange={(e) => setForm({ ...form, horseId: e.target.value })}
            >
              {horses.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </Select>
            <Select
              label="Tipo *"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="VACUNA">VACUNA</option>
              <option value="TRATAMIENTO">TRATAMIENTO</option>
              <option value="ALERGIA">ALERGIA</option>
              <option value="OBSERVACIÓN">OBSERVACIÓN</option>
            </Select>
            <Field
              label="Fecha *"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
            <Field
              label="Responsable *"
              value={form.responsible}
              onChange={(e) =>
                setForm({ ...form, responsible: e.target.value })
              }
              required
            />
            <Field
              label="Descripción *"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
            <Field
              label="Próximo control"
              type="date"
              value={form.nextDueDate || ''}
              onChange={(e) =>
                setForm({ ...form, nextDueDate: e.target.value })
              }
            />
            <Field
              label="Observaciones"
              value={form.observations || ''}
              onChange={(e) =>
                setForm({ ...form, observations: e.target.value })
              }
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
