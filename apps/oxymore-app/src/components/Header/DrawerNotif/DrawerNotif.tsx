import React, { useState, useEffect } from 'react';
import { OXMDrawer } from "@oxymore/ui";
import './DrawerNotif.scss';
import { Bell, CheckCircle, AlertTriangle, MessageCircle, Loader2, Trash2 } from 'lucide-react';
import apiService from '../../../api/apiService';
import type { NotificationWithReadStatus, NotificationType } from '@oxymore/types';

interface DrawerNotifProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'message':
      return <MessageCircle size={20} />;
    case 'success':
      return <CheckCircle size={20} />;
    case 'alert':
      return <AlertTriangle size={20} />;
    default:
      return <Bell size={20} />;
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'À l\'instant';
  if (diffInMinutes < 60) return `il y a ${diffInMinutes} min`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `il y a ${diffInHours}h`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `il y a ${diffInDays}j`;
};

const DrawerNotif: React.FC<DrawerNotifProps> = ({ open, onClose, userId }) => {
  const [notifications, setNotifications] = useState<NotificationWithReadStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await apiService.get(`/notifications/user/${userId}`);
      setNotifications(data);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, userId]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await apiService.post(`/notifications/user/${userId}/mark-read/${notificationId}`);
      await fetchNotifications();
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  // const handleMarkAllAsRead = async () => {
  //   setMarkingAllRead(true);
  //   try {
  //     await apiService.post(`/notifications/user/${userId}/mark-all-read`);
  //     await fetchNotifications();
  //   } catch (error) {
  //     console.error('Erreur lors du marquage de toutes les notifications:', error);
  //   } finally {
  //     setMarkingAllRead(false);
  //   }
  // };

  const handleDeleteNotif = async (notificationId: string) => {
    try {
      await apiService.delete(`/notifications/user/${userId}/${notificationId}`);
      await fetchNotifications();
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
    }
  };

  const toggleExpanded = (notificationId: string) => {
    setExpandedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <OXMDrawer open={open} onClose={onClose} side="right" width={380} className="drawer-notif">
      <div className="drawer-notif-header">
        <div className="drawer-notif-title-section">
          <Bell size={22} className="drawer-notif-header-icon" />
          <span className="drawer-notif-title-main">Notifications</span>
        </div>
        <span className="notif-badge-right">{unreadCount}</span>
        {/* {unreadCount > 0 && (
          <button
            className='drawer-notif-header-btn'
            onClick={handleMarkAllAsRead}
            disabled={markingAllRead}
          >
            {markingAllRead ? (
              <Loader2 size={16} className="spinner" />
            ) : null}
            Marquer comme lu
          </button>
        )} */}
      </div>

      <div className="drawer-notif-separator">
        <div className="separator-line"></div>
      </div>

      <div className="drawer-notif-list">
        {loading ? (
          <div className="drawer-notif-loading">
            <Loader2 size={24} className="spinner" />
            <span>Chargement des notifications...</span>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map(notif => {
            const isExpanded = expandedNotifications.has(notif.id_notification);
            return (
              <div
                key={notif.id_notification}
                className={`drawer-notif-item ${notif.is_read ? 'read' : 'unread'} notif-${notif.type} ${isExpanded ? 'expanded' : ''}`}
                onClick={() => {
                  // Force l'envoi de la requête pour tester
                  handleMarkAsRead(notif.id_notification);
                  toggleExpanded(notif.id_notification);
                }}
              >
                <div className="drawer-notif-icon">{getNotificationIcon(notif.type)}</div>
                <div className="drawer-notif-content">
                  <div className="drawer-notif-title">{notif.title}</div>
                  <div className={`drawer-notif-text ${isExpanded ? 'expanded' : ''}`}>
                    {notif.text}
                  </div>
                  <div className="drawer-notif-time">{formatTimeAgo(notif.created_at)}</div>
                </div>
                <button
                  className="drawer-notif-trash-btn"
                  title="Supprimer la notification"
                  onClick={e => { e.stopPropagation(); handleDeleteNotif(notif.id_notification); }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })
        ) : (
          <div className="drawer-notif-empty">
            <Bell size={48} className="empty-icon" />
            <h3>Aucune notification</h3>
            <p>Vous n'avez pas encore reçu de notifications. Elles apparaîtront ici quand vous en aurez.</p>
          </div>
        )}
      </div>
    </OXMDrawer>
  );
};

export default DrawerNotif;
