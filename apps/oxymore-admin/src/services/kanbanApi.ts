const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Types
export interface KanbanBoard {
  id_kanban_board: string;
  name: string;
  description?: string;
  color: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface KanbanTicket {
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

export interface KanbanTag {
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

// API Functions
export const kanbanApi = {
  // Kanban Boards
  async getBoards(): Promise<KanbanBoard[]> {
    const response = await fetch(`${API_BASE_URL}/kanban/boards`);
    if (!response.ok) throw new Error('Failed to fetch boards');
    return response.json();
  },

  async getBoardById(id: string): Promise<KanbanBoard> {
    const response = await fetch(`${API_BASE_URL}/kanban/boards/${id}`);
    if (!response.ok) throw new Error('Failed to fetch board');
    return response.json();
  },

  async createBoard(data: CreateKanbanBoardRequest): Promise<KanbanBoard> {
    const response = await fetch(`${API_BASE_URL}/kanban/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create board');
    return response.json();
  },

  async updateBoard(id: string, data: Partial<CreateKanbanBoardRequest>): Promise<KanbanBoard> {
    const response = await fetch(`${API_BASE_URL}/kanban/boards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update board');
    return response.json();
  },

  async deleteBoard(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/kanban/boards/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete board');
  },

  // Kanban Tickets
  async getTicketsByBoard(boardId: string): Promise<KanbanTicket[]> {
    const response = await fetch(`${API_BASE_URL}/kanban/boards/${boardId}/tickets`);
    if (!response.ok) throw new Error('Failed to fetch tickets');
    return response.json();
  },

  async getTicketById(id: string): Promise<KanbanTicket> {
    const response = await fetch(`${API_BASE_URL}/kanban/tickets/${id}`);
    if (!response.ok) throw new Error('Failed to fetch ticket');
    return response.json();
  },

  async createTicket(data: CreateKanbanTicketRequest): Promise<KanbanTicket> {
    const response = await fetch(`${API_BASE_URL}/kanban/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create ticket');
    return response.json();
  },

  async updateTicket(id: string, data: UpdateKanbanTicketRequest): Promise<KanbanTicket> {
    const response = await fetch(`${API_BASE_URL}/kanban/tickets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update ticket');
    return response.json();
  },

  async deleteTicket(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/kanban/tickets/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete ticket');
  },

  // Kanban Tags
  async getTags(): Promise<KanbanTag[]> {
    const response = await fetch(`${API_BASE_URL}/kanban/tags`);
    if (!response.ok) throw new Error('Failed to fetch tags');
    return response.json();
  },

  async createTag(data: { name: string; color?: string; description?: string }): Promise<KanbanTag> {
    const response = await fetch(`${API_BASE_URL}/kanban/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create tag');
    return response.json();
  },

  async getAdminUsers(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/kanban/users/admins`);
    if (!response.ok) throw new Error('Failed to fetch admin users');
    return response.json();
  }
};
