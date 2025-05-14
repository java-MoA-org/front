import React, { useEffect, useState } from "react";
import "./DailyMain.css";
import { Daily } from "../../../types/interfaces";
import { useElapsedTime, usePagination } from "../../../hooks";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ACCESS_TOKEN, DAILY_VIEW_ABSOLUTE_PATH, DAILY_WRITE_ABSOLUTE_PATH } from "../../../constants";
import { useCookies } from "react-cookie";
import { GetDailyListResponseDto } from "../../../apis/dto/response/daily";
import ResponseDto from "../../../apis/dto/response/response.dto";
import { getDailyListRequest, searchDailyRequest } from "../../../apis";
import Pagination from "../../../components/pagination";
import likeIcon from '../../../assets/images/likeClick.png';
import commentIcon from '../../../assets/images/comment.png';
import viewsIcon from '../../../assets/images/views.png';

// interface: 일상 게시판 테이블 레코드 컴포넌트 속성 //
interface TableItemProps {
  daily: Daily;
}

// component: 일상 게시판 테이블 레코드 컴포넌트 //
function TableItem({ daily }: TableItemProps) {

  // destructuring: 게시글 정보 추출 //
  const { dailySequence, title, content, creationDate, views, likeCount, images, commentCount, userNickname, profileImage } = daily;

  // hook: 작성 시간 계산 //
  const elapsedTime = useElapsedTime(creationDate);

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  function stripHtmlTags(html: string): string {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }

  const thumbnailUrl = images[0];

  // event handler: 레코드 클릭 이벤트 처리 //
  const onClick = () => {
    navigator(DAILY_VIEW_ABSOLUTE_PATH(dailySequence));
  };

  // render: 일상 게시판 테이블 레코드 컴포넌트 렌더링 //
  return (
    <div className="daily-item" onClick={onClick}>
      <img src={thumbnailUrl} alt="thumbnail" className="daily-thumbnail" />
      <div className="daily-header">
        <div className="daily-title">{title}</div>
        <div className="daily-stats">
          <span className="view-count">
            <img src={viewsIcon} alt="Views" className="icon" /> {views}
          </span>
        </div>
      </div>
      <div className="daily-content">
        {stripHtmlTags(content).length > 70
          ? stripHtmlTags(content).slice(0, 70) + "..."
          : stripHtmlTags(content)}
      </div>
      <div className="daily-footer">
        <div className="footer-left">
          <span className="creation-date">{elapsedTime}</span>
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

// component: 일상 게시판 컴포넌트 //
export default function DailyMain() {

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

  // variable: 쿼리 파라미터 //
  const queryParams = new URLSearchParams(location.search);

  // variable: 정렬 기준 //
  const sort = queryParams.get('sort') || 'LATEST';

  // variable: 액세스 토큰 //
  const accessToken = cookies[ACCESS_TOKEN];

  // hook: 페이지네이션 커스텀 훅 //
  const { setTotalList, viewList, } = usePagination<Daily>();

  // function: 네비게이션 함수 //
  const navigate = useNavigate();

  // function: 일상 게시글 목록 요청 응답 처리 //
  const getDailyListResponse = (responseBody: GetDailyListResponseDto | ResponseDto | null ) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '인증에 실패했습니다.' : 
      responseBody.code === 'IP' ? '게시글이 존재하지 않습니다.' : '';

    const isSuccess = responseBody !== null && responseBody.code === "SU";
    if (!isSuccess) {
      alert(message);
      return;
    }

    const { dailyList, totalElements, totalPages, currentPage, currentSection, totalSection, pageList } = responseBody as GetDailyListResponseDto;

    setTotalList(dailyList);
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
    navigate(DAILY_WRITE_ABSOLUTE_PATH);
  };

  // event handler: 정렬 기준 클릭 //
  const onSortClick = (newSort: string) => {
    setSearchParams({ page: '1', sort: newSort });
  };

  // event handler: 검색어 입력 변경 //
  const onSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // event handler: 검색 버튼 클릭 //
  const onSearchClick = () => {
    if (searchQuery) {
      setSearchParams({searchQuery, page: '1' });
      searchDailyRequest(searchQuery, page, accessToken).then(getDailyListResponse);
    }
  };

  // effect: 컴포넌트 로드시 일상 게시글 목록 요청 //
  useEffect(() => {
    if(searchQuery) return;
    getDailyListRequest(page, sort, accessToken).then(getDailyListResponse);
  }, [currentPage, sort, searchQuery]);

  // component: 일상 게시판 컴포넌트 렌더링 //
  return (
    <div id="daily-main-wrapper">
      <div className="daily-main">
        {/* 검색 바 */}
        <div className="daily-search-bar">
          <select className="daily-search-select">
            <option>제목</option>
          </select>
          <input
            type="text"
            placeholder="검색어를 입력해주세요."
            className="daily-search-input"
            value={searchQuery}
            onChange={onSearchQueryChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearchClick();
              }
            }}
          />
          <button className="daily-search-button" onClick={onSearchClick}>검색</button>
        </div>

        {/* 게시글 작성 및 정렬 */}
        <div className="daily-item-container">
          <div className="daily-write-button" onClick={onWriteButtonClick}>
            작성하기
          </div>
          <div className="daily-order-list">
            <div className="up-to-date-order" onClick={() => onSortClick('LATEST')}>최신순</div>
            <div className="views-order" onClick={() => onSortClick('VIEWS')}>조회순</div>
            <div className="likes-order" onClick={() => onSortClick('LIKES')}>인기순</div>
          </div>
        </div>

        {/* 게시글 리스트 */}
        <div className="daily-list">
          {viewList.length === 0 ? (
            <div className="daily-empty">게시글이 없습니다.</div>
          ) : (
            viewList.map((daily) => (
              <TableItem key={daily.dailySequence} daily={daily} />
            ))
          )}
        </div>

        {/* 페이지네이션 */}
        <div className="daily-pagination">
          {totalSection !== 0 && (
            <Pagination
              currentPage={currentPage}
              currentSection={currentSection}
              totalSection={totalSection}
              totalPages={totalPages}
              pageList={pageList}
              setCurrentPage={setCurrentPage}
              setCurrentSection={setCurrentSection}
              basePath="/daily"
              queryParams={{ sort }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
