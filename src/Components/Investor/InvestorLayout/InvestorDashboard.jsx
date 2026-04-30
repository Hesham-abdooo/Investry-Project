import React, { useState, useEffect } from "react";
import { FaWallet, FaSearch, FaBriefcase } from "react-icons/fa";
import ProjectCard from "./ProjectCard";
import { getProjects } from "./projectService";
import axiosInstance from "../../../Api/axiosInstance";

const fmt = (n) => Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function InvestorDashboard() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [fundingType, setFundingType] = useState("all");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    axiosInstance
      .get("/Wallet/balance")
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setBalance(typeof data === "number" ? data : data?.balance ?? data?.availableBalance ?? 0);
      })
      .catch(() => setBalance(0))
      .finally(() => setBalanceLoading(false));
  }, []);

  // ── Filtering ──
  const filteredProjects = projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || p.category === category;
    const matchFunding = fundingType === "all" || p.fundingType === fundingType;
    return matchSearch && matchCategory && matchFunding;
  });

  return (
    <div className="p-4 md:p-6">
      {/* ── Header + Balance ── */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-8">
        {/* Title */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1.5" style={{ color: "#D4A017" }}>
            Projects
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-md">
            Discover and invest in verified, high-potential projects curated by InvesTry.
          </p>
        </div>

        {/* ── Wallet Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 shadow-sm min-w-[240px]">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: "#FEF9EC" }}
            >
              <FaWallet size={14} style={{ color: "#D4A017" }} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Available Balance
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "#0F2044" }}>
            EGP <span style={{ color: "#D4A017" }}>{balanceLoading ? "..." : fmt(balance)}</span>
          </p>
        </div>
      </div>

      {/* ── Search & Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
            <FaSearch size={13} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name..."
            className="w-full rounded-lg border border-gray-100 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-sm outline-none transition-all duration-200 focus:border-[#D4A017] focus:ring-2 focus:ring-[#FEF9EC]"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-100 bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 shadow-sm outline-none transition-all duration-200 focus:border-[#D4A017] focus:ring-2 focus:ring-[#FEF9EC] cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Environment">Environment</option>
            <option value="Food & Beverage">Food & Beverage</option>
            <option value="Fashion">Fashion</option>
            <option value="Art & Culture">Art & Culture</option>
            <option value="Business">Business</option>
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        <div className="relative w-full sm:w-48">
          <select
            value={fundingType}
            onChange={(e) => setFundingType(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-100 bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 shadow-sm outline-none transition-all duration-200 focus:border-[#D4A017] focus:ring-2 focus:ring-[#FEF9EC] cursor-pointer"
          >
            <option value="all">All Models</option>
            <option value="Equity">Equity</option>
            <option value="Reward">Reward</option>
            <option value="Mudarabah">Mudarabah</option>
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>


      {/* ── Projects Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-200" />
              <div className="p-4">
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-2 bg-gray-200 rounded w-full mb-2" />
                <div className="h-2 bg-gray-200 rounded w-2/3 mb-4" />
                <div className="flex gap-3">
                  <div className="h-10 bg-gray-200 rounded-lg flex-1" />
                  <div className="h-10 bg-gray-200 rounded-lg flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: "#FEF9EC" }}
          >
            <FaBriefcase size={20} style={{ color: "#D4A017" }} />
          </div>
          <h3 className="text-base font-semibold mb-1.5" style={{ color: "#0F2044" }}>
            {search || category !== "all" || fundingType !== "all" ? "No matching projects" : "No projects available yet"}
          </h3>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
            {search || category !== "all" || fundingType !== "all"
              ? "Try adjusting your search or filters to find more projects."
              : "Projects will appear here once they are published and verified by InvesTry."}
          </p>
        </div>
      )}
    </div>
  );
}
