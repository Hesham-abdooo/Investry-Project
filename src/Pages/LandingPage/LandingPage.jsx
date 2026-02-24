import React from 'react'
import NavBar from '../../Components/LandingPage/NavBar'
import Footer from '../../Components/LandingPage/Footer'
import { Outlet } from 'react-router-dom'

export default function LandingPage() {
  return (
  <>
  
  <NavBar/>
<Outlet/>
  <Footer/>
  
  
  
  </>
  )
}
