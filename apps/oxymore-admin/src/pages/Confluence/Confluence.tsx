import { useState, useEffect } from 'react';
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
  CheckSquare,
  Folder,
  Upload,
  Download,
  Settings,
  Share
} from 'lucide-react';
import Dropdown from '../../components/Dropdown/Dropdown';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';
import JiraTicket from '../../components/JiraTicket/JiraTicket';
import FolderManager from '../../components/FolderManager/FolderManager';

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
  category: 'documentation' | 'meeting-notes' | 'procedures' | 'knowledge-base' | 'reunion' | 'formation';
  folderId?: string;
  jiraReferences?: string[];
}

// Types pour les dossiers
interface Folder {
  id: string;
  name: string;
  parentId?: string;
  documents: ConfluenceDocument[];
  createdAt: string;
}

// Types pour les tickets Jira référencés
interface JiraReference {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  description?: string;
  type?: string;
}

const Confluence = () => {
  const [documents, setDocuments] = useState<ConfluenceDocument[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<ConfluenceDocument[]>([]);
  const [currentDocument, setCurrentDocument] = useState<ConfluenceDocument | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<ConfluenceDocument | null>(null);
  const [showJiraModal, setShowJiraModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'folder'>('folder');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Données de test pour les documents et dossiers
  useEffect(() => {
    const mockFolders: Folder[] = [
      {
        id: 'folder-1',
        name: 'Documentation Technique',
        documents: [],
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'folder-2',
        name: 'Réunions',
        documents: [],
        createdAt: '2024-01-18T09:00:00Z'
      },
      {
        id: 'folder-3',
        name: 'Procédures',
        documents: [],
        createdAt: '2024-01-20T14:30:00Z'
      }
    ];

    const mockDocuments: ConfluenceDocument[] = [
      {
        id: '1',
        title: 'Guide d\'intégration API',
        content: '<h1>Guide d\'intégration API</h1><p>Ce document décrit comment intégrer notre API...</p><p>Référence au ticket <a href="#" class="jira-reference">#JIRA-123</a> pour plus de détails.</p>',
        author: 'John Doe',
        tags: ['API', 'Documentation', 'Intégration'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        isPublished: true,
        category: 'documentation',
        folderId: 'folder-1',
        jiraReferences: ['JIRA-123']
      },
      {
        id: '2',
        title: 'Notes de réunion - Sprint Planning',
        content: '<h1>Notes de réunion - Sprint Planning</h1><p>Points abordés :</p><ul><li>Priorités du sprint</li><li>Répartition des tâches</li></ul><p>Ticket <a href="#" class="jira-reference">#JIRA-456</a> pour le suivi des tâches.</p>',
        author: 'Jane Smith',
        tags: ['Réunion', 'Sprint', 'Planning'],
        createdAt: '2024-01-18T09:00:00Z',
        updatedAt: '2024-01-18T09:00:00Z',
        isPublished: true,
        category: 'reunion',
        folderId: 'folder-2',
        jiraReferences: ['JIRA-456']
      },
      {
        id: '3',
        title: 'Procédure de déploiement',
        content: '<h1>Procédure de déploiement</h1><p>Cette procédure décrit les étapes pour déployer l\'application...</p>',
        author: 'Bob Wilson',
        tags: ['Déploiement', 'Procédure', 'DevOps'],
        createdAt: '2024-01-20T14:30:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        isPublished: true,
        category: 'procedures',
        folderId: 'folder-3',
        jiraReferences: []
      }
    ];

    setFolders(mockFolders);
    setDocuments(mockDocuments);
    setFilteredDocuments(mockDocuments);
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

    if (selectedFolderId) {
      filtered = filtered.filter(doc => doc.folderId === selectedFolderId);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchQuery, selectedCategory, selectedFolderId]);

  // Fonctions principales
  const handleContentChange = (content: string) => {
    if (currentDocument) {
      setCurrentDocument(prev => prev ? { ...prev, content } : null);
    }
  };

  const handleInsertJiraTicket = (ticket: JiraReference) => {
    if (currentDocument) {
      const ticketReference = `<a href="#" class="jira-reference" data-ticket-id="${ticket.id}">#${ticket.id}</a>`;
      const updatedContent = currentDocument.content + ' ' + ticketReference;
      setCurrentDocument(prev => prev ? { 
        ...prev, 
        content: updatedContent,
        jiraReferences: [...(prev.jiraReferences || []), ticket.id]
      } : null);
    }
  };

  const createNewDocument = (category: ConfluenceDocument['category'] = 'documentation') => {
    const newDoc: ConfluenceDocument = {
      id: Date.now().toString(),
      title: 'Nouveau document',
      content: '<h1>Nouveau document</h1><p>Commencez à écrire votre contenu ici...</p>',
      author: 'Utilisateur actuel',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: false,
      category,
      folderId: selectedFolderId || undefined,
      jiraReferences: []
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

  const handleFolderDocumentsChange = (folderDocuments: any[]) => {
    // Cette fonction sera utilisée par le FolderManager
    // Pour l'instant, on ne l'implémente pas complètement
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      'documentation': 'Documentation',
      'meeting-notes': 'Notes de réunion',
      'procedures': 'Procédures',
      'knowledge-base': 'Base de connaissances',
      'reunion': 'Réunion',
      'formation': 'Formation'
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

        <div className="flex items-center gap-3">
          {/* Bouton de changement de vue */}
          <div className="flex bg-[var(--background-secondary)] rounded-lg p-1">
            <button
              onClick={() => setViewMode('folder')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                viewMode === 'folder'
                  ? 'bg-[var(--overlay-active)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Folder className="w-4 h-4 inline mr-1" />
              Dossiers
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                viewMode === 'list'
                  ? 'bg-[var(--overlay-active)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-1" />
              Liste
            </button>
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
            { value: 'knowledge-base', label: 'Base de connaissances' },
            { value: 'reunion', label: 'Réunion' },
            { value: 'formation', label: 'Formation' }
          ]}
          value={selectedCategory}
          onChange={setSelectedCategory}
          placeholder="Filtrer par catégorie"
          className="w-48"
        />

        {viewMode === 'folder' && (
          <Dropdown
            options={[
              { value: '', label: 'Tous les dossiers' },
              ...folders.map(folder => ({ value: folder.id, label: folder.name }))
            ]}
            value={selectedFolderId || ''}
            onChange={(value) => setSelectedFolderId(value || null)}
            placeholder="Filtrer par dossier"
            className="w-48"
          />
        )}
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panneau latéral */}
        <div className="lg:col-span-1">
          <div className="card-base p-4">
            <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
              {viewMode === 'folder' ? (
                <>
                  <Folder className="w-5 h-5" />
                  Dossiers & Documents ({filteredDocuments.length})
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Documents ({filteredDocuments.length})
                </>
              )}
            </h3>

            {viewMode === 'folder' ? (
              <FolderManager
                documents={filteredDocuments.map(doc => ({
                  id: doc.id,
                  name: doc.title,
                  type: 'document' as const,
                  parentId: doc.folderId,
                  category: doc.category,
                  lastModified: doc.updatedAt
                }))}
                onDocumentsChange={handleFolderDocumentsChange}
                onDocumentSelect={(item) => {
                  const doc = documents.find(d => d.id === item.id);
                  if (doc) {
                    setCurrentDocument(doc);
                    setIsEditing(false);
                  }
                }}
                selectedDocumentId={currentDocument?.id}
              />
            ) : (
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
            )}
          </div>
        </div>

        {/* Éditeur/Visualiseur */}
        <div className="lg:col-span-2">
          {currentDocument ? (
            <div className="card-base p-6">

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
                      <button
                        onClick={() => setShowJiraModal(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                      >
                        <CheckSquare className="w-4 h-4" />
                        Ticket Jira
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

                <div className="flex items-center gap-4 text-sm text-secondary">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {currentDocument.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(currentDocument.updatedAt).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {getCategoryLabel(currentDocument.category)}
                  </div>
                  {currentDocument.isPublished && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Publié
                    </div>
                  )}
                </div>
              </div>

              {/* Éditeur/Visualiseur */}
              <div className="min-h-[500px]">
                {isEditing ? (
                  <RichTextEditor
                    content={currentDocument.content}
                    onChange={handleContentChange}
                    placeholder="Commencez à écrire votre document..."
                    className="min-h-[500px]"
                  />
                ) : (
                  <div
                    className="prose prose-sm max-w-none min-h-[500px] p-4 bg-[var(--hover-background)] rounded-lg"
                    dangerouslySetInnerHTML={{ __html: currentDocument.content }}
                  />
                )}
              </div>

              {/* Tags et Références */}
              <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tags */}
                  <div>
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

                  {/* Références Jira */}
                  {currentDocument.jiraReferences && currentDocument.jiraReferences.length > 0 && (
                    <div>
                      <h4 className="font-medium text-primary mb-2 flex items-center gap-2">
                        <CheckSquare className="w-4 h-4" />
                        Tickets Jira référencés
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentDocument.jiraReferences.map((ticketId, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full border border-blue-500/20"
                          >
                            #{ticketId}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
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

      {/* Modal Jira */}
      {showJiraModal && (
        <JiraTicket
          onInsertTicket={handleInsertJiraTicket}
          onClose={() => setShowJiraModal(false)}
        />
      )}

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
                { value: 'procedures', label: 'Procédures', icon: Settings, color: 'bg-orange-500' },
                { value: 'knowledge-base', label: 'Base de connaissances', icon: Tag, color: 'bg-purple-500' },
                { value: 'reunion', label: 'Réunion', icon: Calendar, color: 'bg-indigo-500' },
                { value: 'formation', label: 'Formation', icon: Download, color: 'bg-pink-500' }
              ].map((category) => (
                <button
                  key={category.value}
                  onClick={() => createNewDocument(category.value as ConfluenceDocument['category'])}
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
                        {category.value === 'reunion' && 'Comptes-rendus et notes de réunions'}
                        {category.value === 'formation' && 'Documents de formation et tutoriels'}
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
