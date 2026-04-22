import React from "react";

export default function RoleToggle({ role, onRoleChange }) {
  return (
    <div className="flex gap-3 mb-3">
      {[
        { key: "founder", label: "Founder", icon: "🌱" },
        { key: "investor", label: "Investor", icon: "💼" },
      ].map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => onRoleChange(role === key ? "" : key)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-2xl text-sm font-semibold transition-all ${
            role === key
              ? "bg-white text-[#1a2340] shadow-sm"
              : "bg-gray-100 text-gray-400 hover:text-gray-600"
          }`}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}