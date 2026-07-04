import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MdLockOutline, MdMailOutline, MdVisibility, MdVisibilityOff, MdSecurity } from "react-icons/md";

export default function OwnerLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // --- LOGIN STATES ---
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- FORGOT PASSWORD STATES ---
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); 
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    let nextOtp = [...otp];
    nextOtp[index] = element.value;
    setOtp(nextOtp);

    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  /**
   * HANDLE SECURE SESSION INITIALIZATION
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    loading === false && setLoading(true);

    try {
      /* --- BACKEND INTEGRATION NOTE ---
         ENV Variable Name to Use: import.meta.env.VITE_API_BASE_URL
         Endpoint Node Route: /api/auth/login
      */
      const responseData = await login({
        email: formData.email,
        password: formData.password,
      });

      // Extracts role directly from flat LoginResponse.java properties
      const role = responseData?.role ? String(responseData.role).toUpperCase() : "";

      // --- सुधार (FIX): अगर रोल सही नहीं है या खाली है, तो यही रोक दो और एरर दिखाओ ---
      if (!role || (role !== "ADMIN" && role !== "OWNER")) {
        setError("Please enter correct password or email.");
        setLoading(false);
        return; 
      }

      // Dynamic role redirection engine mapping
      if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "OWNER") {
        navigate("/owner/dashboard", { replace: true });
      } else {
        setError("Please enter correct password or email.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || 
        "Please enter correct password or email."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    /* --- BACKEND INTEGRATION NOTE ---
       ENV Variable Name: import.meta.env.VITE_API_BASE_URL
       Endpoint Node Route: /api/auth/forgot-password (Send OTP)
    */
    alert(`OTP requested for: ${resetEmail}. Bind your original API here.`);
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    /* --- BACKEND INTEGRATION NOTE ---
       ENV Variable Name: import.meta.env.VITE_API_BASE_URL
       Endpoint Node Route: /api/auth/reset-password (Patch Updates)
    */
    alert(`Submitting Password Reset. OTP: ${finalOtp}, New Pass: ${newPassword}. Bind your original API here.`);
  };

  // --- FORGOT PASSWORD VIEW ---
  if (isForgotPassword) {
    return (
      <main className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-0 sm:p-4 md:p-8">
        <div className="bg-white rounded-none sm:rounded-2xl border-0 sm:border border-slate-100 shadow-2xl shadow-slate-200/50 max-w-4xl w-full flex overflow-hidden min-h-[85vh] sm:min-h-0">
          
          {/* LEFT SIDE: SAME MATCHING IMAGE ON FORGOT PASSWORD SCREEN */}
          <div className="hidden md:block md:w-1/2 relative">
            <img 
              src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80" 
              alt="Student Living Space" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent p-12 flex flex-col justify-end">
              <span className="self-start text-white font-bold tracking-wider text-[11px] uppercase px-3 py-1.5 bg-indigo-600 rounded-lg mb-4">
                Security Node
              </span>
              <h2 className="text-2xl font-extrabold text-white leading-snug">
                Protect Account Access
              </h2>
              <p className="text-slate-200 text-xs mt-2 max-w-xs leading-relaxed">
                Confirm your identity using secure one-time-passwords sent to your workspace mail box node.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: FORGOT PASSWORD FORM CONTEXT */}
          <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-white">
            <div className="w-full max-w-xl mx-auto">
              
              <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Reset Your Password</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Follow these simple steps to regain access.
                </p>
              </div>

              <div className="space-y-6">
                {/* STEP 1 */}
                <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-100">
                  <div className="absolute -left-[11px] top-0 bg-white border-2 border-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                    1
                  </div>
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
                    STEP 1: Identify Your Account
                  </h3>
                  <form onSubmit={handleSendOtp} className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">Email Address</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        required
                        placeholder="Enter your registered email address"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="flex-grow px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 text-slate-900 font-medium transition-all"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shrink-0"
                      >
                        Send OTP
                      </button>
                    </div>
                  </form>
                </div>

                {/* STEP 2 */}
                <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-100">
                  <div className="absolute -left-[11px] top-0 bg-white border-2 border-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                    2
                  </div>
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                    STEP 2: Enter OTP
                  </h3>
                  <div className="flex gap-1.5 items-center mt-3 flex-wrap">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={data}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onFocus={(e) => e.target.select()}
                        className="w-9 h-10 border border-slate-200 rounded-xl text-center text-xs font-semibold bg-white text-slate-900 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all"
                      />
                    ))}
                  </div>
                </div>

                {/* STEP 3 */}
                <div className="relative pl-6 sm:pl-8">
                  <div className="absolute -left-[9px] top-0 bg-white border-2 border-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                    3
                  </div>
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">
                    STEP 3: Set New Password
                  </h3>
                  
                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPass ? "text" : "password"}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 text-slate-900 font-medium transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPass(!showNewPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-base"
                          >
                            {showNewPass ? <MdVisibilityOff /> : <MdVisibility />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPass ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 text-slate-900 font-medium transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-base"
                          >
                            {showConfirmPass ? <MdVisibilityOff /> : <MdVisibility />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs tracking-wide transition-all shadow-md"
                      >
                        Reset Password
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(false)}
                        className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                      >
                        Back to Login
                      </button>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    );
  }

  // --- STANDARD LOGIN VIEW ---
  return (
    <main className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-0 sm:p-4 md:p-8">
      <div className="bg-white rounded-none sm:rounded-2xl border-0 sm:border border-slate-100 shadow-2xl shadow-slate-200/50 max-w-4xl w-full flex overflow-hidden min-h-[85vh] sm:min-h-0">
        
        {/* LEFT SIDE: ACTUAL REAL PREMIUM PROPERTY IMAGE (Hidden on Mobile) */}
        <div className="hidden md:block md:w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80" 
            alt="Student Living Space" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent p-12 flex flex-col justify-end">
            <span className="self-start text-white font-bold tracking-wider text-[11px] uppercase px-3 py-1.5 bg-indigo-600 rounded-lg mb-4">
              Console Access
            </span>
            <h2 className="text-2xl font-extrabold text-white leading-snug">
              Welcome Back Token Node
            </h2>
            <p className="text-slate-200 text-xs mt-3 max-w-xs leading-relaxed">
              Login to view real-time room occupancy, monthly hostel analytics, and sync pending student checks.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: STANDARD LOGIN CONTEXT */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto">
            
            <div className="mb-8">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Secure Console Login
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Access your property dashboard workspace node.
              </p>
            </div>

            {/* ERROR SCREEN ALERT */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-semibold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* EMAIL INPUT */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
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
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 text-slate-900 font-medium transition-all"
                  />
                </div>
              </div>

              {/* PASSWORD INPUT */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-700 font-bold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
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
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 text-slate-900 font-medium transition-all"
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs tracking-wide transition-all shadow-md shadow-indigo-100 disabled:opacity-50 mt-4 active:scale-[0.99]"
              >
                {loading ? "Verifying authorization..." : "Authorize Login"}
              </button>
            </form>

            <p className="text-xs text-center text-slate-500 mt-6 font-medium">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/owner/register")}
                className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors ml-0.5"
              >
                Register
              </button>
            </p>

          </div>
        </div>

      </div>
    </main>
  );
}