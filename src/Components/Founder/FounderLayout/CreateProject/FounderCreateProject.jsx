import React, { useState } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import Stepper from "./ْ/Components/Stepper";
import Step1FundingModel from "./ْ/Components/Steps/Step1FundingModel";
import "./FounderCREATE.css";
import Step2ProjectDetails from "./ْ/Components/Steps/Step2ProjectsDetails";
import Step3DealDetails from "./ْ/Components/Steps/Step3DealDetails";
import Step4MediaDocs from "./ْ/Components/Steps/Step4MediaDocs";
import Step5Review from "./ْ/Components/Steps/Step5Review";
import SuccessPage from "./ْ/Components/SuccessPage";
import DiamondIcon from "./ْ/Components/DiamondIcon";

function CreateProject() {
  const [selectedFunding, setSelectedFunding] = useState(null);
  const [selectDuration, setSelectDuration] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Step 2 fields
  const [projectTitle, setProjectTitle] = useState("");
  const [category, setCategory] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [minContribution, setMinContribution] = useState("");
  const [startDateOption, setStartDateOption] = useState("immediately");
  const [scheduledDate, setScheduledDate] = useState("");

  // Step 3 Reward tiers
  const [rewardTiers, setRewardTiers] = useState([
    { gift: "", amount: "", quantity: "" },
  ]);

  // Step 3 Equity
  const [equityOffered, setEquityOffered] = useState("");

  // Step 3 Mudarabah
  const [founderProfitShare, setFounderProfitShare] = useState("");
  const [contractDuration, setContractDuration] = useState("");
  const [payoutFrequency, setPayoutFrequency] = useState("");

  // Step 4 Media & Docs
  const [coverImages, setCoverImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");

  const formatNumber = (num) => {
    if (!num) return "0";
    return Number(num).toLocaleString();
  };

  const isStep2Valid =
    projectTitle.trim() !== "" &&
    category.trim() !== "" &&
    projectDescription.trim() !== "" &&
    fundingGoal.trim() !== "" &&
    minContribution.trim() !== "" &&
    selectDuration !== null;

  const isStep3Valid = (() => {
    if (selectedFunding === "Equity-Based") return equityOffered.trim() !== "";
    if (selectedFunding === "Reward-Based")
      return (
        rewardTiers.length > 0 &&
        rewardTiers.every(
          (t) =>
            t.gift.trim() !== "" &&
            t.amount.trim() !== "" &&
            t.quantity.trim() !== "",
        )
      );
    if (selectedFunding === "Mudarabah")
      return (
        founderProfitShare.trim() !== "" &&
        contractDuration.trim() !== "" &&
        payoutFrequency.trim() !== ""
      );
    return true;
  })();

  const isStep4Valid = coverImages.length > 0 && documents.length > 0;

  const stepDescriptions = [
    "Choose the funding model that fits your project. You can change it before submitting for review.",
    "Add your project's title, description, and schedule so investors can learn more.",
    "Provide deal terms, funding goal, and investor equity details.",
    "Upload media, documents, and supporting materials for your project.",
    "Review all details before submitting for approval.",
  ];

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedFunding) {
      return;
    }
    if (currentStep === 2 && !isStep2Valid) {
      return;
    }
    if (currentStep === 3 && !isStep3Valid) {
      return;
    }
    if (currentStep === 4 && !isStep4Valid) {
      return;
    }
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 5));
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <Step1FundingModel
          selectedFunding={selectedFunding}
          setSelectedFunding={setSelectedFunding}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <>
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
          />
        </>
      );
    }

    if (currentStep === 3) {
      return (
        <Step3DealDetails
          selectedFunding={selectedFunding}
          setCurrentStep={setCurrentStep}
          fundingGoal={fundingGoal}
          minContribution={minContribution}
          selectDuration={selectDuration}
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
        />
      );
    }
    if (currentStep === 5) {
      return (
        <Step5Review
          selectedFunding={selectedFunding}
          setCurrentStep={setCurrentStep}
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
        />
      );
    }

    return null;
  };

  if (isSubmitted) {
    return <SuccessPage />;
  }

  return (
    <>
      <div className="topBar">
        <div className="logo">
          <DiamondIcon />
          <span>InvesTry</span>
        </div>
        <button type="button" className="exit_dash">
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
            {currentStep >= 2 && (
              <button
                type="button"
                className="back_step"
                onClick={handlePreviousStep}
              >
                ← Back
              </button>
            )}
            {currentStep === 5 ? (
              <button
                type="button"
                className="next_step submit_btn"
                onClick={() => setIsSubmitted(true)}
              >
                Create
              </button>
            ) : (
              <button
                type="button"
                className="next_step"
                onClick={handleNextStep}
                disabled={
                  (currentStep === 1 && !selectedFunding) ||
                  (currentStep === 2 && !isStep2Valid) ||
                  (currentStep === 3 && !isStep3Valid) ||
                  (currentStep === 4 && !isStep4Valid)
                }
              >
                Next Step
              </button>
            )}
            <button
              type="button"
              className="save_draft"
              onClick={() =>
                alert(
                  "Funding model saved as draft.\nSelected: " + selectedFunding,
                )
              }
            >
              Save as draft
            </button>
            <button
              type="button"
              className="cancel"
              onClick={() => alert("Project creation cancelled.")}
            >
              Cancel
            </button>
          </div>
          <span className="alert">
            <IoAlertCircleOutline />
            Your project will not be published until it is reviewed and
            approved.
          </span>
        </div>
      </div>
    </>
  );
}

export default CreateProject;
