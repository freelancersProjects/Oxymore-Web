import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  FolderOpen,
  FileText,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Move,
  ChevronRight,
  ChevronDown,
  Upload,
  Download
} from 'lucide-react';
import Dropdown from '../Dropdown/Dropdown';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

interface DocumentItem {
  id: string;
  name: string;
  type: 'document' | 'folder';
  parentId?: string;
  children?: DocumentItem[];
  category?: string;
  lastModified?: string;
  size?: string;
}

interface FolderManagerProps {
  documents: DocumentItem[];
  onDocumentsChange: (documents: DocumentItem[]) => void;
  onDocumentSelect: (document: DocumentItem) => void;
  selectedDocumentId?: string;
}

const FolderManager: React.FC<FolderManagerProps> = ({
  documents,
  onDocumentsChange,
  onDocumentSelect,
  selectedDocumentId
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToRename, setItemToRename] = useState<DocumentItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<DocumentItem | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<'document' | 'folder'>('document');
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<DocumentItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const createNewItem = () => {
    if (!newItemName.trim()) return;

    const newItem: DocumentItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      type: newItemType,
      lastModified: new Date().toISOString(),
      children: newItemType === 'folder' ? [] : undefined
    };

    const updatedDocuments = [...documents, newItem];
    onDocumentsChange(updatedDocuments);
    
    setNewItemName('');
    setShowCreateModal(false);
  };

  const renameItem = () => {
    if (!itemToRename || !newItemName.trim()) return;

    const updateItem = (items: DocumentItem[]): DocumentItem[] => {
      return items.map(item => {
        if (item.id === itemToRename.id) {
          return { ...item, name: newItemName.trim() };
        }
        if (item.children) {
          return { ...item, children: updateItem(item.children) };
        }
        return item;
      });
    };

    const updatedDocuments = updateItem(documents);
    onDocumentsChange(updatedDocuments);
    
    setItemToRename(null);
    setNewItemName('');
    setShowRenameModal(false);
  };

  const deleteItem = () => {
    if (!itemToDelete) return;

    const removeItem = (items: DocumentItem[]): DocumentItem[] => {
      return items.filter(item => {
        if (item.id === itemToDelete.id) {
          return false;
        }
        if (item.children) {
          return { ...item, children: removeItem(item.children) };
        }
        return true;
      });
    };

    const updatedDocuments = removeItem(documents);
    onDocumentsChange(updatedDocuments);
    
    setItemToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDragStart = (e: React.DragEvent, item: DocumentItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, item: DocumentItem) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(item.id);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetItem: DocumentItem) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetItem.id) {
      setDragOverItem(null);
      setDraggedItem(null);
      return;
    }

    // Logique de déplacement (simplifiée pour cet exemple)
    const moveItem = (items: DocumentItem[]): DocumentItem[] => {
      return items.map(item => {
        if (item.id === targetItem.id && item.type === 'folder') {
          return {
            ...item,
            children: [...(item.children || []), draggedItem]
          };
        }
        if (item.children) {
          return { ...item, children: moveItem(item.children) };
        }
        return item;
      });
    };

    const updatedDocuments = moveItem(documents);
    onDocumentsChange(updatedDocuments);
    
    setDragOverItem(null);
    setDraggedItem(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const newDocument: DocumentItem = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: 'document',
        lastModified: new Date().toISOString(),
        size: `${(file.size / 1024).toFixed(1)} KB`
      };
      
      const updatedDocuments = [...documents, newDocument];
      onDocumentsChange(updatedDocuments);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderItem = (item: DocumentItem, level: number = 0) => {
    const isExpanded = expandedFolders.has(item.id);
    const isSelected = selectedDocumentId === item.id;
    const isDragOver = dragOverItem === item.id;

    return (
      <div key={item.id}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
            isSelected
              ? 'bg-blue-500 text-white'
              : isDragOver
              ? 'bg-blue-500/20 border-2 border-blue-500 border-dashed'
              : 'hover:bg-[var(--overlay-hover)]'
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.id);
            } else {
              onDocumentSelect(item);
            }
          }}
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragOver={(e) => handleDragOver(e, item)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, item)}
        >
          {item.type === 'folder' ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-blue-500" />
              ) : (
                <Folder className="w-4 h-4 text-blue-500" />
              )}
            </>
          ) : (
            <>
              <div className="w-4 h-4" />
              <FileText className="w-4 h-4 text-gray-500" />
            </>
          )}
          
          <span className="flex-1 truncate">{item.name}</span>
          
          {item.size && (
            <span className="text-xs text-[var(--text-muted)]">
              {item.size}
            </span>
          )}

          <div className="flex items-center gap-1">
            <Dropdown
              options={[
                { value: 'rename', label: 'Renommer', icon: Edit },
                { value: 'move', label: 'Déplacer', icon: Move },
                { value: 'delete', label: 'Supprimer', icon: Trash2, className: 'text-red-500' }
              ]}
              onSelect={(value) => {
                switch (value) {
                  case 'rename':
                    setItemToRename(item);
                    setNewItemName(item.name);
                    setShowRenameModal(true);
                    break;
                  case 'delete':
                    setItemToDelete(item);
                    setShowDeleteModal(true);
                    break;
                }
              }}
              trigger={
                <button className="p-1 hover:bg-[var(--overlay-hover)] rounded">
                  <MoreVertical className="w-3 h-3" />
                </button>
              }
            />
          </div>
        </motion.div>

        {/* Enfants du dossier */}
        <AnimatePresence>
          {item.type === 'folder' && isExpanded && item.children && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {item.children.map(child => renderItem(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowCreateModal(true)}
          className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
          title="Créer un nouveau document"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
          title="Importer des fichiers"
        >
          <Upload className="w-4 h-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Liste des documents */}
      <div className="space-y-1">
        {documents.length > 0 ? (
          documents.map(item => renderItem(item))
        ) : (
          <div className="text-center py-8 text-[var(--text-muted)]">
            <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun document</p>
            <p className="text-sm">Créez votre premier document</p>
          </div>
        )}
      </div>

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--card-background)] rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Créer un nouvel élément
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Type
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewItemType('document')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      newItemType === 'document'
                        ? 'bg-blue-500 text-white'
                        : 'bg-[var(--overlay-hover)] text-[var(--text-primary)]'
                    }`}
                  >
                    Document
                  </button>
                  <button
                    onClick={() => setNewItemType('folder')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      newItemType === 'folder'
                        ? 'bg-blue-500 text-white'
                        : 'bg-[var(--overlay-hover)] text-[var(--text-primary)]'
                    }`}
                  >
                    Dossier
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={`Nom du ${newItemType === 'document' ? 'document' : 'dossier'}`}
                  className="w-full px-3 py-2 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[var(--text-primary)]"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Annuler
              </button>
              <button
                onClick={createNewItem}
                disabled={!newItemName.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de renommage */}
      <ConfirmationModal
        isOpen={showRenameModal}
        onClose={() => {
          setShowRenameModal(false);
          setItemToRename(null);
          setNewItemName('');
        }}
        onConfirm={renameItem}
        title="Renommer"
        message={`Renommer "${itemToRename?.name}"`}
        confirmText="Renommer"
        cancelText="Annuler"
        type="info"
        customContent={
          <div className="mt-4">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[var(--text-primary)]"
              autoFocus
            />
          </div>
        }
        disabled={!newItemName.trim()}
      />

      {/* Modal de suppression */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={deleteItem}
        title="Supprimer"
        message={`Êtes-vous sûr de vouloir supprimer "${itemToDelete?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </div>
  );
};

export default FolderManager;
