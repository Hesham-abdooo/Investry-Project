// ── Project API Service ──
// Fetches data from the API and maps it to the format the components expect
import axios from "axios";

const API = "https://investry.runasp.net/api";

// ── Mapping: API → Frontend (All Projects / Dashboard Cards) ──
function mapProjectCard(p) {
  return {
    id: p.id,
    title: p.title || "Untitled Project",
    description: p.shortDescription || "",
    fundingType: p.fundingModel || "Reward",
    target: p.targetAmount || 0,
    raised: p.currentAmount || 0,
    image: p.coverImageUrl || "",
    category: p.category || "General",
    founderName: p.founderName || "",
    daysLeft: p.daysRemaining ?? p.daysLeft ?? null,
    percentage: Math.min(p.fundingProgressPercentage ?? 0, 100),
    status: p.projectStatus || null,
  };
}

// ── Mapping: API → Frontend (Project Details) ──
function mapProjectDetails(p) {
  // Extract images from mediaGallery array
  const galleryImages = (p.mediaGallery || [])
    .filter((m) => m.type === "Image")
    .map((m) => m.url);
  const firstImage = galleryImages[0] || "";

  // Extract documents from mediaDocument array
  const docs = (p.mediaDocument || []).map((d) => ({
    url: d.url,
    name: d.url?.split("/").pop() || "Document",
    type: d.type,
  }));

  return {
    id: p.id,
    title: p.title || "Untitled Project",
    description: p.longDescription || p.shortDescription || "",
    fundingType: p.fundingModel || "Reward",
    target: p.targetAmount || 0,
    raised: p.currentAmount || 0,
    image: firstImage,
    images: galleryImages.length > 0 ? galleryImages : firstImage ? [firstImage] : [],
    category: p.category || "General",
    founderName: p.founderName || "",
    daysLeft: p.daysRemaining ?? null,
    backers: p.numberOfInvestors ?? null,
    minContribution: p.minimumContribution ?? null,
    duration: p.campaignDurationInDays ? `${p.campaignDurationInDays} days` : null,
    percentage: Math.min(p.fundingProgressPercentage ?? 0, 100),
    documents: docs,
    location: p.location || null,
    videoUrl: p.promotionalVideoURL || null,
    status: p.projectStatus || null,
    // Equity-Based
    equityOffered: p.equityDetails?.equityPercentageOffered || null,
    // Mudarabah
    investorProfitShare: p.mudarabahDetails?.investorsProfitSharePercentage || null,
    contractDuration: p.mudarabahDetails?.contractDurationInMonths || null,
    payoutFrequency: p.mudarabahDetails?.profitDistributionFrequency || null,
    // Reward Tiers
    rewardTiers: (p.rewardTiers || []).map((t) => ({
      id: t.id || null,
      gift: t.title || "Reward",
      description: t.description || "",
      amount: t.amount || 0,
      quantity: t.maxBackers || 0,
      claimed: t.currentBackers || 0,
      remaining: t.remainingBackers ?? null,
    })),
  };
}

// ── API Functions ──

export async function getProjects() {
  try {
    const res = await axios.get(`${API}/Projects/all-projects`);
    if (res.data?.success && Array.isArray(res.data.data)) {
      return res.data.data.map(mapProjectCard);
    }
    return [];
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    return [];
  }
}

export async function getProjectById(id) {
  try {
    const res = await axios.get(`${API}/Projects/${id}/details`);
    if (res.data?.success && res.data.data) {
      return mapProjectDetails(res.data.data);
    }
    return null;
  } catch (err) {
    console.error("Failed to fetch project details:", err);
    return null;
  }
}

export async function investInProject({ projectId, amount, rewardTierId }) {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API}/Investments/create-investment`,
    { projectId, amount: Number(amount), rewardTierId: rewardTierId || null },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}
