import { useState } from "react";

export const useToast = () => {
  const [toast, setToast] = useState<null | {
    message: string;
    type: "success" | "error" | "info";
    duration?: number;
  }>(null);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info",
    duration?: number
  ) => {
    setToast({ message, type, duration });
  };

  const closeToast = () => setToast(null);

  return { toast, showToast, closeToast };
};

