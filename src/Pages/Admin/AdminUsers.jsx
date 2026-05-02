import React, { useState, useEffect, useCallback, useRef } from "react";
import { FiSearch, FiEye, FiX, FiCheckCircle, FiUser, FiCalendar, FiMail, FiShield, FiAlertTriangle, FiSlash, FiLoader, FiChevronLeft, FiChevronRight, FiRefreshCw } from "react-icons/fi";
import { getAdminUsers, getAdminUserById, banUser, unbanUser } from "../../Api/adminUsersService";

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
const fmt = (n) => Number(n || 0).toLocaleString("en-US");

const ROLE_COLORS = { Founder: { bg: "#0F2044", color: "#fff" }, Investor: { bg: "#FEF9EC", color: "#D4A017" } };
const STATUS_COLORS = { Active: { bg: "#ECFDF5", color: "#059669" }, Banned: { bg: "#FEF2F2", color: "#EF4444" } };
const KYC_COLORS = { Verified: { color: "#059669", label: "Verified" }, Pending: { color: "#D4A017", label: "Pending" }, "Not Started": { color: "#94a3b8", label: "Not Started" }, Rejected: { color: "#EF4444", label: "Rejected" } };

const BAN_DURATIONS = [
  { label: "1 Day", days: 1 }, { label: "3 Days", days: 3 },
  { label: "1 Week", days: 7 }, { label: "1 Month", days: 30 },
  { label: "Permanent", days: -1 },
];

