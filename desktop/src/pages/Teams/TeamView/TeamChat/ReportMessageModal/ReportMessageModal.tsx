import React, { useState } from 'react';
import { X } from 'lucide-react';
import { OXMButton, OXMCheckbox, OXMModal } from '@oxymore/ui';
import './ReportMessageModal.scss';

interface ReportMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: (reasons: string[]) => Promise<void>;
  messageText?: string;
  senderName?: string;
}

const REPORT_REASONS = [
  'Spam',
  'Harcèlement',
  'Contenu inapproprié',
  'Discours de haine',
  'Fausses informations',
  'Autre'
];

const ReportMessageModal: React.FC<ReportMessageModalProps> = ({
  isOpen,
  onClose,
  onReport,
  messageText,
  senderName
}) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleReason = (reason: string, checked: boolean) => {
    if (checked) {
      setSelectedReasons(prev => [...prev, reason]);
    } else {
      setSelectedReasons(prev => prev.filter(r => r !== reason));
    }
  };

  const handleSubmit = async () => {
    if (selectedReasons.length === 0) return;
    
    setIsSubmitting(true);
    try {
      await onReport(selectedReasons);
      setSelectedReasons([]);
      onClose();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OXMModal isOpen={isOpen} onClose={onClose} variant="default">
      <div className="report-modal-content">
        <div className="report-modal-header">
          <h2>Signaler un message</h2>
          <button className="report-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {messageText && (
          <div className="report-modal-message-preview">
            <div className="report-modal-message-sender">{senderName || 'Utilisateur'}</div>
            <div className="report-modal-message-text">{messageText}</div>
          </div>
        )}

        <div className="report-modal-body">
          <p className="report-modal-label">Raison du signalement (une ou plusieurs) :</p>
          <div className="report-modal-reasons">
            {REPORT_REASONS.map((reason) => (
              <OXMCheckbox
                key={reason}
                label={reason}
                checked={selectedReasons.includes(reason)}
                onChange={(checked) => handleToggleReason(reason, checked)}
                theme="purple"
              />
            ))}
          </div>
        </div>

        <div className="report-modal-footer">
          <OXMButton
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Annuler
          </OXMButton>
          <OXMButton
            variant="primary"
            onClick={handleSubmit}
            disabled={selectedReasons.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Envoi...' : 'Signaler'}
          </OXMButton>
        </div>
      </div>
    </OXMModal>
  );
};

export default ReportMessageModal;

