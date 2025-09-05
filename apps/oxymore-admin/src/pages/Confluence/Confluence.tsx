import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Save,
  Eye,
  Edit,
  Trash2,
  Search,
  FileText,
  Calendar,
  User,
  Tag,
  Link,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Image,
  Table,
  CheckSquare
} from 'lucide-react';
import Dropdown from '../../components/Dropdown/Dropdown';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';

// Types pour les documents Confluence
interface ConfluenceDocument {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  category: 'documentation' | 'meeting-notes' | 'procedures' | 'knowledge-base';
}

// Types pour les tickets Jira référencés
interface JiraReference {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
}

const Confluence = () => {
  const [documents, setDocuments] = useState<ConfluenceDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<ConfluenceDocument[]>([]);
  const [currentDocument, setCurrentDocument] = useState<ConfluenceDocument | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<ConfluenceDocument | null>(null);
  const [jiraTickets, setJiraTickets] = useState<JiraReference[]>([]);
  const [showJiraSuggestions, setShowJiraSuggestions] = useState(false);
  const [jiraSearchQuery, setJiraSearchQuery] = useState('');
  const [filteredJiraTickets, setFilteredJiraTickets] = useState<JiraReference[]>([]);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const editorRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Données de test pour les documents
  useEffect(() => {
    const mockDocuments: ConfluenceDocument[] = [
      {
        id: '1',
        title: 'Guide d\'intégration API',
        content: '<h1>Guide d\'intégration API</h1><p>Ce document décrit comment intégrer notre API...</p><p>Référence au ticket #JIRA-123 pour plus de détails.</p>',
        author: 'John Doe',
        tags: ['API', 'Documentation', 'Intégration'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        isPublished: true,
        category: 'documentation'
      },
      {
        id: '2',
        title: 'Notes de réunion - Sprint Planning',
        content: '<h1>Notes de réunion - Sprint Planning</h1><p>Points abordés :</p><ul><li>Priorités du sprint</li><li>Répartition des tâches</li></ul><p>Ticket #JIRA-456 pour le suivi des tâches.</p>',
        author: 'Jane Smith',
        tags: ['Réunion', 'Sprint', 'Planning'],
        createdAt: '2024-01-18T09:00:00Z',
        updatedAt: '2024-01-18T09:00:00Z',
        isPublished: true,
        category: 'meeting-notes'
      }
    ];
    setDocuments(mockDocuments);
    setFilteredDocuments(mockDocuments);
  }, []);

  // Données de test pour les tickets Jira
  useEffect(() => {
    const mockJiraTickets: JiraReference[] = [
      { id: 'JIRA-123', title: 'Implémenter l\'authentification OAuth', status: 'En cours', priority: 'Haute', assignee: 'John Doe' },
      { id: 'JIRA-456', title: 'Créer la page de profil utilisateur', status: 'À faire', priority: 'Moyenne', assignee: 'Jane Smith' },
      { id: 'JIRA-789', title: 'Corriger le bug de connexion', status: 'Terminé', priority: 'Urgente', assignee: 'Bob Wilson' },
      { id: 'JIRA-101', title: 'Optimiser les performances de la base de données', status: 'En cours', priority: 'Haute', assignee: 'Alice Brown' },
      { id: 'JIRA-202', title: 'Ajouter les tests unitaires', status: 'À faire', priority: 'Moyenne', assignee: 'Charlie Davis' }
    ];
    setJiraTickets(mockJiraTickets);
  }, []);

  // Filtrer les documents
  useEffect(() => {
    let filtered = documents;

    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchQuery, selectedCategory]);

  // Filtrer les tickets Jira
  useEffect(() => {
    if (jiraSearchQuery) {
      const filtered = jiraTickets.filter(ticket =>
        ticket.id.toLowerCase().includes(jiraSearchQuery.toLowerCase()) ||
        ticket.title.toLowerCase().includes(jiraSearchQuery.toLowerCase())
      );
      setFilteredJiraTickets(filtered);
    } else {
      setFilteredJiraTickets(jiraTickets);
    }
  }, [jiraTickets, jiraSearchQuery]);

  // Fonctions de l'éditeur
  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertJiraReference = (ticket: JiraReference) => {
    const reference = `#${ticket.id}`;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(reference));
    }
    setShowJiraSuggestions(false);
    setJiraSearchQuery('');
    editorRef.current?.focus();
  };

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    if (currentDocument) {
      setCurrentDocument(prev => prev ? { ...prev, content } : null);
    }

    // Détecter les références Jira
    const text = e.currentTarget.textContent || '';
    const jiraPattern = /#([A-Z]+-\d+)/g;
    const matches = text.match(jiraPattern);

    if (matches && matches.length > 0) {
      const lastMatch = matches[matches.length - 1];
      const ticketId = lastMatch.substring(1);
      const matchingTickets = jiraTickets.filter(ticket =>
        ticket.id.toLowerCase().includes(ticketId.toLowerCase())
      );

      if (matchingTickets.length > 0) {
        setShowJiraSuggestions(true);
        setFilteredJiraTickets(matchingTickets);
      }
    } else {
      setShowJiraSuggestions(false);
    }
  };

  const createNewDocument = () => {
    const newDoc: ConfluenceDocument = {
      id: Date.now().toString(),
      title: 'Nouveau document',
      content: '<h1>Nouveau document</h1><p>Commencez à écrire votre contenu ici...</p>',
      author: 'Utilisateur actuel',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: false,
      category: 'documentation'
    };
    setCurrentDocument(newDoc);
    setIsEditing(true);
    setShowCreateModal(false);
  };

  const saveDocument = () => {
    if (currentDocument) {
      const updatedDoc = {
        ...currentDocument,
        updatedAt: new Date().toISOString()
      };

      setDocuments(prev => {
        const index = prev.findIndex(doc => doc.id === currentDocument.id);
        if (index >= 0) {
          const newDocs = [...prev];
          newDocs[index] = updatedDoc;
          return newDocs;
        } else {
          return [...prev, updatedDoc];
        }
      });

      setCurrentDocument(updatedDoc);
      setIsEditing(false);
    }
  };

  const deleteDocument = (doc: ConfluenceDocument) => {
    setDocumentToDelete(doc);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete.id));
      if (currentDocument?.id === documentToDelete.id) {
        setCurrentDocument(null);
        setIsEditing(false);
      }
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      'documentation': 'Documentation',
      'meeting-notes': 'Notes de réunion',
      'procedures': 'Procédures',
      'knowledge-base': 'Base de connaissances'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'À faire': 'text-blue-500 bg-blue-500/10',
      'En cours': 'text-orange-500 bg-orange-500/10',
      'Terminé': 'text-green-500 bg-green-500/10'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Confluence</h1>
          <p className="text-secondary mt-1">Documentation et base de connaissances</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Nouveau document
        </motion.button>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher dans les documents..."
            className="input-base w-full pl-10"
          />
        </div>

        <Dropdown
          options={[
            { value: 'all', label: 'Toutes les catégories' },
            { value: 'documentation', label: 'Documentation' },
            { value: 'meeting-notes', label: 'Notes de réunion' },
            { value: 'procedures', label: 'Procédures' },
            { value: 'knowledge-base', label: 'Base de connaissances' }
          ]}
          value={selectedCategory}
          onChange={setSelectedCategory}
          placeholder="Filtrer par catégorie"
          className="w-48"
        />
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des documents */}
        <div className="lg:col-span-1">
          <div className="card-base p-4">
            <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Documents ({filteredDocuments.length})
            </h3>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredDocuments.map((doc) => (
                <motion.div
                  key={doc.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    currentDocument?.id === doc.id
                      ? 'bg-oxymore-purple text-white'
                      : 'hover:bg-[var(--overlay-hover)]'
                  }`}
                  onClick={() => {
                    setCurrentDocument(doc);
                    setIsEditing(false);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium truncate ${
                        currentDocument?.id === doc.id ? 'text-white' : 'text-primary'
                      }`}>
                        {doc.title}
                      </h4>
                      <p className={`text-xs mt-1 ${
                        currentDocument?.id === doc.id ? 'text-white/80' : 'text-secondary'
                      }`}>
                        {getCategoryLabel(doc.category)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs ${
                          currentDocument?.id === doc.id ? 'text-white/70' : 'text-muted'
                        }`}>
                          {new Date(doc.updatedAt).toLocaleDateString('fr-FR')}
                        </span>
                        {doc.isPublished && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            currentDocument?.id === doc.id
                              ? 'bg-white/20 text-white'
                              : 'bg-green-500/10 text-green-500'
                          }`}>
                            Publié
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentDocument(doc);
                          setIsEditing(true);
                        }}
                        className={`p-1 rounded ${
                          currentDocument?.id === doc.id
                            ? 'hover:bg-white/20'
                            : 'hover:bg-[var(--overlay-hover)]'
                        }`}
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDocument(doc);
                        }}
                        className={`p-1 rounded ${
                          currentDocument?.id === doc.id
                            ? 'hover:bg-white/20'
                            : 'hover:bg-red-500/10 hover:text-red-400'
                        }`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Éditeur/Visualiseur */}
        <div className="lg:col-span-2">
          {currentDocument ? (
            <div className="card-base p-6">
              {/* Barre d'outils */}
              {isEditing && (
                <div className="border-b border-[var(--border-color)] pb-4 mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Boutons de formatage */}
                    <button
                      onClick={() => execCommand('bold')}
                      className="p-2 hover:bg-[var(--overlay-hover)] rounded"
                      title="Gras"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => execCommand('italic')}
                      className="p-2 hover:bg-[var(--overlay-hover)] rounded"
                      title="Italique"
                    >
                      <Italic className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-[var(--border-color)]" />

                    <button
                      onClick={() => execCommand('insertUnorderedList')}
                      className="p-2 hover:bg-[var(--overlay-hover)] rounded"
                      title="Liste à puces"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => execCommand('insertOrderedList')}
                      className="p-2 hover:bg-[var(--overlay-hover)] rounded"
                      title="Liste numérotée"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-[var(--border-color)]" />

                    <button
                      onClick={() => execCommand('formatBlock', '<h1>')}
                      className="p-2 hover:bg-[var(--overlay-hover)] rounded"
                      title="Titre 1"
                    >
                      <Heading1 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => execCommand('formatBlock', '<h2>')}
                      className="p-2 hover:bg-[var(--overlay-hover)] rounded"
                      title="Titre 2"
                    >
                      <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => execCommand('formatBlock', '<h3>')}
                      className="p-2 hover:bg-[var(--overlay-hover)] rounded"
                      title="Titre 3"
                    >
                      <Heading3 className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-[var(--border-color)]" />

                    <button
                      onClick={() => execCommand('justifyLeft')}
                      className="p-2 hover:bg-[var(--overlay-hover)] rounded"
                      title="Aligner à gauche"
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => execCommand('justifyCenter')}
                      className="p-2 hover:bg-[var(--overlay-hover)] rounded"
                      title="Centrer"
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => execCommand('justifyRight')}
                      className="p-2 hover:bg-[var(--overlay-hover)] rounded"
                      title="Aligner à droite"
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-[var(--border-color)]" />

                    <button
                      onClick={() => execCommand('insertQuote')}
                      className="p-2 hover:bg-[var(--overlay-hover)] rounded"
                      title="Citation"
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => execCommand('insertCode')}
                      className="p-2 hover:bg-[var(--overlay-hover)] rounded"
                      title="Code"
                    >
                      <Code className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-[var(--border-color)]" />

                    <button
                      onClick={() => setShowJiraSuggestions(!showJiraSuggestions)}
                      className="p-2 hover:bg-[var(--overlay-hover)] rounded"
                      title="Référencer un ticket Jira"
                    >
                      <CheckSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={saveDocument}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Sauvegarder
                      </motion.button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="text-secondary hover:text-primary px-4 py-2 rounded-lg font-medium"
                      >
                        Annuler
                      </button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className="bg-oxymore-purple text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </motion.button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-secondary">
                  <User className="w-4 h-4" />
                  {currentDocument.author}
                  <Calendar className="w-4 h-4" />
                  {new Date(currentDocument.updatedAt).toLocaleDateString('fr-FR')}
                </div>
              </div>

              {/* Suggestions Jira */}
              {showJiraSuggestions && isEditing && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Référencer un ticket Jira</h4>
                  <input
                    type="text"
                    value={jiraSearchQuery}
                    onChange={(e) => setJiraSearchQuery(e.target.value)}
                    placeholder="Rechercher un ticket..."
                    className="w-full p-2 border border-blue-300 rounded mb-2"
                    ref={searchInputRef}
                  />
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {filteredJiraTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="p-2 hover:bg-blue-100 rounded cursor-pointer"
                        onClick={() => insertJiraReference(ticket)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-blue-800">{ticket.id}</span>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-sm text-blue-600 truncate">{ticket.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                          <span className="text-xs text-blue-600">{ticket.assignee}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Éditeur/Visualiseur */}
              <div className="min-h-[500px]">
                {isEditing ? (
                  <div
                    ref={editorRef}
                    contentEditable
                    className="prose prose-sm max-w-none min-h-[500px] p-4 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-oxymore-purple focus:border-transparent"
                    dangerouslySetInnerHTML={{ __html: currentDocument.content }}
                    onInput={handleEditorInput}
                    suppressContentEditableWarning
                  />
                ) : (
                  <div
                    className="prose prose-sm max-w-none min-h-[500px] p-4 bg-[var(--hover-background)] rounded-lg"
                    dangerouslySetInnerHTML={{ __html: currentDocument.content }}
                  />
                )}
              </div>

              {/* Tags */}
              <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                <h4 className="font-medium text-primary mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentDocument.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[var(--overlay-hover)] text-xs rounded-full text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card-base p-6 text-center">
              <FileText className="w-16 h-16 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-primary mb-2">Aucun document sélectionné</h3>
              <p className="text-secondary mb-4">
                Sélectionnez un document dans la liste ou créez-en un nouveau pour commencer.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="bg-oxymore-purple text-white px-4 py-2 rounded-lg font-medium"
              >
                Créer un document
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--card-background)] rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-primary mb-4">Créer un nouveau document</h3>
            <p className="text-secondary mb-6">
              Choisissez une catégorie pour votre nouveau document.
            </p>
            <div className="space-y-3">
              {[
                { value: 'documentation', label: 'Documentation', icon: FileText, color: 'bg-blue-500' },
                { value: 'meeting-notes', label: 'Notes de réunion', icon: Calendar, color: 'bg-green-500' },
                { value: 'procedures', label: 'Procédures', icon: List, color: 'bg-orange-500' },
                { value: 'knowledge-base', label: 'Base de connaissances', icon: Tag, color: 'bg-purple-500' }
              ].map((category) => (
                <button
                  key={category.value}
                  onClick={() => {
                    setShowCreateModal(false);
                    const newDoc: ConfluenceDocument = {
                      id: Date.now().toString(),
                      title: 'Nouveau document',
                      content: '<h1>Nouveau document</h1><p>Commencez à écrire votre contenu ici...</p>',
                      author: 'Utilisateur actuel',
                      tags: [],
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      isPublished: false,
                      category: category.value as ConfluenceDocument['category']
                    };
                    setCurrentDocument(newDoc);
                    setIsEditing(true);
                  }}
                  className="w-full p-4 rounded-lg border border-[var(--border-color)] hover:border-oxymore-purple transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary">{category.label}</h4>
                      <p className="text-sm text-secondary">
                        {category.value === 'documentation' && 'Documentation technique et guides'}
                        {category.value === 'meeting-notes' && 'Notes et comptes-rendus de réunions'}
                        {category.value === 'procedures' && 'Procédures et processus'}
                        {category.value === 'knowledge-base' && 'Base de connaissances partagée'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-secondary hover:text-primary"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suppression */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDocumentToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Supprimer le document"
        message={`Êtes-vous sûr de vouloir supprimer le document "${documentToDelete?.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </div>
  );
};

export default Confluence;
