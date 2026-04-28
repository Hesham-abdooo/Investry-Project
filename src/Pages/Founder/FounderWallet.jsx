import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiDollarSign, FiBriefcase, FiTrendingUp, FiLock,
  FiArrowDownLeft, FiArrowUpRight, FiChevronLeft, FiChevronRight,
  FiCheck, FiClock, FiAlertCircle, FiExternalLink,
} from "react-icons/fi";
import axiosInstance from "../../Api/axiosInstance";

/* ── Helpers ── */
const fmt = (n) => Number(n || 0).toLocaleString("en-US");
const fmtCur = (n) => `EGP ${fmt(n)}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const resolveUrl = (url) => url ? (url.startsWith("http") ? url : `https://investry.runasp.net${url}`) : null;

const statusCfg = {
  Published:     { label: "Active",   bg: "#ECFDF5", color: "#059669", dot: "#059669" },
  Active:        { label: "Active",   bg: "#ECFDF5", color: "#059669", dot: "#059669" },
  Completed:     { label: "Completed", bg: "#F0F4F8", color: "#0F2044", dot: "#0F2044" },
  PendingReview: { label: "Pending",  bg: "#FEF9EC", color: "#D4A017", dot: "#D4A017" },
  Failed:        { label: "Failed",   bg: "#FEF2F2", color: "#DC2626", dot: "#DC2626" },
};
const getStatus = (s) => statusCfg[s] || statusCfg.Active;

const txIcons = {
  EscrowReleased: { Icon: FiArrowDownLeft, color: "#059669", bg: "#ECFDF5" },
  Deposit:        { Icon: FiArrowDownLeft, color: "#059669", bg: "#ECFDF5" },
  Investment:     { Icon: FiArrowDownLeft, color: "#D4A017", bg: "#FEF9EC" },
  Withdrawal:     { Icon: FiArrowUpRight, color: "#EF4444", bg: "#FEF2F2" },
};
const getTxStyle = (t) => txIcons[t] || txIcons.Deposit;

