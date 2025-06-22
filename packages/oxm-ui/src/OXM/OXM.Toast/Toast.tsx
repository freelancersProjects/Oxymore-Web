import React, { useEffect, useState } from "react";
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

  return (
    <div
      className={`oxm-toast oxm-toast--${type} ${
        visible ? "slide-in" : "slide-out"
      }`}
      onAnimationEnd={handleAnimationEnd}
    >
      <span>{message}</span>
      <button onClick={() => setVisible(false)}>Fermer</button>
    </div>
  );
};

export default Toast;
