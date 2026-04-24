/**
 * ══════════════════════════════════════════════════════════
 * ══  InvesTry AI Project Advisor — Scoring Engine v2     ══
 * ══════════════════════════════════════════════════════════
 *
 * A weighted rule-based scoring algorithm that analyzes 9 key
 * dimensions of a crowdfunding project to predict success and
 * generate personalized improvement roadmaps.
 *
 * v2: Uses enriched data from /Projects/{id}/details for
 *     real media counts, deal structure, documents, and more.
 *
 * Algorithm: totalScore = Σ (weight_i × dimensionScore_i)
 * Each dimension scored 0-100, final score normalized to 0-100.
 */

/* ── Dimension Weights (must sum to 1.0) ── */
const WEIGHTS = {
  targetReasonableness: 0.12,
  descriptionQuality: 0.12,
  mediaCompleteness: 0.10,
  fundingProgress: 0.15,
  duration: 0.08,
  dealStructure: 0.15,
  documents: 0.08,
  categoryFit: 0.08,
  investorTraction: 0.12,
};

/* ── Category Benchmarks (avg target in EGP) ── */
const CATEGORY_BENCHMARKS = {
  Technology: 1500000,
  Food: 400000,
  Business: 1000000,
  Health: 800000,
  Education: 500000,
  Art: 300000,
  Gaming: 600000,
  Fashion: 500000,
  default: 700000,
};

/* ═══════════════════════════════════════════════════════ */
/* ══  DIMENSION SCORERS                                ══ */
/* ═══════════════════════════════════════════════════════ */

function scoreTargetReasonableness(target) {
  const t = Number(target) || 0;
  if (t <= 0) return 0;
  if (t <= 100000) return 92;
  if (t <= 300000) return 85;
  if (t <= 500000) return 78;
  if (t <= 1000000) return 62;
  if (t <= 2000000) return 45;
  return 28;
}

function scoreDescriptionQuality(project) {
  // Use longDescription (from details) if available, fallback to short
  const desc = (project.longDescription || project.shortDescription || "").trim();
  const len = desc.length;
  let score = 0;

  // Length scoring
  if (len >= 400) score += 40;
  else if (len >= 200) score += 30;
  else if (len >= 100) score += 20;
  else if (len >= 50) score += 10;
  else score += 5;

  // Keyword analysis — presence of professional terms
  const keywords = [
    "team", "market", "revenue", "plan", "growth",
    "strategy", "customers", "profit", "invest", "solution",
    "innovation", "sustainable", "partnership", "experience", "goal",
  ];
  const lowerDesc = desc.toLowerCase();
  let keywordHits = 0;
  keywords.forEach((kw) => {
    if (lowerDesc.includes(kw)) keywordHits++;
  });
  score += Math.min(keywordHits * 10, 60);

  return Math.min(score, 100);
}

function scoreMediaCompleteness(project) {
  const images = (project.mediaGallery || []).filter((m) => m.type === "Image");
  const hasVideo = !!project.promotionalVideoURL;

  // Fallback: if no mediaGallery data, check coverImageUrl
  if (images.length === 0 && !project.coverImageUrl) return 15;

  let score = 0;
  const imgCount = images.length || (project.coverImageUrl ? 1 : 0);

  if (imgCount === 1) score += 40;
  else if (imgCount === 2) score += 55;
  else if (imgCount <= 4) score += 70;
  else score += 80;

  if (hasVideo) score += 20;

  return Math.min(score, 100);
}

function scoreFundingProgress(percentage) {
  const p = Number(percentage) || 0;
  if (p >= 100) return 100;
  if (p >= 75) return 88;
  if (p >= 50) return 75;
  if (p >= 25) return 58;
  if (p >= 10) return 40;
  if (p > 0) return 25;
  return 10;
}

function scoreDuration(project) {
  // Use real campaignDurationInDays from details if available
  const days = project.campaignDurationInDays || project.daysRemaining;
  if (!days) return 60;

  if (days >= 20 && days <= 45) return 92;
  if (days >= 15 && days <= 60) return 80;
  if (days >= 10 && days <= 90) return 65;
  return 45;
}