export default function FounderWallet() {
  const [balance, setBalance]       = useState(null);
  const [balLoading, setBalLoading] = useState(true);
  const [projects, setProjects]     = useState([]);
  const [projLoading, setProjLoading] = useState(true);
  const [txs, setTxs]               = useState([]);
  const [txLoading, setTxLoading]   = useState(true);
  const [page, setPage]             = useState(1);
  const [hasMore, setHasMore]       = useState(false);

  useEffect(() => {
    axiosInstance.get("/Wallet/balance")
      .then(r => { const d = r.data?.data ?? r.data; setBalance(typeof d === "number" ? d : d?.balance ?? d?.availableBalance ?? 0); })
      .catch(() => setBalance(0))
      .finally(() => setBalLoading(false));

    axiosInstance.get("/Projects/my-projects")
      .then(r => setProjects(r.data?.data || []))
      .catch(() => setProjects([]))
      .finally(() => setProjLoading(false));
  }, []);

  useEffect(() => {
    setTxLoading(true);
    axiosInstance.get(`/Wallet/transactions?page=${page}&pageSize=10`)
      .then(r => { const d = r.data?.data ?? r.data?.value ?? r.data; const list = Array.isArray(d) ? d : d?.items ?? []; setTxs(list); setHasMore(list.length >= 10); })
      .catch(() => setTxs([]))
      .finally(() => setTxLoading(false));
  }, [page]);

  /* ── Computed ── */
  const isActive = (p) => {
    const s = (p.projectStatus || p.status || "").toLowerCase();
    return s === "active" || s === "published";
  };
  const activeProjects = projects.filter(isActive);
  const inEscrow = activeProjects.reduce((s, p) => s + (Number(p.currentAmount) || 0), 0);
  const fundedProjects = projects.filter(p => (Number(p.currentAmount) || 0) > 0);
  const avgProgress = projects.length > 0 ? Math.round(projects.reduce((s, p) => s + (p.fundingProgressPercentage || 0), 0) / projects.length) : 0;
  const totalReceived = txs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);

  const allLoading = balLoading && projLoading;

  if (allLoading) return <WalletSkeleton />;

  return (
    <div style={{ padding: "8px 0" }}>
      {/* ══ SECTION 1: Hero Banner ══ */}
      <div style={{ background: "linear-gradient(135deg, #0F2044 0%, #1a3260 50%, #0F2044 100%)", borderRadius: 20, padding: "32px 28px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(212,160,23,0.08)" }} />
        <div style={{ position: "absolute", bottom: -30, right: 80, width: 100, height: 100, borderRadius: "50%", background: "rgba(212,160,23,0.05)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 4px", fontWeight: 500 }}>Financial Overview</p>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "white", margin: "0 0 20px" }}>
            <span style={{ color: "#D4A017" }}>Wallet</span> & Escrow
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
            {/* Available Balance */}
            <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(212,160,23,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FiDollarSign size={16} style={{ color: "#D4A017" }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.5)" }}>Available Balance</span>
              </div>
              {balLoading
                ? <div style={{ height: 32, width: 140, borderRadius: 8, background: "rgba(255,255,255,0.1)", animation: "pulse 1.5s infinite" }} />
                : <p style={{ fontSize: 28, fontWeight: 700, color: "#D4A017", margin: 0 }}>EGP {fmt(balance)}</p>
              }
            </div>
            {/* In Escrow */}
            <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FiLock size={16} style={{ color: "rgba(255,255,255,0.7)" }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,0.5)" }}>In Escrow</span>
              </div>
              {projLoading
                ? <div style={{ height: 32, width: 140, borderRadius: 8, background: "rgba(255,255,255,0.1)", animation: "pulse 1.5s infinite" }} />
                : <>
                    <p style={{ fontSize: 28, fontWeight: 700, color: "white", margin: "0 0 4px" }}>EGP {fmt(inEscrow)}</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>{activeProjects.length} active campaign{activeProjects.length !== 1 ? "s" : ""}</p>
                  </>
              }
            </div>
          </div>
        </div>
      </div>

      {/* ══ SECTION 2: Inline Stats ══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 16, marginBottom: 24 }}>
        <StatCard icon={FiDollarSign} label="Total Received" value={fmtCur(totalReceived)} color="#D4A017" bg="#FEF9EC" />
        <StatCard icon={FiBriefcase} label="Funded Projects" value={fundedProjects.length} color="#0F2044" bg="#F0F4F8" />
        <StatCard icon={FiTrendingUp} label="Avg. Progress" value={`${avgProgress}%`} color="#059669" bg="#ECFDF5" />
      </div>

      {/* ══ SECTION 3: Project Funds ══ */}
      <div style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", marginBottom: 24, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f5f5f5", display: "flex", alignItems: "center", gap: 8 }}>
          <FiBriefcase size={14} style={{ color: "#D4A017" }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: "#0F2044", margin: 0 }}>Project Funds</p>
        </div>
        {projLoading ? (
          <div style={{ padding: 20 }}>{[1,2,3].map(i => <div key={i} style={{ height: 56, borderRadius: 12, background: "#f9fafb", marginBottom: 8, animation: "pulse 1.5s infinite" }} />)}</div>
        ) : fundedProjects.length > 0 ? (
          <>
            {/* Desktop Header */}
            <div className="hidden sm:grid" style={{ gridTemplateColumns: "2fr 1fr 1.5fr 1.5fr 1fr", padding: "10px 20px", gap: 12 }}>
              {["Project","Status","Raised / Target","Progress","Funds"].map(h => (
                <span key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8" }}>{h}</span>
              ))}
            </div>
            {fundedProjects.map((p, i) => <ProjectRow key={p.id || i} project={p} />)}
          </>
        ) : (
          <EmptyBlock icon={FiBriefcase} title="No funded projects yet" sub="Create your first campaign to start receiving funds." />
        )}
      </div>

      {/* ══ SECTION 4: Activity Feed ══ */}
      <div style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f5f5f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FiClock size={14} style={{ color: "#D4A017" }} />
            <p style={{ fontSize: 14, fontWeight: 600, color: "#0F2044", margin: 0 }}>Activity</p>
          </div>
          {txs.length > 0 && <span style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Page {page}</span>}
        </div>
        {txLoading ? (
          <div style={{ padding: 20 }}>{[1,2,3,4].map(i => <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}><div style={{ width: 36, height: 36, borderRadius: 10, background: "#f3f4f6", animation: "pulse 1.5s infinite" }} /><div style={{ flex: 1 }}><div style={{ height: 12, width: "40%", background: "#f3f4f6", borderRadius: 6, marginBottom: 6, animation: "pulse 1.5s infinite" }} /><div style={{ height: 10, width: "25%", background: "#f3f4f6", borderRadius: 6, animation: "pulse 1.5s infinite" }} /></div><div style={{ height: 14, width: 80, background: "#f3f4f6", borderRadius: 6, animation: "pulse 1.5s infinite" }} /></div>)}</div>
        ) : txs.length > 0 ? (
          <div style={{ padding: "8px 20px 20px" }}>
            {txs.map((tx, i) => <ActivityItem key={tx.id || i} tx={tx} isLast={i === txs.length - 1} />)}
            {/* Pagination */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: "1px solid #f5f5f5" }}>
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: page === 1 ? "#d1d5db" : "#6b7280", background: "none", border: "none", cursor: page === 1 ? "not-allowed" : "pointer" }}>
                <FiChevronLeft size={14} /> Previous
              </button>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>Page {page}</span>
              <button onClick={() => setPage(p => p+1)} disabled={!hasMore} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: !hasMore ? "#d1d5db" : "#6b7280", background: "none", border: "none", cursor: !hasMore ? "not-allowed" : "pointer" }}>
                Next <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <EmptyBlock icon={FiClock} title="No transactions yet" sub="Your financial activity will appear here." />
        )}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/* ══  SUB-COMPONENTS                               ══ */
