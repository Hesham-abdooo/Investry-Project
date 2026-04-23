import React from 'react'

export default function TermsCheckbox({ agreed, onAgreeChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer mb-4 mt-2 group">
      <div className="relative shrink-0">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => onAgreeChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
            agreed
              ? 'bg-[#C9A84C] border-[#C9A84C]'
              : 'border-gray-300 bg-white group-hover:border-gray-400'
          }`}
        >
          {agreed && (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap select-none">
        I agree to the{" "}
        <a href="#" className="text-[#C9A84C] font-semibold hover:text-[#b8932e] no-underline transition-colors">Terms & Conditions</a>
        {" "}and{" "}
        <a href="#" className="text-[#C9A84C] font-semibold hover:text-[#b8932e] no-underline transition-colors">Privacy Policy</a>.
      </span>
    </label>
  );
}