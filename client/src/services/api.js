import axios from 'axios';

// When deployed separately (e.g. Vercel), VITE_API_URL can point to the backend (e.g. https://...onrender.com)
// When served by the backend or in local proxy mode, empty string or '/api' uses the same origin.
const rawBaseUrl = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

export const apiClient = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTodos = async () => {
  const response = await apiClient.get('/todos');
  return response.data;
};

export const createTodo = async (todoData) => {
  const response = await apiClient.post('/todos', todoData);
  return response.data;
};

export const updateTodo = async (id, updateData) => {
  const response = await apiClient.put(`/todos/${id}`, updateData);
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await apiClient.delete(`/todos/${id}`);
  return response.data;
};

export const getDeveloperName = async () => {
  const url = API_BASE_URL ? `${API_BASE_URL}/name` : '/name';
  const response = await axios.get(url, {
    headers: { Accept: 'application/json' },
  });
  return response.data;
};
