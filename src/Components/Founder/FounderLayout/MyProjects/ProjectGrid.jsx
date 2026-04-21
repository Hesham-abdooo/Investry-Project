import React from "react";
import { FiBriefcase } from "react-icons/fi";
import ProjectCard from "./ProjectCard";

export default function ProjectsGrid({ projects, loading, onDelete, openMenuId, setOpenMenuId }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              border: "1.5px solid #f0f0f0",
              overflow: "hidden",
            }}
            className="animate-pulse"
          >
            <div style={{ aspectRatio: "16/9", backgroundColor: "#f3f4f6" }} />
            <div style={{ padding: 20 }}>
              <div style={{ height: 10, backgroundColor: "#f3f4f6", borderRadius: 6, width: "30%", marginBottom: 10 }} />
              <div style={{ height: 14, backgroundColor: "#f3f4f6", borderRadius: 6, width: "70%", marginBottom: 16 }} />
              <div style={{ height: 6, backgroundColor: "#f3f4f6", borderRadius: 4, width: "100%", marginBottom: 8 }} />
              <div style={{ height: 10, backgroundColor: "#f3f4f6", borderRadius: 6, width: "50%" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            backgroundColor: "#FEF9EC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <FiBriefcase size={22} style={{ color: "#D4A017" }} />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0F2044", margin: "0 0 6px" }}>
          No projects found
        </h3>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, maxWidth: 280, lineHeight: 1.5 }}>
          Try adjusting your search or filters, or create a new project to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onDelete={onDelete}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
        />
      ))}
    </div>
  );
}