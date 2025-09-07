import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ContextMenuOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface ContextMenuProps {
  options: ContextMenuOption[];
  trigger: React.ReactNode;
  className?: string;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  options,
  trigger,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (option: ContextMenuOption) => {
    if (option.onClick) {
      option.onClick();
    }
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-1 w-32 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg shadow-lg z-50"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--overlay-hover)] flex items-center gap-2 transition-colors ${
                  option.className || ''
                }`}
              >
                {option.icon && (
                  <span className="flex-shrink-0">
                    {option.icon}
                  </span>
                )}
                <span className="truncate">{option.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContextMenu;


