import React, { useState, useMemo } from "react";
import {
  FiSearch, FiEye, FiCheck, FiX, FiCheckCircle,
  FiAlertTriangle, FiBriefcase, FiUser, FiMapPin,
  FiCalendar, FiDollarSign, FiClock,
} from "react-icons/fi";
import { pendingProjects as mockProjects } from "../../Data/adminMockData";

const fmt = (n) => Number(n || 0).toLocaleString("en-US");
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

const STATUS_COLORS = {
  PendingReview: { bg: "#FEF9EC", color: "#D4A017", label: "Pending" },
  Published: { bg: "#ECFDF5", color: "#059669", label: "Published" },
  Rejected: { bg: "#FEF2F2", color: "#EF4444", label: "Rejected" },
};

const MODEL_COLORS = {
  Equity: { bg: "#F0F4F8", color: "#0F2044" },
  Mudarabah: { bg: "#FEF9EC", color: "#D4A017" },
  Reward: { bg: "#ECFDF5", color: "#059669" },
};

/* ═══════════ Toast ═══════════ */
function Toast({ message, type, onClose }) {
  const isSuccess = type === "success";
  return (
    <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, padding: "14px 24px", borderRadius: 12, backgroundColor: isSuccess ? "#059669" : "#EF4444", color: "white", fontSize: 13, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 8, animation: "slideIn 0.3s ease" }}>
      {isSuccess ? <FiCheckCircle size={16} /> : <FiAlertTriangle size={16} />}
      {message}
      <style>{`@keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}

/* ═══════════ Approve Dialog ═══════════ */
function ApproveDialog({ project, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} onClick={onCancel} />
      <div style={{ position: "relative", backgroundColor: "white", borderRadius: 20, padding: "32px 28px", maxWidth: 400, width: "100%", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <FiCheckCircle size={28} style={{ color: "#059669" }} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F2044", margin: "0 0 6px" }}>Approve this project?</h3>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#D4A017", margin: "0 0 4px" }}>{project?.title}</p>
        <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 24px" }}>This project will be published and visible to investors.</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "1.5px solid #e5e7eb", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#64748b", cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", backgroundColor: "#059669", fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer" }}>Yes, Approve</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════ Reject Dialog ═══════════ */
function RejectDialog({ project, onConfirm, onCancel }) {
  const [reason, setReason] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} onClick={onCancel} />
      <div style={{ position: "relative", backgroundColor: "white", borderRadius: 20, padding: "32px 28px", maxWidth: 400, width: "100%", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <FiAlertTriangle size={28} style={{ color: "#EF4444" }} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F2044", margin: "0 0 6px" }}>Reject this project?</h3>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#D4A017", margin: "0 0 16px" }}>{project?.title}</p>
        <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Enter reason for rejection..." style={{ width: "100%", minHeight: 80, borderRadius: 12, border: "1.5px solid #e5e7eb", padding: 12, fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = "#EF4444"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "1.5px solid #e5e7eb", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#64748b", cursor: "pointer" }}>Cancel</button>
          <button onClick={() => onConfirm(reason)} disabled={!reason.trim()} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", backgroundColor: reason.trim() ? "#EF4444" : "#fca5a5", fontSize: 13, fontWeight: 600, color: "white", cursor: reason.trim() ? "pointer" : "not-allowed" }}>Confirm Rejection</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════ Detail Modal ═══════════ */
function DetailModal({ project, onClose, onApprove, onReject }) {
  if (!project) return null;
  const sc = STATUS_COLORS[project.projectStatus] || STATUS_COLORS.PendingReview;
  const isPending = project.projectStatus === "PendingReview";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div style={{ position: "relative", backgroundColor: "white", borderRadius: 20, maxWidth: 640, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        {/* Cover */}
        <div style={{ position: "relative" }}>
          <img src={project.coverImageUrl} alt="" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: "20px 20px 0 0" }} />
          <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.5)", border: "none", color: "white", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FiX size={16} />
          </button>
          <span style={{ position: "absolute", top: 12, left: 12, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 8, backgroundColor: sc.bg, color: sc.color, textTransform: "uppercase" }}>{sc.label}</span>
        </div>

        {/* Content */}
        <div style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0F2044", margin: 0 }}>{project.title}</h2>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 6, backgroundColor: (MODEL_COLORS[project.fundingModel] || {}).bg, color: (MODEL_COLORS[project.fundingModel] || {}).color }}>{project.fundingModel}</span>
          </div>

          {/* Founder info */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            <FiUser size={13} style={{ color: "#94a3b8" }} />
            <span style={{ fontSize: 12, color: "#64748b" }}>{project.founderName}</span>
            <span style={{ fontSize: 12, color: "#cbd5e1" }}>|</span>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{project.founderEmail}</span>
          </div>

          {/* Short desc */}
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 12px", lineHeight: 1.6 }}>{project.shortDescription}</p>

          {/* Long desc */}
          <div style={{ backgroundColor: "#fafbfc", borderRadius: 12, padding: 16, marginBottom: 20, maxHeight: 120, overflowY: "auto" }}>
            <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.7 }}>{project.longDescription}</p>
          </div>

          {/* Financial Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
              { icon: FiDollarSign, label: "Target Amount", value: `EGP ${fmt(project.targetAmount)}` },
              { icon: FiDollarSign, label: "Min. Contribution", value: `EGP ${fmt(project.minimumContribution)}` },
              { icon: FiClock, label: "Duration", value: `${project.campaignDurationInDays} days` },
              { icon: FiBriefcase, label: project.equityPercentage ? "Equity" : project.investorsProfitSharePercentage ? "Profit Share" : "Type", value: project.equityPercentage ? `${project.equityPercentage}%` : project.investorsProfitSharePercentage ? `${project.investorsProfitSharePercentage}%` : project.fundingModel },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: "#fafbfc", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <item.icon size={14} style={{ color: "#D4A017", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 1px", textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.3 }}>{item.label}</p>
                  <p style={{ fontSize: 13, color: "#0F2044", margin: 0, fontWeight: 600 }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Location + Date */}
          <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FiMapPin size={13} style={{ color: "#94a3b8" }} />
              <span style={{ fontSize: 12, color: "#64748b" }}>{project.location}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FiCalendar size={13} style={{ color: "#94a3b8" }} />
              <span style={{ fontSize: 12, color: "#64748b" }}>{fmtDate(project.createdAt)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {isPending && (
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => onReject(project)} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "1.5px solid #EF4444", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#EF4444", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#FEF2F2"; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = "white"; }}>
                Reject Project
              </button>
              <button onClick={() => onApprove(project)} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", backgroundColor: "#059669", fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#047857"; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#059669"; }}>
                Approve Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════ MAIN PAGE ═══════════ */
export default function AdminProjects() {
  const [projects, setProjects] = useState(() =>
    mockProjects.map(p => ({ ...p }))
  );
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = () => {
    setProjects(prev => prev.map(p => p.id === approveTarget.id ? { ...p, projectStatus: "Published" } : p));
    showToast(`"${approveTarget.title}" approved successfully`, "success");
    setApproveTarget(null);
    setSelectedProject(null);
  };

  const handleReject = (reason) => {
    setProjects(prev => prev.map(p => p.id === rejectTarget.id ? { ...p, projectStatus: "Rejected", rejectReason: reason } : p));
    showToast(`"${rejectTarget.title}" rejected`, "error");
    setRejectTarget(null);
    setSelectedProject(null);
  };

  const filtered = useMemo(() => {
    let list = projects;
    if (activeTab !== "All") list = list.filter(p => p.projectStatus === activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.founderName.toLowerCase().includes(q));
    }
    return list;
  }, [projects, activeTab, searchQuery]);

  const tabs = [
    { key: "All", label: "All Projects", count: projects.length },
    { key: "PendingReview", label: "Pending", count: projects.filter(p => p.projectStatus === "PendingReview").length },
    { key: "Published", label: "Published", count: projects.filter(p => p.projectStatus === "Published").length },
    { key: "Rejected", label: "Rejected", count: projects.filter(p => p.projectStatus === "Rejected").length },
  ];

  return (
    <div style={{ padding: "8px 0" }}>
      {toast && <Toast {...toast} />}
      {selectedProject && <DetailModal project={selectedProject} onClose={() => setSelectedProject(null)} onApprove={p => { setSelectedProject(null); setApproveTarget(p); }} onReject={p => { setSelectedProject(null); setRejectTarget(p); }} />}
      {approveTarget && <ApproveDialog project={approveTarget} onConfirm={handleApprove} onCancel={() => setApproveTarget(null)} />}
      {rejectTarget && <RejectDialog project={rejectTarget} onConfirm={handleReject} onCancel={() => setRejectTarget(null)} />}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0F2044", margin: "0 0 4px" }}>Project Management</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Review, approve, or reject submitted projects</p>
        </div>
        <div style={{ position: "relative", minWidth: 240 }}>
          <FiSearch size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search projects or founders..." style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 12, border: "1.5px solid #f0f0f0", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#D4A017"} onBlur={e => e.target.style.borderColor = "#f0f0f0"} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1.5px solid #f0f0f0", paddingBottom: 0 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding: "10px 16px", fontSize: 13, fontWeight: activeTab === t.key ? 600 : 400, color: activeTab === t.key ? "#D4A017" : "#94a3b8", backgroundColor: "transparent", border: "none", borderBottom: activeTab === t.key ? "2px solid #D4A017" : "2px solid transparent", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6, marginBottom: -1.5 }}>
            {t.label}
            <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 20, backgroundColor: activeTab === t.key ? "#FEF9EC" : "#f5f5f5", color: activeTab === t.key ? "#D4A017" : "#94a3b8" }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", overflow: "hidden" }}>
        {/* Table Header */}
        <div className="table-header" style={{ display: "flex", alignItems: "center", padding: "12px 20px", backgroundColor: "#fafbfc", borderBottom: "1px solid #f0f0f0" }}>
          <span style={{ flex: 2, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8" }}>Project</span>
          <span className="col-founder" style={{ flex: 1, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8" }}>Founder</span>
          <span className="col-model" style={{ flex: 0.7, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8" }}>Model</span>
          <span style={{ flex: 0.8, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8" }}>Target</span>
          <span className="col-date" style={{ flex: 0.7, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8" }}>Date</span>
          <span style={{ flex: 0.7, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8" }}>Status</span>
          <span style={{ flex: 0.8, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", textAlign: "right" }}>Actions</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <FiBriefcase size={32} style={{ color: "#e2e8f0", marginBottom: 8 }} />
            <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>No projects found</p>
          </div>
        ) : (
          filtered.map(p => {
            const sc = STATUS_COLORS[p.projectStatus] || STATUS_COLORS.PendingReview;
            const mc = MODEL_COLORS[p.fundingModel] || {};
            const isPending = p.projectStatus === "PendingReview";
            return (
              <div key={p.id} className="table-row" style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #f5f5f5", transition: "background 0.15s", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fafbfc"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "white"}
                onClick={() => setSelectedProject(p)}>
                {/* Project */}
                <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, overflow: "hidden", flexShrink: 0, backgroundColor: "#f3f4f6" }}>
                    <img src={p.coverImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#0F2044", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{p.category}</p>
                  </div>
                </div>
                {/* Founder */}
                <div className="col-founder" style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, color: "#0F2044", margin: 0, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.founderName}</p>
                </div>
                {/* Model */}
                <div className="col-model" style={{ flex: 0.7 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 6, backgroundColor: mc.bg, color: mc.color }}>{p.fundingModel}</span>
                </div>
                {/* Target */}
                <div style={{ flex: 0.8 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#0F2044", margin: 0 }}>EGP {fmt(p.targetAmount)}</p>
                </div>
                {/* Date */}
                <div className="col-date" style={{ flex: 0.7 }}>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{fmtDate(p.createdAt)}</p>
                </div>
                {/* Status */}
                <div style={{ flex: 0.7 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6, backgroundColor: sc.bg, color: sc.color, textTransform: "uppercase" }}>{sc.label}</span>
                </div>
                {/* Actions */}
                <div style={{ flex: 0.8, display: "flex", justifyContent: "flex-end", gap: 6 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => setSelectedProject(p)} title="View" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", backgroundColor: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#0F2044"; e.currentTarget.style.color = "#0F2044"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#64748b"; }}>
                    <FiEye size={14} />
                  </button>
                  {isPending && (
                    <>
                      <button onClick={() => setApproveTarget(p)} title="Approve" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", backgroundColor: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.color = "#059669"; e.currentTarget.style.backgroundColor = "#ECFDF5"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#64748b"; e.currentTarget.style.backgroundColor = "white"; }}>
                        <FiCheck size={14} />
                      </button>
                      <button onClick={() => setRejectTarget(p)} title="Reject" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", backgroundColor: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#EF4444"; e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.backgroundColor = "#FEF2F2"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#64748b"; e.currentTarget.style.backgroundColor = "white"; }}>
                        <FiX size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1024px) {
          .col-model, .col-date { display: none !important; }
        }
        @media (max-width: 768px) {
          .col-founder { display: none !important; }
          .table-header { display: none !important; }
          .table-row { flex-wrap: wrap; gap: 8px; }
        }
      `}</style>
    </div>
  );
}
