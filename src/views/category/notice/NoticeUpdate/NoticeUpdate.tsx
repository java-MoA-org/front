import "./NoticeUpdate.css";
import "react-quill/dist/quill.snow.css";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";

import { getNoticeRequest, patchNoticeRequest } from "../../../../apis";
import { PatchNoticeRequestDto } from "../../../../apis/dto/request/notice";
import { NOTICE_ABSOLUTE_PATH } from "../../../../constants";

const NoticeUpdate = () => {
  const { noticeId } = useParams() as { noticeId: string };
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 기존 공지사항 데이터 불러오기
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") || "";
    if (!noticeId) return;

    getNoticeRequest(noticeId, accessToken)
      .then((res) => {
        if (res && "title" in res && "content" in res) {
          setTitle(res.title);
          setContent(res.content);
        } else {
          alert("공지사항을 불러오지 못했습니다.");
          navigate(NOTICE_ABSOLUTE_PATH);
        }
      })
      .catch((err) => {
        console.error("공지 불러오기 실패:", err);
        alert("공지사항을 불러오지 못했습니다.");
        navigate(NOTICE_ABSOLUTE_PATH);
      });
  }, [noticeId, navigate]);

  // 수정 요청
  const handleUpdate = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || !noticeId) {
      alert("로그인이 필요하거나 잘못된 접근입니다.");
      return;
    }

    const requestBody: PatchNoticeRequestDto = { title, content };

    try {
      await patchNoticeRequest(noticeId, requestBody, accessToken);
      alert("공지 수정 완료");
      navigate(NOTICE_ABSOLUTE_PATH);
    } catch (e) {
      console.error("수정 실패:", e);
      alert("수정 실패");
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
