import React from "react";
import { MessageSquare } from "lucide-react";
import "./EmptyStates.scss";

const EmptyConversations: React.FC = () => {
  return (
    <div className="empty-conversations">
      <MessageSquare size={48} className="empty-icon" />
      <p>No conversations yet</p>
      <p className="empty-subtitle">Start chatting with your friends!</p>
    </div>
  );
};

export default EmptyConversations;



