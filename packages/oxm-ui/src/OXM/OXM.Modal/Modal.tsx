import React from "react";
import ReactDOM from "react-dom";
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

  const content = (
    <div className="oxm-modal-backdrop" onClick={onClose}>
      <div className="oxm-modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};

export default OXMModal;
