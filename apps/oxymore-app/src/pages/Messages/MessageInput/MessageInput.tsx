import React from "react";
import { Send } from "lucide-react";
import ReplyPreviewBanner from "../ReplyPreviewBanner/ReplyPreviewBanner";
import type { Message } from "../../../types/message";
import "./MessageInput.scss";

interface MessageInputProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  newMessageText: string;
  editingMessageId: string | null;
  replyingToMessageId: string | null;
  isSending: boolean;
  replyingToMessage: Message | null;
  onTextChange: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancelEdit: () => void;
  onReplyClose: () => void;
  onReplyClick: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  textareaRef,
  newMessageText,
  editingMessageId,
  replyingToMessageId,
  isSending,
  replyingToMessage,
  onTextChange,
  onSubmit,
  onCancelEdit,
  onReplyClose,
  onReplyClick,
}) => {
  return (
    <>
      {replyingToMessageId && replyingToMessage && (
        <ReplyPreviewBanner
          message={replyingToMessage}
          onClose={onReplyClose}
          onClick={onReplyClick}
        />
      )}

      <form className="chat-input-wrapper" onSubmit={onSubmit}>
        <textarea
          ref={textareaRef}
          className="chat-input"
          placeholder={editingMessageId ? "Edit your message..." : replyingToMessageId ? "Répondre..." : "Type your message..."}
          value={newMessageText}
          onChange={(e) => onTextChange(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e as any);
            }
          }}
          disabled={isSending}
          rows={1}
        />
        {editingMessageId && (
          <button type="button" className="cancel-edit-button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="send-button"
          disabled={isSending || !newMessageText.trim()}
        >
          <Send size={20} />
        </button>
      </form>
    </>
  );
};

export default MessageInput;



