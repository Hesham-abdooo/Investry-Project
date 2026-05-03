import React, { useState, useEffect, useRef } from "react";
import {
  FiDollarSign, FiTrendingUp, FiCheckCircle, FiAward,
  FiBriefcase, FiCpu, FiChevronDown, FiTarget,
  FiAlertTriangle, FiMap, FiZap, FiStar, FiUsers,
} from "react-icons/fi";
import axiosInstance from "../../Api/axiosInstance";
import { analyzeProject } from "./aiAdvisor";
import { analyzeWithAI } from "./groqService";

export default function FounderAnalytics() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const listRes = await axiosInstance.get("/Projects/my-projects");
        const list = listRes.data?.data || [];

        // Fetch details for each project (enriched data)
        const detailed = await Promise.all(
          list.map(async (p) => {
            try {
              const detailRes = await axiosInstance.get(`/Projects/${p.id}/details`);
              return { ...p, ...(detailRes.data?.data || {}) };
            } catch {
              return p; // fallback to summary if details fail
            }
          })
        );

        setProjects(detailed);
      } catch (err) {
        console.error("Failed to load projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const stats = {
    raised: projects.reduce((s, p) => s + (Number(p.currentAmount) || 0), 0),
    avgProgress: projects.length ? Math.round(projects.reduce((s, p) => s + (p.fundingProgressPercentage || 0), 0) / projects.length) : 0,
    fullyFunded: projects.filter((p) => (p.fundingProgressPercentage || 0) >= 100).length,
    best: projects.length ? projects.reduce((a, b) => (a.fundingProgressPercentage || 0) >= (b.fundingProgressPercentage || 0) ? a : b) : null,
    totalInvestors: projects.reduce((s, p) => s + (p.numberOfInvestors || 0), 0),
  };

  const modelBreakdown = ["Reward", "Equity", "Mudarabah"].map((m) => {
    const filtered = projects.filter((p) => p.fundingModel === m);
    return { model: m, count: filtered.length, raised: filtered.reduce((s, p) => s + (Number(p.currentAmount) || 0), 0) };
  });

  const statusCounts = {
    Published: projects.filter((p) => p.projectStatus === "Published").length,
    PendingReview: projects.filter((p) => p.projectStatus === "PendingReview").length,
    Successful: projects.filter((p) => p.projectStatus === "Successful").length,
  };
  const totalForBar = Math.max(statusCounts.Published + statusCounts.PendingReview + statusCounts.Successful, 1);

  const handleAnalyze = () => {
    const proj = projects.find((p) => p.id === selectedId);
    if (!proj) return;
    setAnalyzing(true);
    setAnalysis(null);
    setAiAnalysis(null);
    setAnimatedScore(0);

    // Rule-based analysis (instant with animation delay)
    setTimeout(() => {
      const result = analyzeProject(proj);
      setAnalysis(result);
      setAnalyzing(false);
      let start = 0;
      const end = result.score;
      const step = Math.max(1, Math.floor(end / 40));
      const timer = setInterval(() => {
        start += step;
        if (start >= end) { setAnimatedScore(end); clearInterval(timer); }
        else setAnimatedScore(start);
      }, 30);
    }, 1800);

    // Groq AI analysis (parallel, async)
    setAiLoading(true);
    analyzeWithAI(proj)
      .then((result) => setAiAnalysis(result))
      .catch(() => setAiAnalysis(null))
      .finally(() => setAiLoading(false));
  };

  if (loading) return <AnalyticsSkeleton />;

  const sorted = [...projects].sort((a, b) => (b.fundingProgressPercentage || 0) - (a.fundingProgressPercentage || 0));

  return (
    <div style={{ padding: "8px 0 300px", overflowX: "hidden" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0F2044", margin: "0 0 6px" }}>Analytics</h1>
        <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>Track performance and get AI-powered insights.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon={FiDollarSign} label="Total Raised" value={`EGP ${stats.raised.toLocaleString()}`} color="#D4A017" bg="#FEF9EC" />
        <StatCard icon={FiTrendingUp} label="Avg Progress" value={`${stats.avgProgress}%`} color="#0F2044" bg="#F0F4F8" />
        <StatCard icon={FiUsers} label="Total Investors" value={stats.totalInvestors} color="#3B82F6" bg="#EFF6FF" />
        <StatCard icon={FiCheckCircle} label="Fully Funded" value={stats.fullyFunded} color="#059669" bg="#ECFDF5" />
        <StatCard icon={FiAward} label="Best Performer" value={stats.best?.title || "—"} color="#D4A017" bg="#FEF9EC" small />
      </div>

      {/* Performance Table */}
      <SectionLabel text="Projects Performance" />
      <div style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", marginBottom: 24, overflowX: "auto" }}>
        <div style={{ minWidth: 750 }}>
        {/* Table Header */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(160px,2.2fr) 90px minmax(100px,1.5fr) minmax(90px,1fr) 70px 65px 95px", gap: 10, padding: "12px 20px", backgroundColor: "#FAFBFC", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, alignItems: "center" }}>
          <span>Project</span><span>Model</span><span>Progress</span><span>Raised</span><span style={{ textAlign: "center" }}>Investors</span><span style={{ textAlign: "center" }}>Days Left</span><span style={{ textAlign: "center" }}>Status</span>
        </div>
        {sorted.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>No projects to display</div>
        ) : sorted.map((p, i) => {
          const prog = Math.min(p.fundingProgressPercentage || 0, 100);
          const img = p.coverImageUrl ? (p.coverImageUrl.startsWith("http") ? p.coverImageUrl : `https://investry.runasp.net${p.coverImageUrl}`) : null;
          return (
            <div key={p.id} style={{ display: "grid", gridTemplateColumns: "minmax(160px,2.2fr) 90px minmax(100px,1.5fr) minmax(90px,1fr) 70px 65px 95px", gap: 10, padding: "14px 20px", alignItems: "center", borderTop: "1px solid #f5f5f5", transition: "background 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FAFBFC"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#f3f4f6", overflow: "hidden", flexShrink: 0 }}>
                  {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><FiBriefcase size={14} color="#cbd5e1" /></div>}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0F2044", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</span>
              </div>
              <ModelBadge model={p.fundingModel} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: "#f3f4f6", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, width: `${prog}%`, backgroundColor: prog >= 100 ? "#059669" : "#D4A017", transition: "width 0.5s" }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#0F2044", minWidth: 30, textAlign: "right" }}>{prog}%</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#D4A017" }}>EGP {(Number(p.currentAmount) || 0).toLocaleString()}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#3B82F6", textAlign: "center" }}>{p.numberOfInvestors ?? "—"}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: (p.daysRemaining || 0) <= 7 ? "#DC2626" : "#64748b", textAlign: "center" }}>{p.daysRemaining != null ? `${p.daysRemaining}d` : "—"}</span>
              <div style={{ textAlign: "center" }}><StatusBadge status={p.projectStatus} /></div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Model Breakdown + Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }} className="actions-grid">
        {/* Breakdown */}
        <div>
          <SectionLabel text="Funding Breakdown" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {modelBreakdown.map((m) => (
              <div key={m.model} style={{ backgroundColor: "white", borderRadius: 14, border: "1.5px solid #f0f0f0", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `4px solid ${m.model === "Equity" ? "#0F2044" : m.model === "Mudarabah" ? "#059669" : "#D4A017"}` }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#0F2044", margin: "0 0 2px" }}>{m.model}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{m.count} project{m.count !== 1 ? "s" : ""}</p>
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#D4A017", margin: 0 }}>EGP {m.raised.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Status */}
        <div>
          <SectionLabel text="Status Distribution" />
          <div style={{ backgroundColor: "white", borderRadius: 14, border: "1.5px solid #f0f0f0", padding: 20 }}>
            <div style={{ display: "flex", height: 14, borderRadius: 7, overflow: "hidden", marginBottom: 16 }}>
              {statusCounts.Published > 0 && <div style={{ width: `${(statusCounts.Published / totalForBar) * 100}%`, backgroundColor: "#059669" }} />}
              {statusCounts.PendingReview > 0 && <div style={{ width: `${(statusCounts.PendingReview / totalForBar) * 100}%`, backgroundColor: "#D4A017" }} />}
              {statusCounts.Successful > 0 && <div style={{ width: `${(statusCounts.Successful / totalForBar) * 100}%`, backgroundColor: "#3B82F6" }} />}
              {totalForBar <= 1 && statusCounts.Published === 0 && statusCounts.PendingReview === 0 && statusCounts.Successful === 0 && <div style={{ width: "100%", backgroundColor: "#f3f4f6" }} />}
            </div>
            {[{ label: "Published", count: statusCounts.Published, color: "#059669" }, { label: "Pending Review", count: statusCounts.PendingReview, color: "#D4A017" }, { label: "Successful", count: statusCounts.Successful, color: "#3B82F6" }].map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: s.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#0F2044", fontWeight: 500, flex: 1 }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0F2044" }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI ADVISOR */}
      <AIAdvisorSection projects={projects} selectedId={selectedId} setSelectedId={setSelectedId} analysis={analysis} analyzing={analyzing} animatedScore={animatedScore} onAnalyze={handleAnalyze} aiAnalysis={aiAnalysis} aiLoading={aiLoading} />
    </div>
  );
}

/* ══ AI ADVISOR SECTION ══ */
function AIAdvisorSection({ projects, selectedId, setSelectedId, analysis, analyzing, animatedScore, onAnalyze, aiAnalysis, aiLoading }) {
  const scoreColor = analysis?.color || "#94a3b8";
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (circumference * animatedScore) / 100;

  return (
    <div style={{ background: "linear-gradient(135deg, #0F2044 0%, #1a3260 100%)", borderRadius: 20, padding: "32px 28px", position: "relative", overflow: "visible" }}>
      <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(212,160,23,0.06)" }} />
      <div style={{ position: "absolute", bottom: -30, left: 60, width: 120, height: 120, borderRadius: "50%", background: "rgba(212,160,23,0.04)" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <FiCpu size={20} style={{ color: "#D4A017" }} />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "white", margin: 0 }}>InvesTry Advisor</h2>
      </div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 24px" }}>Select a project and get AI-powered insights to maximize your success.</p>

      {/* Selector */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <CustomDropdown projects={projects} selectedId={selectedId} onSelect={setSelectedId} />
        <button onClick={onAnalyze} disabled={!selectedId || analyzing}
          style={{ padding: "12px 28px", borderRadius: 12, border: "none", backgroundColor: !selectedId || analyzing ? "rgba(255,255,255,0.1)" : "#D4A017", color: !selectedId || analyzing ? "rgba(255,255,255,0.3)" : "white", fontSize: 14, fontWeight: 700, cursor: !selectedId || analyzing ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.25s", fontFamily: "inherit", whiteSpace: "nowrap" }}>
          <FiZap size={15} /> {analyzing ? "Analyzing..." : "Analyze Project"}
        </button>
      </div>

      {/* Analyzing Animation */}
      {analyzing && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ width: 56, height: 56, margin: "0 auto 16px", borderRadius: "50%", backgroundColor: "rgba(212,160,23,0.15)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 1.2s ease-in-out infinite" }}>
            <FiCpu size={26} style={{ color: "#D4A017" }} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 500, margin: 0 }}>Analyzing your project<span style={{ animation: "pulse 1s infinite" }}>...</span></p>
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
        </div>
      )}

      {/* Results */}
      {analysis && !analyzing && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Score */}
          <div style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
            <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
              <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                <circle cx="60" cy="60" r="54" fill="none" stroke={scoreColor} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 1.5s ease-out" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: "white", lineHeight: 1 }}>{animatedScore}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>/100</span>
              </div>
            </div>
            <div>
              <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: scoreColor, backgroundColor: `${scoreColor}20`, padding: "4px 12px", borderRadius: 6, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>{analysis.label}</span>
              <p style={{ fontSize: 15, fontWeight: 600, color: "white", margin: "0 0 4px" }}>Success Score</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, maxWidth: 340, lineHeight: 1.5 }}>{analysis.message}</p>
            </div>
          </div>

          {/* Strengths + Improvements */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="actions-grid">
            <InsightCard title="Strengths" icon={FiStar} iconColor="#059669" items={analysis.strengths.map((s) => ({ text: s.text, detail: s.detail }))} />
            <InsightCard title="Areas to Improve" icon={FiAlertTriangle} iconColor="#EA580C" items={analysis.improvements.map((s) => ({ text: s.text, detail: s.detail, badge: s.impact }))} />
          </div>

          {/* Roadmap */}
          <div style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <FiMap size={16} style={{ color: "#D4A017" }} />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "white", margin: 0 }}>Personalized Roadmap</h3>
            </div>
            {analysis.roadmap.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < analysis.roadmap.length - 1 ? 16 : 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "rgba(212,160,23,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, fontWeight: 800, color: "#D4A017" }}>{i + 1}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "white", margin: "0 0 2px" }}>{step.title}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.5 }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Smart Suggestions ── */}
          {analysis.smartSuggestions?.length > 0 && (
            <div style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <FiTarget size={16} style={{ color: "#D4A017" }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "white", margin: 0 }}>Smart Suggestions</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {analysis.smartSuggestions.map((s, i) => (
                  <div key={i} style={{ backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "16px 18px", borderLeft: `3px solid ${s.impact === "HIGH" ? "#DC2626" : s.impact === "MEDIUM" ? "#D4A017" : "#059669"}` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{s.icon} {s.title}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4, backgroundColor: s.impact === "HIGH" ? "rgba(220,38,38,0.2)" : s.impact === "MEDIUM" ? "rgba(212,160,23,0.2)" : "rgba(5,150,105,0.2)", color: s.impact === "HIGH" ? "#FCA5A5" : s.impact === "MEDIUM" ? "#D4A017" : "#059669", textTransform: "uppercase" }}>{s.impact}</span>
                    </div>
                    <div style={{ display: "flex", gap: 20, marginBottom: 6, flexWrap: "wrap" }}>
                      <div>
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", fontWeight: 600 }}>Current</span>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "2px 0 0", fontWeight: 500 }}>{s.current}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: 10, color: "rgba(212,160,23,0.7)", textTransform: "uppercase", fontWeight: 600 }}>Recommended</span>
                        <p style={{ fontSize: 13, color: "#D4A017", margin: "2px 0 0", fontWeight: 600 }}>{s.recommended}</p>
                      </div>
                    </div>
                    {s.tiers && (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0" }}>
                        {s.tiers.map((t, j) => (
                          <span key={j} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, backgroundColor: "rgba(212,160,23,0.1)", color: "#D4A017", fontWeight: 600 }}>EGP {t.price.toLocaleString()} — {t.label}</span>
                        ))}
                      </div>
                    )}
                    {s.missing && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "8px 0" }}>
                        {s.missing.map((m, j) => (
                          <span key={j} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, backgroundColor: "rgba(234,88,12,0.15)", color: "#FB923C", fontWeight: 600 }}>+ {m}</span>
                        ))}
                      </div>
                    )}
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "6px 0 0", lineHeight: 1.4 }}>{s.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── AI Deep Analysis (Groq) ── */}
          {(aiLoading || aiAnalysis) && (
            <div style={{ background: "linear-gradient(135deg, rgba(212,160,23,0.08) 0%, rgba(15,32,68,0.2) 100%)", borderRadius: 16, padding: 24, border: "1px solid rgba(212,160,23,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <FiCpu size={16} style={{ color: "#D4A017" }} />
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "white", margin: 0 }}>AI Deep Analysis</h3>
              </div>

              {aiLoading && (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ width: 40, height: 40, margin: "0 auto 12px", borderRadius: "50%", border: "3px solid rgba(212,160,23,0.2)", borderTopColor: "#D4A017", animation: "spin 0.8s linear infinite" }} />
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0 }}>AI is analyzing your project...</p>
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
              )}

              {aiAnalysis && !aiLoading && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Overview */}
                  {aiAnalysis.overview && (
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(212,160,23,0.7)", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" }}>💡 Overview</p>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.6 }}>{aiAnalysis.overview}</p>
                    </div>
                  )}

                  {/* Suggested Description */}
                  {aiAnalysis.suggestedDescription && (
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(212,160,23,0.7)", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" }}>📝 Suggested Description</p>
                      <div style={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 10, padding: 14 }}>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{aiAnalysis.suggestedDescription}</p>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                          <button onClick={(e) => { navigator.clipboard.writeText(aiAnalysis.suggestedDescription); e.target.textContent = "✅ Copied!"; setTimeout(() => { e.target.textContent = "📋 Copy Text"; }, 1500); }} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(212,160,23,0.3)", backgroundColor: "rgba(212,160,23,0.1)", color: "#D4A017", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>📋 Copy Text</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Target Advice */}
                  {aiAnalysis.targetAdvice && (
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(212,160,23,0.7)", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" }}>🎯 Target Optimization</p>
                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 6 }}>
                        <div style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "8px 14px" }}>
                          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>Current</span>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "white", margin: "2px 0 0" }}>EGP {(aiAnalysis.targetAdvice.current || 0).toLocaleString()}</p>
                        </div>
                        <div style={{ backgroundColor: "rgba(212,160,23,0.1)", borderRadius: 8, padding: "8px 14px" }}>
                          <span style={{ fontSize: 9, color: "rgba(212,160,23,0.6)", textTransform: "uppercase" }}>Recommended</span>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#D4A017", margin: "2px 0 0" }}>EGP {(aiAnalysis.targetAdvice.recommendedMin || 0).toLocaleString()} — {(aiAnalysis.targetAdvice.recommendedMax || 0).toLocaleString()}</p>
                        </div>
                      </div>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.4 }}>{aiAnalysis.targetAdvice.reason}</p>
                    </div>
                  )}

                  {/* Marketing Tips */}
                  {aiAnalysis.marketingTips?.length > 0 && (
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(212,160,23,0.7)", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>📢 Marketing Strategy</p>
                      {aiAnalysis.marketingTips.map((tip, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#D4A017", marginTop: 6, flexShrink: 0 }} />
                          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.5 }}>{tip}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Deal Optimization */}
                  {aiAnalysis.dealOptimization && (
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(212,160,23,0.7)", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" }}>💰 Deal Optimization</p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6 }}>{aiAnalysis.dealOptimization}</p>
                    </div>
                  )}

                  {/* Competitive Edge */}
                  {aiAnalysis.competitiveEdge && (
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(212,160,23,0.7)", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" }}>⚡ Competitive Edge</p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6 }}>{aiAnalysis.competitiveEdge}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══ REUSABLE COMPONENTS ══ */
function StatCard({ icon: Icon, label, value, color, bg, small }) {
  return (
    <div style={{ backgroundColor: "white", borderRadius: 16, border: "1.5px solid #f0f0f0", padding: 20, transition: "all 0.25s" }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={20} style={{ color }} /></div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", margin: "0 0 2px" }}>{label}</p>
          <p style={{ fontSize: small ? 13 : 20, fontWeight: 700, color, margin: 0, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ text }) {
  return <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: "#94a3b8", margin: "0 0 12px" }}>{text}</p>;
}

function ModelBadge({ model }) {
  const c = model === "Equity" ? { bg: "#EEF2FF", color: "#4F46E5" } : model === "Mudarabah" ? { bg: "#ECFDF5", color: "#059669" } : { bg: "#FEF9EC", color: "#B8860B" };
  return <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 6, backgroundColor: c.bg, color: c.color, textTransform: "uppercase", letterSpacing: 0.3, whiteSpace: "nowrap" }}>{model}</span>;
}

