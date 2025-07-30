import React, { useState } from 'react';
import './Tooltip.scss';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  disabled?: boolean;
}

// Fonction utilitaire pour générer les messages de tooltip
export const getTooltipMessage = (
  canModify: boolean,
  isOwnAccount: boolean,
  isAdmin: boolean,
  action: string
): string => {
  if (canModify) {
    return `${action} cet utilisateur`;
  }
  
  if (isOwnAccount) {
    return `Vous ne pouvez pas ${action.toLowerCase()} votre propre compte`;
  }
  
  if (isAdmin) {
    return `Vous ne pouvez pas ${action.toLowerCase()} un compte administrateur`;
  }
  
  return `Action non autorisée`;
};

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  disabled = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div 
      className="tooltip-container"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`tooltip tooltip-${position}`}>
          {content}
          <div className="tooltip-arrow" />
        </div>
      )}
    </div>
  );
};

export default Tooltip; 