'use client';

import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import Tooltip from '@/components/Tooltip';
import {
  Bold, Italic, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, ListTodo,
  Undo2, Redo2, Quote, Highlighter,
} from 'lucide-react';

interface ToolbarProps {
  editor: Editor;
  getBtnStyle: (active: boolean) => string;
}

export default function EditorToolbar({ editor, getBtnStyle }: ToolbarProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <Tooltip label="Bold" disableMobileClick>
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={getBtnStyle(editor.isActive('bold'))}
          size="icon"
        >
          <Bold size={16} />
        </Button>
      </Tooltip>

      <Tooltip label="Italic" disableMobileClick>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={getBtnStyle(editor.isActive('italic'))}
          size="icon"
        >
          <Italic size={16} />
        </Button>
      </Tooltip>

      <Tooltip label="Heading 1" disableMobileClick>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={getBtnStyle(editor.isActive('heading', { level: 1 }))}
          size="icon"
        >
          <Heading1 size={16} />
        </Button>
      </Tooltip>

      <Tooltip label="Heading 2" disableMobileClick>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={getBtnStyle(editor.isActive('heading', { level: 2 }))}
          size="icon"
        >
          <Heading2 size={16} />
        </Button>
      </Tooltip>

      <Tooltip label="Heading 3" disableMobileClick>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={getBtnStyle(editor.isActive('heading', { level: 3 }))}
          size="icon"
        >
          <Heading3 size={16} />
        </Button>
      </Tooltip>

      <Tooltip label="Left Align" disableMobileClick>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={getBtnStyle(editor.isActive({ textAlign: 'left' }))}
          size="icon"
        >
          <AlignLeft size={16} />
        </Button>
      </Tooltip>

      <Tooltip label="Center Align" disableMobileClick>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={getBtnStyle(editor.isActive({ textAlign: 'center' }))}
          size="icon"
        >
          <AlignCenter size={16} />
        </Button>
      </Tooltip>

      <Tooltip label="Right Align" disableMobileClick>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={getBtnStyle(editor.isActive({ textAlign: 'right' }))}
          size="icon"
        >
          <AlignRight size={16} />
        </Button>
      </Tooltip>

      <Tooltip label="Blockquote" disableMobileClick>
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={getBtnStyle(editor.isActive('blockquote'))}
          size="icon"
        >
          <Quote size={16} />
        </Button>
      </Tooltip>

      <Tooltip label="Highlight" disableMobileClick>
        <Button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={getBtnStyle(editor.isActive('highlight'))}
          size="icon"
        >
          <Highlighter size={16} />
        </Button>
      </Tooltip>

      <Tooltip label="Task List" disableMobileClick>
        <Button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={getBtnStyle(editor.isActive('taskList'))}
          size="icon"
        >
          <ListTodo size={16} />
        </Button>
      </Tooltip>

      <Tooltip label="Undo" disableMobileClick>
        <Button
          onClick={() => editor.chain().focus().undo().run()}
          className={getBtnStyle(false)} // 'undo' doesn't have an active state
          size="icon"
        >
          <Undo2 size={16} />
        </Button>
      </Tooltip>

      <Tooltip label="Redo" disableMobileClick>
        <Button
          onClick={() => editor.chain().focus().redo().run()}
          className={getBtnStyle(false)}
          size="icon"
        >
          <Redo2 size={16} />
        </Button>
      </Tooltip>
    </div>
  );
}
