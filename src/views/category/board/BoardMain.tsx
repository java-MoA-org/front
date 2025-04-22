import React, { useEffect } from 'react';
import './BoardMain.css';
import { Board } from '../../../types/interfaces';
import { ACCESS_TOKEN, BOARD_VIEW_ABSOLUTE_PATH, BOARD_WRITE_ABSOLUTE_PATH, BOARD_ABSOLUTE_PATH, GET_BOARD_LIST_URL } from '../../../constants';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { GetBoardListResponseDto } from '../../../apis/dto/response/board';
import ResponseDto from '../../../apis/dto/response/response.dto';
import { getBoardListRequest } from '../../../apis';
import { usePagination } from '../../../hooks';
import Pagination from '../../../components/pagination';

// interface: 게시판 테이블 레코드 컴포넌트 속성 //
interface TableItemProps {
  board: Board;
}

// component: 게시판 테이블 레코드 컴포넌트 //
function TableItem({ board }: TableItemProps) {
  const { boardSequence, title, content, creationDate, views, likeCount, tag, writerId, images, commentCount } = board;

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

  // render: 게시판 테이블 레코드 컴포넌트 렌더링 //
  return (
    <div className="board-item" onClick={onClick}>
      <div className="board-header">
        <div className="board-title">{title}</div>
        <div className="board-stats">
          <span className="view-count">👁‍🗨 {views}</span>
        </div>
      </div>
      <div className="board-content">
        {content.length > 100 ? content.slice(0, 100) + '...' : content}
      </div>
      <div className="board-footer">
        <div className="footer-left">
          <span className="category">{tag}</span>
          <span className="creation-date">{creationDate}</span>
          <span className="check-image">{images && images.length > 0 ? '🎞' : ''}</span>
        </div>
        <div className="footer-right">
          <span className="like-count">🧡 {likeCount}</span>
          <span className="comment-count">💬 {commentCount}</span>
        </div>
      </div>
    </div>
  );
}

// component: 게시판 컴포넌트 //
export default function BoardMain() {
  const [cookies] = useCookies();
  const location = useLocation();
  const navigate = useNavigate();

  // 쿼리 파라미터에서 값을 가져오기
  const queryParams = new URLSearchParams(location.search);
  const sort = queryParams.get('sort') || 'LATEST';
  const tag = queryParams.get('tag') || 'ALL';
  const page = parseInt(queryParams.get('page') || '1', 10);

  // 페이지네이션 상태
  const {
    currentPage, setCurrentPage, currentSection, setCurrentSection,
    totalSection, setTotalList, viewList, pageList
  } = usePagination<Board>();

  // variable: access token //
  const accessToken = cookies[ACCESS_TOKEN];

  // function: get board response 처리 함수 //
  const getBoardListResponse = (responseBody: GetBoardListResponseDto | ResponseDto | null) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '인증에 실패했습니다.' : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }

    const { boardList } = responseBody as GetBoardListResponseDto;
    setTotalList(boardList);
  };

  // event handler: 작성하기 클릭 이벤트 처리 //
  const onWriteButtonClick = () => {
    if (!accessToken) {
      navigate('/auth');
    } 

    navigate(BOARD_WRITE_ABSOLUTE_PATH);
  };

  // event handler: 카테고리 탭 클릭 이벤트 처리 //
  const onCategoryClick = (category: string) => {
    // GET_BOARD_LIST_URL 사용하여 URL 생성
    const url = GET_BOARD_LIST_URL(category, 1, sort);
    navigate(url);
  };

  // event handler: 페이지 변경 시 처리 //
  const onPageChange = (page: number) => {
    setCurrentPage(page);
    const url = GET_BOARD_LIST_URL(tag, page, sort);
    navigate(url);
  };

  // effect: 컴포넌트 로드시 실행할 함수 //
  useEffect(() => {
    console.log(GET_BOARD_LIST_URL('ALL', 1, 'LATEST'));
    getBoardListRequest(tag, page, sort, accessToken)
      .then(getBoardListResponse);
  }, [tag, page, sort, accessToken]);

  // render: 게시판 컴포넌트 렌더링 //
  return (
    <div id="board-main-wrapper">
      <div board-main>
        {/* 카테고리 탭 */}
        <div className="board-category">
          <div className="all" onClick={() => onCategoryClick('ALL')}>전체</div>
          <div className="free" onClick={() => onCategoryClick('FREE')}>자유</div>
          <div className="game" onClick={() => onCategoryClick('GAME')}>게임</div>
          <div className="travel" onClick={() => onCategoryClick('TRAVEL')}>여행</div>
          <div className="work-out" onClick={() => onCategoryClick('WORKOUT')}>운동</div>
          <div className="music" onClick={() => onCategoryClick('MUSIC')}>음악</div>
          <div className="economy" onClick={() => onCategoryClick('ECONOMY')}>경제</div>
          <div className="fashion" onClick={() => onCategoryClick('FASHION')}>패션</div>
          <div className="food" onClick={() => onCategoryClick('FOOD')}>음식</div>
        </div>

        {/* 검색 */}
        <div className="board-search-bar">
          <select className="board-search-select">
            <option>제목</option>
          </select>
          <input type="text" placeholder="검색어를 입력해주세요." className="board-search-input" />
          <button className="board-search-button">검색</button>
        </div>

        <div className="board-item-container">
          <div className="board-write-button" onClick={onWriteButtonClick}>작성하기</div>
          <div className="board-order-list">
            <div className="up-to-date-order">최신순</div>
            <div className="popularity-order">인기순</div>
          </div>
        </div>

        {/* 게시글 목록 */}
        <div className="board-list">
          {viewList.length === 0 ? (
            <div className="board-empty">게시글이 없습니다.</div>
          ) : (
            viewList.map((board) => (
              <TableItem key={board.boardSequence} board={board} />
            ))
          )}
        </div>

        {/* 페이지네이션 */}
        <div className="board-pagination">
          {totalSection !== 0 &&
            <Pagination 
              currentPage={currentPage}
              currentSection={currentSection}
              totalSection={totalSection}
              pageList={pageList}
              setCurrentPage={setCurrentPage}
              setCurrentSection={setCurrentSection}
            />
            }
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
