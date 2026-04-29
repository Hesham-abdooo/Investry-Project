import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiBriefcase,
  FiActivity,
  FiClock,
  FiDollarSign,
  FiPlus,
  FiBarChart2,
  FiCreditCard,
  FiArrowRight,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
} from "react-icons/fi";
import axiosInstance from "../../Api/axiosInstance";

/* ═══════════════════════════════════════════════════════ */
/* ══  FOUNDER DASHBOARD                                ══ */
/* ═══════════════════════════════════════════════════════ */

export default function FounderDashboard() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes] = await Promise.all([
          axiosInstance.get("/Accounts/profile"),
          axiosInstance.get("/Projects/my-projects"),
        ]);
        setProfile(profileRes.data?.data);
        setProjects(projectsRes.data?.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ── Computed Stats ── */
  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.projectStatus === "Published").length,
    pending: projects.filter((p) => p.projectStatus === "PendingReview").length,
    raised: projects.reduce((sum, p) => sum + (Number(p.currentAmount) || 0), 0),
  };

  /* ── Loading Skeleton ── */
  if (loading) return <DashboardSkeleton />;

  return (
    <div style={{ padding: "8px 0" }}>
      {/* ── Section 1: Welcome Header ── */}
      <WelcomeHeader name={profile?.firstName} totalProjects={stats.total} />

      {/* ── Section 2: Stats Cards ── */}
      <StatsCards stats={stats} />

      {/* ── Section 3: KYC Banner ── */}
      <KycBanner status={profile?.kycStatus} />

      {/* ── Section 4: Quick Actions ── */}
      <QuickActions />

      {/* ── Section 5: Recent Projects ── */}
      <RecentProjects projects={projects.slice(0, 3)} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* ══  SECTION 1 — WELCOME HEADER                      ══ */
/* ═══════════════════════════════════════════════════════ */

function WelcomeHeader({ name, totalProjects }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0F2044 0%, #1a3260 50%, #0F2044 100%)",
        borderRadius: 20,
        padding: "32px 28px",
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "rgba(212, 160, 23, 0.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -30,
          right: 80,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(212, 160, 23, 0.05)",
        }}
      />

      <p
        style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.5)",
          margin: "0 0 4px",
          fontWeight: 500,
          letterSpacing: 0.3,
        }}
      >
        {greeting}
      </p>
      <h1
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: "white",
          margin: "0 0 8px",
          lineHeight: 1.3,
        }}
      >
        Welcome back, <span style={{ color: "#D4A017" }}>{name || "Founder"}</span>
      </h1>
      <p
        style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.55)",
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {totalProjects > 0
          ? `You have ${totalProjects} project${totalProjects > 1 ? "s" : ""} — here's your overview.`
          : "Start your journey by creating your first project."}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* ══  SECTION 2 — STATS CARDS                         ══ */
/* ═══════════════════════════════════════════════════════ */

const STAT_CONFIG = [
  { key: "total", label: "Total Projects", icon: FiBriefcase, color: "#0F2044", bgIcon: "#F0F4F8" },
  { key: "active", label: "Published", icon: FiActivity, color: "#059669", bgIcon: "#ECFDF5" },
  { key: "pending", label: "Pending Review", icon: FiClock, color: "#D4A017", bgIcon: "#FEF9EC" },
  { key: "raised", label: "Total Raised", icon: FiDollarSign, color: "#D4A017", bgIcon: "#FEF9EC", isCurrency: true },
];

