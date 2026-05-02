import React, { useState, useEffect, useCallback } from "react";
import { FiPlus, FiTrash2, FiX, FiCheckCircle, FiAlertTriangle, FiEye, FiEyeOff, FiShield, FiLoader, FiRefreshCw } from "react-icons/fi";
import { getAdminAccounts, createAdminAccount, deleteAdminAccount } from "../../Api/adminAccountsService";

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

/* ═══ Toast ═══ */
function Toast({ message, type }) {
  return (
    <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, padding: "14px 24px", borderRadius: 12, backgroundColor: type === "success" ? "#059669" : "#EF4444", color: "white", fontSize: 13, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 8, animation: "accSlide 0.3s ease" }}>
      <FiCheckCircle size={16} /> {message}
      <style>{`@keyframes accSlide { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}

/* ═══ Avatar ═══ */
function AdminAvatar({ name, size = 38 }) {
  const initials = (name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: 10, background: "linear-gradient(135deg, #0F2044, #1a3a6a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: size * 0.33, fontWeight: 700, color: "white" }}>{initials}</span>
    </div>
  );
}

/* ═══ Create Admin Modal ═══ */
function CreateModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [creating, setCreating] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: null })); };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password.trim()) e.password = "Required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setCreating(true);
    setTimeout(() => { onCreate(form); setCreating(false); }, 500);
  };

  const inputStyle = (err) => ({ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${err ? "#EF4444" : "#f0f0f0"}`, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", color: "#0F2044" });
  const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#0F2044", marginBottom: 4 };
  const errStyle = { fontSize: 11, color: "#EF4444", marginTop: 3 };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div style={{ position: "relative", backgroundColor: "white", borderRadius: 20, maxWidth: 440, width: "100%", padding: 28 }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: "50%", border: "none", backgroundColor: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#f5f5f5"; e.currentTarget.style.color = "#0F2044"; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}>
          <FiX size={18} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #0F2044, #1a3260)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FiShield size={16} style={{ color: "white" }} />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F2044", margin: 0 }}>Create New Admin</h3>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Grant administrator access</p>
          </div>
        </div>

        {/* Name Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>First Name <span style={{ color: "#EF4444" }}>*</span></label>
            <input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Ahmed" style={inputStyle(errors.firstName)}
              onFocus={e => e.target.style.borderColor = "#D4A017"} onBlur={e => e.target.style.borderColor = errors.firstName ? "#EF4444" : "#f0f0f0"} />
            {errors.firstName && <p style={errStyle}>{errors.firstName}</p>}
          </div>
          <div>
            <label style={labelStyle}>Last Name <span style={{ color: "#EF4444" }}>*</span></label>
            <input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Hassan" style={inputStyle(errors.lastName)}
              onFocus={e => e.target.style.borderColor = "#D4A017"} onBlur={e => e.target.style.borderColor = errors.lastName ? "#EF4444" : "#f0f0f0"} />
            {errors.lastName && <p style={errStyle}>{errors.lastName}</p>}
          </div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Email <span style={{ color: "#EF4444" }}>*</span></label>
          <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="admin@investry.com" style={inputStyle(errors.email)}
            onFocus={e => e.target.style.borderColor = "#D4A017"} onBlur={e => e.target.style.borderColor = errors.email ? "#EF4444" : "#f0f0f0"} />
          {errors.email && <p style={errStyle}>{errors.email}</p>}
        </div>

        {/* Password */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Password <span style={{ color: "#EF4444" }}>*</span></label>
          <div style={{ position: "relative" }}>
            <input type={showPwd ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} placeholder="Min 6 characters" style={{ ...inputStyle(errors.password), paddingRight: 40 }}
              onFocus={e => e.target.style.borderColor = "#D4A017"} onBlur={e => e.target.style.borderColor = errors.password ? "#EF4444" : "#f0f0f0"} />
            <button onClick={() => setShowPwd(!showPwd)} type="button" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", border: "none", backgroundColor: "transparent", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center" }}>
              {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {errors.password && <p style={errStyle}>{errors.password}</p>}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "1.5px solid #e5e7eb", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#64748b", cursor: "pointer" }}>Cancel</button>
          <button onClick={handleSubmit} disabled={creating} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", backgroundColor: creating ? "#94a3b8" : "#0F2044", fontSize: 13, fontWeight: 600, color: "white", cursor: creating ? "not-allowed" : "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { if (!creating) e.currentTarget.style.opacity = "0.9"; }} onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
            {creating ? "Creating..." : "Create Admin"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══ Delete Confirmation ═══ */
function DeleteModal({ admin, onClose, onConfirm }) {
  if (!admin) return null;
  const fullName = `${admin.firstName} ${admin.lastName}`;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div style={{ position: "relative", backgroundColor: "white", borderRadius: 20, maxWidth: 380, width: "100%", padding: 28, textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <FiAlertTriangle size={24} style={{ color: "#EF4444" }} />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F2044", margin: "0 0 6px" }}>Remove Admin Access?</h3>
        <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px", lineHeight: 1.6 }}>
          Are you sure you want to remove <strong style={{ color: "#0F2044" }}>{fullName}</strong>'s admin access? This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "1.5px solid #e5e7eb", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#64748b", cursor: "pointer" }}>Cancel</button>
          <button onClick={() => onConfirm(admin)} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", backgroundColor: "#EF4444", fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#DC2626"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#EF4444"}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════ MAIN PAGE ═══════════ */
export default function AdminAccountsPage() {
  const [admins, setAdmins] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  /* ── Fetch admins from API ── */
  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getAdminAccounts();
      setAdmins(list);
    } catch (err) {
      console.error("Failed to load admins:", err);
      setError("Failed to load admin accounts");
      showToast("Failed to load admin accounts", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  /* ── Create admin via API ── */
  const handleCreate = async (form) => {
    setActionLoading(true);
    try {
      await createAdminAccount(form);
      setShowCreate(false);
      showToast("Admin account created successfully");
      await fetchAdmins();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || "Failed to create admin";
      showToast(msg, "error");
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Delete admin via API ── */
  const handleDelete = async (admin) => {
    setActionLoading(true);
    try {
      await deleteAdminAccount(admin.id);
      setDeleteTarget(null);
      showToast(`Admin access removed for ${admin.firstName} ${admin.lastName}`, "error");
      await fetchAdmins();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || "Failed to remove admin";
      showToast(msg, "error");
      setDeleteTarget(null);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ padding: "8px 0" }}>
      {toast && <Toast message={toast.msg} type={toast.type} />}
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
      {deleteTarget && <DeleteModal admin={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />}

      {/* Header */}
      <div className="acc-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0F2044", margin: "0 0 4px" }}>Admin Accounts</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Manage administrator access</p>
        </div>
        <button onClick={() => setShowCreate(true)} style={{ padding: "11px 20px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #0F2044, #1a3260)", fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.9"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
          <FiPlus size={15} /> Add Admin
        </button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", overflow: "hidden" }}>
        {/* Header */}
        <div className="acc-table-header" style={{ display: "flex", alignItems: "center", padding: "12px 20px", backgroundColor: "#fafbfc", borderBottom: "1px solid #f0f0f0" }}>
          <span style={{ width: "28%", flexShrink: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8" }}>Admin</span>
          <span style={{ flex: 1, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8" }}>Email</span>
          <span className="col-created" style={{ width: "12%", flexShrink: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", textAlign: "center" }}>Created</span>
          <span className="col-login" style={{ width: "12%", flexShrink: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", textAlign: "center" }}>Last Login</span>
          <span style={{ width: "8%", flexShrink: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", textAlign: "right" }}>Actions</span>
        </div>

        {/* Rows */}
        {loading ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <FiLoader size={24} style={{ color: "#D4A017", marginBottom: 8, animation: "accSpin 1s linear infinite" }} />
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Loading admin accounts...</p>
          </div>
        ) : error ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <FiAlertTriangle size={32} style={{ color: "#EF4444", marginBottom: 8 }} />
            <p style={{ fontSize: 14, color: "#EF4444", margin: "0 0 12px", fontWeight: 600 }}>{error}</p>
            <button onClick={fetchAdmins} style={{ padding: "8px 20px", borderRadius: 10, border: "1.5px solid #f0f0f0", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#0F2044", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <FiRefreshCw size={13} /> Retry
            </button>
          </div>
        ) : admins.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <FiShield size={32} style={{ color: "#e2e8f0", marginBottom: 8 }} />
            <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>No admin accounts</p>
          </div>
        ) : (
          admins.map(a => {
            const fullName = `${a.firstName} ${a.lastName}`;
            return (
              <div key={a.id} className="acc-table-row" style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #f5f5f5", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fafbfc"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "white"}>
                {/* Admin */}
                <div style={{ width: "28%", flexShrink: 0, display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <AdminAvatar name={fullName} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#0F2044", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fullName}</p>
                    <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 5, background: "linear-gradient(135deg, #0F2044, #1a3260)", color: "white", textTransform: "uppercase", letterSpacing: 0.5 }}>Admin</span>
                  </div>
                </div>
                {/* Email */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: "#64748b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.email}</p>
                </div>
                {/* Created */}
                <div className="col-created" style={{ width: "12%", flexShrink: 0, textAlign: "center" }}>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{fmtDate(a.createdAt)}</p>
                </div>
                {/* Last Login */}
                <div className="col-login" style={{ width: "12%", flexShrink: 0, textAlign: "center" }}>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{fmtDate(a.lastLogin)}</p>
                </div>
                {/* Actions */}
                <div style={{ width: "8%", flexShrink: 0, display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={() => setDeleteTarget(a)} title="Remove" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", backgroundColor: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#EF4444"; e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.backgroundColor = "#FEF2F2"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.backgroundColor = "white"; }}>
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Responsive */}
      <style>{`
        @keyframes accSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .col-created, .col-login { display: none !important; }
          .acc-table-header { display: none !important; }
          .acc-table-row { flex-wrap: wrap; gap: 8px; }
          .acc-header { flex-direction: column; align-items: flex-start !important; }
          .acc-header button { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
