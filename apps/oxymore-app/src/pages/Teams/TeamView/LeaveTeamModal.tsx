import React from 'react';
import { LogOut, AlertTriangle, X } from 'lucide-react';
import { OXMModal } from '@oxymore/ui';
import './LeaveTeamModal.scss';

interface LeaveTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  teamName: string;
  isCapturing?: boolean;
}

const LeaveTeamModal: React.FC<LeaveTeamModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  teamName,
  isCapturing = false
}) => {
  const [isLeaving, setIsLeaving] = React.useState(false);

  const handleConfirm = async () => {
    setIsLeaving(true);
    try {
      await onConfirm();
    } catch (error) {
      setIsLeaving(false);
    }
  };

  const handleClose = () => {
    if (!isLeaving) {
      onClose();
    }
  };

  const warnings = [
    'Vous perdrez l\'accès à tous les messages et fichiers de l\'équipe',
    'Vous ne pourrez plus participer aux défis en cours',
    'Vos statistiques dans cette équipe seront conservées',
    isCapturing && 'En tant que capitaine, cette action est irréversible sans transfert du rôle'
  ].filter(Boolean) as string[];

  return (
    <OXMModal isOpen={isOpen} onClose={handleClose} variant="default">
      <div className="leave-team-modal">
        <div className="modal-header">
          <div className="modal-header-content">
            <div className={`modal-icon-wrapper ${isCapturing ? 'danger' : 'leave'}`}>
              {isCapturing ? <AlertTriangle size={24} /> : <LogOut size={24} />}
            </div>
            <h3 className="modal-title orbitron">
              {isCapturing ? 'Quitter l\'équipe en tant que capitaine' : 'Quitter l\'équipe'}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          <p className="modal-message">
            Êtes-vous sûr de vouloir quitter l'équipe <strong>{teamName}</strong> ?
          </p>

          <div className="warning-list">
            {warnings.map((warning, index) => (
              <div key={index} className="warning-item">
                <AlertTriangle size={16} />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="modal-btn cancel"
            onClick={handleClose}
            disabled={isLeaving}
          >
            Annuler
          </button>
          <button
            className="modal-btn confirm danger"
            onClick={handleConfirm}
            disabled={isLeaving}
          >
            {isLeaving ? 'Chargement...' : 'Quitter l\'équipe'}
          </button>
        </div>
      </div>
    </OXMModal>
  );
};

export default LeaveTeamModal;

