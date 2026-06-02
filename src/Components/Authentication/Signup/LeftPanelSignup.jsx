import React from 'react';
import { TrendingUp } from 'lucide-react';
import bg from "../../../assets/542b4cc3fbe8ef31c5ecaaa4b9a031f3ae20278f.jpg";

export default function LeftPanelSignup() {
  return (
    <div
      className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#C9A84C] rounded-xl flex items-center justify-center text-[#1a2340] drop-shadow-md">
            <TrendingUp strokeWidth={3} className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">InvesTry</span>
        </div>

        {/* Content */}
        <div className="max-w-md mb-20 mt-auto">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6 text-white">
            Fund the Future.<br />Invest with<br />Confidence.
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed font-light">
            InvesTry connects visionary founders with smart investors through transparent, secure, and Sharia-compliant crowdfunding.
          </p>
        </div>

        {/* Footer */}
        <div className="text-sm text-slate-400 font-medium">
          &copy; 2025 InvesTry Platform. All rights reserved.
        </div>
      </div>
    </div>
  );
}