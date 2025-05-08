import React, { useEffect, useState } from 'react';
import './BoardMain.css';
import { Board } from '../../../types/interfaces';
import { ACCESS_TOKEN, BOARD_VIEW_ABSOLUTE_PATH, BOARD_WRITE_ABSOLUTE_PATH } from '../../../constants';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { GetBoardListResponseDto } from '../../../apis/dto/response/board';
import ResponseDto from '../../../apis/dto/response/response.dto';
import { getBoardListRequest, searchBoardRequest } from '../../../apis';
import { useElapsedTime, usePagination } from '../../../hooks';
import Pagination from '../../../components/pagination';
import likeIcon from '../../../assets/images/likeClick.png';
import commentIcon from '../../../assets/images/comment.png';
import viewsIcon from '../../../assets/images/views.png';
import imageIcon from '../../../assets/images/image.png';

// interface: 게시판 테이블 레코드 컴포넌트 속성 //
interface TableItemProps {
  board: Board;
}

// component: 게시판 테이블 레코드 컴포넌트 //
function TableItem({ board }: TableItemProps) {
  // destructuring: 게시글 정보 추출 //
  const { boardSequence, title, content, creationDate, views, likeCount, tag, writerId, images, commentCount } = board;
  // hook: 작성 시간 계산 //
  const elapsedTime = useElapsedTime(creationDate);

  // function: 태그를 한글로 변환하는 함수 //
  const getTagInKorean = (tag: string) => {
    switch (tag) {
      case 'GAME':
        return '게임';
      case 'TRAVEL':
        return '여행';
      case 'WORKOUT':
        return '운동';
      case 'MUSIC':
        return '음악';
      case 'ECONOMY':
        return '경제';
      case 'FASHION':
        return '패션';
      case 'FOOD':
        return '음식';
      case 'FREE':
        return '자유';
      default:
        return tag;
    }
  };

  const tagInKorean = getTagInKorean(tag);

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: HTML 문자열에서 HTML 태그 제거 함수 //
  function stripHtmlTags(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  }

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
          <span className="view-count">
            <img src={viewsIcon} alt="Views" className="icon" /> {views}
          </span>
        </div>
      </div>
      <div className="board-content">
        {stripHtmlTags(content).length > 70 ? stripHtmlTags(content).slice(0, 70) + '...' : stripHtmlTags(content)}
      </div>
      <div className="board-footer">
        <div className="footer-left">
          <span className="category">{tagInKorean}</span>
          <span className="creation-date">{elapsedTime}</span>
          <span className="check-image">
            {images && images.length > 0 ? <img src={imageIcon} alt="icon" className="image-icon" /> : ''}
          </span>
        </div>
        <div className="footer-right">
          <span className="like-count">
            <img src={likeIcon} alt="Like" className="icon" /> {likeCount}
          </span>
          <span className="comment-count">
            <img src={commentIcon} alt="Comment" className="icon" /> {commentCount}
          </span>
        </div>
      </div>
    </div>
  );
}

