'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import Blockquote from '@tiptap/extension-blockquote';
import { editorButtonStyle } from '@/lib/constants';
import { getActiveHeadingLabel } from '@/lib/utils';
import { useEffect } from 'react';
import EditorToolbar from './EditorToolbar';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  
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

  return (
    <div className="space-y-4 border border-border bg-background text-foreground rounded-[6px] p-4">
      
      <EditorToolbar editor={editor} getBtnStyle={editorButtonStyle} />
    
      <div className="text-xs text-muted-foreground mt-4 mb-2">
        Current Block: <span className="font-medium">{getActiveHeadingLabel(editor)}</span>
        {editor.isActive('bold') && ' | Bold'}
        {editor.isActive('italic') && ' | Italic'}
      </div>

      <EditorContent
        editor={editor}
        className="tiptap min-h-[300px] h-[350px] max-h-[500px] overflow-y-auto outline-none rounded-md px-1 sm:px-3 py-1 sm:py-2"
      />
    </div>
  );
}
