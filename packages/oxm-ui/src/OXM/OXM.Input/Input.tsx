import React, { forwardRef } from "react";
import "./Input.scss";

export interface InputProps {
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  value?: string;
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
  error?: boolean;
  errorMessage?: string;
}

const OXMInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      placeholder,
      value,
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
      error = false,
      errorMessage,
    },
    ref
  ) => {
    const classes = [
      "oxm-input",
      `oxm-input--${theme}`,
      `oxm-input--${size}`,
      error ? "oxm-input--error" : "",
      disabled ? "oxm-input--disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="oxm-input-wrapper">
        <input
          ref={ref}
          type={type}
          className={classes}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          name={name}
          id={id}
        />
        {error && errorMessage && (
          <span className="oxm-input-error-message">{errorMessage}</span>
        )}
      </div>
    );
  }
);

OXMInput.displayName = "OXMInput";

export default OXMInput; 