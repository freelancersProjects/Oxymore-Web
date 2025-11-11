import { Minus, Square, X } from 'lucide-react';
import './TitleBar.scss';

const TitleBar = () => {
  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimize();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.maximize();
    }
  };

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.close();
    }
  };

  return (
    <div className="title-bar">
      <div className="title-bar-drag-region">
        <span className="title-bar-title">Oxymore</span>
      </div>
      <div className="title-bar-controls">
        <button
          className="title-bar-button minimize"
          onClick={handleMinimize}
          aria-label="Minimize"
        >
          <Minus size={16} />
        </button>
        <button
          className="title-bar-button maximize"
          onClick={handleMaximize}
          aria-label="Maximize"
        >
          <Square size={14} />
        </button>
        <button
          className="title-bar-button close"
          onClick={handleClose}
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;


