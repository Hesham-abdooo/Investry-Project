import React from 'react';
import { TrendingUp } from 'lucide-react';
import bg from "../assets/bg.jpeg";

export default function LeftPanel() {
    return (
        <div className="bg-brand-dark text-white w-full flex flex-col justify-between p-12 relative overflow-hidden"
        style={{
backgroundImage: `url(${bg})`,
backgroundSize: "cover",
backgroundPosition: "center"
}}
>
            {/* Abstract Background - Using a radial gradient to simulate the tech glow from the screenshot */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px]"></div>
                {/* We can use CSS patterns for the grid/net, or a simple svg */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                        backgroundSize: '32px 32px'
                    }}
                />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                {/* Logo Section */}
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center text-brand-dark drop-shadow-md">
                        <TrendingUp strokeWidth={3} className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">InvesTry</span>
                </div>

                {/* Content Section */}
                <div className="max-w-md mb-20 mt-auto">
                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                        Fund the Future.<br />Invest with<br />Confidence.
                    </h1>
                    <p className="text-lg text-slate-300 leading-relaxed font-light">
                        InvesTry connects visionary founders with smart investors through transparent, secure, and Sharia-compliant crowdfunding.
                    </p>
                </div>

                {/* Footer Text */}
                <div className="text-sm text-slate-400 font-medium">
                    &copy; 2025 InvesTry Platform. All rights reserved.
                </div>
            </div>
        </div>
    );
}
