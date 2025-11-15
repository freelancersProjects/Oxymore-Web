import React from "react";
import { MessageSquare } from "lucide-react";
import "./EmptyStates.scss";

const NoChatSelected: React.FC = () => {
  return (
    <div className="no-chat-selected">
      <MessageSquare size={80} className="no-chat-icon" />
      <h2>Select a conversation</h2>
      <p>Choose a friend from the sidebar to start chatting</p>
    </div>
  );
};

export default NoChatSelected;



