import React from "react";
import "./Button.scss";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "neon" | "glass";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  onClick?: () => void;
}

const OXMButton: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  onClick,
}) => {
  const classes = [
    "oxm-button",
    `oxm-button--${variant}`,
    `oxm-button--${size}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default OXMButton;
