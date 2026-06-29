import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// Attach the logged-in user's JWT (if any) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- Small auth/session helpers (user accounts) ----
export const saveSession = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};
export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
export const getCurrentUser = () => {
  try { return JSON.parse(localStorage.getItem('user')); }
  catch { return null; }
};
export const isLoggedIn = () => !!localStorage.getItem('token');

// ---- Admin session (separate from user session) ----
export const saveAdminSession = (token) => localStorage.setItem('adminToken', token);
export const clearAdminSession = () => localStorage.removeItem('adminToken');
export const isAdmin = () => !!localStorage.getItem('adminToken');

// ---- User auth + self-service ----
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const requestAccess = (data) => api.post('/request-access', data);
export const getMyLicenses = () => api.get('/my-licenses');

// ---- Admin ----
export const adminLogin = (data) => api.post('/admin/login', data);

// Activate / block a member. We intentionally do NOT send a device fingerprint:
// the license stays unbound until the user verifies it inside their extension,
// which binds it to the user's machine (not the admin's).
export const toggleStatus = (id, is_active) =>
  api.put(`/members/${id}/status`, { is_active });

export const getMembers = () => api.get('/members');
export const addMember = (data) => api.post('/members', data);
export const deleteMember = (id) => api.delete(`/members/${id}`);
