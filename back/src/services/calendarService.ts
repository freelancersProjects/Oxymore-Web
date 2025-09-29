import { db } from "../config/db";
import { CreateAppointmentData, UpdateAppointmentData, CalendarFilters } from '../interfaces/calendarInterfaces';

export class CalendarService {
  // Récupérer tous les types de rendez-vous (simplifié)
  static async getAppointmentTypes() {
    // Retourner les types prédéfinis
    return [
      { value: 'meeting', label: 'Réunion', color: 'bg-purple-500', icon: 'Users' },
      { value: 'training', label: 'Entraînement', color: 'bg-green-500', icon: 'Dumbbell' },
      { value: 'tournament', label: 'Tournoi', color: 'bg-red-500', icon: 'Trophy' },
      { value: 'league', label: 'Ligue', color: 'bg-orange-500', icon: 'Award' },
      { value: 'other', label: 'Autre', color: 'bg-blue-500', icon: 'Calendar' }
    ];
  }

  // Récupérer tous les rendez-vous avec filtres
  static async getAppointments(filters: CalendarFilters = {}) {
    let query = `
      SELECT
        ca.*,
        u.username as created_by_username
      FROM calendar_appointments ca
      LEFT JOIN user u ON ca.created_by = u.id_user
      WHERE 1=1
    `;

    const params: any[] = [];

    if (filters.type) {
      query += ' AND ca.type = ?';
      params.push(filters.type);
    }

    if (filters.is_completed !== undefined) {
      query += ' AND ca.is_completed = ?';
      params.push(filters.is_completed);
    }

    if (filters.date_from) {
      query += ' AND ca.appointment_date >= ?';
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      query += ' AND ca.appointment_date <= ?';
      params.push(filters.date_to);
    }

    if (filters.search) {
      query += ' AND (ca.title LIKE ? OR ca.description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.created_by) {
      query += ' AND ca.created_by = ?';
      params.push(filters.created_by);
    }

    query += ' ORDER BY ca.appointment_date ASC, ca.start_time ASC';

    const [rows] = await db.execute(query, params);
    return rows;
  }

  // Récupérer un rendez-vous par ID
  static async getAppointmentById(id: number) {
    const [appointmentRows] = await db.execute(
      `SELECT
        ca.*,
        u.username as created_by_username
      FROM calendar_appointments ca
      LEFT JOIN user u ON ca.created_by = u.id_user
      WHERE ca.id = ?`,
      [id]
    );

    if ((appointmentRows as any[]).length === 0) {
      return null;
    }

    const appointment = (appointmentRows as any[])[0];

    // Récupérer les participants
    const [participantsRows] = await db.execute(
      `SELECT
        cap.*,
        u.username,
        u.email,
        u.avatar_url
      FROM calendar_appointment_participants cap
      LEFT JOIN user u ON cap.user_id = u.id_user
      WHERE cap.appointment_id = ?`,
      [id]
    );

    // Récupérer les invités
    const [guestsRows] = await db.execute(
      'SELECT * FROM calendar_appointment_guests WHERE appointment_id = ?',
      [id]
    );

    return {
      ...appointment,
      participants: participantsRows,
      guests: guestsRows
    };
  }

  // Créer un nouveau rendez-vous
  static async createAppointment(data: CreateAppointmentData, createdBy: number) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Créer le rendez-vous principal
      const [result] = await connection.execute(
        `INSERT INTO calendar_appointments
         (title, description, appointment_date, start_time, end_time, location, type, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.title,
          data.description || null,
          data.appointment_date,
          data.start_time,
          data.end_time,
          data.location || null,
          data.type,
          createdBy
        ]
      );

      const appointmentId = (result as any).insertId;

      // Ajouter les participants
      if (data.participants && data.participants.length > 0) {
        const participantValues = data.participants.map(userId =>
          [appointmentId, userId]
        );

        await connection.execute(
          `INSERT INTO calendar_appointment_participants
           (appointment_id, user_id)
           VALUES ?`,
          [participantValues]
        );
      }

      // Ajouter les invités
      if (data.guests && data.guests.length > 0) {
        const guestValues = data.guests.map(guest =>
          [appointmentId, guest.name, guest.email || null]
        );

        await connection.execute(
          `INSERT INTO calendar_appointment_guests
           (appointment_id, name, email)
           VALUES ?`,
          [guestValues]
        );
      }

      await connection.commit();
      return appointmentId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Mettre à jour un rendez-vous
  static async updateAppointment(id: number, data: UpdateAppointmentData, updatedBy: number) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Vérifier que le rendez-vous existe et que l'utilisateur peut le modifier
      const [existingRows] = await connection.execute(
        'SELECT created_by FROM calendar_appointments WHERE id = ?',
        [id]
      );

      if ((existingRows as any[]).length === 0) {
        throw new Error('Rendez-vous non trouvé');
      }

      const appointment = (existingRows as any[])[0];
      if (appointment.created_by !== updatedBy) {
        throw new Error('Vous n\'êtes pas autorisé à modifier ce rendez-vous');
      }

      // Mettre à jour le rendez-vous principal
      const updateFields = [];
      const updateValues = [];

      if (data.title !== undefined) {
        updateFields.push('title = ?');
        updateValues.push(data.title);
      }
      if (data.description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(data.description);
      }
      if (data.appointment_date !== undefined) {
        updateFields.push('appointment_date = ?');
        updateValues.push(data.appointment_date);
      }
      if (data.start_time !== undefined) {
        updateFields.push('start_time = ?');
        updateValues.push(data.start_time);
      }
      if (data.end_time !== undefined) {
        updateFields.push('end_time = ?');
        updateValues.push(data.end_time);
      }
      if (data.location !== undefined) {
        updateFields.push('location = ?');
        updateValues.push(data.location);
      }
      if (data.type !== undefined) {
        updateFields.push('type = ?');
        updateValues.push(data.type);
      }
      if (data.is_completed !== undefined) {
        updateFields.push('is_completed = ?');
        updateValues.push(data.is_completed);
      }

      if (updateFields.length > 0) {
        updateValues.push(id);
        await connection.execute(
          `UPDATE calendar_appointments SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
      }

