-- Migration pour créer les tables du système de calendrier
-- Date: 2024-12-19

-- Table des rendez-vous (simplifiée)
CREATE TABLE IF NOT EXISTS calendar_appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255),
    type ENUM('meeting', 'training', 'tournament', 'league', 'other') NOT NULL DEFAULT 'other',
    is_completed BOOLEAN DEFAULT FALSE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES user(id_user) ON DELETE CASCADE,

    INDEX idx_appointment_date (appointment_date),
    INDEX idx_type (type),
    INDEX idx_created_by (created_by),
    INDEX idx_is_completed (is_completed)
);

-- Table des participants aux rendez-vous
CREATE TABLE IF NOT EXISTS calendar_appointment_participants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (appointment_id) REFERENCES calendar_appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id_user) ON DELETE CASCADE,

    UNIQUE KEY unique_participant (appointment_id, user_id),
    INDEX idx_appointment_id (appointment_id),
    INDEX idx_user_id (user_id)
);

-- Table des invités externes
CREATE TABLE IF NOT EXISTS calendar_appointment_guests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (appointment_id) REFERENCES calendar_appointments(id) ON DELETE CASCADE,

    INDEX idx_appointment_id (appointment_id)
);
