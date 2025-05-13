import "./style.css";
import { Link, useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  // event handler: 자주 묻는 질문 클릭 시 → 설명 탭
  const handleFAQClick = () => {
    navigate("/notice", { state: { tab: "설명" } });
  };

  // event handler: 공지사항 클릭 시 → 공지사항 탭
  const handleNoticeClick = () => {
    navigate("/notice", { state: { tab: "공지사항" } });
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* 서비스 정보 */}
        <div className="footer-section">
          <h4>MOA 정보</h4>
          <ul>
            <li>회사 소개</li>
            <li>이용약관</li>
            <li>개인정보 처리방침</li>
          </ul>
        </div>

        {/* 고객 지원 */}
        <div className="footer-section">
          <h4>고객 지원</h4>
          <ul>
            <li onClick={handleFAQClick} className="footer-clickable">
              자주 묻는 질문
            </li>
            <li onClick={handleNoticeClick} className="footer-clickable">
              공지사항
            </li>
            <li>문의하기: qwer1234@naver.com</li>
          </ul>
        </div>

        {/* 커뮤니티 */}
        <div className="footer-section">
          <h4>커뮤니티</h4>
          <ul>
            <li>
              <Link to="/board">게시판</Link>
            </li>
            <li>
              <Link to="/trade">중고거래</Link>
            </li>
            <li>
              <Link to="/diary">이웃 일기</Link>
            </li>
          </ul>
        </div>

        {/* 연락처 */}
        <div className="footer-section">
          <h4>연락처</h4>
          <ul>
            <li>Email: moa.service@moa.com</li>
            <li>주소: 서울특별시 성동구 성수동 1가</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">ⓒ 2025 MOA. All rights reserved.</div>
    </footer>
  );
}