      // Mettre à jour les participants si fournis
      if (data.participants !== undefined) {
        // Supprimer les anciens participants
        await connection.execute(
          'DELETE FROM calendar_appointment_participants WHERE appointment_id = ?',
          [id]
        );

        // Ajouter les nouveaux participants
        if (data.participants.length > 0) {
          const participantValues = data.participants.map(userId =>
            [id, userId]
          );

          await connection.execute(
            `INSERT INTO calendar_appointment_participants
             (appointment_id, user_id)
             VALUES ?`,
            [participantValues]
          );
        }
      }

      // Mettre à jour les invités si fournis
      if (data.guests !== undefined) {
        // Supprimer les anciens invités
        await connection.execute(
          'DELETE FROM calendar_appointment_guests WHERE appointment_id = ?',
          [id]
        );

        // Ajouter les nouveaux invités
        if (data.guests.length > 0) {
          const guestValues = data.guests.map(guest =>
            [id, guest.name, guest.email || null]
          );

          await connection.execute(
            `INSERT INTO calendar_appointment_guests
             (appointment_id, name, email)
             VALUES ?`,
            [guestValues]
          );
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Supprimer un rendez-vous
  static async deleteAppointment(id: number, deletedBy: number) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Vérifier que le rendez-vous existe et que l'utilisateur peut le supprimer
      const [existingRows] = await connection.execute(
        'SELECT created_by FROM calendar_appointments WHERE id = ?',
        [id]
      );

      if ((existingRows as any[]).length === 0) {
        throw new Error('Rendez-vous non trouvé');
      }

      const appointment = (existingRows as any[])[0];
      if (appointment.created_by !== deletedBy) {
        throw new Error('Vous n\'êtes pas autorisé à supprimer ce rendez-vous');
      }

      // Supprimer le rendez-vous (les contraintes CASCADE supprimeront les relations)
      await connection.execute(
        'DELETE FROM calendar_appointments WHERE id = ?',
        [id]
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Récupérer les statistiques du calendrier
  static async getCalendarStats(userId?: number) {
    let whereClause = '';
    const params: any[] = [];

    if (userId) {
      whereClause = 'WHERE ca.created_by = ?';
      params.push(userId);
    }

    const [statsRows] = await db.execute(`
      SELECT
        COUNT(*) as total_appointments,
        SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) as completed_appointments,
        SUM(CASE WHEN is_completed = 0 THEN 1 ELSE 0 END) as pending_appointments
      FROM calendar_appointments ca
      ${whereClause}
    `, params);

    const [typeStatsRows] = await db.execute(`
      SELECT
        type,
        COUNT(*) as count
      FROM calendar_appointments ca
      ${whereClause}
      GROUP BY type
      ORDER BY count DESC
    `, params);

    const [monthStatsRows] = await db.execute(`
      SELECT
        DATE_FORMAT(appointment_date, '%Y-%m') as month,
        COUNT(*) as count
      FROM calendar_appointments ca
      ${whereClause}
      GROUP BY DATE_FORMAT(appointment_date, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `, params);

    return {
      ...(statsRows as any[])[0],
      appointments_by_type: typeStatsRows,
      appointments_by_month: monthStatsRows
    };
  }
}
