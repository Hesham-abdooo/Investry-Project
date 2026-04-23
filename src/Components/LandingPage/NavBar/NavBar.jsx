import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import Logo from "../../Basics/Logo";
import TopBar from "../../Basics/TopBar";

const navLinks = [
  { label: "Explore", href: "#explore" },
  { label: "How it Works", href: "#How-It-Works" },
  { label: "Funding Models", href: "#funding-models" },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const slideItem = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`w-full sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-100"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
              <Logo to="/" />
            </motion.div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-[#1a2340] transition-colors duration-200 relative group no-underline"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C9A84C] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* Desktop Right Side */}
            <div className="hidden md:flex items-center gap-4">
              <TopBar />
              <Link
                to="/login"
                className="text-sm font-semibold text-[#C9A84C] hover:text-[#b8932e] transition-colors duration-200 no-underline"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold text-white bg-[#1a2340] hover:bg-[#243060] px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md no-underline"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6 text-[#1a2340]" /> : <Menu className="w-6 h-6 text-[#1a2340]" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-white md:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              {/* Header */}
              <div className="flex items-center justify-between h-16">
                <Logo to="/" />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-[#1a2340]" />
                </button>
              </div>

              {/* Links */}
              <motion.nav
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-2 pt-6 pb-8"
              >
                {navLinks.map((link, i) => (
                  <motion.div key={i} variants={slideItem}>
                    <a
                      href={link.href}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-[#1a2340] hover:bg-gray-50 transition-colors no-underline"
                      style={{ fontFamily: '"Inter", sans-serif' }}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </a>
                  </motion.div>
                ))}

                {/* Language Switcher */}
                <motion.div variants={slideItem} className="px-4 py-3">
                  <TopBar />
                </motion.div>

                {/* Buttons */}
                <motion.div variants={slideItem} className="flex gap-3 pt-4 px-1">
                  <Link
                    to="/login"
                    className="flex-1 text-center text-sm font-semibold text-[#C9A84C] border border-[#C9A84C] py-3 rounded-xl hover:bg-[#fdf8ee] transition-colors no-underline"
                    style={{ fontFamily: '"Inter", sans-serif' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="flex-1 text-center text-sm font-semibold text-white bg-[#1a2340] py-3 rounded-xl hover:bg-[#243060] transition-colors no-underline"
                    style={{ fontFamily: '"Inter", sans-serif' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
