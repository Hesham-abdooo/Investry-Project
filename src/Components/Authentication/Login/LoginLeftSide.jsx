import React from 'react'

import Logo from "../../Basics/Logo";
import bgImage from "../../../assets/WhatsApp Image 2026-03-05 at 3.15.35 AM.jpg";

export default function LoginLeftSide() {
  return (
    <div
      className="hidden lg:flex w-1/2 relative flex-col justify-between p-12"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-linear-to-b from-[#1a2340cc] via-[#1a2340aa] to-[#C9A84Ccc]" />

      <div className="relative z-10 flex items-center gap-2">
        <div className="rounded-lg p-2">
          <Logo to="/" variant="light" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        <div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-4">
            Invest with
            <br />
            <span className="text-[#C9A84C]">Confidence.</span>
          </h1>
          <p className="text-gray-200 text-sm leading-relaxed max-w-sm">
            Join thousands of investors and visionary founders building the
            next generation of successful enterprises through Sharia-compliant
            crowdfunding.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 max-w-sm">
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-gray-400 text-lg">
                ☆
              </span>
            ))}
          </div>
          <p className="text-white text-sm leading-relaxed">
            "InvesTry made it incredibly easy to find promising startups and
            invest securely. The Mudarabah options align perfectly with my
            values and investment goals."
          </p>
        </div>
      </div>

      <div />
    </div>
  );
}
