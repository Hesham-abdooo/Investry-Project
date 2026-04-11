import React from 'react'







import { HiEye, HiEyeOff } from "react-icons/hi";
import { Link } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";
import LoginDivider from "./LoginDivider";

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
  onError,
}) {
  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-[#1a2340] mb-2">Welcome Back</h2>
      <p className="text-gray-400 text-sm mb-8">
        Sign in to your InvesTry account to continue.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
          {error}
        </div>
      )}

      <div className="mb-5">
        <label className="block text-sm font-medium text-[#1a2340] mb-2">
          Email or Phone Number
        </label>
        <input
          type="text"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onLogin()}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#1a2340] transition-colors"
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-[#1a2340]">Password</label>
          <Link
            to="/forgot-password"
            className="text-sm text-[#1a2340] font-medium hover:underline"
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
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#1a2340] transition-colors pr-12"
          />
          <button
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <HiEye /> : <HiEyeOff />}
          </button>
        </div>
      </div>

      <button
        onClick={onLogin}
        disabled={loading}
        className="w-full bg-[#1a2340] hover:bg-[#243060] disabled:opacity-60 text-white font-semibold py-3.5 rounded-lg transition-colors duration-200"
      >
        {loading ? "Logging in..." : "Log In"}
      </button>

      <LoginDivider />

      <div className="mb-3">
        <GoogleLoginButton onSuccess={onGoogleSuccess} onError={onError} />
      </div>

      <p className="text-center text-sm text-gray-400 mt-6">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-[#C9A84C]! font-semibold hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}