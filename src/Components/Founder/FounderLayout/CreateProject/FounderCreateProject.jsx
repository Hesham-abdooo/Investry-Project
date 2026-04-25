import React, { useState, useEffect } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { FiShield, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Stepper from "./ْ/Components/Stepper";
import Step1FundingModel from "./ْ/Components/Steps/Step1FundingModel";
import Step2ProjectDetails from "./ْ/Components/Steps/Step2ProjectsDetails";
import Step3DealDetails from "./ْ/Components/Steps/Step3DealDetails";
import Step4MediaDocs from "./ْ/Components/Steps/Step4MediaDocs";
import Step5Review from "./ْ/Components/Steps/Step5Review";
import SuccessPage from "./ْ/Components/SuccessPage";
import Logo from "../../../Basics/Logo.jsx";

import { createProject } from "./Services/Service.js";
import "./FounderCREATE.css";
import axiosInstance from "../../../../Api/axiosInstance.js";

function CreateProject() {
  const navigate = useNavigate();

  const [kycStatus, setKycStatus] = useState(null);

  const [selectedFunding, setSelectedFunding] = useState(null);
  const [selectDuration, setSelectDuration] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [projectTitle, setProjectTitle] = useState("");
  const [category, setCategory] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [minContribution, setMinContribution] = useState("");
  const [startDateOption, setStartDateOption] = useState("immediately");
  const [scheduledDate, setScheduledDate] = useState("");

  const [rewardTiers, setRewardTiers] = useState([
    { gift: "", amount: "", quantity: "" },
  ]);

  const [equityOffered, setEquityOffered] = useState("");
  const [founderProfitShare, setFounderProfitShare] = useState("");
  const [contractDuration, setContractDuration] = useState("");
  const [payoutFrequency, setPayoutFrequency] = useState("");

  const [coverImages, setCoverImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [kycModal, setKycModal] = useState({ show: false, type: '' });
  const [showExitModal, setShowExitModal] = useState(false);

  /* ── جيب الـ KYC status لما الصفحة تفتح ── */
  useEffect(() => {
    const fetchKyc = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get("/Accounts/profile", {});
        setKycStatus(res.data?.data?.kycStatus ?? "Unknown");
      } catch (err) {
        console.error("Failed to fetch KYC status", err);
        setKycStatus("Unknown");
      }
    };
    fetchKyc();
  }, []);

  const stepDescriptions = [
    "Choose the funding model that fits your project.",
    "Add project details.",
    "Provide deal terms.",
    "Upload media and documents.",
    "Review everything before submitting.",
  ];

  const handleExit = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    setShowExitModal(false);
    navigate("/founder");
  };

  const cancelExit = () => {
    setShowExitModal(false);
  };

  const handleNextStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      /* ── 1. لازم يختار funding model الأول ── */
      if (!selectedFunding) {
        newErrors.selectedFunding = "Please select a funding model";
        setErrors(newErrors);
        return;
      }

      /* ── 2. لو الـ KYC status لسه بيتحمل ── */
      if (kycStatus === null) {
        setKycModal({ show: true, type: 'loading' });
        return;
      }

      /* ── 3. بعدين نشيك KYC ── */
      if (kycStatus?.toLowerCase() !== "approved") {
        setKycModal({ show: true, type: 'required' });
        return;
      }
    }

    if (currentStep === 2) {
      if (!projectTitle.trim())
        newErrors.projectTitle = "Project title is required";
      if (!category.trim()) newErrors.category = "Category is required";
      if (!projectDescription.trim())
        newErrors.projectDescription = "Project description is required";
      if (!fundingGoal.trim())
        newErrors.fundingGoal = "Funding goal is required";
      if (!minContribution.trim())
        newErrors.minContribution = "Minimum contribution is required";
      if (!selectDuration)
        newErrors.selectDuration = "Please select a duration";
    }

    if (currentStep === 3) {
      if (selectedFunding === "Equity-Based" && !equityOffered.trim())
        newErrors.equityOffered = "Equity offered is required";
      if (selectedFunding === "Mudarabah") {
        if (!founderProfitShare.trim())
          newErrors.founderProfitShare = "Founder profit share is required";
        if (!contractDuration.trim())
          newErrors.contractDuration = "Contract duration is required";
        if (!payoutFrequency.trim())
          newErrors.payoutFrequency = "Payout frequency is required";
      }
      if (selectedFunding === "Reward-Based") {
        if (
          rewardTiers.every(
            (t) => !t.gift.trim() || !t.amount.trim() || !t.quantity.trim(),
          )
        )
          newErrors.rewardTiers = "Please fill all reward tiers";
      }
    }

    if (currentStep === 4) {
      if (coverImages.length === 0)
        newErrors.coverImages = "Please upload a cover image";
      if (documents.length === 0)
        newErrors.documents = "Please upload at least one document";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const formData = new FormData();

    formData.append("Title", projectTitle);
    formData.append("CategoryIds[0]", category);
    formData.append("ShortDescription", projectDescription);
    formData.append("LongDescription", projectDescription);
    formData.append(
      "FundingModel",
      selectedFunding === "Reward-Based"
        ? 0
        : selectedFunding === "Equity-Based"
          ? 1
          : 2,
    );
    formData.append("TargetAmount", fundingGoal);
    formData.append("MinimumContribution", minContribution);
    formData.append(
      "StartDate",
      startDateOption === "immediately"
        ? new Date(Date.now() + 10 * 60 * 1000).toISOString()
        : new Date(scheduledDate).toISOString(),
    );
    formData.append(
      "CampaignDurationInDays",
      selectDuration === "30 days"
        ? 30
        : selectDuration === "60 days"
          ? 60
          : 90,
    );
    formData.append("CoverImage", coverImages[0]);
    formData.append("EquityPercentage", equityOffered || 0);
    formData.append("InvestorsProfitSharePercentage", founderProfitShare || 0);
    formData.append(
      "DurationInMonths",
      contractDuration ? parseInt(contractDuration) : 0,
    );
    formData.append(
      "ProfitDistributionFrequency",
      payoutFrequency === "Monthly"
        ? 1
        : payoutFrequency === "Quarterly"
          ? 3
          : payoutFrequency === "Semi-annually"
            ? 6
            : 12,
    );

    if (selectedFunding === "Reward-Based") {
      rewardTiers.forEach((tier, index) => {
        formData.append(`RewardTiers[${index}][title]`, tier.gift);
        formData.append(`RewardTiers[${index}][description]`, tier.gift);
        formData.append(`RewardTiers[${index}][amount]`, tier.amount);
        formData.append(`RewardTiers[${index}][maxBackers]`, tier.quantity);
      });
    }

    // Send additional gallery images as MediaFiles
    coverImages.slice(1).forEach((img) => {
      formData.append("MediaFiles", img);
    });

    // Send documents as MediaFiles
    documents.forEach((doc) => {
      formData.append("MediaFiles", doc);
    });

    try {
      await createProject(formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <Step1FundingModel
          selectedFunding={selectedFunding}
          setSelectedFunding={setSelectedFunding}
          errors={errors}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <Step2ProjectDetails
          selectedFunding={selectedFunding}
          setCurrentStep={setCurrentStep}
          projectTitle={projectTitle}
          setProjectTitle={setProjectTitle}
          category={category}
          setCategory={setCategory}
          projectDescription={projectDescription}
          setProjectDescription={setProjectDescription}
          fundingGoal={fundingGoal}
          setFundingGoal={setFundingGoal}
          minContribution={minContribution}
          setMinContribution={setMinContribution}
          selectDuration={selectDuration}
          setSelectDuration={setSelectDuration}
          startDateOption={startDateOption}
          setStartDateOption={setStartDateOption}
          scheduledDate={scheduledDate}
          setScheduledDate={setScheduledDate}
          errors={errors}
        />
      );
    }

    if (currentStep === 3) {
      return (
        <Step3DealDetails
          selectedFunding={selectedFunding}
          fundingGoal={fundingGoal}
          minContribution={minContribution}
          selectDuration={selectDuration}
          setCurrentStep={setCurrentStep}
          rewardTiers={rewardTiers}
          setRewardTiers={setRewardTiers}
          equityOffered={equityOffered}
          setEquityOffered={setEquityOffered}
          founderProfitShare={founderProfitShare}
          setFounderProfitShare={setFounderProfitShare}
          contractDuration={contractDuration}
          setContractDuration={setContractDuration}
          payoutFrequency={payoutFrequency}
          setPayoutFrequency={setPayoutFrequency}
          errors={errors}
        />
      );
    }

    if (currentStep === 4) {
      return (
        <Step4MediaDocs
          coverImages={coverImages}
          setCoverImages={setCoverImages}
          documents={documents}
          setDocuments={setDocuments}
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          errors={errors}
        />
      );
    }

    if (currentStep === 5) {
      return (
        <Step5Review
          selectedFunding={selectedFunding}
          projectTitle={projectTitle}
          category={category}
          fundingGoal={fundingGoal}
          minContribution={minContribution}
          selectDuration={selectDuration}
          equityOffered={equityOffered}
          rewardTiers={rewardTiers}
          founderProfitShare={founderProfitShare}
          contractDuration={contractDuration}
          coverImages={coverImages}
          documents={documents}
          videoUrl={videoUrl}
          setCurrentStep={setCurrentStep}
        />
      );
    }

    return null;
  };

  if (isSubmitted) return <SuccessPage />;

  return (
    <>
      <div className="topBar">
        <Logo />
        <button onClick={handleExit} className="exit_dash">
          Exit to Dashboard
        </button>
      </div>

      <div className="page">
        <div className="header">
          <span>
            Dashboard / Projects / <b>Create Project</b>
          </span>
          <h1>Create a new project</h1>
          <span>{stepDescriptions[currentStep - 1]}</span>
        </div>

        <div className="steps">
          <Stepper currentStep={currentStep} />
        </div>

        {renderStepContent()}

        <div className="bottom">
          <div className="bottom_buttons">
            {currentStep > 1 && (
              <button onClick={handlePreviousStep} className="back_step">
                ← Back
              </button>
            )}

            {currentStep === 5 ? (
              <button
                className="next_step submit_btn"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            ) : (
              <button className="next_step" onClick={handleNextStep}>
                Next Step
              </button>
            )}

            <button className="cancel" onClick={handleExit}>
              Cancel
            </button>
          </div>

          <span className="alert">
            <IoAlertCircleOutline />
            Your project will not be published until review.
          </span>
        </div>
      </div>

      {/* ── KYC Modal ── */}
      {kycModal.show && (
        <div className="kyc_modal_overlay" onClick={() => setKycModal({ show: false, type: '' })}>
          <div className="kyc_modal" onClick={(e) => e.stopPropagation()}>
            <button className="kyc_modal_close" onClick={() => setKycModal({ show: false, type: '' })}>
              <FiX />
            </button>
            <div className="kyc_modal_icon">
              <FiShield />
            </div>
            {kycModal.type === 'loading' ? (
              <>
                <h3 className="kyc_modal_title">Checking Verification</h3>
                <p className="kyc_modal_text">
                  We're checking your KYC verification status. Please wait a moment and try again.
                </p>
                <button className="kyc_modal_btn" onClick={() => setKycModal({ show: false, type: '' })}>
                  Try Again
                </button>
              </>
            ) : (
              <>
                <h3 className="kyc_modal_title">KYC Verification Required</h3>
                <p className="kyc_modal_text">
                  You need to complete your identity verification before creating a project. This ensures trust and security for all users on the platform.
                </p>
                <button className="kyc_modal_btn" onClick={() => navigate("/founder/profile")}>
                  Verify Identity
                </button>
                <button className="kyc_modal_btn_secondary" onClick={() => setKycModal({ show: false, type: '' })}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Exit Confirmation Modal (same style as KYC modal) ── */}
      {showExitModal && (
        <div className="kyc_modal_overlay" onClick={cancelExit}>
          <div className="kyc_modal" onClick={(e) => e.stopPropagation()}>
            <button className="kyc_modal_close" onClick={cancelExit}>
              <FiX />
            </button>
            <div className="kyc_modal_icon" style={{ background: 'linear-gradient(135deg, #FEF2F2, #FFF5F5)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <IoAlertCircleOutline style={{ color: '#EF4444' }} />
            </div>
            <h3 className="kyc_modal_title">Discard Changes?</h3>
            <p className="kyc_modal_text">
              Are you sure you want to exit? Your progress has not been saved and any details you've entered will be lost.
            </p>
            <button className="kyc_modal_btn" style={{ backgroundColor: '#EF4444', boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)' }} onClick={confirmExit}>
              Discard & Exit
            </button>
            <button className="kyc_modal_btn_secondary" onClick={cancelExit}>
              Keep Editing
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateProject;
