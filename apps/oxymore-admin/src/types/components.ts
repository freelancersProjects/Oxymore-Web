// Interfaces pour les composants

import React from 'react';

export interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: string | number;
  color?: string;
  description?: string;
}

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}
