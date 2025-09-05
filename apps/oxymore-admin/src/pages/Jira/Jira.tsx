import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit,
  BarChart3
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import React from 'react';
import TodoModal from '../../components/TodoModal/TodoModal';
import Dropdown from '../../components/Dropdown/Dropdown';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import './Jira.css';

// Types pour les todos
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

// Types pour les colonnes
interface Column {
  id: string;
  title: string;
  status: Todo['status'];
  color: string;
  count: number;
}


const Jira = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0
  });

  // Colonnes du kanban
  const columns: Column[] = [
    { id: 'todo', title: 'À faire', status: 'todo', color: 'bg-gray-500', count: 0 },
    { id: 'in_progress', title: 'En cours', status: 'in_progress', color: 'bg-blue-500', count: 0 },
    { id: 'done', title: 'Terminé', status: 'done', color: 'bg-green-500', count: 0 }
  ];


  // Données de test
  useEffect(() => {
    const mockTodos: Todo[] = [
      {
        id: '1',
        title: 'Refonte de l\'interface utilisateur',
        description: 'Améliorer l\'UX/UI du dashboard principal',
        status: 'in_progress',
        priority: 'high',
        assignee: { id: '1', name: 'Mathis B.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mathis' },
        tags: ['UI/UX', 'Frontend'],
        dueDate: '2024-12-25',
        createdAt: '2024-12-15',
        updatedAt: '2024-12-19'
      },
      {
        id: '2',
        title: 'Optimisation des performances',
        description: 'Réduire les temps de chargement de 50%',
        status: 'todo',
        priority: 'medium',
        assignee: { id: '2', name: 'Alex D.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
        tags: ['Performance', 'Backend'],
        dueDate: '2024-12-30',
        createdAt: '2024-12-16',
        updatedAt: '2024-12-19'
      },
      {
        id: '3',
        title: 'Tests unitaires',
        description: 'Couvrir 80% du code avec des tests',
        status: 'done',
        priority: 'low',
        assignee: { id: '3', name: 'Sarah L.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
        tags: ['Testing', 'Quality'],
        dueDate: '2024-12-20',
        createdAt: '2024-12-10',
        updatedAt: '2024-12-18'
      },
      {
        id: '4',
        title: 'Documentation API',
        description: 'Créer la documentation Swagger complète',
        status: 'todo',
        priority: 'urgent',
        assignee: { id: '1', name: 'Mathis B.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mathis' },
        tags: ['Documentation', 'API'],
        dueDate: '2024-12-22',
        createdAt: '2024-12-17',
        updatedAt: '2024-12-19'
      }
    ];
    setTodos(mockTodos);
  }, []);

  // Calculer les statistiques
  useEffect(() => {
    const now = new Date();
    const overdue = todos.filter(todo =>
      todo.dueDate && new Date(todo.dueDate) < now && todo.status !== 'done'
    ).length;

    setStats({
      total: todos.length,
      completed: todos.filter(t => t.status === 'done').length,
      inProgress: todos.filter(t => t.status === 'in_progress').length,
      overdue
    });
  }, [todos]);

  // Filtrer les todos
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         todo.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  // Grouper les todos par statut (garder l'original pour le drop)
  const todosByStatus = {
    todo: filteredTodos.filter(t => t.status === 'todo'),
    in_progress: filteredTodos.filter(t => t.status === 'in_progress'),
    done: filteredTodos.filter(t => t.status === 'done')
  };

  // Gestion du drag & drop
  const handleDragStart = (start: any) => {
    const todo = todos.find(t => t.id === start.draggableId);
    setDraggedTodo(todo || null);
    // Initialiser la position au centre de l'écran
    setDragPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });
  };

  // Écouter les mouvements de la souris pendant le drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedTodo) {
        setDragPosition({ x: e.clientX, y: e.clientY });
      }
    };

    if (draggedTodo) {
      document.addEventListener('mousemove', handleMouseMove);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [draggedTodo]);

  const handleDragEnd = (result: DropResult) => {
    setDraggedTodo(null);

    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Si on déplace dans la même colonne, ne rien faire
    if (source.droppableId === destination.droppableId) return;

    // Mettre à jour le statut de la tâche
    setTodos(prev => prev.map(todo =>
      todo.id === draggableId
        ? { ...todo, status: destination.droppableId as Todo['status'], updatedAt: new Date().toISOString() }
        : todo
    ));
  };

  // Gestion de la création/modification des tâches
  const handleSaveTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTodo) {
      // Modification
      setTodos(prev => prev.map(todo =>
        todo.id === editingTodo.id
          ? { ...todo, ...todoData, updatedAt: new Date().toISOString() }
          : todo
      ));
    } else {
      // Création
      const newTodo: Todo = {
        ...todoData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTodos(prev => [...prev, newTodo]);
    }
    setEditingTodo(null);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowCreateModal(true);
  };

  const handleDeleteTodo = (todo: Todo) => {
    setTodoToDelete(todo);
    setShowDeleteModal(true);
  };

  const confirmDeleteTodo = () => {
    if (todoToDelete) {
      setTodos(prev => prev.filter(todo => todo.id !== todoToDelete.id));
      setShowDeleteModal(false);
      setTodoToDelete(null);
    }
  };

  // Obtenir la couleur de priorité
  const getPriorityColor = (priority: Todo['priority']) => {
    const colors = {
      low: 'text-green-400 bg-green-400/10',
      medium: 'text-yellow-400 bg-yellow-400/10',
      high: 'text-orange-400 bg-orange-400/10',
      urgent: 'text-red-400 bg-red-400/10'
    };
    return colors[priority];
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Jira</h1>
          <p className="text-secondary mt-1">Gestion des tâches et projets</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Nouvelle tâche
        </motion.button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-base p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Total</p>
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-base p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Terminées</p>
              <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-base p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">En cours</p>
              <p className="text-2xl font-bold text-blue-400">{stats.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-base p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">En retard</p>
              <p className="text-2xl font-bold text-red-400">{stats.overdue}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
        </motion.div>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une tâche..."
            className="input-base w-full pl-10"
          />
        </div>

        <Dropdown
          options={[
            { value: 'all', label: 'Toutes les priorités' },
            { value: 'low', label: 'Faible' },
            { value: 'medium', label: 'Moyenne' },
            { value: 'high', label: 'Élevée' },
            { value: 'urgent', label: 'Urgente' }
          ]}
          value={filterPriority}
          onChange={setFilterPriority}
          placeholder="Filtrer par priorité"
          className="w-48"
        />
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="kanban-container grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((column) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-base p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <h3 className="font-semibold text-primary">{column.title}</h3>
                </div>
                <span className="text-sm text-secondary bg-[var(--overlay-hover)] px-2 py-1 rounded-full">
                  {todosByStatus[column.status as keyof typeof todosByStatus].length}
                </span>
              </div>

              {/* @ts-ignore */}
              <Droppable droppableId={column.id} type="TASK">
                {(provided: any, snapshot: any) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[400px] space-y-3 transition-all duration-200 ${
                      snapshot.isDraggingOver
                        ? 'bg-blue-50/50 border-2 border-dashed border-blue-300 rounded-lg'
                        : ''
                    }`}
                  >
                    {todosByStatus[column.status as keyof typeof todosByStatus].map((todo, index) => (
                      <Draggable
                        key={todo.id}
                        draggableId={todo.id}
                        index={index}
                        isDragDisabled={false}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`card-base p-4 cursor-grab active:cursor-grabbing transition-all duration-200 ${
                              snapshot.isDragging
                                ? 'invisible'
                                : 'hover:shadow-lg hover:-translate-y-1'
                            }`}
                            style={{
                              ...provided.draggableProps.style,
                              transform: snapshot.isDragging
                                ? provided.draggableProps.style?.transform
                                : 'none'
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-start gap-2 flex-1">
                                <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full flex-shrink-0 mt-1" />
                                <h4 className="font-medium text-primary flex-1 break-words hyphens-auto leading-tight">{todo.title}</h4>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditTodo(todo);
                                  }}
                                  className="p-1 hover:bg-[var(--overlay-hover)] rounded transition-colors"
                                >
                                  <Edit className="w-4 h-4 text-secondary" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTodo(todo);
                                  }}
                                  className="p-1 hover:bg-red-500/10 hover:text-red-400 rounded transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 text-secondary" />
                                </button>
                              </div>
                            </div>

                            {todo.description && (
                              <p className="text-sm text-secondary mb-3 break-words hyphens-auto leading-relaxed">{todo.description}</p>
                            )}

                            <div className="flex items-center justify-between mb-3">
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                                {todo.priority}
                              </div>
                              {todo.dueDate && (
                                <div className="flex items-center gap-1 text-xs text-secondary">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(todo.dueDate).toLocaleDateString('fr-FR')}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {todo.assignee && (
                                  <div className="flex items-center gap-1">
                                    <div className="w-6 h-6 rounded-full bg-cover bg-center" style={{
                                      backgroundImage: `url(${todo.assignee.avatar})`
                                    }} />
                                    <span className="text-xs text-secondary">{todo.assignee.name}</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-1">
                                {todo.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-[var(--overlay-hover)] text-xs text-secondary rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder as React.ReactNode}
                  </div>
                )}
              </Droppable>
            </motion.div>
          ))}
        </div>
      </DragDropContext>

      {/* Modal de création/édition */}
      <TodoModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingTodo(null);
        }}
        onSave={handleSaveTodo}
        editingTodo={editingTodo}
      />

      {/* Modal de suppression */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setTodoToDelete(null);
        }}
        onConfirm={confirmDeleteTodo}
        title="Supprimer la tâche"
        message={`Êtes-vous sûr de vouloir supprimer la tâche "${todoToDelete?.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />

      {/* Drag Preview Portal - seulement pour l'affichage visuel */}
      {draggedTodo && createPortal(
        <div
          className="drag-preview"
          style={{
            left: dragPosition.x,
            top: dragPosition.y,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}
        >
          <div className="card-base p-4 w-80 max-w-[90vw]">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-2 flex-1">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full flex-shrink-0 mt-1" />
                <h4 className="font-medium text-primary flex-1 break-words hyphens-auto leading-tight">{draggedTodo.title}</h4>
              </div>
            </div>
            {draggedTodo.description && (
              <p className="text-sm text-secondary mb-3 break-words hyphens-auto leading-relaxed">{draggedTodo.description}</p>
            )}
            <div className="flex items-center justify-between mb-3">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(draggedTodo.priority)}`}>
                {draggedTodo.priority}
              </div>
              {draggedTodo.dueDate && (
                <div className="flex items-center gap-1 text-xs text-secondary">
                  <Calendar className="w-3 h-3" />
                  {new Date(draggedTodo.dueDate).toLocaleDateString('fr-FR')}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {draggedTodo.assignee && (
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-cover bg-center" style={{
                      backgroundImage: `url(${draggedTodo.assignee.avatar})`
                    }} />
                    <span className="text-xs text-secondary">{draggedTodo.assignee.name}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                {draggedTodo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-[var(--overlay-hover)] text-xs text-secondary rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Jira;
