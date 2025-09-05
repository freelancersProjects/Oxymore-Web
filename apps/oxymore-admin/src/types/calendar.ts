// Types pour le système de calendrier (simplifiés)

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

  // Relations
  participants?: CalendarAppointmentParticipant[];
  guests?: CalendarAppointmentGuest[];
}

export interface CalendarAppointmentParticipant {
  id: number;
  appointment_id: number;
  user_id: number;
  created_at: string;

  // Relations
  user?: {
    id_user: number;
    username: string;
    email: string;
    avatar_url?: string;
  };
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

// Types pour les vues du calendrier
export type CalendarViewMode = 'month' | 'week' | 'day';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  location?: string;
  type: AppointmentType;
  color: string;
  icon: string;
  isCompleted: boolean;
  isSystem?: boolean; // Pour les tournois/ligues
  originalId?: number; // ID original dans la DB
}

// Fonction utilitaire pour obtenir la couleur et l'icône selon le type
export const getAppointmentTypeConfig = (type: AppointmentType) => {
  const configs = {
    meeting: { color: 'bg-purple-500', icon: 'Users' },
    training: { color: 'bg-green-500', icon: 'Dumbbell' },
    tournament: { color: 'bg-red-500', icon: 'Trophy' },
    league: { color: 'bg-orange-500', icon: 'Award' },
    other: { color: 'bg-blue-500', icon: 'Calendar' }
  };
  return configs[type] || configs.other;
};
