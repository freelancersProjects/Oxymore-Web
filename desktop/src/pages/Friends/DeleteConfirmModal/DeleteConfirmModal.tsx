import { OXMModal } from "@oxymore/ui";
import { X, UserX } from "lucide-react";
import type { FriendWithUser } from "../../../types/friend";
import "./DeleteConfirmModal.scss";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  friend: FriendWithUser | null;
  onConfirm: () => void;
}

const DeleteConfirmModal = ({ isOpen, onClose, friend, onConfirm }: DeleteConfirmModalProps) => {
  return (
    <OXMModal
      isOpen={isOpen}
      onClose={onClose}
      variant="default"
    >
      <div className="delete-confirm-modal">
        <div className="modal-header">
          <div className="modal-header-content">
            <div className="modal-icon-wrapper delete">
              <UserX size={24} />
            </div>
            <h3 className="modal-title">Supprimer un ami</h3>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          <p className="modal-message">
            Êtes-vous sûr de vouloir supprimer <strong>{friend?.display_name || friend?.username}</strong> de vos amis ?
          </p>
          <p className="modal-warning">
            Cette action est irréversible. Vous devrez renvoyer une demande d'ami pour vous reconnecter.
          </p>
        </div>

        <div className="modal-actions">
          <button
            className="modal-btn cancel"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="modal-btn confirm delete"
            onClick={onConfirm}
          >
            Confirmer la suppression
          </button>
        </div>
      </div>
    </OXMModal>
  );
};

export default DeleteConfirmModal;

