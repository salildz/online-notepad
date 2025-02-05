import axios from "axios";

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Base URL for all API requests
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API methods
export const auth = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (username, email, password) => api.post("/auth/register", { username, email, password }),
};

// Notes API methods
export const notes = {
  fetchNotes: () => api.get("/notes"),
  addNote: (title, content) => api.post("/notes/add", { title, content }),
  deleteNote: (id) => api.delete(`/notes/${id}`),
  updateNote: (id, title, content) => api.put(`/notes/${id}`, { title, content }),
};

export default api;
