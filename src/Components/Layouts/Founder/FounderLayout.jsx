import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import FounderSideBar from "../../../Pages/Founder/FounderSideBar";
import Logo from "../../Basics/Logo";

export default function FounderLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shrink-0">
        <Logo />
        <FaBars
          size={20}
          className="text-gray-500 cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — ثابت مش بيتحرك */}
        <div className="hidden md:flex shrink-0 h-full overflow-y-auto">
          <FounderSideBar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onOpen={() => setSidebarOpen(true)}
          />
        </div>

        {/* Mobile sidebar drawer */}
        <div className="md:hidden">
          <FounderSideBar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onOpen={() => setSidebarOpen(true)}
          />
        </div>

        {/* Content — بيعمل scroll لوحده */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
