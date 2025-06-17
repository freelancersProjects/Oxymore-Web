import React from "react";
import "./Categorie.scss";

interface CategorieProps {
  label: string;
  color?: string;
}

const Categorie: React.FC<CategorieProps> = ({ label, color }) => {
  return (
    <span
      className="categorie"
      style={{ borderColor: color, backgroundColor: `${color}20` }}
    >
      {label}
      <span className="dot" style={{ backgroundColor: color }} />
    </span>
  );
};

export default Categorie;
