import React from "react";
import {
  FiUsers, FiBriefcase, FiDollarSign, FiMessageSquare,
  FiLock, FiTrendingUp, FiArrowRight, FiClock,
  FiCheckCircle, FiShield,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { dashboardStats, pendingProjects, supportTickets } from "../../Data/adminMockData";

/* ── Format helpers ── */
const fmt = (n) => Number(n || 0).toLocaleString("en-US");
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: "Total Users", value: fmt(dashboardStats.totalUsers), sub: `${fmt(dashboardStats.totalFounders)} Founders · ${fmt(dashboardStats.totalInvestors)} Investors`, icon: FiUsers, color: "#0F2044", bg: "#F0F4F8" },
    { label: "Pending Review", value: fmt(dashboardStats.pendingProjects), sub: "Projects awaiting approval", icon: FiBriefcase, color: "#D4A017", bg: "#FEF9EC" },
    { label: "Total Raised", value: `EGP ${fmt(dashboardStats.totalRaised)}`, sub: `${dashboardStats.publishedProjects} active projects`, icon: FiDollarSign, color: "#059669", bg: "#ECFDF5" },
    { label: "Open Tickets", value: fmt(dashboardStats.openTickets), sub: "Support requests pending", icon: FiMessageSquare, color: "#EF4444", bg: "#FEF2F2" },
    { label: "Escrow Balance", value: `EGP ${fmt(dashboardStats.escrowBalance)}`, sub: "Awaiting release", icon: FiLock, color: "#3B82F6", bg: "#EFF6FF" },
  ];

  const recentPending = pendingProjects.slice(0, 4);
  const recentTickets = supportTickets.filter(t => t.status === "Open").slice(0, 4);

  return (
    <div style={{ padding: "8px 0" }}>
      {/* ── Hero Banner ── */}
      <div style={{ background: "linear-gradient(135deg, #0F2044 0%, #1a3260 50%, #0F2044 100%)", borderRadius: 20, padding: "28px 28px 24px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(212,160,23,0.08)" }} />
        <div style={{ position: "absolute", bottom: -30, right: 80, width: 100, height: 100, borderRadius: "50%", background: "rgba(212,160,23,0.05)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <FiShield size={18} style={{ color: "#D4A017" }} />
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Admin Panel</p>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "white", margin: "0 0 6px" }}>
            Welcome back, <span style={{ color: "#D4A017" }}>Admin</span>
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            Here's what's happening on InvesTry today.
          </p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", padding: "18px 16px", transition: "all 0.25s", cursor: "default" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", margin: 0 }}>{s.label}</p>
            </div>
            <p style={{ fontSize: 22, fontWeight: 700, color: s.color, margin: "0 0 2px" }}>{s.value}</p>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Two Column: Pending Projects + Open Tickets ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }} className="actions-grid">

        {/* Pending Projects */}
        <div style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f5f5f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FiClock size={14} style={{ color: "#D4A017" }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: "#0F2044", margin: 0 }}>Pending Projects</p>
            </div>
            <button onClick={() => navigate("/admin/projects")} style={{ fontSize: 11, fontWeight: 600, color: "#D4A017", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              View All <FiArrowRight size={12} />
            </button>
          </div>
          <div style={{ padding: "8px 20px 16px" }}>
            {recentPending.map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < recentPending.length - 1 ? "1px solid #f9fafb" : "none" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, overflow: "hidden", flexShrink: 0, backgroundColor: "#f3f4f6" }}>
                  <img src={p.coverImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#0F2044", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{p.founderName} · {p.fundingModel}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#D4A017", margin: "0 0 2px" }}>EGP {fmt(p.targetAmount)}</p>
                  <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>{fmtDate(p.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Tickets */}
        <div style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f5f5f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FiMessageSquare size={14} style={{ color: "#EF4444" }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: "#0F2044", margin: 0 }}>Open Tickets</p>
            </div>
            <button onClick={() => navigate("/admin/tickets")} style={{ fontSize: 11, fontWeight: 600, color: "#D4A017", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              View All <FiArrowRight size={12} />
            </button>
          </div>
          <div style={{ padding: "8px 20px 16px" }}>
            {recentTickets.map((t, i) => {
              const pColor = t.priority === "High" ? "#EF4444" : t.priority === "Medium" ? "#D4A017" : "#059669";
              return (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < recentTickets.length - 1 ? "1px solid #f9fafb" : "none" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: pColor, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#0F2044", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.subject}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{t.userName} · {t.userRole}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 6, backgroundColor: `${pColor}15`, color: pColor, textTransform: "uppercase" }}>{t.priority}</span>
                    <p style={{ fontSize: 10, color: "#94a3b8", margin: "4px 0 0" }}>{fmtDate(t.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: "#94a3b8", margin: "0 0 12px" }}>Quick Actions</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }} className="actions-grid">
        {[
          { icon: FiBriefcase, title: "Review Projects", sub: `${dashboardStats.pendingProjects} pending`, path: "/admin/projects", color: "#D4A017", bg: "#FEF9EC" },
          { icon: FiUsers, title: "Manage Users", sub: `${fmt(dashboardStats.totalUsers)} total users`, path: "/admin/users", color: "#0F2044", bg: "#F0F4F8" },
          { icon: FiLock, title: "Release Escrow", sub: `EGP ${fmt(dashboardStats.escrowBalance)}`, path: "/admin/escrow", color: "#059669", bg: "#ECFDF5" },
        ].map((a, i) => (
          <div key={i} onClick={() => navigate(a.path)} style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", padding: "20px", cursor: "pointer", transition: "all 0.25s", display: "flex", alignItems: "center", gap: 14 }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "#D4A017"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "#f0f0f0"; }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: a.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <a.icon size={20} style={{ color: a.color }} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#0F2044", margin: "0 0 2px" }}>{a.title}</p>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{a.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Responsive Styles ── */}
      <style>{`
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .actions-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
