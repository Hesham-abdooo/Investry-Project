import React from 'react'
import { Outlet } from 'react-router-dom'
import InvestorSideBar from '../../Components/Investor/InvestorSideBar/InvestorSideBar'

export default function Investor() {
  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 bg-white border-r shadow-sm">
        <InvestorSideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <Outlet />
      </div>

    </div>
  )
}