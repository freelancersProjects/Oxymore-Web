import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db';
import { CalendarAppointment, CreateAppointmentData, UpdateAppointmentData, CalendarStats } from '../interfaces/calendarInterfaces';

const getTypeColorUtil = (type: string): string => {
  switch (type) {
    case 'meeting': return '#3b82f6';
    case 'training': return '#10b981';
    case 'tournament': return '#ef4444';
    case 'league': return '#8b5cf6';
    case 'other': return '#6b7280';
    default: return '#6366f1';
  }
};

const createLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
};

export const createCalendarEvent = async (eventData: CreateAppointmentData, createdBy: string): Promise<CalendarAppointment> => {
  const id = uuidv4();
  const now = new Date();

  const event: CalendarAppointment = {
    id: id,
    title: eventData.title,
    description: eventData.description || null,
    appointment_date: eventData.appointment_date,
    start_time: eventData.start_time.includes(':') && eventData.start_time.split(':').length === 2
      ? `${eventData.start_time}:00`
      : eventData.start_time,
    end_time: eventData.end_time.includes(':') && eventData.end_time.split(':').length === 2
      ? `${eventData.end_time}:00`
      : eventData.end_time,
    location: eventData.location || null,
    type: eventData.type,
    is_completed: false,
    created_by: createdBy,
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  };

  await db.execute(
    `INSERT INTO calendar_events (
      id, title, description, date, start_time, end_time,
      location, calendar_type, attendees, color, is_completed,
      created_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, event.title, event.description, event.appointment_date,
      event.start_time, event.end_time, event.location,
      event.type, JSON.stringify(eventData.attendees || []), getTypeColorUtil(eventData.type), event.is_completed,
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
    appointment_date: event.date,
    start_time: event.start_time,
    end_time: event.end_time,
    location: event.location,
    type: event.calendar_type,
    is_completed: event.is_completed,
    created_by: event.created_by,
    created_at: event.created_at,
    updated_at: event.updated_at,
    attendees: event.attendees ? JSON.parse(event.attendees) : [],
    color: event.color || getTypeColorUtil(event.calendar_type)
  };
};

export const getAllCalendarEvents = async (): Promise<CalendarAppointment[]> => {
  const [rows] = await db.execute(
    'SELECT * FROM calendar_events ORDER BY date ASC, start_time ASC'
  );

  const events = rows as any[];
  return events.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    appointment_date: event.date,
    start_time: event.start_time,
    end_time: event.end_time,
    location: event.location,
    type: event.calendar_type,
    is_completed: event.is_completed,
    created_by: event.created_by,
    created_at: event.created_at,
    updated_at: event.updated_at,
    attendees: event.attendees ? JSON.parse(event.attendees) : [],
    color: event.color || getTypeColorUtil(event.calendar_type)
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
    updateFields.push('date = ?');
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
    updateFields.push('calendar_type = ?');
    updateValues.push(eventData.type);
  }
  if (eventData.is_completed !== undefined) {
    updateFields.push('is_completed = ?');
    updateValues.push(eventData.is_completed);
  }
  if (eventData.attendees !== undefined) {
    updateFields.push('attendees = ?');
    updateValues.push(JSON.stringify(eventData.attendees));
  }
  if (eventData.color !== undefined) {
    updateFields.push('color = ?');
    updateValues.push(eventData.color);
  }

  if (updateFields.length === 0) {
    return getCalendarEventById(id);
  }

  updateFields.push('updated_at = ?');
  updateValues.push(now.toISOString());

  console.log('SQL:', `UPDATE calendar_events SET ${updateFields.join(', ')} WHERE id = ?`);
  console.log('Values:', [...updateValues, id]);

  await db.execute(
    `UPDATE calendar_events SET ${updateFields.join(', ')} WHERE id = ?`,
    [...updateValues, id]
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
    'SELECT * FROM calendar_events WHERE date BETWEEN ? AND ? ORDER BY date ASC, start_time ASC',
    [startDate, endDate]
  );

  const events = rows as any[];
  return events.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    appointment_date: event.date, // Map date to appointment_date for interface
    start_time: event.start_time,
    end_time: event.end_time,
    location: event.location,
    type: event.calendar_type, // Map calendar_type to type for interface
    is_completed: event.is_completed,
    created_by: event.created_by,
    created_at: event.created_at,
    updated_at: event.updated_at
  }));
};

export const getCalendarEventsByType = async (type: string): Promise<CalendarAppointment[]> => {
  const [rows] = await db.execute(
    'SELECT * FROM calendar_events WHERE calendar_type = ? ORDER BY date ASC, start_time ASC',
    [type]
  );

  const events = rows as any[];
  return events.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    appointment_date: event.date, // Map date to appointment_date for interface
    start_time: event.start_time,
    end_time: event.end_time,
    location: event.location,
    type: event.calendar_type, // Map calendar_type to type for interface
    is_completed: event.is_completed,
    created_by: event.created_by,
    created_at: event.created_at,
    updated_at: event.updated_at
  }));
};

export const getCalendarStats = async (): Promise<CalendarStats> => {
  const [totalRows] = await db.execute('SELECT COUNT(*) as total FROM calendar_events');
  const [completedRows] = await db.execute('SELECT COUNT(*) as completed FROM calendar_events WHERE is_completed = true');
  const [typeRows] = await db.execute('SELECT calendar_type as type, COUNT(*) as count FROM calendar_events GROUP BY calendar_type');

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
