import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import ProjectFilters from "../../Components/Founder/FounderLayout/MyProjects/ProjectFilters";
import ProjectsGrid from "../../Components/Founder/FounderLayout/MyProjects/ProjectGrid";
import axiosInstance from "../../Api/axiosInstance";

export default function FounderProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/Projects/my-projects");
      setProjects(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    window.addEventListener("focus", fetchProjects);
    return () => window.removeEventListener("focus", fetchProjects);
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this project?");
    if (!confirm) return;
    try {
      await axiosInstance.delete(`/Projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setOpenMenuId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const title = p.title || "";
    const matchSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter ? p.fundingModel === typeFilter : true;
    const matchStatus = statusFilter ? p.projectStatus === statusFilter : true;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0F2044", margin: "0 0 6px" }}>
            My Projects
          </h1>
          <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>
            Manage and track all your created projects.
          </p>
        </div>
        <Link
          to="/createProject"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "#0F2044",
            color: "white",
            fontSize: 14,
            fontWeight: 600,
            padding: "10px 22px",
            borderRadius: 12,
            textDecoration: "none",
            transition: "all 0.25s ease",
            boxShadow: "0 2px 6px rgba(15,32,68,0.12)",
          }}
        >
          <FiPlus size={16} />
          New Project
        </Link>
      </div>

      <ProjectFilters
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <ProjectsGrid
        projects={filteredProjects}
        loading={loading}
        onDelete={handleDelete}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
      />
    </div>
  );
}
