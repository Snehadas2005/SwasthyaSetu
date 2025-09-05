// /src/utils/api.js
import axios from 'axios';

const api = axios.create({ baseURL: "https://your-backend-url.com/api" });

export const loginUser = (role, data) => api.post(`/auth/${role}/login`, data);
export const registerUser = (role, data) => api.post(`/auth/${role}/register`, data);
export const getAppointments = (role) => api.get(`/appointments?role=${role}`);
export const getMedicineStock = () => api.get("/medicines");
export const updateStock = (id, qty) => api.put(`/medicines/${id}`, { qty });

export default api;
