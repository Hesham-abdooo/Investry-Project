import React, { useState, useEffect, useCallback } from "react";
import {
  FiUsers, FiBriefcase, FiDollarSign, FiMessageSquare,
  FiLock, FiTrendingUp, FiArrowRight, FiClock,
  FiCheckCircle, FiShield, FiLoader,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getAdminUsers } from "../../Api/adminUsersService";
import { getAdminTickets } from "../../Api/adminTicketsService";
import axiosInstance from "../../Api/axiosInstance";

/* ── Format helpers ── */
const fmt = (n) => Number(n || 0).toLocaleString("en-US");
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashData, setDashData] = useState({
    totalUsers: 0, totalFounders: 0, totalInvestors: 0,
    pendingProjects: 0, publishedProjects: 0,
    totalRaised: 0, openTickets: 0, escrowBalance: 0,
  });
  const [recentPending, setRecentPending] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch data in parallel
      const [usersRes, ticketsRes, projectsRes, escrowRes] = await Promise.allSettled([
        getAdminUsers({ pageSize: 1 }),
        getAdminTickets(),
        axiosInstance.get("/Admin/projects", { params: { pageSize: 5, status: "Pending" } }),
        axiosInstance.get("/Admin/campaigns/ended"),
      ]);

      // --- Users stats ---
      if (usersRes.status === "fulfilled") {
        const totalCount = usersRes.value.totalCount || 0;
        setDashData(prev => ({ ...prev, totalUsers: totalCount }));
      }

      // --- Tickets stats ---
      if (ticketsRes.status === "fulfilled") {
        const allTickets = ticketsRes.value || [];
        const openCount = allTickets.filter(t => t.status === "Open").length;
        setDashData(prev => ({ ...prev, openTickets: openCount }));

        // Recent open tickets (top 4)
        const openTickets = allTickets
          .filter(t => t.status === "Open")
          .slice(0, 4);
        setRecentTickets(openTickets);
      }

      // --- Projects stats ---
      if (projectsRes.status === "fulfilled") {
        const payload = projectsRes.value?.data?.data ?? projectsRes.value?.data?.value ?? projectsRes.value?.data;
        let pending = [];
        let pendingCount = 0;

        if (payload?.items && Array.isArray(payload.items)) {
          pending = payload.items.slice(0, 4);
          pendingCount = payload.totalCount ?? payload.items.length;
        } else if (Array.isArray(payload)) {
          pending = payload.slice(0, 4);
          pendingCount = payload.length;
        }

        setRecentPending(pending.map(p => ({
          id: p.id || p.projectId,
          title: p.title || p.name || "",
          founderName: p.founderName || p.ownerName || "",
          fundingModel: p.fundingModel || p.fundingType || "",
          targetAmount: p.targetAmount || p.goalAmount || 0,
          coverImageUrl: p.coverImageUrl || p.imageUrl || "",
          createdAt: p.createdAt || null,
        })));
        setDashData(prev => ({ ...prev, pendingProjects: pendingCount }));
      }

      // --- Escrow stats (totalRaised + escrowBalance) ---
      if (escrowRes.status === "fulfilled") {
        const body = escrowRes.value?.data;
        const items = body?.data?.items ?? body?.data ?? body?.value ?? body;
        const list = Array.isArray(items) ? items : [];

        // Calculate total raised from all campaigns' collected amounts
        const totalRaised = list.reduce((sum, p) => sum + (p.collectedAmount || p.currentAmount || 0), 0);
        // Calculate escrow balance from pending (not yet released) campaigns
        const pendingEscrow = list
          .filter(p => (p.releaseStatus || p.projectStatus) !== "Released")
          .reduce((sum, p) => sum + (p.escrowAmount || 0), 0);
        // Count published/active projects
        const publishedCount = list.length;

        setDashData(prev => ({
          ...prev,
          totalRaised,
          escrowBalance: pendingEscrow,
          publishedProjects: publishedCount,
        }));
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const stats = [
    { label: "Total Users", value: loading ? "..." : fmt(dashData.totalUsers), sub: "Founders & Investors", icon: FiUsers, color: "#0F2044", bg: "#F0F4F8" },
    { label: "Pending Review", value: loading ? "..." : fmt(dashData.pendingProjects), sub: "Projects awaiting approval", icon: FiBriefcase, color: "#D4A017", bg: "#FEF9EC" },
    { label: "Total Raised", value: loading ? "..." : `EGP ${fmt(dashData.totalRaised)}`, sub: `${dashData.publishedProjects} active projects`, icon: FiDollarSign, color: "#059669", bg: "#ECFDF5" },
    { label: "Open Tickets", value: loading ? "..." : fmt(dashData.openTickets), sub: "Support requests pending", icon: FiMessageSquare, color: "#EF4444", bg: "#FEF2F2" },
    { label: "Escrow Balance", value: loading ? "..." : `EGP ${fmt(dashData.escrowBalance)}`, sub: "Awaiting release", icon: FiLock, color: "#3B82F6", bg: "#EFF6FF" },
  ];

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

      {/* ── Stats Bar ── */}
      <div style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", marginBottom: 28, overflow: "hidden" }}>
        <div className="stats-bar" style={{ display: "flex" }}>
          {stats.map((s, i) => (
            <div key={i} className="stats-bar-item" style={{ flex: 1, padding: "20px 16px", display: "flex", alignItems: "center", gap: 12, borderRight: i < stats.length - 1 ? "1px solid #f0f0f0" : "none", transition: "background 0.2s", cursor: "default" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fafbfc"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "white"}>
              <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <s.icon size={17} style={{ color: s.color }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", margin: "0 0 2px", whiteSpace: "nowrap" }}>{s.label}</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: s.color, margin: "0 0 1px", whiteSpace: "nowrap" }}>{s.value}</p>
                <p style={{ fontSize: 10, color: "#cbd5e1", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
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
            {loading ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <FiLoader size={18} style={{ color: "#D4A017", animation: "dashSpin 1s linear infinite" }} />
              </div>
            ) : recentPending.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>No pending projects</p>
              </div>
            ) : (
              recentPending.map((p, i) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < recentPending.length - 1 ? "1px solid #f9fafb" : "none" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, overflow: "hidden", flexShrink: 0, backgroundColor: "#f3f4f6" }}>
                    {p.coverImageUrl ? (
                      <img src={p.coverImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FiBriefcase size={16} style={{ color: "#94a3b8" }} />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#0F2044", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{p.founderName}{p.fundingModel ? ` · ${p.fundingModel}` : ""}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#D4A017", margin: "0 0 2px" }}>EGP {fmt(p.targetAmount)}</p>
                    <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>{fmtDate(p.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
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
            {loading ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <FiLoader size={18} style={{ color: "#D4A017", animation: "dashSpin 1s linear infinite" }} />
              </div>
            ) : recentTickets.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>No open tickets</p>
              </div>
            ) : (
              recentTickets.map((t, i) => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < recentTickets.length - 1 ? "1px solid #f9fafb" : "none" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#D4A017", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#0F2044", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.subject}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{t.userName}{t.userRole ? ` · ${t.userRole}` : ""}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>{fmtDate(t.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: "#94a3b8", margin: "0 0 12px" }}>Quick Actions</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }} className="actions-grid">
        {[
          { icon: FiBriefcase, title: "Review Projects", sub: `${fmt(dashData.pendingProjects)} pending`, path: "/admin/projects", color: "#D4A017", bg: "#FEF9EC" },
          { icon: FiUsers, title: "Manage Users", sub: `${fmt(dashData.totalUsers)} total users`, path: "/admin/users", color: "#0F2044", bg: "#F0F4F8" },
          { icon: FiLock, title: "Release Escrow", sub: `EGP ${fmt(dashData.escrowBalance)}`, path: "/admin/escrow", color: "#059669", bg: "#ECFDF5" },
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
        @keyframes dashSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .stats-bar { flex-wrap: wrap !important; }
          .stats-bar-item { flex: 1 1 33% !important; border-bottom: 1px solid #f0f0f0; }
          .stats-bar-item:nth-child(4), .stats-bar-item:nth-child(5) { flex: 1 1 50% !important; }
          .stats-bar-item:last-child { border-right: none !important; }
        }
        @media (max-width: 768px) {
          .stats-bar-item { flex: 1 1 50% !important; }
          .stats-bar-item:nth-child(odd) { border-right: 1px solid #f0f0f0 !important; }
          .stats-bar-item:nth-child(even) { border-right: none !important; }
          .stats-bar-item:last-child { border-right: none !important; flex: 1 1 100% !important; }
          .actions-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
