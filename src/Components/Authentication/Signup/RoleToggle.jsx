import React from "react";

export default function RoleToggle({ role, onRoleChange }) {
  return (
    <div className="flex bg-[#f5f6f8] rounded-xl p-1.5 mb-4 gap-3">
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
              ? "bg-[#1a2340] text-white shadow-md"
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