import React, { useState, useRef, useEffect } from 'react';
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
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const [adjustmentClass, setAdjustmentClass] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Fonction pour calculer la position optimale de la tooltip
  const calculateOptimalPosition = () => {
    if (!containerRef.current || !tooltipRef.current) return { position, adjustment: '' };

    const container = containerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    const positions = ['top', 'bottom', 'left', 'right'] as const;
    const positionOffsets = {
      top: { x: 0, y: -tooltip.height - 8 },
      bottom: { x: 0, y: container.height + 8 },
      left: { x: -tooltip.width - 8, y: 0 },
      right: { x: container.width + 8, y: 0 }
    };

    // Essayer d'abord la position demandée
    const preferredPosition = position;
    const preferredOffset = positionOffsets[preferredPosition];
    const preferredRect = {
      left: container.left + preferredOffset.x,
      top: container.top + preferredOffset.y,
      right: container.left + preferredOffset.x + tooltip.width,
      bottom: container.top + preferredOffset.y + tooltip.height
    };

    // Vérifier si la position préférée fonctionne
    if (
      preferredRect.left >= 0 &&
      preferredRect.right <= viewport.width &&
      preferredRect.top >= 0 &&
      preferredRect.bottom <= viewport.height
    ) {
      return { position: preferredPosition, adjustment: '' };
    }

    // Sinon, trouver la meilleure position alternative
    for (const pos of positions) {
      if (pos === preferredPosition) continue;

      const offset = positionOffsets[pos];
      const rect = {
        left: container.left + offset.x,
        top: container.top + offset.y,
        right: container.left + offset.x + tooltip.width,
        bottom: container.top + offset.y + tooltip.height
      };

      // Vérifier si cette position fonctionne
      if (
        rect.left >= 0 &&
        rect.right <= viewport.width &&
        rect.top >= 0 &&
        rect.bottom <= viewport.height
      ) {
        return { position: pos, adjustment: '' };
      }
    }

    // Si aucune position ne fonctionne parfaitement, choisir celle qui déborde le moins
    let bestPosition = preferredPosition;
    let minOverflow = Infinity;
    let bestAdjustment = '';

    for (const pos of positions) {
      const offset = positionOffsets[pos];
      const rect = {
        left: container.left + offset.x,
        top: container.top + offset.y,
        right: container.left + offset.x + tooltip.width,
        bottom: container.top + offset.y + tooltip.height
      };

      const overflow = Math.max(
        -rect.left,
        rect.right - viewport.width,
        -rect.top,
        rect.bottom - viewport.height,
        0
      );

      if (overflow < minOverflow) {
        minOverflow = overflow;
        bestPosition = pos;

        // Déterminer l'ajustement nécessaire
        if (pos === 'top' || pos === 'bottom') {
          if (rect.left < 0) {
            bestAdjustment = 'tooltip-adjust-left';
          } else if (rect.right > viewport.width) {
            bestAdjustment = 'tooltip-adjust-right';
          }
        } else if (pos === 'left' || pos === 'right') {
          if (rect.top < 0) {
            bestAdjustment = 'tooltip-adjust-top';
          } else if (rect.bottom > viewport.height) {
            bestAdjustment = 'tooltip-adjust-bottom';
          }
        }
      }
    }

    return { position: bestPosition, adjustment: bestAdjustment };
  };

  useEffect(() => {
    if (isVisible) {
      const { position: newPosition, adjustment } = calculateOptimalPosition();
      setAdjustedPosition(newPosition);
      setAdjustmentClass(adjustment);
    }
  }, [isVisible, position]);

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div
      ref={containerRef}
      className="tooltip-container"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`tooltip tooltip-${adjustedPosition} ${adjustmentClass}`}
        >
          {content}
          <div className="tooltip-arrow" />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
