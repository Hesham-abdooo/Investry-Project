import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EmailCheck() {
  const [status, setStatus] = useState("idle");
  const navigate = useNavigate();

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
        { email },
      );

      setStatus("success");

      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.code;

      // 👇 أهم تعديل هنا
      if (msg === "Auth.EmailAlreadyConfirmed") {
        navigate("/login"); // لو متأكد خلاص دخله login
      } else {
        setStatus("error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md px-10 py-14 flex flex-col items-center text-center">
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

        <h1 className="text-2xl font-bold text-[#C9A84C] mb-2">
          Account created successfully.
        </h1>

        <p className="text-gray-500 text-sm mb-1">
          Please check your email to verify your account.
        </p>

        <p className="text-gray-400 text-xs mb-8">
          Make sure to check spam folder too.
        </p>

        {status === "success" && (
          <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs px-4 py-2.5 rounded-lg mb-4">
            Email sent successfully
          </div>
        )}

        {status === "error" && (
          <div className="w-full bg-red-50 border border-red-200 text-red-500 text-xs px-4 py-2.5 rounded-lg mb-4">
            Something went wrong
          </div>
        )}

        <button
          onClick={handleResend}
          disabled={status === "loading"}
          className="w-full border border-[#1a2340] text-[#1a2340] hover:bg-[#1a2340] hover:text-white disabled:opacity-50 font-semibold text-sm py-2.5 rounded-lg mb-3"
        >
          {status === "loading" ? "Sending..." : "Resend Email"}
        </button>

        <Link
          to="/login"
          className="w-full bg-[#1a2340] text-white font-semibold text-sm py-2.5 rounded-lg"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
