import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiDollarSign,
  FiBriefcase,
  FiTrendingUp,
  FiTarget,
  FiSearch,
  FiClock,
  FiEye,
  FiExternalLink,
  FiX,
  FiAward,
  FiPercent,
  FiCalendar,
  FiGift,
  FiArrowRight,
} from "react-icons/fi";
import axiosInstance from "../../../Api/axiosInstance";

/* ═══════════════════════════════════════════════════════ */
/* ══  HELPERS                                          ══ */
/* ═══════════════════════════════════════════════════════ */
const fmt = (n) => (n ? Number(n).toLocaleString("en-US") : "0");
const resolveUrl = (url) =>
  url ? (url.startsWith("http") ? url : `https://investry.runasp.net${url}`) : null;
const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const badgeColor = {
  Reward: { bg: "#FEF9EC", text: "#D4A017" },
  Equity: { bg: "#0F2044", text: "#fff" },
  Mudarabah: { bg: "#FEF9EC", text: "#D4A017" },
};

/* ═══════════════════════════════════════════════════════ */
/* ══  STAT CARD                                        ══ */
/* ═══════════════════════════════════════════════════════ */
function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 shadow-sm">
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: accent === "gold" ? "#FEF9EC" : accent === "green" ? "#ECFDF5" : "#EFF6FF" }}
        >
          <Icon size={15} style={{ color: accent === "gold" ? "#D4A017" : accent === "green" ? "#059669" : "#0F2044" }} />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</span>
      </div>
      <p className="text-xl font-bold" style={{ color: accent === "gold" ? "#D4A017" : accent === "green" ? "#059669" : "#0F2044" }}>
        {value}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* ══  INVESTMENT CARD                                  ══ */
