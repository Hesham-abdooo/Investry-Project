import React from "react";

const getStatusLabel = (status) => {
  if (status === "PendingReview") return "Pending Review";
  if (status === "Active") return "Active";
  if (status === "Completed") return "Completed";
  return status ?? "—";
};

const getFundingLabel = (model) => {
  if (model === "Reward") return "Reward-Based";
  if (model === "Equity") return "Equity-Based";
  if (model === "Mudarabah") return "Mudarabah";
  return model ?? "—";
};

const getProgressColor = (progress) => {
  if (progress >= 100) return "#34d399";
  if (progress > 0) return "#0F2044";
  return "#e5e7eb";
};

const formatAmount = (val) => {
  const num = Number(val);
  if (isNaN(num)) return "0";
  return num.toLocaleString();
};

const getStatusStyle = (status) => {
  if (status === "Active") return { color: "#0F2044", fontWeight: 600 };
  if (status === "Completed") return { color: "#34d399", fontWeight: 600 };
  if (status === "PendingReview") return { color: "#D4A017", fontWeight: 600 };
  return { color: "#9ca3af" };
};

export default function ProjectCard({
  project,
  onDelete,
  openMenuId,
  setOpenMenuId,
}) {
  const imageUrl = project.coverImageUrl
    ? project.coverImageUrl.startsWith("http")
      ? project.coverImageUrl
      : `https://investry.runasp.net${project.coverImageUrl}`
    : "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=200&fit=crop";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Image */}
      <div
        className="relative w-full"
        style={{
          aspectRatio: "16/9",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Menu Button */}
        <div className="absolute top-3 right-3">
          <button
            className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow text-gray-500 hover:text-gray-800"
            onClick={() =>
              setOpenMenuId(openMenuId === project.id ? null : project.id)
            }
          >
            ⋮
          </button>
          {openMenuId === project.id && (
            <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
              <button
                className="flex items-center gap-2 px-4 py-2 text-red-500 text-sm hover:bg-red-50 w-full"
                onClick={() => onDelete(project.id)}
              >
                🗑 Delete project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-base mb-3" style={{ color: "#D4A017" }}>
          {project.title}
        </h3>

        {/* Category */}
        <p className="text-gray-500 text-sm font-medium mb-3">
          {project.category ?? "No category"}
        </p>

        {project.fundingModel && (
          <p className="text-gray-500 text-sm mb-3">
            {getFundingLabel(project.fundingModel)}
          </p>
        )}
        {/* Progress */}
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-sm" style={{ color: "#D4A017" }}>
            EGP {formatAmount(project.currentAmount)}
          </span>
          <span
            className="text-sm font-bold"
            style={{
              color:
                project.fundingProgressPercentage >= 100
                  ? "#34d399"
                  : "#374151",
            }}
          >
            {project.fundingProgressPercentage ?? 0}%
          </span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
          <div
            className="h-1.5 rounded-full"
            style={{
              width: `${Math.min(project.fundingProgressPercentage ?? 0, 100)}%`,
              backgroundColor: getProgressColor(
                project.fundingProgressPercentage ?? 0,
              ),
            }}
          />
        </div>

        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>Target: EGP {formatAmount(project.targetAmount)}</span>
          {/* projectStatus مش status */}
          <span style={getStatusStyle(project.projectStatus)}>
            {getStatusLabel(project.projectStatus)}
          </span>
        </div>
      </div>
    </div>
  );
}
