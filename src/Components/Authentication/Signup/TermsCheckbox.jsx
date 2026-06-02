import React from 'react'

export default function TermsCheckbox({ agreed, onAgreeChange }) {
  return (
    <div className="flex flex-row items-center gap-2.5 cursor-pointer mb-4 mt-2">
      <input
        type="checkbox"
        id="terms"
        checked={agreed}
        onChange={(e) => onAgreeChange(e.target.checked)}
        className="w-[18px] h-[18px] rounded-md accent-[#C9A84C] shrink-0 cursor-pointer"
      />
      <label htmlFor="terms" className="text-xs text-gray-400 select-none cursor-pointer">
        I agree to the{" "}
        <a href="#" className="text-[#C9A84C] font-semibold hover:text-[#b8932e] no-underline transition-colors">Terms & Conditions</a>
        {" "}and{" "}
        <a href="#" className="text-[#C9A84C] font-semibold hover:text-[#b8932e] no-underline transition-colors">Privacy Policy</a>.
      </label>
    </div>
  );
}