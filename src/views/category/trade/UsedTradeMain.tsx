import React, { useEffect, useRef, useState } from "react";
import "./UsedTradeMain.css";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import useSignInUserStore from "../../../stores/sign-in-user.store";
import { Trade } from "../../../types/interfaces";
import { useElapsedTime, usePagination } from "../../../hooks";
import { ACCESS_TOKEN, USED_TRADE_VIEW_ABSOLUTE_PATH, USED_TRADE_WRITE_ABSOLUTE_PATH } from "../../../constants";
import { GetUsedTradeListResponseDto } from "../../../apis/dto/response/usedtrade";
import ResponseDto from "../../../apis/dto/response/response.dto";
import { getUsedTradeListRequest, searchUsedTradeRequest } from "../../../apis";
import Pagination from "../../../components/pagination";
import locationIcon from '../../../assets/images/place.png';
import likeIcon from '../../../assets/images/tradeLike.png';
import viewsIcon from '../../../assets/images/tradeViews.png';
import searchIcon from '../../../assets/images/search.png';
import saleIcon from '../../../assets/images/sale.png';
import myShopIcon from '../../../assets/images/my-shop.png';


// interface: 중고거래글 테이블 레코드 컴포넌트 속성 //
interface TableItemProps {
  trade: Trade;
}

