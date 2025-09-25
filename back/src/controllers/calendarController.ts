import { Request, Response } from 'express';
import * as calendarModel from '../models/calendarModel';
import { CreateCalendarEventRequest, UpdateCalendarEventRequest, CalendarEventResponse } from '../interfaces/calendarInterfaces';

// Fonction utilitaire pour formater une date sans décalage de fuseau horaire
const formatDateForResponse = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const createCalendarEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventData: CreateCalendarEventRequest = req.body;
    const createdBy = (req as any).user?.id_user || 'system';

    if (!eventData.title || !eventData.date || !eventData.start_time || !eventData.end_time || !eventData.calendar_type) {
      res.status(400).json({
        message: "Les champs title, date, start_time, end_time et calendar_type sont obligatoires"
      });
      return;
    }

    const event = await calendarModel.createCalendarEvent(eventData, createdBy);

    const response: CalendarEventResponse = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: formatDateForResponse(event.date),
      start_time: event.start_time.substring(0, 5), // Convertir HH:MM:SS en HH:MM
      end_time: event.end_time.substring(0, 5), // Convertir HH:MM:SS en HH:MM
      location: event.location,
      calendar_type: event.calendar_type,
      attendees: event.attendees,
      color: event.color,
      is_completed: event.is_completed,
      created_by: event.created_by,
      created_at: event.created_at.toISOString(),
      updated_at: event.updated_at.toISOString()
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const getCalendarEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await calendarModel.getCalendarEventById(id);

    if (!event) {
      res.status(404).json({ message: "Événement calendrier non trouvé" });
      return;
    }

    const response: CalendarEventResponse = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: formatDateForResponse(event.date),
      start_time: event.start_time.substring(0, 5), // Convertir HH:MM:SS en HH:MM
      end_time: event.end_time.substring(0, 5), // Convertir HH:MM:SS en HH:MM
      location: event.location,
      calendar_type: event.calendar_type,
      attendees: event.attendees,
      color: event.color,
      is_completed: event.is_completed,
      created_by: event.created_by,
      created_at: event.created_at.toISOString(),
      updated_at: event.updated_at.toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting calendar event:', error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const getAllCalendarEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await calendarModel.getAllCalendarEvents();

    const response: CalendarEventResponse[] = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: formatDateForResponse(event.date),
      start_time: event.start_time.substring(0, 5), // Convertir HH:MM:SS en HH:MM
      end_time: event.end_time.substring(0, 5), // Convertir HH:MM:SS en HH:MM
      location: event.location,
      calendar_type: event.calendar_type,
      attendees: event.attendees,
      color: event.color,
      is_completed: event.is_completed,
      created_by: event.created_by,
      created_at: event.created_at.toISOString(),
      updated_at: event.updated_at.toISOString()
    }));

    res.json(response);
  } catch (error) {
    console.error('Error getting calendar events:', error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const getCalendarEventsByDateRange = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        message: "Les paramètres startDate et endDate sont obligatoires"
      });
      return;
    }

    const events = await calendarModel.getCalendarEventsByDateRange(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    const response: CalendarEventResponse[] = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: formatDateForResponse(event.date),
      start_time: event.start_time.substring(0, 5), // Convertir HH:MM:SS en HH:MM
      end_time: event.end_time.substring(0, 5), // Convertir HH:MM:SS en HH:MM
      location: event.location,
      calendar_type: event.calendar_type,
      attendees: event.attendees,
      color: event.color,
      is_completed: event.is_completed,
      created_by: event.created_by,
      created_at: event.created_at.toISOString(),
      updated_at: event.updated_at.toISOString()
    }));

    res.json(response);
  } catch (error) {
    console.error('Error getting calendar events by date range:', error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const getCalendarEventsByType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.params;
    const events = await calendarModel.getCalendarEventsByType(type);

    const response: CalendarEventResponse[] = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: formatDateForResponse(event.date),
      start_time: event.start_time.substring(0, 5), // Convertir HH:MM:SS en HH:MM
      end_time: event.end_time.substring(0, 5), // Convertir HH:MM:SS en HH:MM
      location: event.location,
      calendar_type: event.calendar_type,
      attendees: event.attendees,
      color: event.color,
      is_completed: event.is_completed,
      created_by: event.created_by,
      created_at: event.created_at.toISOString(),
      updated_at: event.updated_at.toISOString()
    }));

    res.json(response);
  } catch (error) {
    console.error('Error getting calendar events by type:', error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const updateCalendarEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const eventData: UpdateCalendarEventRequest = req.body;

    const event = await calendarModel.updateCalendarEvent(id, eventData);

    if (!event) {
      res.status(404).json({ message: "Événement calendrier non trouvé" });
      return;
    }

    const response: CalendarEventResponse = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: formatDateForResponse(event.date),
      start_time: event.start_time.substring(0, 5), // Convertir HH:MM:SS en HH:MM
      end_time: event.end_time.substring(0, 5), // Convertir HH:MM:SS en HH:MM
      location: event.location,
      calendar_type: event.calendar_type,
      attendees: event.attendees,
      color: event.color,
      is_completed: event.is_completed,
      created_by: event.created_by,
      created_at: event.created_at.toISOString(),
      updated_at: event.updated_at.toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating calendar event:', error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const deleteCalendarEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await calendarModel.deleteCalendarEvent(id);

    if (!deleted) {
      res.status(404).json({ message: "Événement calendrier non trouvé" });
      return;
    }

    res.json({ message: "Événement calendrier supprimé avec succès" });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const getCalendarStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await calendarModel.getCalendarStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting calendar stats:', error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
