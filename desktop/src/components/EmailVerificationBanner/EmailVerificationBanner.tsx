import React, { useState, useEffect } from 'react';
import { Mail, X } from 'lucide-react';
import apiService from '../../api/apiService';
import './EmailVerificationBanner.scss';

interface EmailVerificationBannerProps {
  onVerificationSent?: () => void;
}

const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({ onVerificationSent }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('emailVerificationBannerDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleSendVerification = async () => {
    setIsSending(true);
    try {
      await apiService.post('/auth/send-verification-email');
      setMessage('Email de vérification envoyé avec succès!');
      if (onVerificationSent) {
        onVerificationSent();
      }
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Erreur lors de l\'envoi de l\'email');
    } finally {
      setIsSending(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem('emailVerificationBannerDismissed', 'true');
    setIsDismissed(true);
  };

  return (
    <div className="email-verification-banner">
      <div className={`email-verification-banner-content ${isDismissed ? 'dismissed' : ''}`}>
        <div className="email-verification-banner-icon">
          <Mail size={20} />
        </div>
        <div className="email-verification-banner-text">
          {message ? (
            <p className="email-verification-banner-message">{message}</p>
          ) : (
            <p className="email-verification-banner-title">Vérifiez votre email pour accéder à toutes les fonctionnalités</p>
          )}
        </div>
        <div className="email-verification-banner-actions">
          <button
            className="email-verification-banner-button"
            onClick={handleSendVerification}
            disabled={isSending}
          >
            {isSending ? 'Envoi...' : 'Envoyer l\'email'}
          </button>
          <button
            className="email-verification-banner-close"
            onClick={handleDismiss}
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;

