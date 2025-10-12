import { db } from '../../config/db';
import crypto from 'crypto';
import {
  KanbanBoard,
  KanbanTicket,
  KanbanTag,
  CreateKanbanBoardRequest,
  UpdateKanbanBoardRequest,
  CreateKanbanTicketRequest,
  UpdateKanbanTicketRequest,
  CreateKanbanTagRequest,
  KanbanStats,
  KanbanBoardStats
} from '../../interfaces/kanban/kanbanInterfaces';

export const getAllKanbanBoards = async (): Promise<KanbanBoard[]> => {
  const [rows] = await db.execute<KanbanBoard[]>(
    `SELECT * FROM kanban_boards ORDER BY is_default DESC, created_at ASC`
  );
  return rows;
};

export const getKanbanBoardById = async (id: string): Promise<KanbanBoard | null> => {
  const [rows] = await db.execute<KanbanBoard[]>(
    `SELECT * FROM kanban_boards WHERE id_kanban_board = ?`,
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const createKanbanBoard = async (data: CreateKanbanBoardRequest, createdBy: string | null): Promise<KanbanBoard> => {
  const id = crypto.randomUUID();
  await db.execute(
    `INSERT INTO kanban_boards (id_kanban_board, name, description, color, created_by)
     VALUES (?, ?, ?, ?, ?)`,
    [id, data.name, data.description || null, data.color || 'bg-blue-500', createdBy]
  );

  const board = await getKanbanBoardById(id);
  if (!board) throw new Error('Erreur lors de la création du Kanban');
  return board;
};

export const updateKanbanBoard = async (id: string, data: UpdateKanbanBoardRequest): Promise<KanbanBoard> => {
  const updates = [];
  const values = [];

  if (data.name !== undefined) {
    updates.push('name = ?');
    values.push(data.name);
  }
  if (data.description !== undefined) {
    updates.push('description = ?');
    values.push(data.description);
  }
  if (data.color !== undefined) {
    updates.push('color = ?');
    values.push(data.color);
  }

  if (updates.length === 0) {
    throw new Error('Aucune donnée à mettre à jour');
  }

  values.push(id);
  await db.execute(
    `UPDATE kanban_boards SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id_kanban_board = ?`,
    values
  );

  const board = await getKanbanBoardById(id);
  if (!board) throw new Error('Kanban non trouvé');
  return board;
};

export const deleteKanbanBoard = async (id: string): Promise<void> => {
  await db.execute(
    `DELETE FROM kanban_boards WHERE id_kanban_board = ?`,
    [id]
  );
};

// ===== KANBAN TICKETS =====

export const getTicketsByBoard = async (boardId: string): Promise<KanbanTicket[]> => {
  const [rows] = await db.execute<any[]>(
    `SELECT
      kt.*,
      u.username as assignee_username,
      u.avatar_url as assignee_avatar_url,
      creator.username as creator_username,
      creator.avatar_url as creator_avatar_url
     FROM kanban_tickets kt
     LEFT JOIN user u ON kt.assignee_id = u.id_user
     LEFT JOIN user creator ON kt.created_by = creator.id_user
     WHERE kt.id_kanban_board = ?
     ORDER BY kt.created_at DESC`,
    [boardId]
  );

  const tickets = rows;

  // Récupérer les tags pour chaque ticket
  for (const ticket of tickets) {
    const [tagRows] = await db.execute(
      `SELECT kt.* FROM kanban_tags kt
       JOIN kanban_ticket_tags ktt ON kt.id_kanban_tag = ktt.id_kanban_tag
       WHERE ktt.id_kanban_ticket = ?`,
      [ticket.id_kanban_ticket]
    );

    ticket.tags = tagRows as KanbanTag[];

    if (ticket.assignee_id) {
      ticket.assignee = {
        id_user: ticket.assignee_id,
        username: ticket.assignee_username,
        avatar_url: ticket.assignee_avatar_url
      };
    }

    if (ticket.created_by) {
      ticket.creator = {
        id_user: ticket.created_by,
        username: ticket.creator_username,
        avatar_url: ticket.creator_avatar_url
      };
    }
  }

  return tickets as KanbanTicket[];
};

export const getTicketById = async (id: string): Promise<KanbanTicket | null> => {
  const [rows] = await db.execute<any[]>(
    `SELECT
      kt.*,
      u.username as assignee_username,
      u.avatar_url as assignee_avatar_url,
      creator.username as creator_username,
      creator.avatar_url as creator_avatar_url
     FROM kanban_tickets kt
     LEFT JOIN user u ON kt.assignee_id = u.id_user
     LEFT JOIN user creator ON kt.created_by = creator.id_user
     WHERE kt.id_kanban_ticket = ?`,
    [id]
  );

  if (rows.length === 0) return null;

  const ticket = rows[0];

  // Récupérer les tags
  const [tagRows] = await db.execute(
    `SELECT kt.* FROM kanban_tags kt
     JOIN kanban_ticket_tags ktt ON kt.id_kanban_tag = ktt.id_kanban_tag
     WHERE ktt.id_kanban_ticket = ?`,
    [id]
  );

  ticket.tags = tagRows as KanbanTag[];

  if (ticket.assignee_id) {
    ticket.assignee = {
      id_user: ticket.assignee_id,
      username: ticket.assignee_username,
      avatar_url: ticket.assignee_avatar_url
    };
  }

  if (ticket.created_by) {
    ticket.creator = {
      id_user: ticket.created_by,
      username: ticket.creator_username,
      avatar_url: ticket.creator_avatar_url
    };
  }

  return ticket as KanbanTicket;
};

export const createKanbanTicket = async (data: CreateKanbanTicketRequest, createdBy: string | null): Promise<KanbanTicket> => {
  const id = crypto.randomUUID();

  await db.execute(
    `INSERT INTO kanban_tickets
     (id_kanban_ticket, id_kanban_board, title, description, status, priority, due_date, assignee_id, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.id_kanban_board,
      data.title,
      data.description || null,
      data.status || 'todo',
      data.priority || 'medium',
      data.due_date || null,
      data.assignee_id || null,
      createdBy
    ]
  );

  // Associer les tags si fournis
  if (data.tag_ids && data.tag_ids.length > 0) {
    for (const tagId of data.tag_ids) {
      await db.execute(
        `INSERT INTO kanban_ticket_tags (id_kanban_ticket, id_kanban_tag) VALUES (?, ?)`,
        [id, tagId]
      );
    }
  }

  const ticket = await getTicketById(id);
  if (!ticket) throw new Error('Erreur lors de la création du ticket');
  return ticket;
};

export const updateKanbanTicket = async (id: string, data: UpdateKanbanTicketRequest): Promise<KanbanTicket> => {
  const updates = [];
  const values = [];

  if (data.title !== undefined) {
    updates.push('title = ?');
    values.push(data.title);
  }
  if (data.description !== undefined) {
    updates.push('description = ?');
    values.push(data.description);
  }
  if (data.status !== undefined) {
    updates.push('status = ?');
    values.push(data.status);
  }
  if (data.priority !== undefined) {
    updates.push('priority = ?');
    values.push(data.priority);
  }
  if (data.due_date !== undefined) {
    updates.push('due_date = ?');
    values.push(data.due_date);
  }
  if (data.assignee_id !== undefined) {
    updates.push('assignee_id = ?');
    values.push(data.assignee_id);
  }

  if (updates.length === 0) {
    throw new Error('Aucune donnée à mettre à jour');
  }

  values.push(id);
  await db.execute(
    `UPDATE kanban_tickets SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id_kanban_ticket = ?`,
    values
  );

  // Mettre à jour les tags si fournis
  if (data.tag_ids !== undefined) {
    // Supprimer les anciens tags
    await db.execute(
      `DELETE FROM kanban_ticket_tags WHERE id_kanban_ticket = ?`,
      [id]
    );

    // Ajouter les nouveaux tags
    for (const tagId of data.tag_ids) {
      await db.execute(
        `INSERT INTO kanban_ticket_tags (id_kanban_ticket, id_kanban_tag) VALUES (?, ?)`,
        [id, tagId]
      );
    }
  }

  const ticket = await getTicketById(id);
  if (!ticket) throw new Error('Ticket non trouvé');
  return ticket;
};

export const deleteKanbanTicket = async (id: string): Promise<void> => {
  await db.execute(
    `DELETE FROM kanban_tickets WHERE id_kanban_ticket = ?`,
    [id]
  );
};

// ===== KANBAN TAGS =====

export const getAllKanbanTags = async (): Promise<KanbanTag[]> => {
  const [rows] = await db.execute<KanbanTag[]>(
    `SELECT * FROM kanban_tags ORDER BY name ASC`
  );
  return rows;
};

export const createKanbanTag = async (data: CreateKanbanTagRequest, createdBy: string | null): Promise<KanbanTag> => {
  const id = crypto.randomUUID();
  await db.execute(
    `INSERT INTO kanban_tags (id_kanban_tag, name, color, description, created_by)
     VALUES (?, ?, ?, ?, ?)`,
    [id, data.name, data.color || 'bg-gray-500', data.description || null, createdBy]
  );

  const [rows] = await db.execute<KanbanTag[]>(
    `SELECT * FROM kanban_tags WHERE id_kanban_tag = ?`,
    [id]
  );
  return rows[0];
};

// ===== STATISTIQUES =====

export const getKanbanStats = async (boardId?: string): Promise<KanbanStats> => {
  const whereClause = boardId ? 'WHERE id_kanban_board = ?' : '';
  const params = boardId ? [boardId] : [];

  const [rows] = await db.execute<any[]>(
    `SELECT
      COUNT(*) as total_tickets,
      SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todo_tickets,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tickets,
      SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as done_tickets,
      SUM(CASE WHEN due_date < CURDATE() AND status != 'done' THEN 1 ELSE 0 END) as overdue_tickets,
      SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority_tickets,
      SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent_tickets
     FROM kanban_tickets ${whereClause}`,
    params
  );

  return rows[0] as KanbanStats;
};

export const getAllKanbanBoardStats = async (): Promise<KanbanBoardStats[]> => {
  const [rows] = await db.execute<KanbanBoardStats[]>(
    `SELECT
      kb.id_kanban_board,
      kb.name,
      kb.color,
      COUNT(kt.id_kanban_ticket) as total_tickets,
      SUM(CASE WHEN kt.status = 'todo' THEN 1 ELSE 0 END) as todo_tickets,
      SUM(CASE WHEN kt.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tickets,
      SUM(CASE WHEN kt.status = 'done' THEN 1 ELSE 0 END) as done_tickets,
      SUM(CASE WHEN kt.due_date < CURDATE() AND kt.status != 'done' THEN 1 ELSE 0 END) as overdue_tickets,
      SUM(CASE WHEN kt.priority = 'high' THEN 1 ELSE 0 END) as high_priority_tickets,
      SUM(CASE WHEN kt.priority = 'urgent' THEN 1 ELSE 0 END) as urgent_tickets
     FROM kanban_boards kb
     LEFT JOIN kanban_tickets kt ON kb.id_kanban_board = kt.id_kanban_board
     GROUP BY kb.id_kanban_board, kb.name, kb.color
     ORDER BY kb.is_default DESC, kb.created_at ASC`
  );

  return rows;
};

// ===== USERS =====

export const getAdminUsers = async (): Promise<any[]> => {
  const [rows] = await db.execute<any[]>(
    `SELECT id_user, username, email, avatar_url, first_name, last_name
     FROM user
     WHERE role_id = 1
     ORDER BY username ASC`
  );
  return rows;
};

