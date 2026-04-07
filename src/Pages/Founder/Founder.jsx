import React from "react";
import { Outlet } from "react-router-dom";
import FounderSideBar from "../../Components/Founder/FounderSideBar/FounderSideBar";
import FounderRightPanel from "../../Components/Founder/FounderRightPanel/FounderRightPanel";
export default function Founder() {
  return (
    <>
    
        <div className="min-h-screen flex bg-gray-50">

      {/* Left Sidebar - hidden on mobile */}
      <div className="hidden md:flex md:w-64 shrink-0 bg-white border-r shadow-sm">
        <FounderSideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <Outlet />
      </div>

      {/* Right Panel - hidden on mobile & tablet, visible on lg+ */}
      <div className="hidden lg:flex lg:w-72 shrink-0 bg-white border-l shadow-sm">
        <FounderRightPanel />
      </div>

    </div>
    </>
 
  );
}
