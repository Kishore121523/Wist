'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import Blockquote from '@tiptap/extension-blockquote';
import { Button } from '@/components/ui/button';
import Tooltip from '@/components/Tooltip';


import {
  Bold, Italic, Heading1, Heading2,Heading3,  AlignLeft,
  AlignCenter, AlignRight, ListTodo, Undo2, Redo2, Quote, Highlighter
} from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  
  const getBtnStyle = (active: boolean) =>
  active
    ? 'bg-card-dark  text-background cursor-pointer rounded-[6px] hover:bg-foreground hover:text-background transition'
    : 'border border-foreground-muted cursor-pointer rounded-[6px] text-foreground cursor-pointer text-foreground hover:bg-card-dark hover:text-background transition';

      const editor = useEditor({
        extensions: [
          StarterKit.configure({
            history: { depth: 100, newGroupDelay: 500 },
          }),
          Heading.configure({ levels: [1, 2, 3] }),
          TextAlign.configure({ types: ['heading', 'paragraph'] }),
          TaskList,
          TaskItem.configure({ nested: true }),
          Blockquote,
          Highlight.configure({
            HTMLAttributes: {
              class: 'bg-yellow-600 text-black px-1 rounded-sm',
            },
          }),
        ],
        content,
        onUpdate({ editor }) {
          onChange(editor.getHTML());
        },
      });

  // This effect ensures updated content is set into editor after it mounts
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor) return null;

  const getActiveHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return 'H1';
    if (editor.isActive('heading', { level: 2 })) return 'H2';
    if (editor.isActive('heading', { level: 3 })) return 'H3';
    if (editor.isActive('codeBlock')) return 'Code Block';
    if (editor.isActive('taskList')) return 'Task List';
    if (editor.isActive('paragraph')) return 'Paragraph';
    return '';
  };

  return (
    <div className="space-y-4 border border-border bg-background text-foreground rounded-[6px] p-4">
      <div className="flex flex-wrap gap-2 mb-2">
        <Tooltip label="Bold">
          <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={getBtnStyle(editor.isActive('bold'))}
            size="icon"
          >
            <Bold size={16} />
          </Button>
        </Tooltip>

        <Tooltip label="Italic">
          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={getBtnStyle(editor.isActive('italic'))}
            size="icon"
          >
            <Italic size={16} />
          </Button>
        </Tooltip>

        <Tooltip label="Heading 1">
          <Button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={getBtnStyle(editor.isActive('heading', { level: 1 }))}
            size="icon"
          >
            <Heading1 size={16} />
          </Button>
        </Tooltip>

        <Tooltip label="Heading 2">
          <Button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={getBtnStyle(editor.isActive('heading', { level: 2 }))}
            size="icon"
          >
            <Heading2 size={16} />
          </Button>
        </Tooltip>

        <Tooltip label="Heading 3">
          <Button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={getBtnStyle(editor.isActive('heading', { level: 3 }))}
            size="icon"
          >
            <Heading3 size={16} />
          </Button>
        </Tooltip>

        <Tooltip label="Left Align">
          <Button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={getBtnStyle(editor.isActive({ textAlign: 'left' }))}
            size="icon"
          >
            <AlignLeft size={16} />
          </Button>
        </Tooltip>

        <Tooltip label="Center Align">
          <Button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={getBtnStyle(editor.isActive({ textAlign: 'center' }))}
            size="icon"
          >
            <AlignCenter size={16} />
          </Button>
        </Tooltip>

        <Tooltip label="Right Align">
          <Button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={getBtnStyle(editor.isActive({ textAlign: 'right' }))}
            size="icon"
          >
            <AlignRight size={16} />
          </Button>
        </Tooltip>
        
        <Tooltip label="Blockquote">
          <Button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={getBtnStyle(editor.isActive('blockquote'))}
            size="icon"
          >
            <Quote size={16} />
          </Button>
        </Tooltip>

        <Tooltip label="Highlight">
          <Button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={getBtnStyle(editor.isActive('highlight'))}
            size="icon"
          >
              <Highlighter size={16} />
          </Button>
        </Tooltip>

        <Tooltip label="Task List">
          <Button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={getBtnStyle(editor.isActive('taskList'))}
            size="icon"
          >
            <ListTodo size={16} />
          </Button>
        </Tooltip>

        <Tooltip label="Undo">
          <Button
            onClick={() => editor.chain().focus().undo().run()}
            className={getBtnStyle(editor.isActive('undo'))}
            size="icon"
          >
            <Undo2 size={16} />
          </Button>
        </Tooltip>

        <Tooltip label="Redo">
          <Button
            onClick={() => editor.chain().focus().redo().run()}
            className={getBtnStyle(editor.isActive('redo'))}
            size="icon"
          >
            <Redo2 size={16} />
          </Button>
        </Tooltip>
      </div>
    
      <div className="text-xs text-muted-foreground mt-4 mb-2">
        Current Block: <span className="font-medium">{getActiveHeading()}</span>
        {editor.isActive('bold') && ' | Bold'}
        {editor.isActive('italic') && ' | Italic'}
      </div>

      <EditorContent
        editor={editor}
        className="tiptap min-h-[300px] h-[350px] max-h-[500px] overflow-y-auto outline-none rounded-md px-3 py-2"
      />
    </div>
  );
}
