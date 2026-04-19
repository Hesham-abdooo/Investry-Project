import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function EmailConfirm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("loading"); 
  // loading | success | error

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");

    if (!token || !userId) {
      setStatus("error");
      setErrorMsg("Missing token or userId in the URL.");
      return;
    }

    axios
      .get("http://investry.runasp.net/api/auth/confirm-email", {
        params: { userId, token },
      })
      .then((res) => {
        console.log("CONFIRM RESPONSE:", res.data);

        if (res.data?.success) {
          setStatus("success");

          setTimeout(() => {
            navigate("/login");
          }, 1500);
        } else {
          setStatus("error");
          setErrorMsg("Email confirmation failed.");
        }
      })
      .catch((err) => {
        console.log("CONFIRM ERROR:", err.response?.data);

        const msg =
          err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.message ||
          "Something went wrong.";

        setStatus("error");
        setErrorMsg(msg);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md px-10 py-14 flex flex-col items-center text-center">

        {/* Loading */}
        {status === "loading" && (
          <>
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6 animate-pulse">
              <svg className="w-9 h-9 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <p className="text-gray-400 text-sm">
              Verifying your email...
            </p>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
              <svg className="w-9 h-9 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-xl font-bold text-[#C9A84C] mb-4">
              Email Verified Successfully 🎉
            </h1>

            <p className="text-gray-400 text-sm">
              Redirecting to login...
            </p>
          </>
        )}

        {/* Error */}
        {status === "error" && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
              <svg className="w-9 h-9 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h1 className="text-xl font-bold text-red-500 mb-2">
              Verification Failed
            </h1>

            <p className="text-gray-400 text-sm mb-4">
              {errorMsg}
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#1a2340] hover:bg-[#243060] text-white font-semibold text-sm py-3 rounded-xl"
            >
              Go to Login
            </button>
          </>
        )}

      </div>
    </div>
  );
}