import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Save,
  Edit,
  Trash2,
  Search,
  FileText,
  Calendar,
  User,
  Tag,
  CheckSquare,
  Folder,
  Download,
  Settings,
  Upload,
  File,
  FolderPlus,
  MoreVertical,
  Copy,
  Move,
  Share,
  Eye,
  EyeOff,
  Star,
  Archive,
  RefreshCw
} from 'lucide-react';
import Dropdown from '../../components/Dropdown/Dropdown';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';
import './Confluence.css';

// Types pour les documents et fichiers
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
  type: 'document' | 'file';
  fileSize?: number;
  fileType?: string;
  isStarred?: boolean;
  isArchived?: boolean;
}

// Types pour les dossiers
interface Folder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  color?: string;
  icon?: string;
  isStarred?: boolean;
  isArchived?: boolean;
  description?: string;
}

// Types pour les fichiers uploadés
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  folderId?: string;
  uploadedAt: string;
}

const Confluence: React.FC = () => {
  const [documents, setDocuments] = useState<ConfluenceDocument[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [filteredItems, setFilteredItems] = useState<(ConfluenceDocument | UploadedFile)[]>([]);
  const [currentDocument, setCurrentDocument] = useState<ConfluenceDocument | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ConfluenceDocument | UploadedFile | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Données de test
  useEffect(() => {
    const mockFolders: Folder[] = [
      {
        id: 'folder-1',
        name: 'Documentation Technique',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        color: '#3b82f6',
        icon: '📚',
        description: 'Documentation technique et guides'
      },
      {
        id: 'folder-2',
        name: 'Réunions',
        createdAt: '2024-01-18T09:00:00Z',
        updatedAt: '2024-01-18T09:00:00Z',
        color: '#10b981',
        icon: '🤝',
        description: 'Notes et comptes-rendus de réunions'
      },
      {
        id: 'folder-3',
        name: 'Procédures',
        createdAt: '2024-01-20T14:30:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        color: '#f59e0b',
        icon: '⚙️',
        description: 'Procédures et processus'
      }
    ];

    const mockDocuments: ConfluenceDocument[] = [
      {
        id: '1',
        title: 'Guide d\'intégration API',
        content: '<h1>Guide d\'intégration API</h1><p>Ce document décrit comment intégrer notre API...</p>',
        author: 'John Doe',
        tags: ['API', 'Documentation', 'Intégration'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        isPublished: true,
        category: 'documentation',
        folderId: 'folder-1',
        jiraReferences: ['JIRA-123'],
        type: 'document',
        isStarred: true
      },
      {
        id: '2',
        title: 'Notes de réunion - Sprint Planning',
        content: '<h1>Notes de réunion - Sprint Planning</h1><p>Points abordés...</p>',
        author: 'Jane Smith',
        tags: ['Réunion', 'Sprint', 'Planning'],
        createdAt: '2024-01-18T09:00:00Z',
        updatedAt: '2024-01-18T09:00:00Z',
        isPublished: true,
        category: 'reunion',
        folderId: 'folder-2',
        jiraReferences: ['JIRA-456'],
        type: 'document'
      }
    ];

    setFolders(mockFolders);
    setDocuments(mockDocuments);
  }, []);

  // Filtrer les éléments
  useEffect(() => {
    let filtered = [...documents, ...uploadedFiles];

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.type === 'document' && (item as ConfluenceDocument).content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.type === 'document' && (item as ConfluenceDocument).tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item =>
        item.type === 'document' && (item as ConfluenceDocument).category === selectedCategory
      );
    }

    if (selectedFolderId) {
      filtered = filtered.filter(item => item.folderId === selectedFolderId);
    }

    setFilteredItems(filtered);
  }, [documents, uploadedFiles, searchQuery, selectedCategory, selectedFolderId]);

  // Fonctions principales
  const handleContentChange = (content: string) => {
    if (currentDocument) {
      setCurrentDocument(prev => prev ? { ...prev, content } : null);
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
      jiraReferences: [],
      type: 'document'
    };
    setCurrentDocument(newDoc);
    setIsEditing(true);
    setShowCreateModal(false);
  };

  const createNewFolder = (name: string, color: string, icon: string, description: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color,
      icon,
      description,
      parentId: selectedFolderId || undefined
    };
    setFolders(prev => [...prev, newFolder]);
    setShowFolderModal(false);
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

  const deleteItem = (item: ConfluenceDocument | UploadedFile) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'document') {
        setDocuments(prev => prev.filter(doc => doc.id !== itemToDelete.id));
        if (currentDocument?.id === itemToDelete.id) {
          setCurrentDocument(null);
          setIsEditing(false);
        }
      } else {
        setUploadedFiles(prev => prev.filter(file => file.id !== itemToDelete.id));
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleFileUpload = (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      folderId: selectedFolderId || undefined,
      uploadedAt: new Date().toISOString()
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setShowUploadModal(false);
  };

  const toggleStar = (item: ConfluenceDocument | UploadedFile) => {
    if (item.type === 'document') {
      setDocuments(prev => prev.map(doc =>
        doc.id === item.id ? { ...doc, isStarred: !doc.isStarred } : doc
      ));
    }
  };

  const moveToFolder = (itemId: string, folderId: string | null) => {
    setDocuments(prev => prev.map(doc =>
      doc.id === itemId ? { ...doc, folderId } : doc
    ));
    setUploadedFiles(prev => prev.map(file =>
      file.id === itemId ? { ...file, folderId } : file
    ));
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    setDragOverFolder(folderId);
  };

  const handleDragLeave = () => {
    setDragOverFolder(null);
  };

  const handleDrop = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    if (draggedItem) {
      moveToFolder(draggedItem, folderId);
    }
    setDragOverFolder(null);
    setDraggedItem(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  return (
    <div className="min-h-screen bg-[var(--background)] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-xl">
                <FileText className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Confluence</h1>
                <p className="text-[var(--text-secondary)]">Gestion de documents et fichiers</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Bouton de changement de vue */}
              <div className="flex bg-[var(--card-background)] rounded-lg p-1 border border-[var(--border-color)]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                    viewMode === 'grid'
                      ? 'bg-green-500 text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Folder className="w-4 h-4" />
                  Grille
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                    viewMode === 'list'
                      ? 'bg-green-500 text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Liste
                </button>
              </div>

              {/* Boutons d'action */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFolderModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FolderPlus className="w-4 h-4" />
                Nouveau dossier
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUploadModal(true)}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Upload className="w-4 h-4" />
                Upload
              </motion.button>

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
        </div>

        {/* Filtres */}
        <div className="bg-[var(--card-background)] rounded-2xl p-4 mb-6 shadow-lg border border-[var(--border-color)]">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher dans les documents et fichiers..."
                className="w-full pl-10 pr-4 py-2 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-green-500"
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
          </div>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panneau latéral - Dossiers */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--card-background)] rounded-2xl p-4 shadow-lg border border-[var(--border-color)]">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Folder className="w-5 h-5" />
                Dossiers ({folders.length})
              </h3>

              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedFolderId(null)}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                    selectedFolderId === null
                      ? 'bg-green-500 text-white'
                      : 'hover:bg-[var(--overlay-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Folder className="w-5 h-5" />
                    <span className="font-medium">Tous les fichiers</span>
                  </div>
                </motion.button>

                {folders.map((folder) => (
                  <motion.div
                    key={folder.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                      selectedFolderId === folder.id
                        ? 'bg-green-500 text-white'
                        : 'hover:bg-[var(--overlay-hover)]'
                    } ${
                      dragOverFolder === folder.id ? 'ring-2 ring-green-500 ring-opacity-50' : ''
                    }`}
                    onClick={() => setSelectedFolderId(folder.id)}
                    onDragOver={(e) => handleDragOver(e, folder.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, folder.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{folder.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{folder.name}</div>
                        <div className={`text-xs truncate ${
                          selectedFolderId === folder.id ? 'text-white/70' : 'text-[var(--text-secondary)]'
                        }`}>
                          {folder.description}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedFolderId === folder.id
                            ? 'bg-white/20 text-white'
                            : 'bg-[var(--overlay-hover)] text-[var(--text-secondary)]'
                        }`}>
                          {filteredItems.filter(item => item.folderId === folder.id).length}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Zone principale - Documents et fichiers */}
          <div className="lg:col-span-3">
            {currentDocument ? (
              <div className="bg-[var(--card-background)] rounded-2xl p-6 shadow-lg border border-[var(--border-color)]">
                {/* Actions */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
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
                          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-4 py-2 rounded-lg font-medium"
                        >
                          Annuler
                        </button>
                      </>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Modifier
                      </motion.button>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
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
                      style={{
                        fontSize: '14px',
                        lineHeight: '1.6'
                      }}
                      dangerouslySetInnerHTML={{
                        __html: currentDocument.content.replace(
                          /<h1>/g, '<h1 style="font-size: 2rem; font-weight: bold; margin: 1rem 0;">'
                        ).replace(
                          /<h2>/g, '<h2 style="font-size: 1.5rem; font-weight: bold; margin: 0.8rem 0;">'
                        ).replace(
                          /<h3>/g, '<h3 style="font-size: 1.25rem; font-weight: bold; margin: 0.6rem 0;">'
                        )
                      }}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[var(--card-background)] rounded-2xl p-6 shadow-lg border border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {viewMode === 'grid' ? 'Vue grille' : 'Vue liste'} ({filteredItems.length} éléments)
                  </h3>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        className="p-4 bg-[var(--overlay-hover)] rounded-xl border border-[var(--border-color)] hover:border-green-500/50 transition-all duration-200 cursor-pointer"
                        onClick={() => {
                          if (item.type === 'document') {
                            setCurrentDocument(item as ConfluenceDocument);
                            setIsEditing(false);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {item.type === 'document' ? (
                              <FileText className="w-6 h-6 text-blue-500" />
                            ) : (
                              <File className="w-6 h-6 text-purple-500" />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-[var(--text-primary)] truncate">
                                {item.title}
                              </h4>
                              <p className="text-xs text-[var(--text-secondary)] mt-1">
                                {item.type === 'document'
                                  ? getCategoryLabel((item as ConfluenceDocument).category)
                                  : formatFileSize((item as UploadedFile).size)
                                }
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStar(item);
                              }}
                              className="p-1 hover:bg-[var(--overlay-hover)] rounded transition-colors"
                            >
                              <Star className={`w-4 h-4 ${
                                (item as ConfluenceDocument).isStarred ? 'text-yellow-500 fill-current' : 'text-[var(--text-secondary)]'
                              }`} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteItem(item);
                              }}
                              className="p-1 hover:bg-red-500/10 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                          <span>
                            {new Date(item.type === 'document'
                              ? (item as ConfluenceDocument).updatedAt
                              : (item as UploadedFile).uploadedAt
                            ).toLocaleDateString('fr-FR')}
                          </span>
                          {item.type === 'document' && (item as ConfluenceDocument).isPublished && (
                            <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full">
                              Publié
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.01 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        className="flex items-center justify-between p-4 bg-[var(--overlay-hover)] rounded-lg border border-[var(--border-color)] hover:border-green-500/50 transition-all duration-200 cursor-pointer"
                        onClick={() => {
                          if (item.type === 'document') {
                            setCurrentDocument(item as ConfluenceDocument);
                            setIsEditing(false);
                          }
                        }}
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {item.type === 'document' ? (
                            <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          ) : (
                            <File className="w-5 h-5 text-purple-500 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-[var(--text-primary)] truncate">
                              {item.title}
                            </h4>
                            <p className="text-sm text-[var(--text-secondary)] truncate">
                              {item.type === 'document'
                                ? getCategoryLabel((item as ConfluenceDocument).category)
                                : formatFileSize((item as UploadedFile).size)
                              }
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                            <span>
                              {new Date(item.type === 'document'
                                ? (item as ConfluenceDocument).updatedAt
                                : (item as UploadedFile).uploadedAt
                              ).toLocaleDateString('fr-FR')}
                            </span>
                            {item.type === 'document' && (item as ConfluenceDocument).isPublished && (
                              <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full">
                                Publié
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(item);
                            }}
                            className="p-2 hover:bg-[var(--overlay-hover)] rounded transition-colors"
                          >
                            <Star className={`w-4 h-4 ${
                              (item as ConfluenceDocument).isStarred ? 'text-yellow-500 fill-current' : 'text-[var(--text-secondary)]'
                            }`} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteItem(item);
                            }}
                            className="p-2 hover:bg-red-500/10 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {filteredItems.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                      Aucun élément trouvé
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-4">
                      {searchQuery ? 'Aucun résultat pour votre recherche.' : 'Commencez par créer un document ou uploader un fichier.'}
                    </p>
                    <div className="flex justify-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateModal(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Créer un document
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowUploadModal(true)}
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Uploader un fichier
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {/* Modal de création de document */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--card-background)] rounded-2xl p-6 w-full max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Créer un nouveau document</h3>
              <p className="text-[var(--text-secondary)] mb-6">
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
                    className="w-full p-4 rounded-lg border border-[var(--border-color)] hover:border-green-500 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
                        <category.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[var(--text-primary)]">{category.label}</h4>
                        <p className="text-sm text-[var(--text-secondary)]">
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
                  className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de création de dossier */}
        {showFolderModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--card-background)] rounded-2xl p-6 w-full max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Créer un nouveau dossier</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Nom du dossier
                  </label>
                  <input
                    type="text"
                    placeholder="Nom du dossier"
                    className="w-full p-3 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Description du dossier"
                    rows={3}
                    className="w-full p-3 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Couleur
                    </label>
                    <div className="flex gap-2">
                      {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'].map(color => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded-full border-2 border-[var(--border-color)] hover:border-green-500"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Icône
                    </label>
                    <div className="flex gap-2">
                      {['📚', '🤝', '⚙️', '📋', '🎯', '📊'].map(icon => (
                        <button
                          key={icon}
                          className="w-8 h-8 rounded border border-[var(--border-color)] hover:border-green-500 flex items-center justify-center"
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowFolderModal(false)}
                  className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Annuler
                </button>
                <button
                  onClick={() => createNewFolder('Nouveau dossier', '#3b82f6', '📁', 'Description du dossier')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal d'upload */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--card-background)] rounded-2xl p-6 w-full max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Uploader des fichiers</h3>
              <div className="border-2 border-dashed border-[var(--border-color)] rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
                <p className="text-[var(--text-primary)] mb-2">Glissez-déposez vos fichiers ici</p>
                <p className="text-sm text-[var(--text-secondary)] mb-4">ou cliquez pour sélectionner</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Sélectionner des fichiers
                </button>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de suppression */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--card-background)] rounded-2xl p-6 w-full max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Supprimer l'élément</h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Êtes-vous sûr de vouloir supprimer "{itemToDelete?.title}" ? Cette action est irréversible.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                  }}
                  className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Confluence;
