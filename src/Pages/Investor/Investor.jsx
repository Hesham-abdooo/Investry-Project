import React from 'react'
import { Outlet } from 'react-router-dom'
import InvestorSideBar from '../../Components/Investor/InvestorSideBar/InvestorSideBar'

export default function Investor() {
  return (
   <>
 <InvestorSideBar/>
   <Outlet/>
   
   
   </>
  )
}
