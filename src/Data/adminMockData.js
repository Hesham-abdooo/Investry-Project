/* ══════════════════════════════════════════════════════
   Admin Panel — Centralized Mock Data
   Replace with API calls when backend is ready
   ══════════════════════════════════════════════════════ */

/* ── Dashboard Stats ── */
export const dashboardStats = {
  totalUsers: 847,
  totalFounders: 312,
  totalInvestors: 535,
  pendingProjects: 8,
  publishedProjects: 45,
  totalRaised: 2450000,
  openTickets: 12,
  escrowBalance: 890000,
};

/* ── Pending Projects ── */
export const pendingProjects = [
  {
    id: "p1",
    title: "Smart Agriculture Platform",
    founderName: "Ahmed Hassan",
    founderEmail: "ahmed@example.com",
    fundingModel: "Equity",
    targetAmount: 500000,
    category: "Technology",
    shortDescription: "AI-powered precision agriculture platform for Egyptian farmers.",
    longDescription: "Our platform uses satellite imagery and IoT sensors to help farmers optimize irrigation, detect crop diseases early, and improve yields by up to 40%.",
    coverImageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400",
    location: "Cairo, Egypt",
    minimumContribution: 500,
    campaignDurationInDays: 60,
    createdAt: "2026-04-25T10:30:00Z",
    projectStatus: "PendingReview",
    equityPercentage: 15,
  },
  {
    id: "p2",
    title: "EcoPackaging Solutions",
    founderName: "Sara Mohamed",
    founderEmail: "sara@example.com",
    fundingModel: "Mudarabah",
    targetAmount: 250000,
    category: "Sustainability",
    shortDescription: "Biodegradable packaging made from agricultural waste.",
    longDescription: "We transform rice straw and sugarcane waste into premium biodegradable packaging, reducing plastic use while creating value from agricultural byproducts.",
    coverImageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=400",
    location: "Alexandria, Egypt",
    minimumContribution: 1000,
    campaignDurationInDays: 90,
    createdAt: "2026-04-26T14:00:00Z",
    projectStatus: "PendingReview",
    investorsProfitSharePercentage: 30,
  },
  {
    id: "p3",
    title: "FinLit — Financial Literacy App",
    founderName: "Omar Khaled",
    founderEmail: "omar@example.com",
    fundingModel: "Reward",
    targetAmount: 100000,
    category: "Education",
    shortDescription: "Gamified financial literacy app for Arab youth.",
    longDescription: "FinLit teaches financial skills through interactive games, challenges, and real-world simulations. Available in Arabic and English with culturally relevant content.",
    coverImageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
    location: "Dubai, UAE",
    minimumContribution: 200,
    campaignDurationInDays: 45,
    createdAt: "2026-04-27T09:15:00Z",
    projectStatus: "PendingReview",
  },
  {
    id: "p4",
    title: "CloudKitchen Network",
    founderName: "Fatima Ali",
    founderEmail: "fatima@example.com",
    fundingModel: "Equity",
    targetAmount: 800000,
    category: "Food & Beverage",
    shortDescription: "Network of shared cloud kitchens for food entrepreneurs.",
    longDescription: "We provide fully equipped kitchen spaces, delivery logistics, and marketing support to food entrepreneurs, enabling them to launch brands with minimal upfront investment.",
    coverImageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    location: "Cairo, Egypt",
    minimumContribution: 2000,
    campaignDurationInDays: 75,
    createdAt: "2026-04-27T16:45:00Z",
    projectStatus: "PendingReview",
    equityPercentage: 20,
  },
  {
    id: "p5",
    title: "MedConnect Telemedicine",
    founderName: "Dr. Youssef Ibrahim",
    founderEmail: "youssef@example.com",
    fundingModel: "Mudarabah",
    targetAmount: 350000,
    category: "Healthcare",
    shortDescription: "Telemedicine platform connecting rural patients with specialists.",
    longDescription: "MedConnect bridges the healthcare gap by connecting patients in rural and underserved areas with specialist doctors through video consultations and AI-powered triage.",
    coverImageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400",
    location: "Luxor, Egypt",
    minimumContribution: 500,
    campaignDurationInDays: 60,
    createdAt: "2026-04-28T08:00:00Z",
    projectStatus: "PendingReview",
    investorsProfitSharePercentage: 25,
  },
  {
    id: "p6",
    title: "Solar Charging Stations",
    founderName: "Kareem Nasser",
    founderEmail: "kareem@example.com",
    fundingModel: "Equity",
    targetAmount: 600000,
    category: "Energy",
    shortDescription: "Solar-powered EV charging stations across Egyptian highways.",
    longDescription: "We're building a network of solar-powered electric vehicle charging stations along major Egyptian highways, supporting the green energy transition.",
    coverImageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400",
    location: "Cairo, Egypt",
    minimumContribution: 1500,
    campaignDurationInDays: 120,
    createdAt: "2026-04-28T11:30:00Z",
    projectStatus: "PendingReview",
    equityPercentage: 12,
  },
];

