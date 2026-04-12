import React from 'react';
import DiamondIcon from './DiamondIcon';

const SuccessPage = () => {
  return (
    <>
      <div className="topBar">
        <div className="logo">
          <DiamondIcon />
          <span>InvesTry</span>
        </div>
      </div>
      <div className="success_page">
        <div className="success_card">
          <div className="success_icon">✓</div>
          <h2 className="success_title">
            Your project has been published and your campaign has started successfully.
          </h2>
          <p className="success_subtitle">Go to My Projects to view details.</p>
          <button
            type="button"
            className="success_btn"
            onClick={() => alert("Navigate to My Projects")}
          >
            My Projects
          </button>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;