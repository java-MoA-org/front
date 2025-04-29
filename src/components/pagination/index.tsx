import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

// interface: 페이지네이션 컴포넌트 속성 정의 //
interface Props {
  currentPage: number;
  currentSection: number;
  totalSection: number;
  totalPages: number;
  pageList: number[];
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setCurrentSection: React.Dispatch<React.SetStateAction<number>>;
  basePath: string;
  queryParams?: Record<string, string>;
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