/* ═══════════════════════════════════════════════════ */

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", padding: 20, transition: "all 0.25s", cursor: "default" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", margin: "0 0 2px" }}>{label}</p>
          <p style={{ fontSize: typeof value === "number" ? 22 : 18, fontWeight: 700, color, margin: 0, lineHeight: 1.2 }}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function ProjectRow({ project: p }) {
  const progress = Math.min(p.fundingProgressPercentage || 0, 100);
  const st = getStatus(p.projectStatus || p.status);
  const s = (p.projectStatus || p.status || "").toLowerCase();
  const isEscrow = s === "active" || s === "published";
  const cover = resolveUrl(p.coverImageUrl);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-none" style={{ borderBottom: "1px solid #f8f8f8" }}>
      {/* Desktop */}
      <div className="hidden sm:grid" style={{ gridTemplateColumns: "2fr 1fr 1.5fr 1.5fr 1fr", padding: "14px 20px", gap: 12, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, overflow: "hidden", backgroundColor: "#f9fafb", flexShrink: 0 }}>
            {cover ? <img src={cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><FiBriefcase size={14} style={{ color: "#d1d5db" }} /></div>}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0F2044", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title || "Untitled"}</p>
            <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>{p.category || "General"}</p>
          </div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.3, color: st.color, background: st.bg, padding: "4px 10px", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 4, width: "fit-content" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: st.dot }} />{st.label}
        </span>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#0F2044", margin: 0 }}>{fmtCur(p.currentAmount)} <span style={{ color: "#94a3b8", fontWeight: 400 }}>/ {fmtCur(p.targetAmount)}</span></p>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: progress >= 80 ? "#059669" : "#D4A017" }}>{progress}%</span>
          </div>
          <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#f3f4f6", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 3, width: `${progress}%`, backgroundColor: progress >= 80 ? "#059669" : "#D4A017", transition: "width 0.7s ease-out" }} />
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: isEscrow ? "#D4A017" : "#059669", display: "flex", alignItems: "center", gap: 4 }}>
          {isEscrow ? <><FiLock size={12} /> Escrow</> : <><FiCheck size={12} /> Released</>}
        </span>
      </div>
      {/* Mobile */}
      <div className="sm:hidden" style={{ padding: "14px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, overflow: "hidden", backgroundColor: "#f9fafb", flexShrink: 0 }}>
            {cover ? <img src={cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><FiBriefcase size={14} style={{ color: "#d1d5db" }} /></div>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0F2044", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: st.color, background: st.bg, padding: "2px 8px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 3 }}><span style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: st.dot }} />{st.label}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: isEscrow ? "#D4A017" : "#059669", display: "flex", alignItems: "center", gap: 3 }}>{isEscrow ? <><FiLock size={10} /> Escrow</> : <><FiCheck size={10} /> Released</>}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#0F2044" }}>{fmtCur(p.currentAmount)}</span>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>/ {fmtCur(p.targetAmount)}</span>
        </div>
        <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#f3f4f6", overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 3, width: `${progress}%`, backgroundColor: progress >= 80 ? "#059669" : "#D4A017" }} />
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ tx, isLast }) {
  const style = getTxStyle(tx.type);
  const Icon = style.Icon;
  const isPositive = tx.amount > 0;

  return (
    <div style={{ display: "flex", gap: 14, position: "relative", paddingBottom: isLast ? 0 : 20 }}>
      {/* Timeline line */}
      {!isLast && <div style={{ position: "absolute", left: 17, top: 40, bottom: 0, width: 2, background: "#f3f4f6" }} />}
      {/* Icon */}
      <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: style.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
        <Icon size={16} style={{ color: style.color }} />
      </div>
      {/* Content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#0F2044", margin: "0 0 2px" }}>{tx.type?.replace(/([A-Z])/g, " $1").trim() || "Transaction"}</p>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{tx.description || tx.projectTitle || "Wallet transaction"} · {fmtDate(tx.createdAt || tx.date)}</p>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: isPositive ? "#059669" : "#0F2044" }}>
          {isPositive ? "+" : "−"} EGP {fmt(Math.abs(tx.amount))}
        </span>
      </div>
    </div>
  );
}

function EmptyBlock({ icon: Icon, title, sub }) {
  return (
    <div style={{ padding: "48px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#FEF9EC", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <Icon size={20} style={{ color: "#D4A017" }} />
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, color: "#0F2044", margin: "0 0 4px" }}>{title}</p>
      <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, maxWidth: 280 }}>{sub}</p>
    </div>
  );
}

function WalletSkeleton() {
  return (
    <div style={{ padding: "8px 0" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
      <div style={{ height: 200, borderRadius: 20, background: "linear-gradient(135deg, #0F2044 0%, #1a3260 100%)", marginBottom: 24, animation: "pulse 1.5s infinite" }} />
      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 16, marginBottom: 24 }}>
        {[1,2,3].map(i => <div key={i} style={{ height: 84, borderRadius: 16, background: "white", border: "1.5px solid #f0f0f0", animation: "pulse 1.5s infinite" }} />)}
      </div>
      <div style={{ height: 240, borderRadius: 16, background: "white", border: "1.5px solid #f0f0f0", marginBottom: 24, animation: "pulse 1.5s infinite" }} />
      <div style={{ height: 300, borderRadius: 16, background: "white", border: "1.5px solid #f0f0f0", animation: "pulse 1.5s infinite" }} />
    </div>
  );
}
