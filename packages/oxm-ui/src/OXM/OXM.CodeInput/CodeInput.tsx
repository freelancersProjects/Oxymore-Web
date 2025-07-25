import React, { useState, useRef, useEffect } from "react";
import "./CodeInput.scss";

export interface CodeInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  theme?: "blue" | "purple";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  type?: "text" | "number";
  autoFocus?: boolean;
  error?: boolean;
  errorMessage?: string;
}

const OXMCodeInput: React.FC<CodeInputProps> = ({
  length = 6,
  value = "",
  onChange,
  onComplete,
  theme = "purple",
  size = "medium",
  disabled = false,
  className = "",
  placeholder = "0",
  type = "number",
  autoFocus = true,
  error = false,
  errorMessage,
}) => {
  const [code, setCode] = useState(value);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setCode(value);
  }, [value]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const handleInputChange = (index: number, inputValue: string) => {
    if (disabled) return;

    const newCode = code.split("");
    newCode[index] = inputValue;
    const newCodeString = newCode.join("");

    setCode(newCodeString);
    onChange?.(newCodeString);

    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCodeString.length === length) {
      onComplete?.(newCodeString);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (pastedData.length > 0) {
      setCode(pastedData.padEnd(length, ""));
      onChange?.(pastedData.padEnd(length, ""));
      if (pastedData.length === length) {
        onComplete?.(pastedData);
      }
    }
  };

  const classes = [
    "oxm-code-input",
    `oxm-code-input--${theme}`,
    `oxm-code-input--${size}`,
    error ? "oxm-code-input--error" : "",
    disabled ? "oxm-code-input--disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="oxm-code-input-wrapper">
      <div className={classes}>
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type={type}
            value={code[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={1}
            className="oxm-code-input-field"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        ))}
      </div>
      {error && errorMessage && (
        <span className="oxm-code-input-error-message">{errorMessage}</span>
      )}
    </div>
  );
};

export default OXMCodeInput; 