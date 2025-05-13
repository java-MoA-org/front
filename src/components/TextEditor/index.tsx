import React, { useState, useEffect } from 'react';

import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { Image } from '@tiptap/extension-image';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import axios from 'axios';

import "./style.css";
import { UPLOAD_IMAGES_URL } from '../../apis';

// interface: Text Editor Menu Bar 컴포넌트 속성 //
interface MenuBarProp {
  editor: Editor | null;
  isUploading: boolean;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// component: Text Editor Menu Bar 컴포넌트 //
function MenuBar({ editor, isUploading, handleImageUpload }: MenuBarProp) {
  if (!editor) return null;

  return (
    <div id="text-editor-menu-bar">
      <div className="item-box">
        {/* Bold 버튼 */}
        <div
          className={`item bold ${editor.isActive('bold') ? 'active' : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        ></div>

        {/* 이미지 업로드 버튼 */}
        <label htmlFor="image-upload-input" className={`item image-upload ${isUploading ? 'uploading' : ''}`}></label>
        <input
          id="image-upload-input"
          type="file"
          accept="image/png, image/jpeg"
          multiple
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}

// variable: tiptap Text Editor 확장 //
const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  StarterKit.configure({
    bulletList: { keepMarks: true, keepAttributes: false },
    orderedList: { keepMarks: true, keepAttributes: false },
  }),
  Image,
];

// interface: tiptap Text Editor 컴포넌트 속성 //
interface Props {
  content: string;
  setContent: (content: string) => void;
  onImageListChange?: (imageList: string[]) => void;
  onImageUpload?: (imageUrl: string) => void;
  type?: 'board' | 'daily' | 'profile';
}

// component: tiptap Text Editor 컴포넌트 //
export default function TextEditor({ content, setContent, onImageListChange, onImageUpload, type }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageList, setImageList] = useState<Set<string>>(new Set());

  // editor 상태 변수
  const [initialized, setInitialized] = useState(false);

  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== undefined && !initialized) {
      editor.commands.setContent(content);
      setInitialized(true);
    }
  }, [editor, content, initialized]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
  
    const validFiles = Array.from(files).filter((file) =>
      ['image/jpeg', 'image/png'].includes(file.type) && file.size <= 5 * 1024 * 1024
    );
  
    if (validFiles.length === 0) {
      alert('유효한 이미지 파일이 없습니다.');
      return;
    }
  
    setIsUploading(true);
  
    const uploadedUrls: string[] = [];
  
    for (const file of validFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type || 'board');
  
      try {
        const response = await axios.post(UPLOAD_IMAGES_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
  
        const imageUrl = response.data.data;
        if (Array.isArray(imageUrl)) {
          uploadedUrls.push(...imageUrl);
        } else {
          uploadedUrls.push(imageUrl);
        }
  
        setImageList((prevList) => {
          const updatedList = new Set(prevList);
          uploadedUrls.forEach((url) => updatedList.add(url));
          onImageListChange?.([...updatedList]);
          return updatedList;
        });
  
        editor?.chain().focus().setImage({ src: imageUrl }).run();
        onImageUpload?.(imageUrl);
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      }
    }
  
    setIsUploading(false);
  };
  
  

  return (
    <>
      <MenuBar editor={editor} isUploading={isUploading} handleImageUpload={handleImageUpload} />
      <EditorContent editor={editor} className="editor-content" />
    </>
  );
}
