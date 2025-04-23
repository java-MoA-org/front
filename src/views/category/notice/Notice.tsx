import "./Notice.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNoticeListRequest } from "../../../apis";
import {
  NOTICE_VIEW_ABSOLUTE_PATH,
  NOTICE_WRITE_ABSOLUTE_PATH,
} from "../../../constants";

import { NoticeItem } from "../../../types/interfaces/notice.interface";

const Notice = () => {
  const [activeTab, setActiveTab] = useState<"설명" | "공지사항">(
    () => (localStorage.getItem("noticeTab") as "설명" | "공지사항") || "설명",
  );

  const [noticeList, setNoticeList] = useState<NoticeItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [page, setPage] = useState<number>(0);
  const navigate = useNavigate();

  // effect: 관리자 권한 확인
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role === "ADMIN") setIsAdmin(true);
  }, []);

  // effect: 공지사항 목록 요청
  useEffect(() => {
    if (activeTab === "공지사항") {
      getNoticeListRequest()
        .then((res) => {
          if (res && "data" in res) {
            setNoticeList(res.data as NoticeItem[]);
          } else {
            console.warn("공지사항 응답 구조 이상:", res);
          }
        })
        .catch((err) => {
          console.error("공지사항 목록 조회 실패:", err);
        });
    }
  }, [activeTab]);
  const handleTabClick = (tab: "설명" | "공지사항") => {
    setActiveTab(tab);
    localStorage.setItem("noticeTab", tab);
  };

  return (
    <div className="notice-wrapper">
      <div className="notice-container">
        {/* 탭 메뉴 */}
        <div className="notice-tabs">
          <h2
            className={`section-title ${activeTab === "설명" ? "active" : ""}`}
            onClick={() => handleTabClick("설명")}
          >
            설명
          </h2>
          <h2
            className={`section-title ${activeTab === "공지사항" ? "active" : ""}`}
            onClick={() => handleTabClick("공지사항")}
          >
            공지사항
          </h2>
        </div>

        {/* 공지 작성 버튼 */}
        {activeTab === "공지사항" && isAdmin && (
          <div className="notice-write-button-wrapper">
            <button
              className="notice-write-button"
              onClick={() => navigate(NOTICE_WRITE_ABSOLUTE_PATH)}
            >
              ✏️ 공지 작성
            </button>
          </div>
        )}

        {/* 설명 탭 */}
        {activeTab === "설명" && (
          <div className="notice-content post-card">
            <p>
              이곳은 사이트 이용 방법이나 주요 안내사항을 알려주는 공간입니다.
            </p>
            <ul>
              <li>회원가입은 이메일 또는 SNS 계정으로 가능합니다.</li>
              <li>
                게시판은 익명으로 운영되며 자유롭게 의견을 나눌 수 있습니다.
              </li>
              <li>중고거래는 반드시 유저 정보를 확인 후 이용해주세요.</li>
            </ul>
          </div>
        )}

        {/* 검색바 (추후 구현용) */}
        {activeTab === "공지사항" && (
          <div className="notice-search-bar">
            <select className="notice-search-select">
              <option>제목</option>
            </select>
            <input
              type="text"
              placeholder="검색어를 입력해주세요."
              className="notice-search-input"
            />
            <button className="notice-search-button">검색</button>
          </div>
        )}

        {/* 공지사항 리스트 */}
        {activeTab === "공지사항" && (
          <section className="notice-list">
            {noticeList.length === 0 ? (
              <div>📭 등록된 공지사항이 없습니다.</div>
            ) : (
              noticeList.map((item) => (
                <div
                  className="post-card notice-item"
                  key={item.notificationSequence}
                  onClick={() =>
                    navigate(
                      NOTICE_VIEW_ABSOLUTE_PATH(item.notificationSequence),
                    )
                  }
                >
                  <div className="post-title">[공지] {item.title}</div>
                  <div className="post-info">
                    <span>운영자</span>
                    <span>📢</span>
                    <span>
                      {item.creationDate.replace("T", " ").slice(0, 16)}
                    </span>
                    <span>조회수: {item.views}</span>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {/* 페이지네이션 */}
        {activeTab === "공지사항" && (
          <div className="board-pagination">
            <button
              className="board-page-btn"
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            >
              &lt; 이전
            </button>
            <button className="board-page-btn" disabled>
              {page + 1}
            </button>
            <button
              className="board-page-btn"
              onClick={() => setPage((prev) => prev + 1)}
            >
              다음 &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notice;
