import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const platformLinks = [
  { label: "Browse Campaigns", href: "#explore" },
  { label: "Start a Project", href: "/signup" },
  { label: "How it Works", href: "#How-It-Works" },
];

const fundingLinks = [
  { label: "Reward-Based", href: "#funding-models" },
  { label: "Equity-Based", href: "#funding-models" },
  { label: "Mudarabah (Sharia)", href: "#funding-models" },
];

const companyLinks = [
  { label: "About Us", href: "#" },
  { label: "Contact Support", href: "#" },
  { label: "Trust & Safety", href: "#trust" },
];

const XIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);
const LinkedinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const FacebookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const socialLinks = [
  { icon: XIcon, label: "X", href: "#" },
  { icon: LinkedinIcon, label: "LinkedIn", href: "#" },
  { icon: FacebookIcon, label: "Facebook", href: "#" },
  { icon: InstagramIcon, label: "Instagram", href: "#" },
];

function FooterColumn({ title, links }) {
  return (
    <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left">
      <h4 className="text-white font-semibold text-sm mb-1" style={{ fontFamily: '"Inter", sans-serif' }}>{title}</h4>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="text-gray-500 text-sm hover:text-gray-300 transition-colors duration-200 cursor-pointer no-underline"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#0d1117] text-white">
      {/* Main Footer */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="max-w-7xl mx-auto px-6 sm:px-8 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 9l10 13L22 9 12 2z" stroke="#C9A84C" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M2 9h20M8 2l-4 7M16 2l4 7M12 22L6 9M12 22l6-13" stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-lg font-bold" style={{ fontFamily: '"Inter", sans-serif' }}>
                <span className="text-white">Inves</span>
                <span className="text-[#C9A84C]">Try</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: '"Inter", sans-serif' }}>
              Connecting visionary founders with smart investors through transparent, secure, and Sharia-compliant crowdfunding.
            </p>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex items-center gap-3 mt-2">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={i}
                    variants={item}
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={social.href}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-[#C9A84C]/40 transition-all duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </motion.div>
          </div>

          {/* Links Columns */}
          <FooterColumn title="Platform" links={platformLinks} />
          <FooterColumn title="Funding Models" links={fundingLinks} />
          <FooterColumn title="Company" links={companyLinks} />
        </div>
      </motion.div>

      {/* Divider */}
      <div className="border-t border-gray-800" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-5 flex flex-col-reverse md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm" style={{ fontFamily: '"Inter", sans-serif' }}>
          2025 InvesTry Platform. All rights reserved.
        </p>

        <div className="flex items-center gap-6 flex-wrap justify-center">
          <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer no-underline" style={{ fontFamily: '"Inter", sans-serif' }}>
            Privacy Policy
          </a>
          <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer no-underline" style={{ fontFamily: '"Inter", sans-serif' }}>
            Terms of Service
          </a>
          <div className="flex items-center gap-2 border border-gray-700 rounded-lg px-3 py-1.5">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer" style={{ fontFamily: '"Inter", sans-serif' }}>EN</span>
            <span className="text-gray-600 text-sm">|</span>
            <span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer" style={{ fontFamily: '"Inter", sans-serif' }}>AR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}