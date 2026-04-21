// InvestorSideBar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBriefcase,
  FaWallet,
  FaQuestionCircle,
  FaUserEdit,
  FaTimes,
} from "react-icons/fa";

import LogoutButton from "../../Founder/FounderSideBar/LogOutButton";
import Logo from "../../Basics/Logo";

const menuItems = [
  { label: "For You", icon: FaHome, path: "/investor" },
  { label: "My Investments", icon: FaBriefcase, path: "/investor/investments" },
  { label: "Wallet", icon: FaWallet, path: "/investor/wallet" },
];

const supportItems = [
  { label: "Edit Profile", icon: FaUserEdit, path: "/investor/profile" },
  { label: "Support Center", icon: FaQuestionCircle, path: "/investor/support" },
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
    <div className="hidden md:block mb-6 px-1 pt-2">
      <Logo />
    </div>

    {/* Discover */}
    <div className="mb-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
        Discover
      </p>
      <div className="flex flex-col gap-0.5">
        {menuItems.slice(0, 1).map((item) => (
          <NavItem key={item.path} {...item} onClick={onNavigate} />
        ))}
      </div>
    </div>

    {/* Manage */}
    <div className="mb-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
        Manage
      </p>
      <div className="flex flex-col gap-0.5">
        {menuItems.slice(1).map((item) => (
          <NavItem key={item.path} {...item} onClick={onNavigate} />
        ))}
      </div>
    </div>

    {/* Support & Settings */}
    <div className="mb-6">
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

export default function InvestorSideBar({ isOpen, onClose }) {
  return (
    <>
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

        {/* Content */}
        <div className="h-[calc(100%-57px)] overflow-y-auto">
          <SidebarContent onNavigate={onClose} />
        </div>
      </div>
    </>
  );
}
