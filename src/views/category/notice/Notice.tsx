import "./Notice.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNoticeListRequest } from "../../../apis";
import {
  NOTICE_VIEW_ABSOLUTE_PATH,
  NOTICE_WRITE_ABSOLUTE_PATH,
} from "../../../constants";
import { NoticeItem } from "../../../types/interfaces/notice.interface";

// component: 공지사항 메인 컴포넌트
const Notice = () => {
  // state: 탭 상태
  const [activeTab, setActiveTab] = useState<"설명" | "공지사항">(
    () => (localStorage.getItem("noticeTab") as "설명" | "공지사항") || "설명"
  );

  // state: 공지사항 목록 및 기타
  const [noticeList, setNoticeList] = useState<NoticeItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [page, setPage] = useState<number>(0);

  const navigate = useNavigate();

  // effect: 관리자 권한 확인 //
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role === "ADMIN") setIsAdmin(true);
  }, []);

  // effect: 공지사항 목록 요청 //
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

  // event handler: 탭 전환 처리 //
  const handleTabClick = (tab: "설명" | "공지사항") => {
    setActiveTab(tab);
    localStorage.setItem("noticeTab", tab);
  };

  // render: 컴포넌트 출력 //
  return (
    <div className="notice-wrapper">
      <div className="notice-container">
        {/* render: 탭 메뉴 */}
        <div className="notice-tabs">
          <h2
            className={`section-title ${activeTab === "설명" ? "active" : ""}`}
            onClick={() => handleTabClick("설명")}
          >설명</h2>
          <h2
            className={`section-title ${
              activeTab === "공지사항" ? "active" : ""
            }`}
            onClick={() => handleTabClick("공지사항")}
          >
            공지사항
          </h2>
        </div>

        {/* render: 공지 작성 버튼 */}
        {activeTab === "공지사항" && isAdmin && (
          <div className="notice-write-button-wrapper">
            <button className="notice-write-button" onClick={() => navigate(NOTICE_WRITE_ABSOLUTE_PATH)}>공지 작성
</button>
          </div>
        )}

        {/* render: 설명 탭 */}
        {activeTab === "설명" && (
          <div className="notice-content post-card">
            <p>이곳은 MOA 사이트를 처음 이용하는 분들을 위한 안내 공간입니다. 아래 내용을 참고하여 사이트를 보다 편리하고 안전하게 이용해보세요.</p>
            <ul>
              <li>회원가입은 이메일 또는 SNS 계정을 통해 간단하게 진행할 수 있으며, 가입 후 다양한 기능을 이용할 수 있습니다.</li>
              <li>게시판과 일상 게시글은 모두 익명으로 운영되며, 자유롭게 의견을 나누고 소통할 수 있는 공간입니다. 단, 비방이나 욕설 등 타인을 불쾌하게 하는 표현은 삼가주세요.</li>
              <li>중고거래는 사용자 간의 자율적인 거래로 이루어지며, 거래 전에는 반드시 상대방의 프로필을 확인하고 신뢰할 수 있는지 판단한 후이용하시길 권장드립니다.</li>
              <li>게시글 작성, 댓글, 좋아요 등 커뮤니티 활동은 로그인 후 이용 가능합니다. 로그인하지 않은 경우 일부 기능이 제한될 수 있습니다.</li>
              <li>사이트 이용 중 문의사항이나 문제가 발생할 경우, 고객센터 또는 공지사항 게시판을 통해 확인하거나 문의해 주세요.</li>
              <li>모든 이용자는 사이트 운영 정책에 따라 행동해야 하며, 커뮤니티 내 질서를 유지하기 위해 관리자에 의해 게시물이 삭제되거나 이용이 제한될 수 있습니다.
              </li>
            </ul>
          </div>
        )}

        {/* render: 검색바 (추후 구현) */}
        {activeTab === "공지사항" && (
          <div className="notice-search-bar">
            <input
              type="text"
              placeholder="검색어를 입력해주세요."
              className="notice-search-input"
            />
            <button className="notice-search-button">검색</button>
          </div>
        )}

        {/* render: 공지사항 리스트 */}
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
                      NOTICE_VIEW_ABSOLUTE_PATH(item.notificationSequence)
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

        {/* render: 페이지네이션 */}
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
