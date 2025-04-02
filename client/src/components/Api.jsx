import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

let currentToken = localStorage.getItem("accessToken");

export let showErrorMessage;

export const setErrorHandler = (handler) => {
  showErrorMessage = handler;
};

export const setAxiosToken = (token) => {
  currentToken = token;

  // Set token to local storage
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Request Interceptor: Add access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh access token
export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/refresh-token`,
      {},
      {
        withCredentials: true, // send refresh token as cookie
      }
    );
    const newToken = response.data.accessToken;
    setAxiosToken(newToken);
    return newToken;
  } catch (error) {
    localStorage.removeItem("accessToken");
    return null;
  }
};

let isRefreshing = false;
let refreshSubscribers = [];

// Continue requests after token refresh
const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Add a new request to the queue
const addSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If an error occurs while refreshing the token, clear the token and redirect to login page
    if (originalRequest.url === "/auth/refresh-token") {
      localStorage.removeItem("accessToken");
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // If the error is 401 Unauthorized and the request has not been retried
    // and token is not being refreshed, try refreshing the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If the token is being refreshed, wait for the token to be refreshed
        return new Promise((resolve) => {
          addSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();

        if (newToken) {
          // If the token is refreshed, continue the request
          onRefreshed(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          // If the token cannot be refreshed, clear the token and redirect to login page
          if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Show error message from the server if available
    if (error.response?.data?.message && showErrorMessage) {
      showErrorMessage(error.response.data.message);
    }

    return Promise.reject(error);
  }
);

// Login
export const loginUser = async (identifier, password) => {
  try {
    const response = await api.post("/auth/login", { identifier, password });
    return response.data;
  } catch (error) {
    // If showErrorMessage is set, show a specific error message
    if (showErrorMessage) {
      showErrorMessage(error.response?.data?.message || "auth.loginFailed");
    }
    console.error("Login error:", error.response?.data?.message || error.message);
    throw error;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    if (showErrorMessage) {
      showErrorMessage(error.response?.data?.message || "auth.logoutFailed");
    }
    console.error("Logout error:", error.response?.data?.message || error.message);
  } finally {
    setAxiosToken(null);
  }
};

// Register
export const registerUser = async (username, email, password) => {
  try {
    await api.post("/auth/register", { username, email, password });
  } catch (error) {
    if (showErrorMessage) {
      showErrorMessage(error.response?.data?.message || "auth.registrationFailed");
    }
    console.error("Register error:", error.response?.data?.message || error.message);
    throw error;
  }
};

// NOTES //

// Get notes
export const getNotes = async () => {
  try {
    const response = await api.get("/note");
    return response.data.notes || []; // response.data.notes dizisini döndür veya boş dizi
  } catch (error) {
    if (showErrorMessage) {
      showErrorMessage(error.response?.data?.message || "notes.notFound");
    }
    console.error("Get notes error:", error.response?.data?.message || error.message);
    throw error;
  }
};

export const addNote = async (title, content) => {
  try {
    await api.post(`/note`, { title, content });
  } catch (error) {
    if (showErrorMessage) {
      showErrorMessage(error.response?.data?.message || "notes.addFailed");
    }
    console.error("Add note error:", error.response?.data?.message || error.message);
    throw error;
  }
};

// Update notes
export const updateNote = async (id, title, content) => {
  try {
    await api.put(`/note`, { id, title, content });
  } catch (error) {
    if (showErrorMessage) {
      showErrorMessage(error.response?.data?.message || "notes.updateFailed");
    }
    console.error("Update note error:", error.response?.data?.message || error.message);
    throw error;
  }
};

export const deleteNote = async (id) => {
  try {
    await api.delete(`/note/${id}`);
  } catch (error) {
    if (showErrorMessage) {
      showErrorMessage(error.response?.data?.message || "notes.deleteFailed");
    }
    console.error("Delete note error:", error.response?.data?.message || error.message);
    throw error;
  }
};
