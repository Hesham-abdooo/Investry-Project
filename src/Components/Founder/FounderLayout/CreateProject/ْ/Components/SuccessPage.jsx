import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiClock, FiUsers, FiArrowRight } from "react-icons/fi";
import Logo from "../../../../../Basics/Logo";

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="topBar">
        <div className="logo">
          <Logo />
          <span>InvesTry</span>
        </div>
      </div>

      <div className="success_page">
        <div className="success_card" style={{ maxWidth: 480, textAlign: "center" }}>
          {/* Icon */}
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <FiCheckCircle size={32} style={{ color: "#059669" }} />
          </div>

          <h2 className="success_title" style={{ fontSize: 20, fontWeight: 700, color: "#0F2044", marginBottom: 8 }}>
            Project Submitted Successfully!
          </h2>

          <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, marginBottom: 24 }}>
            Your project has been sent to our admin team for review. You'll be notified once it's approved.
          </p>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28, textAlign: "left" }}>
            {/* Step 1 — Done */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, backgroundColor: "#ECFDF5", border: "1px solid rgba(5,150,105,0.15)" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#059669", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FiCheckCircle size={16} style={{ color: "white" }} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#059669", margin: 0 }}>Project Created</p>
                <p style={{ fontSize: 11, color: "#6ee7b7", margin: 0 }}>Your project details have been saved</p>
              </div>
            </div>

            {/* Step 2 — Current */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, backgroundColor: "#FEF9EC", border: "1px solid rgba(212,160,23,0.15)" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#D4A017", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FiClock size={16} style={{ color: "white" }} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#D4A017", margin: 0 }}>Pending Admin Review</p>
                <p style={{ fontSize: 11, color: "#b8941a", margin: 0 }}>Our team is reviewing your project</p>
              </div>
            </div>

            {/* Step 3 — Future */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, backgroundColor: "#f8fafc", border: "1px solid #f0f0f0" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FiUsers size={16} style={{ color: "#94a3b8" }} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", margin: 0 }}>Published to Investors</p>
                <p style={{ fontSize: 11, color: "#cbd5e1", margin: 0 }}>After approval, investors can discover your project</p>
              </div>
            </div>
          </div>

          {/* Button */}
          <button
            type="button"
            className="success_btn"
            onClick={() => navigate("/founder/projects")}
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            Go to My Projects <FiArrowRight size={15} />
          </button>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;