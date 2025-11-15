import React from "react";
import { truncate } from "../../../utils/truncate";
import "./ReplyPreview.scss";

interface ReplyPreviewProps {
  replyTo: {
    id: string;
    text: string;
    sender: string;
  };
  onClick: () => void;
}

const ReplyPreview: React.FC<ReplyPreviewProps> = ({ replyTo, onClick }) => {
  return (
    <div className="message-reply-preview" onClick={onClick}>
      <div className="message-reply-preview-info">
        <span className="message-reply-preview-label">↳ Répondre à</span>
        <span className="message-reply-preview-sender">{replyTo.sender}</span>
      </div>
      <div className="message-reply-preview-text">"{truncate(replyTo.text, 50)}"</div>
    </div>
  );
};

export default ReplyPreview;



