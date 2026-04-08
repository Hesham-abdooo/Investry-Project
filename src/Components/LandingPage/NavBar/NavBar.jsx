import React from "react";
import "./NavBar.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import TopBar from "../../Basics/TopBar";
import Logo from "../../Basics/Logo";

const DiamondIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L2 9l10 13L22 9 12 2z"
      stroke="#C9A84C"
      strokeWidth="1.8"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M2 9h20M8 2l-4 7M16 2l4 7M12 22L6 9M12 22l6-13"
      stroke="#C9A84C"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);



const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 6h16M4 12h16M4 18h16"
      stroke="#1a2340"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="#1a2340"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const navLinks = [
  { label: "Explore", href: "#explore" },
  { label: "How it Works", href: "#How-It-Works" },
  { label: "Funding Models", href: "#funding-models" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);


  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
       <Logo/>



                                                    {/* ! Desktop */}

          {/* * Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-[#1a2340] transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C9A84C] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* * Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* * Language Switcher */}
    <TopBar/>





            {/* *  Login */}
            <Link
              to="/login"
              className="text-sm font-semibold text-[#C9A84C]! hover:text-[#b8932e] transition-colors duration-200"
            >
              Login
            </Link>




            {/* * Sign Up */}
            <Link
              to="/signup"
              className="text-sm font-semibold text-white bg-[#1a2340] hover:bg-[#243060] px-5 py-2.5 rounded-lg transition-colors duration-200 shadow-sm"
            >
              Sign Up
            </Link>
          </div>













                                          {/* ! Mobile */}



          {/* * Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* * Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          {/* * Mobile Nav Links */}
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-[#1a2340] py-1.5 border-b border-gray-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}









          {/* * Mobile Language Switcher */}
      <TopBar/>








          {/* *  Mobile Buttons sign */}
          <div className="flex gap-3 pt-1">
            <Link
              to="/login"
              className="flex-1 text-center text-sm font-semibold text-[#C9A84C] border border-[#C9A84C] py-2.5 rounded-lg hover:bg-[#fdf8ee] transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="flex-1 text-center text-sm font-semibold text-white bg-[#1a2340] py-2.5 rounded-lg hover:bg-[#243060] transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
