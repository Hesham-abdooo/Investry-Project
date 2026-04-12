import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function EmailCheck() {
  const [status, setStatus] = useState("idle"); 
  // idle | loading | success | error

  const handleResend = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      await axios.post(
        "https://investry.runasp.net/api/Auth/resend-confirmation-email",
        { email }
      );

      setStatus("success");

      // يرجع تاني بعد 3 ثواني
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md px-10 py-14 flex flex-col items-center text-center">

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <svg
            className="w-9 h-9 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[#C9A84C] mb-2">
          Account created successfully.
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 text-sm mb-1">
          Please check your email to verify your account.
        </p>
        <p className="text-gray-400 text-xs mb-8">
          Make sure to check your spam folder too.
        </p>

        {/* Success message */}
        {status === "success" && (
          <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs px-4 py-2.5 rounded-lg mb-4">
            ✅ Email sent successfully! You can resend again later.
          </div>
        )}

        {/* Error message */}
        {status === "error" && (
          <div className="w-full bg-red-50 border border-red-200 text-red-500 text-xs px-4 py-2.5 rounded-lg mb-4">
            ❌ Something went wrong. Please try again.
          </div>
        )}

        {/* Resend button */}
        <button
          onClick={handleResend}
          disabled={status === "loading"}
          className="w-full border border-[#1a2340] text-[#1a2340] hover:bg-[#1a2340] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm py-2.5 rounded-lg transition-colors duration-200 mb-3"
        >
          {status === "loading"
            ? "Sending..."
            : "Resend Email"}
        </button>

        {/* Go to login */}
        <Link
          to="/login"
          className="w-full bg-[#1a2340] hover:bg-[#243060] text-white font-semibold text-sm py-2.5 rounded-lg transition-colors duration-200 text-center"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}