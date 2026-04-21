import React from "react";
import { Link } from "react-router-dom";
import { FaClock } from "react-icons/fa";

// ── Funding Type Badge Colors ──
const badgeStyles = {
  Equity: { backgroundColor: "#0F2044", color: "#fff" },
  Reward: { backgroundColor: "#FEF9EC", color: "#D4A017" },
  Mudarabah: { backgroundColor: "#FEF9EC", color: "#D4A017" },
};

export default function ProjectCard({
  id,
  image,
  title,
  category,
  fundingType,
  raised,
  target,
  daysLeft,
}) {
  const percentage = Math.min(Math.round((raised / target) * 100), 100);

  const formatAmount = (num) =>
    `EGP ${num.toLocaleString("en-US")}`;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* ── Project Image ── */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* ── Card Content ── */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category + Funding Badge */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            {category}
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
            style={badgeStyles[fundingType] || badgeStyles["Reward-Based"]}
          >
            {fundingType}
          </span>
        </div>

        {/* Project Title */}
        <h3
          className="text-[15px] font-bold mb-4 leading-snug line-clamp-1"
          style={{ color: "#0F2044" }}
        >
          {title}
        </h3>

        {/* Raised + Target */}
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-sm font-bold" style={{ color: "#D4A017" }}>
              {formatAmount(raised)}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mt-0.5">
              Raised
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold" style={{ color: "#0F2044" }}>
              {formatAmount(target)}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mt-0.5">
              Target
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-gray-100 mb-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: percentage >= 80 ? "#059669" : "#D4A017",
            }}
          />
        </div>

        {/* Funded % + Days Left */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-sm font-semibold"
            style={{ color: "#0F2044" }}
          >
            {percentage}% Funded
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <FaClock size={10} />
            {daysLeft} days left
          </span>
        </div>

        {/* Spacer — pushes buttons to bottom */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            to={`/investor/project/${id}`}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors duration-200 cursor-pointer text-center"
          >
            View details
          </Link>
          <button
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 cursor-pointer hover:opacity-90"
            style={{ backgroundColor: "#0F2044" }}
          >
            Invest
          </button>
        </div>
      </div>
    </div>
  );
}
