import React from "react";
import { useNavigate } from "react-router-dom";
import { FiMoreVertical, FiTrash2, FiEye, FiEdit2 } from "react-icons/fi";

const getStatusLabel = (status) => {
  if (status === "PendingReview") return "Pending";
  if (status === "Active") return "Active";
  if (status === "Completed") return "Completed";
  return status ?? "—";
};

const getStatusStyle = (status) => {
  if (status === "Active")
    return { bg: "#E8F5E9", color: "#2E7D32", border: "#C8E6C9" };
  if (status === "Completed")
    return { bg: "#E3F2FD", color: "#1565C0", border: "#BBDEFB" };
  if (status === "PendingReview")
    return { bg: "#FEF9EC", color: "#D4A017", border: "rgba(212,160,23,0.2)" };
  return { bg: "#F3F4F6", color: "#9CA3AF", border: "#E5E7EB" };
};

const getFundingLabel = (model) => {
  if (model === "Reward") return "Reward";
  if (model === "Equity") return "Equity";
  if (model === "Mudarabah") return "Mudarabah";
  return model ?? "—";
};

const getFundingBadge = (model) => {
  if (model === "Equity")
    return { bg: "#0F2044", color: "#fff" };
  return { bg: "#FEF9EC", color: "#D4A017" };
};

const formatAmount = (val) => {
  const num = Number(val);
  if (isNaN(num)) return "0";
  return num.toLocaleString();
};

export default function ProjectCard({
  project,
  onDelete,
  openMenuId,
  setOpenMenuId,
}) {
  const navigate = useNavigate();
  const imageUrl = project.coverImageUrl
    ? project.coverImageUrl.startsWith("http")
      ? project.coverImageUrl
      : `https://investry.runasp.net${project.coverImageUrl}`
    : "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=200&fit=crop";

  const progress = Math.min(project.fundingProgressPercentage ?? 0, 100);
  const statusStyle = getStatusStyle(project.projectStatus);
  const fundingBadge = getFundingBadge(project.fundingModel);

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: 16,
        border: "1.5px solid #f0f0f0",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
        maxWidth: "100%",
        boxSizing: "border-box",
        minWidth: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
        <img
          src={imageUrl}
          alt={project.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {/* Status Badge */}
        <span
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            fontSize: 10,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 6,
            backgroundColor: statusStyle.bg,
            color: statusStyle.color,
            border: `1px solid ${statusStyle.border}`,
            letterSpacing: 0.3,
            textTransform: "uppercase",
          }}
        >
          {getStatusLabel(project.projectStatus)}
        </span>

        {/* Funding Badge */}
        <span
          style={{
            position: "absolute",
            top: 12,
            right: 48,
            fontSize: 10,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 6,
            backgroundColor: fundingBadge.bg,
            color: fundingBadge.color,
            letterSpacing: 0.3,
            textTransform: "uppercase",
          }}
        >
          {getFundingLabel(project.fundingModel)}
        </span>

        {/* Menu */}
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <button
            onClick={() => setOpenMenuId(openMenuId === project.id ? null : project.id)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(4px)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.color = "#0F2044"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.9)"; e.currentTarget.style.color = "#64748b"; }}
          >
            <FiMoreVertical size={15} />
          </button>
          {openMenuId === project.id && (
            <div
              style={{
                position: "absolute",
                right: 0,
                marginTop: 4,
                backgroundColor: "white",
                borderRadius: 12,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                border: "1.5px solid #f0f0f0",
                overflow: "hidden",
                zIndex: 10,
                minWidth: 170,
              }}
            >
              <button
                onClick={() => { setOpenMenuId(null); navigate(`/founder/projects/${project.id}`); }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", fontSize: 13, fontWeight: 500, color: "#0F2044", border: "none", background: "none", cursor: "pointer", width: "100%", transition: "background 0.2s", fontFamily: "inherit" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <FiEye size={14} /> View Details
              </button>
              <button
                onClick={() => { setOpenMenuId(null); navigate(`/founder/projects/${project.id}/edit`); }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", fontSize: 13, fontWeight: 500, color: "#0F2044", border: "none", background: "none", cursor: "pointer", width: "100%", transition: "background 0.2s", borderTop: "1px solid #f5f5f5", fontFamily: "inherit" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <FiEdit2 size={14} /> Edit Project
              </button>
              <button
                onClick={() => onDelete(project.id)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", fontSize: 13, fontWeight: 500, color: "#ef4444", border: "none", background: "none", cursor: "pointer", width: "100%", transition: "background 0.2s", borderTop: "1px solid #f5f5f5", fontFamily: "inherit" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fef2f2"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <FiTrash2 size={14} /> Delete Project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Category */}
        <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
          {project.category ?? "No category"}
        </span>

        {/* Title */}
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F2044", margin: "0 0 14px", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {project.title}
        </h3>

        {/* Progress */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#D4A017" }}>
            EGP {formatAmount(project.currentAmount)}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: progress >= 100 ? "#059669" : "#0F2044" }}>
            {progress}%
          </span>
        </div>

        <div style={{ width: "100%", height: 6, borderRadius: 4, backgroundColor: "#f3f4f6", marginBottom: 6, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              borderRadius: 4,
              width: `${progress}%`,
              backgroundColor: progress >= 100 ? "#059669" : "#D4A017",
              transition: "width 0.7s ease-out",
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
          <span>Target: EGP {formatAmount(project.targetAmount)}</span>
        </div>
      </div>
    </div>
  );
}
