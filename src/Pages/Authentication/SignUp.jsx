import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../../assets/WhatsApp Image 2026-03-05 at 3.15.35 AM.jpg";
import Logo from "../../Components/Basics/Logo";
import TopBar from "../../Components/Basics/TopBar";

// ─── Icons ───────────────────────────────────────────────────────────────────

const EyeIcon = ({ open }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.696 6.696A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-1.34 2.53M3 3l18 18" />
    </svg>
  );

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

// ─── Password Strength ────────────────────────────────────────────────────────

const getPasswordStrength = (pwd) => {
  if (!pwd) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { level: 1, label: "Weak",   color: "bg-red-400" };
  if (score === 2) return { level: 2, label: "Fair",   color: "bg-yellow-400" };
  if (score === 3) return { level: 3, label: "Good",   color: "bg-emerald-400" };
  return             { level: 4, label: "Strong", color: "bg-emerald-500" };
};

// ─── Reusable Input ───────────────────────────────────────────────────────────

const InputField = ({ label, icon, type = "text", placeholder, value, onChange, rightSlot, extraClass = "" }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-[#1a2340] mb-1.5">{label}</label>
    <div className="relative flex items-center">
      <span className="absolute left-3 text-gray-400">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-9 pr-10 py-2.5 text-sm text-[#1a2340] border border-gray-200 rounded-lg outline-none focus:border-[#1a2340] transition-colors placeholder:text-gray-300 ${extraClass}`}
      />
      {rightSlot && <span className="absolute right-3 text-gray-400">{rightSlot}</span>}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SignUp() {
  const navigate = useNavigate();

  const [role, setRole]               = useState("investor");
  const [showPwd, setShowPwd]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed]           = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirm: "",
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const strength = getPasswordStrength(form.password);

  const handleSignUp = async () => {
    setError("");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    if (!agreed) return setError("Please accept the Terms & Conditions.");
    setLoading(true);
    try {
      const res = await axios.post("https://investry.runasp.net/api/Auth/register", {
        fullName: form.name,
        email: form.email,
        phoneNumber: form.phone,
        password: form.password,
        role,
      });
      const { token, roles } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", roles[0]);
      if (roles[0] === "Investor") navigate("/investor/investorDashboard");
      else if (roles[0] === "Founder") navigate("/founder/founderDashboard");
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.message;
      setError(msg || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // h-screen + overflow-hidden → no scroll on desktop
    <div className="h-screen overflow-hidden flex">

      {/* ══════════════════════════════════════════════
          LEFT — background image + branding
      ══════════════════════════════════════════════ */}
        <div
        className="relative hidden lg:flex flex-col justify-between flex-none p-10"
        style={{
          width: "44%",
          background: "linear-gradient(140deg, #081524 0%, #0d2240 55%, #102e56 100%)",
          overflow: "hidden",
        }}
      >
        {/* grid */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.08 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0L0 0 0 60" fill="none" stroke="#60a5fa" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)" />
        </svg>
        {/* blobs */}
        <div className="absolute rounded-full pointer-events-none"
          style={{ top: "-12%", left: "-12%", width: 380, height: 380, opacity: 0.22,
            background: "radial-gradient(circle, #1e40af, transparent 70%)" }} />
        <div className="absolute rounded-full pointer-events-none"
          style={{ bottom: "-8%", right: "-8%", width: 280, height: 280, opacity: 0.16,
            background: "radial-gradient(circle, #0ea5e9, transparent 70%)" }} />
        {/* floats */}
        {["£", "€", "¥", "↑", "$"].map((s, i) => (
          <span key={i} className="absolute select-none pointer-events-none text-blue-300"
            style={{ fontSize: `${[2.5,1.8,2,1.4,2.1][i]}rem`, opacity: 0.07 + i * 0.02,
              top: `${[15,55,30,70,44][i]}%`, left: `${[10,20,60,76,84][i]}%` }}>
            {s}
          </span>
        ))}

        {/* logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#f59e0b" }}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">InvesTry</span>
        </div>

        {/* copy */}
        <div className="relative z-10">
          <h1 className="text-white font-extrabold leading-tight mb-5"
            style={{ fontSize: "clamp(1.8rem, 2.8vw, 2.9rem)" }}>
            Fund the Future.<br />Invest with Confidence.
          </h1>
          <p className="text-blue-200 text-base leading-relaxed" style={{ maxWidth: 340 }}>
            InvesTry connects visionary founders with smart investors through transparent, secure, and Sharia-compliant crowdfunding.
          </p>
        </div>

        <p className="relative z-10 text-blue-400 text-sm">© 2025 InvesTry Platform. All rights reserved.</p>
      </div>

      {/* ══════════════════════════════════════════════
          RIGHT — form
      ══════════════════════════════════════════════ */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white overflow-y-auto">

        {/* Top bar — EN / AR lives here, same as Login */}
        <div className="flex justify-end px-8 py-5 shrink-0">
          <TopBar />
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-8 py-6">
          <div className="w-full max-w-md">

            <h2 className="text-3xl font-bold text-[#1a2340] mb-1">Create an Account</h2>
            <p className="text-gray-400 text-sm mb-6">
              Join our platform to start investing or raising funds.
            </p>

            {/* Error banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {/* Role toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-5 gap-1">
              {[
                { key: "founder",  label: "Founder",  icon: "🌱" },
                { key: "investor", label: "Investor",  icon: "💼" },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setRole(key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                    role === key
                      ? "bg-white text-[#1a2340] shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <span>{icon}</span>
                  {label}
                </button>
              ))}
            </div>

            {/* Fields */}
            <InputField
              label="Full Name"
              icon={<UserIcon />}
              placeholder="e.g. Ahmed Al-Rashidi"
              value={form.name}
              onChange={set("name")}
            />
            <InputField
              label="Email Address"
              icon={<MailIcon />}
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={set("email")}
            />
            <InputField
              label="Phone Number"
              icon={<PhoneIcon />}
              type="tel"
              placeholder="+20 100 000 0000"
              value={form.phone}
              onChange={set("phone")}
            />

            {/* Password */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-[#1a2340] mb-1.5">Password</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400"><LockIcon /></span>
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="At least 8 characters"
                  className="w-full pl-9 pr-10 py-2.5 text-sm text-[#1a2340] border border-gray-200 rounded-lg outline-none focus:border-[#1a2340] transition-colors placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <EyeIcon open={showPwd} />
                </button>
              </div>

              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-all ${
                          i <= strength.level ? strength.color : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 font-medium ${
                    strength.level <= 1 ? "text-red-400" :
                    strength.level === 2 ? "text-yellow-500" :
                    "text-emerald-500"
                  }`}>
                    Strength: {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1a2340] mb-1.5">Confirm Password</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400"><LockIcon /></span>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={set("confirm")}
                  placeholder="Re-enter your password"
                  className={`w-full pl-9 pr-10 py-2.5 text-sm text-[#1a2340] border rounded-lg outline-none focus:border-[#1a2340] transition-colors placeholder:text-gray-300 ${
                    form.confirm && form.confirm !== form.password
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer mb-5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#1a2340] rounded shrink-0"
              />
              <span className="text-xs text-gray-400 leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-[#1a2340] font-semibold hover:underline">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#1a2340] font-semibold hover:underline">
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            {/* Submit */}
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-[#1a2340] hover:bg-[#243060] disabled:opacity-60 text-white font-semibold py-3.5 rounded-lg transition-colors duration-200"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-gray-400 mt-5">
              Already have an account?{" "}
              <Link to="/login" className="text-[#C9A84C] font-semibold hover:underline">
                Log in
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}