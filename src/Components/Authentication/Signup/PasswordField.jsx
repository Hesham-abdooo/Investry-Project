import React from 'react'









import { EyeIcon, LockIcon } from "./InputField";

const getPasswordStrength = (pwd) => {
  if (!pwd) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { level: 1, label: "Weak", color: "bg-red-400" };
  if (score === 2) return { level: 2, label: "Fair", color: "bg-yellow-400" };
  if (score === 3) return { level: 3, label: "Good", color: "bg-emerald-400" };
  return { level: 4, label: "Strong", color: "bg-emerald-500" };
};

export default function PasswordField({
  value,
  onChange,
  showPassword,
  onToggle,
  confirm,
  onConfirmChange,
  showConfirm,
  onConfirmToggle,
}) {
  const strength = getPasswordStrength(value);

  return (
    <>
      {/* Password */}
      <div className="mb-1.5">
        <label className="block text-xs font-medium text-[#1a2340] mb-1">
          Password
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-gray-400"><LockIcon /></span>
          <input
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={onChange}
            placeholder="At least 8 characters"
            className="w-full pl-9 pr-10 py-2 text-sm text-[#1a2340] border border-gray-200 rounded-lg outline-none focus:border-[#1a2340] transition-colors placeholder:text-gray-300 bg-white"
          />
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
        {value && (
          <div className="mt-1">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full transition-all ${i <= strength.level ? strength.color : "bg-gray-200"}`}
                />
              ))}
            </div>
            <p className={`text-xs mt-0.5 font-medium ${strength.level <= 1 ? "text-red-400" : strength.level === 2 ? "text-yellow-500" : "text-emerald-500"}`}>
              Strength: {strength.label}
            </p>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="mb-1.5">
        <label className="block text-xs font-medium text-[#1a2340] mb-1">
          Confirm Password
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-gray-400"><LockIcon /></span>
          <input
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={onConfirmChange}
            placeholder="Re-enter your password"
            className={`w-full pl-9 pr-10 py-2 text-sm text-[#1a2340] border rounded-lg outline-none focus:border-[#1a2340] transition-colors placeholder:text-gray-300 bg-white ${
              confirm && confirm !== value ? "border-red-300" : "border-gray-200"
            }`}
          />
          <button
            type="button"
            onClick={onConfirmToggle}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
          >
            <EyeIcon open={showConfirm} />
          </button>
        </div>
        {confirm && confirm !== value && (
          <p className="text-xs text-red-400 mt-0.5">Passwords do not match</p>
        )}
      </div>
    </>
  );
}
