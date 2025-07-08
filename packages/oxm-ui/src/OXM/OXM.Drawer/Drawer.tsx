import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import './Drawer.scss';

export interface OXMDrawerProps {
  open: boolean;
  onClose: () => void;
  side?: 'right' | 'left';
  children: ReactNode;
  width?: number | string;
  className?: string;
}

const OXMDrawer: React.FC<OXMDrawerProps> = ({
  open,
  onClose,
  side = 'right',
  children,
  width = 400,
  className = '',
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <div className={`oxm-drawer-overlay${open ? ' open' : ''}`} onClick={onClose} />
      <aside
        className={`oxm-drawer ${side} ${open ? 'open' : ''} ${className}`}
        style={{ width }}
        aria-hidden={!open}
      >
        <button className="oxm-drawer-close" onClick={onClose} aria-label="Fermer le drawer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div className="oxm-drawer-content">{children}</div>
      </aside>
    </>
  );
};

export default OXMDrawer;
