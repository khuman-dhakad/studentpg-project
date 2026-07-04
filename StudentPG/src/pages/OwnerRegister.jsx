import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import { MdPersonAddAlt, MdMailOutline, MdLockOutline, MdBadge, MdPhoneAndroid, MdVerified, MdSecurity } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

export default function OwnerRegister() {
  const navigate = useNavigate();
  const { register } = useAuth(); 

  // --- FORM STATES ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    whatsappNumber: ""
  });

  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState({ success: "", error: "" });
  const [loading, setLoading] = useState(false);

  // --- EMAIL OTP VERIFICATION STATES ---
  const [emailOtp, setEmailOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  /**
   * 1. HANDLE SEND OTP TO EMAIL
   * (यहाँ अपनी Backend API का उपयोग करें)
   */
  const handleSendEmailOtp = async () => {
    if (!formData.email) {
      setStatus({ success: "", error: "Please enter a valid email address first." });
      return;
    }
    setOtpLoading(true);
    setStatus({ success: "", error: "" });

    try {
      /* 
         --- BACKEND INTEGRATION NOTE ---
         URL: `${import.meta.env.VITE_API_BASE_URL}/api/auth/send-otp`
         Method: POST
         Body: { email: formData.email }
      */
      console.log("Sending OTP to:", formData.email);
      
      // Fake delay simulated for UI purpose - Replace with actual Axios/Fetch call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsOtpSent(true);
      setStatus({ success: "Verification OTP sent to your email successfully!", error: "" });
    } catch (err) {
      setStatus({ success: "", error: "Failed to send OTP. Please try again." });
    } finally {
      setOtpLoading(false);
    }
  };

  /**
   * 2. HANDLE VERIFY EMAIL OTP
   */
  const handleVerifyEmailOtp = async () => {
    if (!emailOtp) {
      setStatus({ success: "", error: "Please enter the 6-digit OTP." });
      return;
    }
    setOtpLoading(true);
    setStatus({ success: "", error: "" });

    try {
      /* 
         --- BACKEND INTEGRATION NOTE ---
         URL: `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-otp`
         Method: POST
         Body: { email: formData.email, otp: emailOtp }
      */
      console.log("Verifying OTP:", emailOtp);

      // Fake validation check - Replace with actual API response check
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsEmailVerified(true);
      setStatus({ success: "Email verified successfully! You can now complete registration.", error: "" });
    } catch (err) {
      setStatus({ success: "", error: "Invalid OTP. Please check and try again." });
    } finally {
      setOtpLoading(false);
    }
  };

  /**
   * 3. HANDLE FINAL REGISTER SUBMIT
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) return;

    // Strict guard to prevent submission without email verification
    if (!isEmailVerified) {
      setStatus({ success: "", error: "Please verify your email address before creating an account." });
      return;
    }

    // FIXED: whatsappRegex ko yahan define kar diya hai taaki check pass ho sake
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    const whatsappRegex = /^[6-9]\d{9}$/; 

    if (!indianPhoneRegex.test(formData.phone) || !whatsappRegex.test(formData.whatsappNumber)) {
      setStatus({ success: "", error: "Validation failed: Enter valid 10-digit Indian numbers." });
      return;
    }

    if (formData.password.length < 8) {
      setStatus({ success: "", error: "Password must be at least 8 characters long." });
      return;
    }

    setLoading(true);
    setStatus({ success: "", error: "" });

    try {
      /* 
         --- BACKEND INTEGRATION NOTE ---
         URL: `${import.meta.env.VITE_API_BASE_URL}/api/owner/register`
      */
      await register(formData);
      setStatus({ success: "Account created successfully! Redirecting...", error: "" });
      setTimeout(() => navigate("/owner/login"), 2000);
    } catch (err) {
      setStatus({
        success: "",
        error: err?.response?.data?.message || err?.message || "Registration failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-0 sm:p-4 md:p-8">
      <div className="bg-white rounded-none sm:rounded-2xl border-0 sm:border border-slate-100 shadow-2xl shadow-slate-200/50 max-w-5xl w-full flex overflow-hidden min-h-screen sm:min-h-0">
        
        {/* LEFT SIDE: ACTUAL PREMIUM PROPERTY IMAGE (Hidden on Mobile) */}
        <div className="hidden md:block md:w-1/2 relative min-h-[600px]">
          <img 
            src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80" 
            alt="Modern PG Accommodation" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent p-12 flex flex-col justify-end">
            <span className="self-start text-white font-bold tracking-wider text-[11px] uppercase px-3 py-1.5 bg-indigo-600 rounded-lg mb-4">
              Owner Console Node
            </span>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Grow Your Rental Business Digitally
            </h2>
            <p className="text-slate-200 text-xs mt-3 max-w-sm leading-relaxed">
              Verify your email, list rooms seamlessly, and automate your entire student PG operations.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: REGISTRATION FORM */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto">
            
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 mb-3">
                <MdPersonAddAlt className="text-xl" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create Owner Account</h1>
              <p className="text-xs text-slate-500 mt-1">Please verify your email address to register your property node.</p>
            </div>

            {/* ALERTS */}
            {status.success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
                {status.success}
              </div>
            )}
            {status.error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-semibold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                {status.error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" className="hidden" autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />

              {/* FULL NAME */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <MdBadge className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                  <input
                    type="text" required placeholder="e.g., Rajesh Kumar" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* EMAIL WITH INTEGRATED OTP SYSTEM */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Business Email</label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <MdMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                    <input
                      type="email" required placeholder="name@example.com" value={formData.email} disabled={isEmailVerified}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 text-slate-900 font-medium disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>
                  {!isEmailVerified && (
                    <button
                      type="button" onClick={handleSendEmailOtp} disabled={otpLoading || !formData.email}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 rounded-xl transition-all disabled:opacity-50 shrink-0"
                    >
                      {isOtpSent ? "Resend" : "Send OTP"}
                    </button>
                  )}
                </div>
              </div>

              {/* OTP CODE BOX */}
              {isOtpSent && !isEmailVerified && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1">
                    <MdSecurity className="text-indigo-600 text-sm" /> Enter Email OTP
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text" maxLength="6" placeholder="Enter 6-digit code" value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      className="flex-grow px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-center tracking-widest text-slate-900 outline-none focus:border-indigo-600"
                    />
                    <button
                      type="button" onClick={handleVerifyEmailOtp} disabled={otpLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 rounded-lg transition-all shrink-0"
                    >
                      {otpLoading ? "Checking..." : "Verify Code"}
                    </button>
                  </div>
                </div>
              )}

              {/* EMAIL VERIFIED CONFIRMATION BADGE */}
              {isEmailVerified && (
                <div className="text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <MdVerified className="text-base text-emerald-600" /> Email Verified & Secured
                </div>
              )}

              {/* PHONE NUMBER */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 border-r pr-2 border-slate-200">+91</span>
                  <input
                    type="tel" required placeholder="Mobile number" value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-14 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* WHATSAPP NUMBER */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">WhatsApp Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 border-r pr-2 border-slate-200">+91</span>
                  <input 
                    type="tel" required placeholder="WhatsApp number" maxLength="10" value={formData.whatsappNumber}
                    onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                    className="w-full pl-14 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Choose Password</label>
                <div className="relative">
                  <MdLockOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                  <input
                    type="password" required placeholder="••••••••" value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* MAIN SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading || !isEmailVerified}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs tracking-wide transition-all shadow-md disabled:opacity-40 mt-4"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="text-xs text-center text-slate-500 mt-6 font-medium">
              Already have an account?{" "}
              <Link to="/owner/login" className="text-indigo-600 hover:text-indigo-700 font-bold ml-0.5">
                Sign In
              </Link>
            </p>

          </div>
        </div>

      </div>
    </main>
  );
}