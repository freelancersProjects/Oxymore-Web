import { Request, Response } from 'express';
import * as kanbanService from '../services/kanbanService';

export const getAllKanbanBoards = async (req: Request, res: Response) => {
  try {
    const boards = await kanbanService.getAllKanbanBoards();
    res.json(boards);
  } catch (error) {
    console.error('Error in getAllKanbanBoards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getKanbanBoardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const board = await kanbanService.getKanbanBoardById(id);

    if (!board) {
      return res.status(404).json({ error: 'Kanban board not found' });
    }

    res.json(board);
  } catch (error) {
    console.error('Error in getKanbanBoardById:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createKanbanBoard = async (req: Request, res: Response) => {
  try {
    const board = await kanbanService.createKanbanBoard(req.body, null);
    res.status(201).json(board);
  } catch (error) {
    console.error('Error in createKanbanBoard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateKanbanBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await kanbanService.updateKanbanBoard(id, req.body);

    const updatedBoard = await kanbanService.getKanbanBoardById(id);
    if (!updatedBoard) {
      return res.status(404).json({ error: 'Kanban board not found' });
    }

    res.json(updatedBoard);
  } catch (error) {
    console.error('Error in updateKanbanBoard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteKanbanBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await kanbanService.deleteKanbanBoard(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteKanbanBoard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTicketsByBoard = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const tickets = await kanbanService.getTicketsByBoard(boardId);
    res.json(tickets);
  } catch (error) {
    console.error('Error in getTicketsByBoard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ticket = await kanbanService.getTicketById(id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Error in getTicketById:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createKanbanTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await kanbanService.createKanbanTicket(req.body, null);
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error in createKanbanTicket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateKanbanTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await kanbanService.updateKanbanTicket(id, req.body);

    const updatedTicket = await kanbanService.getTicketById(id);
    if (!updatedTicket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(updatedTicket);
  } catch (error) {
    console.error('Error in updateKanbanTicket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteKanbanTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await kanbanService.deleteKanbanTicket(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteKanbanTicket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllKanbanTags = async (req: Request, res: Response) => {
  try {
    const tags = await kanbanService.getAllKanbanTags();
    res.json(tags);
  } catch (error) {
    console.error('Error in getAllKanbanTags:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createKanbanTag = async (req: Request, res: Response) => {
  try {
    const tag = await kanbanService.createKanbanTag(req.body, null);
    res.status(201).json(tag);
  } catch (error) {
    console.error('Error in createKanbanTag:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getKanbanStats = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.query;
    const stats = await kanbanService.getKanbanStats(boardId as string);
    res.json(stats);
  } catch (error) {
    console.error('Error in getKanbanStats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllKanbanBoardStats = async (req: Request, res: Response) => {
  try {
    const stats = await kanbanService.getAllKanbanBoardStats();
    res.json(stats);
  } catch (error) {
    console.error('Error in getAllKanbanBoardStats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAdminUsers = async (req: Request, res: Response) => {
  try {
    const users = await kanbanService.getAdminUsers();
    res.json(users);
  } catch (error) {
    console.error('Error in getAdminUsers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
