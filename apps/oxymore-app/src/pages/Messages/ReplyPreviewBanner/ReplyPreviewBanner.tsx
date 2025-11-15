import React from "react";
import { X } from "lucide-react";
import { truncate } from "../../../utils/truncate";
import type { Message } from "../../../types/message";
import "./ReplyPreviewBanner.scss";

interface ReplyPreviewBannerProps {
  message: Message | null;
  onClose: () => void;
  onClick: () => void;
}

const ReplyPreviewBanner: React.FC<ReplyPreviewBannerProps> = ({
  message,
  onClose,
  onClick,
}) => {
  if (!message) return null;

  return (
    <div className="reply-preview" onClick={onClick}>
      <div className="reply-preview-content">
        <div className="reply-preview-info">
          <span className="reply-preview-label">Répondre à</span>
          <span className="reply-preview-sender">{message.sender}</span>
        </div>
        <div className="reply-preview-text">{truncate(message.text || '', 50)}</div>
      </div>
      <button
        className="reply-preview-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default ReplyPreviewBanner;



