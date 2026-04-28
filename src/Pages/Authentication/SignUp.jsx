import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleLoginButton from "../../Components/Authentication/Login/GoogleLoginButton";
import RoleToggle from "../../Components/Authentication/Signup/RoleToggle";
import InputField, {
  UserIcon,
  MailIcon,
  PhoneIcon,
} from "../../Components/Authentication/Signup/InputField";
import PasswordField from "../../Components/Authentication/Signup/PasswordField";
import TermsCheckbox from "../../Components/Authentication/Signup/TermsCheckbox";
import Logo from "../../Components/Basics/Logo";
import axiosInstance from "../../Api/axiosInstance";

export default function SignUp() {
  const navigate = useNavigate();

  const [role, setRole] = useState(""); // ← مفيش حاجة selected بالـ default
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSignUp = async () => {
    setError("");

    // ← validation للـ role الأول
    if (!role) return setError("Please select a role (Founder or Investor).");

    if (
      !form.firstName ||
      !form.lastName ||
      !form.userName ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.confirm
    )
      return setError("Please fill all fields.");

    if (form.password !== form.confirm)
      return setError("Passwords do not match.");
    if (!agreed) return setError("Please accept the Terms & Conditions.");

    setLoading(true);
    try {
      const endpoint =
        role === "founder"
          ? "/Auth/register-founder"
          : "/Auth/register-investor";

      const res = await axiosInstance.post(endpoint, {
        firstName: form.firstName,
        lastName: form.lastName,
        userName: form.userName,
        email: form.email,
        phoneNumber: form.phone.replace(/\s+/g, ""),
        password: form.password,
        confirmPassword: form.confirm,
      });

      const { token, roles } = res.data.data;
      const roleName = roles?.[0] || roles || "Investor";
      localStorage.setItem("email", form.email.trim().toLowerCase());
      localStorage.setItem("token", token);
      localStorage.setItem("role", roleName);

      navigate("/email-check");
    } catch (err) {
      console.error("SignUp Error:", err.response?.data || err);
      const data = err.response?.data;
      const msg =
        data?.errors?.[0]?.message ||
        data?.errors?.[0]?.description ||
        data?.message ||
        (typeof data === "string" ? data : null) ||
        (data?.errors && typeof data.errors === "object" ? Object.values(data.errors).flat().join(", ") : null);
      setError(msg || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6f8] px-4 py-8" style={{ fontFamily: '"Inter", sans-serif' }}>
      <div className="w-full max-w-[480px]">
        <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.07)] border border-gray-100 px-8 sm:px-10 py-8">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo to="/" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-[#1a2340] mb-1 text-center" style={{ fontFamily: '"Nimbus Sans", sans-serif' }}>
            Create an Account
          </h2>
          <p className="text-gray-400 text-sm mb-6 text-center">
            Join our platform to start investing or raising funds.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          {/* Google Login */}
          <div className="mb-5">
            <GoogleLoginButton
              role={role}
              onSuccess={() => {
                if (role === "founder") navigate("/founder/founderDashboard");
                else navigate("/investor/investorDashboard");
              }}
              onError={(msg) => setError(msg)}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Role Toggle */}
          <RoleToggle role={role} onRoleChange={setRole} />

          {/* Form Fields */}
          <div className="flex gap-3 mb-1.5">
            <div className="flex-1">
              <InputField
                label="First Name"
                icon={<UserIcon />}
                placeholder="Ahmed"
                value={form.firstName}
                onChange={set("firstName")}
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Last Name"
                icon={<UserIcon />}
                placeholder="Al-Rashidi"
                value={form.lastName}
                onChange={set("lastName")}
              />
            </div>
          </div>

          <InputField
            label="Username"
            icon={<UserIcon />}
            placeholder="e.g. ahmed123"
            value={form.userName}
            onChange={set("userName")}
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

          <PasswordField
            value={form.password}
            onChange={set("password")}
            showPassword={showPwd}
            onToggle={() => setShowPwd((v) => !v)}
            confirm={form.confirm}
            onConfirmChange={set("confirm")}
            showConfirm={showConfirm}
            onConfirmToggle={() => setShowConfirm((v) => !v)}
          />

          <TermsCheckbox agreed={agreed} onAgreeChange={setAgreed} />

          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm cursor-pointer active:scale-[0.98] disabled:opacity-50 shadow-sm hover:shadow-md"
            style={{ background: 'linear-gradient(135deg, #1a2340, #243060)' }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#C9A84C] font-semibold hover:text-[#b8932e] transition-colors no-underline"
            >
              Log in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-16">
          By continuing, you agree to InvesTry's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}