import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiArrowLeft, FiDollarSign } from "react-icons/fi";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [animate, setAnimate] = useState(false);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  /* Auto-redirect after 5 seconds */
  useEffect(() => {
    const role = localStorage.getItem("role")?.toLowerCase();
    const timer = setTimeout(() => {
      if (role === "founder") navigate("/founder/wallet");
      else navigate("/investor/wallet");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const role = localStorage.getItem("role")?.toLowerCase();
  const walletPath = role === "founder" ? "/founder/wallet" : "/investor/wallet";

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f8f9fc 0%, #eef1f5 100%)",
      fontFamily: '"Inter", -apple-system, sans-serif',
      padding: 20,
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: 24,
        padding: "48px 40px",
        maxWidth: 460,
        width: "100%",
        textAlign: "center",
        boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
        border: "1px solid #f0f0f0",
        transform: animate ? "translateY(0)" : "translateY(20px)",
        opacity: animate ? 1 : 0,
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        {/* Success Icon */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
          transform: animate ? "scale(1)" : "scale(0.5)",
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s",
        }}>
          <FiCheckCircle size={40} style={{ color: "#059669" }} />
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 26,
          fontWeight: 800,
          color: "#0F2044",
          margin: "0 0 8px",
          letterSpacing: -0.5,
        }}>
          Payment Successful!
        </h1>

        <p style={{
          fontSize: 15,
          color: "#64748b",
          margin: "0 0 28px",
          lineHeight: 1.6,
        }}>
          Your deposit has been processed successfully. <br />
          Your wallet balance will be updated shortly.
        </p>

        {/* Info Card */}
        <div style={{
          background: "#FAFBFC",
          borderRadius: 14,
          padding: "16px 20px",
          marginBottom: 28,
          border: "1px solid #f0f0f0",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FEF9EC", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiDollarSign size={18} style={{ color: "#D4A017" }} />
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>Transaction Status</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#059669", margin: 0 }}>Completed ✓</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(walletPath)}
          style={{
            width: "100%",
            padding: "14px 0",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #0F2044, #1a3260)",
            color: "white",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.2s",
            marginBottom: 12,
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "none"}
        >
          <FiArrowLeft size={16} /> Back to Wallet
        </button>

        {/* Auto-redirect notice */}
        <p style={{ fontSize: 11, color: "#cbd5e1", margin: 0 }}>
          You will be redirected automatically in 5 seconds...
        </p>
      </div>
    </div>
  );
}
