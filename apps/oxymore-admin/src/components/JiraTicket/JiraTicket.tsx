import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Search, X, ExternalLink } from 'lucide-react';

interface JiraTicketType {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  description?: string;
  type?: string;
}

interface JiraTicketProps {
  onInsertTicket: (ticket: JiraTicketType) => void;
  onClose: () => void;
  searchQuery?: string;
}

const JiraTicket: React.FC<JiraTicketProps> = ({
  onInsertTicket,
  onClose,
  searchQuery = ''
}) => {
  const [tickets, setTickets] = useState<JiraTicketType[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<JiraTicketType[]>([]);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [selectedTicket, setSelectedTicket] = useState<JiraTicketType | null>(null);

  // Données de test pour les tickets Jira
  useEffect(() => {
    const mockTickets: JiraTicketType[] = [
      {
        id: 'JIRA-123',
        title: 'Implémenter l\'authentification OAuth',
        status: 'En cours',
        priority: 'Haute',
        assignee: 'John Doe',
        description: 'Ajouter le support OAuth2 pour l\'authentification des utilisateurs',
        type: 'Story'
      },
      {
        id: 'JIRA-456',
        title: 'Créer la page de profil utilisateur',
        status: 'À faire',
        priority: 'Moyenne',
        assignee: 'Jane Smith',
        description: 'Développer l\'interface utilisateur pour la gestion des profils',
        type: 'Task'
      },
      {
        id: 'JIRA-789',
        title: 'Corriger le bug de connexion',
        status: 'Terminé',
        priority: 'Urgente',
        assignee: 'Bob Wilson',
        description: 'Résoudre le problème de timeout lors de la connexion',
        type: 'Bug'
      },
      {
        id: 'JIRA-101',
        title: 'Optimiser les performances de la base de données',
        status: 'En cours',
        priority: 'Haute',
        assignee: 'Alice Brown',
        description: 'Améliorer les requêtes SQL et ajouter des index',
        type: 'Epic'
      },
      {
        id: 'JIRA-202',
        title: 'Ajouter les tests unitaires',
        status: 'À faire',
        priority: 'Moyenne',
        assignee: 'Charlie Davis',
        description: 'Créer une suite de tests pour les composants critiques',
        type: 'Task'
      },
      {
        id: 'JIRA-303',
        title: 'Refonte de l\'interface mobile',
        status: 'En cours',
        priority: 'Haute',
        assignee: 'Diana Prince',
        description: 'Améliorer l\'expérience utilisateur sur mobile',
        type: 'Epic'
      },
      {
        id: 'JIRA-404',
        title: 'Intégration API externe',
        status: 'À faire',
        priority: 'Moyenne',
        assignee: 'Eve Adams',
        description: 'Connecter l\'application à une API tierce',
        type: 'Story'
      }
    ];
    setTickets(mockTickets);
    setFilteredTickets(mockTickets);
  }, []);

  // Filtrer les tickets
  useEffect(() => {
    if (searchInput) {
      const filtered = tickets.filter(ticket =>
        ticket.id.toLowerCase().includes(searchInput.toLowerCase()) ||
        ticket.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        ticket.assignee.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredTickets(filtered);
    } else {
      setFilteredTickets(tickets);
    }
  }, [tickets, searchInput]);

  const getStatusColor = (status: string) => {
    const colors = {
      'À faire': 'text-blue-500 bg-blue-500/10',
      'En cours': 'text-orange-500 bg-orange-500/10',
      'Terminé': 'text-green-500 bg-green-500/10',
      'Bloqué': 'text-red-500 bg-red-500/10'
    };
    return colors[status as keyof typeof colors] || 'text-gray-500 bg-gray-500/10';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'Urgente': 'text-red-500',
      'Haute': 'text-orange-500',
      'Moyenne': 'text-yellow-500',
      'Basse': 'text-green-500'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-500';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Bug': 'text-red-500 bg-red-500/10',
      'Story': 'text-blue-500 bg-blue-500/10',
      'Task': 'text-green-500 bg-green-500/10',
      'Epic': 'text-purple-500 bg-purple-500/10'
    };
    return colors[type as keyof typeof colors] || 'text-gray-500 bg-gray-500/10';
  };

  const handleInsertTicket = (ticket: JiraTicketType) => {
    onInsertTicket(ticket);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-[var(--card-background)] rounded-2xl p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <CheckSquare className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                Référencer un ticket Jira
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Sélectionnez un ticket à insérer dans votre document
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Recherche */}
        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Rechercher un ticket par ID, titre ou assigné..."
            className="w-full pl-10 pr-4 py-3 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[var(--text-primary)]"
            autoFocus
          />
        </div>

        {/* Liste des tickets */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border border-[var(--border-color)] cursor-pointer transition-all duration-200 ${
                  selectedTicket?.id === ticket.id
                    ? 'border-blue-500 bg-blue-500/5'
                    : 'hover:border-blue-500/50 hover:bg-[var(--overlay-hover)]'
                }`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm font-medium text-blue-500">
                        {ticket.id}
                      </span>
                      {ticket.type && (
                        <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(ticket.type)}`}>
                          {ticket.type}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <span className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <h4 className="font-medium text-[var(--text-primary)] mb-1">
                      {ticket.title}
                    </h4>
                    {ticket.description && (
                      <p className="text-sm text-[var(--text-secondary)] mb-2 line-clamp-2">
                        {ticket.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                      <span>Assigné à: {ticket.assignee}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://jira.example.com/browse/${ticket.id}`, '_blank');
                      }}
                      className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
                      title="Ouvrir dans Jira"
                    >
                      <ExternalLink className="w-4 h-4 text-[var(--text-secondary)]" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInsertTicket(ticket);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      Insérer
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <CheckSquare className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
              <h4 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                Aucun ticket trouvé
              </h4>
              <p className="text-[var(--text-secondary)]">
                Essayez de modifier votre recherche ou créez un nouveau ticket.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        {selectedTicket && (
          <div className="mt-6 pt-4 border-t border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[var(--text-secondary)]">
                Ticket sélectionné: <span className="font-medium text-[var(--text-primary)]">{selectedTicket.id}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleInsertTicket(selectedTicket)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Insérer le ticket
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default JiraTicket;
