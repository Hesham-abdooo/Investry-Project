// ── Project API Service ──
// يجلب البيانات من الـ API ويحولها للشكل اللي الكومبوننتات بتفهمه
import axios from "axios";

const API = "https://investry.runasp.net/api";

// ══════════════════════════════════════════════════════
// ══  MOCK DATA — Remove when backend is fully ready ══
// ══════════════════════════════════════════════════════
// Set to false to disable mock data and use API only
const ENABLE_MOCKS = true;

const MOCK_PROJECTS = [
  {
    id: "mock-equity-001",
    title: "SolarGrid Egypt",
    shortDescription: "Bringing affordable solar energy solutions to Egyptian households and businesses.",
    longDescription: "SolarGrid Egypt is a clean energy startup focused on making solar power accessible and affordable across Egypt. We design, manufacture, and install residential and commercial solar panel systems. Our mission is to reduce energy costs by up to 60% for our customers while contributing to Egypt's renewable energy goals. With partnerships already established with 3 major distributors in Cairo and Alexandria, we are now seeking equity investment to scale our manufacturing capacity and expand to Upper Egypt. Our team of 15 engineers and business professionals has already completed 200+ successful installations.",
    fundingModel: "Equity",
    targetAmount: 2000000,
    currentAmount: 850000,
    coverImageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
    category: "Technology",
    founderName: "Ahmed Hassan",
    daysLeft: 45,
    backers: 32,
    fundingProgressPercentage: 42,
    minContribution: 5000,
    duration: "60 days",
    location: "Cairo, Egypt",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    documents: ["Business_Plan.pdf", "Financial_Projections.pdf"],
    equityOffered: 20,
    investorProfitShare: null,
    contractDuration: null,
    payoutFrequency: null,
    rewardTiersDetails: [],
  },
  {
    id: "mock-reward-002",
    title: "Koshk Smart Café",
    shortDescription: "Egypt's first fully automated smart café experience — order, pay, and pick up without waiting.",
    longDescription: "Koshk is reinventing the café experience in Egypt. We're building a network of fully automated smart cafés where customers can order premium coffee and snacks through our app or in-store kiosks, pay digitally, and receive their order from a robotic barista in under 90 seconds — no queues, no waiting. Our first pilot location in New Cairo served 3,000+ customers in its first month with a 4.8/5 rating. We're now crowdfunding to open 5 new locations across Cairo and Giza. Backers get exclusive early access, free drinks, and lifetime membership perks.",
    fundingModel: "Reward",
    targetAmount: 500000,
    currentAmount: 320000,
    coverImageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
    category: "Food",
    founderName: "Sara El-Mofty",
    daysLeft: 21,
    backers: 187,
    fundingProgressPercentage: 64,
    minContribution: 100,
    duration: "30 days",
    location: "New Cairo, Egypt",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    documents: ["Pitch_Deck.pdf"],
    equityOffered: null,
    investorProfitShare: null,
    contractDuration: null,
    payoutFrequency: null,
    rewardTiersDetails: [
      {
        title: "Early Bird Coffee",
        description: "Get 10 free premium drinks at any Koshk location.",
        amount: 200,
        maxBackers: 100,
        currentBackers: 67,
        remainingSlots: 33,
      },
      {
        title: "Koshk VIP Member",
        description: "Lifetime 20% discount + exclusive merch box + your name on the founders wall.",
        amount: 1000,
        maxBackers: 50,
        currentBackers: 38,
        remainingSlots: 12,
      },
      {
        title: "Grand Opener",
        description: "Private café tour, naming rights for a drink, 50 free drinks, and a VIP launch party invite.",
        amount: 5000,
        maxBackers: 10,
        currentBackers: 10,
        remainingSlots: 0,
      },
    ],
  },
  {
    id: "mock-mudarabah-003",
    title: "NileCraft Furniture",
    shortDescription: "Handcrafted Egyptian furniture exported to the Gulf — blending heritage with modern design.",
    longDescription: "NileCraft is a premium furniture brand that combines traditional Egyptian woodworking craftsmanship with contemporary Scandinavian design. We source sustainable wood from local farms and employ skilled artisans from Damietta — Egypt's furniture capital. Our products are already sold in 12 showrooms across the UAE and Saudi Arabia with an average 40% profit margin. This Mudarabah investment will fund a new 2,000 sqm workshop and an e-commerce platform targeting the GCC market. Investors will receive quarterly profit distributions based on actual sales revenue. Our projected annual revenue for 2027 is EGP 8M.",
    fundingModel: "Mudarabah",
    targetAmount: 1500000,
    currentAmount: 600000,
    coverImageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    category: "Business",
    founderName: "Omar Damietta",
    daysLeft: 58,
    backers: 19,
    fundingProgressPercentage: 40,
    minContribution: 10000,
    duration: "90 days",
    location: "Damietta, Egypt",
    videoUrl: null,
    documents: ["Business_Plan.pdf", "Financial_Model.pdf", "Market_Research.pdf"],
    equityOffered: null,
    investorProfitShare: 60,
    contractDuration: 24,
    payoutFrequency: "Quarterly",
    rewardTiersDetails: [],
  },
];

