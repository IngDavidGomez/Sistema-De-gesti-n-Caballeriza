import { useEffect, useState } from 'react';
import { api } from '../api';
import { PageHeader, DataTable, Toast } from '../components/UI';

const labels = {
  ADMIN: 'Administrador',
  CAREGIVER: 'Cuidador',
  VETERINARIAN: 'Veterinario',
  CLIENT: 'Cliente',
};
export default function Users() {
  const [rows, setRows] = useState([]),
    [msg, setMsg] = useState('');
  const load = () =>
    api('/users')
      .then(setRows)
      .catch((e) => setMsg(e.message));
  useEffect(() => {
    load();
  }, []);
  async function role(id, value) {
    try {
      await api(`/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: value }),
      });
      load();
    } catch (e) {
      setMsg(e.message);
    }
  }
  async function status(row) {
    try {
      await api(`/users/${row.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !row.active }),
      });
      load();
    } catch (e) {
      setMsg(e.message);
    }
  }
  return (
    <>
      <PageHeader
        title="Usuarios y roles"
        subtitle="Permisos de acceso y estado de las cuentas"
      />
      <Toast message={msg} />
      <DataTable
        rows={rows}
        columns={[
          { key: 'name', label: 'Usuario', render: (v) => <b>{v}</b> },
          { key: 'email', label: 'Correo' },
          {
            key: 'role',
            label: 'Rol',
            render: (v, r) => (
              <select
                className="inline-select"
                aria-label={`Rol de ${r.name}`}
                value={v}
                onChange={(e) => role(r.id, e.target.value)}
              >
                {Object.entries(labels).map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
            ),
          },
          {
            key: 'active',
            label: 'Estado',
            render: (v) => (
              <span className={`badge ${v ? 'ok' : 'off'}`}>
                {v ? 'Activo' : 'Inactivo'}
              </span>
            ),
          },
        ]}
        actions={(r) => (
          <button
            className={r.active ? 'danger' : ''}
            onClick={() => status(r)}
          >
            {r.active ? 'Desactivar' : 'Activar'}
          </button>
        )}
      />
    </>
  );
}