/* ═══ Toast ═══ */
function Toast({ message, type }) {
  const bg = type === "success" ? "#059669" : "#EF4444";
  return (
    <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, padding: "14px 24px", borderRadius: 12, backgroundColor: bg, color: "white", fontSize: 13, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 8, animation: "usrSlide 0.3s ease" }}>
      <FiCheckCircle size={16} /> {message}
      <style>{`@keyframes usrSlide { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}

/* ═══ Avatar ═══ */
function UserAvatar({ name, size = 36 }) {
  const initials = (name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: 10, background: "linear-gradient(135deg, #0F2044, #1a3a6a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: size * 0.33, fontWeight: 700, color: "white" }}>{initials}</span>
    </div>
  );
}

/* ═══ Ban Dialog ═══ */
function BanDialog({ user, onConfirm, onCancel }) {
  const [duration, setDuration] = useState(null);
  const [reason, setReason] = useState("");
  if (!user) return null;
  const fullName = `${user.firstName} ${user.lastName}`;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 950, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} onClick={onCancel} />
      <div style={{ position: "relative", backgroundColor: "white", borderRadius: 20, maxWidth: 420, width: "100%", padding: 28 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <FiAlertTriangle size={24} style={{ color: "#EF4444" }} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F2044", textAlign: "center", margin: "0 0 4px" }}>Ban User</h3>
        <p style={{ fontSize: 13, color: "#64748b", textAlign: "center", margin: "0 0 20px" }}>You are about to ban <strong style={{ color: "#0F2044" }}>{fullName}</strong></p>

        <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", margin: "0 0 8px" }}>Duration</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          {BAN_DURATIONS.map(d => (
            <label key={d.days} onClick={() => setDuration(d)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${duration?.days === d.days ? (d.days === -1 ? "#EF4444" : "#D4A017") : "#f0f0f0"}`, cursor: "pointer", backgroundColor: duration?.days === d.days ? (d.days === -1 ? "#FEF2F2" : "#FEF9EC") : "white", transition: "all 0.15s" }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${duration?.days === d.days ? (d.days === -1 ? "#EF4444" : "#D4A017") : "#d1d5db"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {duration?.days === d.days && <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: d.days === -1 ? "#EF4444" : "#D4A017" }} />}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: d.days === -1 ? "#EF4444" : "#0F2044" }}>{d.label}</span>
            </label>
          ))}
        </div>

        <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", margin: "0 0 6px" }}>Reason <span style={{ color: "#EF4444" }}>*</span></p>
        <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Why is this user being banned?" style={{ width: "100%", minHeight: 80, borderRadius: 12, border: "1.5px solid #f0f0f0", padding: 12, fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.5 }}
          onFocus={e => e.target.style.borderColor = "#EF4444"} onBlur={e => e.target.style.borderColor = "#f0f0f0"} />

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "1.5px solid #e5e7eb", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#64748b", cursor: "pointer" }}>Cancel</button>
          <button onClick={() => { if (duration && reason.trim()) onConfirm(user, duration, reason); }} disabled={!duration || !reason.trim()}
            style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", backgroundColor: duration && reason.trim() ? "#EF4444" : "#94a3b8", fontSize: 13, fontWeight: 600, color: "white", cursor: duration && reason.trim() ? "pointer" : "not-allowed" }}>
            Confirm Ban
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══ User Detail Modal ═══ */
function UserModal({ user, onClose, onBan, onReactivate }) {
  if (!user) return null;
  const fullName = `${user.firstName} ${user.lastName}`;
  const rc = ROLE_COLORS[user.role] || ROLE_COLORS.Investor;
  const sc = STATUS_COLORS[user.status] || STATUS_COLORS.Active;
  const kyc = KYC_COLORS[user.kycStatus] || KYC_COLORS["Not Started"];
  const isBanned = user.status === "Banned";
  const isFounder = user.role === "Founder";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div style={{ position: "relative", backgroundColor: "white", borderRadius: 20, maxWidth: 480, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: 28 }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: "50%", border: "none", backgroundColor: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#f5f5f5"; e.currentTarget.style.color = "#0F2044"; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}>
          <FiX size={18} />
        </button>

        {/* Profile */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ display: "inline-block", marginBottom: 12 }}><UserAvatar name={fullName} size={56} /></div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0F2044", margin: "0 0 4px" }}>{fullName}</h2>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 10px" }}>{user.email}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 6, backgroundColor: rc.bg, color: rc.color }}>{user.role}</span>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 6, backgroundColor: `${kyc.color}15`, color: kyc.color }}>{kyc.label}</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <div style={{ backgroundColor: "#fafbfc", borderRadius: 12, padding: 14, textAlign: "center" }}>
            <p style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, margin: "0 0 4px" }}>{isFounder ? "Projects" : "Investments"}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#0F2044", margin: 0 }}>{isFounder ? user.projectCount || 0 : user.investmentCount || 0}</p>
          </div>
          <div style={{ backgroundColor: "#fafbfc", borderRadius: 12, padding: 14, textAlign: "center" }}>
            <p style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, margin: "0 0 4px" }}>{isFounder ? "Total Raised" : "Total Invested"}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#0F2044", margin: 0 }}>EGP {fmt(isFounder ? user.totalRaised : user.totalInvested)}</p>
          </div>
        </div>

        {/* Info */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16, fontSize: 12, color: "#64748b" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><FiCalendar size={12} /> Joined: {fmtDate(user.createdAt)}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 600, color: sc.color }}>● {user.status}</span>
        </div>

        {/* Ban Info */}
        {isBanned && (
          <div style={{ backgroundColor: "#FEF2F2", borderRadius: 12, padding: 14, marginBottom: 16, border: "1px solid rgba(239,68,68,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <FiSlash size={13} style={{ color: "#EF4444" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#EF4444" }}>
                {user.banExpiry ? `Banned until ${fmtDate(user.banExpiry)}` : "Permanently Suspended"}
              </span>
            </div>
            {user.banReason && <p style={{ fontSize: 12, color: "#991b1b", margin: 0, paddingLeft: 19 }}>Reason: {user.banReason}</p>}
          </div>
        )}

        {/* Actions */}
        <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
          {isBanned ? (
            <button onClick={() => onReactivate(user)} style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", backgroundColor: "#059669", fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#047857"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#059669"}>
              <FiCheckCircle size={15} /> Reactivate Account
            </button>
          ) : (
            <button onClick={() => onBan(user)} style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", backgroundColor: "#EF4444", fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#DC2626"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#EF4444"}>
              <FiSlash size={15} /> Ban User
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════ MAIN PAGE ═══════════ */
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [banTarget, setBanTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 10;
  const debounceRef = useRef(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  /* ── Search debounce (300ms) ── */
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 300);
  };

  /* ── Fetch users from API ── */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      if (activeTab === "Founder") filters.role = "Founder";
      else if (activeTab === "Investor") filters.role = "Investor";
      else if (activeTab === "Banned") filters.status = "Banned";

      const result = await getAdminUsers({
        ...filters,
        searchQuery: debouncedSearch,
        pageNumber: page,
        pageSize: PAGE_SIZE,
      });
      setUsers(result.users);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Failed to load users");
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }, [activeTab, debouncedSearch, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  /* ── Reset page on tab/search change ── */
  const handleTabChange = (tab) => { setActiveTab(tab); setPage(1); };

  /* ── View user details (from detail endpoint) ── */
  const handleViewUser = async (user) => {
    setDetailLoading(true);
    try {
      const detail = await getAdminUserById(user.id);
      setSelectedUser(detail);
    } catch {
      // Fallback to the list data if detail endpoint fails
      setSelectedUser(user);
    } finally {
      setDetailLoading(false);
    }
  };

  /* ── Ban user via API ── */
  const handleBan = async (user, duration, reason) => {
    setActionLoading(true);
    try {
      await banUser(user.id, { reason, durationInDays: duration.days });
      const label = duration.days === -1 ? "permanently suspended" : `banned for ${duration.label.toLowerCase()}`;
      showToast(`${user.firstName} ${user.lastName} ${label}`, "error");
      setBanTarget(null);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || "Failed to ban user";
      showToast(msg, "error");
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Reactivate user via API ── */
  const handleReactivate = async (user) => {
    setActionLoading(true);
    try {
      await unbanUser(user.id);
      showToast(`${user.firstName} ${user.lastName} account reactivated`, "success");
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || "Failed to reactivate user";
      showToast(msg, "error");
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Tabs (counts from current data — server handles filtering) ── */
  const tabs = [
    { key: "All", label: "All Users", count: activeTab === "All" ? totalCount : null },
    { key: "Founder", label: "Founders", count: activeTab === "Founder" ? totalCount : null },
    { key: "Investor", label: "Investors", count: activeTab === "Investor" ? totalCount : null },
    { key: "Banned", label: "Banned", count: activeTab === "Banned" ? totalCount : null },
  ];

  return (
    <div style={{ padding: "8px 0" }}>
      {toast && <Toast message={toast.msg} type={toast.type} />}
      {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} onBan={u => { setSelectedUser(null); setBanTarget(u); }} onReactivate={handleReactivate} />}
      {banTarget && <BanDialog user={banTarget} onCancel={() => setBanTarget(null)} onConfirm={handleBan} />}

      {/* Detail Loading Overlay */}
      {detailLoading && (
        <div style={{ position: "fixed", inset: 0, zIndex: 850, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.2)", backdropFilter: "blur(2px)" }}>
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: "24px 32px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
            <FiLoader size={20} style={{ color: "#D4A017", animation: "spin 1s linear infinite" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#0F2044" }}>Loading user details...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0F2044", margin: "0 0 4px" }}>Users Management</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Manage founders and investors accounts</p>
      </div>

      {/* Tabs + Search */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 4, borderBottom: "1.5px solid #f0f0f0", flex: 1, minWidth: 200 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => handleTabChange(t.key)} style={{ padding: "10px 16px", fontSize: 13, fontWeight: activeTab === t.key ? 600 : 400, color: activeTab === t.key ? "#D4A017" : "#94a3b8", backgroundColor: "transparent", border: "none", borderBottom: activeTab === t.key ? "2px solid #D4A017" : "2px solid transparent", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6, marginBottom: -1.5 }}>
              {t.label}
              {t.count !== null && <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 20, backgroundColor: activeTab === t.key ? "#FEF9EC" : "#f5f5f5", color: activeTab === t.key ? "#D4A017" : "#94a3b8" }}>{t.count}</span>}
            </button>
          ))}
        </div>
        <div style={{ position: "relative", minWidth: 220 }}>
          <FiSearch size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input value={searchQuery} onChange={e => handleSearchChange(e.target.value)} placeholder="Search users..." style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 12, border: "1.5px solid #f0f0f0", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#D4A017"} onBlur={e => e.target.style.borderColor = "#f0f0f0"} />
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", overflow: "hidden" }}>
        <div className="users-table-header" style={{ display: "flex", alignItems: "center", padding: "12px 20px", backgroundColor: "#fafbfc", borderBottom: "1px solid #f0f0f0" }}>
          <span style={{ width: "22%", flexShrink: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8" }}>User</span>
          <span className="col-role" style={{ width: "8%", flexShrink: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", textAlign: "center" }}>Role</span>
          <span className="col-kyc" style={{ width: "10%", flexShrink: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", textAlign: "center" }}>KYC</span>
          <span className="col-activity" style={{ flex: 1, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8" }}>Activity</span>
          <span className="col-joined" style={{ width: "10%", flexShrink: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", textAlign: "center" }}>Joined</span>
          <span style={{ width: "9%", flexShrink: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", textAlign: "center" }}>Status</span>
          <span style={{ width: "7%", flexShrink: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", textAlign: "right" }}>Actions</span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <FiLoader size={24} style={{ color: "#D4A017", marginBottom: 8, animation: "spin 1s linear infinite" }} />
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Loading users...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <FiAlertTriangle size={32} style={{ color: "#EF4444", marginBottom: 8 }} />
            <p style={{ fontSize: 14, color: "#EF4444", margin: "0 0 12px", fontWeight: 600 }}>{error}</p>
            <button onClick={fetchUsers} style={{ padding: "8px 20px", borderRadius: 10, border: "1.5px solid #f0f0f0", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#0F2044", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <FiRefreshCw size={13} /> Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <FiUser size={32} style={{ color: "#e2e8f0", marginBottom: 8 }} />
            <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>No users found</p>
          </div>
        ) : (
          users.map(u => {
            const fullName = `${u.firstName} ${u.lastName}`;
            const rc = ROLE_COLORS[u.role] || ROLE_COLORS.Investor;
            const sc = STATUS_COLORS[u.status] || STATUS_COLORS.Active;
            const kyc = KYC_COLORS[u.kycStatus] || KYC_COLORS["Not Started"];
            const isFounder = u.role === "Founder";
            const activity = isFounder ? `${u.projectCount || 0} projects • EGP ${fmt(u.totalRaised)}` : `${u.investmentCount || 0} investments • EGP ${fmt(u.totalInvested)}`;
            return (
              <div key={u.id} className="users-table-row" style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #f5f5f5", transition: "background 0.15s", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fafbfc"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "white"}
                onClick={() => handleViewUser(u)}>
                <div style={{ width: "22%", flexShrink: 0, display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <UserAvatar name={fullName} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#0F2044", margin: "0 0 1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fullName}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</p>
                  </div>
                </div>
                <div className="col-role" style={{ width: "8%", flexShrink: 0, textAlign: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 6, backgroundColor: rc.bg, color: rc.color }}>{u.role}</span>
                </div>
                <div className="col-kyc" style={{ width: "10%", flexShrink: 0, textAlign: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: kyc.color }}>{kyc.label}</span>
                </div>
                <div className="col-activity" style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, color: "#64748b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activity}</p>
                </div>
                <div className="col-joined" style={{ width: "10%", flexShrink: 0, textAlign: "center" }}>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{fmtDate(u.createdAt)}</p>
                </div>
                <div style={{ width: "9%", flexShrink: 0, textAlign: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6, backgroundColor: sc.bg, color: sc.color, textTransform: "uppercase" }}>{u.status}</span>
                </div>
                <div style={{ width: "7%", flexShrink: 0, display: "flex", justifyContent: "flex-end" }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => handleViewUser(u)} title="View" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", backgroundColor: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", transition: "all 0.15s" }}
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

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, padding: "0 4px" }}>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
            Page {page} of {totalPages} — {totalCount} users
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
              style={{ width: 34, height: 34, borderRadius: 10, border: "1.5px solid #f0f0f0", backgroundColor: "white", cursor: page <= 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: page <= 1 ? "#d1d5db" : "#0F2044", transition: "all 0.15s" }}>
              <FiChevronLeft size={16} />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
              style={{ width: 34, height: 34, borderRadius: 10, border: "1.5px solid #f0f0f0", backgroundColor: "white", cursor: page >= totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: page >= totalPages ? "#d1d5db" : "#0F2044", transition: "all 0.15s" }}>
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 1024px) { .col-kyc, .col-joined { display: none !important; } }
        @media (max-width: 768px) { .col-role, .col-activity { display: none !important; } .users-table-header { display: none !important; } .users-table-row { flex-wrap: wrap; gap: 8px; } }
      `}</style>
    </div>
  );
}
