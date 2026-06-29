import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerOwner } from "../services/api/auth.api"; // Centralized service integration
import { MdPersonAddAlt, MdMailOutline, MdLockOutline, MdBadge } from "react-icons/md";

export default function OwnerRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState({
    success: "",
    error: "",
  });
  const [loading, setLoading] = useState(false);

  /**
   * HANDLE SECURE OWNER REGISTRATION
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Bot attack blocker mitigation trigger
    if (honeypot) return;

    setLoading(true);
    setStatus({ success: "", error: "" });

    try {
      // Using cleaner backend abstraction pattern
      await registerOwner(formData);

      setStatus({
        success: "Account created successfully! Forwarding to verification console...",
        error: "",
      });

      // Synced to the exact security route update done inside your App.jsx router
      setTimeout(() => navigate("/owner/login"), 2000);
    } catch (err) {
      setStatus({
        success: "",
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Registration engine failed. Please audit connection parameters.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto my-16 px-4 flex-grow w-full flex items-center justify-center">
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm w-full">
        
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-1.5">
            <MdPersonAddAlt className="text-emerald-500 text-2xl" />
            <span>Register as PG Owner</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create an official portal account to host properties
          </p>
        </div>

        {/* STATUS RESPONSES */}
        {status.success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs font-semibold mb-4">
            {status.success}
          </div>
        )}

        {status.error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs font-semibold mb-4">
            {status.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* HONEYPOT SECURITY CHECK (Kept perfectly hidden from real users) */}
          <input
            type="text"
            className="hidden"
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />

          {/* USERNAME */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Desired Username</label>
            <div className="relative">
              <MdBadge className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                type="text"
                required
                placeholder="e.g., janesmith_bhopal"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-slate-900"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Business Email</label>
            <div className="relative">
              <MdMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-slate-900"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Secure Password</label>
            <div className="relative">
              <MdLockOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-slate-900"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON TRIGGER */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs tracking-wide transition-all shadow-sm disabled:opacity-50 mt-2"
          >
            {loading ? "Registering account node..." : "Create Owner Account"}
          </button>
        </form>

        {/* REDIRECT ANCHOR LINK */}
        <p className="text-xs text-center text-slate-400 mt-5 font-medium">
          Already registered?{" "}
          <Link
            to="/owner/login"
            className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors ml-0.5"
          >
            Login here
          </Link>
        </p>

      </div>
    </main>
  );
}