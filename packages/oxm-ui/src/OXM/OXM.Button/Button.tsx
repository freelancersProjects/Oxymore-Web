import React from "react";
import "./Button.scss";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  outline?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const OXMButton: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  outline = false,
  disabled = false,
  onClick,
}) => {
  const classes = [
    "oxm-button",
    `oxm-button--${variant}`,
    `oxm-button--${size}`,
    outline ? "oxm-button--outline" : "",
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
