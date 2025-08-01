import React from 'react';
import {
  Search,
  Sidebar,
  Moon,
  Maximize2,
  Play,
  Volume2,
  X,
  Command,
  Radio,
  MessageSquare,
  Map as MapIcon,
  Gamepad2
} from 'lucide-react';

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
    icon?: React.ElementType;
  }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'Navigation',
    shortcuts: [
      {
        keys: ['⌘', 'B'],
        description: 'Toggle sidebar',
        icon: Sidebar
      },
      {
        keys: ['⌘', 'K'],
        description: 'Open search',
        icon: Search
      },
      {
        keys: ['⌘', 'D'],
        description: 'Toggle theme',
        icon: Moon
      },
      {
        keys: ['⌘', 'G'],
        description: 'Open mini-games',
        icon: Gamepad2
      }
    ]
  },
  {
    title: 'Match Control',
    shortcuts: [
      {
        keys: ['⌘', 'L'],
        description: 'Open live match view',
        icon: Radio
      },
      {
        keys: ['⌘', 'P'],
        description: 'Open map pick/ban',
        icon: MapIcon
      },
      {
        keys: ['F'],
        description: 'Toggle fullscreen',
        icon: Maximize2
      },
      {
        keys: ['Space'],
        description: 'Play/Pause stream',
        icon: Play
      },
      {
        keys: ['M'],
        description: 'Mute/Unmute',
        icon: Volume2
      },
      {
        keys: ['C'],
        description: 'Toggle chat',
        icon: MessageSquare
      },
      {
        keys: ['Esc'],
        description: 'Close live view',
        icon: X
      }
    ]
  }
];

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center" style={{ marginTop: '6rem' }}>
      {/* Overlay qui couvre tout l'écran */}
      <div
        className="fixed inset-0 bg-black/30"
        style={{ backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-[500px] max-h-[calc(100vh-8rem)] overflow-auto bg-[var(--card-background)] rounded-2xl shadow-2xl border border-[var(--border-color)]">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[var(--card-background)] p-4 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-oxymore flex items-center justify-center">
                <Command className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Keyboard Shortcuts</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-[var(--text-primary)]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="space-y-6">
            {shortcutGroups.map((group, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.shortcuts.map((shortcut, shortcutIndex) => (
                    <div
                      key={shortcutIndex}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--overlay-hover)] transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        {shortcut.icon && (
                          <div className="w-7 h-7 rounded-lg bg-[var(--overlay-hover)] group-hover:bg-[var(--overlay-active)] flex items-center justify-center transition-colors">
                            <shortcut.icon className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-oxymore-purple transition-colors" />
                          </div>
                        )}
                        <span className="text-sm text-[var(--text-primary)]">{shortcut.description}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="min-w-[24px] h-6 px-1.5 flex items-center justify-center bg-[var(--overlay-hover)] group-hover:bg-[var(--overlay-active)] border border-[var(--border-color)] rounded-md text-xs font-medium text-[var(--text-primary)]">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-xs text-[var(--text-secondary)]">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 bg-[var(--overlay-hover)] p-3 border-t border-[var(--border-color)]">
          <p className="text-center text-[var(--text-secondary)] text-xs flex items-center justify-center gap-1.5">
            Press
            <kbd className="min-w-[24px] h-6 px-1.5 flex items-center justify-center bg-[var(--overlay-active)] border border-[var(--border-color)] rounded-md text-xs font-medium text-[var(--text-primary)]">
              ⌘
            </kbd>
            +
            <kbd className="min-w-[24px] h-6 px-1.5 flex items-center justify-center bg-[var(--overlay-active)] border border-[var(--border-color)] rounded-md text-xs font-medium text-[var(--text-primary)]">
              /
            </kbd>
            to open shortcuts at any time
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;

