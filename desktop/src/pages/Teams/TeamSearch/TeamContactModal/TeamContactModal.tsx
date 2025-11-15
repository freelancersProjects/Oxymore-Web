import React, { useState } from 'react';
import { X } from 'lucide-react';
import { OXMModal, OXMButton, OXMToast } from '@oxymore/ui';
import apiService from '../../../../api/apiService';
import './TeamContactModal.scss';

interface TeamContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  captainId: string;
}

const TeamContactModal: React.FC<TeamContactModalProps> = ({
  isOpen,
  onClose,
  teamName,
  captainId
}) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      setToast({ message: 'Veuillez remplir tous les champs', type: 'error' });
      return;
    }

    if (message.length > 500) {
      setToast({ message: 'Le message ne peut pas dépasser 500 caractères', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const messageContent = `Sujet: ${subject}\n\n${message}`;
      await apiService.post('/private-messages', {
        content: messageContent,
        receiver_id: captainId
      });

      setToast({ message: 'Message envoyé avec succès au capitaine', type: 'success' });
      setSubject('');
      setMessage('');
      
      setTimeout(() => {
        onClose();
        setToast(null);
      }, 1500);
    } catch (error: any) {
      console.error('Error sending message:', error);
      setToast({ 
        message: error?.response?.data?.error || 'Erreur lors de l\'envoi du message', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <OXMModal isOpen={isOpen} onClose={onClose} variant="medium">
        <div className="team-contact-modal">
          <div className="team-contact-modal-header">
            <h2>Contacter le capitaine de {teamName}</h2>
            <button className="close-button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="team-contact-form">
            <div className="form-group">
              <label htmlFor="subject">Sujet</label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Sujet de votre message"
                maxLength={100}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Votre message au capitaine..."
                rows={8}
                maxLength={500}
                disabled={isLoading}
              />
              <span className="character-count">{message.length}/500</span>
            </div>

            <div className="form-actions">
              <OXMButton 
                type="button" 
                variant="secondary" 
                onClick={onClose}
                disabled={isLoading}
              >
                Annuler
              </OXMButton>
              <OXMButton 
                type="submit" 
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? 'Envoi...' : 'Envoyer'}
              </OXMButton>
            </div>
          </form>
        </div>
      </OXMModal>

      {toast && (
        <OXMToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default TeamContactModal;

