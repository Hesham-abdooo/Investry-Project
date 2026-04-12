import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function EmailConfirm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  // loading | success | error

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("error");
      return;
    }

    axios
      .get("https://investry.runasp.net/api/Auth/confirm-email", {
        params: { token, email },
      })
      .then(() => {
        setStatus("success");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  const handleStart = () => {
    navigate("/login"); // ✔️ الرجوع للـ Login مباشرة
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md px-10 py-14 flex flex-col items-center text-center">
        {/* Loading */}
        {status === "loading" && (
          <>
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6 animate-pulse">
              <svg
                className="w-9 h-9 text-gray-300"
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

            <p className="text-gray-400 text-sm">Verifying your email...</p>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <>
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

            <h1 className="text-xl font-bold text-[#C9A84C] mb-4">
              Email Verified Successfully 🎉
            </h1>

            <p className="text-gray-400 text-sm mb-8">
              You can now login to your account.
            </p>

            <button
              onClick={handleStart}
              className="w-full bg-[#1a2340] hover:bg-[#243060] text-white font-semibold text-sm py-3 rounded-xl transition-colors duration-200"
            >
              Go to Login
            </button>
          </>
        )}

        {/* Error */}
        {status === "error" && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
              <svg
                className="w-9 h-9 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h1 className="text-xl font-bold text-red-400 mb-2">
              Verification Failed
            </h1>

            <p className="text-gray-400 text-xs mb-8">
              The link may be expired or invalid.
            </p>

            <button
              onClick={() => navigate("/email-check")}
              className="w-full bg-[#1a2340] hover:bg-[#243060] text-white font-semibold text-sm py-3 rounded-xl transition-colors duration-200"
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
