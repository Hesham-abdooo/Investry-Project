import React from "react";
import axiosInstance from "../../../src/Api/axiosInstance.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../Components/Basics/TopBar";
import LoginForm from "../../Components/Authentication/Login/LoginForm";
import Logo from "../../Components/Basics/Logo";

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
      const res = await axiosInstance.post("/Auth/login", { email, password });
      const { token, roles } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", roles[0].toLowerCase());
      const role = roles[0].toLowerCase();
      if (role === "investor") navigate("/investor");
      else if (role === "founder") navigate("/founder");
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.message;
      if (msg?.toLowerCase().includes("not confirmed")) {
        localStorage.setItem("email", email);
        setError("Please confirm your email first. Redirecting to verification page...");
        setTimeout(() => navigate("/email-check"), 3000);
        return;
      }
      setError(msg || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = ({ token, roles }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", roles?.[0] || roles);
    const userRole = (roles?.[0] || roles)?.toLowerCase();
    if (userRole === "investor") navigate("/investor");
    else if (userRole === "founder") navigate("/founder");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6f8] px-4 py-10" style={{ fontFamily: '"Inter", sans-serif' }}>
      <div className="w-full max-w-[440px]">
        <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.07)] border border-gray-100 px-8 sm:px-10 py-10">

          {/* Logo centered */}
          <div className="flex justify-center mb-8">
            <Logo to="/" />
          </div>

          <LoginForm
            email={email}
            password={password}
            loading={loading}
            error={error}
            showPassword={showPassword}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onLogin={handleLogin}
            onGoogleSuccess={handleGoogleSuccess}
            onError={setError}
          />
        </div>

        <p className="text-center text-xs text-gray-400 mt-16">
          By continuing, you agree to InvesTry's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