function StatusBadge({ status }) {
  const m = { Published: { bg: "#E8F5E9", c: "#2E7D32" }, PendingReview: { bg: "#FEF9EC", c: "#D4A017" }, Successful: { bg: "#E3F2FD", c: "#1565C0" }, Rejected: { bg: "#FEF2F2", c: "#DC2626" } };
  const s = m[status] || { bg: "#F3F4F6", c: "#9CA3AF" };
  const labelMap = { PendingReview: "Pending" };
  const label = labelMap[status] || status || "—";
  return <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 6, backgroundColor: s.bg, color: s.c, textTransform: "uppercase" }}>{label}</span>;
}

function InsightCard({ title, icon: Icon, iconColor, items }) {
  return (
    <div style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Icon size={15} style={{ color: iconColor }} />
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "white", margin: 0 }}>{title}</h3>
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < items.length - 1 ? 12 : 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: iconColor, marginTop: 6, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "white", margin: "0 0 2px" }}>
              {item.text}
              {item.badge && <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, backgroundColor: item.badge === "HIGH" ? "rgba(234,88,12,0.2)" : "rgba(212,160,23,0.2)", color: item.badge === "HIGH" ? "#EA580C" : "#D4A017" }}>{item.badge}</span>}
            </p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.4 }}>{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══ CUSTOM DROPDOWN ══ */
function CustomDropdown({ projects, selectedId, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = projects.find((p) => p.id === selectedId);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }
  };

  return (
    <div ref={ref} style={{ position: "relative", flex: 1, minWidth: 200 }}>
      {/* Trigger */}
      <div onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${open ? "rgba(212,160,23,0.4)" : "rgba(255,255,255,0.15)"}`, backgroundColor: open ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)", cursor: "pointer", transition: "all 0.2s" }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: selected ? "white" : "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selected ? selected.title : "Choose a project..."}
        </span>
        <FiChevronDown size={16} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </div>

      {/* Menu */}
      {open && (
        <>
          <style>{`.ai-dropdown-menu::-webkit-scrollbar{width:5px}.ai-dropdown-menu::-webkit-scrollbar-track{background:transparent}.ai-dropdown-menu::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:4px}.ai-dropdown-menu::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.25)}`}</style>
          <div className="ai-dropdown-menu" style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, backgroundColor: "#1a2d50", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 14, boxShadow: "0 12px 32px rgba(0,0,0,0.3)", zIndex: 50, maxHeight: 180, overflowY: "auto", padding: 4 }}>
          {projects.length === 0 ? (
            <div style={{ padding: "16px 14px", fontSize: 13, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>No projects available</div>
          ) : projects.map((p) => {
            const isActive = p.id === selectedId;
            const img = p.coverImageUrl ? (p.coverImageUrl.startsWith("http") ? p.coverImageUrl : `https://investry.runasp.net${p.coverImageUrl}`) : null;
            return (
              <div key={p.id}
                onClick={() => { onSelect(p.id); setOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer", backgroundColor: isActive ? "rgba(212,160,23,0.12)" : "transparent", transition: "background 0.15s" }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden", flexShrink: 0 }}>
                  {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><FiBriefcase size={12} color="rgba(255,255,255,0.2)" /></div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: isActive ? "#D4A017" : "white", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", margin: 0 }}>{p.fundingModel} · {p.fundingProgressPercentage || 0}% funded</p>
                </div>
                {isActive && <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#D4A017", flexShrink: 0 }} />}
              </div>
            );
          })}
        </div>
        </>
      )}
    </div>
  );
}

/* ══ SKELETON ══ */
function AnalyticsSkeleton() {
  const p = { animation: "pulse 1.5s ease-in-out infinite" };
  const b = "#f3f4f6";
  return (
    <div style={{ padding: "8px 0" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
      <div style={{ ...p, width: 120, height: 20, borderRadius: 8, backgroundColor: b, marginBottom: 8 }} />
      <div style={{ ...p, width: 260, height: 12, borderRadius: 6, backgroundColor: b, marginBottom: 24 }} />
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16, marginBottom: 24 }}>
        {[1,2,3,4,5].map((i) => <div key={i} style={{ ...p, height: 84, borderRadius: 16, backgroundColor: "white", border: "1.5px solid #f0f0f0" }} />)}
      </div>
      <div style={{ ...p, height: 200, borderRadius: 16, backgroundColor: "white", border: "1.5px solid #f0f0f0", marginBottom: 24 }} />
      <div style={{ ...p, height: 180, borderRadius: 20, background: "linear-gradient(135deg,#0F2044,#1a3260)" }} />
    </div>
  );
}
