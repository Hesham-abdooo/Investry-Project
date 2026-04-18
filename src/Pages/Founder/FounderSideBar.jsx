// FounderSideBar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaFolder,
  FaWallet,
  FaChartBar,
  FaQuestionCircle,
  FaUserCog,
  FaPlusSquare,
  FaTimes,
  FaBars,
} from "react-icons/fa";

import LogoutButton from "../../Components/Founder/FounderSideBar/LogOutButton";
import Logo from "../../Components/Basics/Logo";

const menuItems = [
  { label: "Overview", icon: FaHome, path: "/founder" },
  { label: "My Projects", icon: FaFolder, path: "/founder/projects" },
  { label: "Wallet & Escrow", icon: FaWallet, path: "/founder/wallet" },
  { label: "Analytics", icon: FaChartBar, path: "/founder/analytics" },
];

const supportItems = [
  { label: "Support Center", icon: FaQuestionCircle, path: "/founder/support" },
  { label: "Profile & KYC", icon: FaUserCog, path: "/founder/profile" },
];

const NavItem = ({ label, icon: Icon, path, onClick }) => {
  const { pathname } = useLocation();
  const active = pathname === path;

  return (
    <Link
      to={path}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
      style={
        active
          ? { backgroundColor: "#FEF9EC", color: "#D4A017", fontWeight: 600 }
          : { color: "#6b7280" }
      }
    >
      <Icon size={15} style={{ color: active ? "#D4A017" : "#9ca3af" }} />
      {label}
    </Link>
  );
};

const SidebarContent = ({ onNavigate }) => (
  <div className="flex flex-col w-full h-full bg-white px-3 py-3">
    {/* Logo - Desktop فقط */}
    <div className="hidden md:block mb-2 px-1">
      <Logo />
    </div>

    {/* Create Project */}
    <Link
      to="/createProject"
      onClick={onNavigate}
      className="flex items-center justify-center gap-2 text-white text-sm py-2.5 px-3 rounded-lg mb-4 transition-all hover:opacity-90"
      style={{ backgroundColor: "#0F2044" }}
    >
      <FaPlusSquare size={14} />
      Create Project
    </Link>

    {/* Menu */}
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
        Menu
      </p>
      <div className="flex flex-col gap-0.5">
        {menuItems.map((item) => (
          <NavItem key={item.path} {...item} onClick={onNavigate} />
        ))}
      </div>
    </div>

    {/* Support & Settings */}
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
        Support & Settings
      </p>
      <div className="flex flex-col gap-0.5">
        {supportItems.map((item) => (
          <NavItem key={item.path} {...item} onClick={onNavigate} />
        ))}
      </div>
    </div>

    <div className="flex-1" />

    <div className="border-t border-gray-100 pt-3">
      <LogoutButton />
    </div>
  </div>
);

export default function FounderSideBar({ isOpen, onClose, onOpen }) {
  return (
    <>
      {/* Mobile Header */}

      {/* Desktop Sidebar */}
      <div
        className="hidden md:flex md:w-48 lg:w-56 shrink-0"
        style={{ boxShadow: "4px 0 20px rgba(0,0,0,0.08)" }}
      >
        <SidebarContent />
      </div>

      {/* Mobile Drawer */}
  
      <div
        className={`fixed top-0 left-0 h-full w-56 z-40 md:hidden transform transition-transform duration-300 ease-in-out bg-white ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ boxShadow: "4px 0 20px rgba(0,0,0,0.12)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <Logo />
          <button
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Content - المساحة المتبقية بعد الهيدر */}
        <div className="h-[calc(100%-57px)] overflow-y-auto">
          <SidebarContent onNavigate={onClose} />
        </div>
      </div>
    </>
  );
}
