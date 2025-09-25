-- Table pour les messages privés entre utilisateurs
CREATE TABLE IF NOT EXISTS private_messages (
    id_private_message INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    sender_id VARCHAR(36) NOT NULL,
    receiver_id VARCHAR(36) NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (sender_id) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id_user) ON DELETE CASCADE,

    INDEX idx_sender_receiver (sender_id, receiver_id),
    INDEX idx_receiver_sender (receiver_id, sender_id),
    INDEX idx_sent_at (sent_at),
    INDEX idx_is_read (is_read)
);


