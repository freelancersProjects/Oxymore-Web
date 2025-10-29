import React from "react";
import { motion } from "framer-motion";
import { Pin, Trash2, X } from "lucide-react";
import { OXMModal } from "@oxymore/ui";
import { avatarService } from "../../../../../services/avatarService";
import type { PinnedMessageTeam } from "../../../../../types/team";
import "./PinnedMessagesModal.scss";

interface PinnedMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  pinnedMessages: PinnedMessageTeam[];
  onUnpin: (pinId: string) => void;
  onMessageClick: (messageId: string) => void;
  currentUserId: string;
  teamMembers: Array<{ id_user: string; role?: string }>;
}

const PinnedMessagesModal: React.FC<PinnedMessagesModalProps> = ({
  isOpen,
  onClose,
  pinnedMessages,
  onUnpin,
  onMessageClick,
  currentUserId,
  teamMembers,
}) => {
  const currentUserMember = teamMembers.find(m => m.id_user === currentUserId);
  const isAdmin = currentUserMember?.role === 'captain' || currentUserMember?.role === 'admin';

  const canDeletePin = (pin: PinnedMessageTeam): boolean => {
    if (isAdmin) return true;
    return pin.id_user === currentUserId;
  };

  return (
    <OXMModal isOpen={isOpen} onClose={onClose} variant="blue">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="pinned-messages-modal-content"
      >
          <div className="modal-header">
            <div className="modal-team-info">
              <div className="modal-title-section">
                <h1>Pinned Messages</h1>
                <p>All your important team messages in one place</p>
                <div className="modal-badges">
                  <div className="badge verified">
                    <Pin size={14} />
                    <span>{pinnedMessages.length} pinned</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="close-button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="modal-content">
            {pinnedMessages.length === 0 ? (
              <div className="pinned-messages-empty">
                <Pin size={64} className="empty-icon" />
                <p>No pinned messages yet</p>
                <span>Pin important messages to keep them handy</span>
              </div>
            ) : (
              <div className="pinned-messages-list">
                {pinnedMessages.map((pin) => (
                  <motion.div
                    key={pin.id_pinned_message_team}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pinned-message-card"
                    onClick={() => onMessageClick(pin.id_team_chat)}
                  >
                    <div className="pinned-message-card-header">
                      <div className="pinned-message-card-avatar">
                        <img
                          src={avatarService.getAvatarUrl(pin.username, pin.avatar_url)}
                          alt={pin.username}
                        />
                      </div>
                      <div className="pinned-message-card-info">
                        <span className="pinned-message-card-author">
                          {pin.username}
                        </span>
                        <span className="pinned-message-card-date">
                          {new Date(pin.pinned_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {canDeletePin(pin) && (
                        <button
                          className="pinned-message-card-unpin"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUnpin(pin.id_pinned_message_team);
                          }}
                          title="Unpin message"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                    <div className="pinned-message-card-content">
                      <p>{pin.message}</p>
                    </div>
                    <div className="pinned-message-card-footer">
                      <Pin size={14} />
                      <span>Pinned</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
    </OXMModal>
  );
};

export default PinnedMessagesModal;

