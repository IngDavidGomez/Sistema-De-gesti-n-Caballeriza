import { useEffect, useMemo, useState } from 'react';
import { api, assetUrl, authStore } from '../api';
import { PageHeader, Modal, Field, Select, Toast } from '../components/UI';
import {
  CalendarDays,
  Gauge,
  ImagePlus,
  Pencil,
  Search,
  Trash2,
} from 'lucide-react';
import { useI18n } from '../i18n';

const blank = {
  code: '',
  name: '',
  birthDate: '',
  breed: '',
  sex: 'Macho',
  weight: '',
  photoUrl: '',
  active: true,
};
const normalizeSearch = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase();

export default function Horses() {
  const { t } = useI18n();
  const [rows, setRows] = useState([]),
    [form, setForm] = useState(null),
    [photo, setPhoto] = useState(null),
    [msg, setMsg] = useState(''),
    [query, setQuery] = useState(''),
    [sex, setSex] = useState('');
  const role = authStore.get()?.role,
    canEdit = ['ADMIN', 'CAREGIVER'].includes(role);
  const load = () =>
    api('/horses')
      .then(setRows)
      .catch((e) => setMsg(e.message));
  useEffect(() => {
    load();
  }, []);
  const filtered = useMemo(() => {
    const normalizedQuery = normalizeSearch(query.trim());
    return rows.filter((horse) => {
      if (sex && horse.sex !== sex) return false;
      const searchable = [
        horse.name,
        horse.code,
        horse.breed,
        t(horse.breed),
        horse.sex,
        t(horse.sex),
      ].join(' ');
      return (
        !normalizedQuery ||
        normalizeSearch(searchable).includes(normalizedQuery)
      );
    });
  }, [rows, query, sex, t]);

  async function save(e) {
    e.preventDefault();
    setMsg('');
    try {
      const savedHorse = await api('/horses' + (form.id ? `/${form.id}` : ''), {
        method: form.id ? 'PUT' : 'POST',
        body: JSON.stringify({
          ...form,
          weight: Number(form.weight),
        }),
      });
      if (photo) {
        const data = new FormData();
        data.append('file', photo);
        await api(`/horses/${savedHorse.id}/photo`, {
          method: 'POST',
          body: data,
        });
      }
      setForm(null);
      setPhoto(null);
      load();
    } catch (e) {
      setMsg(e.message);
    }
  }
  async function del(id) {
    if (confirm('¿Eliminar este caballo?')) {
      try {
        await api(`/horses/${id}`, { method: 'DELETE' });
        load();
      } catch (e) {
        setMsg(e.message);
      }
    }
  }

  return (
    <>
      <PageHeader
        title="Caballos"
        subtitle="Perfiles, características y estado de los ejemplares"
        onAdd={canEdit ? () => setForm(blank) : null}
        addLabel="Registrar caballo"
      />
      <Toast message={msg} />
      <div className="horse-toolbar panel">
        <div className="horse-search">
          <Search />
          <input
            aria-label="Buscar caballos"
            placeholder="Buscar por nombre, raza o código..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          aria-label="Filtrar por sexo"
          value={sex}
          onChange={(e) => setSex(e.target.value)}
        >
          <option value="">Todos los ejemplares</option>
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
        </select>
        <span>
          {filtered.length} {filtered.length === 1 ? 'ejemplar' : 'ejemplares'}
        </span>
      </div>
      <div className="horse-grid">
        {filtered.map((h) => (
          <article className="horse-card" key={h.id}>
            <div className="horse-visual">
              {h.photoUrl ? (
                <img
                  src={assetUrl(h.photoUrl)}
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                  alt={`Fotografía de ${h.name}`}
                />
              ) : (
                <div className="horse-fallback">{h.name[0]}</div>
              )}
              <div className="horse-card-top">
                <span>{h.code}</span>
                <i className={h.active ? 'active' : 'inactive'}>
                  {h.active ? 'Activo' : 'Inactivo'}
                </i>
              </div>
            </div>
            <div className="horse-card-body">
              <div className="horse-title">
                <div>
                  <h2>{h.name}</h2>
                  <p>{h.breed}</p>
                </div>
                <span>{h.sex}</span>
              </div>
              <div className="horse-metrics">
                <div>
                  <CalendarDays />
                  <span>
                    <b>{h.age ?? '—'}</b> años
                  </span>
                </div>
                <div>
                  <Gauge />
                  <span>
                    <b>{h.weight ?? '—'}</b> kg
                  </span>
                </div>
              </div>
              {canEdit && (
                <div className="horse-actions">
                  <button
                    onClick={() => {
                      setPhoto(null);
                      setForm(h);
                    }}
                  >
                    <Pencil />
                    Editar perfil
                  </button>
                  {role === 'ADMIN' && (
                    <button
                      className="danger"
                      aria-label={`Eliminar ${h.name}`}
                      onClick={() => del(h.id)}
                    >
                      <Trash2 />
                    </button>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="panel horse-empty">
          No se encontraron caballos con esos filtros.
        </div>
      )}
      {form && (
        <Modal
          title={form.id ? 'Editar caballo' : 'Registrar caballo'}
          onClose={() => {
            setForm(null);
            setPhoto(null);
          }}
        >
          <form onSubmit={save} className="form-grid">
            <Field
              label="Identificador *"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              required
            />
            <Field
              label="Nombre *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Field
              label="Fecha de nacimiento *"
              type="date"
              value={form.birthDate || ''}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
              required
            />
            <Field
              label="Raza *"
              value={form.breed}
              onChange={(e) => setForm({ ...form, breed: e.target.value })}
              required
            />
            <Select
              label="Sexo *"
              value={form.sex}
              onChange={(e) => setForm({ ...form, sex: e.target.value })}
            >
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </Select>
            <Field
              label="Peso (kg) *"
              type="number"
              min="1"
              step="0.1"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
              required
            />
            <label className="field file-field">
              <span>Fotografía opcional</span>
              <div>
                <ImagePlus />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                />
                <b>{photo?.name || 'Seleccionar imagen'}</b>
              </div>
              <small>JPG, PNG o WebP · máximo 5 MB</small>
            </label>
            <div className="form-actions">
              <button
                type="button"
                onClick={() => {
                  setForm(null);
                  setPhoto(null);
                }}
              >
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
