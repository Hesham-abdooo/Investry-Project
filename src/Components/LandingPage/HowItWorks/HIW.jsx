import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Lock,
  CheckCircle,
  ShieldCheck,
  FileSearch,
  Gift,
  TrendingUp,
  Moon,
  Sparkles,
  Users,
  Rocket,
  ChevronRight,
} from 'lucide-react';
import FeatContainer from '../../../assets/featContainer.png';
import './HIW.css';

/* ── Animation Variants ── */
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* ── Data ── */
const steps = [
  { num: 1, color: 'bg-[#C9A84C]', title: 'Create Account', desc: 'Sign up and complete our secure identity verification process in minutes.' },
  { num: 2, color: 'bg-[#0F2044]', title: 'Launch or Discover', desc: 'Pitch your groundbreaking idea or browse curated high-potential startups.' },
  { num: 3, color: 'bg-[#6fd3b2]', title: 'Invest Securely', desc: 'Fund projects with confidence and track your returns seamlessly.' },
];

const fundingModels = [
  { icon: Gift, title: 'Reward-based', desc: 'Back a project early and receive exclusive products, experiences, or perks in return.', img: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=220&fit=crop&q=80' },
  { icon: TrendingUp, title: 'Equity-based', desc: 'Invest directly in promising startups and own a share of their future success.', img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=220&fit=crop&q=80' },
  { icon: Moon, title: 'Mudarabah', desc: 'Participate in Sharia-compliant profit-sharing investments with vetted businesses.', img: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?w=400&h=220&fit=crop&q=80' },
];

const trustFeatures = [
  { icon: Lock, title: 'Escrow Protection', desc: 'Funds are held securely until campaign milestones are met.' },
  { icon: CheckCircle, title: 'KYC Verified', desc: 'Every founder and investor passes rigorous identity checks.' },
  { icon: ShieldCheck, title: 'AES-256 Encrypted', desc: 'Bank-level encryption protects your personal and financial data.' },
  { icon: FileSearch, title: 'Audit Trail', desc: 'Transparent tracking of all platform transactions and agreements.' },
];

function HIW() {
  return (
    <>
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="hero-section">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-20 md:py-28 lg:py-36 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="space-y-7">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white/90"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                <Rocket className="w-4 h-4" />
                Sharia-Compliant Crowdfunding Platform
              </motion.div>

              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                  style={{ fontFamily: '"Nimbus Sans", sans-serif' }}
                >
                  <span className="text-white">Fund the Future.</span>
                  <br />
                  <span className="text-[#0F2044]">Invest with Confidence.</span>
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-base sm:text-lg text-white/80 max-w-lg leading-relaxed"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                InvesTry connects visionary founders with smart investors through transparent, secure, and Sharia-compliant crowdfunding.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/signup"
                  className="group inline-flex items-center justify-center gap-2 bg-[#0F2044] text-white px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base hover:bg-[#162a4a] transition-all duration-300 shadow-lg hover:shadow-xl no-underline"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  Start a Project
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#explore"
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white/50 px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base hover:bg-white hover:text-[#0F2044] transition-all duration-300 no-underline"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  Explore Campaigns
                </a>
              </motion.div>
            </motion.div>

            {/* Right - Futuristic Network Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
              className="hidden lg:flex items-center justify-center relative"
              style={{ minHeight: 560 }}
            >
              {/* Glow Background */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.25) 0%, transparent 65%)' }}
              />

              <div className="relative w-[520px] h-[520px]">

                {/* SVG Connection Lines + Orbit Rings */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 520 520" fill="none">
                  {/* Orbit rings */}
                  <motion.circle cx="260" cy="260" r="160" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 0.5 }}
                  />
                  <motion.circle cx="260" cy="260" r="230" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" strokeDasharray="6 6"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 0.8 }}
                  />

                  {/* Connection lines from center to nodes */}
                  {[
                    { x: 420, y: 120 }, { x: 100, y: 120 }, { x: 440, y: 390 },
                    { x: 80, y: 390 }, { x: 260, y: 30 }, { x: 260, y: 490 },
                  ].map((p, i) => (
                    <motion.line key={i} x1="260" y1="260" x2={p.x} y2={p.y}
                      stroke="rgba(201,168,76,0.15)" strokeWidth="1" strokeDasharray="4 4"
                      initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }} transition={{ duration: 1, delay: 1 + i * 0.15 }}
                    />
                  ))}

                  {/* Animated pulse rings from center */}
                  {[0, 2, 4].map((delay, i) => (
                    <motion.circle key={i} cx="260" cy="260" r="50" fill="none" stroke="rgba(201,168,76,0.2)" strokeWidth="1"
                      animate={{ r: [50, 180], opacity: [0.4, 0] }}
                      transition={{ duration: 4, repeat: Infinity, delay, ease: 'easeOut' }}
                    />
                  ))}
                </svg>

                {/* Center Diamond - InvesTry Core */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      className="absolute -inset-4 rounded-full border border-[#C9A84C]/20"
                    />
                    <div className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl"
                      style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #0F2044 100%)', boxShadow: '0 0 60px rgba(201,168,76,0.4), 0 0 120px rgba(201,168,76,0.15)' }}
                    >
                      <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 9l10 13L22 9 12 2z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
                        <path d="M2 9h20M8 2l-4 7M16 2l4 7M12 22L6 9M12 22l6-13" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                {/* Orbiting Nodes */}
                {/* Founder Nodes (Gold) */}
                {[
                  { top: '3%', left: '45%', delay: 0, label: 'Founder', icon: 'rocket', dur: 5 },
                  { top: '68%', left: '82%', delay: 0.8, label: 'Startup', icon: 'zap', dur: 6 },
                  { top: '88%', left: '42%', delay: 1.5, label: 'Creator', icon: 'star', dur: 4.5 },
                ].map((node, i) => (
                  <motion.div
                    key={`f-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.2 + node.delay }}
                    animate={{ y: [-6, 6, -6] }}
                    style={{ top: node.top, left: node.left }}
                    className="absolute z-10"
                  >
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      className="bg-white rounded-xl shadow-lg p-2.5 flex items-center gap-2 border border-[#C9A84C]/20 cursor-default"
                      style={{ fontFamily: '"Inter", sans-serif' }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C9A84C, #d4b050)' }}>
                        {node.icon === 'rocket' && <Rocket className="w-4 h-4 text-white" />}
                        {node.icon === 'zap' && <Sparkles className="w-4 h-4 text-white" />}
                        {node.icon === 'star' && <Gift className="w-4 h-4 text-white" />}
                      </div>
                      <span className="text-xs font-bold text-[#0F2044] pr-1">{node.label}</span>
                    </motion.div>
                  </motion.div>
                ))}

                {/* Investor Nodes (Navy) */}
                {[
                  { top: '15%', left: '78%', delay: 0.4, label: 'Investor', icon: 'chart', dur: 5.5 },
                  { top: '15%', left: '5%', delay: 1, label: 'Backer', icon: 'shield', dur: 6.5 },
                  { top: '70%', left: '2%', delay: 1.8, label: 'Partner', icon: 'users', dur: 4 },
                ].map((node, i) => (
                  <motion.div
                    key={`i-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.4 + node.delay }}
                    animate={{ y: [5, -5, 5] }}
                    style={{ top: node.top, left: node.left }}
                    className="absolute z-10"
                  >
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      className="bg-white rounded-xl shadow-lg p-2.5 flex items-center gap-2 border border-[#0F2044]/10 cursor-default"
                      style={{ fontFamily: '"Inter", sans-serif' }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0F2044, #1a3673)' }}>
                        {node.icon === 'chart' && <TrendingUp className="w-4 h-4 text-white" />}
                        {node.icon === 'shield' && <ShieldCheck className="w-4 h-4 text-white" />}
                        {node.icon === 'users' && <Users className="w-4 h-4 text-white" />}
                      </div>
                      <span className="text-xs font-bold text-[#0F2044] pr-1">{node.label}</span>
                    </motion.div>
                  </motion.div>
                ))}

                {/* Floating Particles */}
                {[
                  { t: '25%', l: '90%', s: 3, d: 3, c: '#C9A84C' },
                  { t: '80%', l: '90%', s: 2, d: 4, c: '#6fd3b2' },
                  { t: '50%', l: '95%', s: 2.5, d: 3.5, c: '#fff' },
                  { t: '40%', l: '-2%', s: 2, d: 5, c: '#C9A84C' },
                  { t: '92%', l: '50%', s: 3, d: 4.5, c: '#0F2044' },
                  { t: '5%', l: '25%', s: 2, d: 3, c: '#fff' },
                  { t: '60%', l: '60%', s: 1.5, d: 6, c: '#C9A84C' },
                  { t: '35%', l: '35%', s: 1.5, d: 5, c: '#6fd3b2' },
                ].map((p, i) => (
                  <motion.div
                    key={`p-${i}`}
                    animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: p.d, repeat: Infinity, delay: i * 0.4 }}
                    className="absolute rounded-full"
                    style={{ top: p.t, left: p.l, width: p.s, height: p.s, backgroundColor: p.c, opacity: 0.5 }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="How-It-Works" className="w-full py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="max-w-6xl mx-auto section-container px-6 sm:px-10 py-12 sm:py-16"
        >
          <div className="flex flex-col items-center text-center mb-14 sm:mb-20">
            <span className="pill-badge mb-4">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#C9A84C] mb-3" style={{ fontFamily: '"Nimbus Sans", sans-serif' }}>
              Simple Steps to Get Started
            </h2>
            <p className="max-w-2xl text-gray-500 text-base sm:text-lg" style={{ fontFamily: '"Inter", sans-serif' }}>
              Join thousands of founders and investors building the future together in three simple steps.
            </p>
          </div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5 relative">

            {/* Connector arrows - desktop only */}
            <div className="hidden md:block absolute top-16 left-[29%] w-[14%] h-0.5">
              <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 1 }}
                className="w-full h-full origin-left" style={{ background: 'linear-gradient(90deg, #C9A84C, #0F2044)' }} />
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.6 }}
                className="absolute -right-1.5 -top-1 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-[#0F2044]" />
            </div>
            <div className="hidden md:block absolute top-16 right-[29%] w-[14%] h-0.5">
              <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 1.3 }}
                className="w-full h-full origin-left" style={{ background: 'linear-gradient(90deg, #0F2044, #6fd3b2)' }} />
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.9 }}
                className="absolute -right-1.5 -top-1 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-[#6fd3b2]" />
            </div>

            {/* Step Cards */}
            {[
              { num: 1, color: '#C9A84C', gradient: 'linear-gradient(135deg, #C9A84C, #d4b050)', icon: <Users className="w-6 h-6 text-white" />, title: 'Create Account', desc: 'Sign up and complete our secure identity verification process in minutes.' },
              { num: 2, color: '#0F2044', gradient: 'linear-gradient(135deg, #0F2044, #1a3673)', icon: <Rocket className="w-6 h-6 text-white" />, title: 'Launch or Discover', desc: 'Pitch your groundbreaking idea or browse curated high-potential startups.' },
              { num: 3, color: '#6fd3b2', gradient: 'linear-gradient(135deg, #4ec9a0, #6fd3b2)', icon: <ShieldCheck className="w-6 h-6 text-white" />, title: 'Invest Securely', desc: 'Fund projects with confidence and track your returns seamlessly.' },
            ].map((s, i) => (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <div className="relative bg-white rounded-2xl border border-gray-100 p-7 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                  {/* Background decorative gradient */}
                  <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500" style={{ background: s.gradient }} />

                  {/* Step number badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.6 + i * 0.2, type: 'spring', stiffness: 200 }}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
                    style={{ borderColor: s.color, color: s.color, fontFamily: '"Inter", sans-serif' }}
                  >
                    {s.num}
                  </motion.div>

                  {/* Icon container */}
                  <motion.div
                    initial={{ rotate: -10, scale: 0.8 }}
                    whileInView={{ rotate: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.2 }}
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-lg"
                    style={{ background: s.gradient }}
                  >
                    {s.icon}
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: '"Nimbus Sans", sans-serif', color: s.color }}>{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: '"Inter", sans-serif' }}>{s.desc}</p>

                  {/* Bottom accent line */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '40%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 + i * 0.2 }}
                    className="h-0.5 rounded-full mt-5"
                    style={{ background: s.gradient }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ FUNDING MODELS ═══════════════════ */}
      <section id="funding-models" className="w-full py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="max-w-6xl mx-auto section-container px-6 sm:px-10 py-12 sm:py-16"
        >
          <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
            <span className="pill-badge mb-4">Funding Models</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#C9A84C] mb-3" style={{ fontFamily: '"Nimbus Sans", sans-serif' }}>
              Choose Your Investment Path
            </h2>
            <p className="max-w-2xl text-gray-500 text-base sm:text-lg" style={{ fontFamily: '"Inter", sans-serif' }}>
              Choose the investment path that aligns with your goals and values.
            </p>
          </div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fundingModels.map((model, i) => {
              const Icon = model.icon;
              return (
                <motion.div
                  key={i}
                  variants={item}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="card-circle" />

                  <div className="h-48 overflow-hidden">
                    <img
                      src={model.img}
                      alt={model.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="relative p-6 space-y-3">
                    <div className="w-11 h-11 bg-[#C9A84C]/10 rounded-xl flex items-center justify-center -mt-10 relative z-10 border-2 border-white shadow-sm">
                      <Icon className="w-5 h-5 text-[#C9A84C]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#C9A84C]" style={{ fontFamily: '"Nimbus Sans", sans-serif' }}>{model.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: '"Inter", sans-serif' }}>{model.desc}</p>
                    <div className="flex items-center justify-between pt-2">
                      <a href="#" className="text-sm font-medium text-[#0F2044] hover:text-[#C9A84C] transition-colors no-underline" style={{ fontFamily: '"Inter", sans-serif' }}>
                        Learn more
                      </a>
                      <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
                        <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ FEATURED CAMPAIGNS ═══════════════════ */}
      <section id="explore" className="w-full py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="max-w-6xl mx-auto section-container-muted px-6 sm:px-10 py-12 sm:py-16"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <span className="pill-badge mb-4 inline-flex">Featured</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#C9A84C] mb-3" style={{ fontFamily: '"Nimbus Sans", sans-serif' }}>
                Featured Campaigns
              </h2>
              <p className="text-gray-500 text-base sm:text-lg max-w-lg" style={{ fontFamily: '"Inter", sans-serif' }}>
                Discover high-potential projects actively raising funds.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 border-2 border-[#C9A84C] text-[#C9A84C] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#C9A84C] hover:text-white transition-all duration-300 no-underline whitespace-nowrap"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                View all Campaigns
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center"
          >
            <img
              src={FeatContainer}
              alt="Featured Campaigns Preview"
              className="w-full rounded-2xl shadow-lg"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ TRUST & SECURITY ═══════════════════ */}
      <section id="trust" className="w-full py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="max-w-6xl mx-auto section-container px-6 sm:px-10 py-12 sm:py-16"
        >
          <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
            <span className="pill-badge mb-4">Trust & Security</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#C9A84C] mb-3" style={{ fontFamily: '"Nimbus Sans", sans-serif' }}>
              Your Investments are Protected
            </h2>
            <p className="max-w-2xl text-gray-500 text-base sm:text-lg" style={{ fontFamily: '"Inter", sans-serif' }}>
              Your funds are always protected with enterprise-grade security and transparency.
            </p>
          </div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={i}
                  variants={item}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="group flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-[#f8fafc] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#C9A84C]/10 transition-colors duration-300">
                    <Icon className="w-7 h-7 text-[#C9A84C]" />
                  </div>
                  <h3 className="text-base font-bold text-[#C9A84C] mb-2" style={{ fontFamily: '"Nimbus Sans", sans-serif' }}>{feat.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: '"Inter", sans-serif' }}>{feat.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA SECTION ═══════════════════ */}
      <section className="cta-section py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5" style={{ fontFamily: '"Nimbus Sans", sans-serif' }}>
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-white/75 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ fontFamily: '"Inter", sans-serif' }}>
            Whether you are a visionary founder or a smart investor, InvesTry is the platform built for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/signup"
                className="group inline-flex items-center justify-center gap-2 bg-[#C9A84C] text-[#0F2044] px-8 py-4 rounded-xl font-bold text-base hover:bg-[#d4b050] transition-all duration-300 shadow-lg no-underline"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                Get Started Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <a
                href="#explore"
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white/40 px-8 py-4 rounded-xl font-bold text-base hover:bg-white/10 transition-all duration-300 no-underline"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                Explore Campaigns
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}

export default HIW;