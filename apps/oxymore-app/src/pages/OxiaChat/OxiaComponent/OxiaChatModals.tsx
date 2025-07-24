import React from "react";
import { OXMModal } from "@oxymore/ui";

interface ModalsProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  newChannelName: string;
  setNewChannelName: (name: string) => void;
  handleCreateChannel: () => void;
  showRenameModal: boolean;
  setShowRenameModal: (open: boolean) => void;
  editChannelName: string;
  setEditChannelName: (name: string) => void;
  handleEditChannel: () => void;
  showDeleteModal: boolean;
  setShowDeleteModal: (open: boolean) => void;
  handleDeleteChannel: () => void;
}

const OxiaChatModals: React.FC<ModalsProps> = ({
  isModalOpen,
  setIsModalOpen,
  newChannelName,
  setNewChannelName,
  handleCreateChannel,
  showRenameModal,
  setShowRenameModal,
  editChannelName,
  setEditChannelName,
  handleEditChannel,
  showDeleteModal,
  setShowDeleteModal,
  handleDeleteChannel,
}) => (
  <>
    <OXMModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <h2>Créer un nouveau channel</h2>
      <div className="form-group">
        <label htmlFor="channel-name">Nom du channel</label>
        <input
          id="channel-name"
          type="text"
          value={newChannelName}
          onChange={(e) => {
            if (e.target.value.length <= 50) setNewChannelName(e.target.value); // limation du nom du channel
          }}
          maxLength={50}
          placeholder="Nom du channel"
        />
        <small>{newChannelName.length}/50</small>
      </div>
      <div className="modal-actions">
        <button className="oxia-chat-send-btn" onClick={handleCreateChannel}>
          Créer
        </button>
      </div>
    </OXMModal>
    <OXMModal
      isOpen={showRenameModal}
      onClose={() => setShowRenameModal(false)}
    >
      <h2>Renommer le channel</h2>
      <div className="form-group">
        <label htmlFor="rename-channel">Nouveau nom</label>
        <input
          id="rename-channel"
          type="text"
          value={editChannelName}
          onChange={(e) => {
        if (e.target.value.length <= 50) setEditChannelName(e.target.value);
          }}
          maxLength={50}
          placeholder="Nom du channel"
        />
        <small>{editChannelName.length}/50</small>
      </div>
      <div className="modal-actions">
        <button className="oxia-chat-send-btn" onClick={handleEditChannel}>
          Renommer
        </button>
        <button
          className="oxia-chat-send-btn oxia-chat-btn-cancel"
          onClick={() => setShowRenameModal(false)}
        >
          Annuler
        </button>
      </div>
    </OXMModal>
    <OXMModal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
    >
      <h2>Supprimer le channel</h2>
      <p>
        Es-tu sûr de vouloir supprimer ce channel ? Cette action est
        irréversible.
      </p>
      <div className="modal-actions">
        <button
          className="oxia-chat-send-btn oxia-chat-btn-delete"
          onClick={handleDeleteChannel}
        >
          Supprimer
        </button>
        <button
          className="oxia-chat-send-btn oxia-chat-btn-cancel"
          onClick={() => setShowDeleteModal(false)}
        >
          Annuler
        </button>
      </div>
    </OXMModal>
  </>
);

export default OxiaChatModals;
