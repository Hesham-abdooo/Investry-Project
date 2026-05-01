import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FiLock, FiClock, FiCheckCircle, FiDollarSign,
  FiUser, FiUsers, FiCalendar, FiLoader,
} from "react-icons/fi";
import axiosInstance from "../../Api/axiosInstance";

const fmt = (n) => Number(n || 0).toLocaleString("en-US");
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

/* Normalize API response to match UI fields */
const normalize = (p) => ({
  id: p.projectId || p.id,
  title: p.projectTitle || p.title || "",
  founderName: p.founderName || "Unknown",
  founderEmail: p.founderEmail || "",
  targetAmount: p.targetAmount || 0,
  currentAmount: p.collectedAmount || p.currentAmount || 0,
  numberOfInvestors: p.investorsCount || p.numberOfInvestors || 0,
  fundingProgressPercentage: p.fundingProgressPercentage || 0,
  completedAt: p.endDate || p.completedAt || "",
  escrowAmount: p.escrowAmount || 0,
  projectStatus: p.releaseStatus || p.projectStatus || "PendingRelease",
});

/* ═══════════ Toast ═══════════ */
function Toast({ message, type }) {
  return (
    <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, padding: "14px 24px", borderRadius: 12, backgroundColor: type === "success" ? "#059669" : "#EF4444", color: "white", fontSize: 13, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 8, animation: "escrowSlideIn 0.3s ease" }}>
      <FiCheckCircle size={16} />
      {message}
      <style>{`@keyframes escrowSlideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}

/* ═══════════ Release Dialog ═══════════ */
function ReleaseDialog({ project, onConfirm, onCancel, loading }) {
  if (!project) return null;
  const isFailed = project.fundingProgressPercentage < 100;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} onClick={onCancel} />
      <div style={{ position: "relative", backgroundColor: "white", borderRadius: 20, padding: "32px 28px", maxWidth: 420, width: "100%", textAlign: "center" }}>
        {/* Icon */}
        <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: isFailed ? "#FEF2F2" : "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <FiDollarSign size={28} style={{ color: isFailed ? "#EF4444" : "#059669" }} />
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F2044", margin: "0 0 6px" }}>
          {isFailed ? "Campaign Failed" : "Release Escrow Funds?"}
        </h3>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#0F2044", margin: "0 0 16px" }}>{project.title}</p>

        {/* Amount */}
        <div style={{ backgroundColor: isFailed ? "#FEF2F2" : "#ECFDF5", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: isFailed ? "#EF4444" : "#059669", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 4px" }}>
            {isFailed ? "Amount to Refund" : "Amount to Release"}
          </p>
          <p style={{ fontSize: 26, fontWeight: 800, color: isFailed ? "#EF4444" : "#059669", margin: 0 }}>EGP {fmt(project.escrowAmount)}</p>
        </div>

        {/* Details */}
        <div style={{ textAlign: "left", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <FiUser size={13} style={{ color: "#94a3b8" }} />
            <span style={{ fontSize: 12, color: "#64748b" }}>
              {isFailed
                ? <>Investors: <strong style={{ color: "#0F2044" }}>{project.numberOfInvestors} investor(s)</strong></>
                : <>Recipient: <strong style={{ color: "#0F2044" }}>{project.founderName}</strong></>
              }
            </span>
          </div>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, paddingLeft: 21 }}>
            {isFailed
              ? "This campaign did not reach its funding goal. Funds will be refunded to all investors."
              : "Funds will be transferred to the founder's wallet"
            }
          </p>
        </div>

        {/* Funding Progress (for failed) */}
        {isFailed && (
          <div style={{ backgroundColor: "#fafbfc", borderRadius: 10, padding: "10px 14px", marginBottom: 16, textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>Funding Progress</span>
              <span style={{ fontSize: 10, color: "#EF4444", fontWeight: 700 }}>{project.fundingProgressPercentage}%</span>
            </div>
            <div style={{ width: "100%", height: 5, borderRadius: 3, background: "#f3f4f6", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 3, width: `${Math.min(project.fundingProgressPercentage, 100)}%`, backgroundColor: "#EF4444" }} />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} disabled={loading} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "1.5px solid #e5e7eb", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#64748b", cursor: "pointer", transition: "all 0.2s", opacity: loading ? 0.5 : 1 }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fafafa"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "white"}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", backgroundColor: isFailed ? "#EF4444" : "#059669", fontSize: 13, fontWeight: 600, color: "white", cursor: loading ? "wait" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.9"; }} onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
            {loading ? <><FiLoader size={14} className="spin-icon" /> Processing...</> : isFailed ? "Refund Investors" : "Release Funds"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════ Summary Card ═══════════ */
function SummaryCard({ icon: Icon, label, value, color, bg }) {
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
          <p style={{ fontSize: 20, fontWeight: 700, color, margin: 0, lineHeight: 1.2 }}>{value}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════ Project Card ═══════════ */
function EscrowCard({ project, onRelease }) {
  const isReleased = project.projectStatus === "Released";
  const progressPercent = Math.min(project.fundingProgressPercentage, 100);

  return (
    <div style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", padding: "24px", opacity: isReleased ? 0.8 : 1, transition: "all 0.25s" }}
      onMouseEnter={e => { if (!isReleased) { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>

      {/* Top: Title + Status */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F2044", margin: "0 0 6px" }}>{project.title}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FiUser size={13} style={{ color: "#94a3b8" }} />
            <span style={{ fontSize: 12, color: "#64748b" }}>{project.founderName}</span>
            {project.founderEmail && (
              <>
                <span style={{ fontSize: 12, color: "#cbd5e1" }}>|</span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{project.founderEmail}</span>
              </>
            )}
          </div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 8, backgroundColor: isReleased ? "#ECFDF5" : "#FEF9EC", color: isReleased ? "#059669" : "#D4A017", textTransform: "uppercase", flexShrink: 0 }}>
          {isReleased ? "Released" : "Pending Release"}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>Funding Progress</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#059669" }}>{project.fundingProgressPercentage}%</span>
        </div>
        <div style={{ width: "100%", height: 6, backgroundColor: "#f0f0f0", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${progressPercent}%`, height: "100%", backgroundColor: "#059669", borderRadius: 3, transition: "width 0.5s ease" }} />
        </div>
      </div>

      {/* Info Grid */}
      <div className="escrow-info-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div style={{ backgroundColor: "#fafbfc", borderRadius: 10, padding: "10px 12px" }}>
          <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 2px", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>Target</p>
          <p style={{ fontSize: 13, color: "#0F2044", margin: 0, fontWeight: 600 }}>EGP {fmt(project.targetAmount)}</p>
        </div>
        <div style={{ backgroundColor: "#fafbfc", borderRadius: 10, padding: "10px 12px" }}>
          <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 2px", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>Collected</p>
          <p style={{ fontSize: 13, color: "#059669", margin: 0, fontWeight: 600 }}>EGP {fmt(project.currentAmount)}</p>
        </div>
        <div style={{ backgroundColor: "#fafbfc", borderRadius: 10, padding: "10px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <FiUsers size={11} style={{ color: "#94a3b8" }} />
            <p style={{ fontSize: 10, color: "#94a3b8", margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>Investors</p>
          </div>
          <p style={{ fontSize: 13, color: "#0F2044", margin: "2px 0 0", fontWeight: 600 }}>{project.numberOfInvestors}</p>
        </div>
        <div style={{ backgroundColor: "#fafbfc", borderRadius: 10, padding: "10px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <FiCalendar size={11} style={{ color: "#94a3b8" }} />
            <p style={{ fontSize: 10, color: "#94a3b8", margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>Completed</p>
          </div>
          <p style={{ fontSize: 13, color: "#0F2044", margin: "2px 0 0", fontWeight: 600 }}>{fmtDate(project.completedAt)}</p>
        </div>
      </div>

      {/* Footer: Escrow Amount + Button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid #f5f5f5", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 2px", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>Escrow Amount</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: isReleased ? "#059669" : "#D4A017", margin: 0 }}>EGP {fmt(project.escrowAmount)}</p>
        </div>
        {!isReleased ? (
          <button onClick={() => onRelease(project)} style={{ padding: "12px 28px", borderRadius: 12, border: "none", backgroundColor: "#059669", fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8 }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#047857"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#059669"; e.currentTarget.style.boxShadow = "none"; }}>
            Release Funds
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 12, backgroundColor: "#ECFDF5" }}>
            <FiCheckCircle size={15} style={{ color: "#059669" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#059669" }}>Funds Released</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════ MAIN PAGE ═══════════ */
export default function AdminEscrow() {
  const [escrowList, setEscrowList] = useState([]);
  const [releaseTarget, setReleaseTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Fetch ended campaigns from API ── */
  const fetchCampaigns = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/Admin/campaigns/ended");
      const body = res.data;
      const items = body?.data?.items ?? body?.data ?? body?.value ?? body;
      const list = Array.isArray(items) ? items : [];
      setEscrowList(list.map(normalize));
    } catch (err) {
      console.error("Failed to load escrow campaigns:", err);
      showToast("Failed to load escrow data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  /* ── Process / Release funds ── */
  const handleRelease = async () => {
    const project = releaseTarget;
    setActionLoading(true);
    try {
      await axiosInstance.post(`/Admin/campaigns/${project.id}/process`);
      showToast(`EGP ${fmt(project.escrowAmount)} released to ${project.founderName}'s wallet`, "success");
      setReleaseTarget(null);
      // Refresh the list from API
      await fetchCampaigns();
    } catch (err) {
      console.error("Failed to process campaign:", err);
      const errMsg = err.response?.data?.message || err.response?.data?.title || "Failed to release funds. Please try again.";
      showToast(errMsg, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const summary = useMemo(() => {
    const pending = escrowList.filter(p => p.projectStatus !== "Released");
    const released = escrowList.filter(p => p.projectStatus === "Released");
    const totalEscrow = pending.reduce((sum, p) => sum + p.escrowAmount, 0);
    return { totalEscrow, pendingCount: pending.length, releasedCount: released.length };
  }, [escrowList]);

  return (
    <div style={{ padding: "8px 0" }}>
      {toast && <Toast {...toast} />}
      {releaseTarget && <ReleaseDialog project={releaseTarget} onConfirm={handleRelease} onCancel={() => !actionLoading && setReleaseTarget(null)} loading={actionLoading} />}

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0F2044", margin: "0 0 4px" }}>Escrow Management</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Release funds to founders for completed projects</p>
      </div>

      {/* Summary Cards */}
      <div className="escrow-summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
        <SummaryCard icon={FiLock} label="Total in Escrow" value={`EGP ${fmt(summary.totalEscrow)}`} color="#3B82F6" bg="#EFF6FF" />
        <SummaryCard icon={FiClock} label="Pending Release" value={`${summary.pendingCount} projects`} color="#D4A017" bg="#FEF9EC" />
        <SummaryCard icon={FiCheckCircle} label="Released" value={`${summary.releasedCount} projects`} color="#059669" bg="#ECFDF5" />
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <FiLoader size={32} className="spin-icon" style={{ color: "#D4A017", marginBottom: 12 }} />
          <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>Loading escrow data...</p>
        </div>
      ) : escrowList.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <FiLock size={48} style={{ color: "#e2e8f0", marginBottom: 12 }} />
          <p style={{ fontSize: 15, color: "#94a3b8", margin: 0 }}>No ended campaigns found</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {escrowList.map(p => (
            <EscrowCard key={p.id} project={p} onRelease={setReleaseTarget} />
          ))}
        </div>
      )}

      {/* Responsive + Spinner */}
      <style>{`
        @media (max-width: 768px) {
          .escrow-summary-grid { grid-template-columns: 1fr !important; }
          .escrow-info-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .escrow-info-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin-icon { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