function scoreDealStructure(project) {
  const model = project.fundingModel;

  if (model === "Reward") {
    const tiers = project.rewardTiers || [];
    if (tiers.length === 0) return 30;
    let score = 40;
    // Tier count bonus
    if (tiers.length === 1) score += 10;
    else if (tiers.length === 2) score += 25;
    else if (tiers.length <= 4) score += 40;
    else score += 52;

    // Price variety bonus (check if tiers cover different price ranges)
    if (tiers.length >= 2) {
      const amounts = tiers.map((t) => Number(t.amount) || 0).sort((a, b) => a - b);
      const range = amounts[amounts.length - 1] - amounts[0];
      if (range > 500) score += 8;
    }

    return Math.min(score, 100);
  }

  if (model === "Equity") {
    const eq = project.equityDetails?.equityPercentageOffered;
    if (!eq) return 35;
    if (eq >= 5 && eq <= 30) return 88;
    if (eq >= 3 && eq <= 50) return 70;
    return 50;
  }

  if (model === "Mudarabah") {
    const md = project.mudarabahDetails;
    if (!md) return 35;
    let score = 50;
    const share = md.investorsProfitSharePercentage;
    if (share >= 30 && share <= 70) score += 18;
    else if (share > 0) score += 8;

    const months = md.contractDurationInMonths;
    if (months >= 6 && months <= 24) score += 18;
    else if (months > 0) score += 8;

    if (md.profitDistributionFrequency) score += 14;

    return Math.min(score, 100);
  }

  return 40;
}

function scoreDocuments(project) {
  // Use real mediaDocument from details if available
  const docs = project.mediaDocument || [];
  if (docs.length >= 3) return 95;
  if (docs.length === 2) return 80;
  if (docs.length === 1) return 60;

  // Fallback: check coverImageUrl as basic media indicator
  if (project.coverImageUrl) return 30;
  return 15;
}

function scoreCategoryFit(category, targetAmount) {
  const benchmark = CATEGORY_BENCHMARKS[category] || CATEGORY_BENCHMARKS.default;
  const target = Number(targetAmount) || 0;
  const ratio = target / benchmark;

  if (ratio >= 0.5 && ratio <= 1.5) return 88;
  if (ratio >= 0.3 && ratio <= 2.0) return 65;
  if (ratio >= 0.1 && ratio <= 3.0) return 45;
  return 25;
}

function scoreInvestorTraction(project) {
  const investors = project.numberOfInvestors || 0;
  const progress = project.fundingProgressPercentage || 0;

  if (investors === 0 && progress === 0) return 8;
  if (investors === 0) return 15;

  // Score based on investor count + progress combo
  let score = 20;
  if (investors >= 1) score += 15;
  if (investors >= 3) score += 15;
  if (investors >= 5) score += 15;
  if (investors >= 10) score += 15;
  if (progress >= 50) score += 10;
  if (progress >= 75) score += 10;

  return Math.min(score, 100);
}

/* ═══════════════════════════════════════════════════════ */
/* ══  INSIGHTS GENERATOR                               ══ */
/* ═══════════════════════════════════════════════════════ */

