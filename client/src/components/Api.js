import React from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (email, password) => api.post("/auth/login", { email, password }),
};

// Notes işlemleri
export const notes = {
  fetchNotes: () => api.get("/notes"),
  addNote: (title, content) => api.post("/notes/add", { title, content }),
  deleteNote: (id) => api.delete(`/notes/${id}`),
  updateNote: (id, title, content) => api.put(`/notes/${id}`, { title, content }),
};

export default api;