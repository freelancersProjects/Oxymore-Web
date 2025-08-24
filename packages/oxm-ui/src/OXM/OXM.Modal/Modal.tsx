import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./Modal.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
}

const OXMModal: React.FC<ModalProps> = ({ isOpen, onClose, children, size = "medium" }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Empêcher le scroll du body quand le modal est ouvert
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      // Restaurer le scroll du body
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const content = (
    <div className="oxm-modal-backdrop" onClick={onClose}>
      <div 
        className={`oxm-modal oxm-modal--${size}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};

export default OXMModal;
