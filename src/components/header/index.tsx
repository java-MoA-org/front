import "./style.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import moaHeaderLogo from "../../assets/images/moa_main_logo.png";
import userImg from "../../assets/images/ex-user1.png";
import cameraIcon from "../../assets/images/camera.png";
<<<<<<< HEAD
import sessionIcon from "../../assets/images/session.png";
=======
>>>>>>> 786eea0059da45f0c2c64b7b1a87e6bc507ac650
import {
  ACCESS_TOKEN,
  BOARD_ABSOLUTE_PATH,
  BOARD_PATH,
  BOARD_WRITE_ABSOLUTE_PATH,
  DAILY_ABSOLUTE_PATH,
  DAILY_PATH,
  DAILY_WRITE_ABSOLUTE_PATH,
  REFRESH_TOKEN,
  ROOT_PATH,
  USED_TRADE_ABSOLUTE_PATH,
  USED_TRADE_PATH,
<<<<<<< HEAD
  USED_TRADE_WRITE_ABSOLUTE_PATH,
} from "../../constants";
import { useCookies } from "react-cookie";
import useSignInUserStore from "../../stores/sign-in-user.store";
import { refreshAccessTokenRequest, userSignOutRequest } from "../../apis";
=======
  USED_TRADE_WRITE_ABSOLUTE_PATH
} from "../../constants";
import { Cookies, useCookies } from "react-cookie";
import useSignInUserStore from "../../stores/sign-in-user.store";
import { refreshAccessTokenRequest, userSignOutRequest } from "../../apis";
import { access } from "fs";
>>>>>>> 786eea0059da45f0c2c64b7b1a87e6bc507ac650
import useSessionTimerStore from "../../stores/session-timer.store";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 세션 타이머 관련 store
  const { timeLeft, setTimeLeft, decreaseTimeLeft, resetTime } = useSessionTimerStore();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [cookies, _, removeCookie] = useCookies();
  const { userNickname, userEmail, userProfileImage, resetUser } = useSignInUserStore();

  const accessToken = cookies[ACCESS_TOKEN];
  const refreshToken = cookies[REFRESH_TOKEN];

  const [isLoggingOut, setIsLoggingOut] = useState(false); // 로그아웃 여부 판단

  // 로그아웃 처리
  const onSignOutClickHandler = () => {
    setIsLoggingOut(true); // 로그아웃 시작
    userSignOutRequest(accessToken);
    removeCookie(ACCESS_TOKEN, { path: ROOT_PATH });
    removeCookie(REFRESH_TOKEN, { path: ROOT_PATH });
    localStorage.clear();
    resetUser();
    navigate("/");
  };

  // 세션 연장 요청
  const onExtendSessionClickHandler = async () => {
    const expirationTime = await refreshAccessTokenRequest();
    if (expirationTime == null) {
      removeCookie(ACCESS_TOKEN, { path: ROOT_PATH });
      removeCookie(REFRESH_TOKEN, { path: ROOT_PATH });
      localStorage.clear();
      resetUser();
      alert("인증 정보가 만료되어 연장할 수 없습니다.");
      window.location.reload();
      return;
    }

    setTimeLeft(parseInt(expirationTime, 10));
  };

  // 1초마다 세션 감소
  useEffect(() => {
    const timer = setInterval(() => {
      decreaseTimeLeft();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 세션 만료 시 처리 (로그아웃 상태일 때는 제외)
  useEffect(() => {
<<<<<<< HEAD
    if (!accessToken || isLoggingOut || timeLeft === -1) return;
  
    if (timeLeft === 0) {
=======
    if (accessToken) {
      return;
    }
    if (accessToken && timeLeft === 0) {
>>>>>>> 786eea0059da45f0c2c64b7b1a87e6bc507ac650
      resetTime();
      alert("세션이 만료되었습니다.");
      removeCookie(ACCESS_TOKEN);
      removeCookie(REFRESH_TOKEN);
      localStorage.clear();
      navigate("/");
    }
  }, [timeLeft]);

<<<<<<< HEAD
  // 페이지 이동 시 세션 연장
=======
  useEffect(() => {
    if (accessToken) {
      onExtendSessionClickHandler();
    }
  }, [location.pathname]);

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

>>>>>>> 786eea0059da45f0c2c64b7b1a87e6bc507ac650
  useEffect(() => {
    if (accessToken) {
      onExtendSessionClickHandler();
    }
  }, [location.pathname]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 타이머 포맷
  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="header-wrapper">
      {/* 상단 로고 및 유저 영역 */}
      <div className="header-top">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={moaHeaderLogo} className="logo-img" alt="로고" />
        </div>

        <div className="user-info">
          <span onClick={() => navigate("/message")}>💬</span>
          <span>⭐</span>
          <div className="profile-wrapper" ref={dropdownRef}>
            <img
<<<<<<< HEAD
              src={userProfileImage || userImg}
=======
              src={userImg}
>>>>>>> 786eea0059da45f0c2c64b7b1a87e6bc507ac650
              className="profile-img"
              onClick={() => setDropdownOpen((prev) => !prev)}
              alt="프로필"
            />
            {dropdownOpen && (
              <div className="user-dropdown">
                <div className="profile-img-container">
                  <img
                    src={userProfileImage || userImg}
                    className="dropdown-profile-img"
                    onClick={() => {
                      setDropdownOpen(false);
<<<<<<< HEAD
                      navigate(`/userpage/${userNickname}`);
=======
                      navigate("/mypage");
>>>>>>> 786eea0059da45f0c2c64b7b1a87e6bc507ac650
                    }}
                    alt="드롭다운 프로필"
                  />
                  <img
                    src={cameraIcon}
                    className="camera-icon"
                    onClick={() => {
                      setDropdownOpen(false);
<<<<<<< HEAD
                      navigate(`/userpage/${userNickname}`);
=======
                      navigate("/mypage");
>>>>>>> 786eea0059da45f0c2c64b7b1a87e6bc507ac650
                    }}
                    alt="카메라 변경 아이콘"
                  />
                </div>
                <div className="dropdown-info">
                  <strong>{userNickname}</strong>님
                  <p className="dropdown-email">{userEmail}</p>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
<<<<<<< HEAD
                      navigate(`/userpage/${userNickname}`);
=======
                      navigate("/mypage");
>>>>>>> 786eea0059da45f0c2c64b7b1a87e6bc507ac650
                    }}
                  >
                    마이페이지
                  </button>
                  <button onClick={onSignOutClickHandler}>로그아웃</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 메뉴 네비게이션 */}
      <div className="nav-container">
        <nav className="nav">
          {["게시판", "일상", "중고거래", "공지사항"].map((menu) => (
            <div
              className="nav-item"
              key={menu}
              onMouseEnter={() => setActiveMenu(menu)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                onClick={() => {
                  if (menu === "게시판") navigate(BOARD_ABSOLUTE_PATH);
                  if (menu === "일상") navigate(DAILY_ABSOLUTE_PATH);
                  if (menu === "중고거래") navigate(USED_TRADE_ABSOLUTE_PATH);
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
                      <p onClick={() => navigate(BOARD_WRITE_ABSOLUTE_PATH)}>게시글 작성</p>
                      <p onClick={() => navigate("/board")}>내 게시글 보기</p>
                    </>
                  )}
                  {menu === "일상" && (
                    <>
                      <p onClick={() => navigate(DAILY_WRITE_ABSOLUTE_PATH)}>일상글 작성</p>
                      <p onClick={() => navigate("/daily")}>내 일상글 보기</p>
                    </>
                  )}
                  {menu === "중고거래" && (
                    <>
                      <p onClick={() => navigate(USED_TRADE_WRITE_ABSOLUTE_PATH)}>판매글 작성</p>
                      <p onClick={() => navigate("/trade")}>내 판매글 관리</p>
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

        {/* 오른쪽 세션 및 검색 영역 */}
        <div className="nav-right">
          {refreshToken && accessToken && (
            <div className="session-container">
              <img src={sessionIcon} alt="세션 아이콘" className="session-icon" />
              <span className="session-time">세션 남은시간 : {formatTime(timeLeft)}</span>
<<<<<<< HEAD
              <button className="session-extend-button" onClick={onExtendSessionClickHandler}>
                연장
              </button>
=======
              <div className="session-button" onClick={onExtendSessionClickHandler}>
                {" "}
                세션 연장하기
              </div>
>>>>>>> 786eea0059da45f0c2c64b7b1a87e6bc507ac650
            </div>
          )}
          <input className="friend-search" placeholder="친구 검색" />
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div id="main">
        <Outlet />
      </div>
    </div>
  );
};

export default Header;