import axios from 'axios';

let currentToken = null;

export const setAxiosToken = (token) => {
  currentToken = token;
};

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor: Add access token to every request
api.interceptors.request.use((config) => {
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
},
  (error) => Promise.reject(error)
);

// Refresh token ile access token yenileme
export const refreshAccessToken = async () => {
  try {
    const response = await api.post("/auth/refresh-token");
    return response.data.accessToken;
  } catch (error) {
    return null;
  }
};

// Response Interceptor: 401 → Refresh token or redirect to login
api.interceptors.response.use((response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If the request is to refresh-token, redirect to login
    if (originalRequest.url === "/auth/refresh-token") {
      window.location.href = "/login";
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        setAxiosToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Login
export const loginUser = async (identifier, password) => {
  const response = await api.post("/auth/login", { identifier, password });
  return response.data;
};

// Logout
export const logoutUser = async () => {
  await api.post("/auth/logout");
};

// Register
export const registerUser = async (username, email, password) => {
  await api.post("/auth/register", { username, email, password });
};

// Get notes
export const getNotes = async () => {
  const response = await api.get("/note");
  return response.data.notes;
};

// Update notes
export const updateNotes = async (noteData) => {
  await api.put(`/note`, noteData);
};
