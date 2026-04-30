import React, { useState } from "react";
import {
  FiSend, FiCheckCircle, FiMail, FiClock,
  FiMessageCircle, FiChevronDown, FiRefreshCw,
} from "react-icons/fi";

const CATEGORIES = [
  { value: "", label: "Select a category" },
  { value: "Account", label: "Account & Profile" },
  { value: "Payment", label: "Payment & Wallet" },
  { value: "Project", label: "Project Related" },
  { value: "Technical", label: "Technical Issue" },
  { value: "Other", label: "Other" },
];

const CONTACT_INFO = [
  { icon: FiMail, label: "Email", value: "support@investry.com" },
  { icon: FiClock, label: "Working Hours", value: "Sun–Thu, 9AM – 5PM" },
  { icon: FiMessageCircle, label: "Response Time", value: "Within 24 hours" },
];

/* ═══════════ Success State ═══════════ */
function SuccessView({ onReset, accentColor }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px" }}>
      {/* Icon */}
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <FiCheckCircle size={32} style={{ color: "#059669" }} />
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0F2044", margin: "0 0 8px" }}>
        Message Sent Successfully!
      </h2>
      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, margin: "0 0 28px", maxWidth: 360, marginLeft: "auto", marginRight: "auto" }}>
        Our team will review your message and get back to you as soon as possible. Thank you for reaching out.
      </p>

      <button
        onClick={onReset}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, border: "1.5px solid #e5e7eb", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#64748b", cursor: "pointer", transition: "all 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fafafa"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "white"}
      >
        <FiRefreshCw size={14} /> Send Another Message
      </button>
    </div>
  );
}

/* ═══════════ MAIN COMPONENT ═══════════ */
export default function SupportForm({ variant = "founder" }) {
  const isFounder = variant === "founder";
  const accent = isFounder ? "#0F2044" : "#D4A017";

  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const validate = () => {
    const errs = {};
    if (!category) errs.category = "Please select a category";
    if (!subject.trim()) errs.subject = "Please enter a subject";
    if (!message.trim()) errs.message = "Please describe your issue";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    // Simulate send (replace with API later)
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setCategory("");
    setSubject("");
    setMessage("");
    setErrors({});
    setSubmitted(false);
  };

  const inputBase = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    border: "1.5px solid #f0f0f0",
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    backgroundColor: "white",
    color: "#0F2044",
  };

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#0F2044",
    marginBottom: 6,
  };

  const errorStyle = {
    fontSize: 11,
    color: "#EF4444",
    marginTop: 4,
  };

  const handleFocus = (e) => { e.target.style.borderColor = "#D4A017"; };
  const handleBlur = (e) => { e.target.style.borderColor = "#f0f0f0"; };

  return (
    <div style={{ padding: "8px 0" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: accent, margin: "0 0 4px" }}>Support Center</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Have a question or issue? We're here to help.</p>
      </div>

      {/* Form Card */}
      <div>
        <div style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", padding: 28, marginBottom: 20 }}>

          {submitted ? (
            <SuccessView onReset={handleReset} accentColor={accent} />
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Category */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>
                  Category <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={category}
                    onChange={e => { setCategory(e.target.value); setErrors(prev => ({ ...prev, category: null })); }}
                    style={{
                      ...inputBase,
                      appearance: "none",
                      paddingRight: 40,
                      color: category ? "#0F2044" : "#94a3b8",
                      borderColor: errors.category ? "#EF4444" : "#f0f0f0",
                      cursor: "pointer",
                    }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value} disabled={!c.value}>{c.label}</option>
                    ))}
                  </select>
                  <FiChevronDown size={16} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                </div>
                {errors.category && <p style={errorStyle}>{errors.category}</p>}
              </div>

              {/* Subject */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>
                  Subject <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => { setSubject(e.target.value); setErrors(prev => ({ ...prev, subject: null })); }}
                  placeholder="Brief description of your issue"
                  style={{ ...inputBase, borderColor: errors.subject ? "#EF4444" : "#f0f0f0" }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                {errors.subject && <p style={errorStyle}>{errors.subject}</p>}
              </div>

              {/* Message */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>
                  Message <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <textarea
                  value={message}
                  onChange={e => { setMessage(e.target.value); setErrors(prev => ({ ...prev, message: null })); }}
                  placeholder="Describe your issue in detail so we can help you better..."
                  style={{ ...inputBase, minHeight: 140, resize: "vertical", lineHeight: 1.6, borderColor: errors.message ? "#EF4444" : "#f0f0f0" }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                {errors.message && <p style={errorStyle}>{errors.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={sending}
                style={{
                  width: "100%",
                  padding: "14px 0",
                  borderRadius: 12,
                  border: "none",
                  backgroundColor: sending ? "#94a3b8" : accent,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "white",
                  cursor: sending ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                onMouseEnter={e => { if (!sending) e.currentTarget.style.opacity = "0.9"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
              >
                {sending ? (
                  <>Sending...</>
                ) : (
                  <><FiSend size={15} /> Submit Message</>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="support-contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {CONTACT_INFO.map((item, i) => (
            <div key={i} style={{ backgroundColor: "#fafbfc", borderRadius: 12, padding: 16, border: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#FEF9EC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <item.icon size={14} style={{ color: "#D4A017" }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8" }}>{item.label}</span>
              </div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#0F2044", margin: 0, paddingLeft: 42 }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .support-contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
