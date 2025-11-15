import React from "react";
import Avatar from "../../../components/Avatar/Avatar";
import { truncate } from "../../../utils/truncate";
import type { Message } from "../../../types/message";
import MessageMenu from "../MessageMenu/MessageMenu";
import ReplyPreview from "../ReplyPreview/ReplyPreview";
import "./MessageItem.scss";

interface MessageItemProps {
  message: Message;
  isFirst: boolean;
  isLast: boolean;
  isHighlighted: boolean;
  isHovered: boolean;
  isMenuOpen: boolean;
  messageRef: (el: HTMLDivElement | null) => void;
  onMouseEnter: () => void;
  onMenuToggle: () => void;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReplyClick: (replyId: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isFirst,
  isLast,
  isHighlighted,
  isHovered,
  isMenuOpen,
  messageRef,
  onMouseEnter,
  onMenuToggle,
  onReply,
  onEdit,
  onDelete,
  onReplyClick,
  textareaRef,
}) => {
  return (
    <div
      ref={messageRef}
      className={`message ${message.isFromMe ? "message--me" : "message--other"} ${isHighlighted ? 'message--highlighted' : ''}`}
    >
      {!message.isFromMe && (
        <div className="message-avatar">
          <Avatar
            username={message.senderUsernameForAvatar || message.sender}
            avatarUrl={message.senderAvatar}
            size={36}
            className="avatar-image"
          />
        </div>
      )}
      <div className="message-content">
        {message.replyTo && (
          <ReplyPreview
            replyTo={message.replyTo}
            onClick={() => onReplyClick(message.replyTo!.id)}
          />
        )}
        <div className="message-bubble" onMouseEnter={onMouseEnter}>
          <div className="message-text">
            <span>{message.text}</span>
          </div>
          {isHovered && (
            <MessageMenu
              isFromMe={message.isFromMe}
              isFirst={isFirst}
              isLast={isLast}
              isOpen={isMenuOpen}
              onToggle={onMenuToggle}
              onReply={() => {
                onReply();
                onMenuToggle();
              }}
              onEdit={() => {
                onEdit();
                onMenuToggle();
              }}
              onDelete={() => {
                onDelete();
                onMenuToggle();
              }}
              textareaRef={textareaRef}
            />
          )}
        </div>
        <div className="message-footer">
          <span className="message-sender">{message.sender}</span>
          <span className="message-timestamp">{message.timestamp}</span>
        </div>
      </div>
      {message.isFromMe && (
        <div className="message-avatar">
          <Avatar
            username={message.senderUsernameForAvatar || message.sender}
            avatarUrl={message.senderAvatar}
            size={36}
            className="avatar-image"
          />
        </div>
      )}
    </div>
  );
};

export default MessageItem;

