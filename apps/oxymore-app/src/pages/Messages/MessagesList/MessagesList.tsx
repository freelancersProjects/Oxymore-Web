import React, { useRef } from "react";
import type { Message } from "../../../types/message";
import MessageItem from "../MessageItem/MessageItem";
import EmptyChat from "../EmptyStates/EmptyChat";
import "./MessagesList.scss";

interface MessagesListProps {
  messages: Message[];
  highlightedMessageId: string | null;
  hoveredMessageId: string | null;
  hoveredOtherMessageId: string | null;
  openedMenuId: string | null;
  openedOtherMenuId: string | null;
  messageRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  chatMessagesRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onMessageMouseEnter: (messageId: string, isFromMe: boolean) => void;
  onMenuToggle: (messageId: string, isFromMe: boolean) => void;
  onReply: (messageId: string) => void;
  onEdit: (messageId: string, text: string) => void;
  onDelete: (messageId: string) => void;
  onReplyClick: (replyId: string) => void;
  scrollToMessageAndHighlight: (messageId: string, element: HTMLDivElement) => void;
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  highlightedMessageId,
  hoveredMessageId,
  hoveredOtherMessageId,
  openedMenuId,
  openedOtherMenuId,
  messageRefs,
  chatMessagesRef,
  messagesEndRef,
  textareaRef,
  onMessageMouseEnter,
  onMenuToggle,
  onReply,
  onEdit,
  onDelete,
  onReplyClick,
  scrollToMessageAndHighlight,
}) => {
  return (
    <div className="chat-messages" ref={chatMessagesRef}>
      {messages.length === 0 ? (
        <EmptyChat />
      ) : (
        messages.map((message, index) => {
          const isFirst = index === 0;
          const isLast = index === messages.length - 1;
          const isHighlighted = highlightedMessageId === message.id;
          const isHovered = message.isFromMe 
            ? hoveredMessageId === message.id 
            : hoveredOtherMessageId === message.id;
          const isMenuOpen = message.isFromMe 
            ? openedMenuId === message.id 
            : openedOtherMenuId === message.id;

          return (
            <MessageItem
              key={message.id}
              message={message}
              isFirst={isFirst}
              isLast={isLast}
              isHighlighted={isHighlighted}
              isHovered={isHovered}
              isMenuOpen={isMenuOpen}
              messageRef={(el) => (messageRefs.current[message.id] = el)}
              onMouseEnter={() => onMessageMouseEnter(message.id, message.isFromMe)}
              onMenuToggle={() => onMenuToggle(message.id, message.isFromMe)}
              onReply={() => onReply(message.id)}
              onEdit={() => onEdit(message.id, message.text)}
              onDelete={() => onDelete(message.id)}
              onReplyClick={onReplyClick}
              textareaRef={textareaRef}
            />
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;



