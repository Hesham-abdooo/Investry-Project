import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FounderProfile() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [kycVerified, setKycVerified] = useState(false);
    const [kycLoading, setKycLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChangePhoto = () => {
        fileInputRef.current.click();
    };

    const validate = () => {
        const newErrors = {};

        if (!firstName.trim()) {
            newErrors.firstName = 'First name is required.';
        }

        if (!lastName.trim()) {
            newErrors.lastName = 'Last name is required.';
        }

        if (newPassword && newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters long.';
        }

        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        if (newPassword && !currentPassword) {
            newErrors.currentPassword = 'Please enter your current password.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validate()) {
            alert('Profile saved successfully!');
        }
    };

    const handleCancel = () => {
        setFirstName('');
        setLastName('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrors({});
    };

    const inputBase =
        'w-full px-4 py-3 border rounded-[10px] text-[15px] font-normal text-slate-800 bg-white outline-none transition-all duration-200 font-[Inter] placeholder:text-slate-400 focus:border-[#C9A84C] focus:ring-[3px] focus:ring-[#C9A84C]/15 sm:text-sm sm:py-2.5 sm:px-3.5';

    const inputError = 'border-red-500 ring-[3px] ring-red-500/8';
    const inputNormal = 'border-[#dde1e8]';

    return (
        <>
        <div className="max-w-[640px] mx-auto px-6 pt-8 pb-16 sm:px-4 sm:pt-5 sm:pb-10">
            {/* Back to Home */}
            <button
                type="button"
                onClick={() => navigate('/founder')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#C9A84C] bg-transparent border-none cursor-pointer mb-2 transition-colors duration-200 hover:text-[#b8963f] p-0"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5" />
                    <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to Home
            </button>

            {/* Page Title */}
            <h1 className="text-[26px] font-extrabold text-slate-900 mb-6 tracking-tight sm:text-[22px] sm:mb-[18px]">
                Edit Profile
            </h1>

            {/* Main Card */}
            <div className="bg-white border border-[#e8ebf0] rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.03)]">

                {/* ─── Profile Picture ─── */}
                <div className="px-8 py-7 sm:px-5 sm:py-[22px]">
                    <label className="block text-sm font-semibold text-slate-800 mb-3">
                        Profile picture
                    </label>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-slate-100 border-2 border-slate-200 flex items-center justify-center transition-colors duration-200 hover:border-slate-300 sm:w-14 sm:h-14">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            )}
                        </div>
                        <button
                            type="button"
                            className="px-[18px] py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-slate-800 cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900"
                            onClick={handleChangePhoto}
                        >
                            Change photo
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                </div>

                <div className="w-full h-px bg-[#f1f3f7]" />

                {/* ─── KYC Status ─── */}
                <div className="px-8 py-7 sm:px-5 sm:py-[22px]">
                    <label className="block text-sm font-semibold text-slate-800 mb-3">
                        KYC status
                    </label>

                    {kycVerified ? (
                        /* ── Verified ── */
                        <div className="flex items-center justify-between bg-slate-50 border border-[#e8ebf0] rounded-[10px] px-[18px] py-3.5 transition-all duration-300 sm:flex-col sm:items-start sm:gap-2.5">
                            <span className="text-sm font-medium text-slate-700">Identity Verification</span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 tracking-wide">
                                <span className="w-[7px] h-[7px] rounded-full bg-emerald-500" />
                                ACTIVE
                            </span>
                        </div>
                    ) : (
                        /* ── Not Verified ── */
                        <div className="bg-slate-50 border border-[#e8ebf0] rounded-[10px] px-[18px] py-4 transition-all duration-300">
                            <div className="flex items-center justify-between mb-3 sm:flex-col sm:items-start sm:gap-2">
                                <span className="text-sm font-medium text-slate-700">Identity Verification</span>
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 tracking-wide">
                                    <span className="w-[7px] h-[7px] rounded-full bg-amber-500" />
                                    PENDING
                                </span>
                            </div>
                            <p className="text-[13px] text-slate-500 leading-relaxed mb-4">
                                Complete your KYC verification to unlock all platform features. This process is handled by our secure verification partner.
                            </p>
                            <button
                                type="button"
                                disabled={kycLoading}
                                onClick={() => {
                                    setKycLoading(true);
                                    // TODO: Replace with actual KYC provider redirect/SDK
                                    setTimeout(() => {
                                        setKycVerified(true);
                                        setKycLoading(false);
                                    }, 2000);
                                }}
                                className={`w-full py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 border-none ${
                                    kycLoading
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.2)] hover:shadow-[0_2px_6px_rgba(15,23,42,0.3)] active:scale-[0.98]'
                                }`}
                            >
                                {kycLoading ? (
                                    <span className="inline-flex items-center justify-center gap-2">
                                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                            <path d="M12 2a10 10 0 0 1 10 10" />
                                        </svg>
                                        Verifying...
                                    </span>
                                ) : (
                                    'Verify your KYC'
                                )}
                            </button>
                        </div>
                    )}
                </div>

                <div className="w-full h-px bg-[#f1f3f7]" />

                {/* ─── Name Fields ─── */}
                <div className="px-8 py-7 sm:px-5 sm:py-[22px]">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-3" htmlFor="firstName">
                                First name
                            </label>
                            <input
                                id="firstName"
                                type="text"
                                className={`${inputBase} ${errors.firstName ? inputError : inputNormal}`}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter first name"
                            />
                            {errors.firstName && (
                                <p className="mt-1.5 text-[13px] font-medium text-red-500">{errors.firstName}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-3" htmlFor="lastName">
                                Last name
                            </label>
                            <input
                                id="lastName"
                                type="text"
                                className={`${inputBase} ${errors.lastName ? inputError : inputNormal}`}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter last name"
                            />
                            {errors.lastName && (
                                <p className="mt-1.5 text-[13px] font-medium text-red-500">{errors.lastName}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-full h-px bg-[#f1f3f7]" />

                {/* ─── Change Password ─── */}
                <div className="px-8 py-7 sm:px-5 sm:py-[22px]">
                    <h2 className="text-lg font-bold text-slate-900 mb-6 tracking-tight sm:text-base">
                        Change password
                    </h2>

                    {/* Current Password */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-slate-800 mb-3" htmlFor="currentPassword">
                            Current password
                        </label>
                        <div className="relative">
                            <input
                                id="currentPassword"
                                type={showCurrentPassword ? 'text' : 'password'}
                                className={`${inputBase} pr-12 sm:pr-11 ${errors.currentPassword ? inputError : inputNormal}`}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center opacity-60 transition-opacity duration-200 hover:opacity-100"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                aria-label="Toggle current password visibility"
                            >
                                {showCurrentPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <p className="mt-1.5 text-[13px] font-medium text-red-500">{errors.currentPassword}</p>
                        )}
                    </div>

                    {/* New Password */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-slate-800 mb-3" htmlFor="newPassword">
                            New password
                        </label>
                        <div className="relative">
                            <input
                                id="newPassword"
                                type={showNewPassword ? 'text' : 'password'}
                                className={`${inputBase} pr-12 sm:pr-11 ${errors.newPassword ? inputError : inputNormal}`}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center opacity-60 transition-opacity duration-200 hover:opacity-100"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                aria-label="Toggle new password visibility"
                            >
                                {showNewPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="mt-1.5 text-[13px] font-medium text-red-500">{errors.newPassword}</p>
                        )}
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-3" htmlFor="confirmPassword">
                            Confirm new password
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                className={`${inputBase} pr-12 sm:pr-11 ${errors.confirmPassword ? inputError : inputNormal}`}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center opacity-60 transition-opacity duration-200 hover:opacity-100"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label="Toggle confirm password visibility"
                            >
                                {showConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1.5 text-[13px] font-medium text-red-500">{errors.confirmPassword}</p>
                        )}
                    </div>
                </div>

                <div className="w-full h-px bg-[#f1f3f7]" />

                {/* ─── Action Buttons ─── */}
                <div className="flex items-center justify-end gap-3 px-8 py-6 sm:flex-col-reverse sm:px-5 sm:py-5 sm:gap-2.5">
                    <button
                        type="button"
                        className="px-6 py-2.5 border-none rounded-lg bg-transparent text-sm font-medium text-slate-500 cursor-pointer transition-all duration-200 hover:bg-slate-100 hover:text-slate-800 sm:w-full sm:text-center sm:py-3"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="px-6 py-2.5 border-none rounded-lg bg-slate-900 text-sm font-semibold text-white cursor-pointer transition-all duration-200 shadow-[0_1px_3px_rgba(15,23,42,0.2)] hover:bg-slate-800 hover:shadow-[0_2px_6px_rgba(15,23,42,0.3)] active:scale-[0.98] sm:w-full sm:text-center sm:py-3"
                        onClick={handleSave}
                    >
                        Save changes
                    </button>
                </div>
            </div>
        </div>

        </>
    );
}

/* ─── SVG Icon Components ─── */

function EyeOpenIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function EyeClosedIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        </svg>
    );
}
