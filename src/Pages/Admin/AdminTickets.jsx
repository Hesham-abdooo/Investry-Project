import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  FiSearch, FiEye, FiCheck, FiX, FiCheckCircle,
  FiMessageCircle, FiAlertCircle, FiUser,
  FiCalendar, FiMail, FiTag, FiSend, FiLoader, FiRefreshCw, FiAlertTriangle,
} from "react-icons/fi";
import { getAdminTickets, replyToTicket } from "../../Api/adminTicketsService";

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

const STATUS_COLORS = {
  Open: { bg: "#FEF9EC", color: "#D4A017", label: "Open" },
  Resolved: { bg: "#ECFDF5", color: "#059669", label: "Resolved" },
};

const ROLE_COLORS = {
  Founder: { bg: "#0F2044", color: "#ffffff" },
  Investor: { bg: "#FEF9EC", color: "#D4A017" },
};

const CATEGORY_COLORS = {
  Payment: "#3B82F6",
  Project: "#8B5CF6",
  Account: "#D4A017",
  Technical: "#EF4444",
  Other: "#94a3b8",
};

/* ═══════════ Toast ═══════════ */
function Toast({ message, type }) {
  return (
    <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, padding: "14px 24px", borderRadius: 12, backgroundColor: "#059669", color: "white", fontSize: 13, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 8, animation: "slideIn 0.3s ease" }}>
      <FiCheckCircle size={16} /> {message}
      <style>{`@keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}

/* ═══════════ Avatar ═══════════ */
function UserAvatar({ name }) {
  const initials = (name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #0F2044, #1a3a6a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{initials}</span>
    </div>
  );
}

/* ═══════════ Detail Modal ═══════════ */
function TicketModal({ ticket, onClose, onResolve }) {
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  if (!ticket) return null;
  const sc = STATUS_COLORS[ticket.status] || STATUS_COLORS.Open;
  const rc = ROLE_COLORS[ticket.userRole] || ROLE_COLORS.Investor;
  const isOpen = ticket.status === "Open";

  const handleSendReply = () => {
    if (!reply.trim()) return;
    setSending(true);
    setTimeout(() => {
      onResolve(ticket, reply);
      setSending(false);
    }, 600);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div style={{ position: "relative", backgroundColor: "white", borderRadius: 20, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "28px 28px 24px" }}>
        {/* Close */}
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: "50%", border: "none", backgroundColor: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#f5f5f5"; e.currentTarget.style.color = "#0F2044"; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}>
          <FiX size={18} />
        </button>

        {/* Status Badge */}
        <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 8, backgroundColor: sc.bg, color: sc.color, textTransform: "uppercase", marginBottom: 12 }}>{sc.label}</span>

        {/* Subject */}
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0F2044", margin: "0 0 16px", paddingRight: 32 }}>{ticket.subject}</h2>

        {/* User Info Grid */}
        <div style={{ backgroundColor: "#fafbfc", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: FiUser, label: "Name", value: ticket.userName },
              { icon: FiTag, label: "Role", value: ticket.userRole, isBadge: true },
              { icon: FiMail, label: "Email", value: ticket.userEmail },
              { icon: FiCalendar, label: "Date", value: fmtDate(ticket.createdAt) },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <item.icon size={13} style={{ color: "#94a3b8", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: 9, color: "#94a3b8", margin: "0 0 3px", textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.3 }}>{item.label}</p>
                  {item.isBadge ? (
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 6, backgroundColor: rc.bg, color: rc.color }}>{item.value}</span>
                  ) : (
                    <p style={{ fontSize: 12, color: "#0F2044", margin: 0, fontWeight: 500 }}>{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>Category:</span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 6, backgroundColor: `${CATEGORY_COLORS[ticket.category] || "#94a3b8"}15`, color: CATEGORY_COLORS[ticket.category] || "#94a3b8" }}>{ticket.category}</span>
        </div>

        {/* Message */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", margin: "0 0 8px" }}>User Message</p>
          <div style={{ backgroundColor: "#fafbfc", borderRadius: 12, padding: 16, maxHeight: 160, overflowY: "auto" }}>
            <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>{ticket.message}</p>
          </div>
        </div>

        {/* Admin Reply / Resolved Info */}
        {isOpen ? (
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", margin: "0 0 8px" }}>Your Reply</p>
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Type your reply... This will be sent to the user's email."
              style={{ width: "100%", minHeight: 100, borderRadius: 12, border: "1.5px solid #f0f0f0", padding: 14, fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.6, transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "#059669"}
              onBlur={e => e.target.style.borderColor = "#f0f0f0"}
            />
            <p style={{ fontSize: 11, color: "#94a3b8", margin: "6px 0 14px", display: "flex", alignItems: "center", gap: 4 }}>
              <FiMail size={11} /> Reply will be sent to <strong style={{ color: "#0F2044" }}>{ticket.userEmail}</strong>
            </p>
            <button
              onClick={handleSendReply}
              disabled={!reply.trim() || sending}
              style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", backgroundColor: reply.trim() && !sending ? "#059669" : "#94a3b8", fontSize: 13, fontWeight: 600, color: "white", cursor: reply.trim() && !sending ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}
              onMouseEnter={e => { if (reply.trim() && !sending) e.currentTarget.style.backgroundColor = "#047857"; }}
              onMouseLeave={e => { if (reply.trim() && !sending) e.currentTarget.style.backgroundColor = "#059669"; }}>
              {sending ? "Sending..." : <><FiSend size={14} /> Send Reply & Resolve</>}
            </button>
          </div>
        ) : (
          <div>
            {ticket.adminReply && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", margin: "0 0 8px" }}>Admin Reply</p>
                <div style={{ backgroundColor: "#ECFDF5", borderRadius: 12, padding: 14, border: "1px solid rgba(5,150,105,0.1)" }}>
                  <p style={{ fontSize: 13, color: "#065f46", margin: 0, lineHeight: 1.7 }}>{ticket.adminReply}</p>
                </div>
              </div>
            )}
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#059669" }}>
                <FiCheckCircle size={15} /> This ticket has been resolved
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════ MAIN PAGE ═══════════ */
export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Fetch tickets from API ── */
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getAdminTickets();
      setTickets(list);
    } catch (err) {
      console.error("Failed to load tickets:", err);
      setError("Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  /* ── Reply & resolve via API ── */
  const handleResolve = async (ticket, replyText) => {
    try {
      await replyToTicket(ticket.id, replyText);
      showToast(`Reply sent to ${ticket.userEmail}`);
      setSelectedTicket(null);
      await fetchTickets();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || "Failed to send reply";
      showToast(msg);
    }
  };

  const filtered = useMemo(() => {
    let list = tickets;
    if (activeTab !== "All") list = list.filter(t => t.status === activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => t.userName.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.userEmail.toLowerCase().includes(q));
    }
    return list;
  }, [tickets, activeTab, searchQuery]);

  const counts = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "Open").length,
    resolved: tickets.filter(t => t.status === "Resolved").length,
  };

  const tabs = [
    { key: "All", label: "All Tickets", count: counts.total },
    { key: "Open", label: "Open", count: counts.open },
    { key: "Resolved", label: "Resolved", count: counts.resolved },
  ];

  const summaryCards = [
    { label: "Total Tickets", value: counts.total, icon: FiMessageCircle, color: "#3B82F6", bg: "#EFF6FF" },
    { label: "Open", value: counts.open, icon: FiAlertCircle, color: "#D4A017", bg: "#FEF9EC" },
    { label: "Resolved", value: counts.resolved, icon: FiCheckCircle, color: "#059669", bg: "#ECFDF5" },
  ];

  return (
    <div style={{ padding: "8px 0" }}>
      {toast && <Toast message={toast} />}
      {selectedTicket && <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} onResolve={handleResolve} />}

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0F2044", margin: "0 0 4px" }}>Support Tickets</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Manage support messages from founders and investors</p>
      </div>

      {/* Summary Cards */}
      <div className="tickets-summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {summaryCards.map((card, i) => (
          <div key={i} style={{ backgroundColor: "white", borderRadius: 14, border: "1.5px solid #f0f0f0", padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, transition: "box-shadow 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
            <div style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: card.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <card.icon size={20} style={{ color: card.color }} />
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", margin: "0 0 2px" }}>{card.label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#0F2044", margin: 0 }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Tabs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 4, borderBottom: "1.5px solid #f0f0f0", flex: 1, minWidth: 200 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding: "10px 16px", fontSize: 13, fontWeight: activeTab === t.key ? 600 : 400, color: activeTab === t.key ? "#D4A017" : "#94a3b8", backgroundColor: "transparent", border: "none", borderBottom: activeTab === t.key ? "2px solid #D4A017" : "2px solid transparent", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6, marginBottom: -1.5 }}>
              {t.label}
              <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 20, backgroundColor: activeTab === t.key ? "#FEF9EC" : "#f5f5f5", color: activeTab === t.key ? "#D4A017" : "#94a3b8" }}>{t.count}</span>
            </button>
          ))}
        </div>
        <div style={{ position: "relative", minWidth: 220 }}>
          <FiSearch size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search tickets..." style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 12, border: "1.5px solid #f0f0f0", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#D4A017"} onBlur={e => e.target.style.borderColor = "#f0f0f0"} />
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", overflow: "hidden" }}>
        {/* Table Header */}
        <div className="tickets-table-header" style={{ display: "flex", alignItems: "center", padding: "12px 20px", backgroundColor: "#fafbfc", borderBottom: "1px solid #f0f0f0" }}>
          <span style={{ width: "22%", flexShrink: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8" }}>User</span>
          <span className="col-role" style={{ width: "8%", flexShrink: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", textAlign: "center" }}>Role</span>
          <span className="col-category" style={{ width: "10%", flexShrink: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", textAlign: "center" }}>Category</span>
          <span style={{ flex: 1, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8" }}>Subject</span>
          <span className="col-date" style={{ width: "10%", flexShrink: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", textAlign: "center" }}>Date</span>
          <span style={{ width: "9%", flexShrink: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", textAlign: "center" }}>Status</span>
          <span style={{ width: "9%", flexShrink: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", textAlign: "right" }}>Actions</span>
        </div>

        {/* Rows */}
        {loading ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <FiLoader size={24} style={{ color: "#D4A017", marginBottom: 8, animation: "tkSpin 1s linear infinite" }} />
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Loading tickets...</p>
          </div>
        ) : error ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <FiAlertTriangle size={32} style={{ color: "#EF4444", marginBottom: 8 }} />
            <p style={{ fontSize: 14, color: "#EF4444", margin: "0 0 12px", fontWeight: 600 }}>{error}</p>
            <button onClick={fetchTickets} style={{ padding: "8px 20px", borderRadius: 10, border: "1.5px solid #f0f0f0", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#0F2044", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <FiRefreshCw size={13} /> Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <FiMessageCircle size={32} style={{ color: "#e2e8f0", marginBottom: 8 }} />
            <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>No support tickets found</p>
          </div>
        ) : (
          filtered.map(t => {
            const sc = STATUS_COLORS[t.status] || STATUS_COLORS.Open;
            const rc = ROLE_COLORS[t.userRole] || ROLE_COLORS.Investor;
            const isOpen = t.status === "Open";
            return (
              <div key={t.id} className="tickets-table-row" style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #f5f5f5", transition: "background 0.15s", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fafbfc"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "white"}
                onClick={() => setSelectedTicket(t)}>
                {/* User */}
                <div style={{ width: "22%", flexShrink: 0, display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <UserAvatar name={t.userName} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#0F2044", margin: "0 0 1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.userName}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.userEmail}</p>
                  </div>
                </div>
                {/* Role */}
                <div className="col-role" style={{ width: "8%", flexShrink: 0, textAlign: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 6, backgroundColor: rc.bg, color: rc.color }}>{t.userRole}</span>
                </div>
                {/* Category */}
                <div className="col-category" style={{ width: "10%", flexShrink: 0, textAlign: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: CATEGORY_COLORS[t.category] || "#94a3b8" }}>{t.category}</span>
                </div>
                {/* Subject */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#0F2044", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.subject}</p>
                </div>
                {/* Date */}
                <div className="col-date" style={{ width: "10%", flexShrink: 0, textAlign: "center" }}>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{fmtDate(t.createdAt)}</p>
                </div>
                {/* Status */}
                <div style={{ width: "9%", flexShrink: 0, textAlign: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6, backgroundColor: sc.bg, color: sc.color, textTransform: "uppercase" }}>{sc.label}</span>
                </div>
                {/* Actions */}
                <div style={{ width: "9%", flexShrink: 0, display: "flex", justifyContent: "flex-end", gap: 6 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => setSelectedTicket(t)} title="View" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", backgroundColor: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#0F2044"; e.currentTarget.style.color = "#0F2044"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#64748b"; }}>
                    <FiEye size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Responsive Styles */}
      <style>{`
        @keyframes tkSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .col-category, .col-date { display: none !important; }
        }
        @media (max-width: 768px) {
          .col-role { display: none !important; }
          .tickets-table-header { display: none !important; }
          .tickets-table-row { flex-wrap: wrap; gap: 8px; }
          .tickets-summary-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
