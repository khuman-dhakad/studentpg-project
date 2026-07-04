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
import OwnerProfile from "./pages/OwnerProfile";
import Support from "./pages/Support";

/**
 * ============================
 * ROUTE GUARD FOR PROTECTED PAGES
 * ============================
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-50 text-xs font-semibold text-slate-400">
        Checking your login status...
      </div>
    );
  }

  const activeUser = user;

  if (!activeUser) {
    return <Navigate to="/owner/login" replace />;
  }

  if (allowedRoles) {
    const userRole = String(activeUser.role || "").toUpperCase();
    const hasAccess = allowedRoles.map(r => r.toUpperCase()).includes(userRole);
    
    if (!hasAccess) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

/**
 * ============================
 * MAIN APPLICATION ROUTING CONTAINER
 * ============================
 */
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
          
          <Navbar />

          <Routes>
            {/* PUBLIC PAGES FOR STUDENTS */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/pg/:id" element={<PGDetails />} />
            <Route path="/owner/profile" element={<OwnerProfile />} />
            <Route path="/support" element={<Support />} />
            
            {/* LOGIN & SIGNUP PAGES */}
            <Route path="/owner/register" element={<OwnerRegister />} />
            <Route path="/owner/login" element={<OwnerLogin />} />

            {/* PROTECTED PAGES FOR PG OWNERS */}
            <Route
              path="/add-pg"
              element={
                <ProtectedRoute allowedRoles={["OWNER", "ADMIN"]}>
                  <AddPG />
                </ProtectedRoute>
              }
            />

            {/* PROTECTED PAGES FOR SYSTEM ADMINS */}
            {/* Both admin routes are securely handled using the user role checker */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* AUTOMATIC REDIRECT LINKS FOR SHORTCUTS */}
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