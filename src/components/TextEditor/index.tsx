import React from 'react';

import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import './style.css';

// interface: Text Editor Menu Bar 컴포넌트 속성 //
interface MenuBarProp {
  editor: Editor | null
}

// component: Text Editor Menu Bar 컴포넌트 //
function MenuBar({ editor }: MenuBarProp) {
  if (!editor) return null;

  return (
    <div id='text-editor-menu-bar'>
      <div className='item-box'>
        <div className={`item ${editor.isActive('bold') ? 'active' : ''} bold`} onClick={() => editor.chain().focus().toggleBold().run()}></div>
      </div>
    </div>
  )
}

// variable: tiptap Text Editor 확장 //
const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
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
]

// interface: tiptap Text Editor 컴포넌트 속성 //
interface Props {
  content: string;
  setContent: (content: string) => void;
}

// component: tiptap Text Editor 컴포넌트 //
export default function TextEditor({ content, setContent }: Props) {

  // state: editor 상태 //
  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      // getText() 사용하여 순수 텍스트만 얻기
      setContent(editor.getText());  // editor.getHTML() -> editor.getText()
    }
  });

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="editor-content" />
    </>
  );
}
