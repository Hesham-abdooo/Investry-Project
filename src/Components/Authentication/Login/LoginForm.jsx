import React from 'react'

import { HiEye, HiEyeOff } from "react-icons/hi";
import { Link } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";

export default function LoginForm({
  email,
  password,
  loading,
  error,
  showPassword,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onLogin,
  onGoogleSuccess,
  role,
  onError,
}) {
  return (
    <div className="w-full" style={{ fontFamily: '"Inter", sans-serif' }}>
      <h2 className="text-2xl font-bold text-[#1a2340] mb-1 text-center" style={{ fontFamily: '"Nimbus Sans", sans-serif' }}>
        Welcome Back
      </h2>
      <p className="text-gray-400 text-sm mb-8 text-center">
        Sign in to your InvesTry account
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
          {error}
        </div>
      )}

      {/* Google Login First */}
      <div className="mb-6">
        <GoogleLoginButton onSuccess={onGoogleSuccess} onError={onError} role={role} />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[#1a2340] mb-1.5">
          Email
        </label>
        <input
          type="text"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onLogin()}
          placeholder="you@example.com"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-all duration-200 bg-[#fafafa] hover:border-gray-300 placeholder:text-gray-300"
        />
      </div>

      <div className="mb-7">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-[#1a2340]">Password</label>
          <Link
            to="/forgot-password"
            className="text-xs text-[#C9A84C] font-medium hover:text-[#b8932e] transition-colors no-underline"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onLogin()}
            placeholder="Enter your password"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-all duration-200 pr-12 bg-[#fafafa] hover:border-gray-300 placeholder:text-gray-300"
          />
          <button
            onClick={onTogglePassword}
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            {showPassword ? <HiEye size={18} /> : <HiEyeOff size={18} />}
          </button>
        </div>
      </div>

      <button
        onClick={onLogin}
        disabled={loading}
        className="w-full text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm cursor-pointer active:scale-[0.98] disabled:opacity-50 shadow-sm hover:shadow-md"
        style={{ background: 'linear-gradient(135deg, #1a2340, #243060)' }}
      >
        {loading ? "Logging in..." : "Log In"}
      </button>

      <p className="text-center text-sm text-gray-400 mt-10">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-[#C9A84C] font-semibold hover:text-[#b8932e] transition-colors no-underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}