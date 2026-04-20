import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function FounderProfile() {
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

  /* ── Axios instance ── */
  const token = localStorage.getItem("token");
  const api   = axios.create({
    baseURL: "https://investry.runasp.net/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  /* ── Fetch profile on mount ── */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res  = await api.get("/Accounts/profile");
        const data = res.data?.data;
        if (data) {
          setProfileData(data);
          setFirstName(data.firstName  || "");
          setLastName(data.lastName    || "");
          setProfileImage(data.profilePictureUrl || null);
          // ✅ الصح: نقارن بـ "Approved" بس
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
          const res    = await api.get("/Accounts/profile");
          const status = res.data?.data?.kycStatus;
          // ✅ الصح: نقارن بـ "Approved" بس
          if (status === "Approved") setKycVerified(true);
        } catch { /* silent */ }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [kycVerified]);

  /* ── Pick image locally (no upload yet) ── */
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
        await api.post("/Accounts/upload-profile-picture", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const nameChanged =
        firstName !== (profileData?.firstName || "") ||
        lastName  !== (profileData?.lastName  || "");

      if (nameChanged) {
        await api.patch("/Accounts", { firstName, lastName });
      }

      if (newPassword) {
        await api.post("/Accounts/change-password", {
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
      const res = await api.post("/Kyc/create-session");
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

  /* ── Shared classes ── */
  const inp = (err) =>
    `w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white border rounded-xl
     placeholder:text-slate-400 outline-none transition-all
     focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20
     ${err ? "border-red-400 ring-2 ring-red-400/20" : "border-slate-200 hover:border-slate-300"}`;

  const inpDisabled =
    "w-full px-3.5 py-2.5 text-sm text-slate-400 bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-not-allowed";

  const lbl =
    "flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2";

  /* ── Loading skeleton ── */
  if (loadingProfile) {
    return (
      <div className="w-full py-6 flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full py-6">

      {/* ── Page title ── */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/founder")}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C9A84C] hover:text-[#b8963f] bg-transparent border-none cursor-pointer p-0 mb-2 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Home
        </button>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Edit Profile</h1>
      </div>

      <div className="flex flex-col gap-4">

        {/* ══ Row 1 — Picture + KYC ══ */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* Profile Picture */}
          <Card>
            <CardHead title="Profile Picture" />
            <div className="px-5 py-5 flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-0.5">Profile photo</p>
                {selectedFile && (
                  <p className="text-xs text-[#C9A84C] mb-1">New photo selected — will upload on Save</p>
                )}
                {!selectedFile && (
                  <p className="text-xs text-slate-400 mb-3">JPG, PNG or GIF · Max 5MB</p>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#C9A84C] border border-[#C9A84C]/40 rounded-lg bg-[#C9A84C]/5 hover:bg-[#C9A84C]/10 transition-colors cursor-pointer mt-1"
                >
                  Change photo
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              </div>
            </div>
          </Card>

          {/* KYC */}
          <Card>
            <CardHead title="KYC Verification" sub="Identity verification status" />
            <div className="px-5 py-5">
              <KycStatusBlock
                status={profileData?.kycStatus}
                kycLoading={kycLoading}
                kycError={kycError}
                onStart={handleKycStart}
              />
            </div>
          </Card>
        </div>

        {/* ══ Account Information ══ */}
        <Card>
          <CardHead title="Account Information" sub="Managed by the system · Contact support to make changes" />
          <div className="px-5 py-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <label className={lbl}>Email <LockIcon /></label>
              <input type="email" value={profileData?.email || ""} disabled className={inpDisabled} />
            </div>
            <div>
              <label className={lbl}>Username <LockIcon /></label>
              <input type="text" value={profileData?.userName || ""} disabled className={inpDisabled} />
            </div>
            <div>
              <label className={lbl}>Phone <LockIcon /></label>
              <input type="tel" value={profileData?.phoneNumber || ""} disabled className={inpDisabled} />
            </div>
          </div>
        </Card>

        {/* ══ Personal Information ══ */}
        <Card>
          <CardHead title="Personal Information" sub="Update your display name" />
          <div className="px-5 py-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="firstName" className={lbl}>First Name</label>
              <input id="firstName" type="text" value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className={inp(errors.firstName)} />
              {errors.firstName && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className={lbl}>Last Name</label>
              <input id="lastName" type="text" value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className={inp(errors.lastName)} />
              {errors.lastName && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.lastName}</p>}
            </div>
          </div>
        </Card>

        {/* ══ Change Password ══ */}
        <Card>
          <CardHead title="Change Password" sub="Leave blank if you don't want to change your password" />
          <div className="px-5 py-5 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="currentPassword" className={lbl}>Current Password</label>
                <div className="relative">
                  <input id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className={inp(errors.currentPassword) + " pr-11"} />
                  <EyeToggle show={showCurrentPassword} onToggle={() => setShowCurrentPassword(!showCurrentPassword)} />
                </div>
                {errors.currentPassword && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.currentPassword}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="newPassword" className={lbl}>New Password</label>
                <div className="relative">
                  <input id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className={inp(errors.newPassword) + " pr-11"} />
                  <EyeToggle show={showNewPassword} onToggle={() => setShowNewPassword(!showNewPassword)} />
                </div>
                {errors.newPassword && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.newPassword}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className={lbl}>Confirm New Password</label>
                <div className="relative">
                  <input id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className={inp(errors.confirmPassword) + " pr-11"} />
                  <EyeToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
                </div>
                {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>
        </Card>

        {/* ══ Bottom Actions ══ */}
        <div className="flex flex-col gap-3">

          {saveSuccess && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100 text-sm font-medium text-emerald-700">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Profile saved successfully!
            </div>
          )}

          {saveError && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm font-medium text-red-600">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {saveError}
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end md:gap-3 pb-2">
            <button type="button" onClick={handleCancel} disabled={saving}
              className="w-full md:w-auto px-6 py-2.5 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50">
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={saving}
              className="w-full md:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 border-none rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10"/>
                  </svg>
                  Saving...
                </span>
              ) : "Save changes"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}


/* ─── Card components ─── */

function Card({ children }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      {children}
    </div>
  );
}

function CardHead({ title, sub }) {
  return (
    <div className="px-5 pt-5 pb-4 border-b border-slate-100">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

/* ─── Icons ─── */

function EyeToggle({ show, onToggle }) {
  return (
    <button type="button" onClick={onToggle} aria-label="Toggle password visibility"
      className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0.5 opacity-40 hover:opacity-80 transition-opacity flex items-center">
      {show ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
          <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
        </svg>
      )}
    </button>
  );
}

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

/* ─── KYC Status Block ─── */

const KYC_CONFIG = {
  Approved: {
    bg: "bg-emerald-50", border: "border-emerald-100",
    iconBg: "bg-emerald-100", iconStroke: "#059669",
    title: "text-emerald-800", sub: "text-emerald-600",
    badgeBg: "bg-emerald-100", badgeText: "text-emerald-700", dot: "bg-emerald-500",
    label: "APPROVED", subText: "Your identity has been confirmed",
    icon: <polyline points="20 6 9 17 4 12" />,
    showButton: false,
  },
  Pending: {
    bg: "bg-amber-50", border: "border-amber-100",
    iconBg: "bg-amber-100", iconStroke: "#d97706",
    title: "text-amber-800", sub: "text-amber-600",
    badgeBg: "bg-amber-100", badgeText: "text-amber-700", dot: "bg-amber-400",
    label: "PENDING", subText: "Complete KYC to unlock all features",
    icon: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    showButton: true,
  },
  InReview: {
    bg: "bg-blue-50", border: "border-blue-100",
    iconBg: "bg-blue-100", iconStroke: "#2563eb",
    title: "text-blue-800", sub: "text-blue-600",
    badgeBg: "bg-blue-100", badgeText: "text-blue-700", dot: "bg-blue-400",
    label: "IN REVIEW", subText: "Your documents are being reviewed",
    icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    showButton: false,
  },
  Declined: {
    bg: "bg-red-50", border: "border-red-100",
    iconBg: "bg-red-100", iconStroke: "#dc2626",
    title: "text-red-800", sub: "text-red-600",
    badgeBg: "bg-red-100", badgeText: "text-red-700", dot: "bg-red-500",
    label: "DECLINED", subText: "Your verification was declined. Please resubmit.",
    icon: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    showButton: true,
  },
  Resubmitted: {
    bg: "bg-purple-50", border: "border-purple-100",
    iconBg: "bg-purple-100", iconStroke: "#7c3aed",
    title: "text-purple-800", sub: "text-purple-600",
    badgeBg: "bg-purple-100", badgeText: "text-purple-700", dot: "bg-purple-400",
    label: "RESUBMITTED", subText: "Your resubmission is under review. You can resubmit again if needed.",
    icon: <><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.85"/></>,
    showButton: true,
  },
  Expired: {
    bg: "bg-slate-50", border: "border-slate-200",
    iconBg: "bg-slate-200", iconStroke: "#64748b",
    title: "text-slate-700", sub: "text-slate-500",
    badgeBg: "bg-slate-200", badgeText: "text-slate-600", dot: "bg-slate-400",
    label: "EXPIRED", subText: "Your verification has expired. Please restart.",
    icon: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    showButton: true,
  },
};

function KycStatusBlock({ status, kycLoading, kycError, onStart }) {
  const cfg = KYC_CONFIG[status] || KYC_CONFIG["Pending"];

  return (
    <div className="flex flex-col gap-3">
      <div className={`flex items-center gap-3 p-4 rounded-xl border ${cfg.bg} ${cfg.border}`}>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={cfg.iconStroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {cfg.icon}
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${cfg.title}`}>{status || "Pending"}</p>
          <p className={`text-xs ${cfg.sub}`}>{cfg.subText}</p>
        </div>
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full tracking-wide shrink-0 ${cfg.badgeBg} ${cfg.badgeText}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      </div>

      {kycError && <p className="text-xs text-red-500 font-medium px-1">{kycError}</p>}

      {cfg.showButton && (
        <button
          type="button"
          disabled={kycLoading}
          onClick={onStart}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold border-none transition-all duration-200
            ${kycLoading ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] shadow-sm cursor-pointer"}`}
        >
          {kycLoading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10"/>
              </svg>
              Creating session...
            </span>
          ) : status === "Declined" || status === "Expired" ? "Restart KYC Verification" : status === "Resubmitted" ? "Resubmit Again" : "Start KYC Verification"}
        </button>
      )}
    </div>
  );
}