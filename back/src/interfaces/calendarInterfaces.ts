export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  start_time: string;
  end_time: string;
  location?: string;
  calendar_type: 'meeting' | 'tournament' | 'training' | 'other' | 'league';
  attendees: string[];
  color: string;
  is_completed: boolean;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCalendarEventRequest {
  title: string;
  description?: string;
  date: string;
  start_time: string;
  end_time: string;
  location?: string;
  calendar_type: 'meeting' | 'tournament' | 'training' | 'other' | 'league';
  attendees?: string[];
  color?: string;
  is_completed?: boolean;
}

export interface UpdateCalendarEventRequest {
  title?: string;
  description?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  calendar_type?: 'meeting' | 'tournament' | 'training' | 'other' | 'league';
  attendees?: string[];
  color?: string;
  is_completed?: boolean;
}

export interface CalendarEventResponse {
  id: string;
  title: string;
  description?: string;
  date: string;
  start_time: string;
  end_time: string;
  location?: string;
  calendar_type: string;
  attendees: string[];
  color: string;
  is_completed: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CalendarStats {
  total_events: number;
  completed_events: number;
  upcoming_events: number;
  events_by_type: {
    meeting: number;
    tournament: number;
    training: number;
    other: number;
    league: number;
  };
}
