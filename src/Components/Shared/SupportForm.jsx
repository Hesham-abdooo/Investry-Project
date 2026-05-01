import React, { useState } from "react";
import {
  FiSend, FiCheckCircle, FiMail, FiClock,
  FiMessageCircle, FiChevronDown, FiRefreshCw,
  FiInbox, FiChevronRight,
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
function SuccessView({ onReset }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px" }}>
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

/* ═══════════ Ticket Card ═══════════ */
function TicketCard({ ticket, isExpanded, onToggle }) {
  const isResolved = ticket.status === "Resolved";
  return (
    <div style={{ backgroundColor: "white", borderRadius: 14, border: "1.5px solid #f0f0f0", overflow: "hidden", transition: "box-shadow 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
      {/* Header */}
      <div onClick={onToggle} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", cursor: "pointer", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: isResolved ? "#059669" : "#D4A017", flexShrink: 0 }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0F2044", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ticket.subject}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 6, backgroundColor: isResolved ? "#ECFDF5" : "#FEF9EC", color: isResolved ? "#059669" : "#D4A017", textTransform: "uppercase" }}>{ticket.status}</span>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>{ticket.category}</span>
              <span style={{ fontSize: 11, color: "#cbd5e1" }}>•</span>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>{ticket.date}</span>
            </div>
          </div>
        </div>
        <FiChevronRight size={16} style={{ color: "#94a3b8", transition: "transform 0.2s", transform: isExpanded ? "rotate(90deg)" : "rotate(0)", flexShrink: 0 }} />
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{ borderTop: "1px solid #f0f0f0", padding: "16px 18px" }}>
          <div style={{ marginBottom: ticket.adminReply ? 14 : 0 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", margin: "0 0 6px" }}>Your Message</p>
            <div style={{ backgroundColor: "#fafbfc", borderRadius: 10, padding: 12 }}>
              <p style={{ fontSize: 12, color: "#374151", margin: 0, lineHeight: 1.6 }}>{ticket.message}</p>
            </div>
          </div>

          {ticket.adminReply && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, color: "#059669", textTransform: "uppercase", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 4 }}>
                <FiCheckCircle size={10} /> Admin Reply
              </p>
              <div style={{ backgroundColor: "#ECFDF5", borderRadius: 10, padding: 12, border: "1px solid rgba(5,150,105,0.1)" }}>
                <p style={{ fontSize: 12, color: "#065f46", margin: 0, lineHeight: 1.6 }}>{ticket.adminReply}</p>
              </div>
            </div>
          )}

          {!ticket.adminReply && !isResolved && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
              <FiClock size={12} style={{ color: "#D4A017" }} />
              <span style={{ fontSize: 11, color: "#D4A017", fontWeight: 500 }}>Waiting for admin response...</span>
            </div>
          )}
        </div>
      )}
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

  // My Tickets — empty for now, will come from API
  const [myTickets] = useState([]);
  const [expandedTicket, setExpandedTicket] = useState(null);

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

  const errorStyle = { fontSize: 11, color: "#EF4444", marginTop: 4 };

  const handleFocus = (e) => { e.target.style.borderColor = "#D4A017"; };
  const handleBlur = (e) => { e.target.style.borderColor = "#f0f0f0"; };

  return (
    <div style={{ padding: "8px 0" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: accent, margin: "0 0 4px" }}>Support Center</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Have a question or issue? We're here to help.</p>
      </div>

      {/* Two-column layout */}
      <div className="support-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* ═══ Left — New Message Form ═══ */}
        <div>
          <div style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", padding: 28, marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F2044", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
              <FiSend size={15} style={{ color: accent }} /> New Message
            </h3>

            {submitted ? (
              <SuccessView onReset={handleReset} />
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Category <span style={{ color: "#EF4444" }}>*</span></label>
                  <div style={{ position: "relative" }}>
                    <select value={category} onChange={e => { setCategory(e.target.value); setErrors(prev => ({ ...prev, category: null })); }}
                      style={{ ...inputBase, appearance: "none", paddingRight: 40, color: category ? "#0F2044" : "#94a3b8", borderColor: errors.category ? "#EF4444" : "#f0f0f0", cursor: "pointer" }}
                      onFocus={handleFocus} onBlur={handleBlur}>
                      {CATEGORIES.map(c => (<option key={c.value} value={c.value} disabled={!c.value}>{c.label}</option>))}
                    </select>
                    <FiChevronDown size={16} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                  </div>
                  {errors.category && <p style={errorStyle}>{errors.category}</p>}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Subject <span style={{ color: "#EF4444" }}>*</span></label>
                  <input type="text" value={subject} onChange={e => { setSubject(e.target.value); setErrors(prev => ({ ...prev, subject: null })); }}
                    placeholder="Brief description of your issue"
                    style={{ ...inputBase, borderColor: errors.subject ? "#EF4444" : "#f0f0f0" }}
                    onFocus={handleFocus} onBlur={handleBlur} />
                  {errors.subject && <p style={errorStyle}>{errors.subject}</p>}
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Message <span style={{ color: "#EF4444" }}>*</span></label>
                  <textarea value={message} onChange={e => { setMessage(e.target.value); setErrors(prev => ({ ...prev, message: null })); }}
                    placeholder="Describe your issue in detail so we can help you better..."
                    style={{ ...inputBase, minHeight: 120, resize: "vertical", lineHeight: 1.6, borderColor: errors.message ? "#EF4444" : "#f0f0f0" }}
                    onFocus={handleFocus} onBlur={handleBlur} />
                  {errors.message && <p style={errorStyle}>{errors.message}</p>}
                </div>

                <button type="submit" disabled={sending}
                  style={{ width: "100%", padding: "14px 0", borderRadius: 12, border: "none", backgroundColor: sending ? "#94a3b8" : accent, fontSize: 14, fontWeight: 600, color: "white", cursor: sending ? "not-allowed" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  onMouseEnter={e => { if (!sending) e.currentTarget.style.opacity = "0.9"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
                  {sending ? <>Sending...</> : <><FiSend size={15} /> Submit Message</>}
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

        {/* ═══ Right — My Tickets ═══ */}
        <div>
          <div style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", padding: 28, minHeight: 300 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F2044", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
              <FiInbox size={15} style={{ color: accent }} /> My Tickets
              {myTickets.length > 0 && (
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, backgroundColor: "#FEF9EC", color: "#D4A017", marginLeft: 4 }}>{myTickets.length}</span>
              )}
            </h3>

            {myTickets.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <FiInbox size={24} style={{ color: "#e2e8f0" }} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", margin: "0 0 6px" }}>No tickets yet</p>
                <p style={{ fontSize: 12, color: "#cbd5e1", margin: 0, lineHeight: 1.6, maxWidth: 260, marginLeft: "auto", marginRight: "auto" }}>
                  When you submit a support message, it will appear here with any replies from our team.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {myTickets.map(t => (
                  <TicketCard
                    key={t.id}
                    ticket={t}
                    isExpanded={expandedTicket === t.id}
                    onToggle={() => setExpandedTicket(expandedTicket === t.id ? null : t.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          .support-layout { grid-template-columns: 1fr !important; }
          .support-contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
