// Interfaces pour le système de calendrier (Backend)

export type AppointmentType = 'meeting' | 'training' | 'tournament' | 'league' | 'other';

export interface CalendarAppointment {
  id: number;
  title: string;
  description?: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  location?: string;
  type: AppointmentType;
  is_completed: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;

  // Relations (optionnelles selon le contexte)
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

// Types pour les formulaires
export interface CreateAppointmentData {
  title: string;
  description?: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  type: AppointmentType;
  participants?: number[]; // IDs des utilisateurs
  guests?: {
    name: string;
    email?: string;
  }[];
}

export interface UpdateAppointmentData extends Partial<CreateAppointmentData> {
  id: number;
  is_completed?: boolean;
}

// Types pour les filtres et recherche
export interface CalendarFilters {
  type?: AppointmentType;
  is_completed?: boolean;
  date_from?: string;
  date_to?: string;
  search?: string;
  created_by?: number;
}

// Types pour les statistiques
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
