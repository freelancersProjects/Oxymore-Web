import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Trash2,
  Clock,
  Globe
} from 'lucide-react';
import { apiService } from '../../api/apiService';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';

interface Notification {
  id_notification: string;
  type: 'message' | 'success' | 'alert';
  title: string;
  text: string;
  created_at: string;
  id_user?: string | null;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);
  
  // Form state
  const [type, setType] = useState<'message' | 'success' | 'alert'>('message');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    loadGlobalNotifications();
  }, []);

  const loadGlobalNotifications = async () => {
    try {
      setLoading(true);
      const allNotifications = await apiService.get<Notification[]>('/notifications');
      // Filtrer seulement les notifications globales (id_user IS NULL)
      const globalNotifications = allNotifications.filter(n => !n.id_user);
      setNotifications(globalNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !text.trim()) {
      return;
    }

    try {
      setSending(true);
      await apiService.post('/notifications', {
        type,
        title: title.trim(),
        text: text.trim(),
        id_user: null // Notification globale
      });
      
      // Reset form
      setTitle('');
      setText('');
      setType('message');
      setShowForm(false);
      
      // Reload notifications
      await loadGlobalNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setNotificationToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!notificationToDelete) return;

    try {
      await apiService.delete(`/notifications/${notificationToDelete}`);
      await loadGlobalNotifications();
      setNotificationToDelete(null);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getTypeIcon = (notificationType: string) => {
    switch (notificationType) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getTypeColor = (notificationType: string) => {
    switch (notificationType) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'alert':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getTypeGradient = (notificationType: string) => {
    switch (notificationType) {
      case 'success':
        return 'from-emerald-600 to-green-600';
      case 'alert':
        return 'from-red-600 to-orange-600';
      default:
        return 'from-blue-600 to-indigo-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--card-background)] rounded-2xl shadow-xl border border-[var(--border-color)] overflow-hidden"
        >
          <div className={`bg-gradient-to-r ${getTypeGradient(type)} p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Notifications Globales</h1>
                  <p className="text-white/80">Envoyez des notifications à tous les utilisateurs</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(!showForm)}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                {showForm ? <X className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                {showForm ? 'Annuler' : 'Nouvelle Notification'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[var(--card-background)] rounded-2xl shadow-xl border border-[var(--border-color)] overflow-hidden"
            >
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Créer une notification globale</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Type de notification
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['message', 'success', 'alert'] as const).map((notificationType) => (
                        <motion.button
                          key={notificationType}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setType(notificationType)}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            type === notificationType
                              ? `${getTypeColor(notificationType)} border-current`
                              : 'bg-[var(--overlay-hover)] border-[var(--border-color)] hover:border-[var(--text-secondary)]'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            {getTypeIcon(notificationType)}
                            <span className="capitalize font-medium">{notificationType}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Titre
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Titre de la notification"
                      className="w-full px-4 py-2 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Text */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Message
                    </label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Message de la notification"
                      rows={4}
                      className="w-full px-4 py-2 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      required
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 bg-[var(--overlay-hover)] text-[var(--text-primary)] rounded-lg font-medium hover:bg-[var(--border-color)] transition-all duration-200"
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={sending || !title.trim() || !text.trim()}
                      className={`px-6 py-2 bg-gradient-to-r ${getTypeGradient(type)} text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                        sending || !title.trim() || !text.trim()
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:opacity-90'
                      }`}
                    >
                      {sending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Envoi...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Envoyer
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--card-background)] rounded-2xl shadow-xl border border-[var(--border-color)] overflow-hidden"
        >
          <div className="p-6 border-b border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[var(--text-secondary)]" />
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Historique des notifications globales
                </h2>
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                {notifications.length} notification{notifications.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
                <p className="text-lg text-[var(--text-secondary)]">
                  Aucune notification globale créée
                </p>
                <p className="text-sm text-[var(--text-muted)] mt-2">
                  Créez votre première notification pour tous les utilisateurs
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id_notification}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-5 rounded-xl border-2 ${getTypeColor(notification.type)} transition-all duration-200 hover:shadow-lg`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                              {getTypeIcon(notification.type)}
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                              {notification.title}
                            </h3>
                          </div>
                          <p className="text-[var(--text-secondary)] mb-3">
                            {notification.text}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                            <Clock className="w-3 h-3" />
                            {formatDate(notification.created_at)}
                            <span className="mx-2">•</span>
                            <Globe className="w-3 h-3" />
                            Notification globale
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteClick(notification.id_notification)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={notificationToDelete !== null}
          onClose={() => setNotificationToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Supprimer la notification"
          message={
            notificationToDelete
              ? `Êtes-vous sûr de vouloir supprimer la notification "${notifications.find(n => n.id_notification === notificationToDelete)?.title}" ? Cette action est irréversible.`
              : ''
          }
          confirmText="Supprimer"
          cancelText="Annuler"
          type="danger"
        />
      </div>
    </div>
  );
};

export default Notifications;

