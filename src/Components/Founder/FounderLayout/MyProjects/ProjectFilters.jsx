import React from "react";

export default function ProjectFilters({ search, setSearch, typeFilter, setTypeFilter }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 bg-white flex-1">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by project name"
          className="outline-none text-sm w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <select
        className="border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm outline-none cursor-pointer"
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
      >
        <option value="">Type</option>
        <option value="Reward">Reward-Based</option>
        <option value="Equity">Equity-Based</option>
        <option value="Mudarabah">Mudarabah</option>
      </select>
    </div>
  );
}