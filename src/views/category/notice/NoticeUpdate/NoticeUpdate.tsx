import './NoticeUpdate.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NoticeUpdate = () => {
  const { noticeId } = useParams<{ noticeId: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  // 🔍 공지 불러오기
  useEffect(() => {
    if (!noticeId) return;

    axios
      .get(`/api/v1/notice/${noticeId}`)
      .then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
      })
      .catch((err) => {
        console.error('❌ 공지 불러오기 실패:', err);
        alert('공지사항을 불러오지 못했습니다.');
        navigate('/notice');
      });
  }, [noticeId, navigate]);

  // ✅ 수정 처리
  const handleUpdate = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await axios.put(
        `/api/v1/notice/update/${noticeId}`,
        { title, content },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert('공지 수정 완료');
      navigate('/notice');
    } catch (e) {
      console.error('❌ 수정 실패:', e);
      alert('수정 실패');
    }
  };

  return (
    <div className="notice-update-wrapper">
      <div className="notice-update-container">
        <h2 className="notice-update-title">공지사항 수정</h2>
        <input
          type="text"
          className="notice-update-title-input"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <ReactQuill
          className="notice-update-editor"
          value={content}
          onChange={setContent}
          placeholder="공지 내용을 입력해주세요"
        />
        <div className="notice-update-button-wrapper">
          <button className="notice-update-button" onClick={handleUpdate}>
            수정 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeUpdate;