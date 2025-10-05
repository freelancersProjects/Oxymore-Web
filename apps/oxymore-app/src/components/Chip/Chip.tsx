import React from 'react';
import './Chip.scss';

export interface ChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
}

const Chip: React.FC<ChipProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  className = '',
  onClick
}) => {
  const chipClasses = [
    'oxm-chip',
    `oxm-chip--${variant}`,
    `oxm-chip--${size}`,
    onClick ? 'oxm-chip--clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={chipClasses} onClick={onClick}>
      {children}
    </span>
  );
};

export default Chip;