function generateStrengths(scores, project) {
  const strengths = [];

  if (scores.descriptionQuality >= 70) {
    const descLen = (project.longDescription || project.shortDescription || "").length;
    strengths.push({
      text: "Strong, detailed project description",
      detail: `Your description is ${descLen}+ characters with professional terminology that builds investor confidence.`,
    });
  }

  if (scores.mediaCompleteness >= 70) {
    const imgCount = (project.mediaGallery || []).filter((m) => m.type === "Image").length || (project.coverImageUrl ? 1 : 0);
    const hasVideo = !!project.promotionalVideoURL;
    strengths.push({
      text: `${imgCount} project image${imgCount !== 1 ? "s" : ""}${hasVideo ? " + promotional video" : ""}`,
      detail: hasVideo
        ? "Video projects receive 85% more investor attention and funding."
        : "Projects with quality images receive 3x more investor attention.",
    });
  }

  if (scores.fundingProgress >= 70)
    strengths.push({
      text: "Strong funding momentum",
      detail: `You've already reached ${project.fundingProgressPercentage || 0}% of your goal — great social proof for new investors.`,
    });

  if (scores.investorTraction >= 60) {
    const count = project.numberOfInvestors || 0;
    strengths.push({
      text: `${count} investor${count !== 1 ? "s" : ""} have backed your project`,
      detail: "Each new investor adds social proof, accelerating future contributions.",
    });
  }

  if (scores.dealStructure >= 70) {
    const model = project.fundingModel;
    if (model === "Reward") {
      const tierCount = (project.rewardTiers || []).length;
      strengths.push({
        text: `${tierCount} reward tier${tierCount !== 1 ? "s" : ""} covering diverse price points`,
        detail: "Multiple tiers attract different backer levels and maximize total contributions.",
      });
    } else if (model === "Equity") {
      const eq = project.equityDetails?.equityPercentageOffered;
      strengths.push({
        text: `Competitive equity offering at ${eq || 0}%`,
        detail: "Your equity percentage is within the attractive range for investors.",
      });
    } else if (model === "Mudarabah") {
      const share = project.mudarabahDetails?.investorsProfitSharePercentage;
      strengths.push({
        text: `Fair profit share at ${share || 0}% for investors`,
        detail: "Your Mudarabah terms are well-structured and competitive.",
      });
    }
  }

  if (scores.targetReasonableness >= 70)
    strengths.push({
      text: "Realistic funding target",
      detail: "Your target amount is achievable based on similar successful projects.",
    });

  if (scores.categoryFit >= 70)
    strengths.push({
      text: "Well-positioned in category",
      detail: `Your target aligns well with typical ${project.category || "General"} projects.`,
    });

  if (scores.documents >= 70) {
    const docCount = (project.mediaDocument || []).length;
    strengths.push({
      text: `${docCount} supporting document${docCount !== 1 ? "s" : ""} uploaded`,
      detail: "Business documents significantly increase investor trust and conversion rates by 60%.",
    });
  }

  // Ensure at least 1 strength
  if (strengths.length === 0) {
    strengths.push({
      text: "Project is live on InvesTry",
      detail: "You've taken the first step — your project is visible to investors.",
    });
  }

  return strengths.slice(0, 4);
}

