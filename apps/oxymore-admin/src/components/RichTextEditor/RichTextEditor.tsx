import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Highlighter
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Commencez à écrire...',
  className = ''
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      TextStyle,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none ${className}`,
        placeholder,
        style: `
          .ProseMirror h1 { font-size: 2rem; font-weight: bold; margin: 1rem 0; }
          .ProseMirror h2 { font-size: 1.5rem; font-weight: bold; margin: 0.8rem 0; }
          .ProseMirror h3 { font-size: 1.25rem; font-weight: bold; margin: 0.6rem 0; }
          .ProseMirror p { margin: 0.5rem 0; }
          .ProseMirror ul, .ProseMirror ol { margin: 0.5rem 0; padding-left: 1.5rem; }
          .ProseMirror blockquote { border-left: 4px solid #e5e7eb; padding-left: 1rem; margin: 1rem 0; font-style: italic; }
          .ProseMirror code { background-color: #f3f4f6; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; }
          .ProseMirror table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
          .ProseMirror th, .ProseMirror td { border: 1px solid #d1d5db; padding: 0.5rem; text-align: left; }
          .ProseMirror th { background-color: #f9fafb; font-weight: bold; }
        `
      },
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt('URL de l\'image:');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    const url = window.prompt('URL du lien:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const setTextColor = useCallback((color: string) => {
    editor?.chain().focus().setColor(color).run();
  }, [editor]);

  const setHighlight = useCallback((color: string) => {
    editor?.chain().focus().setHighlight({ color }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
      {/* Barre d'outils */}
      <div className="border-b border-[var(--border-color)] p-2 bg-[var(--background-secondary)]">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Formatage de base */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-[var(--overlay-hover)] ${
              editor.isActive('bold') ? 'bg-[var(--overlay-active)]' : ''
            }`}
            title="Gras"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-[var(--overlay-hover)] ${
              editor.isActive('italic') ? 'bg-[var(--overlay-active)]' : ''
            }`}
            title="Italique"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-[var(--overlay-hover)] ${
              editor.isActive('strike') ? 'bg-[var(--overlay-active)]' : ''
            }`}
            title="Barré"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-[var(--overlay-hover)] ${
              editor.isActive('code') ? 'bg-[var(--overlay-active)]' : ''
            }`}
            title="Code"
          >
            <Code className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-[var(--border-color)] mx-1" />

          {/* Titres */}
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-[var(--overlay-hover)] ${
              editor.isActive('heading', { level: 1 }) ? 'bg-[var(--overlay-active)]' : ''
            }`}
            title="Titre 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-[var(--overlay-hover)] ${
              editor.isActive('heading', { level: 2 }) ? 'bg-[var(--overlay-active)]' : ''
            }`}
            title="Titre 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-[var(--overlay-hover)] ${
              editor.isActive('heading', { level: 3 }) ? 'bg-[var(--overlay-active)]' : ''
            }`}
            title="Titre 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-[var(--border-color)] mx-1" />

          {/* Listes */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-[var(--overlay-hover)] ${
              editor.isActive('bulletList') ? 'bg-[var(--overlay-active)]' : ''
            }`}
            title="Liste à puces"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-[var(--overlay-hover)] ${
              editor.isActive('orderedList') ? 'bg-[var(--overlay-active)]' : ''
            }`}
            title="Liste numérotée"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-[var(--overlay-hover)] ${
              editor.isActive('blockquote') ? 'bg-[var(--overlay-active)]' : ''
            }`}
            title="Citation"
          >
            <Quote className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-[var(--border-color)] mx-1" />

          {/* Alignement */}
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-[var(--overlay-hover)] ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-[var(--overlay-active)]' : ''
            }`}
            title="Aligner à gauche"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-[var(--overlay-hover)] ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-[var(--overlay-active)]' : ''
            }`}
            title="Centrer"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-[var(--overlay-hover)] ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-[var(--overlay-active)]' : ''
            }`}
            title="Aligner à droite"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-2 rounded hover:bg-[var(--overlay-hover)] ${
              editor.isActive({ textAlign: 'justify' }) ? 'bg-[var(--overlay-active)]' : ''
            }`}
            title="Justifier"
          >
            <AlignJustify className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-[var(--border-color)] mx-1" />

          {/* Couleurs */}
          <div className="relative group">
            <button
              className="p-2 rounded hover:bg-[var(--overlay-hover)]"
              title="Couleur du texte"
            >
              <Palette className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-0 mt-1 p-2 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="grid grid-cols-6 gap-1">
                {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#800000', '#008000', '#000080', '#808000', '#800080'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setTextColor(color)}
                    className="w-6 h-6 rounded border border-[var(--border-color)]"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative group">
            <button
              className="p-2 rounded hover:bg-[var(--overlay-hover)]"
              title="Surlignage"
            >
              <Highlighter className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-0 mt-1 p-2 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="grid grid-cols-6 gap-1">
                {['#FFFF00', '#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#000080', '#808000', '#800080'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setHighlight(color)}
                    className="w-6 h-6 rounded border border-[var(--border-color)]"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="w-px h-6 bg-[var(--border-color)] mx-1" />

          {/* Éléments */}
          <button
            onClick={addLink}
            className="p-2 rounded hover:bg-[var(--overlay-hover)]"
            title="Ajouter un lien"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            onClick={addImage}
            className="p-2 rounded hover:bg-[var(--overlay-hover)]"
            title="Ajouter une image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            onClick={addTable}
            className="p-2 rounded hover:bg-[var(--overlay-hover)]"
            title="Ajouter un tableau"
          >
            <TableIcon className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-[var(--border-color)] mx-1" />

          {/* Historique */}
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-[var(--overlay-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
            title="Annuler"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-[var(--overlay-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refaire"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Zone d'édition */}
      <div className="min-h-[400px] p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
