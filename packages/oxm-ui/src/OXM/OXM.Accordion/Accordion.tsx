import React, { useState } from "react";
import "./Accordion.scss";
import FAQPlus from "../../assets/svg/FAQPlus.svg";

interface AccordionProps {
    question: string;
    answer: string;
}

const Accordion: React.FC<AccordionProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`oxm-accordion ${isOpen ? "open" : ""}`} onClick={toggleAccordion}>
            <div className="oxm-accordion__header">
                <h3>{question}</h3>
                <img src={FAQPlus} alt="Toggle Icon" className="oxm-accordion__icon" />
            </div>
            {isOpen && (
                <div className="oxm-accordion__body">
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

export default Accordion;