/* ── All Users ── */
export const allUsers = [
  { id: "u1", firstName: "Ahmed", lastName: "Hassan", email: "ahmed@example.com", role: "Founder", status: "Active", kycStatus: "Verified", createdAt: "2025-12-01T10:00:00Z", projectCount: 3, totalRaised: 450000 },
  { id: "u2", firstName: "Sara", lastName: "Mohamed", email: "sara@example.com", role: "Founder", status: "Active", kycStatus: "Verified", createdAt: "2026-01-15T08:30:00Z", projectCount: 2, totalRaised: 180000 },
  { id: "u3", firstName: "Mohamed", lastName: "Ali", email: "mohamed@example.com", role: "Investor", status: "Active", kycStatus: "Verified", createdAt: "2026-01-20T14:00:00Z", investmentCount: 5, totalInvested: 25000 },
  { id: "u4", firstName: "Nour", lastName: "Ibrahim", email: "nour@example.com", role: "Investor", status: "Active", kycStatus: "Pending", createdAt: "2026-02-10T09:00:00Z", investmentCount: 2, totalInvested: 8000 },
  { id: "u5", firstName: "Khaled", lastName: "Youssef", email: "khaled@example.com", role: "Founder", status: "Banned", kycStatus: "Verified", createdAt: "2026-01-05T11:00:00Z", projectCount: 1, totalRaised: 0, banReason: "Fraudulent project description", banExpiry: "2026-05-15T00:00:00Z" },
  { id: "u6", firstName: "Layla", lastName: "Adel", email: "layla@example.com", role: "Investor", status: "Active", kycStatus: "Verified", createdAt: "2026-03-01T16:00:00Z", investmentCount: 8, totalInvested: 52000 },
  { id: "u7", firstName: "Omar", lastName: "Khaled", email: "omar@example.com", role: "Founder", status: "Active", kycStatus: "Verified", createdAt: "2026-02-20T13:00:00Z", projectCount: 4, totalRaised: 320000 },
  { id: "u8", firstName: "Dina", lastName: "Fathy", email: "dina@example.com", role: "Investor", status: "Banned", kycStatus: "Verified", createdAt: "2026-01-28T10:00:00Z", investmentCount: 0, totalInvested: 0, banReason: "Suspicious activity", banExpiry: "2026-06-01T00:00:00Z" },
  { id: "u9", firstName: "Youssef", lastName: "Tarek", email: "youssef@example.com", role: "Investor", status: "Active", kycStatus: "Not Started", createdAt: "2026-04-10T12:00:00Z", investmentCount: 1, totalInvested: 3000 },
  { id: "u10", firstName: "Fatima", lastName: "Ali", email: "fatima@example.com", role: "Founder", status: "Active", kycStatus: "Verified", createdAt: "2026-03-15T09:30:00Z", projectCount: 1, totalRaised: 95000 },
];

