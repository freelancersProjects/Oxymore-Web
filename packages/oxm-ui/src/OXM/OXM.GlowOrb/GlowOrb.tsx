import React from "react";
import "./GlowOrb.scss";

interface GlowOrbProps {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size?: string;
  color?: string;
}

const GlowOrb: React.FC<GlowOrbProps> = ({
  top,
  left,
  right,
  bottom,
  size = "400px",
  color = "#500CAD",
}) => {
  const style: React.CSSProperties = {
    position: "absolute",
    top,
    left,
    right,
    bottom,
    width: size,
    height: size,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${color} 0%, transparent 80%)`,
    filter: "blur(150px)",
    zIndex: 0,
    pointerEvents: "none",
    overflow: "visible",
    maxWidth: "none",
    maxHeight: "none",
  };

  return <div className="oxm-glow-orb" style={style} />;
};

export default GlowOrb;
