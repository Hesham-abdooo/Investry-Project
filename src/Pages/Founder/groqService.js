/**
 * ══════════════════════════════════════════════════════════
 * ══  InvesTry — Groq AI Service (Llama 3.3 70B)         ══
 * ══════════════════════════════════════════════════════════
 *
 * Sends enriched project data to Groq's Llama 3.3 70B model
 * and returns structured AI analysis with actionable insights.
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

/**
 * Build a rich, structured prompt from project data.
 */
function buildPrompt(project) {
  const model = project.fundingModel || "Unknown";
  const tiers = project.rewardTiers || [];
  const tierSummary = tiers.length > 0
    ? tiers.map((t, i) => `  Tier ${i + 1}: "${t.title}" — EGP ${Number(t.amount).toLocaleString()} (${t.currentBackers || 0}/${t.maxBackers || "∞"} backers)`).join("\n")
    : "  No reward tiers defined";

  const eqDetail = project.equityDetails
    ? `Equity Offered: ${project.equityDetails.equityPercentageOffered}%`
    : "N/A";

  const mdDetail = project.mudarabahDetails
    ? `Investor Profit Share: ${project.mudarabahDetails.investorsProfitSharePercentage}%, Payout: ${project.mudarabahDetails.profitDistributionFrequency}, Contract: ${project.mudarabahDetails.contractDurationInMonths} months`
    : "N/A";

  const imgCount = (project.mediaGallery || []).filter((m) => m.type === "Image").length || (project.coverImageUrl ? 1 : 0);
  const docCount = (project.mediaDocument || []).length;
  const hasVideo = !!project.promotionalVideoURL;

  return `You are InvesTry AI Advisor — an expert crowdfunding and startup consultant specializing in the Egyptian and Middle Eastern market. Your job is to analyze crowdfunding projects and provide specific, actionable, data-driven recommendations.

IMPORTANT: Respond ONLY with a valid JSON object. No markdown, no code fences, no extra text.

PROJECT DATA:
- Title: ${project.title || "Untitled"}
- Category: ${project.category || "General"}
- Funding Model: ${model}
- Target Amount: EGP ${(Number(project.targetAmount) || 0).toLocaleString()}
- Current Amount: EGP ${(Number(project.currentAmount) || 0).toLocaleString()}
- Funding Progress: ${project.fundingProgressPercentage || 0}%
- Number of Investors: ${project.numberOfInvestors || 0}
- Campaign Duration: ${project.campaignDurationInDays || "Unknown"} days
- Days Remaining: ${project.daysRemaining ?? "Unknown"}
- Min. Contribution: EGP ${(Number(project.minimumContribution) || 0).toLocaleString()}
- Short Description: ${project.shortDescription || "None"}
- Long Description: ${project.longDescription || "None"}
- Cover Image: ${project.coverImageUrl ? "Yes" : "No"}
- Gallery Images: ${imgCount}
- Promotional Video: ${hasVideo ? "Yes" : "No"}
- Documents Uploaded: ${docCount}

${model === "Reward" ? `REWARD TIERS:\n${tierSummary}` : ""}
${model === "Equity" ? `EQUITY DETAILS: ${eqDetail}` : ""}
${model === "Mudarabah" ? `MUDARABAH DETAILS: ${mdDetail}` : ""}

Analyze this project thoroughly and respond with this JSON structure:
{
  "overview": "A 2-3 sentence honest assessment of the project's current state, strengths, and main challenges. Be specific to THIS project.",
  "suggestedDescription": "Write a compelling, professional 150-200 word project description that this founder could use. Include sections about the vision, market opportunity, team value proposition, and call to action. Make it persuasive for investors.",
  "targetAdvice": {
    "current": ${Number(project.targetAmount) || 0},
    "recommendedMin": <number>,
    "recommendedMax": <number>,
    "reason": "Explain why this range is optimal for their category and funding model"
  },
  "marketingTips": [
    "Specific, actionable tip 1 relevant to their project",
    "Specific, actionable tip 2",
    "Specific, actionable tip 3"
  ],
  "dealOptimization": "Specific advice to optimize their ${model} funding model structure. For Reward: suggest specific tier structures with prices. For Equity: suggest optimal percentage. For Mudarabah: suggest optimal profit share and payout frequency.",
  "competitiveEdge": "What makes this project stand out and how they can leverage it in their marketing. Be specific to their category and description."
}`;
}

/**
 * Call Groq API and return parsed analysis.
 * Returns null if the API call fails (graceful fallback).
 */
export async function analyzeWithAI(project) {
  if (!project || GROQ_API_KEY === "PASTE_YOUR_GROQ_API_KEY_HERE") {
    return null;
  }

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: buildPrompt(project),
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      console.warn("Groq API error:", response.status);
      return null;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) return null;

    // Parse JSON response
    const parsed = JSON.parse(text);

    return {
      overview: parsed.overview || "",
      suggestedDescription: parsed.suggestedDescription || "",
      targetAdvice: parsed.targetAdvice || null,
      marketingTips: parsed.marketingTips || [],
      dealOptimization: parsed.dealOptimization || "",
      competitiveEdge: parsed.competitiveEdge || "",
    };
  } catch (err) {
    console.warn("AI analysis failed:", err.message);
    return null;
  }
}
