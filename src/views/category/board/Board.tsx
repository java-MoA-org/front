import React from 'react';
import "./Board.css";

// component: 게시판 컴포넌트 //
export default function Board() {

  // render: 게시판 컴포넌트 렌더링 //
  return (
    <div id="board-wrapper" className="board-wrapper">
      {/* 메인 콘텐츠 */}
      <div className="board-main">
        {/* 카테고리 탭 */}
        <div className="board-tabs">
          {["전체", "게임", "여행", "운동", "음악", "경제", "패션", "음식", "자유"].map((tab) => (
            <button key={tab} className="board-tab">{tab}</button>
          ))}
        </div>

        {/* 검색 영역 */}
        <div className="board-search">
          <select className="board-search-select">
            <option>제목</option>
          </select>
          <input type="text" placeholder="검색어를 입력해주세요." className="board-search-input" />
          <button className="board-search-button">검색</button>
        </div>

        {/* 게시글 목록 */}
        <div className="board-list">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="board-item">
              <div className="board-title">제목</div>
              <div className="board-meta">
                <span>카테고리</span>
                <span>| 50분 전</span>
                <span className="board-stats">
                  <span>💬 11</span>
                  <span>👁 175</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="board-pagination">
          {["< 이전", ...Array.from({ length: 10 }, (_, i) => `${i + 1}`), "다음 >"].map((label, i) => (
            <button key={i} className="board-page-btn">{label}</button>
          ))}
        </div>
      </div>

      {/* 인기글 사이드바 */}
      <aside className="board-sidebar">
        <div className="board-sidebar-title">💙 오늘의 인기 글</div>
        <ul className="board-sidebar-list">
          {[
            "친구없는 외딴의 모음",
            "서울에서 공방 관광했을때",
            "귀염보스간만!",
            "충청도 같이 학식분 모십니다",
            "귀염보스간만!",
            "충청도 같이 학식분 모십니다",
          ].map((title, i) => (
            <li key={i} className="board-sidebar-item">
              <span>{title}</span>
              <span>❤️ 11</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
