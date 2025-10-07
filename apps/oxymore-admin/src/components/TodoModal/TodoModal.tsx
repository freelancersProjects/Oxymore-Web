import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Dropdown from '../Dropdown/Dropdown';

interface Todo {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingTodo?: Todo | null;
  adminUsers?: any[];
  isUserAdmin?: (user: any) => boolean;
}

const TodoModal = ({ isOpen, onClose, onSave, editingTodo, adminUsers = [], isUserAdmin }: TodoModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as Todo['status'],
    priority: 'medium' as Todo['priority'],
    assignee: '',
    tags: [] as string[],
    dueDate: ''
  });

  const [newTag, setNewTag] = useState('');

  // Utiliser les vrais admins
  const users = adminUsers.map(user => ({
    id: user.id_user,
    name: user.username,
    avatar: user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
  }));

  useEffect(() => {
    if (isOpen) {
      if (editingTodo) {
        setFormData({
          title: editingTodo.title,
          description: editingTodo.description || '',
          status: editingTodo.status,
          priority: editingTodo.priority,
          assignee: editingTodo.assignee?.id || '',
          tags: editingTodo.tags,
          dueDate: editingTodo.dueDate || ''
        });
      } else {
        setFormData({
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          assignee: '',
          tags: [],
          dueDate: ''
        });
      }
    }
  }, [isOpen, editingTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedUser = users.find(u => u.id === formData.assignee);

    onSave({
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      assignee: selectedUser ? {
        id: selectedUser.id,
        name: selectedUser.name,
        avatar: selectedUser.avatar
      } : undefined,
      tags: formData.tags,
      dueDate: formData.dueDate || undefined
    });

    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[var(--card-background)] rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-[var(--border-color)] max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary">
              {editingTodo ? 'Modifier la tâche' : 'Nouvelle tâche'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-secondary" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Titre *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="input-base w-full"
                placeholder="Titre de la tâche"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="input-base w-full h-24 resize-none"
                placeholder="Description de la tâche"
              />
            </div>

            {/* Statut et Priorité */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Statut
                </label>
                <Dropdown
                  options={[
                    { value: 'todo', label: 'À faire' },
                    { value: 'in_progress', label: 'En cours' },
                    { value: 'done', label: 'Terminé' }
                  ]}
                  value={formData.status}
                  onChange={(value) => setFormData(prev => ({ ...prev, status: value as Todo['status'] }))}
                  placeholder="Sélectionner un statut"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Priorité
                </label>
                <Dropdown
                  options={[
                    { value: 'low', label: 'Faible' },
                    { value: 'medium', label: 'Moyenne' },
                    { value: 'high', label: 'Élevée' },
                    { value: 'urgent', label: 'Urgente' }
                  ]}
                  value={formData.priority}
                  onChange={(value) => setFormData(prev => ({ ...prev, priority: value as Todo['priority'] }))}
                  placeholder="Sélectionner une priorité"
                />
              </div>
            </div>

            {/* Assigné et Date d'échéance */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Assigné à
                </label>
                <Dropdown
                  options={[
                    { value: '', label: 'Non assigné' },
                    ...users.map(user => ({
                      value: user.id,
                      label: user.name,
                      disabled: isUserAdmin ? isUserAdmin(user) : false,
                      tooltip: isUserAdmin && isUserAdmin(user) ? 'Vous ne pouvez pas assigner cette tâche à un admin' : undefined
                    }))
                  ]}
                  value={formData.assignee}
                  onChange={(value) => setFormData(prev => ({ ...prev, assignee: value }))}
                  placeholder="Sélectionner un utilisateur"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Date d'échéance
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="input-base w-full"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[var(--overlay-hover)] text-sm text-secondary rounded-full flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="input-base flex-1"
                  placeholder="Ajouter un tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="button-secondary px-4 py-2 rounded-lg"
                >
                  Ajouter
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
              <button
                type="button"
                onClick={onClose}
                className="button-secondary px-6 py-2 rounded-lg"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="button-primary px-6 py-2 rounded-lg"
              >
                {editingTodo ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TodoModal;
