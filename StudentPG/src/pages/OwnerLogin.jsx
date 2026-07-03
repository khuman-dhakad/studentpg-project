import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MdLockOutline, MdMailOutline } from "react-icons/md";

export default function OwnerLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * HANDLE SECURE SESSION INITIALIZATION
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    loading === false && setLoading(true);

    try {
      const responseData = await login({
        email: formData.email,
        password: formData.password,
      });

      // Extracts role directly from flat LoginResponse.java properties
      const role = responseData?.role ? String(responseData.role).toUpperCase() : "";

      // Dynamic role redirection engine mapping
      if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "OWNER") {
        navigate("/owner/dashboard", { replace: true });
      } else {
        navigate("/owner/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err?.message || "Invalid credentials or verification server unreachable."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto my-16 px-4 flex-grow w-full flex items-center justify-center">
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm w-full">
        
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-1.5">
            <MdLockOutline className="text-emerald-500 text-2xl" />
            <span>Secure Console Login</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your property dashboard node
          </p>
        </div>

        {/* ERROR SCREEN ALERT */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs font-semibold mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL INPUT WITH ICON CONTAINER */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <MdMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                type="email"
                required
                placeholder="owner@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* PASSWORD INPUT WITH ICON CONTAINER */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <MdLockOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* AUTHENTICATION TOKEN SUBMITTER */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs tracking-wide transition-all shadow-sm disabled:opacity-50 mt-2"
          >
            {loading ? "Verifying authorization..." : "Authorize Login"}
          </button>
        </form>
      </div>
    </main>
  );
}