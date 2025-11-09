import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import "./Toast.scss";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  onClose,
  duration = 3000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, message]);

  useEffect(() => {
    if (!visible) {
      const animationTimer = setTimeout(() => {
        onClose();
      }, 250);

      return () => clearTimeout(animationTimer);
    }
  }, [visible, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={20} />;
      case "error":
        return <XCircle size={20} />;
      case "info":
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const content = (
    <div
      className={`oxm-toast oxm-toast--${type} ${
        visible ? "slide-in" : "slide-out"
      }`}
    >
      <div className="oxm-toast__content">
        <div className="oxm-toast__icon">{getIcon()}</div>
        <span className="oxm-toast__message">{message}</span>
      </div>
      <button 
        className="oxm-toast__close" 
        onClick={() => setVisible(false)}
        aria-label="Fermer"
      >
        <X size={16} />
      </button>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};

export default Toast;
