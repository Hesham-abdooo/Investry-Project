import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import TopBar from "../../Components/Basics/TopBar";
import SignUpLeftSide from "../../Components/Authentication/Signup/SignUpLeftSide";
import LoginDivider from "../../Components/Authentication/Login/LoginDivider";
import GoogleLoginButton from "../../Components/Authentication/Login/GoogleLoginButton";
import RoleToggle from "../../Components/Authentication/Signup/RoleToggle";

import InputField, {
  UserIcon,
  MailIcon,
  PhoneIcon,
} from "../../Components/Authentication/Signup/InputField";
import PasswordField from "../../Components/Authentication/Signup/PasswordField";
import TermsCheckbox from "../../Components/Authentication/Signup/TermsCheckbox";

export default function SignUp() {
  const navigate = useNavigate();

  const [role, setRole] = useState("investor");
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
    setError("");

    if (
      !form.firstName ||
      !form.lastName ||
      !form.userName ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.confirm
    ) {
      return setError("Please fill all fields.");
    }

    if (form.password !== form.confirm)
      return setError("Passwords do not match.");
    if (!agreed) return setError("Please accept the Terms & Conditions.");
    setLoading(true);

    try {
      // ✅ التغيير الثاني: endpoint مختلف لكل role، وبنبعت confirmPassword للـ Backend
      const endpoint =
        role === "founder"
          ? "https://investry.runasp.net/api/Auth/register-founder"
          : "https://investry.runasp.net/api/Auth/register-investor";

      const res = await axios.post(endpoint, {
        firstName: form.firstName,
        lastName: form.lastName,
        userName: form.userName,
        email: form.email,
        phoneNumber: form.phone.replace(/\s+/g, ""),
        password: form.password,
        confirmPassword: form.confirm,
      });
    
      const { token, roles } = res.data.data;

      const roleName = Array.isArray(roles) ? roles[0] : roles;
  localStorage.setItem("email", form.email);
      localStorage.setItem("token", token);
      localStorage.setItem("role", roleName);

      navigate("/email-check");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.message || err.response?.data?.message;
      setError(msg || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* ══ LEFT ══ */}
      <SignUpLeftSide />

      {/* ══ RIGHT ══ */}
      <div className="w-full lg:w-1/2 bg-gray-100 overflow-y-auto relative">
        <div className="absolute top-3 right-6 z-20">
          <TopBar />
        </div>

        <div className="flex justify-center px-6 pt-14 pb-10">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-7 py-4">
            <h2 className="text-xl font-bold text-[#1a2340] mb-0.5">
              Create an Account
            </h2>
            <p className="text-gray-400 text-xs mb-3">
              Join our platform to start investing or raising funds.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg mb-2">
                {error}
              </div>
            )}

            {/* Role Toggle */}
            <RoleToggle role={role} onRoleChange={setRole} />

            {/* ✅ التغيير الثالث: First Name + Last Name جنب بعض */}
            <div className="flex gap-2 mb-1.5">
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

            {/* ✅ التغيير الرابع: Username field جديد */}
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

            {/* Password,,confirmPassword */}
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

            {/* Confirm Password */}

            {/* Terms */}
            <TermsCheckbox agreed={agreed} onAgreeChange={setAgreed} />

            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-[#1a2340] hover:bg-[#243060] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 text-sm"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <LoginDivider />
            <div className="mb-3">
              <GoogleLoginButton onSuccess={() => {}} onError={() => {}} />
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#C9A84C] font-semibold hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
