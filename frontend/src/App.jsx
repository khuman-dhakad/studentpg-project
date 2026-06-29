import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

// Components & UI Elements
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Application Pages Layout
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import PGDetails from "./pages/PGDetails";
import OwnerRegister from "./pages/OwnerRegister";
import OwnerLogin from "./pages/OwnerLogin";
import AddPG from "./pages/AddPG";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

/**
 * ============================
 * PROTECTED ROUTE ENGINE
 * ============================
 * Handles precise authorization and block states.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Wait until auth check completes from interceptor layer
  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-50 text-xs font-semibold text-slate-400">
        Authenticating platform session...
      </div>
    );
  }

  // Not logged in -> Redirect to /owner/login to match your axios interceptors
  if (!isAuthenticated || !user) {
    return <Navigate to="/owner/login" replace />;
  }

  // Role authorization filter logic
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * ============================
 * APP CONTAINER ENTRYPOINT
 * ============================
 */
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
          
          <Navbar />

          <Routes>
            {/* PUBLIC STUDENT ACCESS ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/pg/:id" element={<PGDetails />} />
            
            {/* AUTH STREAM ROUTES (Synchronized paths) */}
            <Route path="/owner/register" element={<OwnerRegister />} />
            <Route path="/owner/login" element={<OwnerLogin />} />

            {/* OWNER CONSOLE PROTECTED ENGINE */}
            <Route
              path="/add-pg"
              element={
                <ProtectedRoute allowedRoles={["OWNER", "ADMIN"]}>
                  <AddPG />
                </ProtectedRoute>
              }
            />

            {/* SYSTEM ADMIN MANAGEMENT CONTROL PLATFORM */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* EDGE CASE FALLBACK (404 ERRORS) */}
          
            <Route path="/login" element={<Navigate to="/owner/login" replace />} />
            <Route path="/register" element={<Navigate to="/owner/register" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
        </div>  
      </Router>
    </AuthProvider>
  );
}