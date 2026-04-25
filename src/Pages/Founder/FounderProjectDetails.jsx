import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaFileAlt, FaBullseye, FaHandHoldingUsd,
  FaCalendarAlt, FaClock, FaUsers, FaGift, FaMapMarkerAlt,
  FaExternalLinkAlt, FaDownload, FaChartPie, FaEdit, FaTrashAlt,
} from "react-icons/fa";
import axiosInstance from "../../Api/axiosInstance";

export default function FounderProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    axiosInstance.get(`/Projects/${id}/details`)
      .then(res => { if (res.data?.success && res.data.data) setProject(res.data.data); })
      .catch(err => console.error("Failed:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    try { await axiosInstance.delete(`/Projects/${id}`); navigate("/founder/projects"); }
    catch (err) { console.error(err); alert("Failed to delete project."); }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            <div className="lg:col-span-3"><div className="rounded-xl bg-gray-200 h-72" /></div>
            <div className="lg:col-span-2"><div className="rounded-xl bg-gray-200 h-72" /></div>
          </div>
          <div className="bg-gray-200 rounded-xl h-40 mb-8" />
          <div className="bg-gray-200 rounded-xl h-24" />
        </div>
      </div>
    );
  }

  /* ── Not Found ── */
  if (!project) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-bold mb-2" style={{ color: "#0F2044" }}>Project not found</h2>
        <p className="text-sm text-gray-400 mb-4">The project you're looking for doesn't exist or couldn't be loaded.</p>
        <Link to="/founder/projects" className="text-sm font-semibold px-4 py-2 rounded-lg text-white" style={{ backgroundColor: "#0F2044" }}>Back to My Projects</Link>
      </div>
    );
  }

  /* ── Derived ── */
  const resolveUrl = (u) => u ? (u.startsWith("http") ? u : `https://investry.runasp.net${u}`) : null;
  const coverUrl = resolveUrl(project.coverImageUrl);
  const gallery = (project.mediaGallery || []).filter(m => m.type === "Image");
  const images = coverUrl ? [coverUrl, ...gallery.map(g => resolveUrl(g.url))] : gallery.map(g => resolveUrl(g.url));
  const docs = project.mediaDocument || [];
  const percentage = Math.min(project.fundingProgressPercentage ?? 0, 100);
  const raised = Number(project.currentAmount) || 0;
  const target = Number(project.targetAmount) || 0;
  const model = project.fundingModel || "Reward";
  const tiers = project.rewardTiers || [];
  const eq = project.equityDetails;
  const md = project.mudarabahDetails;
  const daysLeft = project.daysRemaining;
  const backers = project.numberOfInvestors ?? 0;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* ── Back Button ── */}
      <div className="mb-6">
        <Link to="/founder/projects" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <FaArrowLeft size={12} /> Back to My Projects
        </Link>
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/* ── HERO: Image + Info Side by Side ──         */}
      {/* ══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* ── Left: Image Gallery (3/5) ── */}
        <div className="lg:col-span-3">
          {/* Main Image */}
          <div className="rounded-xl overflow-hidden mb-3 bg-gray-100">
            {images[activeImage] ? (
              <img src={images[activeImage]} alt={project.title} className="w-full h-64 sm:h-72 md:h-80 object-cover transition-all duration-500" />
            ) : (
              <div className="w-full h-64 sm:h-72 md:h-80 flex items-center justify-center bg-gray-100">
                <FaBullseye size={32} className="text-gray-300" />
              </div>
            )}
          </div>

          {/* Thumbnails + Docs */}
          <div className="flex flex-wrap items-center gap-2.5">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)}
                className="rounded-lg overflow-hidden transition-all duration-200 cursor-pointer"
                style={{ width: 60, height: 44, opacity: activeImage === i ? 1 : 0.5, outline: activeImage === i ? "2px solid #D4A017" : "2px solid transparent", outlineOffset: 2 }}>
                <img src={img} alt={`${project.title} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
            {docs.length > 0 && <div className="w-px h-9 bg-gray-200 mx-1" />}
            {docs.map((doc, i) => {
              const docUrl = resolveUrl(doc.url);
              const name = doc.url?.split("/").pop() || `Document ${i + 1}`;
              return (
                <a key={i} href={docUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                  <FaDownload size={11} className="text-gray-400 group-hover:text-[#D4A017] transition-colors" />
                  <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-700 transition-colors">{name}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* ── Right: Funding Card (2/5) ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-50">
            {/* Funding Goal */}
            <div className="text-center mb-4 pb-4 border-b border-gray-100">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Funding Goal</p>
              <p className="text-2xl font-bold" style={{ color: "#D4A017" }}>EGP {target.toLocaleString("en-US")}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {model === "Reward" ? (
                <div className="rounded-lg p-3" style={{ backgroundColor: "#FAFBFC" }}>
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Reward Tiers</p>
                  <p className="text-sm font-bold" style={{ color: "#0F2044" }}>{tiers.length} {tiers.length === 1 ? "Tier" : "Tiers"}</p>
                </div>
              ) : (
                <div className="rounded-lg p-3" style={{ backgroundColor: "#FAFBFC" }}>
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Min. Contribution</p>
                  <p className="text-sm font-bold" style={{ color: "#0F2044" }}>EGP {Number(project.minimumContribution || 0).toLocaleString("en-US")}</p>
                </div>
              )}
              <div className="rounded-lg p-3" style={{ backgroundColor: "#FAFBFC" }}>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Duration</p>
                <p className="text-sm font-bold" style={{ color: "#0F2044" }}>{project.campaignDurationInDays ? `${project.campaignDurationInDays} days` : "—"}</p>
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
            {project.promotionalVideoURL && (
              <a href={project.promotionalVideoURL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-medium transition-colors hover:opacity-80 mb-3" style={{ color: "#D4A017" }}>
                <FaExternalLinkAlt size={10} /> Watch Project Video
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
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ backgroundColor: "#FEF9EC", color: "#D4A017" }}>
            {project.category || "General"}
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold mb-4 leading-snug" style={{ color: "#0F2044" }}>{project.title}</h1>
        <div className="border-t border-gray-100 mb-4" />
        <p className="text-[14px] text-gray-600 leading-7 mb-5 whitespace-pre-wrap">
          {project.longDescription || project.shortDescription || "No description provided."}
        </p>
        <div className="border-t border-gray-100 mb-4" />

        {/* Funding Type */}
        <div className="flex items-center gap-3">
          <div className="rounded-lg shrink-0" style={{ backgroundColor: "#FEF9EC", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FaGift size={13} style={{ color: "#D4A017" }} />
          </div>
          <span className="text-[12px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full"
            style={model === "Equity" ? { backgroundColor: "#0F2044", color: "#fff" } : { backgroundColor: "#FEF9EC", color: "#D4A017" }}>
            {model}
          </span>
        </div>
        <p className="text-[13px] text-gray-500 leading-6 mt-2 ml-12">
          {model === "Reward"
            ? "This project follows a Reward-Based funding model. You can support it by choosing from the available reward tiers below. Each tier has a fixed contribution amount, a specific reward, and a limited quantity set by the founder. Once a tier is fully claimed, it becomes sold out."
            : model === "Equity"
              ? "This project follows an Equity-Based funding model. By investing, you receive ownership shares in the company proportional to your contribution. Your returns are tied to the company's growth, valuation, and future profitability."
              : "This project follows a Mudarabah (profit-sharing) funding model based on Islamic finance principles. As an investor, you provide the capital while the founder manages the project. Profits are distributed between you and the founder based on a pre-agreed ratio."}
        </p>
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/* ── CAMPAIGN PROGRESS (Full Width) ──          */}
      {/* ══════════════════════════════════════════════ */}
      <div className="rounded-xl p-4 md:p-5 mb-8 md:mb-10" style={{ backgroundColor: "#F8F9FB" }}>
        <div className="flex flex-wrap items-end justify-between gap-2 mb-3">
          <div>
            <p className="text-[11px] md:text-xs text-gray-400 mb-0.5">Raised</p>
            <p className="text-base md:text-lg font-bold" style={{ color: "#D4A017" }}>EGP {raised.toLocaleString("en-US")}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] md:text-xs text-gray-400 mb-0.5">Target</p>
            <p className="text-base md:text-lg font-bold" style={{ color: "#0F2044" }}>EGP {target.toLocaleString("en-US")}</p>
          </div>
        </div>
        <div className="w-full h-2.5 md:h-3 rounded-full bg-gray-200 mb-3 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentage}%`, backgroundColor: percentage >= 80 ? "#059669" : "#D4A017" }} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs md:text-sm font-semibold" style={{ color: "#0F2044" }}>{percentage}% Funded</span>
          <div className="flex items-center gap-3 md:gap-4">
            <span className="flex items-center gap-1.5 text-[11px] md:text-xs text-gray-400"><FaClock size={10} /> {daysLeft ?? "—"} days left</span>
            <span className="flex items-center gap-1.5 text-[11px] md:text-xs text-gray-400"><FaUsers size={11} /> {backers} backers</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/* ── REWARD TIERS (Reward-Based only) ──        */}
      {/* ══════════════════════════════════════════════ */}
      {model === "Reward" && tiers.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-5" style={{ color: "#0F2044" }}>Reward Tiers</h2>
          <div className="flex flex-col gap-3">
            {tiers.map((tier, i) => {
              const claimed = tier.currentBackers || 0;
              const max = tier.maxBackers || 0;
              const remaining = max - claimed;
              const soldOut = remaining <= 0;
              const tierPercent = max > 0 ? Math.min(Math.round((claimed / max) * 100), 100) : 0;
              return (
                <div key={i} className="rounded-xl border border-gray-100 p-4 md:p-5 hover:shadow-sm transition-shadow duration-200">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-[15px] font-bold leading-snug" style={{ color: "#0F2044" }}>{tier.title || `Tier ${i + 1}`}</h3>
                      <span className="text-sm font-bold" style={{ color: "#D4A017" }}>EGP {Number(tier.amount || 0).toLocaleString("en-US")}</span>
                    </div>
                    <span className={`px-5 py-2 rounded-lg text-xs font-semibold ${soldOut ? "bg-gray-100 text-gray-400" : ""}`}
                      style={soldOut ? {} : { backgroundColor: "#ECFDF5", color: "#059669" }}>
                      {soldOut ? "Sold out" : `${remaining} left`}
                    </span>
                  </div>
                  {tier.description && <p className="text-[13px] text-gray-500 leading-6 mb-3">{tier.description}</p>}
                  <div className="flex items-center gap-4 mb-2.5">
                    <span className="text-[11px] text-gray-400"><span className="font-semibold uppercase tracking-wider">Total</span> <span className="font-bold text-gray-600">{max}</span></span>
                    <span className="text-[11px] text-gray-400"><span className="font-semibold uppercase tracking-wider">Claimed</span> <span className="font-bold" style={{ color: "#D4A017" }}>{claimed}</span></span>
                    <span className="text-[11px] text-gray-400"><span className="font-semibold uppercase tracking-wider">Remaining</span> <span className="font-bold" style={{ color: soldOut ? "#EF4444" : "#059669" }}>{remaining}</span></span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${tierPercent}%`, backgroundColor: soldOut ? "#9CA3AF" : "#D4A017" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* ── EQUITY DETAILS (Equity-Based only) ──      */}
      {/* ══════════════════════════════════════════════ */}
      {model === "Equity" && eq && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3" style={{ color: "#0F2044" }}>Equity Details</h2>
          <div className="rounded-xl border border-gray-100 px-5 py-4 md:px-6 md:py-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Desktop: Single Row */}
            <div className="hidden md:flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: "#FEF9EC" }}>
                  <FaChartPie size={14} style={{ color: "#D4A017" }} />
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Equity Offered</p>
                  <p className="text-lg font-bold leading-tight" style={{ color: "#D4A017" }}>{eq.equityPercentageOffered || 0}%</p>
                </div>
              </div>
              <div className="w-px h-9 bg-gray-100 mx-4" />
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Funding Goal</p>
                <p className="text-sm font-bold text-gray-800 leading-tight">EGP {target.toLocaleString("en-US")}</p>
              </div>
              <div className="w-px h-9 bg-gray-100 mx-4" />
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Min. Invest</p>
                <p className="text-sm font-bold text-gray-800 leading-tight">EGP {Number(project.minimumContribution || 0).toLocaleString("en-US")}</p>
              </div>
              <div className="w-px h-9 bg-gray-100 mx-4" />
              <div className="text-center">
                <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Investors</p>
                <p className="text-sm font-bold leading-tight" style={{ color: "#3B82F6" }}>{backers}</p>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              {/* Top: Icon + Equity */}
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: "#FEF9EC" }}>
                  <FaChartPie size={14} style={{ color: "#D4A017" }} />
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Equity Offered</p>
                  <p className="text-lg font-bold leading-tight" style={{ color: "#D4A017" }}>{eq.equityPercentageOffered || 0}%</p>
                </div>
              </div>
              {/* Bottom: 3 Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Funding Goal</p>
                  <p className="text-[13px] font-bold text-gray-800 leading-tight mt-auto pt-1">EGP {target.toLocaleString("en-US")}</p>
                </div>
                <div className="flex flex-col text-center">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Min. Invest</p>
                  <p className="text-[13px] font-bold text-gray-800 leading-tight mt-auto pt-1">EGP {Number(project.minimumContribution || 0).toLocaleString("en-US")}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Investors</p>
                  <p className="text-[13px] font-bold leading-tight mt-auto pt-1" style={{ color: "#3B82F6" }}>{backers}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* ── MUDARABAH DETAILS (Mudarabah only) ──      */}
      {/* ══════════════════════════════════════════════ */}
      {model === "Mudarabah" && md && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3" style={{ color: "#0F2044" }}>Mudarabah Terms</h2>
          <div className="rounded-xl border border-gray-100 px-5 py-4 md:px-6 md:py-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Desktop: Single Row */}
            <div className="hidden md:flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: "#FEF9EC" }}>
                  <FaChartPie size={14} style={{ color: "#D4A017" }} />
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Profit Share</p>
                  <p className="text-lg font-bold leading-tight" style={{ color: "#D4A017" }}>{md.investorsProfitSharePercentage || 0}%</p>
                </div>
              </div>
              <div className="w-px h-9 bg-gray-100 mx-4" />
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Funding Goal</p>
                <p className="text-sm font-bold text-gray-800 leading-tight">EGP {target.toLocaleString("en-US")}</p>
              </div>
              <div className="w-px h-9 bg-gray-100 mx-4" />
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Contract</p>
                <p className="text-sm font-bold text-gray-800 leading-tight">{md.contractDurationInMonths || 0} Months</p>
              </div>
              <div className="w-px h-9 bg-gray-100 mx-4" />
              <div className="text-right">
                <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Payout</p>
                <p className="text-sm font-bold text-gray-800 leading-tight">{md.profitDistributionFrequency || "—"}</p>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              {/* Top: Icon + Profit Share */}
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: "#FEF9EC" }}>
                  <FaChartPie size={14} style={{ color: "#D4A017" }} />
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Profit Share</p>
                  <p className="text-lg font-bold leading-tight" style={{ color: "#D4A017" }}>{md.investorsProfitSharePercentage || 0}%</p>
                </div>
              </div>
              {/* Bottom: 3 Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Funding Goal</p>
                  <p className="text-[13px] font-bold text-gray-800 leading-tight mt-1">EGP {target.toLocaleString("en-US")}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Contract</p>
                  <p className="text-[13px] font-bold text-gray-800 leading-tight mt-1">{md.contractDurationInMonths || 0} Months</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Payout</p>
                  <p className="text-[13px] font-bold text-gray-800 leading-tight mt-1">{md.profitDistributionFrequency || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
