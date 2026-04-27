import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoAlertCircleOutline } from "react-icons/io5";
import { FiX } from "react-icons/fi";
import axiosInstance from "../../Api/axiosInstance";
import Logo from "../../Components/Basics/Logo";
import "../../Components/Founder/FounderLayout/CreateProject/FounderCREATE.css";

import { EditStepper, EditSuccessPage, EditLoadingSkeleton } from "./EditProject/EditProjectHelpers";
import { EditStep1, EditStep2, EditStep3, EditStep4 } from "./EditProject/EditProjectSteps";

const STEP_DESC = [
  "Update your project details.",
  "Modify deal terms.",
  "Manage media and documents.",
  "Review your changes before saving.",
];

export default function FounderEditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ── Loading / Error ── */
  const [pageLoading, setPageLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [hasInvestors, setHasInvestors] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [showExitModal, setShowExitModal] = useState(false);

  /* ── Project Data ── */
  const [fundingModel, setFundingModel] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [category, setCategory] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [minContribution, setMinContribution] = useState("");
  const [selectDuration, setSelectDuration] = useState(null);

  /* ── Deal Details ── */
  const [rewardTiers, setRewardTiers] = useState([{ gift: "", amount: "", quantity: "" }]);
  const [equityOffered, setEquityOffered] = useState("");
  const [founderProfitShare, setFounderProfitShare] = useState("");
  const [contractDuration, setContractDuration] = useState("");
  const [payoutFrequency, setPayoutFrequency] = useState("");

  /* ── Media ── */
  const [existingImages, setExistingImages] = useState([]);
  const [existingDocs, setExistingDocs] = useState([]);
  const [existingCoverUrl, setExistingCoverUrl] = useState("");
  const [deletedMediaIds, setDeletedMediaIds] = useState([]);
  const [newMediaFiles, setNewMediaFiles] = useState([]);
  const [newDocuments, setNewDocuments] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");

  /* ── Load Project Data ── */
  useEffect(() => {
    const load = async () => {
      try {
        const [projRes, catRes] = await Promise.all([
          axiosInstance.get(`/Projects/${id}/details`),
          axiosInstance.get("/Categories"),
        ]);

        if (!projRes.data?.success || !projRes.data.data) {
          setLoadError("Project not found.");
          setPageLoading(false);
          return;
        }

        const p = projRes.data.data;
        const cats = catRes.data?.data || [];

        // Check if project has investors
        if ((p.currentAmount && p.currentAmount > 0) || (p.numberOfInvestors && p.numberOfInvestors > 0)) {
          setHasInvestors(true);
          setPageLoading(false);
          return;
        }

        setFundingModel(p.fundingModel || "Reward");
        setProjectTitle(p.title || "");
        setProjectDescription(p.longDescription || p.shortDescription || "");
        setFundingGoal(String(p.targetAmount || ""));
        setMinContribution(String(p.minimumContribution || ""));
        setVideoUrl(p.promotionalVideoURL || "");
        setExistingCoverUrl(p.coverImageUrl || "");

        // Category matching
        const matchedCat = cats.find(c => c.name === p.category);
        if (matchedCat) setCategory(matchedCat.id);

        // Duration
        const days = p.campaignDurationInDays;
        if (days === 30) setSelectDuration("30 days");
        else if (days === 60) setSelectDuration("60 days");
        else if (days === 90) setSelectDuration("90 days");
        else if (days) setSelectDuration(`${days} days`);

        // Media
        const gallery = (p.mediaGallery || []).filter(m => m.type === "Image");
        setExistingImages(gallery);
        setExistingDocs(p.mediaDocument || []);

        // Deal details per model
        if (p.fundingModel === "Reward" && p.rewardTiers?.length > 0) {
          setRewardTiers(p.rewardTiers.map(t => ({
            gift: t.title || t.description || "",
            amount: String(t.amount || ""),
            quantity: String(t.maxBackers || ""),
          })));
        }
        if (p.fundingModel === "Equity" && p.equityDetails) {
          setEquityOffered(String(p.equityDetails.equityPercentageOffered || ""));
        }
        if (p.fundingModel === "Mudarabah" && p.mudarabahDetails) {
          const md = p.mudarabahDetails;
          setFounderProfitShare(String(md.investorsProfitSharePercentage || ""));
          setContractDuration(String(md.contractDurationInMonths || ""));
          setPayoutFrequency(md.profitDistributionFrequency || "");
        }
      } catch (err) {
        console.error("Failed to load project:", err);
        setLoadError("Failed to load project. Please try again.");
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [id]);

  /* ── Delete Existing Media ── */
  const handleDeleteExisting = (identifier, type) => {
    setDeletedMediaIds(prev => [...prev, identifier]);
    if (type === "image") setExistingImages(prev => prev.filter(m => (m.publicId || m.url) !== identifier));
    else setExistingDocs(prev => prev.filter(m => (m.publicId || m.url) !== identifier));
  };

  /* ── Validation ── */
  const handleNext = () => {
    const errs = {};
    if (currentStep === 1) {
      if (!projectTitle.trim()) errs.projectTitle = "Project title is required";
      if (!category) errs.category = "Category is required";
      if (!projectDescription.trim()) errs.projectDescription = "Description is required";
      if (!fundingGoal) errs.fundingGoal = "Funding goal is required";
      if (!minContribution) errs.minContribution = "Minimum contribution is required";
      if (!selectDuration) errs.selectDuration = "Please select a duration";
    }
    if (currentStep === 2) {
      if (fundingModel === "Equity" && !equityOffered.trim()) errs.equityOffered = "Equity offered is required";
      if (fundingModel === "Mudarabah") {
        if (!founderProfitShare.trim()) errs.founderProfitShare = "Profit share is required";
        if (!contractDuration) errs.contractDuration = "Contract duration is required";
        if (!payoutFrequency) errs.payoutFrequency = "Payout frequency is required";
      }
      if (fundingModel === "Reward") {
        if (rewardTiers.every(t => !t.gift.trim() || !t.amount.trim() || !t.quantity.trim())) errs.rewardTiers = "Please fill all reward tiers";
      }
    }
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("Title", projectTitle);
      fd.append("ShortDescription", projectDescription);
      fd.append("LongDescription", projectDescription);
      fd.append("TargetAmount", fundingGoal);
      fd.append("MinimumContribution", minContribution);
      fd.append("CategoryIds[0]", category);

      const days = selectDuration === "30 days" ? 30 : selectDuration === "60 days" ? 60 : 90;
      fd.append("DurationInDays", days);

      if (fundingModel === "Reward") {
        rewardTiers.forEach((t, i) => {
          fd.append(`RewardTiers[${i}][title]`, t.gift);
          fd.append(`RewardTiers[${i}][description]`, t.gift);
          fd.append(`RewardTiers[${i}][amount]`, t.amount);
          fd.append(`RewardTiers[${i}][maxBackers]`, t.quantity);
        });
      }
      if (fundingModel === "Equity") fd.append("EquityPercentage", equityOffered || 0);
      if (fundingModel === "Mudarabah") {
        fd.append("InvestorsProfitSharePercentage", founderProfitShare || 0);
        fd.append("MudarabahDurationInMonths", contractDuration ? parseInt(contractDuration) : 0);
        const freqMap = { Monthly: 1, Quarterly: 3, "Semi-annually": 6, Annually: 12 };
        fd.append("ProfitDistributionFrequency", freqMap[payoutFrequency] || 1);
      }

      deletedMediaIds.forEach((mid, i) => fd.append(`DeletedMediaPublicIds[${i}]`, mid));
      newMediaFiles.forEach(f => fd.append("NewMediaFiles", f));
      newDocuments.forEach(f => fd.append("NewMediaFiles", f));

      await axiosInstance.patch(`/Projects/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setIsSubmitted(true);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Render Step ── */
  const renderStep = () => {
    if (currentStep === 1) return <EditStep1 fundingModel={fundingModel} projectTitle={projectTitle} setProjectTitle={setProjectTitle} category={category} setCategory={setCategory} projectDescription={projectDescription} setProjectDescription={setProjectDescription} fundingGoal={fundingGoal} setFundingGoal={setFundingGoal} minContribution={minContribution} setMinContribution={setMinContribution} selectDuration={selectDuration} setSelectDuration={setSelectDuration} errors={errors} />;
    if (currentStep === 2) return <EditStep2 fundingModel={fundingModel} fundingGoal={fundingGoal} minContribution={minContribution} selectDuration={selectDuration} rewardTiers={rewardTiers} setRewardTiers={setRewardTiers} equityOffered={equityOffered} setEquityOffered={setEquityOffered} founderProfitShare={founderProfitShare} setFounderProfitShare={setFounderProfitShare} contractDuration={contractDuration} setContractDuration={setContractDuration} payoutFrequency={payoutFrequency} setPayoutFrequency={setPayoutFrequency} errors={errors} />;
    if (currentStep === 3) return <EditStep3 existingImages={existingImages} existingDocs={existingDocs} existingCoverUrl={existingCoverUrl} onDeleteExisting={handleDeleteExisting} newMediaFiles={newMediaFiles} setNewMediaFiles={setNewMediaFiles} videoUrl={videoUrl} setVideoUrl={setVideoUrl} newDocuments={newDocuments} setNewDocuments={setNewDocuments} errors={errors} />;
    if (currentStep === 4) return <EditStep4 fundingModel={fundingModel} projectTitle={projectTitle} category={category} fundingGoal={fundingGoal} minContribution={minContribution} selectDuration={selectDuration} equityOffered={equityOffered} rewardTiers={rewardTiers} founderProfitShare={founderProfitShare} contractDuration={contractDuration} existingImages={existingImages} newMediaFiles={newMediaFiles} existingDocs={existingDocs} newDocuments={newDocuments} videoUrl={videoUrl} existingCoverUrl={existingCoverUrl} setCurrentStep={setCurrentStep} />;
    return null;
  };

  /* ── States ── */
  if (pageLoading) return <EditLoadingSkeleton />;
  if (isSubmitted) return <EditSuccessPage projectId={id} />;

  if (hasInvestors) return (
    <>
      <div className="topBar"><Logo /><button onClick={() => navigate(`/founder/projects/${id}`)} className="exit_dash">Back to Project</button></div>
      <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
        <div style={{ textAlign: "center", maxWidth: 480, padding: "40px 24px", background: "white", borderRadius: 20, border: "1.5px solid #f0f0f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #FEF2F2, #FFF5F5)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: "2px solid rgba(239,68,68,0.15)" }}>
            <IoAlertCircleOutline size={28} style={{ color: "#EF4444" }} />
          </div>
          <h2 style={{ color: "#0F2044", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Editing Not Allowed</h2>
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>This project has already received investments and cannot be edited. Modifying project details after investors have contributed is not permitted to protect their interests.</p>
          <button className="next_step" onClick={() => navigate(`/founder/projects/${id}`)} style={{ width: "100%" }}>View Project Details</button>
          <button className="cancel" onClick={() => navigate("/founder/projects")} style={{ width: "100%", marginTop: 10 }}>Back to My Projects</button>
        </div>
      </div>
    </>
  );

  if (loadError) return (
    <>
      <div className="topBar"><Logo /></div>
      <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#0F2044", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{loadError}</h2>
          <button className="next_step" onClick={() => navigate("/founder/projects")} style={{ marginTop: 16 }}>Back to Projects</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ── Top Bar ── */}
      <div className="topBar">
        <Logo />
        <button onClick={() => setShowExitModal(true)} className="exit_dash">Exit to Dashboard</button>
      </div>

      {/* ── Page ── */}
      <div className="page">
        <div className="header">
          <span>Dashboard / Projects / <b>Edit Project</b></span>
          <h1>Edit Project</h1>
          <span>{STEP_DESC[currentStep - 1]}</span>
        </div>

        <div className="steps">
          <EditStepper currentStep={currentStep} />
        </div>

        {renderStep()}

        {/* ── Bottom Bar ── */}
        <div className="bottom">
          <div className="bottom_buttons">
            {currentStep > 1 && <button onClick={() => setCurrentStep(p => p - 1)} className="back_step">← Back</button>}
            {currentStep === 4 ? (
              <button className="next_step submit_btn" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            ) : (
              <button className="next_step" onClick={handleNext}>Next Step</button>
            )}
            <button className="cancel" onClick={() => setShowExitModal(true)}>Cancel</button>
          </div>
          <span className="alert">
            <IoAlertCircleOutline />
            Changes will be reflected after review.
          </span>
        </div>
      </div>

      {/* ── Exit Modal ── */}
      {showExitModal && (
        <div className="kyc_modal_overlay" onClick={() => setShowExitModal(false)}>
          <div className="kyc_modal" onClick={e => e.stopPropagation()}>
            <button className="kyc_modal_close" onClick={() => setShowExitModal(false)}><FiX /></button>
            <div className="kyc_modal_icon" style={{ background: "linear-gradient(135deg, #FEF2F2, #FFF5F5)", borderColor: "rgba(239, 68, 68, 0.2)" }}>
              <IoAlertCircleOutline style={{ color: "#EF4444" }} />
            </div>
            <h3 className="kyc_modal_title">Discard Changes?</h3>
            <p className="kyc_modal_text">Are you sure you want to exit? Any unsaved changes will be lost.</p>
            <button className="kyc_modal_btn" style={{ backgroundColor: "#EF4444", boxShadow: "0 2px 8px rgba(239, 68, 68, 0.25)" }} onClick={() => navigate(`/founder/projects/${id}`)}>Discard & Exit</button>
            <button className="kyc_modal_btn_secondary" onClick={() => setShowExitModal(false)}>Keep Editing</button>
          </div>
        </div>
      )}
    </>
  );
}
