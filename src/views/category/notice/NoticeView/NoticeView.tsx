import "./NoticeView.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  NOTICE_ABSOLUTE_PATH,
  NOTICE_UPDATE_ABSOLUTE_PATH,
} from "../../../../constants";
import { NoticeDetail } from "../../../../types/interfaces/notice.interface";
import { getNoticeRequest, deleteNoticeRequest } from "../../../../apis";

// component: 공지사항 상세 페이지
const NoticeView = () => {
  const { noticeId } = useParams();
  const navigate = useNavigate();

  // state: 공지사항 데이터 및 관리자 권한
  const [notice, setNotice] = useState<NoticeDetail | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // effect: 관리자 권한 확인 //
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role === "ADMIN") setIsAdmin(true);
  }, []);

  // effect: 공지사항 불러오기 //
  useEffect(() => {
    if (!noticeId) return;

    const accessToken = localStorage.getItem("accessToken") || "";

    getNoticeRequest(noticeId, accessToken)
      .then((res) => {
        if (res && "title" in res) {
          setNotice(res);
        }
      })
      .catch((err) => {
        console.error("공지 조회 실패:", err);
        alert("공지사항을 불러오지 못했습니다.");
        navigate(NOTICE_ABSOLUTE_PATH);
      });
  }, [noticeId]);

  // event handler: 공지사항 삭제 처리 //
  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete || !noticeId) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await deleteNoticeRequest(noticeId, accessToken);
      alert("삭제 완료");
      navigate(NOTICE_ABSOLUTE_PATH);
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 문제가 발생했습니다.");
    }
  };

  // render: 로딩 중 화면 //
  if (!notice) 
    return <div className="notice-view">⏳ 불러오는 중...</div>;

  // render: 공지사항 상세 //
  return (
    <div className="notice-view-wrapper">
      <div className="notice-view-container">
        <h2 className="notice-view-title">[공지] {notice.title}</h2>
        <div className="notice-view-info">
          <span>운영자</span>
          <span>📢</span>
          <span>{notice.creationDate.replace("T", " ").slice(0, 16)}</span>
          <span>조회수: {notice.views}</span>
        </div>
        <div
          className="notice-view-content"
          dangerouslySetInnerHTML={{ __html: notice.content }}
        />
        <div className="notice-view-button-wrapper">
          <button
            className="notice-view-back-button"
            onClick={() => navigate(NOTICE_ABSOLUTE_PATH)}
          >
            목록으로
          </button>
          {isAdmin && (
            <>
              <button
                className="notice-view-edit-button"
                onClick={() =>
                  navigate(NOTICE_UPDATE_ABSOLUTE_PATH(noticeId!))
                }
              >
                수정
              </button>
              <button
                className="notice-view-delete-button"
                onClick={handleDelete}
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeView;