import React, { useState } from "react";

export default function TopBar() {
  const [lang, setLang] = useState("EN");

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <button
        onClick={() => setLang("EN")}
        className={`font-medium transition-colors ${lang === "EN" ? "text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
      >
        EN
      </button>
      <span className="text-gray-300">|</span>
      <button
        onClick={() => setLang("AR")}
        className={`font-medium transition-colors ${lang === "AR" ? "text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
      >
        AR
      </button>
    </div>
  );
}