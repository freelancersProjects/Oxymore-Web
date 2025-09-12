import { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc
} from 'lucide-react';
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
  kanbanId: string;
}

interface GanttChartProps {
  todos: Todo[];
  onUpdateTodo: (todo: Todo) => void;
}

const GanttChart = ({ todos, onUpdateTodo }: GanttChartProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [sortBy, setSortBy] = useState<'title' | 'assignee' | 'dueDate' | 'priority'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [draggedTask, setDraggedTask] = useState<Todo | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineWidth, setTimelineWidth] = useState(0);

  // Calculer la largeur de la timeline
  useEffect(() => {
    const updateWidth = () => {
      if (timelineRef.current) {
        setTimelineWidth(timelineRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Filtrer et trier les tâches
  const filteredTodos = todos
    .filter(todo => {
      if (filterStatus === 'all') return true;
      return todo.status === filterStatus;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'assignee':
          const aAssignee = a.assignee?.name || '';
          const bAssignee = b.assignee?.name || '';
          comparison = aAssignee.localeCompare(bAssignee);
          break;
        case 'dueDate':
          const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          comparison = aDate - bDate;
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Calculer les dates pour la timeline
  const getTimelineDates = () => {
    const dates = [];
    const start = new Date(currentDate);

    if (viewMode === 'month') {
      start.setDate(1);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }
    } else if (viewMode === 'week') {
      const dayOfWeek = start.getDay();
      start.setDate(start.getDate() - dayOfWeek);

      for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        dates.push(date);
      }
    } else {
      dates.push(new Date(start));
    }

    return dates;
  };

  // Calculer la position d'une tâche sur la timeline
  const getTaskPosition = (todo: Todo) => {
    const dates = getTimelineDates();
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];

    const taskStart = todo.dueDate ? new Date(todo.dueDate) : new Date(todo.createdAt);
    const taskEnd = todo.dueDate ? new Date(todo.dueDate) : new Date(todo.createdAt);

    // Ajouter une durée par défaut si pas de date d'échéance
    if (!todo.dueDate) {
      taskEnd.setDate(taskEnd.getDate() + 3); // 3 jours par défaut
    }

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const taskStartDays = Math.max(0, Math.ceil((taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const taskDuration = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24));

    const left = (taskStartDays / totalDays) * 100;
    const width = Math.max(5, (taskDuration / totalDays) * 100);

    return { left: `${left}%`, width: `${width}%` };
  };

  // Gérer le drag des tâches
  const handleMouseDown = (e: React.MouseEvent, todo: Todo) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedTask(todo);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggedTask || !dragStart) return;

    const deltaX = e.clientX - dragStart.x;
    const dates = getTimelineDates();
    const startDate = dates[0];
    const totalDays = Math.ceil((dates[dates.length - 1].getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const deltaDays = Math.round((deltaX / timelineWidth) * totalDays);
    const newDate = new Date(draggedTask.dueDate || draggedTask.createdAt);
    newDate.setDate(newDate.getDate() + deltaDays);

    const newTodo = {
      ...draggedTask,
      dueDate: newDate.toISOString().split('T')[0]
    };

    onUpdateTodo(newTodo);
  };

  const handleMouseUp = () => {
    setDraggedTask(null);
    setDragStart(null);
  };

  // Event listeners pour le drag
  useEffect(() => {
    if (draggedTask) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedTask, dragStart, timelineWidth]);

  // Gérer le resize des tâches
  const handleResizeStart = (e: React.MouseEvent, todo: Todo) => {
    e.stopPropagation();
    setDraggedTask(todo);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const getPriorityColor = (priority: Todo['priority']) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      urgent: 'bg-red-500'
    };
    return colors[priority];
  };

  const getStatusColor = (status: Todo['status']) => {
    const colors = {
      todo: 'bg-gray-500',
      in_progress: 'bg-blue-500',
      done: 'bg-green-500'
    };
    return colors[status];
  };

  const dates = getTimelineDates();

  return (
    <div className="h-full flex flex-col">
      {/* Header avec contrôles */}
      <div className="card-base p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary">Diagramme de Gantt</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getTime() - (viewMode === 'month' ? 30 : viewMode === 'week' ? 7 : 1) * 24 * 60 * 60 * 1000))}
              className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-secondary" />
            </button>
            <span className="text-lg font-semibold text-primary min-w-[160px] text-center">
              {currentDate.toLocaleDateString('fr-FR', {
                month: 'long',
                year: 'numeric',
                ...(viewMode === 'week' && { day: 'numeric' })
              })}
            </span>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getTime() + (viewMode === 'month' ? 30 : viewMode === 'week' ? 7 : 1) * 24 * 60 * 60 * 1000))}
              className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-secondary" />
            </button>
          </div>
        </div>

        {/* Contrôles */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-secondary">Vue:</label>
            <div className="flex bg-[var(--overlay-hover)] rounded-lg p-1">
              {(['month', 'week', 'day'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    viewMode === mode
                      ? 'bg-oxymore-purple text-white'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  {mode === 'month' ? 'Mois' : mode === 'week' ? 'Semaine' : 'Jour'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-secondary">Trier par:</label>
            <Dropdown
              options={[
                { value: 'dueDate', label: 'Date d\'échéance' },
                { value: 'title', label: 'Titre' },
                { value: 'assignee', label: 'Assigné' },
                { value: 'priority', label: 'Priorité' }
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value as any)}
              placeholder="Trier par"
            />
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4 text-secondary" /> : <SortDesc className="w-4 h-4 text-secondary" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-secondary">Statut:</label>
            <Dropdown
              options={[
                { value: 'all', label: 'Tous' },
                { value: 'todo', label: 'À faire' },
                { value: 'in_progress', label: 'En cours' },
                { value: 'done', label: 'Terminé' }
              ]}
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
              placeholder="Filtrer par statut"
            />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-auto">
        <div className="flex bg-[var(--background-primary)] rounded-xl border border-[var(--border-primary)] overflow-hidden">
          {/* Liste des tâches */}
          <div className="w-80 border-r border-[var(--border-primary)] bg-[var(--background-secondary)]">
            <div className="p-4 border-b border-[var(--border-primary)] bg-[var(--background-primary)]">
              <h3 className="font-semibold text-primary">Tâches ({filteredTodos.length})</h3>
            </div>
            <div className="space-y-2 p-4">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="card-base p-4 hover:border-oxymore-purple/50 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1 ${getPriorityColor(todo.priority)}`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-primary text-sm truncate group-hover:text-oxymore-purple transition-colors">{todo.title}</h4>
                      {todo.assignee && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-6 h-6 rounded-full bg-oxymore-purple/20 flex items-center justify-center">
                            <User className="w-3 h-3 text-oxymore-purple" />
                          </div>
                          <span className="text-xs text-secondary">{todo.assignee.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(todo.status)} text-white`}>
                          {todo.status === 'todo' ? 'À faire' : todo.status === 'in_progress' ? 'En cours' : 'Terminé'}
                        </span>
                        {todo.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-secondary">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(todo.dueDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="flex-1 relative" ref={timelineRef}>
            {/* Header de la timeline */}
            <div className="sticky top-0 z-10 bg-[var(--background-primary)] border-b border-[var(--border-primary)]">
              <div className="flex">
                {dates.map((date, index) => (
                  <div
                    key={index}
                    className="flex-1 p-3 text-center border-r border-[var(--border-primary)] last:border-r-0 hover:bg-[var(--overlay-hover)] transition-colors"
                  >
                    <div className="text-sm font-semibold text-primary">
                      {date.toLocaleDateString('fr-FR', { day: 'numeric' })}
                    </div>
                    <div className="text-xs text-secondary font-medium">
                      {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lignes de la timeline */}
            <div className="relative">
              {filteredTodos.map((todo) => {
                const position = getTaskPosition(todo);
                return (
                  <div
                    key={todo.id}
                    className="relative h-20 border-b border-[var(--border-primary)] hover:bg-[var(--overlay-hover)]/20 transition-colors group"
                    style={{ zIndex: draggedTask?.id === todo.id ? 20 : 10 }}
                  >
                    {/* Ligne de la tâche */}
                    <div
                      className="absolute top-3 h-14 rounded-xl cursor-move group/task shadow-lg hover:shadow-xl transition-all duration-200"
                      style={{
                        left: position.left,
                        width: position.width,
                        zIndex: draggedTask?.id === todo.id ? 25 : 15
                      }}
                      onMouseDown={(e) => handleMouseDown(e, todo)}
                    >
                      <div className={`h-full rounded-lg ${getPriorityColor(todo.priority)} opacity-85 hover:opacity-100 transition-all duration-200 flex items-center px-3`}>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium truncate">{todo.title}</div>
                          {todo.assignee && (
                            <div className="text-white/80 text-xs truncate mt-1">
                              {todo.assignee.name}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Handles de resize */}
                      <div
                        className="absolute left-0 top-0 w-2 h-full cursor-ew-resize opacity-0 group-hover/task:opacity-100 transition-opacity bg-white/30 rounded-l-lg"
                        onMouseDown={(e) => handleResizeStart(e, todo)}
                      />
                      <div
                        className="absolute right-0 top-0 w-2 h-full cursor-ew-resize opacity-0 group-hover/task:opacity-100 transition-opacity bg-white/30 rounded-r-lg"
                        onMouseDown={(e) => handleResizeStart(e, todo)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GanttChart;
