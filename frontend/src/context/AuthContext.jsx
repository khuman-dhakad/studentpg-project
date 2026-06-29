import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { ENDPOINTS } from "../services/api/axios"; // Centralized Axios instance and dynamic endpoints mapping node

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  // Check valid server token session on initial browser render
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        // 🔥 SYNCED WITH .ENV: Reads dynamic path mapping via centralized interceptor configuration
        const res = await api.get(ENDPOINTS.auth.me);
        if (isMounted) {
          setUser(res.data || null);
        }
      } catch (err) {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();
    return () => { isMounted = false; };
  }, []);

  /**
   * SESSION LOGIN HANDSHAKE
   */
  const login = async (username, password) => {
    try {
      // 🔥 SYNCED WITH .ENV: Dynamically processes login handshake endpoint route
      const res = await api.post(ENDPOINTS.auth.login, { username, password });
      setUser(res.data); // Stores user session object payload (id, roles, etc)
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
      // 🔥 SYNCED WITH .ENV: Dynamically routes incoming system signups 
      const res = await api.post(ENDPOINTS.auth.register, userData);
      setUser(res.data); // Registers and maps state directly avoiding double-step forms
      return res.data;
    } catch (err) {
      throw err?.message || 'Database account allocation rejected.';
    }
  };

  /**
   * SESSION FLUSH LOGOUT
   */
  const logout = async () => {
    try {
      // 🔥 SYNCED WITH .ENV: Securely flushes server state cookies
      await api.post(ENDPOINTS.auth.logout);
    } catch (err) {
      console.warn("Server state session flush bypass code invoked.");
    } finally {
      setUser(null); // Local context state storage cleared implicitly
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {loading ? (
        // Global system synchronization structural wrapper splash layout
        <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mb-3"></div>
          <p className="text-[10px] uppercase tracking-widest font-black text-slate-500">Checking Security Handshake...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);