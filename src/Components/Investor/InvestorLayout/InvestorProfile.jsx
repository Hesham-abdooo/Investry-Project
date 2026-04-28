import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCamera, FiUser, FiLock, FiEye, FiEyeOff, FiCheck, FiAlertCircle, FiShield } from "react-icons/fi";
import axiosInstance from "../../../Api/axiosInstance";

export default function InvestorProfile() {
  const navigate = useNavigate();

  /* ── State ── */
  const [profileData, setProfileData]         = useState(null);
  const [loadingProfile, setLoadingProfile]   = useState(true);

  const [firstName, setFirstName]             = useState("");
  const [lastName, setLastName]               = useState("");

  const [profileImage, setProfileImage]       = useState(null);
  const [selectedFile, setSelectedFile]       = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword]         = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors]       = useState({});
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [kycVerified, setKycVerified] = useState(false);
  const [kycLoading, setKycLoading]   = useState(false);
  const [kycError, setKycError]       = useState("");

  const fileInputRef = useRef(null);

  /* ── Fetch profile on mount ── */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res  = await axiosInstance.get("/Accounts/profile");
        const data = res.data?.data;
        if (data) {
          setProfileData(data);
          setFirstName(data.firstName  || "");
          setLastName(data.lastName    || "");
          setProfileImage(data.profilePictureUrl || null);
          if (data.kycStatus === "Approved") setKycVerified(true);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  /* ── Re-check KYC when user returns to tab ── */
  useEffect(() => {
    const handleVisibility = async () => {
      if (document.visibilityState === "visible" && !kycVerified) {
        try {
          const res    = await axiosInstance.get("/Accounts/profile");
          const status = res.data?.data?.kycStatus;
          if (status === "Approved") setKycVerified(true);
        } catch { /* silent */ }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [kycVerified]);

  /* ── Pick image locally ── */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!firstName.trim()) e.firstName = "First name is required.";
    if (!lastName.trim())  e.lastName  = "Last name is required.";
    if (newPassword && newPassword.length < 8)
      e.newPassword = "Password must be at least 8 characters.";
    if (newPassword && confirmPassword && newPassword !== confirmPassword)
      e.confirmPassword = "Passwords do not match.";
    if (newPassword && !currentPassword)
      e.currentPassword = "Please enter your current password.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Save ── */
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("File", selectedFile);
        await axiosInstance.post("/Accounts/upload-profile-picture", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      const nameChanged =
        firstName !== (profileData?.firstName || "") ||
        lastName  !== (profileData?.lastName  || "");
      if (nameChanged) {
        await axiosInstance.patch("/Accounts", { firstName, lastName });
      }
      if (newPassword) {
        await axiosInstance.post("/Accounts/change-password", {
          currentPassword,
          newPassword,
          confirmNewPassword: confirmPassword,
        });
      }
      if (!selectedFile && !nameChanged && !newPassword) {
        setSaveError("No changes to save.");
        return;
      }
      setSaveSuccess(true);
      setSelectedFile(null);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profileData) {
      setFirstName(profileData.firstName || "");
      setLastName(profileData.lastName   || "");
      setProfileImage(profileData.profilePictureUrl || null);
    }
    setSelectedFile(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    setSaveError("");
    setSaveSuccess(false);
  };

  /* ── KYC ── */
  const handleKycStart = async () => {
    setKycLoading(true);
    setKycError("");
    try {
      const res = await axiosInstance.post("/Kyc/create-session");
      const { success, data, errors: apiErrors } = res.data;
      if (!success || !data?.verificationUrl) {
        setKycError(apiErrors?.[0]?.message || "Failed to start KYC. Please try again.");
        return;
      }
      window.open(data.verificationUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        "Network error. Please check your connection.";
      setKycError(msg);
    } finally {
      setKycLoading(false);
    }
  };

  /* ── Loading skeleton ── */
  if (loadingProfile) {
    return (
      <div style={{ padding: "8px 0" }}>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
        <div style={{ animation: "pulse 1.5s ease-in-out infinite", width: 120, height: 20, borderRadius: 8, backgroundColor: "#f3f4f6", marginBottom: 8 }} />
        <div style={{ animation: "pulse 1.5s ease-in-out infinite", width: 200, height: 12, borderRadius: 6, backgroundColor: "#f3f4f6", marginBottom: 24 }} />
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ animation: "pulse 1.5s ease-in-out infinite", height: 120, borderRadius: 16, backgroundColor: "white", border: "1.5px solid #f0f0f0", marginBottom: 16 }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: "8px 0" }}>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: 24 }}>
        <button type="button" onClick={() => navigate("/investor")}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#D4A017", backgroundColor: "transparent", border: "none", cursor: "pointer", padding: 0, marginBottom: 8, transition: "opacity 0.2s" }}>
          <FiArrowLeft size={14} /> Back to Overview
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0F2044", margin: 0 }}>Profile & KYC</h1>
        <p style={{ fontSize: 14, color: "#94a3b8", margin: "4px 0 0" }}>Manage your account and verification</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ══ Row 1 — Picture + KYC ══ */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* Profile Picture */}
          <Card title="Profile Picture" icon={<FiCamera size={14} style={{ color: "#D4A017" }} />}>
            <div style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, overflow: "hidden", backgroundColor: "#FEF9EC", border: "2px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <FiUser size={24} style={{ color: "#D4A017" }} />
                )}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#0F2044", margin: "0 0 2px" }}>Profile photo</p>
                {selectedFile ? (
                  <p style={{ fontSize: 12, color: "#D4A017", margin: "0 0 10px" }}>New photo selected — will upload on Save</p>
                ) : (
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 10px" }}>JPG, PNG or GIF · Max 5MB</p>
                )}
                <button type="button" onClick={() => fileInputRef.current.click()}
                  style={{ fontSize: 12, fontWeight: 600, color: "#D4A017", backgroundColor: "#FEF9EC", border: "1.5px solid rgba(212,160,23,0.2)", borderRadius: 10, padding: "6px 16px", cursor: "pointer", transition: "all 0.2s" }}>
                  Change photo
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: "none" }} />
              </div>
            </div>
          </Card>

          {/* KYC */}
          <Card title="KYC Verification" sub="Identity verification status" icon={<FiShield size={14} style={{ color: "#D4A017" }} />}>
            <div style={{ padding: 20 }}>
              <KycStatusBlock status={profileData?.kycStatus} kycLoading={kycLoading} kycError={kycError} onStart={handleKycStart} />
            </div>
          </Card>
        </div>

        {/* ══ Account Information ══ */}
        <Card title="Account Information" sub="Managed by the system · Contact support to make changes" icon={<FiLock size={14} style={{ color: "#94a3b8" }} />}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3" style={{ padding: 20 }}>
            <InputField label="Email" value={profileData?.email || ""} disabled locked />
            <InputField label="Username" value={profileData?.userName || ""} disabled locked />
            <InputField label="Phone" value={profileData?.phoneNumber || ""} disabled locked />
          </div>
        </Card>

        {/* ══ Personal Information ══ */}
        <Card title="Personal Information" sub="Update your display name" icon={<FiUser size={14} style={{ color: "#D4A017" }} />}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2" style={{ padding: 20 }}>
            <InputField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter first name" error={errors.firstName} />
            <InputField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter last name" error={errors.lastName} />
          </div>
        </Card>

        {/* ══ Change Password ══ */}
        <Card title="Change Password" sub="Leave blank if you don't want to change" icon={<FiLock size={14} style={{ color: "#D4A017" }} />}>
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PasswordField label="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} show={showCurrentPassword} onToggle={() => setShowCurrentPassword(!showCurrentPassword)} placeholder="Enter current password" error={errors.currentPassword} />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <PasswordField label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} show={showNewPassword} onToggle={() => setShowNewPassword(!showNewPassword)} placeholder="Min. 8 characters" error={errors.newPassword} />
              <PasswordField label="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} placeholder="Repeat new password" error={errors.confirmPassword} />
            </div>
          </div>
        </Card>

        {/* ══ Bottom Actions ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {saveSuccess && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 12, backgroundColor: "#ECFDF5", border: "1.5px solid #C8E6C9", fontSize: 13, fontWeight: 600, color: "#2E7D32" }}>
              <FiCheck size={15} /> Profile saved successfully!
            </div>
          )}
          {saveError && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 12, backgroundColor: "#FEF2F2", border: "1.5px solid #FECACA", fontSize: 13, fontWeight: 600, color: "#DC2626" }}>
              <FiAlertCircle size={15} /> {saveError}
            </div>
          )}
          <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end md:gap-3" style={{ paddingBottom: 8 }}>
            <button type="button" onClick={handleCancel} disabled={saving}
              style={{ padding: "10px 24px", fontSize: 13, fontWeight: 600, color: "#94a3b8", backgroundColor: "white", border: "1.5px solid #f0f0f0", borderRadius: 12, cursor: "pointer", transition: "all 0.2s", opacity: saving ? 0.5 : 1 }}>
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={saving}
              style={{ padding: "10px 24px", fontSize: 13, fontWeight: 700, color: "white", backgroundColor: "#0F2044", border: "none", borderRadius: 12, cursor: saving ? "not-allowed" : "pointer", transition: "all 0.25s", opacity: saving ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* ══  REUSABLE COMPONENTS                             ══ */
/* ═══════════════════════════════════════════════════════ */

function Card({ title, sub, icon, children }) {
  return (
    <div style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f5f5f5", display: "flex", alignItems: "center", gap: 8 }}>
        {icon}
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#0F2044", margin: 0 }}>{title}</p>
          {sub && <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>{sub}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

const inputBase = {
  width: "100%", padding: "10px 14px", fontSize: 13, fontWeight: 500, color: "#0F2044",
  backgroundColor: "white", border: "1.5px solid #f0f0f0", borderRadius: 12,
  outline: "none", transition: "all 0.2s", fontFamily: "inherit",
};

function InputField({ label, value, onChange, placeholder, error, disabled, locked }) {
  return (
    <div>
      <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", marginBottom: 6 }}>
        {label} {locked && <FiLock size={10} />}
      </label>
      <input type="text" value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
        style={{ ...inputBase, backgroundColor: disabled ? "#FAFBFC" : "white", color: disabled ? "#94a3b8" : "#0F2044", cursor: disabled ? "not-allowed" : "text", borderColor: error ? "#FECACA" : "#f0f0f0" }}
        onFocus={(e) => { if (!disabled) { e.target.style.borderColor = "#D4A017"; e.target.style.boxShadow = "0 0 0 3px rgba(212,160,23,0.1)"; } }}
        onBlur={(e) => { e.target.style.borderColor = error ? "#FECACA" : "#f0f0f0"; e.target.style.boxShadow = "none"; }} />
      {error && <p style={{ fontSize: 11, color: "#DC2626", fontWeight: 500, margin: "4px 0 0" }}>{error}</p>}
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle, placeholder, error }) {
  return (
    <div>
      <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input type={show ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder}
          style={{ ...inputBase, paddingRight: 40, borderColor: error ? "#FECACA" : "#f0f0f0" }}
          onFocus={(e) => { e.target.style.borderColor = "#D4A017"; e.target.style.boxShadow = "0 0 0 3px rgba(212,160,23,0.1)"; }}
          onBlur={(e) => { e.target.style.borderColor = error ? "#FECACA" : "#f0f0f0"; e.target.style.boxShadow = "none"; }} />
        <button type="button" onClick={onToggle}
          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", opacity: 0.4 }}>
          {show ? <FiEye size={16} color="#0F2044" /> : <FiEyeOff size={16} color="#0F2044" />}
        </button>
      </div>
      {error && <p style={{ fontSize: 11, color: "#DC2626", fontWeight: 500, margin: "4px 0 0" }}>{error}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* ══  KYC STATUS BLOCK                                ══ */
/* ═══════════════════════════════════════════════════════ */

const KYC_CONFIG = {
  Approved: {
    bg: "#ECFDF5", border: "#C8E6C9", iconBg: "#C8E6C9", iconColor: "#2E7D32",
    title: "#2E7D32", sub: "#4CAF50", dotColor: "#059669",
    label: "APPROVED", subText: "Your identity has been confirmed",
    showButton: false,
  },
  Pending: {
    bg: "#FEF9EC", border: "rgba(212,160,23,0.2)", iconBg: "rgba(212,160,23,0.15)", iconColor: "#D4A017",
    title: "#D4A017", sub: "#94a3b8", dotColor: "#D4A017",
    label: "PENDING", subText: "Complete KYC to unlock all features",
    showButton: true,
  },
  InReview: {
    bg: "#EFF6FF", border: "#BFDBFE", iconBg: "#DBEAFE", iconColor: "#2563EB",
    title: "#1E40AF", sub: "#3B82F6", dotColor: "#3B82F6",
    label: "IN REVIEW", subText: "Your documents are being reviewed",
    showButton: false,
  },
  Declined: {
    bg: "#FEF2F2", border: "#FECACA", iconBg: "#FEE2E2", iconColor: "#DC2626",
    title: "#DC2626", sub: "#EF4444", dotColor: "#DC2626",
    label: "DECLINED", subText: "Your verification was declined. Please resubmit.",
    showButton: true,
  },
  Resubmitted: {
    bg: "#F5F3FF", border: "#DDD6FE", iconBg: "#EDE9FE", iconColor: "#7C3AED",
    title: "#6D28D9", sub: "#8B5CF6", dotColor: "#8B5CF6",
    label: "RESUBMITTED", subText: "Your resubmission is under review.",
    showButton: true,
  },
  Expired: {
    bg: "#F9FAFB", border: "#E5E7EB", iconBg: "#F3F4F6", iconColor: "#6B7280",
    title: "#374151", sub: "#9CA3AF", dotColor: "#9CA3AF",
    label: "EXPIRED", subText: "Your verification has expired. Please restart.",
    showButton: true,
  },
};

function KycStatusBlock({ status, kycLoading, kycError, onStart }) {
  const cfg = KYC_CONFIG[status] || KYC_CONFIG["Pending"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 12, backgroundColor: cfg.bg, border: `1.5px solid ${cfg.border}` }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: cfg.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <FiShield size={16} style={{ color: cfg.iconColor }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: cfg.title, margin: "0 0 2px" }}>{status || "Pending"}</p>
          <p style={{ fontSize: 11, color: cfg.sub, margin: 0 }}>{cfg.subText}</p>
        </div>
        <span style={{ fontSize: 9, fontWeight: 700, padding: "4px 10px", borderRadius: 6, backgroundColor: cfg.iconBg, color: cfg.title, textTransform: "uppercase", letterSpacing: 0.5, display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: cfg.dotColor }} />
          {cfg.label}
        </span>
      </div>

      {kycError && <p style={{ fontSize: 11, color: "#DC2626", fontWeight: 500, margin: 0, paddingLeft: 4 }}>{kycError}</p>}

      {cfg.showButton && (
        <button type="button" disabled={kycLoading} onClick={onStart}
          style={{ width: "100%", padding: "10px 0", borderRadius: 12, fontSize: 13, fontWeight: 700, border: "none", transition: "all 0.25s", cursor: kycLoading ? "not-allowed" : "pointer", backgroundColor: kycLoading ? "#f3f4f6" : "#0F2044", color: kycLoading ? "#94a3b8" : "white" }}>
          {kycLoading ? "Creating session..." : status === "Declined" || status === "Expired" ? "Restart KYC Verification" : status === "Resubmitted" ? "Resubmit Again" : "Start KYC Verification"}
        </button>
      )}
    </div>
  );
}