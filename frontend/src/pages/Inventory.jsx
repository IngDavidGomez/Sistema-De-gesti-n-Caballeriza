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
  name: '',
  category: 'Alimento',
  quantity: '',
  minimumStock: '',
  unit: 'kg',
};
export default function Inventory() {
  const [rows, setRows] = useState([]),
    [form, setForm] = useState(null),
    [msg, setMsg] = useState('');
  const role = authStore.get()?.role;
  const load = () => api('/inventory').then(setRows);
  useEffect(() => {
    load();
  }, []);
  async function save(e) {
    e.preventDefault();
    try {
      await api('/inventory' + (form.id ? `/${form.id}` : ''), {
        method: form.id ? 'PUT' : 'POST',
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
          minimumStock: Number(form.minimumStock),
        }),
      });
      setForm(null);
      load();
    } catch (e) {
      setMsg(e.message);
    }
  }
  async function del(id) {
    if (confirm('¿Eliminar insumo?')) {
      await api(`/inventory/${id}`, { method: 'DELETE' });
      load();
    }
  }
  return (
    <>
      <PageHeader
        title="Inventario"
        subtitle="Control de alimentos, medicinas y suministros"
        onAdd={
          ['ADMIN', 'CAREGIVER'].includes(role) ? () => setForm(blank) : null
        }
        addLabel="Nuevo insumo"
      />
      <Toast message={msg} />
      <DataTable
        rows={rows}
        columns={[
          { key: 'name', label: 'Insumo', render: (v) => <b>{v}</b> },
          { key: 'category', label: 'Categoría' },
          {
            key: 'quantity',
            label: 'Disponible',
            render: (v, r) => `${v} ${r.unit}`,
          },
          {
            key: 'minimumStock',
            label: 'Mínimo',
            render: (v, r) => `${v} ${r.unit}`,
          },
          {
            key: 'lowStock',
            label: 'Estado',
            render: (v) => (
              <span className={`badge ${v ? 'warn' : 'ok'}`}>
                {v ? 'Stock bajo' : 'Disponible'}
              </span>
            ),
          },
        ]}
        actions={
          ['ADMIN', 'CAREGIVER'].includes(role)
            ? (r) => (
                <>
                  <button onClick={() => setForm(r)}>
                    <Pencil />
                  </button>
                  {role === 'ADMIN' && (
                    <button className="danger" onClick={() => del(r.id)}>
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
          title={form.id ? 'Editar insumo' : 'Nuevo insumo'}
          onClose={() => setForm(null)}
        >
          <form className="form-grid" onSubmit={save}>
            <Field
              label="Nombre *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Select
              label="Categoría *"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="Alimento">Alimento</option>
              <option value="Medicina">Medicina</option>
              <option value="Limpieza">Limpieza</option>
              <option value="Equipo">Equipo</option>
            </Select>
            <Field
              label="Cantidad *"
              type="number"
              min="0"
              step="0.1"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              required
            />
            <Field
              label="Stock mínimo *"
              type="number"
              min="0"
              step="0.1"
              value={form.minimumStock}
              onChange={(e) =>
                setForm({ ...form, minimumStock: e.target.value })
              }
              required
            />
            <Field
              label="Unidad *"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              required
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
