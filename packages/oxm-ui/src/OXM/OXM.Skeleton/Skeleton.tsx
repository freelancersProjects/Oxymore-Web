import React from "react";
import "./Skeleton.scss";

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  variant?: "text" | "rectangular" | "circular" | "rounded";
  animation?: "pulse" | "wave" | "none" | "purple-pulse" | "blue-pulse";
  lines?: number;
  theme?: "default" | "purple" | "blue" | "gradient";
}

const OXMSkeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "1rem",
  borderRadius = "4px",
  className = "",
  variant = "rectangular",
  animation = "pulse",
  lines = 1,
  theme = "defaultzz",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "circular":
        return {
          width: height,
          height: height,
          borderRadius: "50%",
        };
      case "text":
        return {
          borderRadius: "4px",
          height: "1rem",
        };
      case "rounded":
        return {
          borderRadius: "8px",
        };
      default:
        return {
          borderRadius,
        };
    }
  };

  const skeletonStyle = {
    width,
    height,
    ...getVariantStyles(),
  };

  if (lines > 1) {
    return (
      <div className={`oxm-skeleton-container ${className}`}>
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={`oxm-skeleton oxm-skeleton--${variant} oxm-skeleton--${animation} oxm-skeleton--${theme}`}
            style={{
              ...skeletonStyle,
              width: index === lines - 1 ? "60%" : "100%", // Dernière ligne plus courte
              marginBottom: index < lines - 1 ? "0.5rem" : "0",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`oxm-skeleton oxm-skeleton--${variant} oxm-skeleton--${animation} oxm-skeleton--${theme} ${className}`}
      style={skeletonStyle}
    />
  );
};

export default OXMSkeleton;
