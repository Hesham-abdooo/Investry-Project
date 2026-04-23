import React from 'react'
import NavBar from '../../Components/LandingPage/NavBar/NavBar'
import Footer from '../../Components/LandingPage/Footer/Footer'
import HowItWorks from '../../Components/LandingPage/HowItWorks/HIW'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      <main className="flex-1">
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}
