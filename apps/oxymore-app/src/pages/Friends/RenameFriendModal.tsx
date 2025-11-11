import { useState, useEffect } from "react";
import { OXMButton, OXMModal } from "@oxymore/ui";
import { X } from "lucide-react";
import { friendService } from "../../services/friendService";
import type { FriendWithUser } from "../../types/friend";
import { truncate } from "../../utils";
import "./RenameFriendModal.scss";

interface RenameFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  friend: FriendWithUser | null;
  userId: string;
  onSuccess: () => void;
}

const RenameFriendModal = ({ isOpen, onClose, friend, userId, onSuccess }: RenameFriendModalProps) => {
  const [newDisplayName, setNewDisplayName] = useState("");
  const MAX_LENGTH = 50;

  useEffect(() => {
    if (friend) {
      setNewDisplayName(friend.display_name || friend.username);
    }
  }, [friend]);

  const handleChange = (value: string) => {
    const truncated = truncate(value, MAX_LENGTH, "");
    setNewDisplayName(truncated);
  };

  const handleSave = async () => {
    if (!friend || !newDisplayName.trim()) return;

    try {
      const trimmedName = newDisplayName.trim();
      if (trimmedName === friend.username) {
        await friendService.deleteDisplayName(userId, friend.id_friend);
      } else {
        await friendService.updateDisplayName(userId, friend.id_friend, trimmedName);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error renaming friend:', error);
    }
  };

  if (!friend) return null;

  return (
    <OXMModal
      isOpen={isOpen}
      onClose={onClose}
      variant="small"
    >
      <div className="rename-friend-modal">
        <div className="rename-friend-modal-header">
          <h2 className="rename-friend-modal-title">Renommer l'ami</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="rename-friend-modal-content">
          <p className="rename-friend-modal-subtitle">
            Nom d'origine: {friend.username}
          </p>
          <div className="rename-friend-input-wrapper">
            <label className="rename-friend-label">
              Nouveau nom d'affichage
            </label>
            <input
              type="text"
              placeholder="Nouveau nom d'affichage"
              value={newDisplayName}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
              className="rename-friend-input"
              maxLength={MAX_LENGTH}
              autoFocus
            />
            <div className="rename-friend-char-count">
              {newDisplayName.length}/{MAX_LENGTH} caractères
            </div>
          </div>
          <div className="rename-friend-modal-actions">
            <OXMButton
              variant="secondary"
              size="medium"
              onClick={onClose}
            >
              Annuler
            </OXMButton>
            <OXMButton
              variant="primary"
              size="medium"
              onClick={handleSave}
              disabled={!newDisplayName.trim()}
            >
              Enregistrer
            </OXMButton>
          </div>
        </div>
      </div>
    </OXMModal>
  );
};

export default RenameFriendModal;

