import "./style.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import moaHeaderLogo from "../../assets/images/moa_main_logo.png";
import userImg from "../../assets/images/ex-user1.png";
import cameraIcon from "../../assets/images/camera.png";

const Header = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  // session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="header-wrapper">
      <div className="header-top">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={moaHeaderLogo} className="logo-img" alt="로고" />
        </div>

        <div className="user-info">
          <span onClick={() => navigate("/message")}>💬</span>
          <span>⭐</span>
          <div className="profile-wrapper" ref={dropdownRef}>
            <img
              src={userImg}
              className="profile-img"
              onClick={() => setDropdownOpen((prev) => !prev)}
              alt="프로필"
            />
            {dropdownOpen && (
              <div className="user-dropdown">
                <div className="profile-img-container">
                  <img
                    src={userImg}
                    className="dropdown-profile-img"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/mypage");
                    }}
                    alt="드롭다운 프로필"
                  />
                  <img
                    src={cameraIcon}
                    className="camera-icon"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/mypage");
                    }}
                    alt="카메라 변경 아이콘"
                  />
                </div>
                <div className="dropdown-info">
                  <strong>LYS</strong>님
                  <p className="dropdown-email">sella45@naver.com</p>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/mypage");
                    }}
                  >
                    마이페이지
                  </button>
                  <button onClick={() => alert("로그아웃 기능 구현 예정")}>
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="nav-container">
        <nav className="nav">
          {["게시판", "일기", "중고거래", "공지사항"].map((menu) => (
            <div
              className="nav-item"
              key={menu}
              onMouseEnter={() => setActiveMenu(menu)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                onClick={() => {
                  if (menu === "게시판") navigate("/board");
                  if (menu === "일기") navigate("/diary");
                  if (menu === "중고거래") navigate("/trade");
                  if (menu === "공지사항") navigate("/notice");
                }}
              >
                {menu}
              </button>
              {activeMenu === menu && (
                <div className="dropdown-fix">
                  <h4>{menu}</h4>
                  {menu === "게시판" && (
                    <>
                      <p onClick={() => navigate("/board")}>자유게시판</p>
                      <p onClick={() => navigate("/board")}>익명게시판</p>
                      <p onClick={() => navigate("/board")}>후기게시판</p>
                    </>
                  )}
                  {menu === "일기" && (
                    <>
                      <p onClick={() => navigate("/diary")}>일기 작성</p>
                      <p onClick={() => navigate("/diary")}>이웃 일기 보기</p>
                      <p onClick={() => navigate("/diary")}>내 일기 보기</p>
                    </>
                  )}
                  {menu === "중고거래" && (
                    <>
                      <p onClick={() => navigate("/trade")}>판매글</p>
                      <p onClick={() => navigate("/trade")}>구매글</p>
                      <p onClick={() => navigate("/trade")}>거래완료</p>
                    </>
                  )}
                  {menu === "공지사항" && (
                    <>
                      <p onClick={() => navigate("/notice")}>설명</p>
                      <p onClick={() => navigate("/notice")}>이용방법</p>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="nav-right">
          <span className="session-time">세션 남은시간 : {formatTime(timeLeft)}</span>
          <input className="friend-search" placeholder="친구 검색" />
        </div>
      </div>

      <div id="main">
        <Outlet />
      </div>
    </div>
  );
};

export default Header;