function generateImprovements(scores, project) {
  const improvements = [];

  if (scores.mediaCompleteness < 50) {
    const imgCount = (project.mediaGallery || []).filter((m) => m.type === "Image").length || (project.coverImageUrl ? 1 : 0);
    const hasVideo = !!project.promotionalVideoURL;
    improvements.push({
      text: imgCount === 0 ? "Add project images" : hasVideo ? "Add more gallery images" : "Add a promotional video",
      detail: imgCount === 0
        ? "Projects with images get 3x more attention from investors."
        : "A 2-3 minute video can increase funding success by 85%.",
      impact: "HIGH",
    });
  }

  if (scores.descriptionQuality < 50) {
    const descLen = (project.longDescription || project.shortDescription || "").length;
    improvements.push({
      text: `Improve your project description (currently ${descLen} characters)`,
      detail: "Add details about your team, market opportunity, and revenue model. Aim for 300+ characters with professional terms.",
      impact: "HIGH",
    });
  }

  if (scores.documents < 50) {
    const docCount = (project.mediaDocument || []).length;
    improvements.push({
      text: docCount === 0 ? "Upload a business plan or pitch deck" : "Upload additional supporting documents",
      detail: "Documents build credibility — investors are 60% more likely to fund documented projects.",
      impact: "HIGH",
    });
  }

  if (scores.investorTraction < 40) {
    const count = project.numberOfInvestors || 0;
    improvements.push({
      text: count === 0 ? "Get your first investor" : "Attract more investors to build momentum",
      detail: count === 0
        ? "The first investor is the hardest — reach out to your personal network first."
        : "Share your project on social media and leverage your existing backers as social proof.",
      impact: "HIGH",
    });
  }

  if (scores.dealStructure < 60) {
    const model = project.fundingModel;
    if (model === "Reward") {
      const tierCount = (project.rewardTiers || []).length;
      improvements.push({
        text: tierCount === 0 ? "Add reward tiers" : `Add more reward tiers (currently ${tierCount})`,
        detail: "Create 3-5 reward tiers at different price points (EGP 100 to EGP 5,000+) to attract diverse backers.",
        impact: "MEDIUM",
      });
    } else if (model === "Equity") {
      improvements.push({
        text: "Refine your equity offering",
        detail: "Clearly communicate your company valuation. Equity between 5-30% is most attractive to investors.",
        impact: "MEDIUM",
      });
    } else if (model === "Mudarabah") {
      improvements.push({
        text: "Optimize your Mudarabah terms",
        detail: "Investor profit share of 30-70% with quarterly/semi-annual payouts is most competitive.",
        impact: "MEDIUM",
      });
    }
  }

  if (scores.targetReasonableness < 50)
    improvements.push({
      text: "Consider adjusting your funding target",
      detail: `Your target of EGP ${(Number(project.targetAmount) || 0).toLocaleString()} is above average. Projects with lower targets have higher success rates.`,
      impact: "MEDIUM",
    });

  if (scores.fundingProgress < 40)
    improvements.push({
      text: "Boost your campaign promotion",
      detail: "Share your project on social media, reach out to your network, and consider email outreach.",
      impact: "MEDIUM",
    });

  if (scores.duration < 50) {
    const days = project.campaignDurationInDays || project.daysRemaining;
    improvements.push({
      text: days > 60 ? "Consider a shorter campaign duration" : "Your campaign timeline needs attention",
      detail: "Campaigns of 30-45 days perform best — urgency drives action. Very long campaigns lose momentum.",
      impact: "MEDIUM",
    });
  }

  if (scores.categoryFit < 50)
    improvements.push({
      text: "Align target with category benchmarks",
      detail: `Typical ${project.category || "General"} projects target around EGP ${(CATEGORY_BENCHMARKS[project.category] || CATEGORY_BENCHMARKS.default).toLocaleString()}.`,
      impact: "MEDIUM",
    });

  // Ensure at least 1 improvement
  if (improvements.length === 0) {
    improvements.push({
      text: "Keep your campaign active",
      detail: "Regular updates and engagement keep momentum going. Post weekly progress updates.",
      impact: "LOW",
    });
  }

  return improvements.slice(0, 4);
}

