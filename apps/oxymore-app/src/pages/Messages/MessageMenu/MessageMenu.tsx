import React from "react";
import "./MessageMenu.scss";

interface MessageMenuProps {
  isFromMe: boolean;
  isFirst: boolean;
  isLast: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onReply: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const MessageMenu: React.FC<MessageMenuProps> = ({
  isFromMe,
  isFirst,
  isLast,
  isOpen,
  onToggle,
  onReply,
  onEdit,
  onDelete,
  textareaRef,
}) => {
  return (
    <div
      className="message-menu-btn-wrapper"
      onMouseEnter={() => {}}
    >
      <button
        className="message-menu-btn"
        onClick={onToggle}
      >⋯</button>
      {isOpen && (
        <div className={`message-menu-dropdown ${isFirst ? 'message-menu-dropdown--bottom' : ''} ${isLast ? 'message-menu-dropdown--top' : ''}`}>
          <button className="message-menu-item" onClick={onReply}>
            Répondre
          </button>
          {isFromMe && onEdit && (
            <button className="message-menu-item" onClick={onEdit}>
              Edit
            </button>
          )}
          {isFromMe && onDelete && (
            <button className="message-menu-item" onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageMenu;



