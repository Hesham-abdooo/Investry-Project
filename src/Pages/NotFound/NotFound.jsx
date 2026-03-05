






import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col items-center justify-center px-6">

      
      <Link to="/" className="flex items-center gap-2 mb-16">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 9l10 13L22 9 12 2z" stroke="#C9A84C" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M2 9h20M8 2l-4 7M16 2l4 7M12 22L6 9M12 22l6-13" stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-xl font-bold">
          <span className="text-[#1a2340]">Inves</span>
          <span className="text-[#C9A84C]">Try</span>
        </span>
      </Link>

      <div className="text-center">
        <h1 className="text-[120px] md:text-[180px] font-bold leading-none text-[#1a2340] opacity-[0.07] select-none">
          404
        </h1>

        <div className="-mt-8 md:-mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a2340] mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-sm mx-auto leading-relaxed mb-8">
            Looks like this page doesn't exist or has been moved. Let's get you back on track.
          </p>

          <Link
            to="/"
            className="inline-block bg-[#1a2340] hover:bg-[#243060] text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
      <div className="mt-16 flex items-center gap-3">
        <div className="w-8 h-px bg-[#C9A84C]" />
        <span className="text-xs text-gray-400">InvesTry Platform</span>
        <div className="w-8 h-px bg-[#C9A84C]" />
      </div>

    </div>
  );
}