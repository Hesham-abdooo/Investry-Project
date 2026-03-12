import React from 'react'
import { useState } from "react";
import { HiOutlineGlobeAlt, HiEye, HiEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgImage from "../../assets/WhatsApp Image 2026-03-05 at 3.15.35 AM.jpg";

export default function Login() {



  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("https://investry.runasp.net/api/Auth/login", {
        email,
        password,
      });

      const { token, roles } = res.data.data;

      // حفظ الـ token
      localStorage.setItem("token", token);
      localStorage.setItem("role", roles[0]);

      // التوجيه حسب الـ role
      
      if (roles[0] === "Investor") {
        navigate("/investor/investorDashboard");
      } else if (roles[0] === "Founder") {
        navigate("/founder/founderDashboard");
      }

    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.message;
      setError(msg || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };









  return (
    <div className="min-h-screen flex">

      {/* Left Side */}
      <div
        className="hidden lg:flex w-1/2 relative flex-col justify-between p-12"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-[#1a2340cc] via-[#1a2340aa] to-[#C9A84Ccc]" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="bg-white rounded-lg p-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 9l10 13L22 9 12 2z" stroke="#C9A84C" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M2 9h20M8 2l-4 7M16 2l4 7M12 22L6 9M12 22l6-13" stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-white text-lg font-bold">Inves<span className="text-[#C9A84C]">Try</span></span>
        </div>

        {/* Headline + Testimonial */}
        <div className="relative z-10 flex flex-col gap-6">
          <div>
            <h1 className="text-5xl font-bold text-white leading-tight mb-4">
              Invest with<br />
              <span className="text-[#C9A84C]">Confidence.</span>
            </h1>
            <p className="text-gray-200 text-sm leading-relaxed max-w-sm">
              Join thousands of investors and visionary founders building the next generation of successful enterprises through Sharia-compliant crowdfunding.
            </p>
          </div>

          {/* Testimonial Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 max-w-sm">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-gray-400 text-lg">☆</span>
              ))}
            </div>
            <p className="text-white text-sm leading-relaxed">
              "InvesTry made it incredibly easy to find promising startups and invest securely. The Mudarabah options align perfectly with my values and investment goals."
            </p>
          </div>
        </div>

        <div />
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white">

        {/* Top Bar */}
        <div className="flex justify-end px-8 py-5">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <HiOutlineGlobeAlt className="text-base" />
            <span>EN | AR</span>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-md">

            <h2 className="text-3xl font-bold text-[#1a2340] mb-2">Welcome Back</h2>
            <p className="text-gray-400 text-sm mb-8">Sign in to your InvesTry account to continue.</p>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-[#1a2340] mb-2">
                Email or Phone Number
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#1a2340] transition-colors"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[#1a2340]">Password</label>
                <a href="#" className="text-sm text-[#1a2340] font-medium hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#1a2340] transition-colors pr-12"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <HiEye /> : <HiEyeOff />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#1a2340] hover:bg-[#243060] disabled:opacity-60 text-white font-semibold py-3.5 rounded-lg transition-colors duration-200"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm">Or continue with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google */}
            <button className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-200">
              <FcGoogle className="text-lg" />
              Google
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">Social login options coming soon</p>

            {/* Register */}
            <p className="text-center text-sm text-gray-400 mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#C9A84C]! font-semibold hover:underline">
                Register
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}