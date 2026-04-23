import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaFileAlt,
  FaBullseye,
  FaHandHoldingUsd,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaGift,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaDownload,
  FaChartPie,
} from "react-icons/fa";
import { FiCheck, FiAlertCircle, FiX, FiLoader } from "react-icons/fi";
import { getProjectById, investInProject } from "./projectService";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [investAmount, setInvestAmount] = useState("");
  const [investing, setInvesting] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  const showToast = (type, message, action) => {
    setToast({ type, message, action });
    setTimeout(() => setToast(null), 5000);
  };

  const handleInvest = ({ amount, rewardTierId, tierName, shareInfo }) => {
    setConfirmModal({
      amount, tierName, shareInfo,
      fundingType: project.fundingType,
      projectTitle: project.title,
      onConfirm: async () => {
        setConfirmModal(null);
        setInvesting(true);
        try {
          await investInProject({ projectId: project.id, amount: Number(amount), rewardTierId });
          showToast("success", `Successfully invested EGP ${Number(amount).toLocaleString()}!`);
          setInvestAmount("");
          const updated = await getProjectById(id);
          if (updated) setProject(updated);
        } catch (err) {
          const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "";
          const status = err.response?.status;
          if (status === 401) {
            showToast("error", "Please log in to invest.", { label: "Log In", onClick: () => navigate("/login") });
          } else if (msg.toLowerCase().includes("balance") || msg.toLowerCase().includes("insufficient")) {
            showToast("error", "Insufficient wallet balance.", { label: "Top Up Wallet", onClick: () => navigate("/investor/wallet") });
          } else if (msg.toLowerCase().includes("already")) {
            showToast("warning", msg || "You have already invested in this tier.");
          } else {
            showToast("error", msg || "Something went wrong. Please try again.");
          }
        } finally {
          setInvesting(false);
        }
      },
    });
  };

  useEffect(() => {
    getProjectById(id)
      .then(setProject)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!loading && project && window.location.hash === "#invest") {
      setTimeout(() => {
        document.getElementById("invest")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [loading, project]);

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            <div className="lg:col-span-3">
              <div className="rounded-xl bg-gray-200 h-72" />
            </div>
            <div className="lg:col-span-2">
              <div className="rounded-xl bg-gray-200 h-72" />
            </div>
          </div>
          <div className="bg-gray-200 rounded-xl h-40 mb-8" />
          <div className="bg-gray-200 rounded-xl h-24" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-bold mb-2" style={{ color: "#0F2044" }}>
          Project not found
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          The project you're looking for doesn't exist.
        </p>
        <Link
          to="/investor"
          className="text-sm font-semibold px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: "#0F2044" }}
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  const images = project.images || [project.image];
  const percentage = Math.min(
    Math.round((project.raised / project.target) * 100),
    100
  );

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* ── Back Button ── */}
      <Link
        to="/investor"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
      >
        <FaArrowLeft size={12} />
        Back to Projects
      </Link>

      {/* ══════════════════════════════════════════════ */}
      {/* ── HERO: Image + Info Side by Side ──         */}
      {/* ══════════════════════════════════════════════ */}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* ── Left: Image Gallery (3/5) ── */}
        <div className="lg:col-span-3">
          {/* Main Image */}
          <div className="rounded-xl overflow-hidden mb-3 bg-gray-100">
            <img
              src={images[activeImage]}
              alt={project.title}
              className="w-full h-64 sm:h-72 md:h-80 object-cover transition-all duration-500"
            />
          </div>

          {/* Thumbnails + Docs */}
          <div className="flex flex-wrap items-center gap-2.5">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className="rounded-lg overflow-hidden transition-all duration-200 cursor-pointer"
                style={{
                  width: 60,
                  height: 44,
                  opacity: activeImage === i ? 1 : 0.5,
                  outline:
                    activeImage === i
                      ? "2px solid #D4A017"
                      : "2px solid transparent",
                  outlineOffset: 2,
                }}
              >
                <img
                  src={img}
                  alt={`${project.title} ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}

            {project.documents?.length > 0 && (
              <div className="w-px h-9 bg-gray-200 mx-1" />
            )}

            {project.documents?.map((doc, i) => (
              <a
                key={i}
                href="#"
                download
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Downloading "${doc}" — will connect to API`);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <FaDownload size={11} className="text-gray-400 group-hover:text-[#D4A017] transition-colors" />
                <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-700 transition-colors">
                  {doc}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* ── Right: Funding Card (2/5) ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-50">
            {/* Funding Goal */}
            <div className="text-center mb-4 pb-4 border-b border-gray-100">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
                Funding Goal
              </p>
              <p className="text-2xl font-bold" style={{ color: "#D4A017" }}>
                EGP {project.target?.toLocaleString("en-US")}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg p-3" style={{ backgroundColor: "#FAFBFC" }}>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
                  Min. Contribution
                </p>
                <p className="text-sm font-bold" style={{ color: "#0F2044" }}>
                  EGP {project.minContribution?.toLocaleString("en-US")}
                </p>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "#FAFBFC" }}>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
                  Duration
                </p>
                <p className="text-sm font-bold" style={{ color: "#0F2044" }}>
                  {project.duration}
                </p>
              </div>
            </div>

            {/* Location */}
            {project.location && (
              <div className="flex items-center gap-2 mb-3">
                <FaMapMarkerAlt size={12} className="text-gray-400 shrink-0" />
                <span className="text-xs text-gray-500">{project.location}</span>
              </div>
            )}

            {/* Video Link */}
            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-medium transition-colors hover:opacity-80 mb-3"
                style={{ color: "#D4A017" }}
              >
                <FaExternalLinkAlt size={10} />
                Watch Project Video
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/* ── PROJECT INFO ──                            */}
      {/* ══════════════════════════════════════════════ */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-50 p-5 md:p-6 mb-8">
        {/* Category + Title */}
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ backgroundColor: "#FEF9EC", color: "#D4A017" }}
          >
            {project.category}
          </span>
        </div>

        <h1
          className="text-xl md:text-2xl font-bold mb-4 leading-snug"
          style={{ color: "#0F2044" }}
        >
          {project.title}
        </h1>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-4" />

        {/* Description */}
        <p className="text-[14px] text-gray-600 leading-7 mb-5">
          {project.description}
        </p>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-4" />

        {/* Funding Type */}
        <div className="flex items-center gap-3">
          <div
            className="rounded-lg shrink-0"
            style={{ backgroundColor: "#FEF9EC", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <FaGift size={13} style={{ color: "#D4A017" }} />
          </div>
          <span
            className="text-[12px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full"
            style={
              project.fundingType === "Equity"
                ? { backgroundColor: "#0F2044", color: "#fff" }
                : { backgroundColor: "#FEF9EC", color: "#D4A017" }
            }
          >
            {project.fundingType}
          </span>
        </div>
        <p className="text-[13px] text-gray-500 leading-6 mt-2 ml-12">
              {project.fundingType === "Reward"
                ? "This project follows a Reward-Based funding model. You can support it by choosing from the available reward tiers below. Each tier has a fixed contribution amount, a specific reward, and a limited quantity set by the founder. Once a tier is fully claimed, it becomes sold out."
                : project.fundingType === "Equity"
                  ? "This project follows an Equity-Based funding model. By investing, you receive ownership shares in the company proportional to your contribution. Your returns are tied to the company's growth, valuation, and future profitability."
                  : "This project follows a Mudarabah (profit-sharing) funding model based on Islamic finance principles. As an investor, you provide the capital while the founder manages the project. Profits are distributed between you and the founder based on a pre-agreed ratio."}
            </p>
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/* ── CAMPAIGN PROGRESS (Full Width) ──          */}
      {/* ══════════════════════════════════════════════ */}

      <div className="rounded-xl p-5 mb-10" style={{ backgroundColor: "#F8F9FB" }}>
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Raised</p>
            <p className="text-lg font-bold" style={{ color: "#D4A017" }}>
              EGP {project.raised?.toLocaleString("en-US")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-0.5">Target</p>
            <p className="text-lg font-bold" style={{ color: "#0F2044" }}>
              EGP {project.target?.toLocaleString("en-US")}
            </p>
          </div>
        </div>

        <div className="w-full h-3 rounded-full bg-gray-200 mb-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: percentage >= 80 ? "#059669" : "#D4A017",
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span
            className="text-sm font-semibold"
            style={{ color: "#0F2044" }}
          >
            {percentage}% Funded
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <FaClock size={10} />
              {project.daysLeft} days left
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <FaUsers size={11} />
              {project.backers} backers
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/* ── REWARD TIERS (Reward-Based only) ──         */}
      {/* ══════════════════════════════════════════════ */}

      {project.fundingType === "Reward" &&
        project.rewardTiers?.length > 0 && (
          <div id="invest" className="mb-10">
            <h2
              className="text-lg font-bold mb-5"
              style={{ color: "#0F2044" }}
            >
              Reward Tiers
            </h2>

          <div className="flex flex-col gap-3">
              {project.rewardTiers.map((tier, i) => {
                const remaining = tier.quantity - tier.claimed;
                const soldOut = remaining <= 0;
                const tierPercent = Math.min(
                  Math.round((tier.claimed / tier.quantity) * 100),
                  100
                );

                return (
                  <div
                    key={i}
                    className="rounded-xl border border-gray-100 p-4 md:p-5 hover:shadow-sm transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between gap-4 mb-3">
                      {/* Name + Amount */}
                      <div>
                        <h3
                          className="text-[15px] font-bold leading-snug"
                          style={{ color: "#0F2044" }}
                        >
                          {tier.gift}
                        </h3>
                        <span
                          className="text-sm font-bold"
                          style={{ color: "#D4A017" }}
                        >
                          EGP {tier.amount?.toLocaleString("en-US")}
                        </span>
                      </div>

                      {/* Button */}
                      {soldOut ? (
                        <span className="px-5 py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-400 cursor-not-allowed">
                          Sold out
                        </span>
                      ) : (
                        <button
                          onClick={() => handleInvest({ amount: tier.amount, rewardTierId: tier.id, tierName: tier.gift })}
                          disabled={investing}
                          className="px-5 py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200 cursor-pointer hover:opacity-90 shrink-0 disabled:opacity-50"
                          style={{ backgroundColor: "#0F2044" }}
                        >
                          {investing ? "Processing..." : "Invest"}
                        </button>
                      )}
                    </div>

                    {/* Stats + Progress */}
                    <div className="flex items-center gap-4 mb-2.5">
                      <span className="text-[11px] text-gray-400">
                        <span className="font-semibold uppercase tracking-wider">Total</span>{" "}
                        <span className="font-bold text-gray-600">{tier.quantity}</span>
                      </span>
                      <span className="text-[11px] text-gray-400">
                        <span className="font-semibold uppercase tracking-wider">Claimed</span>{" "}
                        <span className="font-bold" style={{ color: "#D4A017" }}>{tier.claimed}</span>
                      </span>
                      <span className="text-[11px] text-gray-400">
                        <span className="font-semibold uppercase tracking-wider">Remaining</span>{" "}
                        <span
                          className="font-bold"
                          style={{ color: soldOut ? "#EF4444" : "#059669" }}
                        >
                          {remaining}
                        </span>
                      </span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${tierPercent}%`,
                          backgroundColor: soldOut ? "#9CA3AF" : "#D4A017",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      {/* ══════════════════════════════════════════════ */}
      {/* ── EQUITY INVESTMENT (Equity-Based only) ──    */}
      {/* ══════════════════════════════════════════════ */}

      {project.fundingType === "Equity" && project.equityOffered && (() => {
        const amount = Number(investAmount) || 0;
        const yourShare = amount > 0
          ? ((amount / project.target) * project.equityOffered).toFixed(2)
          : "0.00";
        const isValid = amount >= (project.minContribution || 0) && amount > 0;

        return (
          <div id="invest" className="mb-10">
            <h2
              className="text-lg font-bold mb-5"
              style={{ color: "#0F2044" }}
            >
              Invest in This Project
            </h2>

            <div className="rounded-xl border border-gray-100 p-5 md:p-6">
              {/* Equity Info */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
                  style={{ backgroundColor: "#FEF9EC" }}
                >
                  <FaChartPie size={16} style={{ color: "#D4A017" }} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Total Equity Offered
                  </p>
                  <p className="text-xl font-bold" style={{ color: "#D4A017" }}>
                    {project.equityOffered}%
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    For Funding Goal
                  </p>
                  <p className="text-sm font-bold" style={{ color: "#0F2044" }}>
                    EGP {project.target?.toLocaleString("en-US")}
                  </p>
                </div>
              </div>

              {/* Input + Share */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {/* Amount Input */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5 block">
                    Enter Investment Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                      EGP
                    </span>
                    <input
                      type="number"
                      min={project.minContribution || 0}
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      placeholder={`Min ${(project.minContribution || 0).toLocaleString("en-US")}`}
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                      style={{
                        color: "#0F2044",
                        focusRingColor: "#D4A017",
                      }}
                    />
                  </div>
                </div>

                {/* Your Share */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5 block">
                    Your Equity Share
                  </label>
                  <div
                    className="flex items-center justify-center h-[46px] rounded-lg text-xl font-bold"
                    style={{
                      backgroundColor: "#FEF9EC",
                      color: amount > 0 ? "#D4A017" : "#CCC",
                    }}
                  >
                    {yourShare}%
                  </div>
                </div>
              </div>

              {/* Min notice + Button */}
              <div className="flex items-center justify-between gap-4">
                <p className="text-[11px] text-gray-400">
                  Min. contribution:{" "}
                  <span className="font-semibold text-gray-500">
                    EGP {(project.minContribution || 0).toLocaleString("en-US")}
                  </span>
                </p>
                <button
                  onClick={() =>
                    isValid
                      ? handleInvest({ amount: Number(investAmount), shareInfo: `${yourShare}% equity` })
                      : showToast("warning", `Minimum investment is EGP ${(project.minContribution || 0).toLocaleString("en-US")}`)
                  }
                  disabled={investing}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 cursor-pointer shrink-0 disabled:opacity-50"
                  style={{
                    backgroundColor: isValid ? "#0F2044" : "#9CA3AF",
                  }}
                >
                  {investing ? "Processing..." : "Invest"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══════════════════════════════════════════════ */}
      {/* ── MUDARABAH INVESTMENT (Mudarabah only) ──    */}
      {/* ══════════════════════════════════════════════ */}

      {project.fundingType === "Mudarabah" && project.investorProfitShare && (() => {
        const amount = Number(investAmount) || 0;
        const yourShare = amount > 0
          ? ((amount / project.target) * project.investorProfitShare).toFixed(2)
          : "0.00";
        const isValid = amount >= (project.minContribution || 0) && amount > 0;

        const freqLabel = {
          Monthly: "every month",
          Quarterly: "every 3 months",
          "Semi-annually": "every 6 months",
          Annually: "every 12 months",
        };

        return (
          <div id="invest" className="mb-10">
            <h2
              className="text-lg font-bold mb-5"
              style={{ color: "#0F2044" }}
            >
              Invest in This Project
            </h2>

            <div className="rounded-xl border border-gray-100 p-5 md:p-6">
              {/* Profit Share Info */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
                  style={{ backgroundColor: "#FEF9EC" }}
                >
                  <FaChartPie size={16} style={{ color: "#D4A017" }} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Investor Profit Share
                  </p>
                  <p className="text-xl font-bold" style={{ color: "#D4A017" }}>
                    {project.investorProfitShare}%
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    For Funding Goal
                  </p>
                  <p className="text-sm font-bold" style={{ color: "#0F2044" }}>
                    EGP {project.target?.toLocaleString("en-US")}
                  </p>
                </div>
              </div>

              {/* Contract Duration + Payout */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-lg p-3" style={{ backgroundColor: "#FAFBFC" }}>
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
                    Contract Duration
                  </p>
                  <p className="text-sm font-bold" style={{ color: "#0F2044" }}>
                    {project.contractDuration} Months
                  </p>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: "#FAFBFC" }}>
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
                    Payout Frequency
                  </p>
                  <p className="text-sm font-bold" style={{ color: "#0F2044" }}>
                    {project.payoutFrequency}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 mb-5" />

              {/* Input + Share */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5 block">
                    Enter Investment Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                      EGP
                    </span>
                    <input
                      type="number"
                      min={project.minContribution || 0}
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      placeholder={`Min ${(project.minContribution || 0).toLocaleString("en-US")}`}
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                      style={{ color: "#0F2044" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5 block">
                    Your Profit Share
                  </label>
                  <div
                    className="flex items-center justify-center h-[46px] rounded-lg text-xl font-bold"
                    style={{
                      backgroundColor: "#FEF9EC",
                      color: amount > 0 ? "#D4A017" : "#CCC",
                    }}
                  >
                    {yourShare}%
                  </div>
                </div>
              </div>

              {/* Min notice + Button */}
              <div className="flex items-center justify-between gap-4 mb-5">
                <p className="text-[11px] text-gray-400">
                  Min. contribution:{" "}
                  <span className="font-semibold text-gray-500">
                    EGP {(project.minContribution || 0).toLocaleString("en-US")}
                  </span>
                </p>
                <button
                  onClick={() =>
                    isValid
                      ? handleInvest({ amount: Number(investAmount), shareInfo: `${yourShare}% profit share` })
                      : showToast("warning", `Minimum investment is EGP ${(project.minContribution || 0).toLocaleString("en-US")}`)
                  }
                  disabled={investing}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 cursor-pointer shrink-0 disabled:opacity-50"
                  style={{
                    backgroundColor: isValid ? "#0F2044" : "#9CA3AF",
                  }}
                >
                  {investing ? "Processing..." : "Invest"}
                </button>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-[12px] text-gray-500 leading-5">
                  Your profits will be distributed{" "}
                  <span className="font-semibold" style={{ color: "#0F2044" }}>
                    {freqLabel[project.payoutFrequency] || project.payoutFrequency}
                  </span>{" "}
                  for a total contract period of{" "}
                  <span className="font-semibold" style={{ color: "#0F2044" }}>
                    {project.contractDuration} months
                  </span>
                  . Returns are based on actual project profits and are not guaranteed.
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ CONFIRMATION MODAL ══ */}
      {confirmModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)", padding: 16 }}>
          <div style={{ backgroundColor: "white", borderRadius: 20, padding: "28px 24px", maxWidth: 400, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "#FEF9EC", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <FaHandHoldingUsd size={20} style={{ color: "#D4A017" }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F2044", margin: "0 0 6px" }}>Confirm Investment</h3>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{confirmModal.projectTitle}</p>
            </div>
            <div style={{ backgroundColor: "#FAFBFC", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>Amount</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#D4A017" }}>EGP {Number(confirmModal.amount).toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: confirmModal.shareInfo ? 8 : 0 }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>Type</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0F2044" }}>{confirmModal.fundingType}{confirmModal.tierName ? ` — ${confirmModal.tierName}` : ""}</span>
              </div>
              {confirmModal.shareInfo && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>Your Share</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#059669" }}>{confirmModal.shareInfo}</span>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmModal(null)}
                style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "1.5px solid #f0f0f0", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#94a3b8", cursor: "pointer", fontFamily: "inherit" }}>
                Cancel
              </button>
              <button onClick={confirmModal.onConfirm}
                style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "none", backgroundColor: "#0F2044", fontSize: 13, fontWeight: 700, color: "white", cursor: "pointer", fontFamily: "inherit" }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ ALERT MODAL ══ */}
      {toast && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.45)", padding: 16, animation: "fadeIn 0.2s ease-out" }}
          onClick={() => setToast(null)}>
          <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes scaleIn{from{transform:scale(0.9);opacity:0}to{transform:scale(1);opacity:1}} @keyframes countDown{from{width:100%}to{width:0%}}`}</style>
          <div onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: "white", borderRadius: 24, padding: "32px 28px", maxWidth: 380, width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.2)", animation: "scaleIn 0.25s ease-out", position: "relative", overflow: "hidden", textAlign: "center" }}>

            {/* Countdown bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4 }}>
              <div style={{
                height: "100%", borderRadius: "0 4px 4px 0",
                backgroundColor: toast.type === "success" ? "#059669" : toast.type === "error" ? "#DC2626" : "#D4A017",
                animation: "countDown 5s linear forwards",
              }} />
            </div>

            {/* Close X */}
            <button onClick={() => setToast(null)}
              style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", opacity: 0.3, padding: 4 }}>
              <FiX size={18} />
            </button>

            {/* Icon */}
            <div style={{
              width: 64, height: 64, borderRadius: 20, margin: "0 auto 18px",
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: toast.type === "success" ? "#ECFDF5" : toast.type === "error" ? "#FEF2F2" : "#FEF9EC",
            }}>
              {toast.type === "success" ? <FiCheck size={28} style={{ color: "#059669" }} /> :
               toast.type === "error" ? <FiAlertCircle size={28} style={{ color: "#DC2626" }} /> :
               <FiAlertCircle size={28} style={{ color: "#D4A017" }} />}
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: 18, fontWeight: 700, margin: "0 0 8px",
              color: toast.type === "success" ? "#059669" : toast.type === "error" ? "#DC2626" : "#D4A017",
            }}>
              {toast.type === "success" ? "Investment Successful!" : toast.type === "error" ? "Investment Failed" : "Attention Required"}
            </h3>

            {/* Message */}
            <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 24px", lineHeight: 1.6, padding: "0 8px" }}>
              {toast.message}
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              {toast.action ? (
                <>
                  <button onClick={() => setToast(null)}
                    style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "1.5px solid #f0f0f0", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#94a3b8", cursor: "pointer", fontFamily: "inherit" }}>
                    Close
                  </button>
                  <button onClick={() => { setToast(null); toast.action.onClick(); }}
                    style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", fontSize: 13, fontWeight: 700, color: "white", cursor: "pointer", fontFamily: "inherit",
                      backgroundColor: toast.type === "error" ? "#DC2626" : "#0F2044",
                    }}>
                    {toast.action.label}
                  </button>
                </>
              ) : (
                <button onClick={() => setToast(null)}
                  style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: "none", fontSize: 13, fontWeight: 700, color: "white", cursor: "pointer", fontFamily: "inherit",
                    backgroundColor: toast.type === "success" ? "#059669" : toast.type === "error" ? "#DC2626" : "#D4A017",
                  }}>
                  {toast.type === "success" ? "Great!" : "Got it"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
