import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db';
import { CalendarEvent, CreateCalendarEventRequest, UpdateCalendarEventRequest, CalendarStats } from '../interfaces/calendarInterfaces';

// Fonction utilitaire pour créer une date sans décalage de fuseau horaire
const createLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

export const createCalendarEvent = async (eventData: CreateCalendarEventRequest, createdBy: string): Promise<CalendarEvent> => {
  const id = uuidv4();
  const now = new Date();

  const event: CalendarEvent = {
    id,
    title: eventData.title,
    description: eventData.description,
    date: createLocalDate(eventData.date),
    start_time: eventData.start_time.includes(':') && eventData.start_time.split(':').length === 2
      ? `${eventData.start_time}:00`
      : eventData.start_time,
    end_time: eventData.end_time.includes(':') && eventData.end_time.split(':').length === 2
      ? `${eventData.end_time}:00`
      : eventData.end_time,
    location: eventData.location,
    calendar_type: eventData.calendar_type,
    attendees: eventData.attendees || [],
    color: eventData.color || '#6366f1',
    is_completed: eventData.is_completed || false,
    created_by: createdBy,
    created_at: now,
    updated_at: now
  };

  const attendeesJson = JSON.stringify(event.attendees);

  await db.execute(
    `INSERT INTO calendar_events (
      id, title, description, date, start_time, end_time,
      location, calendar_type, attendees, color, is_completed,
      created_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      event.id, event.title, event.description, event.date,
      event.start_time, event.end_time, event.location,
      event.calendar_type, attendeesJson, event.color,
      event.is_completed, event.created_by, event.created_at, event.updated_at
    ]
  );

  return event;
};

export const getCalendarEventById = async (id: string): Promise<CalendarEvent | null> => {
  const [rows] = await db.execute(
    'SELECT * FROM calendar_events WHERE id = ?',
    [id]
  );

  const events = rows as any[];
  if (events.length === 0) return null;

  const event = events[0];
  return {
    ...event,
    attendees: JSON.parse(event.attendees || '[]'),
    date: new Date(event.date),
    created_at: new Date(event.created_at),
    updated_at: new Date(event.updated_at)
  };
};

export const getAllCalendarEvents = async (): Promise<CalendarEvent[]> => {
  const [rows] = await db.execute(
    'SELECT * FROM calendar_events ORDER BY date ASC, start_time ASC'
  );

  const events = rows as any[];
  return events.map(event => ({
    ...event,
    attendees: JSON.parse(event.attendees || '[]'),
    date: new Date(event.date),
    created_at: new Date(event.created_at),
    updated_at: new Date(event.updated_at)
  }));
};

export const getCalendarEventsByDateRange = async (startDate: Date, endDate: Date): Promise<CalendarEvent[]> => {
  const [rows] = await db.execute(
    'SELECT * FROM calendar_events WHERE date BETWEEN ? AND ? ORDER BY date ASC, start_time ASC',
    [startDate, endDate]
  );

  const events = rows as any[];
  return events.map(event => ({
    ...event,
    attendees: JSON.parse(event.attendees || '[]'),
    date: new Date(event.date),
    created_at: new Date(event.created_at),
    updated_at: new Date(event.updated_at)
  }));
};

export const getCalendarEventsByType = async (calendarType: string): Promise<CalendarEvent[]> => {
  const [rows] = await db.execute(
    'SELECT * FROM calendar_events WHERE calendar_type = ? ORDER BY date ASC, start_time ASC',
    [calendarType]
  );

  const events = rows as any[];
  return events.map(event => ({
    ...event,
    attendees: JSON.parse(event.attendees || '[]'),
    date: new Date(event.date),
    created_at: new Date(event.created_at),
    updated_at: new Date(event.updated_at)
  }));
};

export const updateCalendarEvent = async (id: string, eventData: UpdateCalendarEventRequest): Promise<CalendarEvent | null> => {
  const now = new Date();
  const updates: string[] = [];
  const values: any[] = [];

  if (eventData.title !== undefined) {
    updates.push('title = ?');
    values.push(eventData.title);
  }
  if (eventData.description !== undefined) {
    updates.push('description = ?');
    values.push(eventData.description);
  }
  if (eventData.date !== undefined) {
    updates.push('date = ?');
    values.push(createLocalDate(eventData.date));
  }
  if (eventData.start_time !== undefined) {
    updates.push('start_time = ?');
    const formattedStartTime = eventData.start_time.includes(':') && eventData.start_time.split(':').length === 2
      ? `${eventData.start_time}:00`
      : eventData.start_time;
    values.push(formattedStartTime);
  }
  if (eventData.end_time !== undefined) {
    updates.push('end_time = ?');
    const formattedEndTime = eventData.end_time.includes(':') && eventData.end_time.split(':').length === 2
      ? `${eventData.end_time}:00`
      : eventData.end_time;
    values.push(formattedEndTime);
  }
  if (eventData.location !== undefined) {
    updates.push('location = ?');
    values.push(eventData.location);
  }
  if (eventData.calendar_type !== undefined) {
    updates.push('calendar_type = ?');
    values.push(eventData.calendar_type);
  }
  if (eventData.attendees !== undefined) {
    updates.push('attendees = ?');
    values.push(JSON.stringify(eventData.attendees));
  }
  if (eventData.color !== undefined) {
    updates.push('color = ?');
    values.push(eventData.color);
  }
  if (eventData.is_completed !== undefined) {
    updates.push('is_completed = ?');
    values.push(eventData.is_completed);
  }

  updates.push('updated_at = ?');
  values.push(now);
  values.push(id);

  if (updates.length === 1) {
    return getCalendarEventById(id);
  }

  await db.execute(
    `UPDATE calendar_events SET ${updates.join(', ')} WHERE id = ?`,
    values
  );

  return getCalendarEventById(id);
};

export const deleteCalendarEvent = async (id: string): Promise<boolean> => {
  const [result] = await db.execute(
    'DELETE FROM calendar_events WHERE id = ?',
    [id]
  );

  return (result as any).affectedRows > 0;
};

export const getCalendarStats = async (): Promise<CalendarStats> => {
  const [totalRows] = await db.execute('SELECT COUNT(*) as total FROM calendar_events');
  const [completedRows] = await db.execute('SELECT COUNT(*) as completed FROM calendar_events WHERE is_completed = true');
  const [upcomingRows] = await db.execute('SELECT COUNT(*) as upcoming FROM calendar_events WHERE date >= CURDATE() AND is_completed = false');

  const [typeRows] = await db.execute(`
    SELECT calendar_type, COUNT(*) as count
    FROM calendar_events
    GROUP BY calendar_type
  `);

  const total = (totalRows as any[])[0].total;
  const completed = (completedRows as any[])[0].completed;
  const upcoming = (upcomingRows as any[])[0].upcoming;

  const eventsByType = {
    meeting: 0,
    tournament: 0,
    training: 0,
    other: 0,
    league: 0
  };

  (typeRows as any[]).forEach(row => {
    if (row.calendar_type in eventsByType) {
      eventsByType[row.calendar_type as keyof typeof eventsByType] = row.count;
    }
  });

  return {
    total_events: total,
    completed_events: completed,
    upcoming_events: upcoming,
    events_by_type: eventsByType
  };
};

export default {
  createCalendarEvent,
  getCalendarEventById,
  getAllCalendarEvents,
  getCalendarEventsByDateRange,
  getCalendarEventsByType,
  updateCalendarEvent,
  deleteCalendarEvent,
  getCalendarStats
};
