import React, { useState } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import Stepper from "./ْ/Components/Stepper";
import Step1FundingModel from "./ْ/Components/Steps/Step1FundingModel";
import Step2ProjectDetails from "./ْ/Components/Steps/Step2ProjectsDetails";
import Step3DealDetails from "./ْ/Components/Steps/Step3DealDetails";
import Step4MediaDocs from "./ْ/Components/Steps/Step4MediaDocs";
import Step5Review from "./ْ/Components/Steps/Step5Review";
import SuccessPage from "./ْ/Components/SuccessPage";
import DiamondIcon from "./ْ/Components/DiamondIcon";

import "./FounderCREATE.css";

function CreateProject() {
  const navigate = useNavigate();

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

  const stepDescriptions = [
    "Choose the funding model that fits your project.",
    "Add project details.",
    "Provide deal terms.",
    "Upload media and documents.",
    "Review everything before submitting.",
  ];

  const handleExit = () => {
    const confirmExit = window.confirm(
      "Are you sure you want to exit? Your progress may not be saved."
    );

    if (confirmExit) {
      navigate("/founder/FounderDashboard");
    }
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
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
        <Step2ProjectDetails
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
      );
    }

    if (currentStep === 3) {
      return (
        <Step3DealDetails
          selectedFunding={selectedFunding}
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

  if (isSubmitted) return <SuccessPage />;

  return (
    <>
      <div className="topBar">
        <div className="logo">
          <DiamondIcon />
          <span>InvesTry</span>
        </div>

        {/* ✅ هنا التعديل */}
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
                onClick={() => setIsSubmitted(true)}
              >
                Create
              </button>
            ) : (
              <button className="next_step" onClick={handleNextStep}>
                Next Step
              </button>
            )}

            <button
              className="save_draft"
              onClick={() => alert("Saved as draft")}
            >
              Save as draft
            </button>

            <button
              className="cancel"
              onClick={() => alert("Cancelled")}
            >
              Cancel
            </button>
          </div>

          <span className="alert">
            <IoAlertCircleOutline />
            Your project will not be published until review.
          </span>
        </div>
      </div>
    </>
  );
}

export default CreateProject;