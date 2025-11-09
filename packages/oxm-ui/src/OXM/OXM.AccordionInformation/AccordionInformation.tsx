import React, { useState } from "react";
import "./AccordionInformation.scss";

export interface AccordionInformationProps {
  title: string;
  content: string | React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const OXMAccordionInformation = ({
  title,
  content,
  defaultOpen = false,
  className = "",
}: AccordionInformationProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`oxm-accordion-information ${isOpen ? "open" : ""} ${className}`}
      onClick={toggleAccordion}
    >
      <div className="oxm-accordion-information__header">
        <h3 className="oxm-accordion-information__title">{title}</h3>
        <span className="oxm-accordion-information__icon">
          {isOpen ? "−" : "+"}
        </span>
      </div>
      <div className="oxm-accordion-information__body">
        <div className="oxm-accordion-information__content">
          {typeof content === "string" ? <p>{content}</p> : content}
        </div>
      </div>
    </div>
  );
};

export default OXMAccordionInformation;

