import React from "react";
import "./FounderSideBar.module.css"















import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaFolder, FaWallet, FaChartBar, FaQuestionCircle, FaUserCog, FaSignOutAlt, FaPlusSquare } from 'react-icons/fa'
import Logo from "../../Logo";

const menu = [
  { label: 'Overview', icon: FaHome, path: '/founder' },
  { label: 'My Projects', icon: FaFolder, path: 'projects' },
  { label: 'Wallet & Escrow', icon: FaWallet, path: 'wallet' },
  { label: 'Analytics', icon: FaChartBar, path: 'analytics' },
  { label: 'Support Center', icon: FaQuestionCircle, path: 'support' },
  { label: 'Profile & KYC', icon: FaUserCog, path: 'profile' },
]

const NavItem = ({ label, icon: Icon, path }) => {
  const active = useLocation().pathname === path
  return (
    <Link to={path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
      ${active ? 'bg-yellow-50 text-yellow-500 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}>
      <Icon size={16} />
      {label}
    </Link>
  )
}

export default function FounderSideBar() {
  return (
    <div className="flex flex-col w-full h-full px-3 py-5 gap-1">

    <Logo/>

      <Link to="/founder/create" className="flex items-center gap-2 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg mb-4">
        <FaPlusSquare size={14} /> Create Project
      </Link>

      {menu.map(item => <NavItem key={item.path} {...item} />)}

      <Link to="/LogOut" className="mt-auto flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-50 w-full">
        <FaSignOutAlt size={16} /> Log Out
      </Link>

    </div>
  )
}