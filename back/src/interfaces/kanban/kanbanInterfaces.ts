import { RowDataPacket } from 'mysql2';

export interface KanbanBoard extends RowDataPacket {
  id_kanban_board: string;
  name: string;
  description?: string;
  color: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface KanbanTicket extends RowDataPacket {
  id_kanban_ticket: string;
  id_kanban_board: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  assignee_id?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  assignee?: {
    id_user: string;
    username: string;
    avatar_url?: string;
  };
  tags?: KanbanTag[];
}

export interface KanbanTag extends RowDataPacket {
  id_kanban_tag: string;
  name: string;
  color: string;
  description?: string;
  created_at: string;
  created_by?: string;
}

export interface CreateKanbanBoardRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateKanbanBoardRequest {
  name?: string;
  description?: string;
  color?: string;
}

export interface CreateKanbanTicketRequest {
  id_kanban_board: string;
  title: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  assignee_id?: string;
  tag_ids?: string[];
}

export interface UpdateKanbanTicketRequest {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  assignee_id?: string;
  tag_ids?: string[];
}

export interface CreateKanbanTagRequest {
  name: string;
  color?: string;
  description?: string;
}

export interface KanbanStats {
  total_tickets: number;
  todo_tickets: number;
  in_progress_tickets: number;
  done_tickets: number;
  overdue_tickets: number;
  high_priority_tickets: number;
  urgent_tickets: number;
}

export interface KanbanBoardStats extends RowDataPacket, KanbanStats {
  id_kanban_board: string;
  name: string;
  color: string;
}
