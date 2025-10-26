import React from 'react';
import './StepIndicator.scss';

interface StepIndicatorProps {
  steps: {
    id: string;
    label: string;
  }[];
  currentStep: string;
}

const OXMStepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="oxm-step-indicator">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = index < currentIndex;
        const stepNumber = index + 1;

        return (
          <div
            key={step.id}
            className={`oxm-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
          >
            <div className="oxm-step-number">
              {isCompleted ? (
                <svg
                  className="check-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                stepNumber
              )}
            </div>
            <span className="oxm-step-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default OXMStepIndicator;
