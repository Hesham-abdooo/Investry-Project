import React from "react";

export default function RoleToggle({ role, onRoleChange }) {
  return (
    <div className="flex bg-[#f5f6f8] rounded-xl p-1 mb-4 gap-1">
      {[
        { key: "founder", label: "Founder" },
        { key: "investor", label: "Investor" },
      ].map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onRoleChange(key)}
          className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
            role === key
              ? "bg-white text-[#1a2340] shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          }`}
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}