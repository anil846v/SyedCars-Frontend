/**
 * Syed Cars — API Client
 * Reads base URL from .env (VITE_API_BASE_URL)
 * JWT token is stored in sessionStorage (more secure than localStorage)
 * for the admin session; cleared on tab close.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// ─── Token helpers (sessionStorage = cleared on tab close) ─────────────────
const TOKEN_KEY = 'sc_admin_token';
const USER_KEY  = 'sc_admin_user';

export const auth = {
  setSession: (token, user) => {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearSession: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },
  getToken: () => sessionStorage.getItem(TOKEN_KEY),
  getUser: () => {
    try { return JSON.parse(sessionStorage.getItem(USER_KEY)); }
    catch { return null; }
  },
  isLoggedIn: () => !!sessionStorage.getItem(TOKEN_KEY),
};

// ─── Core fetch wrapper ─────────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = auth.getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data   = data;
    throw err;
  }
  return data;
}

// ─── Auth ───────────────────────────────────────────────────────────────────
export const authApi = {
  login:          (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me:             ()     => request('/auth/me'),
  updateProfile:  (body) => request('/auth/update-profile', { method: 'PUT',  body: JSON.stringify(body) }),
  changePassword: (body) => request('/auth/change-password',{ method: 'PUT',  body: JSON.stringify(body) }),
  forgotPassword: (body) => request('/auth/forgot-password',{ method: 'POST', body: JSON.stringify(body) }),
  resetPassword:  (body) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
};

// ─── Cars (public) ──────────────────────────────────────────────────────────
export const carsApi = {
  list: (params = {}) => request('/cars?' + new URLSearchParams(params)),
  get:  (id)          => request(`/cars/${id}`),
};

// ─── Cars (admin) ───────────────────────────────────────────────────────────
export const adminCarsApi = {
  list:         (params = {}) => request('/cars/admin/list?' + new URLSearchParams(params)),
  get:          (id)          => request(`/cars/admin/${id}`),
  create:       (body)        => request('/cars/admin',            { method: 'POST',   body: JSON.stringify(body) }),
  update:       (id, body)    => request(`/cars/admin/${id}`,      { method: 'PUT',    body: JSON.stringify(body) }),
  changeStatus: (id, status)  => request(`/cars/admin/${id}/status`,{ method: 'PATCH', body: JSON.stringify({ status }) }),
  delete:       (id)          => request(`/cars/admin/${id}`,      { method: 'DELETE' }),
  // Owners
  listOwners:   (params = {}) => request('/cars/admin/owners/list?' + new URLSearchParams(params)),
  getOwner:     (id)          => request(`/cars/admin/owners/${id}`),
  updateOwner:  (id, body)    => request(`/cars/admin/owners/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
};

// ─── Commissions (admin) ─────────────────────────────────────────────────────
export const commissionsApi = {
  summary:       ()           => request('/commissions/summary'),
  list:          (params = {})=> request('/commissions?' + new URLSearchParams(params)),
  get:           (id)         => request(`/commissions/${id}`),
  create:        (body)       => request('/commissions',             { method: 'POST',  body: JSON.stringify(body) }),
  update:        (id, body)   => request(`/commissions/${id}`,       { method: 'PUT',   body: JSON.stringify(body) }),
  recordPayment: (id, body)   => request(`/commissions/${id}/payment`,{ method: 'PATCH', body: JSON.stringify(body) }),
  delete:        (id)         => request(`/commissions/${id}`,       { method: 'DELETE' }),
};

// ─── Enquiries ───────────────────────────────────────────────────────────────
export const enquiriesApi = {
  // Public
  submit:       (body)        => request('/enquiries',              { method: 'POST', body: JSON.stringify(body) }),
  // Admin
  stats:        ()            => request('/enquiries/admin/stats'),
  list:         (params = {}) => request('/enquiries/admin?' + new URLSearchParams(params)),
  get:          (id)          => request(`/enquiries/admin/${id}`),
  updateStatus: (id, status)  => request(`/enquiries/admin/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete:       (id)          => request(`/enquiries/admin/${id}`, { method: 'DELETE' }),
};
