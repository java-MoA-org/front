// src/components/message/MessageInput.tsx
import React, { useState } from 'react';

interface Props {
  onSend: (content: string) => void;
}

const MessageInput: React.FC<Props> = ({ onSend }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSend(content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="message-input">
      <input
        placeholder="메시지를 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">전송</button>
    </form>
  );
};

export default MessageInput;