import "./style.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { searchUserRequest } from "../../apis"; // 친구 검색 API 요청
import moaHeaderLogo from "../../assets/images/moa_main_logo.png";
import userImg from "../../assets/images/default-profile.png";
import cameraIcon from "../../assets/images/camera.png";
import sessionIcon from "../../assets/images/session.png";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ROOT_PATH,
  BOARD_ABSOLUTE_PATH,
  DAILY_ABSOLUTE_PATH,
  USED_TRADE_ABSOLUTE_PATH,
} from "../../constants";
import { useCookies } from "react-cookie";
import useSignInUserStore from "../../stores/sign-in-user.store";
import { refreshAccessTokenRequest, userSignOutRequest } from "../../apis";
import useSessionTimerStore from "../../stores/session-timer.store";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { timeLeft, setTimeLeft, decreaseTimeLeft, resetTime } = useSessionTimerStore();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]); // 유저 정보 포함
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const [cookies, _, removeCookie] = useCookies();
  const { userNickname, userEmail, userProfileImage, resetUser } = useSignInUserStore();

  const accessToken = cookies[ACCESS_TOKEN];
  const refreshToken = cookies[REFRESH_TOKEN];

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 로그아웃
  const onSignOutClickHandler = () => {
    setIsLoggingOut(true);
    userSignOutRequest(accessToken);
    removeCookie(ACCESS_TOKEN, { path: ROOT_PATH });
    removeCookie(REFRESH_TOKEN, { path: ROOT_PATH });
    localStorage.clear();
    resetUser();
    navigate("/");
  };

  // 세션 연장
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

  // 친구 검색
  useEffect(() => {
    if (!searchKeyword.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const fetchUsers = async () => {
      if (!accessToken) {
        console.warn("accessToken이 없습니다. 요청 중단");
        return;
      }

      try {
        const response = await searchUserRequest(searchKeyword, accessToken);

        if (Array.isArray(response)) {
          // 프로필 이미지와 닉네임을 포함한 검색 결과
          setSearchResults(response.map((user: any) => ({
            userNickname: user.userNickname,
            userProfileImage: user.userProfileImage || userImg // 프로필 이미지가 없으면 기본 이미지
          })));
          setShowSearchDropdown(true);
        }
      } catch (error) {
        console.error("친구 검색 중 에러:", error);
      }
    };

    fetchUsers();
  }, [searchKeyword]);

  // 1초마다 세션 감소
  useEffect(() => {
    const timer = setInterval(() => {
      decreaseTimeLeft();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 세션 만료 시 처리
  useEffect(() => {
    if (!accessToken || isLoggingOut || timeLeft === -1) return;
    if (accessToken && timeLeft === 0) {
      resetTime();
      alert("세션이 만료되었습니다.");
      removeCookie(ACCESS_TOKEN);
      removeCookie(REFRESH_TOKEN);
      localStorage.clear();
      navigate("/");
    }
  }, [timeLeft]);

  // 페이지 이동 시 세션 연장
  useEffect(() => {
    if (accessToken) {
      onExtendSessionClickHandler();
    }
  }, [location.pathname]);

  // 프로필 드롭다운 외부 클릭 시 닫기
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
      {/* 상단 로고 및 유저 */}
      <div className="header-top">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={moaHeaderLogo} className="logo-img" alt="로고" />
        </div>

        <div className="user-info">
          <span onClick={() => navigate("/message")}>💬</span>
          <span>⭐</span>

          <div className="profile-wrapper" ref={dropdownRef}>
            <img
              src={userProfileImage ? `http://localhost:4000/profile/file/${userProfileImage}` : userImg} // 프로필 이미지 처리
              className="profile-img"
              onClick={() => setDropdownOpen((prev) => !prev)}
              alt="프로필"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                (e.target as HTMLImageElement).src = userImg;  // 이미지 로딩 실패시 기본 이미지로 대체
              }}
            />
            {dropdownOpen && (
              <div className="user-dropdown">
                <div className="profile-img-container">
                  <img
                    src={userProfileImage || userImg} // 드롭다운 이미지 표시
                    className="dropdown-profile-img"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate(`/userpage/${userNickname}`);
                    }}
                    alt="드롭다운 프로필"
                  />
                  <img
                    src={cameraIcon}
                    className="camera-icon"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate(`/userpage/${userNickname}`);
                    }}
                    alt="카메라 변경 아이콘"
                  />
                </div>
                <div className="dropdown-info">
                  <strong>{userNickname}</strong>님
                  <p className="dropdown-email">{userEmail}</p>
                  <button onClick={() => {
                    setDropdownOpen(false);
                    navigate(`/userpage/${userNickname}`);
                  }}>
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
            </div>
          ))}
        </nav>

        {/* 세션 및 친구 검색 */}
        <div className="nav-right">
          {refreshToken && accessToken && (
            <div className="session-container">
              <img src={sessionIcon} alt="세션 아이콘" className="session-icon" />
              <span className="session-time">세션 남은시간 : {formatTime(timeLeft)}</span>
              <button className="session-button" onClick={onExtendSessionClickHandler}>연장</button>
            </div>
          )}
          <div className="search-box">
            <input
              className="friend-search"
              placeholder="친구(닉네임) 검색"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchResults.length > 0) {
                  navigate(`/userpage/${searchResults[0]}`);
                  setShowSearchDropdown(false);
                }
              }}
              onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
              onBlur={() => setTimeout(() => setShowSearchDropdown(false), 150)}
            />
            {showSearchDropdown && (
              <ul className="search-dropdown">
                {searchResults.map((result, idx) => (
                  <li key={idx} onClick={() => navigate(`/userpage/${result.userNickname}`)}>
                    <img
                      src={result.userProfileImage} // 프로필 이미지
                      alt={result.userNickname}
                      style={{ width: "24px", height: "24px", borderRadius: "50%" }}
                    />
                    {result.userNickname}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* 메인 영역 */}
      <div id="main">
        <Outlet />
      </div>
    </div>
  );
};

export default Header;