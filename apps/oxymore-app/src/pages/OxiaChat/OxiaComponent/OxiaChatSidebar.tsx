import React, { useState, useRef, useEffect } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import LogoOxia from '../../../assets/images/Oxia.png';
import './OxiaChatSidebar.scss';

interface Channel {
  id_channel: string;
  name: string;
  user_id: string;
  created_at: string;
}

interface SidebarProps {
  channels: Channel[];
  selectedChannel: Channel | null;
  setSelectedChannel: (ch: Channel) => void;
  onOpenModal: () => void;
  onRename: (ch: Channel) => void;
  onDelete: (ch: Channel) => void;
}

const truncate = (str: string, n: number) =>
  str.length > n ? str.slice(0, n - 1) + '…' : str;

const OxiaChatSidebar: React.FC<SidebarProps> = ({
  channels,
  selectedChannel,
  setSelectedChannel,
  onOpenModal,
  onRename,
  onDelete,
}) => {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    if (menuOpenId) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpenId]);

  return (
    <aside className="oxia-chat-sidebar">
      <div className="oxia-chat-sidebar__header">
        <img src={LogoOxia} alt="Oxia Logo" className="oxia-chat-logo" />
        <span className="oxia-chat-title">Oxia</span>
        <span className="oxia-beta-chip">Bêta</span>
      </div>
      <div className="oxia-chat-channels">
        <div className="oxia-chat-channels-title sidebar-channels-title">
          <span>Channels</span>
          <button className="oxia-add-channel-btn" onClick={onOpenModal} title="Créer un channel">
            <Plus size={22} color="#fff" />
          </button>
        </div>
        <ul>
          {channels.map((ch) => (
            <li
              key={ch.id_channel}
              className={
                (selectedChannel?.id_channel === ch.id_channel ? "active " : "") + "sidebar-channel-item"
              }
              onClick={() => setSelectedChannel(ch)}
            >
              <span
                title={ch.name}
                className="sidebar-channel-name"
              >
                {truncate(ch.name, 20)}
              </span>
              <button
                onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === ch.id_channel ? null : ch.id_channel); }}
                className={
                  'sidebar-channel-menu-btn' + (menuOpenId === ch.id_channel ? ' active' : '')
                }
                tabIndex={0}
                aria-label="Ouvrir le menu du channel"
              >
                <MoreHorizontal size={22} />
              </button>
              {menuOpenId === ch.id_channel && (
                <div
                  ref={menuRef}
                  className="oxia-channel-menu sidebar-channel-menu"
                >
                  <button
                    onClick={e => { e.stopPropagation(); setMenuOpenId(null); onRename(ch); }}
                    className="sidebar-channel-menu-action sidebar-channel-menu-rename"
                  >
                    Renommer
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setMenuOpenId(null); onDelete(ch); }}
                    className="sidebar-channel-menu-action sidebar-channel-menu-delete"
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default OxiaChatSidebar;
