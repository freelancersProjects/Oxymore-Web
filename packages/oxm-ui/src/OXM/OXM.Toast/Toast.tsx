import React, { useEffect, useState } from "react";
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
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleAnimationEnd = () => {
    if (!visible) {
      onClose();
    }
  };

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

  return (
    <div
      className={`oxm-toast oxm-toast--${type} ${
        visible ? "slide-in" : "slide-out"
      }`}
      onAnimationEnd={handleAnimationEnd}
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
};

export default Toast;
