import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome, FaFolder, FaUsers, FaEnvelope,
  FaLock, FaUserShield, FaTimes,
} from "react-icons/fa";
import { FiShield } from "react-icons/fi";
import LogoutButton from "../../Components/Founder/FounderSideBar/LogOutButton";
import Logo from "../../Components/Basics/Logo";

const menuItems = [
  { label: "Dashboard", icon: FaHome, path: "/admin" },
  { label: "Projects", icon: FaFolder, path: "/admin/projects" },
  { label: "Users", icon: FaUsers, path: "/admin/users" },
  { label: "Support Tickets", icon: FaEnvelope, path: "/admin/tickets" },
  { label: "Escrow", icon: FaLock, path: "/admin/escrow" },
];

const settingsItems = [
  { label: "Admin Accounts", icon: FaUserShield, path: "/admin/accounts" },
];

/* ── Nav Item ── */
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

/* ── Sidebar Content ── */
const SidebarContent = ({ onNavigate }) => (
  <div className="flex flex-col w-full h-full bg-white px-3 py-3">
    {/* Logo - Desktop only */}
    <div className="hidden md:block mb-2 px-1">
      <Logo />
    </div>

    {/* Admin Badge */}
    <div
      className="flex items-center justify-center gap-2 text-white text-sm py-2.5 px-3 rounded-lg mb-4"
      style={{ background: "linear-gradient(135deg, #0F2044, #1a3260)" }}
    >
      <FiShield size={14} />
      <span style={{ fontWeight: 700, letterSpacing: 0.5 }}>Admin Panel</span>
    </div>

    {/* Menu */}
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
        Management
      </p>
      <div className="flex flex-col gap-0.5">
        {menuItems.map((item) => (
          <NavItem key={item.path} {...item} onClick={onNavigate} />
        ))}
      </div>
    </div>

    {/* Settings */}
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
        Settings
      </p>
      <div className="flex flex-col gap-0.5">
        {settingsItems.map((item) => (
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

/* ── Main Export ── */
export default function AdminSidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="hidden md:flex md:w-48 lg:w-56 shrink-0"
        style={{ boxShadow: "4px 0 20px rgba(0,0,0,0.08)" }}
      >
        <SidebarContent />
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onClose}
        />
      )}

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