/* ── Support Tickets ── */
export const supportTickets = [
  { id: "t1", userName: "Mohamed Ali", userEmail: "mohamed@example.com", userRole: "Investor", category: "Payment", subject: "Can't withdraw funds from wallet", message: "I've been trying to withdraw my funds for 3 days but the button doesn't work. I need this resolved urgently. My balance shows EGP 15,000.", createdAt: "2026-04-28T09:00:00Z", status: "Open" },
  { id: "t2", userName: "Ahmed Hassan", userEmail: "ahmed@example.com", userRole: "Founder", category: "Project", subject: "Project approval taking too long", message: "I submitted my project 2 weeks ago and it's still pending review. When can I expect a decision? I need to launch my campaign before the end of the month.", createdAt: "2026-04-27T14:30:00Z", status: "Open" },
  { id: "t3", userName: "Nour Ibrahim", userEmail: "nour@example.com", userRole: "Investor", category: "Account", subject: "KYC verification failed incorrectly", message: "My KYC was rejected but all my documents are valid. I've uploaded clear copies of my national ID. Please review my case again.", createdAt: "2026-04-26T11:00:00Z", status: "Open" },
  { id: "t4", userName: "Sara Mohamed", userEmail: "sara@example.com", userRole: "Founder", category: "Project", subject: "How to change my funding model?", message: "Is it possible to change my project from Reward to Equity model after publishing? I realized Equity is better for my startup.", createdAt: "2026-04-25T16:00:00Z", status: "Resolved" },
  { id: "t5", userName: "Layla Adel", userEmail: "layla@example.com", userRole: "Investor", category: "Payment", subject: "Payment failed during investment", message: "I tried to invest EGP 5,000 in a project but the payment failed and my wallet was still charged. Please refund or fix this.", createdAt: "2026-04-28T15:00:00Z", status: "Open" },
  { id: "t6", userName: "Youssef Tarek", userEmail: "youssef@example.com", userRole: "Investor", category: "Account", subject: "Request to delete my account", message: "I'd like to permanently delete my account and all associated data. Please let me know the process.", createdAt: "2026-04-28T10:00:00Z", status: "Open" },
  { id: "t7", userName: "Omar Khaled", userEmail: "omar@example.com", userRole: "Founder", category: "Technical", subject: "Can't upload project media files", message: "When I try to upload images or documents to my project, the upload fails with no error message. I've tried different browsers.", createdAt: "2026-04-24T08:30:00Z", status: "Resolved" },
  { id: "t8", userName: "Fatima Ali", userEmail: "fatima@example.com", userRole: "Investor", category: "Other", subject: "How do profit shares work?", message: "I invested in a Mudarabah project but I'm not sure how and when I'll receive my profit share. Can you explain the process?", createdAt: "2026-04-23T12:00:00Z", status: "Resolved" },
];

/* ── Escrow Projects (Completed, awaiting fund release) ── */
export const escrowProjects = [
  { id: "e1", title: "Urban Farming Initiative", founderName: "Ahmed Hassan", founderEmail: "ahmed@example.com", targetAmount: 200000, currentAmount: 200000, numberOfInvestors: 42, fundingProgressPercentage: 100, completedAt: "2026-04-20T00:00:00Z", escrowAmount: 200000, projectStatus: "Completed" },
  { id: "e2", title: "Arabic E-Learning Platform", founderName: "Sara Mohamed", founderEmail: "sara@example.com", targetAmount: 150000, currentAmount: 150000, numberOfInvestors: 28, fundingProgressPercentage: 100, completedAt: "2026-04-22T00:00:00Z", escrowAmount: 150000, projectStatus: "Completed" },
  { id: "e3", title: "Recycling Tech Startup", founderName: "Omar Khaled", founderEmail: "omar@example.com", targetAmount: 300000, currentAmount: 315000, numberOfInvestors: 67, fundingProgressPercentage: 105, completedAt: "2026-04-25T00:00:00Z", escrowAmount: 315000, projectStatus: "Completed" },
];

/* ── Admin Accounts ── */
export const adminAccounts = [
  { id: "a1", firstName: "Super", lastName: "Admin", email: "admin@investry.com", createdAt: "2025-01-01T00:00:00Z", lastLogin: "2026-04-28T08:00:00Z" },
  { id: "a2", firstName: "Hesham", lastName: "Abdoo", email: "hesham@investry.com", createdAt: "2025-06-15T00:00:00Z", lastLogin: "2026-04-27T22:00:00Z" },
];