// component: 게시판 컴포넌트 //
export default function BoardMain() {
  // state: 쿠키 상태 //
  const [cookies] = useCookies();

  // state: URL 쿼리 파라미터 //
  const [searchParams, setSearchParams] = useSearchParams();

  // state: 페이지네이션 상태 //
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSection, setCurrentSection] = useState(1);
  const [totalSection, setTotalSection] = useState(0);
  const [pageList, setPageList] = useState<number[]>([]);

  // state: 검색어 상태 추가 //
  const [searchQuery, setSearchQuery] = useState('');

  // state: 현재 위치 객체 //
  const location = useLocation();

  // variable: 페이지 번호 //
  const page = parseInt(searchParams.get('page') || '1', 10);

  // function: 네비게이션 함수 //
  const navigate = useNavigate();

  // variable: 쿼리 파라미터 //
  const queryParams = new URLSearchParams(location.search);

  // variable: 정렬 기준 //
  const sort = queryParams.get('sort') || 'LATEST';

  // variable: 태그 기준 //
  const tag = queryParams.get('tag') || 'ALL';

  // state: 카테고리 선택 상태 //
  const [selectedCategory, setSelectedCategory] = useState(tag);

  // hook: 페이지네이션 커스텀 훅 //
  const { setTotalList, viewList } = usePagination<Board>();

  // variable: 액세스 토큰 //
  const accessToken = cookies[ACCESS_TOKEN];

  // function: 게시글 목록 요청 응답 처리 //
  const getBoardListResponse = (responseBody: GetBoardListResponseDto | ResponseDto | null) => {
    const message = !responseBody
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'AF'
      ? '인증에 실패했습니다.'
      : responseBody.code === 'IP'
      ? '게시글이 존재하지 않습니다.'
      : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }

    const { boardList, totalElements, totalPages, currentPage, currentSection, totalSection, pageList } =
      responseBody as GetBoardListResponseDto;

    setTotalList(boardList);
    setTotalElements(totalElements);
    setTotalPages(totalPages);
    setCurrentPage(currentPage);
    setCurrentSection(currentSection);
    setTotalSection(totalSection);
    setPageList(pageList);
  };

  // event handler: 작성하기 버튼 클릭 //
  const onWriteButtonClick = () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate('/auth');
      return;
    }
    navigate(BOARD_WRITE_ABSOLUTE_PATH);
  };

  // event handler: 카테고리 탭 클릭 //
  const onCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearchParams({ tag: category, page: '1', sort });
  };

  // event handler: 정렬 기준 클릭 //
  const onSortClick = (newSort: string) => {
    setSearchParams({ tag, page: '1', sort: newSort });
  };

  // event handler: 검색어 입력 변경 //
  const onSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // event handler: 검색 버튼 클릭 //
  const onSearchClick = () => {
    if (searchQuery) {
      setSearchParams({ tag, searchQuery, page: '1' });
      searchBoardRequest(tag, searchQuery, page, accessToken).then(getBoardListResponse);
    }
  };

  // effect: 컴포넌트 로드시 게시글 목록 요청 //
  useEffect(() => {
    if (searchQuery) return;
    getBoardListRequest(tag, page, sort, accessToken).then(getBoardListResponse);
  }, []);

  // render: 게시판 컴포넌트 렌더링 //
  return (
    <div id="board-main-wrapper">
      <div className="board-main">
        {/* 카테고리 탭 */}
        <div className="board-category">
          <div
            className={`category-tab ${selectedCategory === 'ALL' ? 'active' : ''}`}
            onClick={() => onCategoryClick('ALL')}
          >
            전체
          </div>
          <div
            className={`category-tab ${selectedCategory === 'FREE' ? 'active' : ''}`}
            onClick={() => onCategoryClick('FREE')}
          >
            자유
          </div>
          <div
            className={`category-tab ${selectedCategory === 'GAME' ? 'active' : ''}`}
            onClick={() => onCategoryClick('GAME')}
          >
            게임
          </div>
          <div
            className={`category-tab ${selectedCategory === 'TRAVEL' ? 'active' : ''}`}
            onClick={() => onCategoryClick('TRAVEL')}
          >
            여행
          </div>
          <div
            className={`category-tab ${selectedCategory === 'WORKOUT' ? 'active' : ''}`}
            onClick={() => onCategoryClick('WORKOUT')}
          >
            운동
          </div>
          <div
            className={`category-tab ${selectedCategory === 'MUSIC' ? 'active' : ''}`}
            onClick={() => onCategoryClick('MUSIC')}
          >
            음악
          </div>
          <div
            className={`category-tab ${selectedCategory === 'ECONOMY' ? 'active' : ''}`}
            onClick={() => onCategoryClick('ECONOMY')}
          >
            경제
          </div>
          <div
            className={`category-tab ${selectedCategory === 'FASHION' ? 'active' : ''}`}
            onClick={() => onCategoryClick('FASHION')}
          >
            패션
          </div>
          <div
            className={`category-tab ${selectedCategory === 'FOOD' ? 'active' : ''}`}
            onClick={() => onCategoryClick('FOOD')}
          >
            음식
          </div>
        </div>

        {/* 검색 바 */}
        <div className="board-search-bar">
          <select className="board-search-select">
            <option>제목</option>
          </select>
          <input
            type="text"
            placeholder="검색어를 입력해주세요."
            className="board-search-input"
            value={searchQuery}
            onChange={onSearchQueryChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearchClick();
              }
            }}
          />
          <button className="board-search-button" onClick={onSearchClick}>
            검색
          </button>
        </div>

        {/* 게시글 작성 및 정렬 */}
        <div className="board-item-container">
          <div className="board-write-button" onClick={onWriteButtonClick}>
            작성하기
          </div>
          <div className="board-order-list">
            <div className="up-to-date-order" onClick={() => onSortClick('LATEST')}>
              최신순
            </div>
            <div className="views-order" onClick={() => onSortClick('VIEWS')}>
              조회순
            </div>
            <div className="likes-order" onClick={() => onSortClick('LIKES')}>
              인기순
            </div>
          </div>
        </div>

        {/* 게시글 리스트 */}
        <div className="board-list">
          {viewList.length === 0 ? (
            <div className="board-empty">게시글이 없습니다.</div>
          ) : (
            viewList.map((board) => <TableItem key={board.boardSequence} board={board} />)
          )}
        </div>

        {/* 페이지네이션 */}
        <div className="board-pagination">
          {totalSection !== 0 && (
            <Pagination
              currentPage={currentPage}
              currentSection={currentSection}
              totalSection={totalSection}
              totalPages={totalPages}
              pageList={pageList}
              setCurrentPage={setCurrentPage}
              setCurrentSection={setCurrentSection}
              basePath="/board"
              queryParams={{ tag, sort, searchQuery }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
