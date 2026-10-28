import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import api, { tokenStore } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(tokenStore.access));

  const loadUser = useCallback(async () => {
    if (!tokenStore.access) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const { data } = await api.get('/users/users/me/');
      setUser(data);
      return data;
    } catch {
      tokenStore.clear();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
    const onLogout = () => setUser(null);
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, [loadUser]);

  const login = useCallback(async (username, password) => {
    const { data } = await api.post('/token/', { username, password });
    tokenStore.set(data);
    return loadUser();
  }, [loadUser]);

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/users/register/', payload);
    tokenStore.set(data);
    return loadUser();
  }, [loadUser]);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, register, logout, reloadUser: loadUser }),
    [user, loading, login, register, logout, loadUser],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
