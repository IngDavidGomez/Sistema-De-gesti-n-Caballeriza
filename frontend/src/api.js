const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
export const API_ORIGIN = BASE.replace(/\/api\/?$/, '');
export async function api(path, options = {}) {
  const token = localStorage.getItem('token');
  const isForm =
    typeof FormData !== 'undefined' && options.body instanceof FormData;
  const response = await fetch(BASE + path, {
    ...options,
    headers: {
      ...(!isForm ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (response.status === 204) return null;
  const body = await response
    .json()
    .catch(() => ({ message: 'Respuesta inválida' }));
  if (!response.ok)
    throw new Error(body.message || 'No fue posible completar la operación');
  return body;
}
export async function downloadApi(path, filename) {
  const token = localStorage.getItem('token');
  const response = await fetch(BASE + path, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'No fue posible generar el archivo');
  }
  const blob = await response.blob(),
    url = URL.createObjectURL(blob),
    link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
export const assetUrl = (value) =>
  value?.startsWith('/') ? API_ORIGIN + value : value;
export const authStore = {
  get: () => JSON.parse(localStorage.getItem('user') || 'null'),
  set: (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
  },
  clear: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
