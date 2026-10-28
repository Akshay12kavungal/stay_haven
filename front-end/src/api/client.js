import axios from 'axios';

// In development Vite proxies /api to Django (see vite.config.js);
// in Docker nginx does the same, so a relative base URL works everywhere.
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

const ACCESS = 'access_token';
const REFRESH = 'refresh_token';

export const tokenStore = {
  get access() { return localStorage.getItem(ACCESS); },
  get refresh() { return localStorage.getItem(REFRESH); },
  set({ access, refresh }) {
    if (access) localStorage.setItem(ACCESS, access);
    if (refresh) localStorage.setItem(REFRESH, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
  },
};

api.interceptors.request.use((config) => {
  const token = tokenStore.access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On a 401, try one token refresh and replay the request.
let refreshing = null;
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isAuthCall = original?.url?.includes('/token/');
    if (error.response?.status !== 401 || original?._retried || isAuthCall || !tokenStore.refresh) {
      return Promise.reject(error);
    }
    original._retried = true;
    try {
      refreshing = refreshing || api.post('/token/refresh/', { refresh: tokenStore.refresh });
      const { data } = await refreshing;
      tokenStore.set({ access: data.access });
      return api(original);
    } catch {
      tokenStore.clear();
      window.dispatchEvent(new Event('auth:logout'));
      return Promise.reject(error);
    } finally {
      refreshing = null;
    }
  },
);

export default api;
