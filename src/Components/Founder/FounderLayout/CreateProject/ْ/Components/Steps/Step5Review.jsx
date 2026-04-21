import React from 'react';
import { FiPieChart, FiEdit2 } from "react-icons/fi";

const Step5Review = ({
  selectedFunding,
  setCurrentStep,
  projectTitle,
  category,
  fundingGoal,
  minContribution,
  selectDuration,
  equityOffered,
  rewardTiers,
  founderProfitShare,
  contractDuration,
  coverImages,
  documents,
  videoUrl,
}) => {

  const formatNumber = (num) => {
    if (!num) return '0';
    return Number(num).toLocaleString();
  };

  const formatGoalShort = (num) => {
    if (!num) return 'EGP 0';
    const n = Number(num);
    if (n >= 1000000) return 'EGP ' + (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return 'EGP ' + (n / 1000).toFixed(0) + 'K';
    return 'EGP ' + n.toLocaleString();
  };

  const previewImageUrl = coverImages.length > 0 ? URL.createObjectURL(coverImages[0]) : null;

  const renderDealDetails = () => {
    if (selectedFunding === 'Equity-Based') return (
      <div className='review_row' style={{ marginBottom: 0 }}>
        <div className='review_field'>
          <span className='review_field_label'>EQUITY OFFERED</span>
          <span className='review_field_value review_highlight'>{equityOffered}%</span>
        </div>
      </div>
    );
    if (selectedFunding === 'Reward-Based') return (
      <div className='review_row' style={{ marginBottom: 0 }}>
        <div className='review_field'>
          <span className='review_field_label'>REWARD TIERS</span>
          <span className='review_field_value review_highlight'>{rewardTiers.length} tier{rewardTiers.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    );
    if (selectedFunding === 'Mudarabah') return (
      <div className='review_row' style={{ marginBottom: 0 }}>
        <div className='review_field'>
          <span className='review_field_label'>FOUNDER PROFIT SHARE</span>
          <span className='review_field_value review_highlight'>{founderProfitShare}%</span>
        </div>
        <div className='review_field'>
          <span className='review_field_label'>CONTRACT DURATION</span>
          <span className='review_field_value'>{contractDuration}</span>
        </div>
      </div>
    );
    return null;
  };

  return (
    <div className='review_container'>

      {/* Left Column */}
      <div className='review_left'>

        {/* Funding Model */}
        <div className='review_section'>
          <div className='review_section_header'>
            <h3 className='review_section_title'>Funding Model</h3>
            <button type="button" className='review_edit_btn' onClick={() => setCurrentStep(1)}>
              <FiEdit2 size={13} /> Edit
            </button>
          </div>
          <div className='review_row' style={{ marginBottom: 0 }}>
            <div className='review_field'>
              <span className='review_field_label'>MODEL</span>
              <span className='review_field_value'>{selectedFunding}</span>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className='review_section'>
          <div className='review_section_header'>
            <h3 className='review_section_title'>Project Details</h3>
            <button type="button" className='review_edit_btn' onClick={() => setCurrentStep(2)}>
              <FiEdit2 size={13} /> Edit
            </button>
          </div>
          <div className='review_row' style={{ gridTemplateColumns: '1fr' }}>
            <div className='review_field'>
              <span className='review_field_label'>PROJECT TITLE</span>
              <span className='review_field_value'>{projectTitle}</span>
            </div>
          </div>
          <div className='review_row'>
            <div className='review_field'>
              <span className='review_field_label'>CATEGORY</span>
              <span className='review_field_value'>{category}</span>
            </div>
            <div className='review_field'>
              <span className='review_field_label'>FUNDING GOAL</span>
              <span className='review_field_value review_highlight'>EGP {formatNumber(fundingGoal)}</span>
            </div>
          </div>
          <div className='review_row' style={{ marginBottom: 0 }}>
            <div className='review_field'>
              <span className='review_field_label'>MIN. CONTRIBUTION</span>
              <span className='review_field_value'>EGP {formatNumber(minContribution)}</span>
            </div>
            <div className='review_field'>
              <span className='review_field_label'>DURATION</span>
              <span className='review_field_value'>{selectDuration}</span>
            </div>
          </div>
        </div>

        {/* Deal Details */}
        <div className='review_section'>
          <div className='review_section_header'>
            <h3 className='review_section_title'>Deal Details</h3>
            <button type="button" className='review_edit_btn' onClick={() => setCurrentStep(3)}>
              <FiEdit2 size={13} /> Edit
            </button>
          </div>
          {renderDealDetails()}
        </div>

        {/* Media & Documents */}
        <div className='review_section'>
          <div className='review_section_header'>
            <h3 className='review_section_title'>Media & Documents</h3>
            <button type="button" className='review_edit_btn' onClick={() => setCurrentStep(4)}>
              <FiEdit2 size={13} /> Edit
            </button>
          </div>
          <div className='review_row'>
            <div className='review_field'>
              <span className='review_field_label'>IMAGES</span>
              <span className='review_field_value'>{coverImages.length} Uploaded</span>
            </div>
            <div className='review_field'>
              <span className='review_field_label'>VIDEO</span>
              <span className='review_field_value'>{videoUrl ? 'Link provided' : 'Not provided'}</span>
            </div>
          </div>
          <div className='review_row' style={{ marginBottom: 0 }}>
            <div className='review_field'>
              <span className='review_field_label'>DOCUMENTS</span>
              <span className='review_field_value'>{documents.length} Uploaded</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Project Preview */}
      <div className='review_right'>
        <span className='preview_header'>PROJECT PREVIEW</span>
        <div className='preview_card'>
          {previewImageUrl ? (
            <div className='preview_image_wrapper'>
              <img src={previewImageUrl} alt='Cover' className='preview_image' />
              <span className='preview_badge'>
                <FiPieChart size={12} /> {selectedFunding}
              </span>
            </div>
          ) : (
            <div className='preview_image_placeholder'>
              <span>No image uploaded</span>
            </div>
          )}
          <div className='preview_body'>
            <span className='preview_category'>{category || 'CATEGORY'}</span>
            <h3 className='preview_title'>{projectTitle || 'Project Title'}</h3>
            <div className='preview_goal'>
              <span className='preview_goal_label'>Funding Goal</span>
              <span className='preview_goal_value'>{formatGoalShort(fundingGoal)}</span>
            </div>
          </div>
        </div>
        <p className='preview_note'>This is how your project might appear in the marketplace.</p>
      </div>
    </div>
  );
};

export default Step5Review;