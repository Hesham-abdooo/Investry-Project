import React, { useState } from "react";
import { HiOutlineMail, HiArrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";
import axiosInstance from "../../../Api/axiosInstance";



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

    await axiosInstance.post(
      "/Auth/forgot-password",
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
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">

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
  );
}