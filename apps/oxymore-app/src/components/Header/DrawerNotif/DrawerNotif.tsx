import React from 'react';
import { OXMDrawer } from "@oxymore/ui";
import './DrawerNotif.scss';
import { Bell, CheckCircle, AlertTriangle, MessageCircle } from 'lucide-react';

const mockNotifs = [
  {
    id: 1,
    type: 'message',
    title: 'Nouveau message',
    text: 'Tu as reçu un message de Player1.',
    time: 'il y a 2 min',
    icon: <MessageCircle size={20} />,
    read: false,
  },
  {
    id: 2,
    type: 'success',
    title: 'Succès',
    text: 'Ton équipe a été inscrite au tournoi !',
    time: 'il y a 10 min',
    icon: <CheckCircle size={20} />,
    read: false,
  },
  {
    id: 3,
    type: 'alert',
    title: 'Alerte',
    text: 'Maintenance prévue demain à 3h.',
    time: 'il y a 1h',
    icon: <AlertTriangle size={20} />,
    read: true,
  },
];

interface DrawerNotifProps {
  open: boolean;
  onClose: () => void;
}

const DrawerNotif: React.FC<DrawerNotifProps> = ({ open, onClose }) => {
  const unreadCount = mockNotifs.filter(n => !n.read).length;
  return (
    <OXMDrawer open={open} onClose={onClose} side="right" width={380} className="drawer-notif">
      <div className="drawer-notif-header">
        <Bell size={22} />
        <span>Notifications</span>
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </div>
      <div className="drawer-notif-list">
        {mockNotifs.map(notif => (
          <div key={notif.id} className={`drawer-notif-item ${notif.read ? 'read' : 'unread'} notif-${notif.type}`}>
            <div className="drawer-notif-icon">{notif.icon}</div>
            <div className="drawer-notif-content">
              <div className="drawer-notif-title">{notif.title}</div>
              <div className="drawer-notif-text">{notif.text}</div>
              <div className="drawer-notif-time">{notif.time}</div>
            </div>
          </div>
        ))}
        {mockNotifs.length === 0 && (
          <div className="drawer-notif-empty">Aucune notification pour l'instant.</div>
        )}
      </div>
    </OXMDrawer>
  );
};

export default DrawerNotif;
