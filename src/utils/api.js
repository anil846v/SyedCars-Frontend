/**
 * Syed Cars — API Client
 * Reads base URL from .env (VITE_API_BASE_URL)
 * Uses HTTP-only cookies for authentication (more secure, persists across sessions)
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// ─── Auth helpers (cookie-based - no token storage needed) ────────────────
export const auth = {
  setSession: (user) => {
    // Only store user data locally for UI, token is in HTTP-only cookie
    localStorage.setItem('sc_admin_user', JSON.stringify(user));
  },
  clearSession: () => {
    localStorage.removeItem('sc_admin_user');
  },
  getUser: () => {
    try { return JSON.parse(localStorage.getItem('sc_admin_user')); }
    catch { return null; }
  },
  isLoggedIn: () => !!localStorage.getItem('sc_admin_user'),
};

// ─── Core fetch wrapper ─────────────────────────────────────────────────────
async function request(path, options = {}) {
  const headers = { ...options.headers };
  // Cookies are sent automatically by browser, no Authorization header needed
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers, credentials: 'include' });
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
  login:             (body) => request('/auth/login',           { method: 'POST', body: JSON.stringify(body) }),
  logout:            ()     => request('/auth/logout',          { method: 'POST' }),
  me:                ()     => request('/auth/me'),
  updateProfile:     (body) => request('/auth/update-profile',  { method: 'PUT',  body: JSON.stringify(body) }),
  changePassword:    (body) => request('/auth/change-password', { method: 'PUT',  body: JSON.stringify(body) }),
  forgotPassword:    (body) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  verifyOtp:         (body) => request('/auth/verify-otp',      { method: 'POST', body: JSON.stringify(body) }),
  resetPassword:     (body) => request('/auth/reset-password',  { method: 'POST', body: JSON.stringify(body) }),
  // User management (admin only)
  listUsers:         (params = {}) => request('/auth/users?' + new URLSearchParams(params)),
  createUser:        (body)        => request('/auth/users',            { method: 'POST',   body: JSON.stringify(body) }),
  updateUser:        (id, body)    => request(`/auth/users/${id}`,      { method: 'PUT',    body: JSON.stringify(body) }),
  deleteUser:        (id)          => request(`/auth/users/${id}`,      { method: 'DELETE' }),
  updatePermissions: (id, body)    => request(`/auth/users/${id}/permissions`, { method: 'PUT', body: JSON.stringify(body) }),
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
  uploadPhotos: (formData)    => request('/cars/admin/upload',     { method: 'POST',   body: formData }),
  changeStatus: (id, status, buyer) => request(`/cars/admin/${id}/status`,{ method: 'PATCH', body: JSON.stringify({ status, buyer }) }),
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

// ─── Sold Cars (admin) ───────────────────────────────────────────────────────
export const soldCarsApi = {
  list:     (params = {}) => request('/sold-cars?' + new URLSearchParams(params)),
  get:      (id)          => request(`/sold-cars/${id}`),
  markSold: (id, body)   => request(`/sold-cars/${id}/sell`, { method: 'POST', body: JSON.stringify(body) }),
  update:   (id, body)   => request(`/sold-cars/${id}`,     { method: 'PUT',  body: JSON.stringify(body) }),
};

// ─── Car Repairs (admin) ─────────────────────────────────────────────────────
export const repairsApi = {
  list:   (params = {}) => request('/repairs?' + new URLSearchParams(params)),
  get:    (id)          => request(`/repairs/${id}`),
  create: (body)        => request('/repairs',      { method: 'POST',   body: JSON.stringify(body) }),
  update: (id, body)    => request(`/repairs/${id}`,{ method: 'PUT',    body: JSON.stringify(body) }),
  delete: (id)          => request(`/repairs/${id}`,{ method: 'DELETE' }),
};

// ─── Enquiries ───────────────────────────────────────────────────────────────
export const enquiriesApi = {
  // Public
  submit:       (body)        => request('/enquiries',              { method: 'POST', body: JSON.stringify(body) }),
  // Admin
  stats:        ()            => request('/enquiries/admin/stats'),
  topCars:      (params = {}) => request('/enquiries/admin/top-cars?' + new URLSearchParams(params)),
  list:         (params = {}) => request('/enquiries/admin?' + new URLSearchParams(params)),
  get:          (id)          => request(`/enquiries/admin/${id}`),
  updateStatus: (id, status)  => request(`/enquiries/admin/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete:       (id)          => request(`/enquiries/admin/${id}`, { method: 'DELETE' }),
};

// ─── Car Sale Requests ───────────────────────────────────────────────────────
export const carSaleRequestsApi = {

  // Public
  upload:  (formData)    => request('/car-sale-requests/upload', {
     method: 'POST',
      body: formData 
    }),
    

  submit:  (body)        => request('/car-sale-requests',        { method: 'POST', body: JSON.stringify(body) }),
  // Admin
  stats:   ()            => request('/car-sale-requests/admin/stats'),
  list:    (params = {}) => request('/car-sale-requests/admin?' + new URLSearchParams(params)),
  get:     (id)          => request(`/car-sale-requests/admin/${id}`),
  approve: (id, body={}) => request(`/car-sale-requests/admin/${id}/approve`, { method: 'PATCH', body: JSON.stringify(body) }),
  reject:  (id, body={}) => request(`/car-sale-requests/admin/${id}/reject`,  { method: 'PATCH', body: JSON.stringify(body) }),
  delete:  (id)          => request(`/car-sale-requests/admin/${id}`,         { method: 'DELETE' }),
};

export const getMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  const serverBase = BASE_URL.replace(/\/api$/, '');
  return `${serverBase}${url.startsWith('/') ? '' : '/'}${url}`;
};
