import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../Components/Basics/Logo";

/* ═══════════════════════════════════════════ */
/* ══  4-STEP STEPPER                       ══ */
/* ═══════════════════════════════════════════ */
const STEPS = ["Project details", "Deal details", "Media & docs", "Review & save"];

export function EditStepper({ currentStep = 1 }) {
  return (
    <div className="stepper-container">
      <div className="stepper-header">STEP {currentStep} OF {STEPS.length}</div>
      <div className="stepper">
        {STEPS.map((step, index) => {
          const num = index + 1;
          const isActive = num === currentStep;
          const isCompleted = num < currentStep;
          return (
            <div key={index} className="step-wrapper">
              <div className={`step-circle ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}>
                {isCompleted ? "✓" : num}
              </div>
              <div className="step-label">{step}</div>
              {index !== STEPS.length - 1 && <div className="step-line" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/* ══  SUCCESS PAGE                         ══ */
/* ═══════════════════════════════════════════ */
export function EditSuccessPage({ projectId }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="topBar">
        <Logo />
      </div>
      <div className="success_page">
        <div className="success_card">
          <div className="success_icon">✓</div>
          <h2 className="success_title">Your changes have been saved successfully.</h2>
          <p className="success_subtitle">Go to your project to view the updated details.</p>
          <button type="button" className="success_btn" onClick={() => navigate(`/founder/projects/${projectId}`)}>
            View Project
          </button>
          <button type="button" className="success_btn" style={{ backgroundColor: "transparent", color: "#0F2044", border: "1.5px solid #e5e7eb", boxShadow: "none", marginTop: 10 }} onClick={() => navigate("/founder/projects")}>
            My Projects
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════ */
/* ══  LOADING SKELETON                     ══ */
/* ═══════════════════════════════════════════ */
export function EditLoadingSkeleton() {
  const pulse = { animation: "pulse 1.5s ease-in-out infinite" };
  const bg = "#f3f4f6";
  return (
    <>
      <div className="topBar">
        <Logo />
        <button className="exit_dash" disabled>Exit to Dashboard</button>
      </div>
      <div className="page">
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
        <div className="header">
          <div style={{ ...pulse, width: 200, height: 14, borderRadius: 6, backgroundColor: bg, marginBottom: 8 }} />
          <div style={{ ...pulse, width: 260, height: 26, borderRadius: 8, backgroundColor: bg, marginBottom: 10 }} />
          <div style={{ ...pulse, width: 300, height: 14, borderRadius: 6, backgroundColor: bg }} />
        </div>
        <div className="steps">
          <div style={{ ...pulse, height: 80, borderRadius: 14, backgroundColor: "white", border: "1px solid #f0f0f0" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ ...pulse, height: 400, borderRadius: 16, backgroundColor: "white", border: "1px solid #f0f0f0" }} />
          <div style={{ ...pulse, height: 400, borderRadius: 16, backgroundColor: "white", border: "1px solid #f0f0f0" }} />
        </div>
      </div>
    </>
  );
}
