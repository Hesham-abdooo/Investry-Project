import React, { useState, useEffect } from "react";
import ProjectFilters from "../../Components/Founder/FounderLayout/MyProjects/ProjectFilters";
import ProjectsGrid from "../../Components/Founder/FounderLayout/MyProjects/ProjectGrid";
import axiosInstance from "../../Api/axiosInstance";

export default function FounderProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(
        "/Projects/my-projects",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log("PROJECTS:", res.data.data);
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
    const confirm = window.confirm(
      "Are you sure you want to delete this project?",
    );
    if (!confirm) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://investry.runasp.net/api/Projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    return matchSearch && matchType;
  });
  console.log("Projects:", projects);
  console.log("Filtered:", filteredProjects);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6" style={{ color: "#D4A017" }}>
        My Projects
      </h1>
      <ProjectFilters
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
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