/* ═══════════════════════════════════════════════════════ */
function InvestmentCard({ inv, onViewDetails }) {
  const progress = Math.min(inv.fundingProgress || 0, 100);
  const isActive = new Date(inv.projectEndDate) > new Date();
  const badge = badgeColor[inv.fundingModel] || badgeColor.Reward;
  const coverUrl = resolveUrl(inv.projectCoverImageUrl);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col group">
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-gray-100">
        {coverUrl ? (
          <img src={coverUrl} alt={inv.projectTitle} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <FiBriefcase size={28} className="text-gray-300" />
          </div>
        )}
        {/* Funding Model Badge */}
        <span
          className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm"
          style={{ backgroundColor: badge.bg, color: badge.text }}
        >
          {inv.fundingModel}
        </span>
        {/* Status Badge */}
        <span
          className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: isActive ? "rgba(5,150,105,0.12)" : "rgba(107,114,128,0.12)",
            color: isActive ? "#059669" : "#6b7280",
          }}
        >
          {isActive ? "Active" : "Ended"}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category */}
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
          {inv.projectCategory || "General"}
        </span>

        {/* Title */}
        <h3 className="text-[15px] font-bold leading-snug mb-1 line-clamp-1" style={{ color: "#0F2044" }}>
          {inv.projectTitle}
        </h3>

        {/* Date */}
        <span className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-3">
          <FiClock size={10} />
          Invested {formatDate(inv.investmentDate)}
        </span>

        {/* Your Investment */}
        <div className="flex items-center justify-between mb-3 bg-gray-50 rounded-lg px-3 py-2.5">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Your Investment</span>
          <span className="text-sm font-bold" style={{ color: "#D4A017" }}>
            EGP {fmt(inv.amount)}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-1.5">
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-gray-500">EGP {fmt(inv.projectCurrentAmount)}</span>
            <span className="text-[11px] font-semibold" style={{ color: progress >= 80 ? "#059669" : "#0F2044" }}>
              {progress}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%`, backgroundColor: progress >= 80 ? "#059669" : "#D4A017" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-400">Raised</span>
            <span className="text-[10px] text-gray-400">Target: EGP {fmt(inv.projectTargetAmount)}</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Buttons */}
        <div className="flex gap-2.5 mt-3">
          <button
            onClick={() => onViewDetails(inv)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            <FiEye size={13} /> Details
          </button>
          <Link
            to={`/investor/project/${inv.projectId}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all duration-200 cursor-pointer hover:opacity-90"
            style={{ backgroundColor: "#0F2044" }}
          >
            <FiExternalLink size={13} /> Project
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* ══  DETAILS MODAL                                    ══ */
/* ═══════════════════════════════════════════════════════ */
function InvestmentDetailsModal({ inv, onClose }) {
  if (!inv) return null;

  const progress = Math.min(inv.fundingProgress || 0, 100);
  const isActive = new Date(inv.projectEndDate) > new Date();
  const badge = badgeColor[inv.fundingModel] || badgeColor.Reward;
  const coverUrl = resolveUrl(inv.projectCoverImageUrl);

  const InfoRow = ({ icon: Icon, label, value, highlight }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50">
          <Icon size={14} className="text-gray-400" />
        </div>
        <span className="text-[13px] font-medium text-gray-500">{label}</span>
      </div>
      <span className={`text-[13px] font-bold ${highlight ? "" : ""}`} style={{ color: highlight ? "#D4A017" : "#0F2044" }}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "fadeInScale 0.25s ease-out" }}
      >
        <style>{`@keyframes fadeInScale { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>

        {/* Header Image */}
        <div className="relative h-44 overflow-hidden rounded-t-2xl bg-gray-100">
          {coverUrl ? (
            <img src={coverUrl} alt={inv.projectTitle} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <FiBriefcase size={32} className="text-gray-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-600 hover:bg-white transition-colors cursor-pointer shadow-sm"
          >
            <FiX size={16} />
          </button>
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                style={{ backgroundColor: badge.bg, color: badge.text }}
              >
                {inv.fundingModel}
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: isActive ? "rgba(5,150,105,0.2)" : "rgba(255,255,255,0.2)",
                  color: isActive ? "#6ee7b7" : "#e5e7eb",
                }}
              >
                {isActive ? "Active" : "Ended"}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white leading-snug">{inv.projectTitle}</h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Investment Summary */}
          <div className="rounded-xl p-4 mb-5" style={{ background: "linear-gradient(135deg, #FEF9EC 0%, #FFFDF5 100%)", border: "1px solid rgba(212,160,23,0.15)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Your Investment</p>
                <p className="text-xl font-bold" style={{ color: "#D4A017" }}>EGP {fmt(inv.amount)}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Invested On</p>
                <p className="text-sm font-semibold" style={{ color: "#0F2044" }}>{formatDate(inv.investmentDate)}</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-5">
            <div className="flex justify-between mb-2">
              <span className="text-[12px] font-semibold text-gray-500">EGP {fmt(inv.projectCurrentAmount)} raised</span>
              <span className="text-[12px] font-bold" style={{ color: progress >= 80 ? "#059669" : "#D4A017" }}>{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, backgroundColor: progress >= 80 ? "#059669" : "#D4A017" }} />
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5">Target: EGP {fmt(inv.projectTargetAmount)}</p>
          </div>

          {/* Details */}
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {inv.fundingModel === "Reward" ? "Reward Details" : inv.fundingModel === "Equity" ? "Equity Details" : "Mudarabah Details"}
              </span>
            </div>
            <div className="px-4">
              {inv.fundingModel === "Reward" && (
                <>
                  <InfoRow icon={FiGift} label="Reward Tier" value={inv.rewardTierTitle || "—"} />
                  {inv.rewardDescription && <InfoRow icon={FiAward} label="Description" value={inv.rewardDescription} />}
                  {inv.rewardTierAmount && <InfoRow icon={FiDollarSign} label="Tier Amount" value={`EGP ${fmt(inv.rewardTierAmount)}`} highlight />}
                </>
              )}
              {inv.fundingModel === "Equity" && (
                <InfoRow icon={FiPercent} label="Equity Owned" value={`${inv.equityPercentageOwned || 0}%`} highlight />
              )}
              {inv.fundingModel === "Mudarabah" && (
                <>
                  <InfoRow icon={FiPercent} label="Profit Share" value={`${inv.profitSharePercentage || 0}%`} highlight />
                  <InfoRow icon={FiCalendar} label="Next Payout" value={formatDate(inv.nextPayoutDate)} />
                  <InfoRow icon={FiTrendingUp} label="Total Profit" value={`EGP ${fmt(inv.totalProfitReceived)}`} highlight />
                  <InfoRow icon={FiDollarSign} label="Capital Returned" value={`EGP ${fmt(inv.capitalReturned)}`} />
                </>
              )}
              <InfoRow icon={FiCalendar} label="Campaign Ends" value={formatDate(inv.projectEndDate)} />
              <InfoRow icon={FiBriefcase} label="Category" value={inv.projectCategory || "General"} />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 mt-5">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-[13px] font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
              Close
            </button>
            <Link
              to={`/investor/project/${inv.projectId}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: "#0F2044" }}
            >
              Go to Project <FiArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* ══  LOADING SKELETON                                 ══ */
/* ═══════════════════════════════════════════════════════ */
function LoadingSkeleton() {
  return (
    <>
      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 shadow-sm animate-pulse">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-9 w-9 rounded-lg bg-gray-100" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
            <div className="h-6 w-28 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
            <div className="h-40 bg-gray-100" />
            <div className="p-4">
              <div className="h-2.5 bg-gray-100 rounded w-1/3 mb-3" />
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-2.5 bg-gray-100 rounded w-1/2 mb-4" />
              <div className="h-10 bg-gray-50 rounded-lg mb-3" />
              <div className="h-1.5 bg-gray-100 rounded-full mb-4" />
              <div className="flex gap-2.5">
                <div className="h-10 bg-gray-100 rounded-lg flex-1" />
                <div className="h-10 bg-gray-100 rounded-lg flex-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* ══  EMPTY STATE                                      ══ */
/* ═══════════════════════════════════════════════════════ */
function EmptyState({ hasFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: "#FEF9EC" }}>
        <FiBriefcase size={24} style={{ color: "#D4A017" }} />
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ color: "#0F2044" }}>
        {hasFilters ? "No matching investments" : "No investments yet"}
      </h3>
      <p className="text-sm text-gray-400 max-w-xs leading-relaxed mb-6">
        {hasFilters
          ? "Try adjusting your search or filters to find your investments."
          : "Start exploring projects and make your first investment to grow your portfolio."}
      </p>
      {!hasFilters && (
        <Link
          to="/investor"
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: "#0F2044" }}
        >
          Explore Projects <FiArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* ══  MAIN COMPONENT                                   ══ */
