import React, { useState, useEffect } from 'react';
import { OXMDrawer, OXMLoader } from "@oxymore/ui";
import './DrawerNotif.scss';
import { Bell, CheckCircle, AlertTriangle, MessageCircle, Info, Trash2, ChevronDown } from 'lucide-react';
import { notificationService } from '../../../services/notificationService';
import type { NotificationWithReadStatus, NotificationType } from '../../../types/notification';

interface DrawerNotifProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'message':
      return <MessageCircle size={18} />;
    case 'success':
      return <CheckCircle size={18} />;
    case 'alert':
      return <AlertTriangle size={18} />;
    case 'info':
      return <Info size={18} />;
    default:
      return <Bell size={18} />;
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
      const data = await notificationService.getByUserId(userId);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  const handleMarkAsRead = async (notificationId: string) => {
    const notification = notifications.find(n => n.id_notification === notificationId);
    if (notification?.is_read) return;
    
    try {
      await notificationService.markAsRead(userId, notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.id_notification === notificationId 
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteNotif = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    try {
      await notificationService.deleteForUser(userId, notificationId);
      setNotifications(prev => prev.filter(n => n.id_notification !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const toggleExpanded = async (notificationId: string) => {
    const notification = notifications.find(n => n.id_notification === notificationId);
    
    if (!notification?.is_read) {
      await handleMarkAsRead(notificationId);
    }
    
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
    <OXMDrawer open={open} onClose={onClose} side="right" width={420} className="drawer-notif">
      <div className="drawer-notif-header">
        <div className="drawer-notif-title-section">
          <Bell size={22} className="drawer-notif-header-icon" />
          <span className="drawer-notif-title-main">
            Notifications
            {unreadCount > 0 && (
              <span className="notif-count">({unreadCount})</span>
            )}
          </span>
        </div>
      </div>

      <div className="drawer-notif-separator">
        <div className="separator-line"></div>
      </div>

      <div className="drawer-notif-list">
        {loading ? (
          <div className="drawer-notif-loading">
            <OXMLoader type="normal" text="Chargement des notifications..." />
          </div>
        ) : notifications.length > 0 ? (
          notifications.map(notif => {
            const isExpanded = expandedNotifications.has(notif.id_notification);
            const isUnread = !notif.is_read;
            
            return (
              <div
                key={notif.id_notification}
                className={`drawer-notif-item ${isUnread ? 'unread' : 'read'} notif-${notif.type} ${isExpanded ? 'expanded' : ''}`}
                onClick={() => toggleExpanded(notif.id_notification)}
              >
                <div className="drawer-notif-left">
                  <div className={`drawer-notif-icon notif-icon-${notif.type}`}>
                    {getNotificationIcon(notif.type)}
                  </div>
                </div>
                <div className="drawer-notif-content">
                  <div className="drawer-notif-header-item">
                    <div className="drawer-notif-title">{notif.title}</div>
                    <div className="drawer-notif-actions">
                      <button
                        className="drawer-notif-trash-btn"
                        title="Supprimer la notification"
                        onClick={(e) => handleDeleteNotif(e, notif.id_notification)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="drawer-notif-text">
                      {notif.text}
                    </div>
                  )}
                  <div className="drawer-notif-footer">
                    <div className="drawer-notif-time">{formatTimeAgo(notif.created_at)}</div>
                    <ChevronDown 
                      size={16} 
                      className={`drawer-notif-chevron ${isExpanded ? 'expanded' : ''}`} 
                    />
                  </div>
                </div>
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