function generateRoadmap(scores, project) {
  const steps = [];
  const model = project.fundingModel || "Reward";

  // Priority-ordered suggestions based on lowest scores
  const scorePairs = Object.entries(scores).sort((a, b) => a[1] - b[1]);

  scorePairs.forEach(([dimension, score]) => {
    if (steps.length >= 5) return;

    if (dimension === "investorTraction" && score < 60) {
      const count = project.numberOfInvestors || 0;
      steps.push({
        title: count === 0 ? "Land Your First Investor" : "Build Investor Momentum",
        description: count === 0
          ? "Start with friends, family, and professional contacts. The first few investors create powerful social proof that attracts strangers."
          : `You have ${count} investor${count !== 1 ? "s" : ""} — share their success stories and testimonials to attract more.`,
      });
    }
    if (dimension === "mediaCompleteness" && score < 70) {
      const imgCount = (project.mediaGallery || []).filter((m) => m.type === "Image").length || (project.coverImageUrl ? 1 : 0);
      const hasVideo = !!project.promotionalVideoURL;
      steps.push({
        title: "Strengthen Your Visual Presence",
        description: imgCount <= 1
          ? "Upload 3-5 high-quality images showing your product, team, and workspace. Add a 2-3 minute video — video projects are 85% more likely to reach their goal."
          : hasVideo
            ? `You have ${imgCount} images. Consider adding more variety — behind-the-scenes, product close-ups, and team photos.`
            : `You have ${imgCount} images but no video. A 2-3 minute pitch video can boost funding by 85%.`,
      });
    }
    if (dimension === "descriptionQuality" && score < 70) {
      steps.push({
        title: "Craft a Compelling Story",
        description: "Write a compelling narrative about your project. Include your team's background, market opportunity, competitive advantage, and clear breakdown of how funds will be used.",
      });
    }
    if (dimension === "documents" && score < 70) {
      const docCount = (project.mediaDocument || []).length;
      steps.push({
        title: docCount === 0 ? "Upload Key Documents" : "Add More Supporting Documents",
        description: docCount === 0
          ? "Add a business plan, financial projections, or pitch deck. Documented projects see 60% higher conversion rates."
          : `You have ${docCount} document${docCount !== 1 ? "s" : ""}. Consider adding financial projections, market research, or team credentials.`,
      });
    }
    if (dimension === "dealStructure" && score < 60) {
      if (model === "Reward") {
        const tierCount = (project.rewardTiers || []).length;
        steps.push({
          title: "Optimize Your Reward Tiers",
          description: tierCount === 0
            ? "Create 3-5 reward tiers ranging from EGP 100 to EGP 5,000+. Each tier should offer clear, tangible value."
            : `You have ${tierCount} tier${tierCount !== 1 ? "s" : ""}. Aim for 4-5 tiers with varied prices. Add an exclusive premium tier for serious backers.`,
        });
      } else if (model === "Equity") {
        steps.push({
          title: "Refine Your Equity Terms",
          description: "Clearly communicate your company valuation and the equity being offered. The 5-30% range is most attractive. Include a cap table summary.",
        });
      } else {
        steps.push({
          title: "Optimize Your Mudarabah Structure",
          description: "Detail your profit distribution schedule clearly. Quarterly or semi-annual payouts are most popular. Ensure contract duration is 12-24 months for best results.",
        });
      }
    }
    if (dimension === "fundingProgress" && score < 70) {
      steps.push({
        title: "Activate Campaign Promotion",
        description:
          model === "Equity"
            ? "Share on LinkedIn and professional networks. Equity investors respond best to data-driven pitches with clear ROI projections."
            : model === "Mudarabah"
              ? "Reach out to Islamic finance communities and business networks. Highlight your transparent profit-sharing terms."
              : "Launch a social media campaign. Create shareable content and consider early-bird discounts for first backers.",
      });
    }
    if (dimension === "targetReasonableness" && score < 60) {
      steps.push({
        title: "Optimize Your Funding Target",
        description: "Consider starting with a lower initial target. You can always create follow-up campaigns. Projects with achievable targets see 73% higher completion rates.",
      });
    }
    if (dimension === "categoryFit" && score < 60) {
      steps.push({
        title: "Benchmark Against Your Category",
        description: `Study successful ${project.category || "similar"} projects on the platform. Align your pricing, tiers, and messaging with what works in your category.`,
      });
    }
  });

  // Always add engagement step
  if (steps.length < 5) {
    steps.push({
      title: "Engage With Your Backers",
      description: "Post weekly project updates, respond to investor questions within 24 hours, and share milestones. Active founders see 40% more repeat investment.",
    });
  }

  return steps.slice(0, 5);
}

/* ═══════════════════════════════════════════════════════ */
/* ══  MAIN ANALYSIS FUNCTION                           ══ */
/* ═══════════════════════════════════════════════════════ */

/**
 * Analyzes a project and returns AI insights.
 *
 * @param {Object} project - Enriched project data (summary + details merged)
 * @returns {Object} Analysis result with score, strengths, improvements, roadmap
 */
