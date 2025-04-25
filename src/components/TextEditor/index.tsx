import React, { useState, useEffect } from 'react';

import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { Image } from '@tiptap/extension-image';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import axios from 'axios';

import "./style.css";

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
}

// component: tiptap Text Editor 컴포넌트 //
export default function TextEditor({ content, setContent, onImageListChange, onImageUpload }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageList, setImageList] = useState<string[]>([]);

  // editor 상태 변수
  const [initialized, setInitialized] = useState(false);

  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // content가 변경되면 editor에 내용이 반영되도록 설정 //
  useEffect(() => {
    if (editor && content !== undefined && !initialized) {
      editor.commands.setContent(content);
      setInitialized(true);
    }
  }, [editor, content, initialized]);

  // 이미지 업로드 처리 함수 //
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('PNG 또는 JPG 파일만 업로드할 수 있습니다.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하로 업로드해주세요.');
        return;
      }

      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'board');  // 타입을 'board'로 설정 (필요시 다른 타입으로 수정)

      try {
        const response = await axios.post('http://localhost:4000/api/v1/images/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (editor) {
          const imageUrl = response.data.data;  // 서버에서 받은 이미지 URL
          editor.chain().focus().setImage({ src: imageUrl }).run();

          // 이미지 목록 상태 업데이트 및 콜백 호출 //
          setImageList((prevList) => {
            const updatedList = [...prevList, imageUrl];
            onImageListChange?.(updatedList);
            return updatedList;
          });

          // ✅ 외부 콜백 함수도 호출 (예: BoardWrite 쪽에서 삽입된 이미지 처리용)
          onImageUpload?.(imageUrl);
        }
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <>
      <MenuBar editor={editor} isUploading={isUploading} handleImageUpload={handleImageUpload} />
      <EditorContent editor={editor} className="editor-content" />
    </>
  );
}
