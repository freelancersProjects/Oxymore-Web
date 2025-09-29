export type AppointmentType = 'meeting' | 'training' | 'tournament' | 'league' | 'other';

export interface CalendarAppointment {
  id: string;
  title: string;
  description?: string | null;
  appointment_date: string;
  start_time: string;
  end_time: string;
  location?: string | null;
  type: AppointmentType;
  is_completed: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  attendees?: string[];
  color?: string;

  created_by_username?: string;
  participants?: CalendarAppointmentParticipant[];
  guests?: CalendarAppointmentGuest[];
}

export interface CalendarAppointmentParticipant {
  id: number;
  appointment_id: number;
  user_id: number;
  created_at: string;

  // Relations
  username?: string;
  email?: string;
  avatar_url?: string;
}

export interface CalendarAppointmentGuest {
  id: number;
  appointment_id: number;
  name: string;
  email?: string;
  created_at: string;
}

export interface CreateAppointmentData {
  title: string;
  description?: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  type: AppointmentType;
  attendees?: string[];
  color?: string;
  participants?: number[];
  guests?: {
    name: string;
    email?: string;
  }[];
}

export interface UpdateAppointmentData extends Partial<CreateAppointmentData> {
  id?: string;
  is_completed?: boolean;
}

export interface CalendarFilters {
  type?: AppointmentType;
  is_completed?: boolean;
  date_from?: string;
  date_to?: string;
  search?: string;
  created_by?: number;
}

export interface CalendarStats {
  total_appointments: number;
  completed_appointments: number;
  pending_appointments: number;
  appointments_by_type: {
    type: AppointmentType;
    count: number;
  }[];
  appointments_by_month: {
    month: string;
    count: number;
  }[];
}
