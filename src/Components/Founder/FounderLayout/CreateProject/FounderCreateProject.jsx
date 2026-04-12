import React from 'react'







import React, { useState } from 'react';
import { FaGift } from "react-icons/fa6";
import { FiPieChart } from "react-icons/fi";
import { FaBuildingColumns } from "react-icons/fa6";
import { IoAlertCircleOutline } from "react-icons/io5";
import { CiCircleCheck } from "react-icons/ci";
import './FounderCREATE.css';


const DiamondIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gemGrad" x1="10" y1="8" x2="26" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F5D060" />
        <stop offset="50%" stopColor="#D4A017" />
        <stop offset="100%" stopColor="#A67C00" />
      </linearGradient>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1a2744" />
        <stop offset="100%" stopColor="#0F2044" />
      </linearGradient>
    </defs>
    <rect width="36" height="36" rx="10" fill="url(#bgGrad)" />
    <path d="M18 8L10 15l8 13 8-13-8-7z" fill="url(#gemGrad)" opacity="0.2" />
    <path d="M18 8L10 15l8 13 8-13-8-7z" stroke="url(#gemGrad)" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
    <path d="M10 15h16" stroke="url(#gemGrad)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M14 8l-4 7M22 8l4 7" stroke="url(#gemGrad)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 28l-4-13M18 28l4-13" stroke="url(#gemGrad)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 8h8" stroke="url(#gemGrad)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M13 13l5-5 5 5" stroke="#F5D060" strokeWidth="0.6" opacity="0.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)


