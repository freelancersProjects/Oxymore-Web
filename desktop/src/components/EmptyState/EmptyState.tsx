import React from 'react';
import './EmptyState.scss';

interface EmptyStateProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="empty-state">
      <Icon size={64} className="empty-state-icon" />
      <p className="empty-state-title">{title}</p>
      <span className="empty-state-description">{description}</span>
    </div>
  );
};

export default EmptyState;

