import React from 'react';

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

export default Stepper;