import { useEffect, useState } from 'react';
import { api } from '../api';
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
  role: 'CAREGIVER',
  contact: '',
  shift: '',
  tasks: '',
  active: true,
};
const ROLE_LABELS = {
  CAREGIVER: 'Cuidador',
  VETERINARIAN: 'Veterinario',
  FARRIER: 'Potrador',
  ADMINISTRATOR: 'Administrador',
};

export default function Employees() {
  const [rows, setRows] = useState([]),
    [form, setForm] = useState(null),
    [msg, setMsg] = useState('');
  const load = () =>
    api('/employees')
      .then(setRows)
      .catch((e) => setMsg(e.message));
  useEffect(() => {
    load();
  }, []);

  async function save(e) {
    e.preventDefault();
    try {
      await api('/employees' + (form.id ? `/${form.id}` : ''), {
        method: form.id ? 'PUT' : 'POST',
        body: JSON.stringify(form),
      });
      setForm(null);
      load();
    } catch (error) {
      setMsg(error.message);
    }
  }

  async function del(id) {
    if (confirm('¿Eliminar empleado?')) {
      await api(`/employees/${id}`, { method: 'DELETE' });
      load();
    }
  }

  return (
    <>
      <PageHeader
        title="Personal"
        subtitle="Empleados, turnos y asignación de tareas"
        onAdd={() => setForm({ ...blank })}
        addLabel="Nuevo empleado"
      />
      <Toast message={msg} />
      <DataTable
        rows={rows}
        columns={[
          { key: 'name', label: 'Nombre', render: (value) => <b>{value}</b> },
          {
            key: 'role',
            label: 'Rol',
            render: (value) => ROLE_LABELS[value] || value,
          },
          { key: 'contact', label: 'Contacto' },
          { key: 'shift', label: 'Turno' },
          { key: 'tasks', label: 'Tareas' },
          {
            key: 'active',
            label: 'Estado',
            render: (value) => (
              <span className={`badge ${value ? 'ok' : 'off'}`}>
                {value ? 'Activo' : 'Inactivo'}
              </span>
            ),
          },
        ]}
        actions={(employee) => (
          <>
            <button
              title="Editar empleado"
              aria-label={`Editar ${employee.name}`}
              onClick={() => setForm({ ...employee })}
            >
              <Pencil />
            </button>
            <button
              title="Eliminar empleado"
              aria-label={`Eliminar ${employee.name}`}
              className="danger"
              onClick={() => del(employee.id)}
            >
              <Trash2 />
            </button>
          </>
        )}
      />
      {form && (
        <Modal
          title={form.id ? 'Editar empleado' : 'Nuevo empleado'}
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
              label="Rol *"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="CAREGIVER">Cuidador</option>
              <option value="VETERINARIAN">Veterinario</option>
              <option value="FARRIER">Potrador</option>
              <option value="ADMINISTRATOR">Administrador</option>
            </Select>
            <Field
              label="Contacto *"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              required
            />
            <Field
              label="Turno"
              value={form.shift || ''}
              onChange={(e) => setForm({ ...form, shift: e.target.value })}
            />
            <Field
              label="Tareas"
              value={form.tasks || ''}
              onChange={(e) => setForm({ ...form, tasks: e.target.value })}
            />
            {form.id && (
              <Select
                label="Estado"
                value={String(form.active)}
                onChange={(e) =>
                  setForm({ ...form, active: e.target.value === 'true' })
                }
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </Select>
            )}
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
