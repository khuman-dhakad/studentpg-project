import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { ENDPOINTS } from "../services/api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await api.get(ENDPOINTS.auth.me);
        if (isMounted) {
          // Normalize profile model to ensure role is extracted gracefully
          setUser(res.data || null);
        }
      } catch (err) {
        if (isMounted) {
          localStorage.removeItem("token");
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();
    return () => { isMounted = false; };
  }, []);

  /**
   * CENTRALIZED HYBRID LOGIN HANDSHAKE
   */
  const login = async (firstParam, secondParam) => {
    try {
      let payload = {};

      if (typeof firstParam === 'object' && firstParam !== null) {
        payload = firstParam;
      } else {
        payload = {
          email: firstParam,
          password: secondParam
        };
      }

      const res = await api.post(ENDPOINTS.auth.login, payload);
      
      // Match with LoginResponse.java direct flat token injection
      const token = res.data?.token;
      
      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      // Store flat res.data structure (contains email, role directly)
      setUser(res.data); 
      return res.data;
    } catch (err) {
      throw err?.message || 'Authentication credentials rejected.';
    }
  };

  /**
   * USER & OWNER REGISTER HANDSHAKE
   */
  const register = async (userData) => {
    try {
      const res = await api.post(ENDPOINTS.auth.register, userData);
      return res.data;
    } catch (err) {
      throw err?.message || 'Database account allocation rejected.';
    }
  };

  /**
   * SESSION FLUSH LOGOUT
   */
  const logout = async () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export { useAuth };