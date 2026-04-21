import React from "react";
import { FiSearch } from "react-icons/fi";

export default function ProjectFilters({ search, setSearch, typeFilter, setTypeFilter }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
      {/* Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          border: "1.5px solid #f0f0f0",
          borderRadius: 12,
          padding: "0 16px",
          backgroundColor: "white",
          flex: 1,
          minWidth: 200,
          height: 44,
          transition: "border-color 0.2s ease",
        }}
      >
        <FiSearch size={15} style={{ color: "#94a3b8", flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search by project name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            fontSize: 14,
            color: "#0F2044",
            width: "100%",
            fontFamily: "inherit",
            backgroundColor: "transparent",
          }}
        />
      </div>

      {/* Type Filter */}
      <div style={{ position: "relative" }}>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            appearance: "none",
            border: "1.5px solid #f0f0f0",
            borderRadius: 12,
            padding: "0 40px 0 16px",
            backgroundColor: "white",
            fontSize: 14,
            color: typeFilter ? "#0F2044" : "#94a3b8",
            fontWeight: 500,
            height: 44,
            cursor: "pointer",
            outline: "none",
            fontFamily: "inherit",
            minWidth: 160,
            transition: "border-color 0.2s ease",
          }}
        >
          <option value="">All Types</option>
          <option value="Reward">Reward-Based</option>
          <option value="Equity">Equity-Based</option>
          <option value="Mudarabah">Mudarabah</option>
        </select>
        <span
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "#94a3b8",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}