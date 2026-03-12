

import React from 'react'
import NavBar from '../../Components/LandingPage/NavBar/NavBar'
import Footer from '../../Components/LandingPage/Footer/Footer'
import { Outlet } from 'react-router-dom'
import HowItWorks from '../../Components/LandingPage/HowItWorks/HowItWorks'

export default function LandingPage() {
  return (
  <>
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <HowItWorks/>
      <main className="flex-1">
        
      </main>
      <Footer/>
    </div>
  
  
  </>
  )
}
  


  




