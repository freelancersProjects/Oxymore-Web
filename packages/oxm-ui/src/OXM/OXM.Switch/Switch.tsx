import React, { forwardRef } from "react";
import "./Switch.scss";

export interface SwitchProps {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  theme?: "blue" | "purple";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
}

const OXMSwitch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      checked = false,
      onChange,
      onFocus,
      onBlur,
      theme = "purple",
      size = "medium",
      disabled = false,
      required = false,
      name,
      id,
      className = "",
      label,
      error = false,
      errorMessage,
    },
    ref
  ) => {
    const classes = [
      "oxm-switch",
      `oxm-switch--${theme}`,
      `oxm-switch--${size}`,
      error ? "oxm-switch--error" : "",
      disabled ? "oxm-switch--disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="oxm-switch-wrapper">
        <label className={classes}>
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            name={name}
            id={id}
            className="oxm-switch-input"
          />
          <span className="oxm-switch-track">
            <span className="oxm-switch-thumb" />
          </span>
          {label && <span className="oxm-switch-label">{label}</span>}
        </label>
        {error && errorMessage && (
          <span className="oxm-switch-error-message">{errorMessage}</span>
        )}
      </div>
    );
  }
);

OXMSwitch.displayName = "OXMSwitch";

export default OXMSwitch; 