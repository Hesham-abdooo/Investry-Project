import React from 'react';
import { FiPieChart } from "react-icons/fi";

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

  const renderDealDetails = () => {
    if (selectedFunding === 'Equity-Based') return (
      <div style={{ ...rowStyle, marginBottom: '0' }}>
        <div style={fieldStyle}>
          <span style={labelStyle}>EQUITY OFFERED</span>
          <span style={highlightStyle}>{equityOffered}%</span>
        </div>
      </div>
    );
    if (selectedFunding === 'Reward-Based') return (
      <div style={{ ...rowStyle, marginBottom: '0' }}>
        <div style={fieldStyle}>
          <span style={labelStyle}>REWARD TIERS</span>
          <span style={highlightStyle}>{rewardTiers.length} tier{rewardTiers.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    );
    if (selectedFunding === 'Mudarabah') return (
      <div style={{ ...rowStyle, marginBottom: '0' }}>
        <div style={fieldStyle}>
          <span style={labelStyle}>FOUNDER PROFIT SHARE</span>
          <span style={highlightStyle}>{founderProfitShare}%</span>
        </div>
        <div style={fieldStyle}>
          <span style={labelStyle}>CONTRACT DURATION</span>
          <span style={valueStyle}>{contractDuration}</span>
        </div>
      </div>
    );
    return null;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start', marginTop: '10px' }}>

      {/* Left Column */}
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
                <FiPieChart style={{ fontSize: '12px' }} /> {selectedFunding}
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
  );
};

export default Step5Review;