/* ═══════════════════════════════════════════════════════ */
export default function InvestorMyInvestments() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modelFilter, setModelFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedInv, setSelectedInv] = useState(null);

  /* ── Fetch Data ── */
  useEffect(() => {
    axiosInstance
      .get("/Investments/my-investments")
      .then((res) => {
        if (res.data?.isSuccess) {
          setInvestments(res.data.value || []);
        } else if (res.data?.success) {
          setInvestments(res.data.data || []);
        }
      })
      .catch((err) => console.error("Failed to fetch investments:", err))
      .finally(() => setLoading(false));
  }, []);

  /* ── Stats ── */
  const stats = {
    totalInvested: investments.reduce((s, i) => s + (i.amount || 0), 0),
    activeProjects: investments.filter((i) => new Date(i.projectEndDate) > new Date()).length,
    totalReturns: investments.reduce((s, i) => s + (i.totalProfitReceived || 0), 0),
    avgProgress: investments.length > 0 ? Math.round(investments.reduce((s, i) => s + (i.fundingProgress || 0), 0) / investments.length) : 0,
  };

  /* ── Filter & Sort ── */
  const hasFilters = search.trim() !== "" || modelFilter !== "all";
  const filtered = investments
    .filter((i) => {
      const matchSearch = (i.projectTitle || "").toLowerCase().includes(search.toLowerCase());
      const matchModel = modelFilter === "all" || i.fundingModel === modelFilter;
      return matchSearch && matchModel;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.investmentDate) - new Date(a.investmentDate);
      if (sortBy === "amount") return b.amount - a.amount;
      if (sortBy === "progress") return b.fundingProgress - a.fundingProgress;
      return 0;
    });

  /* ── Select Styles (reused) ── */
  const selectClass =
    "w-full appearance-none rounded-lg border border-gray-100 bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 shadow-sm outline-none transition-all duration-200 focus:border-[#D4A017] focus:ring-2 focus:ring-[#FEF9EC] cursor-pointer";

  const SelectArrow = () => (
    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  );

  return (
    <div className="p-4 md:p-6">
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1.5" style={{ color: "#D4A017" }}>
          My Investments
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-md">
          Track your portfolio, monitor progress, and view returns across all your investments.
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* ── Stats ── */}
          {investments.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <StatCard icon={FiDollarSign} label="Total Invested" value={`EGP ${fmt(stats.totalInvested)}`} accent="gold" />
              <StatCard icon={FiBriefcase} label="Active Projects" value={stats.activeProjects} accent="blue" />
              <StatCard icon={FiTrendingUp} label="Total Returns" value={`EGP ${fmt(stats.totalReturns)}`} accent="green" />
              <StatCard icon={FiTarget} label="Avg. Progress" value={`${stats.avgProgress}%`} accent="blue" />
            </div>
          )}

          {/* ── Filters ── */}
          {investments.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <FiSearch size={14} />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by project name..."
                  className="w-full rounded-lg border border-gray-100 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-sm outline-none transition-all duration-200 focus:border-[#D4A017] focus:ring-2 focus:ring-[#FEF9EC]"
                />
              </div>
              {/* Model Filter */}
              <div className="relative w-full sm:w-44">
                <select value={modelFilter} onChange={(e) => setModelFilter(e.target.value)} className={selectClass}>
                  <option value="all">All Models</option>
                  <option value="Reward">Reward</option>
                  <option value="Equity">Equity</option>
                  <option value="Mudarabah">Mudarabah</option>
                </select>
                <SelectArrow />
              </div>
              {/* Sort */}
              <div className="relative w-full sm:w-44">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
                  <option value="newest">Newest First</option>
                  <option value="amount">Highest Amount</option>
                  <option value="progress">Highest Progress</option>
                </select>
                <SelectArrow />
              </div>
            </div>
          )}

          {/* ── Grid or Empty ── */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((inv) => (
                <InvestmentCard key={inv.id} inv={inv} onViewDetails={setSelectedInv} />
              ))}
            </div>
          ) : (
            <EmptyState hasFilters={hasFilters} />
          )}
        </>
      )}

      {/* ── Details Modal ── */}
      {selectedInv && <InvestmentDetailsModal inv={selectedInv} onClose={() => setSelectedInv(null)} />}
    </div>
  );
}
