import React from "react";
import "./CardSelector.scss";

export interface CardOption {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface CardSelectorProps {
  options: CardOption[];
  selectedId?: string;
  onChange?: (selectedId: string) => void;
  theme?: "blue" | "purple";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
  multiple?: boolean;
  selectedIds?: string[];
  onMultipleChange?: (selectedIds: string[]) => void;
}

const OXMCardSelector: React.FC<CardSelectorProps> = ({
  options,
  selectedId,
  onChange,
  theme = "purple",
  size = "medium",
  disabled = false,
  className = "",
  multiple = false,
  selectedIds = [],
  onMultipleChange,
}) => {
  const classes = [
    "oxm-card-selector",
    `oxm-card-selector--${theme}`,
    `oxm-card-selector--${size}`,
    disabled ? "oxm-card-selector--disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleCardClick = (optionId: string) => {
    if (disabled || options.find(opt => opt.id === optionId)?.disabled) {
      return;
    }

    if (multiple) {
      const newSelectedIds = selectedIds.includes(optionId)
        ? selectedIds.filter(id => id !== optionId)
        : [...selectedIds, optionId];
      onMultipleChange?.(newSelectedIds);
    } else {
      onChange?.(optionId);
    }
  };

  const isSelected = (optionId: string) => {
    return multiple ? selectedIds.includes(optionId) : selectedId === optionId;
  };

  return (
    <div className={classes}>
      <div className="oxm-card-selector-grid">
        {options.map((option) => (
          <div
            key={option.id}
            className={`oxm-card-selector-card ${
              isSelected(option.id) ? "oxm-card-selector-card--selected" : ""
            } ${option.disabled ? "oxm-card-selector-card--disabled" : ""}`}
            onClick={() => handleCardClick(option.id)}
          >
            {option.icon && (
              <div className="oxm-card-selector-icon">{option.icon}</div>
            )}
            <div className="oxm-card-selector-content">
              <h4 className="oxm-card-selector-title">{option.title}</h4>
              {option.description && (
                <p className="oxm-card-selector-description">
                  {option.description}
                </p>
              )}
            </div>
            <div className="oxm-card-selector-check">
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OXMCardSelector; 