import React from 'react';
import "./NavBar.css";
import Logo from "../../../assets/SVG.png";


function NavBar() {
  return (
    <header className='header'>
      <a href="/" className='logo'>
        <img src={Logo} alt="InvesTry" className='logo-icon' />
        Inves<span>Try</span>
      </a>

      <nav className='nav-links'>
          <li><a href="/">Explore</a></li>
          <li><a href="/">How it works</a></li>
          <li><a href="/">Funding models</a></li> 
      </nav>
      <div className='rest'>
      <div className='lang'>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span><a href="/en"> EN </a></span>
        <span> | </span>
        <span><a href="/ar"> AR </a></span>
      </div >
        <button className='login-btn'>Login</button>
        <button className='signup-btn'>Sign Up</button>
      </div>
    </header>
  );
}

export default NavBar;