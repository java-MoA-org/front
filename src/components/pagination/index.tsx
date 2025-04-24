import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

// interface: 페이지네이션 컴포넌트 속성 정의 //
interface Props {
  currentPage: number; // 현재 페이지
  currentSection: number; // 현재 섹션 (1 ~ N)
  totalSection: number; // 전체 섹션 개수
  totalPages: number; // 전체 페이지 수
  pageList: number[]; // 현재 섹션에 보여줄 페이지 리스트
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>; // 페이지 변경 함수
  setCurrentSection: React.Dispatch<React.SetStateAction<number>>; // 섹션 변경 함수
  basePath: string; // 이동할 기본 경로 (예: /board, /daily)
  queryParams?: Record<string, string>; // 페이지 외 쿼리 파라미터 (tag, sort 등)
}

// component: 범용 페이지네이션 컴포넌트 //
export default function Pagination({
  currentPage, currentSection, totalSection, totalPages, pageList,
  setCurrentPage, setCurrentSection, basePath, queryParams = {}
}: Props) {
  const navigate = useNavigate();

  // function: 현재 페이지에 따라 클래스 설정 //
  const pageClass = (page: number) =>
    currentPage === page ? 'page active' : 'page';

  // function: query string 생성 (현재 페이지 포함) //
  const buildQuery = (page: number) => {
    const tag = queryParams.tag || 'ALL';
    const sort = queryParams.sort || 'LATEST';
    return `${basePath}?tag=${tag}&page=${page}&sort=${sort}`;
  };

  // event handler: 특정 페이지 클릭 시 //
  const onPageClickHandler = (page: number) => {
    setCurrentPage(page);
    navigate(buildQuery(page));
    window.location.reload();
  };

  // event handler: 이전 섹션 버튼 클릭 시 //
  const onPreSectionClickHandler = () => {
    if (currentSection <= 1) return;
    const newSection = currentSection - 1;
    const newPage = (newSection - 1) * 10 + 1;
    setCurrentSection(newSection);
    setCurrentPage(newPage);
    navigate(buildQuery(newPage));
    window.location.reload();
  };

  // event handler: 다음 섹션 버튼 클릭 시 //
  const onNextSectionClickHandler = () => {
    if (currentSection === totalSection) return;
    const newSection = currentSection + 1;
    const newPage = (newSection - 1) * 10 + 1;
    setCurrentSection(newSection);
    setCurrentPage(newPage);
    navigate(buildQuery(newPage));
    window.location.reload();
  };


  // render: 페이지네이션 UI 렌더링 //
  return (
    <div className='pagination-box'>
      {/* 이전 섹션 이동 버튼 */}
      <div className='pagination-button left' onClick={onPreSectionClickHandler} />

      {/* 페이지 번호 리스트 */}
      <div className='pagination'>
        {pageList.map((page, index) => (
          <div
            key={index}
            className={pageClass(page)}
            onClick={() => onPageClickHandler(page)}
          >
            {page}
          </div>
        ))}
      </div>

      {/* 다음 섹션 이동 버튼 */}
      <div className='pagination-button right' onClick={onNextSectionClickHandler} />
    </div>
  );
}
