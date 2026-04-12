import React from 'react'

export default function TermsCheckbox({ agreed, onAgreeChange }) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer mb-3 mt-1">
      <input
        type="checkbox"
        checked={agreed}
        onChange={(e) => onAgreeChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 accent-[#1a2340] rounded shrink-0"
      />
      <span className="text-xs text-gray-400 leading-relaxed">
        I agree to the{" "}
        <a href="#" className="text-[#1a2340] font-semibold hover:underline">
          Terms & Conditions
        </a>{" "}
        and{" "}
        <a href="#" className="text-[#1a2340] font-semibold hover:underline">
          Privacy Policy
        </a>
        .
      </span>
    </label>
  );
}