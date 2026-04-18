import React from "react";
import ProjectCard from "./ProjectCard";

export default function ProjectsGrid({ projects, loading, onDelete, openMenuId, setOpenMenuId }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div
          className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#D4A017", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-400">
        <p className="text-lg">No projects found</p>
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