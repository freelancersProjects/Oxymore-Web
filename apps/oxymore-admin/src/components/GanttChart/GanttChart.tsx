import { useEffect, useRef, useState } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc
} from 'lucide-react';
import Dropdown from '../Dropdown/Dropdown';
import './GanttChart.css';

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
  kanbanId: string;
  startDate?: string;
  endDate?: string;
}

interface GanttChartProps {
  todos: Todo[];
  onUpdateTodo: (todo: Todo) => void;
}

const GanttChart = ({ todos }: GanttChartProps) => {
  const ganttRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [sortBy, setSortBy] = useState<'title' | 'assignee' | 'dueDate' | 'priority'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Préparer les données pour dhtmlx-gantt
  const prepareGanttData = () => {
    // Filtrer seulement les tickets avec date d'échéance
    const todosWithDueDate = todos.filter(todo => todo.dueDate);

    const todosWithDates = todosWithDueDate.map(todo => {
      // Utiliser la date d'échéance comme date de fin
      const endDate = new Date(todo.dueDate!);
      const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 jours avant

      return {
        ...todo,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };
    });

    const filteredTodos = todosWithDates
      .filter(todo => filterStatus === 'all' || todo.status === filterStatus)
      .sort((a, b) => {
        let aValue: any, bValue: any;

        switch (sortBy) {
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'assignee':
            aValue = a.assignee?.name || '';
            bValue = b.assignee?.name || '';
            break;
          case 'dueDate':
            aValue = new Date(a.dueDate || '');
            bValue = new Date(b.dueDate || '');
            break;
          case 'priority':
            const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
            aValue = priorityOrder[a.priority];
            bValue = priorityOrder[b.priority];
            break;
          default:
            return 0;
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

    return filteredTodos.map(todo => ({
      id: todo.id,
      text: todo.title,
      start_date: todo.startDate,
      end_date: todo.endDate,
      progress: todo.status === 'done' ? 1 : todo.status === 'in_progress' ? 0.5 : 0,
      color: getStatusColor(todo.status),
      assignee: todo.assignee?.name || 'Non assigné',
      priority: todo.priority,
      status: todo.status,
      // Ajouter un parent pour éviter la superposition
      parent: 0
    }));
  };

  const getStatusColor = (status: Todo['status']) => {
    const colors = {
      todo: '#6b7280',
      in_progress: '#3b82f6',
      done: '#10b981'
    };
    return colors[status];
  };

  // Initialiser le Gantt
  useEffect(() => {
    if (!ganttRef.current) return;

    // Configuration du Gantt
    gantt.config.date_format = '%Y-%m-%d';
    gantt.config.scale_height = 50;
    gantt.config.row_height = 40;
    gantt.config.grid_width = 300;
    gantt.config.readonly = false;
    gantt.config.drag_links = false;
    gantt.config.drag_progress = false;
    gantt.config.drag_resize = true;
    gantt.config.drag_move = true;
    gantt.config.multiselect = false;
    gantt.config.select_task = true;
    gantt.config.show_links = false;
    gantt.config.show_progress = true;
    gantt.config.auto_scheduling = false;

    // Configuration de la timeline
    if (viewMode === 'month') {
      gantt.config.scale_unit = 'day';
      gantt.config.date_scale = '%d';
      gantt.config.subscales = [
        { unit: 'week', step: 1, date: '%W' }
      ];
    } else if (viewMode === 'week') {
      gantt.config.scale_unit = 'day';
      gantt.config.date_scale = '%d %M';
      gantt.config.subscales = [
        { unit: 'hour', step: 6, date: '%H:%i' }
      ];
    } else {
      gantt.config.scale_unit = 'hour';
      gantt.config.date_scale = '%H:%i';
      gantt.config.subscales = [
        { unit: 'minute', step: 30, date: '%i' }
      ];
    }

    // Configuration des colonnes
    gantt.config.columns = [
      { name: 'text', label: 'Tâche', width: 200 },
      { name: 'assignee', label: 'Assigné à', width: 100 },
      { name: 'priority', label: 'Priorité', width: 80 },
      { name: 'status', label: 'Statut', width: 80 }
    ];

    // Configuration des templates
    gantt.templates.task_class = (_start: any, _end: any, task: any) => {
      return `task-${task.status} task-${task.priority}`;
    };

    gantt.templates.task_text = (_start: any, _end: any, task: any) => {
      return `<div class="task-content">
        <div class="task-title">${task.text}</div>
        <div class="task-meta">${task.assignee}</div>
      </div>`;
    };

    // Initialiser le Gantt
    gantt.init(ganttRef.current);

    // Charger les données
    const data = prepareGanttData();
    gantt.parse({ data });

    // Définir la date de début de la vue
    const startDate = new Date(currentDate);
    if (viewMode === 'month') {
      startDate.setDate(1);
    } else if (viewMode === 'week') {
      const dayOfWeek = startDate.getDay();
      startDate.setDate(startDate.getDate() - dayOfWeek + 1);
    }

    // Utiliser la méthode correcte pour définir la vue
    try {
      gantt.setCurrentView(startDate);
    } catch (error) {
      console.log('setCurrentView not available, using alternative method');
      gantt.showDate(startDate);
    }

    return () => {
      gantt.clearAll();
    };
  }, [todos, currentDate, viewMode, sortBy, sortOrder, filterStatus]);

  return (
    <div className="gantt-container">
      {/* Header stylé */}
      <div className="gantt-header">
        <div className="flex items-center gap-4">
          <Calendar className="w-6 h-6" />
          <h2 className="text-xl font-bold">Diagramme de Gantt</h2>
          <span className="text-sm opacity-80">
            {todos.filter(todo => todo.dueDate).length} tâche{todos.filter(todo => todo.dueDate).length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="gantt-controls">
          {/* Navigation temporelle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getTime() - (viewMode === 'month' ? 30 : viewMode === 'week' ? 7 : 1) * 24 * 60 * 60 * 1000))}
              className="gantt-sort-button"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {currentDate.toLocaleDateString('fr-FR', {
                month: 'long',
                year: 'numeric',
                ...(viewMode === 'week' && { day: 'numeric' })
              })}
            </span>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getTime() + (viewMode === 'month' ? 30 : viewMode === 'week' ? 7 : 1) * 24 * 60 * 60 * 1000))}
              className="gantt-sort-button"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle vue */}
          <div className="gantt-view-toggle">
            <button
              onClick={() => setViewMode('month')}
              className={`gantt-view-button ${viewMode === 'month' ? 'active' : ''}`}
            >
              Mois
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`gantt-view-button ${viewMode === 'week' ? 'active' : ''}`}
            >
              Semaine
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`gantt-view-button ${viewMode === 'day' ? 'active' : ''}`}
            >
              Jour
            </button>
          </div>

          {/* Contrôles de tri */}
          <div className="gantt-sort-controls">
            <Dropdown
              options={[
                { value: 'title', label: 'Titre' },
                { value: 'assignee', label: 'Assigné à' },
                { value: 'dueDate', label: 'Date d\'échéance' },
                { value: 'priority', label: 'Priorité' }
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value as any)}
              placeholder="Trier par"
              className="w-40"
            />

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="gantt-sort-button"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </button>
          </div>

          {/* Filtre statut */}
          <Dropdown
            options={[
              { value: 'all', label: 'Tous les statuts' },
              { value: 'todo', label: 'À faire' },
              { value: 'in_progress', label: 'En cours' },
              { value: 'done', label: 'Terminé' }
            ]}
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            placeholder="Filtrer par statut"
            className="w-40"
          />
        </div>
      </div>

      {/* Conteneur du Gantt */}
      <div className="gantt-content">
        <div ref={ganttRef} className="gantt-chart" />
      </div>
    </div>
  );
};

export default GanttChart;
