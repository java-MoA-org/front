import './NoticeWrite.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { NOTICE_ABSOLUTE_PATH } from '../../../../constants';

const NoticeWrite = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  // 관리자 권한 확인
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'ADMIN') {
      alert('관리자만 접근 가능합니다.');
      navigate(NOTICE_ABSOLUTE_PATH);
    }
  }, []);

  // function: 공지 등록 요청 //
  const handleSubmit = async () => {
    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await axios.post(
        '/api/v1/notice',
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert('공지 등록 완료');
      navigate(NOTICE_ABSOLUTE_PATH);
    } catch (e) {
      console.error('공지 등록 실패:', e);
      alert('등록 실패');
    }
  };

  return (
    <div className="notice-write-wrapper">
      <div className="notice-write-container">
        <h2>공지사항 작성</h2>
        <input
          type="text"
          className="notice-write-title"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <ReactQuill
          className="notice-write-editor"
          value={content}
          onChange={setContent}
          placeholder="공지 내용을 입력해주세요"
        />
        <div className="notice-write-button-wrapper">
          <button className="notice-write-button" onClick={handleSubmit}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeWrite;