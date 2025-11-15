import React from "react";
import "./ScrollToBottomButton.scss";

interface ScrollToBottomButtonProps {
  onClick: () => void;
}

const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({ onClick }) => {
  return (
    <button className="scroll-to-bottom-btn" onClick={onClick}>
      Voir les derniers messages
    </button>
  );
};

export default ScrollToBottomButton;