export function analyzeProject(project) {
  if (!project) return null;

  /* ── Step 1: Score each dimension ── */
  const dimensionScores = {
    targetReasonableness: scoreTargetReasonableness(project.targetAmount),
    descriptionQuality: scoreDescriptionQuality(project),
    mediaCompleteness: scoreMediaCompleteness(project),
    fundingProgress: scoreFundingProgress(project.fundingProgressPercentage),
    duration: scoreDuration(project),
    dealStructure: scoreDealStructure(project),
    documents: scoreDocuments(project),
    categoryFit: scoreCategoryFit(project.category, project.targetAmount),
    investorTraction: scoreInvestorTraction(project),
  };

  /* ── Step 2: Calculate weighted total ── */
  let totalScore = 0;
  for (const [dim, weight] of Object.entries(WEIGHTS)) {
    totalScore += weight * (dimensionScores[dim] || 0);
  }
  totalScore = Math.round(totalScore);

  /* ── Step 3: Determine label and color ── */
  let label, color, message;
  if (totalScore >= 80) {
    label = "Excellent";
    color = "#059669";
    message = "Your project is well-positioned for success! Keep the momentum going.";
  } else if (totalScore >= 60) {
    label = "Good";
    color = "#D4A017";
    message = "Good foundation — a few targeted improvements can make it great.";
  } else if (totalScore >= 40) {
    label = "Fair";
    color = "#EA580C";
    message = "Needs work — follow the roadmap below to significantly boost your chances.";
  } else {
    label = "Needs Attention";
    color = "#DC2626";
    message = "Significant improvements needed. Start with the top high-impact suggestions.";
  }

  /* ── Step 4: Generate insights ── */
  const strengths = generateStrengths(dimensionScores, project);
  const improvements = generateImprovements(dimensionScores, project);
  const roadmap = generateRoadmap(dimensionScores, project);
  const smartSuggestions = generateSmartSuggestions(dimensionScores, project);

  return {
    score: totalScore,
    label,
    color,
    message,
    strengths,
    improvements,
    roadmap,
    smartSuggestions,
    dimensionScores,
  };
}

/* ═══════════════════════════════════════════════════════ */
/* ══  SMART SUGGESTIONS (Data-Driven)                  ══ */
/* ═══════════════════════════════════════════════════════ */

