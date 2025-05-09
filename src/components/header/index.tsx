// 스타일 및 필요한 라이브러리 임포트
import './style.css';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useCookies } from 'react-cookie';

// API 요청 함수들
import {
  searchUserRequest,
  refreshAccessTokenRequest,
  userSignOutRequest,
} from '../../apis';

// 이미지 파일
import moaHeaderLogo from '../../assets/images/moa_main_logo.png';
import defaultProfile from '../../assets/images/default-profile.png';
import cameraIcon from '../../assets/images/camera.png';
import sessionIcon from '../../assets/images/session.png';

// 경로 상수들
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ROOT_PATH,
  BOARD_ABSOLUTE_PATH,
  DAILY_ABSOLUTE_PATH,
  USED_TRADE_ABSOLUTE_PATH,
  AUTH_ABSOLUTE_PATH,
} from '../../constants';

// 전역 상태 관리 (zustand store)
import useSignInUserStore from '../../stores/sign-in-user.store';
import useSessionTimerStore from '../../stores/session-timer.store';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // state: 세션 관련 상태
  const { timeLeft, setTimeLeft, decreaseTimeLeft, resetTime } = useSessionTimerStore();
  const {  userId, userNickname, userEmail, userProfileImage, resetUser } = useSignInUserStore();

  // state: 쿠키 및 로그인 상태
  const [cookies, , removeCookie] = useCookies();
  const accessToken = cookies[ACCESS_TOKEN];
  const refreshToken = cookies[REFRESH_TOKEN];

  // state: UI 관련 상태
  const [cookieReady, setCookieReady] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // effect: 쿠키 준비 여부
  useEffect(() => {
    if (accessToken !== undefined && refreshToken !== undefined) {
      setCookieReady(true);
    }
  }, [accessToken, refreshToken]);

  // effect: 세션 타이머 설정
  useEffect(() => {
    const timer = setInterval(() => decreaseTimeLeft(), 1000);
    return () => clearInterval(timer);
  }, []);

  // effect: 세션 만료 처리
  useEffect(() => {
    if (!cookieReady || isLoggingOut || !refreshToken) return;
    if (!accessToken && refreshToken) {
      resetTime();
      logout();
    } else if (timeLeft === 0) {
      resetTime();
      logout();
    }
  }, [cookieReady, timeLeft, accessToken, refreshToken]);

  // effect: 경로 변경 시 세션 연장
  useEffect(() => {
    if (accessToken) onExtendSessionClickHandler();
  }, [location.pathname]);

  // effect: 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // effect: 친구 검색
  useEffect(() => {
    if (!searchKeyword.trim() || !accessToken) return;
    searchUserRequest(searchKeyword, accessToken)
      .then((res) => {
        if (Array.isArray(res)) {
          setSearchResults(res);
          setShowSearchDropdown(true);
        }
      })
      .catch((err) => console.error('친구 검색 에러:', err));
  }, [searchKeyword]);

  // function: 유효한 프로필 이미지 경로 반환
  const getValidProfileImage = (img?: string | null) => {
    if (!img || img === 'default-profile' || img.trim() === '') return defaultProfile;
    return img;
  };

  // function: 로그아웃 처리
  const logout = useCallback(() => {
    removeCookie(ACCESS_TOKEN, { path: ROOT_PATH });
    removeCookie(REFRESH_TOKEN, { path: ROOT_PATH });
    localStorage.clear();
    resetUser();
    navigate(AUTH_ABSOLUTE_PATH);
  }, [navigate, removeCookie, resetUser]);

  // function: 로그아웃 핸들러
  const onSignOutClickHandler = () => {
    setIsLoggingOut(true);
    userSignOutRequest(accessToken);
    logout();
    alert('로그아웃 하셨습니다.');
  };

  // function: 세션 연장
  const onExtendSessionClickHandler = useCallback(async () => {
    try {
      if (!accessToken) return;
      const expirationTime = await refreshAccessTokenRequest();
      if (!expirationTime) throw new Error('토큰 갱신 실패');
      setTimeLeft(parseInt(expirationTime, 10));
    } catch (e) {
      console.error(e);
      logout();
    }
  }, [accessToken, setTimeLeft, logout]);

  // function: 세션 시간 포맷팅 (mm:ss)
  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // render: Header 전체 레이아웃
  return (
    <div className="header-wrapper">
      {/* 상단 로고 및 사용자 정보 */}
      <div className="header-top">
        <div className="logo" onClick={() => navigate('/')}> <img src={moaHeaderLogo} className="logo-img" alt="로고" /> </div>
        <div className="user-info">
          {accessToken ? (
            <>
              <span onClick={() => navigate(`/message/${userId}`)}>💬</span>
              <span>⭐</span>
              <div className="profile-wrapper">
                <img
                  src={getValidProfileImage(userProfileImage)}
                  className="profile-img"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  alt="프로필"
                  onError={(e) => (e.currentTarget.src = defaultProfile)}
                />
              </div>
            </>
          ) : (
            <button onClick={() => navigate(AUTH_ABSOLUTE_PATH)}>로그인</button>
          )}
        </div>
      </div>

      {/* 사용자 드롭다운 */}
      {dropdownOpen && (
        <div className="user-dropdown" ref={dropdownRef}>
          <div className="profile-img-container">
            <img className="dropdown-profile-img"
              src={getValidProfileImage(userProfileImage)}
              onClick={() => navigate(`/userpage/${userNickname}`)}
              alt="드롭다운 프로필"
            />
            <img className="camera-icon"
              src={cameraIcon}
              onClick={() => navigate(`/userpage/${userNickname}`)}
              alt="카메라 변경 아이콘"
            />
          </div>
          <div className="dropdown-info">
            <strong>{userNickname}</strong>님
            <p className="dropdown-email">{userEmail}</p>
            <button onClick={() => navigate(`/userpage/${userNickname}`)}>마이페이지</button>
            <button onClick={onSignOutClickHandler}>로그아웃</button>
          </div>
        </div>
      )}

      {/* 네비게이션 영역 */}
      <div className="nav-container">
        <nav className="nav">
          {[['익명 게시판', BOARD_ABSOLUTE_PATH], ['일상', DAILY_ABSOLUTE_PATH], ['중고거래', USED_TRADE_ABSOLUTE_PATH], ['공지사항', '/notice']].map(([label, path]) => (
            <div className="nav-item" key={label}>
              <button onClick={() => navigate(path)}>{label}</button>
            </div>
          ))}
        </nav>

        {/* 검색 및 세션 정보 */}
        <div className="nav-right">
          {accessToken && (
            <div className="session-container">
              <img className="session-icon" src={sessionIcon} alt="세션" />
              <span className="session-time">세션 남은시간 : {formatTime(timeLeft)}</span>
              <button className="session-button" onClick={() => setTimeLeft(1800)}>연장</button>
            </div>
          )}

          <div className="search-box">
            <input
              className="friend-search"
              placeholder="친구(닉네임) 검색"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onFocus={() => setShowSearchDropdown(true)}
              onBlur={() => setTimeout(() => setShowSearchDropdown(false), 150)}
            />
            {showSearchDropdown && searchResults.length > 0 && (
              <ul className="search-dropdown">
                {searchResults.map((result, idx) => (
                  <li key={idx} onClick={() => navigate(`/userpage/${result.userNickname}`)}>
                    <img
                      className="search-result-img"
                      src={getValidProfileImage(result.userProfileImage)}
                      alt={result.userNickname}
                    />
                    {result.userNickname}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div id="main">
        <Outlet />
      </div>
    </div>
  );
};

export default Header;