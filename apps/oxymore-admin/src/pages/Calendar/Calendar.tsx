import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Clock,
  MapPin,
  Users,
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  AlertCircle,
  MessageSquare,
  Trophy,
  Target,
  Zap,
  Search,
  Filter,
  Grid3X3,
  CalendarDays,
  Shield
} from 'lucide-react';
import Dropdown from '../../components/Dropdown/Dropdown';
import { apiService } from '../../api/apiService';
import { Tournament } from '../../types/tournament';
import { League } from '../../types/league';

interface Appointment {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  attendees?: string[]; // Made optional
  type: 'meeting' | 'tournament' | 'training' | 'other' | 'league';
  color: string;
  isCompleted?: boolean;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAppointment, setDeleteAppointment] = useState<Appointment | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'calendar' | 'stats'>('calendar');

  // Fonction pour normaliser les dates sans problème de fuseau horaire (sans heure spécifique)
  const normalizeDateSimple = (dateString: string): Date => {
    // Si c'est une date ISO (avec T), extraire juste la partie date
    if (dateString.includes('T')) {
      const datePart = dateString.split('T')[0];
      const [year, month, day] = datePart.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    // Si c'est déjà au format YYYY-MM-DD
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Fonction pour normaliser les dates et éviter les problèmes de fuseau horaire
  const normalizeDate = (dateString: string): Date => {
    // Si c'est une date ISO (avec T), extraire juste la partie date
    if (dateString.includes('T')) {
      const datePart = dateString.split('T')[0];
      const [year, month, day] = datePart.split('-').map(Number);
      return new Date(year, month - 1, day, 12, 0, 0, 0);
    }
    // Si c'est déjà au format YYYY-MM-DD
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  };

  // Fonction pour convertir une date locale en string YYYY-MM-DD sans décalage de fuseau horaire
  const dateToLocalString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTypeColorUtil = (type: string) => {
    switch (type) {
      case 'meeting': return '#3b82f6';
      case 'training': return '#10b981';
      case 'tournament': return '#ef4444';
      case 'league': return '#8b5cf6';
      case 'other': return '#6b7280';
      default: return '#6366f1';
    }
  };

  const fetchCalendarEvents = async () => {
    try {
      const response = await apiService.get<any>('/calendar');
      const data = response.data || response;

      if (!Array.isArray(data)) {
        console.error('Invalid data format received:', data);
        return;
      }

      const calendarAppointments: Appointment[] = data.map((event: any) => {
        const normalizedDate = normalizeDateSimple(event.appointment_date || event.date);
        normalizedDate.setDate(normalizedDate.getDate() + 1);
        if (isNaN(normalizedDate.getTime())) {
          console.error('Invalid date for event:', event.id, 'date:', event.appointment_date || event.date);
          return null;
        }

        const appointment = {
          id: event.id,
          title: event.title || 'Sans titre',
          description: event.description || '',
          date: normalizedDate,
          startTime: event.start_time,
          endTime: event.end_time,
          location: event.location || '',
          attendees: event.attendees || [],
          type: event.type || event.calendar_type,
          color: getTypeColorUtil(event.type || event.calendar_type),
          isCompleted: event.is_completed || false
        };
        return appointment;
      }).filter(appointment => appointment !== null);

      setAppointments(prev => {
        const tournamentLeagueEvents = prev.filter(app =>
          app.id.startsWith('tournament-') || app.id.startsWith('league-')
        );
        const newAppointments = [...tournamentLeagueEvents, ...calendarAppointments];
        return newAppointments;
      });
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
  };

  const fetchLeagues = async () => {
    try {
      const data = await apiService.get<League[]>('/leagues');
      setLeagues(data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    }
  };

  const fetchTournaments = async () => {
    try {
      const data = await apiService.get<Tournament[]>('/tournaments');
      setTournaments(data);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };

  // Convertir les tournois en rendez-vous
  const convertTournamentsToAppointments = (tournaments: Tournament[]): Appointment[] => {
    const appointments: Appointment[] = [];
    const now = new Date();

    tournaments.forEach(tournament => {
      const startDate = new Date(tournament.start_date);
      const endDate = new Date(tournament.end_date);

      // Rendez-vous de début du tournoi
      appointments.push({
        id: `tournament-start-${tournament.id_tournament}`,
        title: `Démarrage: ${tournament.tournament_name}`,
        description: `Démarrage du tournoi ${tournament.type} - ${tournament.format}`,
        date: startDate,
        startTime: startDate.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        endTime: startDate.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        location: tournament.organized_by || 'Lieu à définir',
        attendees: [`Max: ${tournament.max_participant || 'N/A'}`, `Min: ${tournament.min_participant || 'N/A'}`],
        type: 'tournament' as const,
        color: getTournamentColor(tournament.type),
        isCompleted: startDate < now // Automatiquement marqué comme fait si la date est passée
      });

      // Rendez-vous de fin du tournoi (si date de fin différente de début)
      if (startDate.toDateString() !== endDate.toDateString()) {
        appointments.push({
          id: `tournament-end-${tournament.id_tournament}`,
          title: `Fin: ${tournament.tournament_name}`,
          description: `Fin du tournoi ${tournament.type} - ${tournament.format}`,
          date: endDate,
          startTime: endDate.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          endTime: endDate.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          location: tournament.organized_by || 'Lieu à définir',
          attendees: [`Max: ${tournament.max_participant || 'N/A'}`, `Min: ${tournament.min_participant || 'N/A'}`],
          type: 'tournament' as const,
          color: getTournamentColor(tournament.type),
          isCompleted: endDate < now // Automatiquement marqué comme fait si la date est passée
        });
      }
    });

    return appointments;
  };

  // Convertir les ligues en rendez-vous
  const convertLeaguesToAppointments = (leagues: League[]): Appointment[] => {
    const appointments: Appointment[] = [];
    const now = new Date();

    leagues.forEach(league => {
      // Rendez-vous de début de la ligue
      if (league.start_date) {
        const startDate = new Date(league.start_date);
        appointments.push({
          id: `league-start-${league.id_league}`,
          title: `Démarrage: ${league.league_name}`,
          description: `Démarrage de la ligue ${league.league_name}`,
          date: startDate,
          startTime: startDate.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          endTime: startDate.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          location: 'Ligue',
          attendees: [`Max: ${league.max_teams || 'N/A'} équipes`],
          type: 'league' as const,
          color: getTypeColorUtil('league'), // Utiliser la couleur calculée
          isCompleted: startDate < now // Automatiquement marqué comme fait si la date est passée
        });
      }

      // Rendez-vous de fin de la ligue (si date de fin différente de début)
      if (league.end_date) {
        const startDate = league.start_date ? new Date(league.start_date) : null;
        const endDate = new Date(league.end_date);

        if (!startDate || startDate.toDateString() !== endDate.toDateString()) {
          appointments.push({
            id: `league-end-${league.id_league}`,
            title: `Fin: ${league.league_name}`,
            description: `Fin de la ligue ${league.league_name}`,
            date: endDate,
            startTime: endDate.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            endTime: endDate.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            location: 'Ligue',
            attendees: [`Max: ${league.max_teams || 'N/A'} équipes`],
            type: 'league' as const,
            color: getTypeColorUtil('league'), // Utiliser la couleur calculée
            isCompleted: endDate < now // Automatiquement marqué comme fait si la date est passée
          });
        }
      }
    });

    return appointments;
  };

  // Fonction pour obtenir la couleur selon le type de tournoi
  const getTournamentColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'major': return '#ef4444'; // red-500
      case 'minor': return '#f97316'; // orange-500
      case 'league': return '#3b82f6'; // blue-500
      case 'open': return '#10b981'; // green-500
      default: return '#8b5cf6'; // purple-500
    }
  };

  // Récupérer les tournois, ligues et événements calendrier au chargement
  useEffect(() => {
    fetchTournaments();
    fetchLeagues();
    fetchCalendarEvents();
  }, []);

  // Combiner les rendez-vous du calendrier, les tournois et les ligues
  const allAppointments = useMemo(() => {
    const tournamentAppointments = convertTournamentsToAppointments(tournaments);
    const leagueAppointments = convertLeaguesToAppointments(leagues);

    // Les événements calendrier sont déjà dans le state appointments
    const combined = [...appointments, ...tournamentAppointments, ...leagueAppointments];
    return combined;
  }, [appointments, tournaments, leagues]);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = normalizeDate(`${year}-${String(month + 1).padStart(2, '0')}-01`);
    const lastDay = normalizeDate(`${year}-${String(month + 2).padStart(2, '0')}-01`);
    lastDay.setDate(0); // Dernier jour du mois précédent
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(normalizeDate(`${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`));
    }
    return days;
  };

  const calendarDays = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  // Fonction pour comparer deux dates sans problème de fuseau horaire
  const isSameDate = (date1: Date, date2: Date): boolean => {
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const day1 = date1.getDate();

    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();

    return year1 === year2 && month1 === month2 && day1 === day2;
  };

  const getAppointmentsForDate = (date: Date) => {
    return allAppointments.filter(appointment => {
      const matchesDate = isSameDate(appointment.date, date);
      const matchesType = filterType === 'all' || appointment.type === filterType;
      const matchesSearch = searchTerm === '' ||
        appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.location.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesDate && matchesType && matchesSearch;
    });
  };

  const filteredAppointments = allAppointments.filter(appointment => {
    const matchesType = filterType === 'all' || appointment.type === filterType;
    const matchesSearch = searchTerm === '' ||
      appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtrer par date selon la vue
    let matchesDate = true;
    if (viewMode === 'week') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const appointmentDate = new Date(appointment.date);
      matchesDate = appointmentDate >= weekStart && appointmentDate <= weekEnd;
    } else if (viewMode === 'day') {
      const appointmentDate = new Date(appointment.date);
      const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      const appointmentDateOnly = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate());
      matchesDate = appointmentDateOnly.getTime() === currentDateOnly.getTime();
    }

    return matchesType && matchesSearch && matchesDate;
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    // Créer une nouvelle date avec les bonnes valeurs pour éviter les problèmes de fuseau horaire
    const normalizedDate = normalizeDate(dateToLocalString(date));
    setSelectedDate(normalizedDate);
    setEditingAppointment(null); // Réinitialiser l'état d'édition
    setActiveTooltipId(null); // Réinitialiser les tooltips
    setShowModal(true);
  };

  const handleCreateAppointment = async (formData: Omit<Appointment, 'id'>) => {
    try {
      const appointmentData = {
        title: formData.title,
        description: formData.description,
        appointment_date: dateToLocalString(formData.date), // Changed from 'date' to 'appointment_date'
        start_time: formData.startTime,
        end_time: formData.endTime,
        location: formData.location,
        type: formData.type, // Changed from 'calendar_type' to 'type'
        attendees: formData.attendees,
        color: getTypeColorUtil(formData.type),
        is_completed: formData.isCompleted || false
      };

      const response = await apiService.post<any>('/calendar', appointmentData);
      const event = response.data || response; // Handle both response formats

              const newAppointment: Appointment = {
                id: event.id,
                title: event.title,
                description: event.description,
                date: formData.date, // Utiliser directement la date du formulaire
                startTime: event.start_time,
                endTime: event.end_time,
                location: event.location,
                attendees: event.attendees || [],
                type: event.type || event.calendar_type,
                color: getTypeColorUtil(event.type || event.calendar_type),
                isCompleted: event.is_completed
              };

      setAppointments(prev => [...prev, newAppointment]);
      setShowModal(false);
      setActiveTooltipId(null);
    } catch (error) {
      console.error('Error creating appointment:', error);
      console.error('Erreur lors de la création du rendez-vous');
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    // Si c'est un tournoi, rediriger vers la page d'édition des tournois
    if (appointment.id.startsWith('tournament-')) {
      const tournamentId = appointment.id.replace(/^tournament-(start|end)-/, '');
      window.open(`/tournaments/edit/${tournamentId}`, '_blank');
      return;
    }

    // Si c'est une ligue, rediriger vers la page d'édition des ligues
    if (appointment.id.startsWith('league-')) {
      const leagueId = appointment.id.replace(/^league-(start|end)-/, '');
      window.open(`/leagues/edit/${leagueId}`, '_blank');
      return;
    }

    setEditingAppointment(appointment);
    setShowModal(true);
  };

  const handleUpdateAppointment = async (formData: Appointment) => {
    try {
      if (formData.id.startsWith('tournament-') || formData.id.startsWith('league-')) {
        setAppointments(prev =>
          prev.map(app => app.id === formData.id ? formData : app)
        );
        setShowModal(false);
        setEditingAppointment(null);
        setActiveTooltipId(null);
        return;
      }

      const appointmentData = {
        title: formData.title,
        description: formData.description,
        appointment_date: dateToLocalString(formData.date),
        start_time: formData.startTime,
        end_time: formData.endTime,
        location: formData.location,
        type: formData.type,
        attendees: formData.attendees,
        color: getTypeColorUtil(formData.type),
        is_completed: formData.isCompleted || false
      };

      const response = await apiService.put<any>(`/calendar/${formData.id}`, appointmentData);
      const event = response.data || response;

      const updatedAppointment: Appointment = {
        id: event.id,
        title: event.title,
        description: event.description,
        date: formData.date, // Utiliser directement la date du formulaire
        startTime: event.start_time,
        endTime: event.end_time,
        location: event.location,
        attendees: event.attendees || [],
        type: event.type || event.calendar_type,
        color: getTypeColorUtil(event.type || event.calendar_type),
        isCompleted: event.is_completed
      };

      setAppointments(prev =>
        prev.map(app => app.id === formData.id ? updatedAppointment : app)
      );
      setShowModal(false);
      setEditingAppointment(null);
      setActiveTooltipId(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleDeleteAppointment = async (appointment: Appointment) => {
    if (appointment.id.startsWith('tournament-') || appointment.id.startsWith('league-')) {
      console.error('Les tournois et ligues ne peuvent pas être supprimés depuis le calendrier. Veuillez utiliser les pages correspondantes.');
      return;
    }

    setDeleteAppointment(appointment);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteAppointment) {
      try {
        await apiService.delete(`/calendar/${deleteAppointment.id}`);
        setAppointments(prev => prev.filter(app => app.id !== deleteAppointment.id));
        setShowDeleteModal(false);
        setDeleteAppointment(null);
        setActiveTooltipId(null);
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const toggleAppointmentStatus = (appointmentId: string) => {
    // Ne pas permettre la modification manuelle du statut des tournois et ligues
    if (appointmentId.startsWith('tournament-') || appointmentId.startsWith('league-')) {
      return;
    }

    setAppointments(prev =>
      prev.map(app =>
        app.id === appointmentId
          ? { ...app, isCompleted: !app.isCompleted }
          : app
      )
    );
  };

  // Calculer les statistiques mensuelles
  const getMonthlyStats = () => {
    const stats: { [key: string]: { total: number; completed: number; byType: { [key: string]: number } } } = {};

    allAppointments.forEach(appointment => {
      const monthKey = `${appointment.date.getFullYear()}-${String(appointment.date.getMonth() + 1).padStart(2, '0')}`;

      if (!stats[monthKey]) {
        stats[monthKey] = {
          total: 0,
          completed: 0,
          byType: {}
        };
      }

      stats[monthKey].total++;
      if (appointment.isCompleted) {
        stats[monthKey].completed++;
      }

      if (!stats[monthKey].byType[appointment.type]) {
        stats[monthKey].byType[appointment.type] = 0;
      }
      stats[monthKey].byType[appointment.type]++;
    });

    return Object.entries(stats)
      .map(([monthKey, data]) => ({
        month: monthNames[parseInt(monthKey.split('-')[1]) - 1],
        year: parseInt(monthKey.split('-')[0]),
        ...data
      }))
      .sort((a, b) => b.year - a.year || b.month.localeCompare(a.month));
  };



  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <MessageSquare className="w-4 h-4 text-white" />;
      case 'tournament': return <Trophy className="w-4 h-4 text-white" />;
      case 'training': return <Target className="w-4 h-4 text-white" />;
      case 'league': return <Shield className="w-4 h-4 text-white" />;
      default: return <Zap className="w-4 h-4 text-white" />;
    }
  };

     // Composant Tooltip réutilisable avec portail pour la vue mois
   const AppointmentTooltip = ({ appointment, isMonthView = false }: { appointment: Appointment; isMonthView?: boolean }) => {
     const [isVisible, setIsVisible] = useState(false);
     const [position, setPosition] = useState({ top: 0, left: 0 });
     const triggerRef = useRef<HTMLDivElement>(null);
     const tooltipRef = useRef<HTMLDivElement>(null);
     const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
     const isHoveringTooltip = useRef(false);

           const updatePosition = () => {
        if (triggerRef.current && isMonthView && isVisible) {
          const rect = triggerRef.current.getBoundingClientRect();
          const tooltipHeight = 400; // Hauteur approximative de la tooltip
          const windowHeight = window.innerHeight;
          const scrollY = window.scrollY;

          // Calculer la position de base
          let top = rect.bottom + scrollY + 8;
          let left = rect.left + window.scrollX + (rect.width / 2);

          // Vérifier si la tooltip va déborder en bas
          if (rect.bottom + tooltipHeight + 8 > windowHeight + scrollY) {
            // Positionner la tooltip au-dessus de l'élément
            top = rect.top + scrollY - tooltipHeight - 8;
          }

          // Vérifier si la tooltip va déborder sur les côtés
          const tooltipWidth = 400; // Largeur approximative de la tooltip
          if (left + tooltipWidth / 2 > window.innerWidth) {
            left = window.innerWidth - tooltipWidth / 2 - 10;
          } else if (left - tooltipWidth / 2 < 0) {
            left = tooltipWidth / 2 + 10;
          }

          setPosition({ top, left });
        }
      };

                const showTooltip = () => {
       if (hideTimeoutRef.current) {
         clearTimeout(hideTimeoutRef.current);
         hideTimeoutRef.current = null;
       }
       // Empêcher l'affichage si un autre tooltip est déjà actif ET qu'on n'est pas en train de survoler la tooltip actuelle
       if (activeTooltipId && activeTooltipId !== appointment.id && !isHoveringTooltip.current) {
         return;
       }
       setActiveTooltipId(appointment.id);
        if (triggerRef.current && isMonthView) {
          const rect = triggerRef.current.getBoundingClientRect();
          const tooltipHeight = 400; // Hauteur approximative de la tooltip
          const windowHeight = window.innerHeight;
          const scrollY = window.scrollY;

          // Calculer la position de base
          let top = rect.bottom + scrollY + 8;
          let left = rect.left + window.scrollX + (rect.width / 2);

          // Vérifier si la tooltip va déborder en bas
          if (rect.bottom + tooltipHeight + 8 > windowHeight + scrollY) {
            // Positionner la tooltip au-dessus de l'élément
            top = rect.top + scrollY - tooltipHeight - 8;
          }

          // Vérifier si la tooltip va déborder sur les côtés
          const tooltipWidth = 400; // Largeur approximative de la tooltip
          if (left + tooltipWidth / 2 > window.innerWidth) {
            left = window.innerWidth - tooltipWidth / 2 - 10;
          } else if (left - tooltipWidth / 2 < 0) {
            left = tooltipWidth / 2 + 10;
          }

          setPosition({ top, left });
        }
        setIsVisible(true);
      };

     const hideTooltip = () => {
       if (!isHoveringTooltip.current) {
         hideTimeoutRef.current = setTimeout(() => {
           if (activeTooltipId === appointment.id) {
             setIsVisible(false);
             setActiveTooltipId(null);
           }
         }, 200);
       }
     };

     const handleTooltipMouseEnter = () => {
       isHoveringTooltip.current = true;
       // Annuler le timeout de cachement
       if (hideTimeoutRef.current) {
         clearTimeout(hideTimeoutRef.current);
         hideTimeoutRef.current = null;
       }
     };

     const handleTooltipMouseLeave = () => {
       isHoveringTooltip.current = false;
       // Délai plus court pour une meilleure réactivité
       hideTimeoutRef.current = setTimeout(() => {
         // Vérifier que c'est toujours le bon tooltip avant de le cacher
         if (activeTooltipId === appointment.id) {
           setIsVisible(false);
           setActiveTooltipId(null);
         }
       }, 150);
     };

     const handleTooltipClick = (e: React.MouseEvent) => {
       // Empêcher la fermeture de la tooltip lors d'un clic
       e.stopPropagation();
       // Réinitialiser le flag de survol pour éviter les conflits
       isHoveringTooltip.current = true;
       if (hideTimeoutRef.current) {
         clearTimeout(hideTimeoutRef.current);
         hideTimeoutRef.current = null;
       }
     };

     const handleTooltipActionClick = (e: React.MouseEvent) => {
       // Empêcher la fermeture de la tooltip lors d'un clic sur les actions
       e.stopPropagation();
       // Maintenir la tooltip ouverte après l'action
       isHoveringTooltip.current = true;
       if (hideTimeoutRef.current) {
         clearTimeout(hideTimeoutRef.current);
         hideTimeoutRef.current = null;
       }
     };

     useEffect(() => {
       const trigger = triggerRef.current;
       const tooltip = tooltipRef.current;

       if (trigger) {
         trigger.addEventListener('mouseenter', showTooltip);
         trigger.addEventListener('mouseleave', hideTooltip);
       }

       if (tooltip) {
         tooltip.addEventListener('mouseenter', handleTooltipMouseEnter);
         tooltip.addEventListener('mouseleave', handleTooltipMouseLeave);
       }

       // Ajouter les événements de scroll et resize pour mettre à jour la position
       if (isMonthView) {
         window.addEventListener('scroll', updatePosition, true);
         window.addEventListener('resize', updatePosition);
       }

       return () => {
         if (trigger) {
           trigger.removeEventListener('mouseenter', showTooltip);
           trigger.removeEventListener('mouseleave', hideTooltip);
         }
         if (tooltip) {
           tooltip.removeEventListener('mouseenter', handleTooltipMouseEnter);
           tooltip.removeEventListener('mouseleave', handleTooltipMouseLeave);
         }
         if (isMonthView) {
           window.removeEventListener('scroll', updatePosition, true);
           window.removeEventListener('resize', updatePosition);
         }
         if (hideTimeoutRef.current) {
           clearTimeout(hideTimeoutRef.current);
         }
       };
     }, [isMonthView, isVisible]);

         const tooltipContent = (
       <div
         className="bg-[var(--card-background)] border border-[var(--border-color)] rounded-xl p-5 shadow-2xl min-w-[350px] max-w-[450px] relative"
         onClick={handleTooltipClick}
       >
         {/* Flèche du tooltip - s'adapte selon la position */}
         <div className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[var(--card-background)] border-l border-t border-[var(--border-color)] rotate-45 ${
           position.top < window.scrollY + window.innerHeight / 2 ? '-top-2' : '-bottom-2'
         }`}></div>

        {/* Header avec actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: appointment.color }}
            >
              {getTypeIcon(appointment.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`font-bold text-[var(--text-primary)] text-lg ${appointment.isCompleted ? 'line-through opacity-60' : ''}`}>
                {appointment.title.length > 20 ? appointment.title.substring(0, 20) + '...' : appointment.title}
              </h4>
              <p className="text-sm text-[var(--text-secondary)] capitalize font-medium">
                {appointment.type.length > 20 ? appointment.type.substring(0, 20) + '...' : appointment.type}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleEditAppointment(appointment);
                handleTooltipActionClick(e);
              }}
              className="p-2.5 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors border border-[var(--border-color)]"
              title="Modifier"
            >
              <Edit className="w-4 h-4 text-[var(--text-secondary)]" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteAppointment(appointment);
                handleTooltipActionClick(e);
              }}
              className="p-2.5 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </motion.button>
          </div>
        </div>

        {/* Détails complets */}
        <div className="space-y-3">
          {/* Date et heure */}
          <div className="flex items-center gap-3 p-3 bg-[var(--overlay-hover)] rounded-lg">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <span className="text-[var(--text-primary)] font-semibold text-base">
                {appointment.startTime} - {appointment.endTime}
              </span>
              <p className="text-sm text-[var(--text-secondary)] font-medium">
                {new Date(appointment.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Lieu */}
          {appointment.location && (
            <div className="flex items-center gap-3 p-3 bg-[var(--overlay-hover)] rounded-lg">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <MapPin className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <span className="text-[var(--text-primary)] font-semibold text-base">Lieu</span>
                <p className="text-sm text-[var(--text-secondary)] font-medium break-words hyphens-auto leading-relaxed">{appointment.location}</p>
              </div>
            </div>
          )}

          {/* Participants */}
          {appointment.attendees && appointment.attendees.length > 0 && (
            <div className="flex items-start gap-3 p-3 bg-[var(--overlay-hover)] rounded-lg">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <span className="text-[var(--text-primary)] font-semibold text-base">
                  {appointment.attendees && appointment.attendees.length} participant{appointment.attendees && appointment.attendees.length > 1 ? 's' : ''}
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {appointment.attendees && appointment.attendees.slice(0, 4).map((attendee, idx) => (
                    <span key={idx} className="text-sm bg-[var(--card-background)] px-3 py-1 rounded-full text-[var(--text-secondary)] border border-[var(--border-color)]">
                      {attendee}
                    </span>
                  ))}
                  {appointment.attendees && appointment.attendees.length > 4 && (
                    <span className="text-sm bg-[var(--card-background)] px-3 py-1 rounded-full text-[var(--text-secondary)] border border-[var(--border-color)]">
                      +{appointment.attendees.length - 4} autres
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {appointment.description && (
            <div className="p-3 bg-[var(--overlay-hover)] rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <span className="text-[var(--text-primary)] font-semibold text-base">Description</span>
                  <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed font-medium break-words hyphens-auto">
                    {appointment.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions rapides */}
        <div className="flex gap-3 mt-5 pt-4 border-t border-[var(--border-color)]">
          {appointment.id.startsWith('tournament-') || appointment.id.startsWith('league-') ? (
            // Pour les tournois et ligues, afficher le statut automatique
            <div className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 ${
              appointment.isCompleted
                ? 'bg-green-500 text-white'
                : 'bg-orange-500 text-white'
            }`}>
              <motion.div
                animate={{ rotate: appointment.isCompleted ? 0 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {appointment.isCompleted ? '✓' : '○'}
              </motion.div>
              {appointment.isCompleted ? 'Terminé (automatique)' : 'À venir (automatique)'}
            </div>
          ) : (
            // Pour les rendez-vous manuels, permettre la modification
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                toggleAppointmentStatus(appointment.id);
                handleTooltipActionClick(e);
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                appointment.isCompleted
                  ? 'bg-green-500 hover:bg-green-600 hover:shadow-lg text-white'
                  : 'bg-gray-500 hover:bg-gray-600 hover:shadow-lg text-white'
              }`}
            >
              <motion.div
                animate={{ rotate: appointment.isCompleted ? 0 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {appointment.isCompleted ? '✓' : '○'}
              </motion.div>
              {appointment.isCompleted ? 'Terminé' : 'À faire'}
            </motion.button>
          )}
        </div>
      </div>
    );

    if (isMonthView) {
      return (
        <>
          <div ref={triggerRef} className="absolute inset-0" />
                     {isVisible && createPortal(
             <div
               ref={tooltipRef}
               className="fixed z-[9999] pointer-events-auto"
               style={{
                 top: position.top,
                 left: position.left,
                 transform: 'translateX(-50%)'
               }}
               onMouseEnter={handleTooltipMouseEnter}
               onMouseLeave={handleTooltipMouseLeave}
             >
               {tooltipContent}
             </div>,
             document.body
           )}
        </>
      );
    }

     return (
       <div
         ref={tooltipRef}
         className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200 delay-300 z-[9999] pointer-events-none group-hover:pointer-events-auto hover:opacity-100 hover:delay-0"
         onMouseEnter={handleTooltipMouseEnter}
         onMouseLeave={handleTooltipMouseLeave}
         onClick={handleTooltipClick}
         style={{ pointerEvents: 'auto' }}
       >
         {tooltipContent}
       </div>
     );
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-2 sm:p-4">
      <div className="max-w-[1600px] mx-auto">

        {/* Onglets */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-[var(--card-background)] p-1 rounded-lg border border-[var(--border-color)]">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('calendar')}
              className={`flex-1 py-3 px-6 rounded-md font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'calendar'
                  ? 'bg-gradient-oxymore text-white shadow-lg'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-background)]'
              }`}
            >
              <CalendarIcon className="w-5 h-5" />
              Calendrier
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-3 px-6 rounded-md font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'stats'
                  ? 'bg-gradient-oxymore text-white shadow-lg'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-background)]'
              }`}
            >
              <Trophy className="w-5 h-5" />
              Statistiques
            </motion.button>
          </div>
        </div>

        {activeTab === 'calendar' && (
          <>
         {/* Filtres et options */}
         <div className="bg-[var(--card-background)] rounded-2xl p-3 sm:p-4 mb-4 shadow-lg border border-[var(--border-color)]">
           <div className="flex flex-col gap-4">
             {/* Recherche, bouton et filtres sur la même ligne */}
             <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
               {/* Recherche et bouton */}
               <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center lg:w-2/3">
                 <div className="relative lg:w-1/2">
                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                   <input
                     type="text"
                     placeholder="Rechercher un rendez-vous..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-oxymore-purple"
                   />
                 </div>
                 <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Utiliser la date actuellement sélectionnée ou aujourd'hui par défaut
                      const dateToUse = selectedDate || new Date();
                      const normalizedDate = normalizeDate(dateToLocalString(dateToUse));
                      setSelectedDate(normalizedDate);
                      setEditingAppointment(null); // Réinitialiser l'état d'édition
                      setActiveTooltipId(null); // Réinitialiser les tooltips
                      setShowModal(true);
                    }}
                    className="bg-gradient-oxymore text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Nouveau rendez-vous</span>
                    <span className="sm:hidden">Nouveau</span>
                  </motion.button>
               </div>

               {/* Filtres sur la même ligne */}
               <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center lg:w-1/3 lg:justify-end">
                 {/* Filtre par type */}
                 <div className="flex items-center gap-2">
                   <Filter className="w-4 h-4 text-[var(--text-secondary)]" />
                   <Dropdown
                      options={[
                        { value: 'all', label: 'Tous les types', icon: <Grid3X3 className="w-4 h-4 text-[var(--text-secondary)]" /> },
                        { value: 'meeting', label: 'Réunions', icon: <MessageSquare className="w-4 h-4 text-[var(--text-secondary)]" /> },
                        { value: 'training', label: 'Entraînements', icon: <Target className="w-4 h-4 text-[var(--text-secondary)]" /> },
                        { value: 'other', label: 'Autres', icon: <Zap className="w-4 h-4 text-[var(--text-secondary)]" /> },
                        { value: 'tournament', label: 'Tous les tournois', icon: <Trophy className="w-4 h-4 text-[var(--text-secondary)]" /> },
                        { value: 'league', label: 'Toutes les ligues', icon: <Trophy className="w-4 h-4 text-[var(--text-secondary)]" /> }
                      ]}
                      value={filterType}
                      onChange={setFilterType}
                      placeholder="Filtrer par type"
                      size="sm"
                    />
                 </div>

                 {/* Mode d'affichage */}
                 <div className="flex items-center gap-2">
                   <CalendarDays className="w-4 h-4 text-[var(--text-secondary)]" />
                   <div className="flex bg-[var(--overlay-hover)] rounded-lg p-1 overflow-x-auto">
                     <motion.button
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => setViewMode('month')}
                       className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                         viewMode === 'month'
                           ? 'bg-oxymore-purple text-white'
                           : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                       }`}
                     >
                       Mois
                     </motion.button>
                     <motion.button
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => setViewMode('week')}
                       className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                         viewMode === 'week'
                           ? 'bg-oxymore-purple text-white'
                           : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                       }`}
                     >
                       Semaine
                     </motion.button>
                     <motion.button
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => setViewMode('day')}
                       className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                         viewMode === 'day'
                           ? 'bg-oxymore-purple text-white'
                           : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                       }`}
                     >
                       Jour
                     </motion.button>
                   </div>
                 </div>
               </div>
             </div>
           </div>

                       {/* Statistiques rapides */}
            <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
              {/* Version Mobile avec cartes */}
              <div className="block sm:hidden">
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-3 text-center">Vue d'ensemble</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[var(--overlay-hover)] rounded-xl p-3 text-center border border-[var(--border-color)] hover:border-oxymore-purple/50 transition-all duration-200">
                    <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">{filteredAppointments.length}</div>
                    <div className="text-xs text-[var(--text-secondary)] font-medium">Total</div>
                  </div>
                  <div className="bg-[var(--overlay-hover)] rounded-xl p-3 text-center border border-[var(--border-color)] hover:border-blue-500/50 transition-all duration-200">
                    <div className="text-2xl font-bold text-blue-500 mb-1">
                      {filteredAppointments.filter(a => a.type === 'meeting').length}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] font-medium">Réunions</div>
                  </div>
                  <div className="bg-[var(--overlay-hover)] rounded-xl p-3 text-center border border-[var(--border-color)] hover:border-red-500/50 transition-all duration-200">
                    <div className="text-2xl font-bold text-red-500 mb-1">
                      {filteredAppointments.filter(a => a.type === 'tournament').length}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] font-medium">Tournois</div>
                  </div>
                  <div className="bg-[var(--overlay-hover)] rounded-xl p-3 text-center border border-[var(--border-color)] hover:border-indigo-500/50 transition-all duration-200">
                    <div className="text-2xl font-bold text-indigo-500 mb-1">
                      {filteredAppointments.filter(a => a.type === 'league').length}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] font-medium">Ligues</div>
                  </div>
                  <div className="bg-[var(--overlay-hover)] rounded-xl p-3 text-center border border-[var(--border-color)] hover:border-green-500/50 transition-all duration-200">
                    <div className="text-2xl font-bold text-green-500 mb-1">
                      {filteredAppointments.filter(a => a.type === 'training').length}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] font-medium">Entraînements</div>
                  </div>
                  <div className="bg-[var(--overlay-hover)] rounded-xl p-3 text-center border border-[var(--border-color)] hover:border-gray-500/50 transition-all duration-200">
                    <div className="text-2xl font-bold text-gray-500 mb-1">
                      {filteredAppointments.filter(a => a.type === 'other').length}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] font-medium">Autres</div>
                  </div>
                </div>
              </div>

              {/* Version Desktop simple */}
              <div className="hidden sm:block">
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-[var(--text-primary)]">{filteredAppointments.length}</div>
                    <div className="text-xs text-[var(--text-secondary)]">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-blue-500">
                      {filteredAppointments.filter(a => a.type === 'meeting').length}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">Réunions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-red-500">
                      {filteredAppointments.filter(a => a.type === 'tournament').length}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">Tournois</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-indigo-500">
                      {filteredAppointments.filter(a => a.type === 'league').length}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">Ligues</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-green-500">
                      {filteredAppointments.filter(a => a.type === 'training').length}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">Entraînements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-gray-500">
                      {filteredAppointments.filter(a => a.type === 'other').length}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">Autres</div>
                  </div>
                </div>
              </div>
            </div>
         </div>

        {/* Layout principal avec calendrier et légende */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Calendrier */}
          <div className="xl:col-span-3">
            {/* Calendar Navigation */}
            {viewMode === 'month' && (
            <div className="bg-[var(--card-background)] rounded-2xl p-3 sm:p-4 mb-4 shadow-lg border border-[var(--border-color)]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 sm:gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigateMonth('prev')}
                    className="p-2 rounded-lg bg-[var(--overlay-hover)] hover:bg-[var(--overlay-hover)] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-primary)]" />
                  </motion.button>
                  <h2 className="text-lg sm:text-2xl font-bold text-[var(--text-primary)] text-center">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigateMonth('next')}
                    className="p-2 rounded-lg bg-[var(--overlay-hover)] hover:bg-[var(--overlay-hover)] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-primary)]" />
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 sm:px-4 py-2 bg-[var(--overlay-hover)] rounded-lg text-[var(--text-primary)] font-medium hover:bg-[var(--overlay-hover)] transition-colors text-sm sm:text-base"
                >
                  Aujourd'hui
                </motion.button>
              </div>

              {/* Calendar Grid */}
              <div className="overflow-x-auto">
                <div className="grid grid-cols-7 gap-1 min-w-[700px] sm:min-w-0">
                  {/* Day Headers */}
                  {dayNames.map(day => (
                    <div key={day} className="p-2 sm:p-3 text-center font-semibold text-[var(--text-secondary)] text-xs sm:text-sm min-w-[100px] sm:min-w-0">
                      {day}
                    </div>
                  ))}

                  {/* Calendar Days */}
                  {calendarDays.map((date, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => date && handleDateClick(date)}
                      className={`min-h-[80px] sm:min-h-[120px] min-w-[100px] sm:min-w-0 p-1 sm:p-2 border border-[var(--border-color)] rounded-lg cursor-pointer transition-all duration-200 ${
                        date ? 'hover:bg-[var(--overlay-hover)]' : ''
                      } ${
                        date && date.toDateString() === new Date().toDateString()
                          ? 'bg-gradient-oxymore/10 border-oxymore-purple'
                          : ''
                      }`}
                    >
                      {date && (
                        <>
                          <div className="text-xs sm:text-sm font-medium text-[var(--text-primary)] mb-1 sm:mb-2">
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {getAppointmentsForDate(date).slice(0, 2).map(appointment => (
                                <motion.div
                                key={appointment.id}
                                whileHover={{ scale: 1.05 }}
                                className="text-white text-xs p-1 rounded truncate cursor-pointer relative group"
                                style={{ backgroundColor: appointment.color }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditAppointment(appointment);
                                }}
                              >
                                <div className="flex items-center gap-1">
                                  {getTypeIcon(appointment.type)}
                                  <span className={`truncate ${appointment.isCompleted ? 'line-through opacity-60' : ''}`}>{appointment.title}</span>
                                </div>
                                <AppointmentTooltip appointment={appointment} isMonthView={true} />
                              </motion.div>
                            ))}
                            {getAppointmentsForDate(date).length > 2 && (
                              <div className="text-xs text-[var(--text-secondary)]">
                                +{getAppointmentsForDate(date).length - 2} autres
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            )}

            {/* Vue liste des rendez-vous pour semaine et jour */}
            {viewMode !== 'month' && (
              <div className="bg-[var(--card-background)] rounded-2xl p-3 sm:p-4 shadow-lg border border-[var(--border-color)]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-lg sm:text-2xl font-bold text-[var(--text-primary)]">
                    Rendez-vous {viewMode === 'week' ? 'de la semaine' : 'du jour'}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 sm:px-4 py-2 bg-[var(--overlay-hover)] rounded-lg text-[var(--text-primary)] font-medium hover:bg-[var(--overlay-hover)] transition-colors text-sm sm:text-base"
                  >
                    Aujourd'hui
                  </motion.button>
                </div>
                <div className="space-y-3">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map(appointment => (
                      <motion.div
                        key={appointment.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleEditAppointment(appointment)}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-[var(--overlay-hover)] rounded-lg border border-[var(--border-color)] hover:border-oxymore-purple/50 transition-all duration-200 relative group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 flex-1">
                          <div
                            className="w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: appointment.color }}
                          >
                            {getTypeIcon(appointment.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold text-[var(--text-primary)] text-sm sm:text-base break-words hyphens-auto leading-tight ${appointment.isCompleted ? 'line-through opacity-60' : ''}`}>{appointment.title}</h4>
                            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-1 break-words hyphens-auto">
                              {appointment.startTime} - {appointment.endTime} • {appointment.location}
                            </p>
                            {appointment.description && (
                              <p className="text-xs text-[var(--text-secondary)] break-words hyphens-auto leading-relaxed">
                                {appointment.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.isCompleted
                              ? 'bg-green-500/10 text-green-400'
                              : 'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {appointment.isCompleted ? 'Terminé' : 'À faire'}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAppointment(appointment);
                            }}
                            className="p-1 hover:bg-[var(--overlay-active)] rounded transition-colors"
                          >
                            <Edit className="w-4 h-4 text-[var(--text-secondary)]" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAppointment(appointment);
                            }}
                            className="p-1 hover:bg-red-500/10 hover:text-red-400 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-[var(--text-secondary)]" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="w-8 h-8 sm:w-12 sm:h-12 text-[var(--text-secondary)] mx-auto mb-3" />
                      <p className="text-sm sm:text-base text-[var(--text-secondary)]">Aucun rendez-vous trouvé</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Panneau de droite avec Aujourd'hui et Légende */}
          <div className="xl:col-span-1">
            <div className="space-y-4 lg:sticky lg:top-4">
              {/* Section Aujourd'hui */}
              <div className="bg-[var(--card-background)] rounded-2xl p-3 sm:p-4 shadow-lg border border-[var(--border-color)]">
                <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] mb-3 sm:mb-4">Aujourd'hui</h3>
                <div className="space-y-2 sm:space-y-3">
                  {getAppointmentsForDate(new Date()).length > 0 ? (
                    getAppointmentsForDate(new Date()).map(appointment => (
                      <motion.div
                        key={appointment.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-2 sm:p-3 bg-[var(--overlay-hover)] rounded-lg border border-[var(--border-color)] hover:border-oxymore-purple/50 transition-all duration-200 relative group"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div
                            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: appointment.color }}
                          >
                            {getTypeIcon(appointment.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold text-[var(--text-primary)] text-xs sm:text-sm break-words hyphens-auto leading-tight ${appointment.isCompleted ? 'line-through opacity-60' : ''}`}>{appointment.title}</h4>
                            <p className="text-xs text-[var(--text-secondary)] break-words hyphens-auto">
                              {appointment.startTime} - {appointment.endTime}
                            </p>
                          </div>
                        </div>
                        {viewMode === 'month' && <AppointmentTooltip appointment={appointment} isMonthView={true} />}
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-3 sm:py-4">
                      <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--text-secondary)] mx-auto mb-2" />
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)]">Aucun rendez-vous aujourd'hui</p>
                    </div>
                  )}
                </div>
              </div>

                             {/* Légende */}
               <div className="bg-[var(--card-background)] rounded-2xl p-3 sm:p-4 shadow-lg border border-[var(--border-color)]">
                 <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] mb-3 sm:mb-4">Légende</h3>
                 <div className="space-y-2 sm:space-y-3">
                   <div className="text-xs sm:text-sm font-medium text-[var(--text-primary)] mb-2">Rendez-vous</div>
                   {[
                     { type: 'meeting', label: 'Réunion', color: '#3b82f6', icon: <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-white" /> },
                     { type: 'training', label: 'Entraînement', color: '#10b981', icon: <Target className="w-3 h-3 sm:w-4 sm:h-4 text-white" /> },
                     { type: 'other', label: 'Autre', color: '#6b7280', icon: <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" /> }
                   ].map(item => (
                     <div key={item.type} className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-[var(--overlay-hover)] transition-colors">
                       <div
                         className="w-3 h-3 sm:w-4 sm:h-4 rounded flex items-center justify-center"
                         style={{ backgroundColor: item.color }}
                       >
                         {item.icon}
                       </div>
                       <span className="text-xs sm:text-sm text-[var(--text-secondary)]">{item.label}</span>
                     </div>
                   ))}

                   <div className="text-xs sm:text-sm font-medium text-[var(--text-primary)] mb-2 mt-3 sm:mt-4">Tournois</div>
                   {[
                     { type: 'major', label: 'Major', color: '#ef4444', icon: <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> },
                     { type: 'minor', label: 'Minor', color: '#f97316', icon: <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> },
                     { type: 'league', label: 'Ligue', color: '#3b82f6', icon: <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> },
                     { type: 'open', label: 'Open', color: '#10b981', icon: <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> }
                   ].map(item => (
                     <div key={item.type} className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-[var(--overlay-hover)] transition-colors">
                       <div
                         className="w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center"
                         style={{ backgroundColor: item.color }}
                       >
                         {item.icon}
                       </div>
                       <span className="text-xs sm:text-sm text-[var(--text-secondary)]">{item.label}</span>
                     </div>
                   ))}

                   <div className="text-xs sm:text-sm font-medium text-[var(--text-primary)] mb-2 mt-3 sm:mt-4">Ligues</div>
                   <div className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-[var(--overlay-hover)] transition-colors">
                     <div
                       className="w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center"
                       style={{ backgroundColor: '#6366f1' }}
                     >
                       <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                     </div>
                     <span className="text-xs sm:text-sm text-[var(--text-secondary)]">Ligues</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
          </>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Statistiques mensuelles */}
            <div className="bg-[var(--card-background)] rounded-2xl p-6 shadow-lg border border-[var(--border-color)]">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Statistiques mensuelles
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getMonthlyStats().map((stat, index) => (
                  <motion.div
                    key={`${stat.year}-${stat.month}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[var(--hover-background)] rounded-xl p-4 border border-[var(--border-color)]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-[var(--text-primary)]">
                        {stat.month} {stat.year}
                      </h3>
                      <div className="text-sm text-[var(--text-secondary)]">
                        {Math.round((stat.completed / stat.total) * 100)}% terminé
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Total:</span>
                        <span className="font-semibold text-[var(--text-primary)]">{stat.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Terminé:</span>
                        <span className="font-semibold text-green-500">{stat.completed}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">En cours:</span>
                        <span className="font-semibold text-orange-500">{stat.total - stat.completed}</span>
                      </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(stat.completed / stat.total) * 100}%` }}
                          transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Répartition par type */}
                    <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
                      <div className="text-xs text-[var(--text-secondary)] mb-2">Par type:</div>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(stat.byType).map(([type, count]) => (
                          <span
                            key={type}
                            className="px-2 py-1 bg-[var(--overlay-hover)] rounded text-xs text-[var(--text-primary)]"
                          >
                            {type}: {count}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {getMonthlyStats().length === 0 && (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" />
                  <p className="text-[var(--text-secondary)]">Aucune donnée disponible</p>
                </div>
              )}
            </div>

            {/* Statistiques globales */}
            <div className="bg-[var(--card-background)] rounded-2xl p-6 shadow-lg border border-[var(--border-color)]">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3">
                <CalendarIcon className="w-6 h-6 text-blue-500" />
                Vue d'ensemble
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                    {allAppointments.length}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">Total des événements</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    {allAppointments.filter(a => a.isCompleted).length}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">Terminés</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    {allAppointments.filter(a => !a.isCompleted).length}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">En cours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    {Math.round((allAppointments.filter(a => a.isCompleted).length / allAppointments.length) * 100) || 0}%
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">Taux de completion</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Appointment Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => {
              setShowModal(false);
              setEditingAppointment(null);
              setActiveTooltipId(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--card-background)] rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md lg:max-w-2xl shadow-2xl border border-[var(--border-color)] max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <AppointmentForm
                appointment={editingAppointment}
                selectedDate={selectedDate}
                onSubmit={editingAppointment ? handleUpdateAppointment : handleCreateAppointment}
                onCancel={() => {
                  setShowModal(false);
                  setEditingAppointment(null);
                  setActiveTooltipId(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--card-background)] rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md shadow-2xl border border-[var(--border-color)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Supprimer le rendez-vous
                </h3>
              </div>
              <p className="text-[var(--text-secondary)] mb-6">
                Êtes-vous sûr de vouloir supprimer "{deleteAppointment?.title}" ? Cette action est irréversible.
              </p>
              <div className="flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-[var(--overlay-hover)] rounded-lg text-[var(--text-primary)] font-medium hover:bg-[var(--overlay-hover)] transition-colors"
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Supprimer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;

// Appointment Form Component
interface AppointmentFormProps {
  appointment?: Appointment | null;
  selectedDate?: Date | null;
  onSubmit: (data: Appointment) => void;
  onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  selectedDate,
  onSubmit,
  onCancel
}) => {
  // Fonction locale pour normaliser les dates sans décalage de fuseau horaire
  const normalizeDateLocal = (dateString: string): Date => {
    if (dateString.includes('T')) {
      const datePart = dateString.split('T')[0];
      const [year, month, day] = datePart.split('-').map(Number);
      return new Date(year, month - 1, day, 12, 0, 0, 0);
    }
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  };

  // Fonction locale pour convertir une date en string YYYY-MM-DD dans le formulaire
  const dateToLocalStringLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    title: appointment?.title || '',
    description: appointment?.description || '',
    date: appointment?.date ? appointment.date : (selectedDate ? selectedDate : new Date()),
    startTime: appointment?.startTime || '09:00',
    endTime: appointment?.endTime || '10:00',
    location: appointment?.location || '',
    attendees: appointment?.attendees || [], // Provide default empty array
    type: appointment?.type || 'meeting' as const
  });

  const [newAttendee, setNewAttendee] = useState('');

  // Mettre à jour le formulaire quand l'appointment change
  useEffect(() => {
    if (appointment) {
      setFormData({
        title: appointment.title,
        description: appointment.description,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        location: appointment.location,
        attendees: appointment.attendees || [],
        type: appointment.type
      });
    }
  }, [appointment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const appointmentData: Appointment = {
      id: appointment?.id || '',
      ...formData,
      color: '#6366f1' // Couleur par défaut
    };
    onSubmit(appointmentData);
  };

  const addAttendee = () => {
    if (newAttendee.trim() && !formData.attendees.includes(newAttendee.trim())) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, newAttendee.trim()]
      }));
      setNewAttendee('');
    }
  };

  const removeAttendee = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">
          {appointment ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-[var(--overlay-hover)] transition-colors"
        >
          <X className="w-5 h-5 text-[var(--text-secondary)]" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Titre
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-3 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-oxymore-purple"
            required
          />
        </div>

                 <div>
           <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
             Type
           </label>
           <Dropdown
             options={[
               { value: 'meeting', label: 'Réunion', icon: <MessageSquare className="w-4 h-4" /> },
               { value: 'tournament', label: 'Tournoi', icon: <Trophy className="w-4 h-4" /> },
               { value: 'training', label: 'Entraînement', icon: <Target className="w-4 h-4" /> },
               { value: 'other', label: 'Autre', icon: <Zap className="w-4 h-4" /> }
             ]}
             value={formData.type}
             onChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
             placeholder="Sélectionner un type"
           />
         </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Date
          </label>
          <input
            type="date"
            value={formData.date && !isNaN(formData.date.getTime()) ? dateToLocalStringLocal(formData.date) : dateToLocalStringLocal(normalizeDateLocal(dateToLocalStringLocal(new Date())))}
            onChange={(e) => setFormData(prev => ({ ...prev, date: normalizeDateLocal(e.target.value) }))}
            className="w-full p-3 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-oxymore-purple"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Heure début
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              className="w-full p-3 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-oxymore-purple"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Heure fin
            </label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              className="w-full p-3 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-oxymore-purple"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Lieu
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full p-3 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-oxymore-purple"
            placeholder="Salle de réunion, Arena Gaming..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full p-3 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-oxymore-purple resize-none"
          placeholder="Description du rendez-vous..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Participants
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newAttendee}
            onChange={(e) => setNewAttendee(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
            className="flex-1 p-3 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-oxymore-purple"
            placeholder="Ajouter un participant..."
          />
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addAttendee}
            className="px-4 py-3 bg-oxymore-purple text-white rounded-lg font-medium hover:bg-oxymore-purple-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.attendees.map((attendee, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 bg-[var(--overlay-hover)] px-3 py-1 rounded-lg"
            >
              <span className="text-sm text-[var(--text-primary)]">{attendee}</span>
              <button
                type="button"
                onClick={() => removeAttendee(index)}
                className="text-[var(--text-secondary)] hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-[var(--border-color)]">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="px-6 py-2 bg-[var(--overlay-hover)] rounded-lg text-[var(--text-primary)] font-medium hover:bg-[var(--overlay-hover)] transition-colors"
        >
          Annuler
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-gradient-oxymore text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
        >
          {appointment ? 'Modifier' : 'Créer'}
        </motion.button>
      </div>
    </form>
  );
};

