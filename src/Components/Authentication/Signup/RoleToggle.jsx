import React from "react";

export default function RoleToggle({ role, onRoleChange }) {
  return (
    <div className="flex bg-gray-100 rounded-xl p-1 mb-3 gap-1">
      {[
        { key: "founder", label: "Founder", icon: "🌱" },
        { key: "investor", label: "Investor", icon: "💼" },
      ].map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => onRoleChange(key)}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            role === key
              ? "bg-white text-[#1a2340] shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <span>{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
