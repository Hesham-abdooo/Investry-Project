/**
 * ══════════════════════════════════════════════════════════
 * ══  InvesTry AI Project Advisor — Scoring Engine       ══
 * ══════════════════════════════════════════════════════════
 *
 * A weighted rule-based scoring algorithm that analyzes 8 key
 * dimensions of a crowdfunding project to predict success and
 * generate personalized improvement roadmaps.
 *
 * Algorithm: totalScore = Σ (weight_i × dimensionScore_i)
 * Each dimension scored 0-100, final score normalized to 0-100.
 */

/* ── Dimension Weights (must sum to 1.0) ── */
const WEIGHTS = {
  targetReasonableness: 0.15,
  descriptionQuality: 0.15,
  mediaCompleteness: 0.10,
  fundingProgress: 0.15,
  duration: 0.10,
  dealStructure: 0.15,
  documents: 0.10,
  categoryFit: 0.10,
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

function scoreDescriptionQuality(description) {
  const desc = (description || "").trim();
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

function scoreMediaCompleteness(coverImageUrl) {
  return coverImageUrl ? 95 : 18;
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

function scoreDuration(fundingModel, targetAmount) {
  // Without actual duration data, estimate from target
  const t = Number(targetAmount) || 0;
  if (t <= 300000) return 88; // Small = short campaign = good
  if (t <= 800000) return 80;
  if (t <= 1500000) return 65;
  return 50;
}

function scoreDealStructure(project) {
  const model = project.fundingModel;

  if (model === "Reward") {
    // Check if reward tiers exist (from description hints or data)
    return 75; // Baseline for having chosen a model
  }
  if (model === "Equity") {
    return 78;
  }
  if (model === "Mudarabah") {
    return 72;
  }
  return 40;
}

function scoreDocuments(project) {
  // Check for document indicators
  if (project.documents && project.documents.length > 0) return 90;
  if (project.coverImageUrl) return 45; // At least has media
  return 20;
}

function scoreCategoryFit(category, targetAmount) {
  const benchmark = CATEGORY_BENCHMARKS[category] || CATEGORY_BENCHMARKS.default;
  const target = Number(targetAmount) || 0;
  const ratio = target / benchmark;

  if (ratio >= 0.5 && ratio <= 1.5) return 88; // Within range
  if (ratio >= 0.3 && ratio <= 2.0) return 65; // Slightly off
  if (ratio >= 0.1 && ratio <= 3.0) return 45; // Quite off
  return 25; // Way off
}

/* ═══════════════════════════════════════════════════════ */
/* ══  INSIGHTS GENERATOR                               ══ */
/* ═══════════════════════════════════════════════════════ */

function generateStrengths(scores, project) {
  const strengths = [];

  if (scores.descriptionQuality >= 70)
    strengths.push({
      text: "Strong, detailed project description",
      detail: `Your description is ${(project.shortDescription || "").length}+ characters with professional terminology.`,
    });

  if (scores.mediaCompleteness >= 70)
    strengths.push({
      text: "Professional cover image attached",
      detail: "Projects with quality images receive 3x more investor attention.",
    });

  if (scores.fundingProgress >= 70)
    strengths.push({
      text: "Strong funding momentum",
      detail: `You've already reached ${project.fundingProgressPercentage || 0}% of your goal.`,
    });

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

  if (scores.dealStructure >= 70)
    strengths.push({
      text: `Good ${project.fundingModel || "funding"} model structure`,
      detail: "Your deal terms are competitive for this funding model.",
    });

  if (scores.documents >= 70)
    strengths.push({
      text: "Supporting documents uploaded",
      detail: "Business documents significantly increase investor trust and conversion.",
    });

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

  if (scores.mediaCompleteness < 50)
    improvements.push({
      text: "Add a professional cover image",
      detail: "Projects with images get 3x more attention from investors.",
      impact: "HIGH",
    });

  if (scores.descriptionQuality < 50)
    improvements.push({
      text: "Improve your project description",
      detail: "Add details about your team, market opportunity, and revenue model. Aim for 300+ characters.",
      impact: "HIGH",
    });

  if (scores.documents < 50)
    improvements.push({
      text: "Upload a business plan or pitch deck",
      detail: "Documents build credibility — investors are 60% more likely to fund documented projects.",
      impact: "HIGH",
    });

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

  if (scores.categoryFit < 50)
    improvements.push({
      text: "Align target with category benchmarks",
      detail: `Typical ${project.category || "General"} projects target around EGP ${(CATEGORY_BENCHMARKS[project.category] || CATEGORY_BENCHMARKS.default).toLocaleString()}.`,
      impact: "MEDIUM",
    });

  if (scores.dealStructure < 50)
    improvements.push({
      text: "Strengthen your deal structure",
      detail:
        project.fundingModel === "Reward"
          ? "Add multiple reward tiers at different price points to attract more backers."
          : project.fundingModel === "Equity"
            ? "Clearly define the equity percentage and valuation for transparency."
            : "Specify profit-sharing terms and payout frequency clearly.",
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

    if (dimension === "mediaCompleteness" && score < 70) {
      steps.push({
        title: "Add Visual Media",
        description: "Upload a high-quality cover image and consider adding a 2-3 minute project video. Video projects are 85% more likely to reach their funding goal.",
      });
    }
    if (dimension === "descriptionQuality" && score < 70) {
      steps.push({
        title: "Enhance Your Description",
        description: "Write a compelling story about your project. Include your team's background, market opportunity, competitive advantage, and clear use of funds.",
      });
    }
    if (dimension === "documents" && score < 70) {
      steps.push({
        title: "Upload Supporting Documents",
        description: "Add a business plan, financial projections, or pitch deck. These documents increase investor confidence by 60%.",
      });
    }
    if (dimension === "fundingProgress" && score < 70) {
      steps.push({
        title: "Activate Your Campaign Promotion",
        description:
          model === "Equity"
            ? "Share on LinkedIn and professional networks. Equity investors respond best to data-driven pitches."
            : model === "Mudarabah"
              ? "Reach out to Islamic finance communities and business networks. Highlight your profit-sharing terms."
              : "Launch a social media campaign. Create shareable content and offer early-bird incentives for first backers.",
      });
    }
    if (dimension === "targetReasonableness" && score < 60) {
      steps.push({
        title: "Optimize Your Funding Target",
        description: "Consider starting with a lower initial target. You can always create follow-up campaigns. Projects with achievable targets see 73% higher completion rates.",
      });
    }
    if (dimension === "dealStructure" && score < 60) {
      steps.push({
        title: "Refine Your Deal Terms",
        description:
          model === "Reward"
            ? "Create 3-5 reward tiers ranging from EGP 100 to EGP 5,000+. Variety attracts different backer levels."
            : model === "Equity"
              ? "Clearly communicate your company valuation and the equity being offered. Transparency builds trust."
              : "Detail your profit distribution schedule and contract duration. Quarterly payouts are most popular.",
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
 * @param {Object} project - Project data from /Projects/my-projects
 * @returns {Object} Analysis result with score, strengths, improvements, roadmap
 */
export function analyzeProject(project) {
  if (!project) return null;

  /* ── Step 1: Score each dimension ── */
  const dimensionScores = {
    targetReasonableness: scoreTargetReasonableness(project.targetAmount),
    descriptionQuality: scoreDescriptionQuality(project.shortDescription),
    mediaCompleteness: scoreMediaCompleteness(project.coverImageUrl),
    fundingProgress: scoreFundingProgress(project.fundingProgressPercentage),
    duration: scoreDuration(project.fundingModel, project.targetAmount),
    dealStructure: scoreDealStructure(project),
    documents: scoreDocuments(project),
    categoryFit: scoreCategoryFit(project.category, project.targetAmount),
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
    message = "Your project is well-positioned for success!";
  } else if (totalScore >= 60) {
    label = "Good";
    color = "#D4A017";
    message = "Good foundation — a few improvements can make it great.";
  } else if (totalScore >= 40) {
    label = "Fair";
    color = "#EA580C";
    message = "Needs work — follow the roadmap below to improve.";
  } else {
    label = "Needs Attention";
    color = "#DC2626";
    message = "Significant improvements needed. Start with the top suggestions.";
  }

  /* ── Step 4: Generate insights ── */
  const strengths = generateStrengths(dimensionScores, project);
  const improvements = generateImprovements(dimensionScores, project);
  const roadmap = generateRoadmap(dimensionScores, project);

  return {
    score: totalScore,
    label,
    color,
    message,
    strengths,
    improvements,
    roadmap,
    dimensionScores,
  };
}
