import React from "react";
import "tailwindcss";
import { FaTwitter, FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";
import { HiOutlineGlobeAlt } from "react-icons/hi";

const platformLinks = [
  { label: "Browse Campaigns", href: "#" },
  { label: "Start a Project", href: "#" },
  { label: "How it Works", href: "#How-It-Works" },
  { label: "Pricing & Fees", href: "#" },
];

const fundingLinks = [
  { label: "Reward-Based", href: "#" },
  { label: "Equity-Based", href: "#" },
  { label: "Mudarabah (Sharia)", href: "#" },
];

const companyLinks = [
  { label: "About Us", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact Support", href: "#" },
  { label: "Trust & Safety", href: "#" },
];

const socialLinks = [
  { icon: <FaTwitter />, href: "#" },
  { icon: <FaLinkedinIn />, href: "#" },
  { icon: <FaFacebookF />, href: "#" },
  { icon: <FaInstagram />, href: "#" },
];

const FooterColumn = ({ title, links }) => (
  <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left">
    <h4 className="text-white font-semibold text-sm mb-1">{title}</h4>
    {links.map((link) => (
      <span
        key={link.label}
        className="text-gray-500 font-light text-sm hover:text-gray-300 transition-colors duration-200 cursor-pointer"
      >
        {link.label}
      </span>
    ))}
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-[#0d1117] text-white">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 9l10 13L22 9 12 2z" stroke="#C9A84C" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M2 9h20M8 2l-4 7M16 2l4 7M12 22L6 9M12 22l6-13" stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-lg font-bold">
                <span className="text-white">Inves</span>
                <span className="text-[#C9A84C]">Try</span>
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting visionary founders with smart investors through transparent, secure, and Sharia-compliant crowdfunding.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white text-lg transition-colors duration-200 cursor-pointer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <FooterColumn title="Platform" links={platformLinks} />
          <FooterColumn title="Funding Models" links={fundingLinks} />
          <FooterColumn title="Company" links={companyLinks} />

        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col-reverse md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">© 2025 InvesTry Platform. All rights reserved.</p>

        <div className="flex items-center gap-6 flex-wrap justify-center">
          <span className="text-gray-400 font-light text-sm hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
          <span  className="text-gray-400 font-light text-sm hover:text-white transition-colors cursor-pointer">Terms of Service</span>

          {/* Language Switcher */}
          <div className="flex items-center gap-2 border border-gray-700 rounded-lg px-3 py-1.5">
            <HiOutlineGlobeAlt className="text-gray-400 text-base" />
            <span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">EN</span>
            <span className="text-gray-400 text-sm ">|</span>
            <span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">AR</span>

          </div>
        </div>
      </div>

    </footer>
  );
}