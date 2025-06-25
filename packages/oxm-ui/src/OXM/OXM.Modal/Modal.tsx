import React from "react";
import "./Modal.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const OXMModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="oxm-modal-backdrop" onClick={onClose}>
      <div className="oxm-modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default OXMModal;
