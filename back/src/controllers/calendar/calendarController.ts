import { Request, Response } from 'express';
import * as CalendarModel from '../../models/calendar/calendarModel';

const formatEventForResponse = (event: any) => {
  return {
    ...event,
    appointment_date: event.appointment_date ?
      (typeof event.appointment_date === 'string' ? event.appointment_date.split('T')[0] : event.appointment_date)
      : event.appointment_date,
    start_time: event.start_time ? event.start_time.substring(0, 5) : event.start_time,
    end_time: event.end_time ? event.end_time.substring(0, 5) : event.end_time
  };
};

export const createCalendarEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventData = req.body;
    const createdBy = (req as any).user?.id_user || 'system';

    if (!eventData.title || !eventData.appointment_date || !eventData.start_time || !eventData.end_time || !eventData.type) {
      res.status(400).json({
        success: false,
        message: 'Titre, date, heures de début et fin, et type sont requis'
      });
      return;
    }

    const event = await CalendarModel.createCalendarEvent(eventData, createdBy);
    res.status(201).json(formatEventForResponse(event));
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'événement'
    });
  }
};

export const getAllCalendarEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await CalendarModel.getAllCalendarEvents();
    const formattedEvents = events.map(event => formatEventForResponse(event));
    res.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements'
    });
  }
};

export const getCalendarEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await CalendarModel.getCalendarEventById(id);

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
      return;
    }

    res.json({
      success: true,
      data: formatEventForResponse(event)
    });
  } catch (error) {
    console.error('Error fetching calendar event:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'événement'
    });
  }
};

export const updateCalendarEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log('UPDATE - ID:', id);
    console.log('UPDATE - Data:', updateData);

    const event = await CalendarModel.updateCalendarEvent(id, updateData);
    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
      return;
    }

    console.log('UPDATE - Result:', event);
    res.json(formatEventForResponse(event));
  } catch (error) {
    console.error('Error updating calendar event:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'événement'
    });
  }
};

export const deleteCalendarEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await CalendarModel.deleteCalendarEvent(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Événement supprimé avec succès'
    });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'événement'
    });
  }
};

export const getCalendarEventsByDateRange = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'startDate et endDate sont requis'
      });
      return;
    }

    const events = await CalendarModel.getCalendarEventsByDateRange(startDate as string, endDate as string);
    const formattedEvents = events.map(event => formatEventForResponse(event));
    res.json({
      success: true,
      data: formattedEvents
    });
  } catch (error) {
    console.error('Error fetching calendar events by date range:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements'
    });
  }
};

export const getCalendarEventsByType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.params;
    const events = await CalendarModel.getCalendarEventsByType(type);
    const formattedEvents = events.map(event => formatEventForResponse(event));
    res.json({
      success: true,
      data: formattedEvents
    });
  } catch (error) {
    console.error('Error fetching calendar events by type:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements'
    });
  }
};

export const getCalendarStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await CalendarModel.getCalendarStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching calendar stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

// Récupérer tous les types de rendez-vous
export const getAppointmentTypes = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Retourner les types prédéfinis
    const types = ['meeting', 'training', 'tournament', 'league', 'other'];
    return res.json({
      success: true,
      data: types
    });
  } catch (error) {
    console.error('Error fetching appointment types:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des types de rendez-vous'
    });
  }
};

// Récupérer tous les rendez-vous avec filtres
export const getAppointments = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Utiliser getAllCalendarEvents pour l'instant
    const appointments = await CalendarModel.getAllCalendarEvents();
    return res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des rendez-vous'
    });
  }
};

// Récupérer un rendez-vous par ID
export const getAppointmentById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const appointment = await CalendarModel.getCalendarEventById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Rendez-vous non trouvé'
      });
    }

    return res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du rendez-vous'
    });
  }
};

// Créer un nouveau rendez-vous
export const createAppointment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const appointmentData = req.body;
    const createdBy = (req as any).user?.id_user;

    if (!createdBy) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
    }

    // Validation des données requises
    if (!appointmentData.title || !appointmentData.appointment_date || !appointmentData.start_time || !appointmentData.end_time || !appointmentData.type) {
      return res.status(400).json({
        success: false,
        message: 'Titre, date, heures de début et fin, et type sont requis'
      });
    }

    const appointment = await CalendarModel.createCalendarEvent(appointmentData, createdBy);

    return res.status(201).json({
      success: true,
      data: appointment,
      message: 'Rendez-vous créé avec succès'
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du rendez-vous'
    });
  }
};

export const updateAppointment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedBy = (req as any).user?.id_user;

    if (!updatedBy) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
    }

    updateData.id = parseInt(id);
    await CalendarModel.updateCalendarEvent(id, updateData);

    return res.json({
      success: true,
      message: 'Rendez-vous mis à jour avec succès'
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    if (error instanceof Error && error.message.includes('non trouvé')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    if (error instanceof Error && error.message.includes('autorisé')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du rendez-vous'
    });
  }
};

// Supprimer un rendez-vous
export const deleteAppointment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const deletedBy = (req as any).user?.id_user;

    if (!deletedBy) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
    }

    await CalendarModel.deleteCalendarEvent(id);

    return res.json({
      success: true,
      message: 'Rendez-vous supprimé avec succès'
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    if (error instanceof Error && error.message.includes('non trouvé')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    if (error instanceof Error && error.message.includes('autorisé')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du rendez-vous'
    });
  }
};

// Ajouter un commentaire à un rendez-vous
export const addComment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = (req as any).user?.id_user;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
    }

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: 'Le commentaire est requis'
      });
    }

    // Vérifier que le rendez-vous existe
    const appointment = await CalendarModel.getCalendarEventById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Rendez-vous non trouvé'
      });
    }

    return res.json({
      success: true,
      message: 'Commentaire ajouté avec succès'
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout du commentaire'
    });
  }
};

export const toggleFavorite = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as any).user?.id_user;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
    }

    return res.json({
      success: true,
      message: 'Favori mis à jour avec succès'
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du favori'
    });
  }
};