// ══════════════════════════════════════════════════════

// ── Mapping: API → Frontend (All Projects / Dashboard) ──
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
    daysLeft: p.daysLeft ?? null,
    percentage: p.fundingProgressPercentage ?? 0,
  };
}

// ── Mapping: API → Frontend (Project Details) ──
function mapProjectDetails(p) {
  return {
    id: p.id,
    title: p.title || "Untitled Project",
    description: p.longDescription || p.shortDescription || "",
    fundingType: p.fundingModel || "Reward",
    target: p.targetAmount || 0,
    raised: p.currentAmount || 0,
    image: p.coverImageUrl || "",
    images: p.coverImageUrl ? [p.coverImageUrl] : [],
    category: p.category || "General",
    founderName: p.founderName || "",
    daysLeft: p.daysLeft ?? null,
    backers: p.backers ?? null,
    minContribution: p.minContribution ?? null,
    duration: p.duration || null,
    percentage: p.fundingProgressPercentage ?? 0,
    documents: p.documents || [],
    location: p.location || null,
    videoUrl: p.videoUrl || null,
    // Equity-Based
    equityOffered: p.equityOffered || null,
    // Mudarabah
    investorProfitShare: p.investorProfitShare || null,
    contractDuration: p.contractDuration || null,
    payoutFrequency: p.payoutFrequency || null,
    // Reward Tiers
    rewardTiers: (p.rewardTiersDetails || []).map((t) => ({
      gift: t.title || t.gift || "Reward",
      description: t.description || "",
      amount: t.amount || 0,
      quantity: t.maxBackers || t.quantity || 0,
      claimed: t.currentBackers || t.claimed || 0,
      remaining: t.remainingSlots ?? null,
    })),
  };
}

// ── API Functions ──

export async function getProjects() {
  try {
    const res = await axios.get(`${API}/Projects/all-projects`);
    let apiProjects = [];
    if (res.data?.success && Array.isArray(res.data.data)) {
      apiProjects = res.data.data.map(mapProjectCard);
    }

    // Merge with mock data (mock comes first for visibility)
    if (ENABLE_MOCKS) {
      const mockCards = MOCK_PROJECTS.map(mapProjectCard);
      return [...mockCards, ...apiProjects];
    }

    return apiProjects;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    // Fallback: show mocks even if API fails
    if (ENABLE_MOCKS) {
      return MOCK_PROJECTS.map(mapProjectCard);
    }
    return [];
  }
}

export async function getProjectById(id) {
  // Check if it's a mock project first
  if (ENABLE_MOCKS && id?.startsWith("mock-")) {
    const mockProject = MOCK_PROJECTS.find((p) => p.id === id);
    if (mockProject) return mapProjectDetails(mockProject);
  }

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
