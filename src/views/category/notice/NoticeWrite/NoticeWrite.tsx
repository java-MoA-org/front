import "./NoticeWrite.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import TextEditor from "../../../../components/TextEditor";

import { NOTICE_ABSOLUTE_PATH } from "../../../../constants";
import { postNoticeRequest } from "../../../../apis";
import { PostNoticeRequestDto } from "../../../../apis/dto/request/notice";

// component: 공지사항 작성 컴포넌트
const NoticeWrite = () => {
  // state: 입력값 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();
  const [cookies] = useCookies(["accessToken"]);


  // event handler: 공지 등록 요청 처리 //
  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    // const accessToken = localStorage.getItem("accessToken");
    const accessToken = cookies.accessToken;
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    const requestBody: PostNoticeRequestDto = { title, content };

    try {
      await postNoticeRequest(requestBody, accessToken);
      alert("공지 등록 완료");
      navigate(NOTICE_ABSOLUTE_PATH);
    } catch (e) {
      console.error("공지 등록 실패:", e);
      alert("등록 실패");
    }
  };

  // render: 컴포넌트 출력 //
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
        <TextEditor content={content} setContent={setContent} type="notice" />
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