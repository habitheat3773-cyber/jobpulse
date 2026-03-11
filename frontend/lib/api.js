/**
 * API Helper - Centralized API calls for frontend
 */

import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("jobpulse_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Jobs API ─────────────────────────────────────────────────────────────────
export const jobsAPI = {
  getAll: (params) => api.get("/jobs", { params }),
  getLatest: () => api.get("/jobs/latest"),
  getTrending: () => api.get("/jobs/trending"),
  getBySlug: (slug) => api.get(`/jobs/${slug}`),
  search: (q, page = 1) => api.get("/jobs/search", { params: { q, page } }),
  getStats: () => api.get("/jobs/stats"),
};

// ── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
};

// ── Users API ─────────────────────────────────────────────────────────────────
export const usersAPI = {
  saveJob: (jobId) => api.post(`/users/save-job/${jobId}`),
  getSavedJobs: () => api.get("/users/saved-jobs"),
  updatePreferences: (data) => api.put("/users/preferences", data),
};

// ── Notifications API ─────────────────────────────────────────────────────────
export const notificationsAPI = {
  getAll: () => api.get("/notifications"),
  markRead: (id) => api.put(`/notifications/${id}/read`),
};

// ── Admin API ─────────────────────────────────────────────────────────────────
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getUsers: () => api.get("/admin/users"),
  triggerCrawler: () => api.post("/crawler/trigger"),
  getCrawlerLogs: () => api.get("/crawler/logs"),
};

export default api;