const steps = [
  "Funding model",
  "Project details",
  "Deal details",
  "Media & docs",
  "Review"
];
const Stepper = ({ currentStep = 1 }) => {
  return (
    <div className="stepper-container">
      <div className="stepper-header">STEP {currentStep} OF {steps.length}</div>

      <div className="stepper">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={index} className="step-wrapper">
              <div
                className={`step-circle 
                  ${isActive ? "active" : ""} 
                  ${isCompleted ? "completed" : ""}`}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>

              <div className="step-label">{step}</div>

              {index !== steps.length - 1 && (
                <div className="step-line"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

function CreateProject() {

  const [selectedFunding, setSelectedFunding] = useState(null);
  const [selectDuration, setSelectDuration] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Step 2 fields
  const [projectTitle, setProjectTitle] = useState('');
  const [category, setCategory] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [minContribution, setMinContribution] = useState('');
  const [startDateOption, setStartDateOption] = useState('immediately');
  const [scheduledDate, setScheduledDate] = useState('');

  // Step 3 Reward tiers
  const [rewardTiers, setRewardTiers] = useState([
    { gift: '', amount: '', quantity: '' }
  ]);

  // Step 3 Equity
  const [equityOffered, setEquityOffered] = useState('');

  // Step 3 Mudarabah
  const [founderProfitShare, setFounderProfitShare] = useState('');
  const [contractDuration, setContractDuration] = useState('');
  const [payoutFrequency, setPayoutFrequency] = useState('');

  // Step 4 Media & Docs
  const [coverImages, setCoverImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');

  const handleCoverImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setCoverImages(prev => [...prev, ...files]);
  };

  const handleCoverImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setCoverImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setCoverImages(coverImages.filter((_, i) => i !== index));
  };

  const handleDocumentsUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(prev => [...prev, ...files]);
  };

  const handleDocumentsDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setDocuments(prev => [...prev, ...files]);
  };

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const addTier = () => {
    setRewardTiers([...rewardTiers, { gift: '', amount: '', quantity: '' }]);
  };

  const removeTier = (index) => {
    setRewardTiers(rewardTiers.filter((_, i) => i !== index));
  };

  const updateTier = (index, field, value) => {
    const updated = [...rewardTiers];
    updated[index] = { ...updated[index], [field]: value };
    setRewardTiers(updated);
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return Number(num).toLocaleString();
  };

  const isStep2Valid = projectTitle.trim() !== '' && category.trim() !== '' && projectDescription.trim() !== '' && fundingGoal.trim() !== '' && minContribution.trim() !== '' && selectDuration !== null;

  const isStep3Valid = (() => {
    if (selectedFunding === 'Equity-Based') return equityOffered.trim() !== '';
    if (selectedFunding === 'Reward-Based') return rewardTiers.length > 0 && rewardTiers.every(t => t.gift.trim() !== '' && t.amount.trim() !== '' && t.quantity.trim() !== '');
    if (selectedFunding === 'Mudarabah') return founderProfitShare.trim() !== '' && contractDuration.trim() !== '' && payoutFrequency.trim() !== '';
    return true;
  })();

  const isStep4Valid = coverImages.length > 0 && documents.length > 0;

  const stepDescriptions = [
    "Choose the funding model that fits your project. You can change it before submitting for review.",
    "Add your project's title, description, and schedule so investors can learn more.",
    "Provide deal terms, funding goal, and investor equity details.",
    "Upload media, documents, and supporting materials for your project.",
    "Review all details before submitting for approval."
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
    setCurrentStep(prevStep => Math.min(prevStep + 1, steps.length));
  };

  const handlePreviousStep = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 1));
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <div className='funding_container'>
          <div
            className={`funding_card ${selectedFunding === 'Reward-Based' ? 'selected' : ''}`}
            onClick={() => setSelectedFunding('Reward-Based')}
          >
            <div className="card_icon">
              <FaGift />
            </div>
            <h3>Reward-Based</h3>
            <p className="card_description">Offer perks or exclusive products to backers.</p>
            <div className="ideal_for">
              <h4>IDEAL FOR</h4>
              <p>Creative projects, new products, community campaigns.</p>
            </div>
          </div>

          <div
            className={`funding_card ${selectedFunding === 'Equity-Based' ? 'selected' : ''}`}
            onClick={() => setSelectedFunding('Equity-Based')}
          >
            <div className="card_icon">
              <FiPieChart />
            </div>
            <h3>Equity-Based</h3>
            <p className="card_description">Offer investors ownership shares in exchange for funding.</p>
            <div className="ideal_for">
              <h4>IDEAL FOR</h4>
              <p>Tech startups and high-growth ventures.</p>
            </div>
          </div>

          <div
            className={`funding_card ${selectedFunding === 'Mudarabah' ? 'selected' : ''}`}
            onClick={() => setSelectedFunding('Mudarabah')}
          >
            <div className="card_icon">
              <FaBuildingColumns />
            </div>
            <h3>Mudarabah</h3>
            <p className="card_description">Share profits with investors under Sharia-compliant terms.</p>
            <div className="ideal_for">
              <h4>IDEAL FOR</h4>
              <p>Sharia-compliant investments and business projects of all sizes.</p>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <>
          <div className='current_model'>
            <div className='current_model_left'>
              <div className='model_icon'>
                <CiCircleCheck />
              </div>
              <h3>Selected model: <span>{selectedFunding}</span></h3>
            </div>
            <button type="button" className='change_link' onClick={() => setCurrentStep(1)}>Change</button>
          </div>

          <div className="min-h-screen bg-gray-50 p-8 font-sans text-slate-700" bg-white>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">

              {/* Left Column: Project Story */}
              <section className="space-y-8">
                <h2 className="text-2xl font-bold text-slate-800">Project Story</h2>

                <div className="space-y-6">
                  {/* Project Title */}
                  <div className="space-y-2">
                    <label className="block font-semibold">
                      Project title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder=""
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F2044] outline-none transition bg-white"
                    />
                    <p className="text-sm text-gray-400">Keep it clear and specific.</p>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="block font-semibold">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-[#0F2044] outline-none cursor-pointer"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Select a category</option>
                        <option value="Technology & Environment">Technology & Environment</option>
                        <option value="Health & Wellness">Health & Wellness</option>
                        <option value="Education">Education</option>
                        <option value="Finance">Finance</option>
                        <option value="Real Estate">Real Estate</option>
                      </select>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div className="space-y-2">
                    <label className="block font-semibold">
                      Project description <span className="text-red-500">*</span>
                    </label>
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                      {/* Toolbar */}
                      <div className="flex items-center gap-4 p-3 border-b border-gray-100 bg-gray-50/50">
                        <span className="text-gray-400">T</span>
                      </div>
                      {/* Text Area */}
                      <textarea
                        className="w-full p-4 h-48 outline-none resize-none text-sm leading-relaxed bg-white"
                        placeholder=""
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 pt-1">
                      <span>Explain the problem, your solution, and how funds will be used.</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="block font-semibold text-gray-600">
                      Location <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Cairo, Egypt"
                        className="w-full p-3 border border-gray-200 rounded-lg pr-10 focus:ring-2 focus:ring-[#0F2044] outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Right Column: Funding & Campaign */}
              <section className="space-y-8">
                <h2 className="text-2xl font-bold text-slate-800">Funding & Campaign</h2>

                <div className="space-y-6">
                  {/* Funding Goal */}
                  <div className="space-y-2">
                    <label className="block font-semibold">
                      Funding goal <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="bg-gray-100 border border-r-0 border-gray-200 px-4 py-3 rounded-l-lg text-gray-500 font-medium">EGP</span>
                      <input
                        type="text"
                        placeholder=""
                        value={fundingGoal}
                        onChange={(e) => setFundingGoal(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full p-3 border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-[#0F2044] outline-none"
                      />
                    </div>
                    <p className="text-sm text-gray-400">Total amount you want to raise to complete your project.</p>
                  </div>

                  {/* Minimum Contribution */}
                  <div className="space-y-2">
                    <label className="block font-semibold">
                      Minimum contribution <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="bg-gray-100 border border-r-0 border-gray-200 px-4 py-3 rounded-l-lg text-gray-500 font-medium">EGP</span>
                      <input
                        type="text"
                        placeholder=""
                        value={minContribution}
                        onChange={(e) => setMinContribution(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full p-3 border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-[#0F2044] outline-none"
                      />
                    </div>
                    <p className="text-sm text-gray-400">The smallest amount a person can invest in this campaign.</p>
                  </div>

                  {/* Campaign Duration */}
                  <div className="space-y-2">
                    <label className="block font-semibold">
                      Campaign duration <span className="text-red-500">*</span>
                    </label>
                    <div className="duration-btns">
                      <button type="button" className={selectDuration === '30 days' ? 'duration-selected' : ''} onClick={() => setSelectDuration('30 days')}>30 days</button>
                      <button type="button" className={selectDuration === '60 days' ? 'duration-selected' : ''} onClick={() => setSelectDuration('60 days')}>60 days</button>
                      <button type="button" className={selectDuration === '90 days' ? 'duration-selected' : ''} onClick={() => setSelectDuration('90 days')}>90 days</button>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <p className="text-sm text-gray-400">You can adjust this before final submission.</p>
                    </div>
                  </div>

                  {/* Campaign Start Date */}
                  <div className="start_date_group">
                    <label className="start_date_label">Campaign start date</label>

                    {/* Immediately Option */}
                    <label
                      className={`start_date_option ${startDateOption === 'immediately' ? 'start_date_selected' : ''}`}
                      onClick={() => setStartDateOption('immediately')}
                    >
                      <div className={`start_date_radio ${startDateOption === 'immediately' ? 'start_date_radio_active' : ''}`}>
                        {startDateOption === 'immediately' && (
                          <div className="start_date_radio_dot"></div>
                        )}
                      </div>
                      <span className="start_date_text">Start immediately upon approval</span>
                    </label>

                    {/* Schedule Option */}
                    <label
                      className={`start_date_option ${startDateOption === 'schedule' ? 'start_date_selected' : ''}`}
                      onClick={() => setStartDateOption('schedule')}
                    >
                      <div className={`start_date_radio ${startDateOption === 'schedule' ? 'start_date_radio_active' : ''}`}>
                        {startDateOption === 'schedule' && (
                          <div className="start_date_radio_dot"></div>
                        )}
                      </div>
                      <span className="start_date_text">Schedule a specific start date</span>
                    </label>

                    {startDateOption === 'schedule' && (
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="start_date_input"
                      />
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </>
      );
    }

    if (currentStep === 3) {
      const step3Content = () => {
        if (selectedFunding === 'Reward-Based') return (
          <div className='tiers_container'>
            {rewardTiers.map((tier, index) => (
              <div className='tier_card' key={index}>
                <div className='tier_header'>
                  <h3 className='tier_title'>Tier {index + 1}</h3>
                  {index > 0 && (
                    <button type="button" className='tier_remove' onClick={() => removeTier(index)}>🗑 Remove</button>
                  )}
                </div>
                <div className='tier_fields'>
                  <div className='tier_field tier_field_gift'>
                    <label className='tier_label'>Gift <span className='tier_required'>*</span></label>
                    <input
                      type="text"
                      className='tier_input'
                      placeholder={index === 0 ? 'Early Bird Supporter Kit' : 'e.g., Special thank-you gift'}
                      value={tier.gift}
                      onChange={(e) => updateTier(index, 'gift', e.target.value)}
                    />
                  </div>
                  <div className='tier_field tier_field_amount'>
                    <label className='tier_label'>Amount (EGP) <span className='tier_required'>*</span></label>
                    <div className='tier_amount_input'>
                      <span className='tier_egp_badge'>EGP</span>
                      <input
                        type="text"
                        className='tier_input'
                        placeholder={index === 0 ? '500' : 'e.g., 500'}
                        value={tier.amount}
                        onChange={(e) => updateTier(index, 'amount', e.target.value.replace(/[^0-9]/g, ''))}
                      />
                    </div>
                  </div>
                  <div className='tier_field tier_field_qty'>
                    <label className='tier_label'>Quantity <span className='tier_required'>*</span></label>
                    <input
                      type="text"
                      className='tier_input'
                      placeholder={index === 0 ? '50' : 'e.g., 100'}
                      value={tier.quantity}
                      onChange={(e) => updateTier(index, 'quantity', e.target.value.replace(/[^0-9]/g, ''))}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className='add_tier_btn' onClick={addTier}>+ Add another tier</button>
          </div>
        );
        if (selectedFunding === 'Equity-Based') return (
          <div className='tiers_container'>
            <div className='tier_card'>
              <div className='tier_fields' style={{ gridTemplateColumns: '1fr' }}>
                <div className='tier_field'>
                  <label className='tier_label'>
                    Equity offered (%) <span className='tier_required'>*</span>
                    <span className='equity_info_icon' title='The percentage of your company you are offering to investors in exchange for the funding goal.'>
                      <IoAlertCircleOutline />
                    </span>
                  </label>
                  <div className='equity_input_wrapper'>
                    <input
                      type="text"
                      className='tier_input'
                      placeholder='10'
                      value={equityOffered}
                      onChange={(e) => setEquityOffered(e.target.value.replace(/[^0-9.]/g, ''))}
                    />
                    <span className='equity_pct_badge'>%</span>
                  </div>
                  <p className='equity_helper_text'>Enter the percentage of the entire company you will offer for the funding goal shown above.</p>
                </div>
              </div>
            </div>
          </div>
        );
        if (selectedFunding === 'Mudarabah') return (
          <div className='tiers_container'>
            <div className='tier_card'>
              <div className='mudarabah_fields'>
                {/* Founder Profit Share */}
                <div className='tier_field'>
                  <label className='tier_label'>
                    Founder profit share (%) <span className='tier_required'>*</span>
                  </label>
                  <div className='equity_input_wrapper'>
                    <input
                      type="text"
                      className='tier_input'
                      placeholder='e.g., 60'
                      value={founderProfitShare}
                      onChange={(e) => setFounderProfitShare(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                    <span className='equity_pct_badge'>%</span>
                  </div>
                  <p className='equity_helper_text'>Your percentage of the project's total profit.</p>
                </div>

                {/* Contract Duration */}
                <div className='tier_field'>
                  <label className='tier_label'>
                    Contract duration <span className='tier_required'>*</span>
                  </label>
                  <select
                    className='tier_select'
                    value={contractDuration}
                    onChange={(e) => setContractDuration(e.target.value)}
                  >
                    <option value=''>Select duration</option>
                    <option value='6 months'>6 months</option>
                    <option value='12 months'>12 months</option>
                    <option value='18 months'>18 months</option>
                    <option value='24 months'>24 months</option>
                    <option value='36 months'>36 months</option>
                  </select>
                </div>

                {/* Profit Payout Frequency */}
                <div className='tier_field'>
                  <label className='tier_label'>
                    Profit payout frequency (months) <span className='tier_required'>*</span>
                  </label>
                  <select
                    className='tier_select'
                    value={payoutFrequency}
                    onChange={(e) => setPayoutFrequency(e.target.value)}
                  >
                    <option value=''>Select frequency</option>
                    <option value='Monthly'>Monthly</option>
                    <option value='Quarterly'>Quarterly (3 months)</option>
                    <option value='Semi-annually'>Semi-annually (6 months)</option>
                    <option value='Annually'>Annually (12 months)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
        return null;
      };

      return (
        <>
          <div className='summary_bar'>
            <div className='summary_item summary_item_border'>
              <span className='summary_label'>SELECTED MODEL</span>
              <div className='summary_value'>
                {selectedFunding} <button type="button" className='change_link' onClick={() => setCurrentStep(1)}>Change</button>
              </div>
            </div>
            <div className='summary_item summary_item_border'>
              <span className='summary_label'>FUNDING GOAL</span>
              <span className='summary_value'>EGP {formatNumber(fundingGoal)}</span>
            </div>
            <div className='summary_item summary_item_border'>
              <span className='summary_label'>MINIMUM CONTRIBUTION</span>
              <span className='summary_value'>EGP {formatNumber(minContribution)}</span>
            </div>
            <div className='summary_item'>
              <span className='summary_label'>DURATION</span>
              <span className='summary_value'>{selectDuration}</span>
            </div>
          </div>
          {step3Content()}
        </>
      );
    }

    if (currentStep === 4) {
      return (
        <div className='media_container'>
          {/* Left Column: Visual Presentation */}
          <div className='media_card'>
            <h2 className='media_card_title'>Visual Presentation</h2>

            <div className='media_field'>
              <label className='tier_label'>Project Cover Image <span className='tier_required'>*</span></label>
              <div
                className='upload_zone'
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleCoverImageDrop}
                onClick={() => document.getElementById('coverImageInput').click()}
              >
                <div className='upload_icon upload_icon_image'>🖼</div>
                <p className='upload_text'><span className='upload_link'>Click to upload</span> or drag and drop</p>
                <p className='upload_hint'>SVG, PNG, JPG or GIF (max. 5MB)</p>
                <input
                  id='coverImageInput'
                  type='file'
                  accept='.svg,.png,.jpg,.jpeg,.gif'
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleCoverImageUpload}
                />
              </div>
              <p className='equity_helper_text'>This image will be used as the thumbnail on the campaign discovery page. Recommended ratio 16:9.</p>

              {coverImages.map((img, index) => (
                <div className='uploaded_file' key={index}>
                  <div className='uploaded_file_info'>
                    <span className='file_icon file_icon_img'>🖼</span>
                    <div className='file_details'>
                      <span className='file_name'>{img.name}</span>
                      <span className='file_size'>{formatFileSize(img.size)}</span>
                    </div>
                  </div>
                  <button type='button' className='file_remove' onClick={() => removeImage(index)}>🗑</button>
                </div>
              ))}
            </div>

            <div className='media_field'>
              <label className='tier_label'>Promotional Video URL <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span></label>
              <input
                type='text'
                className='tier_input'
                placeholder='e.g. https://youtube.com/watch?v=...'
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <p className='equity_helper_text'>Adding a video can increase funding success by up to 30%. Provide a valid YouTube or Vimeo link.</p>
            </div>
          </div>

          {/* Right Column: Required Documents */}
          <div className='media_card'>
            <h2 className='media_card_title'>Required Documents</h2>

            <div className='media_field'>
              <label className='tier_label'>Pitch Deck & Financials <span className='tier_required'>*</span></label>
              <div
                className='upload_zone'
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDocumentsDrop}
                onClick={() => document.getElementById('documentsInput').click()}
              >
                <div className='upload_icon upload_icon_doc'>📄</div>
                <p className='upload_text'><span className='upload_link'>Click to upload</span> or drag and drop</p>
                <p className='upload_hint'>PDF documents only (max. 15MB per file)</p>
                <input
                  id='documentsInput'
                  type='file'
                  accept='.pdf'
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleDocumentsUpload}
                />
              </div>
              <p className='equity_helper_text'>Include your business plan, cap table, and financial projections. You can upload multiple files.</p>

              {documents.map((doc, index) => (
                <div className='uploaded_file' key={index}>
                  <div className='uploaded_file_info'>
                    <span className='file_icon file_icon_doc'>📄</span>
                    <div className='file_details'>
                      <span className='file_name'>{doc.name}</span>
                      <span className='file_size'>{formatFileSize(doc.size)}</span>
                    </div>
                  </div>
                  <button type='button' className='file_remove' onClick={() => removeDocument(index)}>🗑</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    if (currentStep === 5) {
      const formatGoalShort = (num) => {
        if (!num) return 'EGP 0';
        const n = Number(num);
        if (n >= 1000000) return 'EGP ' + (n / 1000000).toFixed(1) + 'M';
        if (n >= 1000) return 'EGP ' + (n / 1000).toFixed(0) + 'K';
        return 'EGP ' + n.toLocaleString();
      };

      const renderDealDetails = () => {
        if (selectedFunding === 'Equity-Based') return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: '"Nimbus Sans", sans-serif' }}>EQUITY OFFERED</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#D4A017', fontFamily: '"Nimbus Sans", sans-serif' }}>{equityOffered}%</span>
            </div>
          </div>
        );
        if (selectedFunding === 'Reward-Based') return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: '"Nimbus Sans", sans-serif' }}>REWARD TIERS</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#D4A017', fontFamily: '"Nimbus Sans", sans-serif' }}>{rewardTiers.length} tier{rewardTiers.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        );
        if (selectedFunding === 'Mudarabah') return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: '"Nimbus Sans", sans-serif' }}>FOUNDER PROFIT SHARE</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#D4A017', fontFamily: '"Nimbus Sans", sans-serif' }}>{founderProfitShare}%</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: '"Nimbus Sans", sans-serif' }}>CONTRACT DURATION</span>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937', fontFamily: '"Nimbus Sans", sans-serif' }}>{contractDuration}</span>
            </div>
          </div>
        );
        return null;
      };

      const previewImageUrl = coverImages.length > 0 ? URL.createObjectURL(coverImages[0]) : null;

      // Shared inline styles
      const sectionStyle = { backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' };
      const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #f0f0f0' };
      const titleRowStyle = { display: 'flex', alignItems: 'center', gap: '10px' };
      const iconStyle = { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f4ff', fontSize: '14px', flexShrink: 0 };
      const sectionTitleStyle = { fontSize: '16px', fontWeight: 700, color: '#1f2937', margin: 0, fontFamily: '"Nimbus Sans", sans-serif' };
      const editBtnStyle = { background: 'none', border: 'none', color: '#0F2044', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"Nimbus Sans", sans-serif', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '6px' };
      const rowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' };
      const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '4px' };
      const labelStyle = { fontSize: '10px', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: '"Nimbus Sans", sans-serif' };
      const valueStyle = { fontSize: '14px', fontWeight: 500, color: '#1f2937', fontFamily: '"Nimbus Sans", sans-serif' };
      const highlightStyle = { ...valueStyle, color: '#D4A017', fontWeight: 700 };

      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start', marginTop: '10px' }}>
          {/* Left Column: Review Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Funding Model */}
            <div style={sectionStyle}>
              <div style={headerStyle}>
                <div style={titleRowStyle}>
                  <div style={iconStyle}>⚙</div>
                  <h3 style={sectionTitleStyle}>Funding model</h3>
                </div>
                <button type="button" style={editBtnStyle} onClick={() => setCurrentStep(1)}>✏ Edit</button>
              </div>
              <div style={{ ...rowStyle, marginBottom: '0' }}>
                <div style={fieldStyle}>
                  <span style={labelStyle}>MODEL</span>
                  <span style={valueStyle}>{selectedFunding}</span>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div style={sectionStyle}>
              <div style={headerStyle}>
                <div style={titleRowStyle}>
                  <div style={iconStyle}>📋</div>
                  <h3 style={sectionTitleStyle}>Project details</h3>
                </div>
                <button type="button" style={editBtnStyle} onClick={() => setCurrentStep(2)}>✏ Edit</button>
              </div>
              <div style={{ ...rowStyle, gridTemplateColumns: '1fr' }}>
                <div style={fieldStyle}>
                  <span style={labelStyle}>PROJECT TITLE</span>
                  <span style={valueStyle}>{projectTitle}</span>
                </div>
              </div>
              <div style={rowStyle}>
                <div style={fieldStyle}>
                  <span style={labelStyle}>CATEGORY</span>
                  <span style={valueStyle}>{category}</span>
                </div>
                <div style={fieldStyle}>
                  <span style={labelStyle}>FUNDING GOAL</span>
                  <span style={highlightStyle}>EGP {formatNumber(fundingGoal)}</span>
                </div>
              </div>
              <div style={{ ...rowStyle, marginBottom: '0' }}>
                <div style={fieldStyle}>
                  <span style={labelStyle}>MIN. CONTRIBUTION</span>
                  <span style={valueStyle}>EGP {formatNumber(minContribution)}</span>
                </div>
                <div style={fieldStyle}>
                  <span style={labelStyle}>DURATION</span>
                  <span style={valueStyle}>{selectDuration}</span>
                </div>
              </div>
            </div>

            {/* Deal Details */}
            <div style={sectionStyle}>
              <div style={headerStyle}>
                <div style={titleRowStyle}>
                  <div style={iconStyle}>📊</div>
                  <h3 style={sectionTitleStyle}>Deal details</h3>
                </div>
                <button type="button" style={editBtnStyle} onClick={() => setCurrentStep(3)}>✏ Edit</button>
              </div>
              {renderDealDetails()}
            </div>

            {/* Media & Documents */}
            <div style={sectionStyle}>
              <div style={headerStyle}>
                <div style={titleRowStyle}>
                  <div style={iconStyle}>📎</div>
                  <h3 style={sectionTitleStyle}>Media & documents</h3>
                </div>
                <button type="button" style={editBtnStyle} onClick={() => setCurrentStep(4)}>✏ Edit</button>
              </div>
              <div style={rowStyle}>
                <div style={fieldStyle}>
                  <span style={labelStyle}>IMAGES</span>
                  <span style={valueStyle}>{coverImages.length} Uploaded</span>
                </div>
                <div style={fieldStyle}>
                  <span style={labelStyle}>VIDEO</span>
                  <span style={valueStyle}>{videoUrl ? 'Link provided' : 'Not provided'}</span>
                </div>
              </div>
              <div style={{ ...rowStyle, marginBottom: '0' }}>
                <div style={fieldStyle}>
                  <span style={labelStyle}>DOCUMENTS</span>
                  <span style={valueStyle}>{documents.length} Uploaded</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Project Preview */}
          <div style={{ position: 'sticky', top: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: '"Nimbus Sans", sans-serif' }}>PROJECT PREVIEW</span>
            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              {previewImageUrl ? (
                <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                  <img src={previewImageUrl} alt='Cover' style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <span style={{ position: 'absolute', bottom: '10px', left: '10px', display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: 'rgba(15,32,68,0.8)', color: 'white', fontSize: '11px', fontWeight: 600, padding: '5px 10px', borderRadius: '6px', fontFamily: '"Nimbus Sans", sans-serif', backdropFilter: 'blur(4px)' }}>
                    <FiPieChart style={{ fontSize: '12px', backgroundColor: 'transparent' }} /> {selectedFunding}
                  </span>
                </div>
              ) : (
                <div style={{ width: '100%', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', color: '#9ca3af', fontSize: '14px', fontFamily: '"Nimbus Sans", sans-serif' }}>
                  <span>No image uploaded</span>
                </div>
              )}
              <div style={{ padding: '18px 20px 22px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#D4A017', letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: '"Nimbus Sans", sans-serif' }}>{category || 'CATEGORY'}</span>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F2044', margin: 0, lineHeight: '1.4', fontFamily: '"Nimbus Sans", sans-serif' }}>{projectTitle || 'Project Title'}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#9ca3af', fontFamily: '"Nimbus Sans", sans-serif' }}>Funding Goal</span>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F2044', fontFamily: '"Nimbus Sans", sans-serif' }}>{formatGoalShort(fundingGoal)}</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', fontFamily: '"Nimbus Sans", sans-serif', margin: 0, fontStyle: 'italic' }}>This is how your project might appear in the marketplace.</p>
          </div>
        </div>
      )
    }

    return null;
  };

  if (isSubmitted) {
    return (
      <>
        <div className="topBar">
          <div className='logo'>
            <DiamondIcon />
            <span>InvesTry</span>
          </div>
        </div>
        <div className='success_page'>
          <div className='success_card'>
            <div className='success_icon'>✓</div>
            <h2 className='success_title'>Your project has been published and your campaign has started successfully.</h2>
            <p className='success_subtitle'>Go to My Projects to view details.</p>
            <button type='button' className='success_btn' onClick={() => alert('Navigate to My Projects')}>My Projects</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="topBar">
        <div className='logo'>
          <DiamondIcon />
          <span>InvesTry</span>
        </div>
        <button type="button" className='exit_dash'>Exit to Dashboard</button>
      </div>
      <div className='page'>
        <div className='header'>
          <span>Dashboard / Projects / <b>Create Project</b></span>
          <h1>Create a new project</h1>
          <span>{stepDescriptions[currentStep - 1]}</span>
        </div>

        <div className='steps'>
          <Stepper currentStep={currentStep} />
        </div>

        {renderStepContent()}

        <div className='bottom'>
          <div className='bottom_buttons'>
            {currentStep >= 2 && (
              <button
                type="button"
                className='back_step'
                onClick={handlePreviousStep}
              >
                ← Back
              </button>
            )}
            {currentStep === 5 ? (
              <button
                type="button"
                className='next_step submit_btn'
                onClick={() => setIsSubmitted(true)}
              >
                Create
              </button>
            ) : (
              <button
                type="button"
                className='next_step'
                onClick={handleNextStep}
                disabled={(currentStep === 1 && !selectedFunding) || (currentStep === 2 && !isStep2Valid) || (currentStep === 3 && !isStep3Valid) || (currentStep === 4 && !isStep4Valid)}
              >
                Next Step
              </button>
            )}
            <button type="button" className='save_draft' onClick={() => alert("Funding model saved as draft.\nSelected: " + selectedFunding)}>Save as draft</button>
            <button type="button" className='cancel' onClick={() => alert("Project creation cancelled.")}>Cancel</button>
          </div>
          <span className='alert'><IoAlertCircleOutline />Your project will not be published until it is reviewed and approved.</span>
        </div>
      </div>
    </>
  );
}

export default CreateProject;