function generateSmartSuggestions(scores, project) {
  const suggestions = [];
  const target = Number(project.targetAmount) || 0;
  const model = project.fundingModel || "Reward";
  const category = project.category || "General";
  const benchmark = CATEGORY_BENCHMARKS[category] || CATEGORY_BENCHMARKS.default;

  // 1. Target Range
  if (scores.targetReasonableness < 80 || scores.categoryFit < 80) {
    const recMin = Math.round(benchmark * 0.4 / 1000) * 1000;
    const recMax = Math.round(benchmark * 1.2 / 1000) * 1000;
    suggestions.push({
      icon: "🎯",
      title: "Funding Target",
      current: `EGP ${target.toLocaleString()}`,
      recommended: `EGP ${recMin.toLocaleString()} — ${recMax.toLocaleString()}`,
      reason: `${category} projects in this range see significantly higher success rates. ${target > recMax ? "Your target is above the optimal range — consider phased funding." : target < recMin ? "Your target is below average — you may be undervaluing your project." : "Your target is within a good range."}`,
      impact: target > recMax * 1.5 || target < recMin * 0.5 ? "HIGH" : "MEDIUM",
    });
  }

  // 2. Reward Structure
  if (model === "Reward") {
    const tiers = project.rewardTiers || [];
    if (tiers.length < 4) {
      const tierTarget = target || 500000;
      const suggestedTiers = [
        { price: Math.round(tierTarget * 0.002 / 50) * 50 || 100, label: "Starter" },
        { price: Math.round(tierTarget * 0.01 / 50) * 50 || 500, label: "Popular" },
        { price: Math.round(tierTarget * 0.04 / 100) * 100 || 2000, label: "Premium" },
        { price: Math.round(tierTarget * 0.1 / 500) * 500 || 5000, label: "VIP" },
      ];
      suggestions.push({
        icon: "🎁",
        title: "Reward Structure",
        current: `${tiers.length} tier${tiers.length !== 1 ? "s" : ""}`,
        recommended: `4-5 tiers`,
        tiers: suggestedTiers,
        reason: "Multiple price points attract backers at every budget level. Projects with 4+ tiers raise 2.5x more on average.",
        impact: tiers.length <= 1 ? "HIGH" : "MEDIUM",
      });
    }
  }

  // 3. Equity Advice
  if (model === "Equity") {
    const eq = project.equityDetails?.equityPercentageOffered;
    if (!eq || eq > 40 || eq < 5) {
      suggestions.push({
        icon: "📊",
        title: "Equity Percentage",
        current: eq ? `${eq}%` : "Not set",
        recommended: "10% — 25%",
        reason: "This range balances investor attraction with founder control. Offering too much equity early dilutes your ownership significantly.",
        impact: "HIGH",
      });
    }
  }

  // 4. Mudarabah Terms
  if (model === "Mudarabah") {
    const md = project.mudarabahDetails;
    if (!md || md.investorsProfitSharePercentage > 70 || md.investorsProfitSharePercentage < 30) {
      suggestions.push({
        icon: "🤝",
        title: "Profit Share Terms",
        current: md ? `${md.investorsProfitSharePercentage}% investor share` : "Not set",
        recommended: "40% — 60% investor share",
        reason: "Balanced profit sharing with quarterly or semi-annual payouts attracts more Islamic finance-conscious investors.",
        impact: "HIGH",
      });
    }
  }

  // 5. Duration
  const days = project.campaignDurationInDays;
  if (days && (days > 60 || days < 20)) {
    suggestions.push({
      icon: "⏱️",
      title: "Campaign Duration",
      current: `${days} days`,
      recommended: "30 — 45 days",
      reason: days > 60
        ? "Long campaigns lose urgency. Shorter campaigns create FOMO and drive faster decisions — 73% higher conversion."
        : "Very short campaigns don't allow enough time for organic discovery and sharing.",
      impact: days > 75 ? "HIGH" : "MEDIUM",
    });
  }

  // 6. Description Tips
  const desc = (project.longDescription || project.shortDescription || "").toLowerCase();
  const missingKeywords = [];
  const keywordMap = {
    team: "Team Background",
    market: "Market Size",
    revenue: "Revenue Model",
    growth: "Growth Strategy",
    customers: "Customer Base",
    plan: "Business Plan",
  };
  Object.entries(keywordMap).forEach(([kw, label]) => {
    if (!desc.includes(kw)) missingKeywords.push(label);
  });
  if (missingKeywords.length >= 2) {
    suggestions.push({
      icon: "📝",
      title: "Description Enhancement",
      current: `${(project.longDescription || project.shortDescription || "").length} characters`,
      recommended: "400+ characters with key sections",
      missing: missingKeywords.slice(0, 4),
      reason: "Descriptions that cover team, market, and revenue generate 2x more investor trust.",
      impact: missingKeywords.length >= 4 ? "HIGH" : "MEDIUM",
    });
  }

  // 7. Media Tips
  const imgCount = (project.mediaGallery || []).filter((m) => m.type === "Image").length || (project.coverImageUrl ? 1 : 0);
  const hasVideo = !!project.promotionalVideoURL;
  if (imgCount < 3 || !hasVideo) {
    suggestions.push({
      icon: "🖼️",
      title: "Visual Media",
      current: `${imgCount} image${imgCount !== 1 ? "s" : ""}${hasVideo ? " + video" : ""}`,
      recommended: "4-5 images + promotional video",
      reason: !hasVideo
        ? "Adding a 2-3 minute video increases funding success by 85%. Show your product, team, and vision."
        : `Add ${Math.max(0, 4 - imgCount)} more images showing: product details, team, workspace, and prototypes.`,
      impact: !hasVideo && imgCount <= 1 ? "HIGH" : "MEDIUM",
    });
  }

  return suggestions;
}
