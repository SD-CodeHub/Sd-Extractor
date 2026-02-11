import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gmapadmin.kalkidigital.com',
});

export const addMember = (data) => api.post('/members', data);
export const getMembers = () => api.get('/members');
export const toggleStatus = (id, is_active) => api.put(`/members/${id}/status`, { is_active });
export const deleteMember = (id) => api.delete(`/members/${id}`);