function StatsCards({ stats }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 24,
      }}
      className="stats-grid"
    >
      {STAT_CONFIG.map((cfg) => {
        const Icon = cfg.icon;
        const value = stats[cfg.key];
        const displayValue = cfg.isCurrency
          ? `EGP ${value.toLocaleString()}`
          : value;

        return (
          <div
            key={cfg.key}
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              border: "1.5px solid #f0f0f0",
              padding: "20px",
              transition: "all 0.25s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "none";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: cfg.bgIcon,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={20} style={{ color: cfg.color }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    color: "#94a3b8",
                    margin: "0 0 2px",
                  }}
                >
                  {cfg.label}
                </p>
                <p
                  style={{
                    fontSize: cfg.isCurrency ? 18 : 22,
                    fontWeight: 700,
                    color: cfg.color,
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {displayValue}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* ══  SECTION 3 — KYC BANNER                          ══ */
/* ═══════════════════════════════════════════════════════ */

function KycBanner({ status }) {
  const isApproved = status === "Approved";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 20px",
        borderRadius: 16,
        marginBottom: 24,
        border: isApproved
          ? "1.5px solid #C8E6C9"
          : "1.5px solid rgba(212, 160, 23, 0.2)",
        backgroundColor: isApproved ? "#E8F5E9" : "#FEF9EC",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: isApproved ? "#C8E6C9" : "rgba(212, 160, 23, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {isApproved ? (
          <FiCheckCircle size={20} style={{ color: "#2E7D32" }} />
        ) : (
          <FiShield size={20} style={{ color: "#D4A017" }} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 180 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: isApproved ? "#2E7D32" : "#0F2044",
            margin: "0 0 2px",
          }}
        >
          {isApproved ? "Identity Verified" : "KYC Verification Required"}
        </p>
        <p
          style={{
            fontSize: 12,
            color: isApproved ? "#4CAF50" : "#94a3b8",
            margin: 0,
          }}
        >
          {isApproved
            ? "Your identity has been confirmed. You're all set!"
            : "Complete verification to create and manage projects."}
        </p>
      </div>

      {isApproved ? (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#2E7D32",
            backgroundColor: "#C8E6C9",
            padding: "5px 12px",
            borderRadius: 8,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          ✓ Verified
        </span>
      ) : (
        <Link
          to="/founder/profile"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "white",
            backgroundColor: "#D4A017",
            padding: "8px 20px",
            borderRadius: 10,
            textDecoration: "none",
            transition: "all 0.25s ease",
            whiteSpace: "nowrap",
          }}
        >
          Verify Now →
        </Link>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* ══  SECTION 4 — QUICK ACTIONS                       ══ */
/* ═══════════════════════════════════════════════════════ */

const ACTIONS = [
  {
    label: "New Project",
    sub: "Create & launch a campaign",
    icon: FiPlus,
    to: "/createProject",
    accent: "#0F2044",
  },
  {
    label: "Analytics",
    sub: "Track your performance",
    icon: FiBarChart2,
    to: "/founder/analytics",
    accent: "#D4A017",
  },
  {
    label: "Wallet",
    sub: "Manage your funds",
    icon: FiCreditCard,
    to: "/founder/wallet",
    accent: "#059669",
  },
];

function QuickActions() {
  return (
    <div style={{ marginBottom: 24 }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          color: "#94a3b8",
          margin: "0 0 12px",
        }}
      >
        Quick Actions
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
        }}
        className="actions-grid"
      >
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              to={action.to}
              style={{
                backgroundColor: "white",
                borderRadius: 16,
                border: "1.5px solid #f0f0f0",
                padding: "20px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 14,
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = action.accent;
                e.currentTarget.style.boxShadow = `0 4px 16px ${action.accent}12`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#f0f0f0";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: `${action.accent}10`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={20} style={{ color: action.accent }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#0F2044", margin: "0 0 2px" }}>
                  {action.label}
                </p>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
                  {action.sub}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* ══  SECTION 5 — RECENT PROJECTS                     ══ */
/* ═══════════════════════════════════════════════════════ */

const getStatusBadge = (status) => {
  if (status === "Published")
    return { bg: "#E8F5E9", color: "#2E7D32", label: "Published" };
  if (status === "PendingReview")
    return { bg: "#FEF9EC", color: "#D4A017", label: "Pending" };
  if (status === "Completed")
    return { bg: "#E3F2FD", color: "#1565C0", label: "Completed" };
  return { bg: "#F3F4F6", color: "#9CA3AF", label: status || "—" };
};

function RecentProjects({ projects }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            color: "#94a3b8",
            margin: 0,
          }}
        >
          Recent Projects
        </p>
        <Link
          to="/founder/projects"
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#D4A017",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 4,
            transition: "opacity 0.2s",
          }}
        >
          View All <FiArrowRight size={13} />
        </Link>
      </div>

      {/* Content */}
      {projects.length === 0 ? (
        /* Empty State */
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            border: "1.5px solid #f0f0f0",
            padding: "48px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "#FEF9EC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <FiTrendingUp size={24} style={{ color: "#D4A017" }} />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#0F2044", margin: "0 0 6px" }}>
            No projects yet
          </p>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 18px", lineHeight: 1.5 }}>
            Create your first project and start raising funds.
          </p>
          <Link
            to="/createProject"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: "white",
              backgroundColor: "#0F2044",
              padding: "10px 22px",
              borderRadius: 12,
              textDecoration: "none",
              transition: "all 0.25s",
            }}
          >
            <FiPlus size={15} /> Create Project
          </Link>
        </div>
      ) : (
        /* Projects List */
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            border: "1.5px solid #f0f0f0",
            overflow: "hidden",
          }}
        >
          {projects.map((project, i) => {
            const progress = Math.min(project.fundingProgressPercentage ?? 0, 100);
            const badge = getStatusBadge(project.projectStatus);
            const imageUrl = project.coverImageUrl
              ? project.coverImageUrl.startsWith("http")
                ? project.coverImageUrl
                : `https://investry.runasp.net${project.coverImageUrl}`
              : null;

            return (
              <div
                key={project.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  borderBottom: i < projects.length - 1 ? "1px solid #f5f5f5" : "none",
                  transition: "background 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FAFBFC")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
              >
                {/* Cover Image */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: "#f3f4f6",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={project.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FiBriefcase size={18} style={{ color: "#cbd5e1" }} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#0F2044",
                      margin: "0 0 6px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {project.title}
                  </p>

                  {/* Progress Bar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        flex: 1,
                        height: 5,
                        borderRadius: 3,
                        backgroundColor: "#f3f4f6",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          borderRadius: 3,
                          width: `${progress}%`,
                          backgroundColor:
                            progress >= 100 ? "#059669" : "#D4A017",
                          transition: "width 0.7s ease-out",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: progress >= 100 ? "#059669" : "#0F2044",
                        minWidth: 32,
                        textAlign: "right",
                      }}
                    >
                      {progress}%
                    </span>
                  </div>
                </div>

                {/* Raised */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#D4A017",
                      margin: "0 0 4px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    EGP {(Number(project.currentAmount) || 0).toLocaleString()}
                  </p>
                  {/* Status Badge */}
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: badge.color,
                      backgroundColor: badge.bg,
                      padding: "3px 8px",
                      borderRadius: 6,
                      textTransform: "uppercase",
                      letterSpacing: 0.3,
                    }}
                  >
                    {badge.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* ══  LOADING SKELETON                                ══ */
/* ═══════════════════════════════════════════════════════ */

function DashboardSkeleton() {
  const pulse = { animation: "pulse 1.5s ease-in-out infinite" };
  const bg = "#f3f4f6";

  return (
    <div style={{ padding: "8px 0" }}>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>

      {/* Welcome skeleton */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F2044, #1a3260)",
          borderRadius: 20,
          padding: "32px 28px",
          marginBottom: 24,
        }}
      >
        <div style={{ ...pulse, width: 100, height: 12, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.1)", marginBottom: 8 }} />
        <div style={{ ...pulse, width: 280, height: 22, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.1)", marginBottom: 10 }} />
        <div style={{ ...pulse, width: 200, height: 12, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.08)" }} />
      </div>

      {/* Stats skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }} className="stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ ...pulse, width: 44, height: 44, borderRadius: 12, backgroundColor: bg }} />
              <div>
                <div style={{ ...pulse, width: 60, height: 8, borderRadius: 4, backgroundColor: bg, marginBottom: 6 }} />
                <div style={{ ...pulse, width: 40, height: 16, borderRadius: 6, backgroundColor: bg }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* KYC skeleton */}
      <div style={{ ...pulse, height: 72, borderRadius: 16, backgroundColor: bg, marginBottom: 24 }} />

      {/* Actions skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }} className="actions-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ ...pulse, height: 80, borderRadius: 16, backgroundColor: "white", border: "1.5px solid #f0f0f0" }} />
        ))}
      </div>

      {/* Recent projects skeleton */}
      <div style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", padding: "0" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderBottom: i < 3 ? "1px solid #f5f5f5" : "none" }}>
            <div style={{ ...pulse, width: 48, height: 48, borderRadius: 12, backgroundColor: bg, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ ...pulse, width: "60%", height: 12, borderRadius: 6, backgroundColor: bg, marginBottom: 8 }} />
              <div style={{ ...pulse, width: "100%", height: 5, borderRadius: 3, backgroundColor: bg }} />
            </div>
            <div style={{ ...pulse, width: 70, height: 24, borderRadius: 8, backgroundColor: bg, flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
