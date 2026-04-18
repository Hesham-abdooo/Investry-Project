import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import FounderSideBar from "../../Components/Founder/FounderSideBar/FounderSideBar";
import { FaBars } from "react-icons/fa";

export default function Founder() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <FounderSideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto px-4 md:px-6 py-4">
        {/* Hamburger - موبايل بس */}
        <button
        
          className="md:hidden mb-4 p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars size={20} />
        </button>

        <Outlet />
      </div>
    </div>
  );
}