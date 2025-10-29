import React from 'react';
import './Badge.scss';

export interface BadgeProps {
  count: number;
  variant?: 'toolbar' | 'sidebar';
  maxCount?: number;
}

const Badge: React.FC<BadgeProps> = ({ count, variant = 'toolbar', maxCount = 99 }) => {
  if (count <= 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count;

  return (
    <span className={`oxm-badge oxm-badge--${variant}`}>
      {displayCount}
    </span>
  );
};

export default Badge;


