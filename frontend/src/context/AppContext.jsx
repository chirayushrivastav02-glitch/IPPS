// src/context/AppContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import { authAPI } from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  // Proposals submitted during this session (Phase 1 = in-memory over mockData)
  const [proposals, setProposals] = useState([]);

  const login = useCallback(async (role, email, password) => {
    setIsLoading(true);
    try {
      const result = await authAPI.login(role, email, password);
      setUser(result.user);
      localStorage.setItem('ipps_token', result.token);
      localStorage.setItem('ipps_role', role);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authAPI.logout();
    setUser(null);
    localStorage.removeItem('ipps_token');
    localStorage.removeItem('ipps_role');
  }, []);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  const addProposal = useCallback((application) => {
    setProposals(prev => [application, ...prev]);
  }, []);

  return (
    <AppContext.Provider value={{
      user, setUser, isLoading, login, logout,
      notification, showNotification,
      proposals, addProposal,
    }}>
      {children}
      {notification && (
        <div className={`global-notification ${notification.type}`} data-testid="global-notification">
          {notification.type === 'success' ? '✓' : '⚠'} {notification.message}
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