// component: 중고거래글 테이블 레코드 컴포넌트 //
function TableItem({ trade }: TableItemProps) {

  // destructuring: 중고거래글 정보 추출 //
  const { price, title, tradeSequence, creationDate, views, likeCount, userNickname, thumbnailImage, profileImage, usedItemStatusTag, location, itemTypeTag } = trade;

  // hook: 작성 시간 계산 //
  const elapsedTime = useElapsedTime(creationDate);

  // function: 물건 상태를 한글로 변환하는 함수 //
  const getTagInKorean = (usedItemStatusTag: string) => {
    switch(usedItemStatusTag) {
      case 'NEW': return '새상품';
      case 'LIKE_NEW': return '사용감 거의 없음';
      case 'USED': return '사용감 있음';
      case 'DAMAGED': return '파손/고장 있음';
      default: return usedItemStatusTag;
    }
  };

  const tagInKorean = getTagInKorean(usedItemStatusTag);

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // event handler: 레코드 클릭 이벤트 처리 //
  const onClick = () => {
    navigator(USED_TRADE_VIEW_ABSOLUTE_PATH(tradeSequence));
  };
  console.log(USED_TRADE_VIEW_ABSOLUTE_PATH(tradeSequence));

  // render: 중고거래글 테이블 레코드 컴포넌트 렌더링 //
  return (
    <div className="trade-item" onClick={onClick}>
      <div className="item-container">
        <img src={likeIcon} alt="좋아요 이미지" className="like-icon" />
        <span className="like-count">{likeCount}</span>
        <div className="block">|</div>
        <img src={viewsIcon} alt="조회수 이미지" className="view-icon" />
        <span className="view-count">{views}</span>
      </div>
      <div className="thumbnail-image">{thumbnailImage}</div>
      <div className="profile-list">
        <img src={profileImage} alt="프로필 이미지" className="trade-profile-image" />
        <div className="user-nickname">{userNickname}</div>
      </div>
      <div className="item-status">{tagInKorean}</div>
      <div className="title">{title}</div>
      <div className="content-container">
        <div className="price">{price.toLocaleString()}원</div>
        <div className="creation-date">{elapsedTime}</div>
      </div>
      <div className="location"><img src={locationIcon} alt="location" className="icon" /> {location}</div>
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

  // state: 드롭다운 열기/닫기 상태 //
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // variable: 드롭다운 영역을 참조하기 위한 변수 //
  const dropdownRef = useRef<HTMLUListElement>(null);

  // variable: 페이지 번호 //
  const page = parseInt(searchParams.get('page') || '1', 10);

  // function: 네비게이션 함수 //
  const navigate = useNavigate();

  // function: 드롭다운 토글
  const toggleDropdown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsDropdownOpen(prev => !prev);
  };

  // variable: 쿼리 파라미터 //
  const queryParams = new URLSearchParams(location.search);

  // variable: 정렬 기준 //
  const sort = queryParams.get('sort') || 'LATEST';

  // variable: 태그 기준 //
  const tag = queryParams.get('tag') || 'ALL';

  // state: 카테고리 선택 상태 //
  const [selectedCategory, setSelectedCategory] = useState(tag);

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
      alert("로그인이 필요합니다.");
      navigate('/auth');
      return;
    }
    navigate(USED_TRADE_WRITE_ABSOLUTE_PATH);
  };

  // event handler: 카테고리 탭 클릭 //
  const onCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearchParams({ tag: category, page: '1', sort });
    window.location.reload();
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

  // effect: 바깥 클릭 시 드롭다운 닫기 //
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  // effect: 컴포넌트 렌더링 시 게시글 목록 요청 //
  useEffect(() => {
    if(searchQuery) return;
    getUsedTradeListRequest(tag, page, sort, accessToken).then(getUsedTradeListResponse);
  }, [tag, page, sort, accessToken]);
  
  // render: 중고거래 게시판 컴포넌트 렌더링 //
  return (
    <div id="trade-main-wrapper">

      {/* 검색 바 */}
      <div className="trade-search-bar">
        <input
          type="text"
          placeholder="검색어를 입력해주세요."
          className="trade-search-input"
          value={searchQuery}
          onChange={onSearchQueryChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearchClick();
            }
          }}
        />
        <img src={searchIcon}  className="trade-search-button" onClick={onSearchClick} />
      </div>
      <div className="used-trade-main">

        {/* 카테고리 및 정렬 기능 */}
        <div className="order-category-container">
          <div className="trade-category-icon" onClick={toggleDropdown} />
          {isDropdownOpen && (
            <ul ref={dropdownRef} className="trade-category-dropdown">
              <li onClick={() => onCategoryClick('ALL')}>전체</li>
              <li onClick={() => onCategoryClick('ETC')}>기타</li>
              <li onClick={() => onCategoryClick('ELECTRONICS')}>전자기기</li>
              <li onClick={() => onCategoryClick('CLOTHING')}>의류</li>
              <li onClick={() => onCategoryClick('FURNITURE')}>가구</li>
              <li onClick={() => onCategoryClick('BOOKS')}>도서</li>
              <li onClick={() => onCategoryClick('BEAUTY')}>뷰티/미용</li>
              <li onClick={() => onCategoryClick('SPORTS')}>운동/스포츠</li>
              <li onClick={() => onCategoryClick('FOOD')}>식품</li>
            </ul>
          )}
          <div className="trade-item-container">
            <div className="write-button" onClick={onWriteButtonClick}>
              <img src={saleIcon} alt="작성 버튼 이미지" className="write-icon" />
              <span className="write">판매하기</span>
            </div>
            <div className="block">|</div>
            <div className="my-shop-button">
              <img src={myShopIcon} alt="내상점 아이콘" className="my-shop-icon" />
              <span className="my-shop">내상점</span>
            </div>
          </div>
          <div className="trade-order-list">
            <div className="up-to-date-order" onClick={() => onSortClick('LATEST')}>최신순</div>
            <div className="price-high-order" onClick={() => onSortClick('PRICE_HIGH')}>고가순</div>
            <div className="price-low-order" onClick={() => onSortClick('PRICE_LOW')}>저가순</div>
          </div>
        </div>

        {/* 판매글 리스트 목록 */}
        <div className="trade-list">
          {viewList.length === 0 ? (
            <div className="trade-empty">판매글이 없습니다.</div>
          ) : (
            viewList.map((trade) => (
              <TableItem key={trade.tradeSequence} trade={trade} />
            ))
          )}
        </div>

        {/* 페이지 네이션 */}
        <div className="trade-pagination">
          {totalSection !== 0 && (
            <Pagination
              currentPage={currentPage}
              currentSection={currentSection}
              totalSection={totalSection}
              totalPages={totalPages}
              pageList={pageList}
              setCurrentPage={setCurrentPage}
              setCurrentSection={setCurrentSection}
              basePath="/usedtrade"
              queryParams={{ tag, sort, searchQuery }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
