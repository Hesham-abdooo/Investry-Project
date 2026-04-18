import React from 'react'

import Logo from "../../Basics/Logo";
import bgImage from "../../../assets/WhatsApp Image 2026-03-05 at 3.15.35 AM.jpg";

export default function SignUpLeftSide() {
  return (
    <div
      className="hidden lg:flex w-1/2 relative flex-col justify-between p-10"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-linear-to-b from-[#0d1526ee] via-[#1a2340cc] to-[#1a2340dd]" />

      <div className="relative z-10">
        <Logo to="/" variant="light" />
      </div>

      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-white leading-snug mb-4">
          Fund the Future. Invest
          <br />
          with Confidence.
        </h1>
        <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
          InvesTry connects visionary founders with smart investors through
          transparent, secure, and Sharia-compliant crowdfunding.
        </p>
      </div>

      <div className="relative z-10">
        <p className="text-gray-400 text-xs">© 2025 InvesTry Platform. All rights reserved.</p>
      </div>
    </div>
  );
}
