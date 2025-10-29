import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import './EditableField.scss';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (newValue: string) => Promise<void>;
  type?: 'text' | 'textarea' | 'number';
  placeholder?: string;
  maxLength?: number;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onSave,
  type = 'text',
  placeholder,
  maxLength
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [showEditIcon, setShowEditIcon] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type === 'textarea') {
        (inputRef.current as HTMLTextAreaElement).select();
      } else {
        (inputRef.current as HTMLInputElement).select();
      }
    }
  }, [isEditing, type]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
  };

  const handleSave = async () => {
    if (editValue.trim() === value.trim()) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editValue.trim());
      setIsEditing(false);
    } catch (error) {
      setEditValue(value);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && type !== 'textarea') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      className={`editable-field ${isEditing ? 'editing' : ''}`}
      onMouseEnter={() => setShowEditIcon(true)}
      onMouseLeave={() => !isEditing && setShowEditIcon(false)}
    >
      <div className="editable-field__label">{label}</div>
      <div className="editable-field__content">
        {isEditing ? (
          <div className="editable-field__input-wrapper">
            {type === 'textarea' ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                maxLength={maxLength}
                rows={3}
                className="editable-field__input"
              />
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type={type}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                maxLength={maxLength}
                className="editable-field__input"
              />
            )}
            <div className="editable-field__actions">
              <button
                className="action-btn save"
                onClick={handleSave}
                disabled={isSaving}
                title="Enregistrer"
              >
                <Check size={16} />
              </button>
              <button
                className="action-btn cancel"
                onClick={handleCancel}
                disabled={isSaving}
                title="Annuler"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="editable-field__value-wrapper">
            <span className="editable-field__value">
              {value || <span className="placeholder">{placeholder || 'Non défini'}</span>}
            </span>
            {showEditIcon && (
              <button
                className="editable-field__edit-icon"
                onClick={handleEdit}
                title="Modifier"
              >
                <Edit2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditableField;


