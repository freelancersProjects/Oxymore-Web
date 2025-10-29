import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { OXMModal, OXMButton } from '@oxymore/ui';
import './TeamCVModal.scss';

interface TeamCVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subject: string, message: string) => Promise<void>;
  teamName: string;
}

const TeamCVModal: React.FC<TeamCVModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  teamName
}) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(subject.trim(), message.trim());
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting CV:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OXMModal isOpen={isOpen} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="team-cv-modal-content"
      >
        <div className="cv-modal-header">
          <div>
            <h2>Postuler à {teamName}</h2>
            <p>Convainquez l'équipe de votre motivation et de vos compétences</p>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="cv-modal-form">
          <div className="form-group">
            <label htmlFor="subject">Sujet</label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Candidature pour rejoindre l'équipe"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Présentez-vous, expliquez pourquoi vous souhaitez rejoindre cette équipe, vos compétences, votre expérience..."
              rows={8}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="cv-modal-actions">
            <OXMButton
              variant="secondary"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </OXMButton>
            <OXMButton
              variant="primary"
              type="submit"
              disabled={isSubmitting || !subject.trim() || !message.trim()}
            >
              {isSubmitting ? (
                'Envoi en cours...'
              ) : (
                <>
                  <Send size={18} />
                  Envoyer la candidature
                </>
              )}
            </OXMButton>
          </div>
        </form>
      </motion.div>
    </OXMModal>
  );
};

export default TeamCVModal;


