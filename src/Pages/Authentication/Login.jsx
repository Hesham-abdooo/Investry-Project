import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import TopBar from "../../Components/Basics/TopBar";
import LoginLeftSide from "../../Components/Authentication/Login/LoginLeftSide";
import LoginForm from "../../Components/Authentication/Login/LoginForm";

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
      const res = await axios.post(
        "https://investry.runasp.net/api/Auth/login",
        { email, password },
        { withCredentials: true },
      );

      const { token, roles } = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", roles[0]);

      if (roles[0] === "Investor") {
        navigate("/investor/investorDashboard");
      } else if (roles[0] === "Founder") {
        navigate("/founder/founderDashboard");
      }
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.message;
      // لو الايميل مش confirmed
      if (msg?.toLowerCase().includes("not confirmed")) {
        // نخزن الايميل عشان resend
        localStorage.setItem("email", email);
        // رسالة ألطف للمستخدم
        setError(
          "Please confirm your email first. Redirecting to verification page...",
        );
        // بعد 3 ثواني نوديه صفحة  email check
        setTimeout(() => {
          navigate("/email-check");
        }, 3000);
        return;
      }

      setError(msg || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = ({ token, roles }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", roles[0]);

    if (roles[0] === "Investor") {
      navigate("/investor/investorDashboard");
    } else if (roles[0] === "Founder") {
      navigate("/founder/founderDashboard");
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <LoginLeftSide />

      <div className="w-full lg:w-1/2 flex flex-col bg-white overflow-y-auto">
        <div className="flex justify-end px-8 py-3">
          <TopBar />
        </div>

        <div className="flex-1 flex items-center justify-center px-8">
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
      </div>
    </div>
  );
}
