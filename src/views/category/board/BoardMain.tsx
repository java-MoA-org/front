import React from 'react';
import "./BoardMain.css";
import { Board } from '../../../types/interfaces';
import { BOARD_VIEW_ABSOLUTE_PATH, BOARD_WRITE_ABSOLUTE_PATH } from '../../../constants';
import { useNavigate } from 'react-router-dom';

// interface: 게시판 테이블 레코드 컴포넌트 속성 //
interface TableItemProps {
  board: Board;
}

// component: 게시판 테이블 레코드 컴포넌트 //
function TableItem({ board }: TableItemProps) {

  const { boardSequence, title, content, creationDate, views, likeCount, tag, userNickname, images, commentCount } = board;

  // variable: 태그 타입 클래스 //
  const tagTypeClass = `board-tag ${
    tag === '게임' ? 'GAME' :
    tag === '여행' ? 'TRAVEL' :
    tag === '운동' ? 'WORKOUT' :
    tag === '음악' ? 'MUSIC' :
    tag === '경제' ? 'ECONOMY' :
    tag === '패션' ? 'FASHION' :
    tag === '음식' ? 'FOOD' :
    tag === '자유' ? 'FREE' :
    tag === '전체' ? 'ALL' : ''
  }`;

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // event handler: 레코드 클릭 이벤트 처리 //
  const onClick = () => {
    navigator(BOARD_VIEW_ABSOLUTE_PATH(boardSequence));
  };

}
// component: 게시판 컴포넌트 //
export default function BoardMain() {

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // event handler: 작성하기 클릭 이벤트 처리 //
  const onWriteButtonClick = () => {
    navigator(BOARD_WRITE_ABSOLUTE_PATH);
  }

  // render: 게시판 컴포넌트 렌더링 //
  return (
    <div id='board-main-wrapper'>
      <div board-main>
        {/* 카테고리 탭 */}
        <div className='board-tag-tabs'>
          {["전체", "게임", "여행", "운동", "음악", "경제", "패션", "음식", "자유"].map((tab) => (
            <button key={tab} className="board-tab">{tab}</button>
          ))}
        </div>

        {/* 검색 */}
        <div className='board-search-bar'>
          <select className="board-search-select">
            <option>제목</option>
          </select>
          <input type="text" placeholder="검색어를 입력해주세요." className="board-search-input" />
          <button className="board-search-button">검색</button>
        </div>
        <div className='board-item-container'>
          <div className='board-write-button' onClick={onWriteButtonClick} >작성하기</div>
          <div className='board-order-list'>최신순 | 인기순</div>
        </div>

        {/* 게시글 목록 */}
        <div className='board-list'>
          <div className='top-list-content'>
            <div className='title'>제목</div>
            <div className='like-count'>🧡 11</div>
            <div className='view-count'>👁‍🗨 111</div>
          </div>
          <div className='board-content'>내 용</div>
          <div className='bottom-list-content'>
            <div className='category'>게임</div>
            <div className='creation-date'>50분 전</div>
            <div className='check-image'>🎞</div>
          </div>
        </div>

        {/* 페이지네이션 */}
        <div className='board-pagination'></div>
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