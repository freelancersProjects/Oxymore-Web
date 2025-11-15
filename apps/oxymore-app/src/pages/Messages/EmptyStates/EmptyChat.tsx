import React from "react";
import { MessageSquare } from "lucide-react";
import "./EmptyStates.scss";

const EmptyChat: React.FC = () => {
  return (
    <div className="empty-chat">
      <MessageSquare size={80} className="empty-chat-icon" />
      <p className="empty-chat-text">Start the conversation!</p>
    </div>
  );
};

export default EmptyChat;



