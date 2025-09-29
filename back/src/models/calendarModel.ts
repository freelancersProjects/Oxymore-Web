import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db';
import { CalendarAppointment, CreateAppointmentData, UpdateAppointmentData, CalendarStats } from '../interfaces/calendarInterfaces';

// Fonction utilitaire pour créer une date sans décalage de fuseau horaire
const createLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

export const createCalendarEvent = async (eventData: CreateAppointmentData, createdBy: string): Promise<CalendarAppointment> => {
  const id = uuidv4();
  const now = new Date();

  const event: CalendarAppointment = {
    id: parseInt(id.replace(/-/g, '').substring(0, 8), 16), // Convert UUID to number
    title: eventData.title,
    description: eventData.description,
    appointment_date: eventData.appointment_date,
    start_time: eventData.start_time.includes(':') && eventData.start_time.split(':').length === 2
      ? `${eventData.start_time}:00`
      : eventData.start_time,
    end_time: eventData.end_time.includes(':') && eventData.end_time.split(':').length === 2
      ? `${eventData.end_time}:00`
      : eventData.end_time,
    location: eventData.location,
    type: eventData.type,
    is_completed: false,
    created_by: parseInt(createdBy),
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  };

  await db.execute(
    `INSERT INTO calendar_events (
      id, title, description, appointment_date, start_time, end_time,
      location, type, is_completed,
      created_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      event.id, event.title, event.description, event.appointment_date,
      event.start_time, event.end_time, event.location,
      event.type, event.is_completed,
      event.created_by, event.created_at, event.updated_at
    ]
  );

  return event;
};

export const getCalendarEventById = async (id: string): Promise<CalendarAppointment | null> => {
  const [rows] = await db.execute(
    'SELECT * FROM calendar_events WHERE id = ?',
    [id]
  );

  const events = rows as any[];
  if (events.length === 0) return null;

  const event = events[0];
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    appointment_date: event.appointment_date,
    start_time: event.start_time,
    end_time: event.end_time,
    location: event.location,
    type: event.type,
    is_completed: event.is_completed,
    created_by: event.created_by,
    created_at: event.created_at,
    updated_at: event.updated_at
  };
};

export const getAllCalendarEvents = async (): Promise<CalendarAppointment[]> => {
  const [rows] = await db.execute(
    'SELECT * FROM calendar_events ORDER BY appointment_date ASC, start_time ASC'
  );

  const events = rows as any[];
  return events.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    appointment_date: event.appointment_date,
    start_time: event.start_time,
    end_time: event.end_time,
    location: event.location,
    type: event.type,
    is_completed: event.is_completed,
    created_by: event.created_by,
    created_at: event.created_at,
    updated_at: event.updated_at
  }));
};

export const updateCalendarEvent = async (id: string, eventData: UpdateAppointmentData): Promise<CalendarAppointment | null> => {
  const now = new Date();

  const updateFields = [];
  const updateValues = [];

  if (eventData.title !== undefined) {
    updateFields.push('title = ?');
    updateValues.push(eventData.title);
  }
  if (eventData.description !== undefined) {
    updateFields.push('description = ?');
    updateValues.push(eventData.description);
  }
  if (eventData.appointment_date !== undefined) {
    updateFields.push('appointment_date = ?');
    updateValues.push(eventData.appointment_date);
  }
  if (eventData.start_time !== undefined) {
    const startTime = eventData.start_time.includes(':') && eventData.start_time.split(':').length === 2
      ? `${eventData.start_time}:00`
      : eventData.start_time;
    updateFields.push('start_time = ?');
    updateValues.push(startTime);
  }
  if (eventData.end_time !== undefined) {
    const endTime = eventData.end_time.includes(':') && eventData.end_time.split(':').length === 2
      ? `${eventData.end_time}:00`
      : eventData.end_time;
    updateFields.push('end_time = ?');
    updateValues.push(endTime);
  }
  if (eventData.location !== undefined) {
    updateFields.push('location = ?');
    updateValues.push(eventData.location);
  }
  if (eventData.type !== undefined) {
    updateFields.push('type = ?');
    updateValues.push(eventData.type);
  }
  if (eventData.is_completed !== undefined) {
    updateFields.push('is_completed = ?');
    updateValues.push(eventData.is_completed);
  }

  updateFields.push('updated_at = ?');
  updateValues.push(now.toISOString());
  updateValues.push(id);

  await db.execute(
    `UPDATE calendar_events SET ${updateFields.join(', ')} WHERE id = ?`,
    updateValues
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

export const getCalendarEventsByDateRange = async (startDate: string, endDate: string): Promise<CalendarAppointment[]> => {
  const [rows] = await db.execute(
    'SELECT * FROM calendar_events WHERE appointment_date BETWEEN ? AND ? ORDER BY appointment_date ASC, start_time ASC',
    [startDate, endDate]
  );

  const events = rows as any[];
  return events.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    appointment_date: event.appointment_date,
    start_time: event.start_time,
    end_time: event.end_time,
    location: event.location,
    type: event.type,
    is_completed: event.is_completed,
    created_by: event.created_by,
    created_at: event.created_at,
    updated_at: event.updated_at
  }));
};

export const getCalendarEventsByType = async (type: string): Promise<CalendarAppointment[]> => {
  const [rows] = await db.execute(
    'SELECT * FROM calendar_events WHERE type = ? ORDER BY appointment_date ASC, start_time ASC',
    [type]
  );

  const events = rows as any[];
  return events.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    appointment_date: event.appointment_date,
    start_time: event.start_time,
    end_time: event.end_time,
    location: event.location,
    type: event.type,
    is_completed: event.is_completed,
    created_by: event.created_by,
    created_at: event.created_at,
    updated_at: event.updated_at
  }));
};

export const getCalendarStats = async (): Promise<CalendarStats> => {
  const [totalRows] = await db.execute('SELECT COUNT(*) as total FROM calendar_events');
  const [completedRows] = await db.execute('SELECT COUNT(*) as completed FROM calendar_events WHERE is_completed = true');
  const [typeRows] = await db.execute('SELECT type, COUNT(*) as count FROM calendar_events GROUP BY type');

  const total = (totalRows as any[])[0].total;
  const completed = (completedRows as any[])[0].completed;
  const pending = total - completed;

  const appointmentsByType = (typeRows as any[]).map(row => ({
    type: row.type,
    count: row.count
  }));

  return {
    total_appointments: total,
    completed_appointments: completed,
    pending_appointments: pending,
    appointments_by_type: appointmentsByType,
    appointments_by_month: [] // TODO: Implement monthly stats if needed
  };
};
