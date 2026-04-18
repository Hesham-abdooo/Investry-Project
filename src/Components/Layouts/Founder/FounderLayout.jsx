import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import { FaBars } from "react-icons/fa";

import FounderSideBar from "../../../Pages/Founder/FounderSideBar";
import Logo from "../../Basics/Logo";

export default function FounderLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        {/* Logo على الشمال */}
        <Logo />

        {/* Hamburger على اليمين */}
        <FaBars
          size={20}
          className="text-gray-500 cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        />
      </div>

      <div className="flex flex-1">
        <FounderSideBar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpen={() => setSidebarOpen(true)}
        />
        <div className="flex-1 px-4 md:px-6 py-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
