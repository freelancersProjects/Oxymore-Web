import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit,
  BarChart3,
  FolderPlus,
  BarChart,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import React from 'react';
import TodoModal from '../../components/TodoModal/TodoModal';
import Dropdown from '../../components/Dropdown/Dropdown';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import Loader from '../../components/Loader/Loader';
import GanttChart from '../../components/GanttChart/GanttChart';
import { kanbanApi, KanbanBoard} from '../../services/kanbanApi';
import { apiService } from '../../api/apiService';
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
  kanbanId: string; // Association avec un Kanban spécifique
}

// Types pour les colonnes
interface Column {
  id: string;
  title: string;
  status: Todo['status'];
  color: string;
  count: number;
}

// Utilise les types de l'API
type Kanban = KanbanBoard;


const Jira = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const kanbanId = searchParams.get('kanbanId');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [kanbans, setKanbans] = useState<Kanban[]>([]);
  const [currentKanbanId, setCurrentKanbanId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateKanbanModal, setShowCreateKanbanModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteKanbanModal, setShowDeleteKanbanModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [kanbanToDelete, setKanbanToDelete] = useState<Kanban | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0
  });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'gantt'>('kanban');

  // Colonnes du kanban
  const columns: Column[] = [
    { id: 'todo', title: 'À faire', status: 'todo', color: 'bg-gray-500', count: 0 },
    { id: 'in_progress', title: 'En cours', status: 'in_progress', color: 'bg-blue-500', count: 0 },
    { id: 'done', title: 'Terminé', status: 'done', color: 'bg-green-500', count: 0 }
  ];


  // Fonction pour charger les todos d'un Kanban
  const loadTodos = async (kanbanId: string) => {
    try {
      const tickets = await kanbanApi.getTicketsByBoard(kanbanId);

      // Convertir les tickets en todos
      const convertedTodos: Todo[] = tickets.map(ticket => ({
        id: ticket.id_kanban_ticket,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        assignee: ticket.assignee ? {
          id: ticket.assignee.id_user,
          name: ticket.assignee.username,
          avatar: ticket.assignee.avatar_url
        } : undefined,
        tags: ticket.tags?.map(tag => tag.name) || [],
        dueDate: ticket.due_date,
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at,
        kanbanId: ticket.id_kanban_board
      }));

      setTodos(convertedTodos);
    } catch (error) {
      console.error('Erreur lors du chargement des todos:', error);
    }
  };

  // Fonction pour récupérer le rôle d'un user
  const fetchUserRole = async (userId: string): Promise<any | null> => {
    try {
      const role = await apiService.get(`/roles/${userId}`);
      return role;
    } catch (error) {
      console.error(`Error fetching role for user ${userId}:`, error);
      return null;
    }
  };


  // Charger les Kanbans et les users depuis l'API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [kanbansData, usersData] = await Promise.all([
          kanbanApi.getBoards(),
          apiService.get('/users') // Récupérer tous les users
        ]);

        setKanbans(kanbansData);

        // Récupérer les rôles de tous les users
        const rolesPromises = (usersData as any[]).map((user: any) => fetchUserRole(user.id_user));
        const rolesResults = await Promise.allSettled(rolesPromises);

        const newUserRoles: Record<string, any> = {};
        rolesResults.forEach((result: any, index: number) => {
          if (result.status === 'fulfilled' && result.value) {
            newUserRoles[(usersData as any[])[index].id_user] = result.value;
          }
        });

        // Filtrer et stocker seulement les admins
        const adminUsers = (usersData as any[]).filter((user: any) => {
          const userRole = newUserRoles[user.id_user];
          return userRole?.name === 'admin';
        });
        setAllUsers(adminUsers);

        // Utiliser l'ID de l'URL ou sélectionner le Kanban par défaut
        let selectedKanbanId = kanbanId;
        if (!selectedKanbanId) {
          const defaultKanban = kanbansData.find(k => k.is_default) || kanbansData[0];
          selectedKanbanId = defaultKanban?.id_kanban_board;
        }

        if (selectedKanbanId) {
          setCurrentKanbanId(selectedKanbanId);
          await loadTodos(selectedKanbanId);

          // Mettre à jour l'URL si nécessaire
          if (!kanbanId) {
            setSearchParams({ kanbanId: selectedKanbanId }, { replace: true });
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [kanbanId, navigate]);


  // Calculer les statistiques pour le Kanban actuel
  useEffect(() => {
    const currentKanbanTodos = todos.filter(todo => todo.kanbanId === currentKanbanId);
    const now = new Date();
    const overdue = currentKanbanTodos.filter(todo =>
      todo.dueDate && new Date(todo.dueDate) < now && todo.status !== 'done'
    ).length;

    setStats({
      total: currentKanbanTodos.length,
      completed: currentKanbanTodos.filter(t => t.status === 'done').length,
      inProgress: currentKanbanTodos.filter(t => t.status === 'in_progress').length,
      overdue
    });
  }, [todos, currentKanbanId]);

  // Filtrer les todos du Kanban actuel
  const filteredTodos = todos.filter(todo => {
    const matchesKanban = todo.kanbanId === currentKanbanId;
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         todo.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
    return matchesKanban && matchesSearch && matchesPriority;
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

  const handleDragEnd = async (result: DropResult) => {
    setDraggedTodo(null);

    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Si on déplace dans la même colonne, ne rien faire
    if (source.droppableId === destination.droppableId) return;

    try {
      // Mettre à jour le statut via l'API
      await kanbanApi.updateTicket(draggableId, {
        status: destination.droppableId as Todo['status']
      });

      // Mettre à jour localement
      setTodos(prev => prev.map(todo =>
        todo.id === draggableId
          ? { ...todo, status: destination.droppableId as Todo['status'], updatedAt: new Date().toISOString() }
          : todo
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  // Fonction pour créer ou récupérer un tag
  const createOrGetTag = async (tagName: string): Promise<string | null> => {
    try {
      // D'abord, essayer de récupérer le tag existant
      const existingTags = await kanbanApi.getTags();
      const existingTag = existingTags.find(tag => tag.name === tagName);

      if (existingTag) {
        return existingTag.id_kanban_tag;
      }

      // Si le tag n'existe pas, le créer
      const newTag = await kanbanApi.createTag({
        name: tagName,
        color: '#3B82F6', // Couleur par défaut
        description: `Tag créé automatiquement: ${tagName}`
      });

      return newTag.id_kanban_tag;
    } catch (error) {
      console.error('Erreur lors de la création/récupération du tag:', error);
      return null;
    }
  };

  // Gestion de la création/modification des tâches
  const handleSaveTodo = async (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'kanbanId'>) => {
    try {
      // Créer ou récupérer les tags
      const tagIds: string[] = [];
      for (const tagName of todoData.tags) {
        const tagId = await createOrGetTag(tagName);
        if (tagId) {
          tagIds.push(tagId);
        }
      }

      if (editingTodo) {
        // Modification
        const updatedTicket = await kanbanApi.updateTicket(editingTodo.id, {
          title: todoData.title,
          description: todoData.description,
          status: todoData.status,
          priority: todoData.priority,
          due_date: todoData.dueDate,
          assignee_id: todoData.assignee?.id,
          tag_ids: tagIds
        });

        // Convertir et mettre à jour
        const convertedTodo: Todo = {
          id: updatedTicket.id_kanban_ticket,
          title: updatedTicket.title,
          description: updatedTicket.description,
          status: updatedTicket.status,
          priority: updatedTicket.priority,
          assignee: updatedTicket.assignee ? {
            id: updatedTicket.assignee.id_user,
            name: updatedTicket.assignee.username,
            avatar: updatedTicket.assignee.avatar_url
          } : undefined,
          tags: updatedTicket.tags?.map(tag => tag.name) || [],
          dueDate: updatedTicket.due_date,
          createdAt: updatedTicket.created_at,
          updatedAt: updatedTicket.updated_at,
          kanbanId: updatedTicket.id_kanban_board
        };

        setTodos(prev => prev.map(todo =>
          todo.id === editingTodo.id ? convertedTodo : todo
        ));
      } else {
        // Création
        const newTicket = await kanbanApi.createTicket({
          id_kanban_board: currentKanbanId,
          title: todoData.title,
          description: todoData.description,
          status: todoData.status,
          priority: todoData.priority,
          due_date: todoData.dueDate,
          assignee_id: todoData.assignee?.id,
          tag_ids: tagIds
        });

        // Convertir et ajouter
        const convertedTodo: Todo = {
          id: newTicket.id_kanban_ticket,
          title: newTicket.title,
          description: newTicket.description,
          status: newTicket.status,
          priority: newTicket.priority,
          assignee: newTicket.assignee ? {
            id: newTicket.assignee.id_user,
            name: newTicket.assignee.username,
            avatar: newTicket.assignee.avatar_url
          } : undefined,
          tags: newTicket.tags?.map(tag => tag.name) || [],
          dueDate: newTicket.due_date,
          createdAt: newTicket.created_at,
          updatedAt: newTicket.updated_at,
          kanbanId: newTicket.id_kanban_board
        };

        setTodos(prev => [...prev, convertedTodo]);
      }
      setEditingTodo(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du ticket:', error);
    }
  };

  // Gestion des Kanban
  const handleCreateKanban = async (kanbanData: { name: string; description?: string; color?: string }) => {
    try {
      const newKanban = await kanbanApi.createBoard(kanbanData);
      setKanbans(prev => [...prev, newKanban]);
      setCurrentKanbanId(newKanban.id_kanban_board);
      setShowCreateKanbanModal(false);
    } catch (error) {
      console.error('Erreur lors de la création du Kanban:', error);
    }
  };

  const handleDeleteKanban = (kanban: Kanban) => {
    setKanbanToDelete(kanban);
    setShowDeleteKanbanModal(true);
  };

  const confirmDeleteKanban = async () => {
    if (kanbanToDelete) {
      try {
        await kanbanApi.deleteBoard(kanbanToDelete.id_kanban_board);

        // Supprimer le Kanban
        setKanbans(prev => prev.filter(k => k.id_kanban_board !== kanbanToDelete.id_kanban_board));

        // Supprimer tous les todos associés
        setTodos(prev => prev.filter(todo => todo.kanbanId !== kanbanToDelete.id_kanban_board));

        // Si c'était le Kanban actuel, passer au premier disponible
        if (currentKanbanId === kanbanToDelete.id_kanban_board) {
          const remainingKanbans = kanbans.filter(k => k.id_kanban_board !== kanbanToDelete.id_kanban_board);
          if (remainingKanbans.length > 0) {
            setCurrentKanbanId(remainingKanbans[0].id_kanban_board);
          } else {
            setCurrentKanbanId('');
          }
        }

        setShowDeleteKanbanModal(false);
        setKanbanToDelete(null);
      } catch (error) {
        console.error('Erreur lors de la suppression du Kanban:', error);
      }
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowCreateModal(true);
  };


  const handleDeleteTodo = (todo: Todo) => {
    setTodoToDelete(todo);
    setShowDeleteModal(true);
  };

  const confirmDeleteTodo = async () => {
    if (todoToDelete) {
      try {
        await kanbanApi.deleteTicket(todoToDelete.id);
        setTodos(prev => prev.filter(todo => todo.id !== todoToDelete.id));
        setShowDeleteModal(false);
        setTodoToDelete(null);
      } catch (error) {
        console.error('Erreur lors de la suppression du ticket:', error);
      }
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


  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Jira</h1>
          <p className="text-secondary mt-1">Gestion des tâches et projets</p>
        </div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Jira</h1>
          <p className="text-secondary mt-1">Gestion des tâches et projets</p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateKanbanModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FolderPlus className="w-4 h-4" />
            Nouveau Kanban
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingTodo(null);
              setShowCreateModal(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Nouvelle tâche
          </motion.button>
        </div>
      </div>

      {/* Switch Vue Kanban/Gantt */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex bg-[var(--overlay-hover)] rounded-lg p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                viewMode === 'kanban'
                  ? 'bg-oxymore-purple text-white'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Vue Kanban
            </button>
            <button
              onClick={() => setViewMode('gantt')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                viewMode === 'gantt'
                  ? 'bg-oxymore-purple text-white'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <BarChart className="w-4 h-4" />
              Diagramme de Gantt
            </button>
          </div>
        </div>
      </div>

      {/* Onglets Kanban */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {kanbans.map((kanban) => (
          <motion.button
            key={kanban.id_kanban_board}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setCurrentKanbanId(kanban.id_kanban_board);
              setSearchParams({ kanbanId: kanban.id_kanban_board });
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              currentKanbanId === kanban.id_kanban_board
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 text-primary shadow-lg'
                : 'bg-[var(--overlay-hover)] hover:bg-[var(--overlay-hover)]/80 text-secondary hover:text-primary'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${kanban.color}`} />
            <span className="text-sm font-semibold">{kanban.name}</span>
            <span className="text-xs opacity-70">
              ({todos.filter(t => t.kanbanId === kanban.id_kanban_board).length})
            </span>
            {currentKanbanId === kanban.id_kanban_board && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteKanban(kanban);
                }}
                className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors ml-1"
                title="Supprimer ce Kanban"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </motion.button>
        ))}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateKanbanModal(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 text-green-400 hover:text-green-300 transition-all duration-200 whitespace-nowrap"
        >
          <FolderPlus className="w-4 h-4" />
          <span className="text-sm font-semibold">Nouveau</span>
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

      {/* Contenu principal selon le mode */}
      {currentKanbanId ? (
        viewMode === 'kanban' ? (
          <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="kanban-container grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((column) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-base p-4 kanban-column"
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

              {/* @ts-expect-error */}
              <Droppable droppableId={column.id} type="TASK">
                {(provided: any, snapshot: any) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex flex-col min-h-[400px] space-y-3 transition-all duration-200 column-content ${
                      snapshot.isDraggingOver
                        ? 'bg-blue-50/50 border-2 border-dashed border-blue-300 rounded-lg'
                        : ''
                    }`}
                    style={{
                      minHeight: '100%',
                      height: 'auto'
                    }}
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
        ) : (
          <GanttChart
            todos={todos}
            onUpdateTodo={handleSaveTodo}
          />
        )
      ) : (
        <div className="card-base p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderPlus className="w-10 h-10 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-3">Commencez par créer un Kanban</h3>
          <p className="text-secondary mb-8 max-w-md mx-auto leading-relaxed">
            Organisez vos tâches en créant des Kanban pour différents projets ou équipes.
            Chaque Kanban aura ses propres colonnes et tickets.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateKanbanModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 mx-auto"
          >
            <FolderPlus className="w-5 h-5" />
            Créer votre premier Kanban
          </motion.button>
        </div>
      )}

      {/* Modal de création/édition */}
      <TodoModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingTodo(null);
        }}
        onSave={handleSaveTodo}
        editingTodo={editingTodo}
        adminUsers={allUsers}
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

      {/* Modal de suppression Kanban */}
      <ConfirmationModal
        isOpen={showDeleteKanbanModal}
        onClose={() => {
          setShowDeleteKanbanModal(false);
          setKanbanToDelete(null);
        }}
        onConfirm={confirmDeleteKanban}
        title="Supprimer le Kanban"
        message={`Êtes-vous sûr de vouloir supprimer le Kanban "${kanbanToDelete?.name}" ? Toutes les tâches associées seront également supprimées. Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />

      {/* Modal de création Kanban */}
      {showCreateKanbanModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[var(--card-background)] rounded-2xl p-6 w-full max-w-md shadow-2xl border border-[var(--border-color)]"
          >
            <h2 className="text-lg font-bold text-primary mb-4">Créer un nouveau Kanban</h2>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const name = formData.get('name') as string;
              const description = formData.get('description') as string;
              const color = formData.get('color') as string;

              if (name.trim()) {
                handleCreateKanban({
                  name: name.trim(),
                  description: description.trim() || undefined,
                  color: color || 'bg-blue-500'
                });
                setShowCreateKanbanModal(false);
              }
            }}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3">
                    Nom du Kanban *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Ex: Projet Marketing, Équipe Frontend..."
                    className="w-full text-base py-3 px-4 bg-[var(--overlay-hover)] border border-[var(--border)] rounded-lg text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-3">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Décrivez le but de ce Kanban (optionnel)"
                    rows={3}
                    className="w-full resize-none text-base py-3 px-4 bg-[var(--overlay-hover)] border border-[var(--border)] rounded-lg text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-3">
                    Couleur du Kanban
                  </label>
                  <div className="grid grid-cols-6 gap-3">
                    {[
                      { value: 'bg-blue-500', label: 'Bleu', color: 'bg-blue-500' },
                      { value: 'bg-green-500', label: 'Vert', color: 'bg-green-500' },
                      { value: 'bg-purple-500', label: 'Violet', color: 'bg-purple-500' },
                      { value: 'bg-orange-500', label: 'Orange', color: 'bg-orange-500' },
                      { value: 'bg-red-500', label: 'Rouge', color: 'bg-red-500' },
                      { value: 'bg-pink-500', label: 'Rose', color: 'bg-pink-500' }
                    ].map((option) => (
                      <label key={option.value} className="flex flex-col items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="color"
                          value={option.value}
                          defaultChecked={option.value === 'bg-blue-500'}
                          className="sr-only"
                        />
                        <div className={`w-10 h-10 rounded-full ${option.color} border-4 border-transparent group-hover:border-white/30 transition-all duration-200 shadow-lg relative`}>
                          <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          <div className="absolute inset-0 rounded-full border-2 border-white/50 opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-200" />
                          <div className="absolute inset-0 rounded-full bg-white/10 group-has-[:checked]:bg-white/20 transition-colors duration-200" />
                        </div>
                        <span className="text-xs text-secondary group-hover:text-primary group-has-[:checked]:text-primary transition-colors font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowCreateKanbanModal(false)}
                  className="flex-1 px-6 py-3 text-secondary hover:text-primary transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                >
                  Créer le Kanban
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

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
