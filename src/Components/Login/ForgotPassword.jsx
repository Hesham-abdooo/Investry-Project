import React, { useState } from "react";
import { HiOutlineMail, HiArrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";
import axios from "axios";
import TopBar from "../Basics/TopBar";



export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (val) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(val);
  };

 const handleSubmit = async () => {

  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    setError("Please enter your email address.");
    return;
  }

  if (!validateEmail(trimmedEmail)) {
    setError("Please enter a valid email address.");
    return;
  }

  setError("");
  setLoading(true);

  try {

    await axios.post(
      "https://investry.runasp.net/api/Auth/forgot-password",
      {
        email: trimmedEmail,
      }
    );

    setSuccess(true);

  } catch (err) {

    const msg =
      err.response?.data?.message ||
      err.response?.data?.errors?.[0]?.message ||
      "Something went wrong. Please try again.";

    setError(msg);

  } finally {
    setLoading(false);
  }
};



  
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ===== Left Side (Desktop Only) ===== */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#C9A84C] flex-col justify-between p-12 min-h-screen">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-[#1a2340] rounded-lg p-2 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#C9A84C" strokeWidth="2" />
              <path d="M12 7v5l3 3" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-white text-lg font-bold tracking-tight">InvesTry</span>
        </div>

        {/* Center text */}
        <div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-4">
            Regain access to<br />your account.
          </h1>
          <p className="text-white/80 text-base leading-relaxed max-w-xs">
            Don't worry, it happens. Follow the simple steps to securely restore access to your Sharia-compliant crowdfunding portfolio.
          </p>
        </div>

        {/* Bottom — Trusted */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="investor" className="w-full h-full object-cover" />
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="investor" className="w-full h-full object-cover" />
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
              <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="investor" className="w-full h-full object-cover" />
            </div>
          </div>
          <span className="text-white text-sm font-medium">Trusted by 8,200+ investors</span>
        </div>
      </div>

      {/* ===== Right Side ===== */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex flex-col min-h-screen">

        {/* Top bar */}
    <TopBar/>

        {/* Card */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-10 py-8">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-10">

            {!success ? (
              <>
                {/* Mail icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-[#fdf6e3] flex items-center justify-center">
                    <HiOutlineMail className="text-2xl text-[#C9A84C]" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-[#1a2340] text-center mb-2">
                  Forgot Password
                </h2>
                <p className="text-gray-400 text-sm text-center leading-relaxed mb-8">
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
                    {error}
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#1a2340] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                      <HiOutlineMail className="text-lg" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      placeholder="example@email.com"
                      className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-[#1a2340] transition-colors placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                 disabled={loading || !email.trim()}
                  className="w-full bg-[#1a2340] hover:bg-[#243060] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 text-sm"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <div className="flex justify-center mt-5">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#1a2340] transition-colors group"
                  >
                    <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                  </Link>
                </div>
              </>
            ) : (
              /* Success State */
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-[#1a2340] text-center mb-2">
                  Check your email
                </h2>
                <p className="text-gray-400 text-sm text-center leading-relaxed mb-2">
                  We've sent a reset link to
                </p>
                <p className="text-[#1a2340] font-semibold text-sm text-center mb-8">
                  {email}
                </p>

                <p className="text-xs text-gray-400 text-center mb-6">
                  Didn't receive it? Check spam or{" "}
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-[#C9A84C] font-semibold hover:underline"
                  >
                    try again
                  </button>
                </p>

                <div className="flex justify-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#1a2340] transition-colors group"
                  >
                    <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                  </Link>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}