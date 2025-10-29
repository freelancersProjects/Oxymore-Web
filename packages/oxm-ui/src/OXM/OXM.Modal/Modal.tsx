import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./Modal.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  keyUrl?: string;
  persistOnRefresh?: boolean;
  urlValue?: string;
  variant?: 'default' | 'blue';
}

const OXMModal: React.FC<ModalProps> = ({ isOpen, onClose, children, keyUrl, persistOnRefresh = false, urlValue, variant = 'default' }) => {
  useEffect(() => {
    const handlePopState = () => {
      if (persistOnRefresh && keyUrl && urlValue) {
        const params = new URLSearchParams(window.location.search);
        if (params.get(keyUrl) !== urlValue) {
          onClose();
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [persistOnRefresh, keyUrl, urlValue, onClose]);

  const handleClose = () => {
    if (persistOnRefresh && keyUrl) {
      const url = new URL(window.location.href);
      url.searchParams.delete(keyUrl);
      window.history.replaceState({}, '', url.toString());
    }
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const content = (
    <div className="oxm-modal-backdrop" onClick={handleClose}>
      <div className={`oxm-modal ${variant === 'blue' ? 'oxm-modal--blue' : ''}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};

export default OXMModal;
