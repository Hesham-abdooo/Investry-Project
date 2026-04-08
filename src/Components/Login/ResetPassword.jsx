import React, { useState } from "react";
import {
  HiOutlineLockClosed,
  HiArrowLeft,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import TopBar from "../Basics/TopBar";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get("userId");
  const token = decodeURIComponent(searchParams.get("token") || "");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#16a34a"];
  const strength = getStrength(newPassword);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!userId || !token) {
      setError("Invalid or expired reset link.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "https://investry.runasp.net/api/Auth/reset-password",
        {
          userId,
          token,
          newPassword,
          confirmNewPassword: newPassword,
        },
      );

      if (data.success) {
        setSuccess("Password reset successfully. Redirecting to login...");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.errors?.[0]?.message || "Failed to reset password.");
      }
    } catch (err) {
      setError(
        err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.data ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ===== Left Side (Desktop Only) ===== */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#D4A017] flex-col justify-between p-12 min-h-screen">
        <div className="flex items-center gap-2">
          <div className="bg-[#1a2340] rounded-lg p-2 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#C9A84C" strokeWidth="2" />
              <path
                d="M12 7v5l3 3"
                stroke="#C9A84C"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-white text-lg font-bold tracking-tight">
            InvesTry
          </span>
        </div>

        <div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-4">
            Secure your
            <br />
            investment journey.
          </h1>
          <p className="text-white/80 text-base leading-relaxed max-w-xs">
            Update your credentials to maintain seamless and secure access to
            your Sharia-compliant crowdfunding portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="investor"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="investor"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
              <img
                src="https://randomuser.me/api/portraits/men/85.jpg"
                alt="investor"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <span className="text-white text-sm font-medium">
            Trusted by 8,200+ investors
          </span>
        </div>
      </div>

      {/* ===== Right Side ===== */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex flex-col min-h-screen">
        <TopBar />

        <div className="flex-1 flex items-center justify-center px-6 lg:px-10 py-8">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-10">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-full bg-[#fdf6e3] flex items-center justify-center">
                <HiOutlineLockClosed className="text-2xl text-[#C9A84C]" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#1a2340] text-center mb-2">
              Reset Password
            </h2>

            <p className="text-gray-400 text-sm text-center leading-relaxed mb-8">
              Please enter your new password below. Ensure it is at least 8
              characters long.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg mb-5">
                {success}
              </div>
            )}

            {/* New Password */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-[#1a2340] mb-2">
                New Password
              </label>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]">
                  <HiOutlineLockClosed className="text-lg" />
                </div>

                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter new password"
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-11 py-3 text-sm outline-none focus:border-[#1a2340] transition-colors placeholder:text-gray-300"
                />

                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? (
                    <HiEyeOff className="text-lg" />
                  ) : (
                    <HiEye className="text-lg" />
                  )}
                </button>
              </div>

              {newPassword.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          background:
                            i <= strength ? strengthColor[strength] : "#e5e7eb",
                        }}
                      />
                    ))}
                  </div>

                  <p
                    className="text-xs font-medium"
                    style={{ color: strengthColor[strength] }}
                  >
                    {strengthLabel[strength]} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#1a2340] mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]">
                  <HiOutlineLockClosed className="text-lg" />
                </div>

                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Confirm new password"
                  className={`w-full border rounded-xl pl-11 pr-11 py-3 text-sm outline-none transition-colors placeholder:text-gray-300 ${
                    confirmPassword && confirmPassword !== newPassword
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-[#1a2340]"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? (
                    <HiEyeOff className="text-lg" />
                  ) : (
                    <HiEye className="text-lg" />
                  )}
                </button>
              </div>

              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 8v4M12 16h.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Passwords do not match.
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={
                loading ||
                !newPassword.trim() ||
                !confirmPassword.trim() ||
                newPassword !== confirmPassword
              }
              className="w-full bg-[#1a2340] hover:bg-[#243060] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 text-sm"
            >
              {loading ? "Resetting..." : "Reset Password"}
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
          </div>
        </div>
      </div>
    </div>
  );
}
