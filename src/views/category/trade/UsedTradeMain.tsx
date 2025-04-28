import React, { useEffect, useState } from "react";
import "./UsedTradeMain.css";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import useSignInUserStore from "../../../stores/sign-in-user.store";
import { Trade } from "../../../types/interfaces";
import { useElapsedTime, usePagination } from "../../../hooks";
import { ACCESS_TOKEN, USED_TRADE_VIEW_ABSOLUTE_PATH, USED_TRADE_WRITE_ABSOLUTE_PATH } from "../../../constants";
import { GetUsedTradeListResponseDto } from "../../../apis/dto/response/usedtrade";
import ResponseDto from "../../../apis/dto/response/response.dto";
import { getUsedTradeListRequest, searchUsedTradeRequest } from "../../../apis";

// interface: 중고거래글 테이블 레코드 컴포넌트 속성 //
interface TableItemProps {
  trade: Trade;
}

// component: 중고거래글 테이블 레코드 컴포넌트 //
function TableItem({ trade }: TableItemProps) {

  // destructuring: 중고거래글 정보 추출 //
  const { price, title, tradeSequence, creationDate } = trade;

  // hook: 작성 시간 계산 //
  const elapsedTime = useElapsedTime(creationDate);

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

 // function: HTML 문자열에서 HTML 태그 제거 함수 //
  function stripHtmlTags(html: string): string {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }  

  // event handler: 레코드 클릭 이벤트 처리 //
  const onClick = () => {
    navigator(USED_TRADE_VIEW_ABSOLUTE_PATH(tradeSequence));
  };

  // render: 중고거래글 테이블 레코드 컴포넌트 렌더링 //
  return (
    <div className="trade-item" onClick={onClick}>
      <h3 className="trade-title">{stripHtmlTags(title)}</h3>
      <p className="trade-price">가격: {price.toLocaleString()} 원</p>
      <p className="trade-time">작성 시간: {elapsedTime}</p>
    </div>
  );
}

// component: 중고거래 게시판 컴포넌트 //
export default function UsedTradeMain() {

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

  // variable: 액세스 토큰 //
  const accessToken = cookies[ACCESS_TOKEN];

  // hook: 페이지네이션 커스텀 훅 //
  const { setTotalList, viewList } = usePagination<Trade>();

  // function: 게시글 목록 요청 응답 처리 //
  const getUsedTradeListResponse = (responseBody: GetUsedTradeListResponseDto | ResponseDto | null) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '인증에 실패했습니다.' : 
      responseBody.code === 'IP' ? '판매글이 존재하지 않습니다.' : '';

    const isSuccess = responseBody !== null && responseBody.code === "SU";
    if (!isSuccess) {
      alert(message);
      return;
    }

    const { usedTradeList, totalElements, totalPages, currentPage, currentSection, totalSection, pageList } = responseBody as GetUsedTradeListResponseDto;

    setTotalList(usedTradeList);
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
      navigate('/auth');
      return;
    }
    navigate(USED_TRADE_WRITE_ABSOLUTE_PATH);
  };

  // event handler: 정렬 기준 클릭 //
  const onSortClick = (newSort: string) => {
    setSearchParams({ page: '1', sort: newSort });
    window.location.reload();
  };

  // event handler: 검색어 입력 변경 //
  const onSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // event handler: 검색 버튼 클릭 //
  const onSearchClick = () => {
    if (searchQuery) {
      setSearchParams({ searchQuery, page: '1' });
      searchUsedTradeRequest( tag, searchQuery, page, accessToken).then(getUsedTradeListResponse);
    }
  };

  // effect: 컴포넌트 렌더링 시 게시글 목록 요청 //
  useEffect(() => {
    if(searchQuery) return;
    getUsedTradeListRequest(tag, page, sort, accessToken).then(getUsedTradeListResponse);
  }, [tag, page, sort, accessToken]);
  
  // render: 중고거래 게시판 컴포넌트 렌더링 //
  return (
    <div className="trade-page">
      <h1 className="trade-title">💸 중고거래</h1>
      <p className="trade-description">여기는 중고거래 메인 페이지입니다.</p>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={onSearchQueryChange}
          className="search-input"
        />
        <button onClick={onSearchClick} className="search-button">검색</button>
      </div>

      <div className="sort-container">
        <button onClick={() => onSortClick('LATEST')} className="sort-button">최신순</button>
        <button onClick={() => onSortClick('PRICE_ASC')} className="sort-button">가격 낮은 순</button>
        <button onClick={() => onSortClick('PRICE_DESC')} className="sort-button">가격 높은 순</button>
      </div>

      <div className="trade-list">
        {viewList.map((trade) => (
          <TableItem key={trade.tradeSequence} trade={trade} />
        ))}
      </div>

      <button onClick={onWriteButtonClick} className="write-button">글 작성</button>
    </div>
  );
}
