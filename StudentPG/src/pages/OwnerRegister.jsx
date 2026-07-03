import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Dynamic global user authentication context
import { MdPersonAddAlt, MdMailOutline, MdLockOutline, MdBadge, MdPhoneAndroid } from "react-icons/md";

export default function OwnerRegister() {
  const navigate = useNavigate();
  const { register } = useAuth(); // Destructured function to register the user

  // Form states perfectly matched with the backend registration fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    whatsappNumber: ""
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

    // Hidden form protection field to block automated spam bots
    if (honeypot) return;

    // Checks if the phone number matches a valid 10-digit Indian mobile format
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(formData.phone)) {
      setStatus({
        success: "",
        error: "Validation failed: Phone number must be a valid 10-digit Indian mobile number starting with 6-9.",
      });
      return;
    }

    const whatsappRegex = /^[6-9]\d{9}$/;
    if (!whatsappRegex.test(formData.whatsappNumber)) {
      setStatus({
        success: "",
        error: "Validation failed: WhatsApp number must be a valid 10-digit Indian mobile number starting with 6-9.",
      });
      return;
    }

    if (formData.password.length < 8) {
      setStatus({
        success: "",
        error: "Validation failed: Password must be at least 8 characters long.",
      });
      return;
    }

    setLoading(true);
    setStatus({ success: "", error: "" });

    try {
      // Sends form details to the system registration rules
      await register(formData);

      setStatus({
        success: "Account created successfully! Redirecting to login page...",
        error: "",
      });

      // Matches the precise redirect path configured in your main App routing setup
      setTimeout(() => navigate("/owner/login"), 2000);
    } catch (err) {
      setStatus({
        success: "",
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Registration failed. Please check your internet connection and try again.",
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
            Create an official account to list and manage your properties
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

          {/* FULL NAME */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Legal Name</label>
            <div className="relative">
              <MdBadge className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                type="text"
                required
                minLength={3}
                maxLength={50}
                placeholder="e.g., Jane Smith"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
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

          {/* PHONE NUMBER */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Number (Indian)</label>
            <div className="relative">
              <MdPhoneAndroid className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                type="tel"
                required
                placeholder="10-digit number (e.g., 9876543210)"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-slate-900"
              />
            </div>
          </div>

          {/* WHATSAPP NUMBER */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-700">WhatsApp Number</label>
            <input 
              type="tel"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
              placeholder="Enter 10-digit WhatsApp number"
              maxLength="10"
              className="border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-slate-400 w-full"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Secure Password</label>
            <div className="relative">
              <MdLockOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                type="password"
                required
                minLength={8}
                maxLength={64}
                placeholder="•••••••• (Min 8 characters)"
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
            {loading ? "Creating your account..." : "Create Owner Account"}
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