import React, { forwardRef } from "react";
import "./TextArea.scss";

export interface TextAreaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  theme?: "blue" | "purple";
  size?: "small" | "medium" | "large";
  rows?: number;
  cols?: number;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  error?: boolean;
  errorMessage?: string;
  maxLength?: number;
  minLength?: number;
  resize?: "none" | "both" | "horizontal" | "vertical";
}

const OXMTextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      placeholder,
      value,
      onChange,
      onFocus,
      onBlur,
      theme = "purple",
      size = "medium",
      rows = 4,
      cols,
      disabled = false,
      required = false,
      name,
      id,
      className = "",
      error = false,
      errorMessage,
      maxLength,
      minLength,
      resize = "vertical",
    },
    ref
  ) => {
    const classes = [
      "oxm-textarea",
      `oxm-textarea--${theme}`,
      `oxm-textarea--${size}`,
      error ? "oxm-textarea--error" : "",
      disabled ? "oxm-textarea--disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="oxm-textarea-wrapper">
        <textarea
          ref={ref}
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
          rows={rows}
          cols={cols}
          maxLength={maxLength}
          minLength={minLength}
          style={{ resize }}
        />
        {error && errorMessage && (
          <span className="oxm-textarea-error-message">{errorMessage}</span>
        )}
      </div>
    );
  }
);

OXMTextArea.displayName = "OXMTextArea";

export default OXMTextArea; 