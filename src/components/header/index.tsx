import './style.css';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { searchUserRequest, refreshAccessTokenRequest, userSignOutRequest } from '../../apis';
import moaHeaderLogo from '../../assets/images/moa_main_logo.png';
import defaultProfile from '../../assets/images/default-profile.png';
import cameraIcon from '../../assets/images/camera.png';
import sessionIcon from '../../assets/images/session.png';
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ROOT_PATH,
  BOARD_ABSOLUTE_PATH,
  DAILY_ABSOLUTE_PATH,
  USED_TRADE_ABSOLUTE_PATH,
  AUTH_ABSOLUTE_PATH,
} from '../../constants';
import useSignInUserStore from '../../stores/sign-in-user.store';
import useSessionTimerStore from '../../stores/session-timer.store';
import AlertDropdown from '../Alert';
import useNotificationStore from '../../stores/alert-read.store';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { alerts, isRead, setIsRead } = useNotificationStore();
  const { timeLeft, setTimeLeft, decreaseTimeLeft, resetTime } = useSessionTimerStore();
  const { userNickname, userEmail, userProfileImage, resetUser } = useSignInUserStore();
  const [cookies, , removeCookie] = useCookies();

  const accessToken = cookies[ACCESS_TOKEN];
  const refreshToken = cookies[REFRESH_TOKEN];

  const [cookieReady, setCookieReady] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setIsRead();
  }, [alerts]);

  useEffect(() => {
    console.log('alertOpen 상태:', alertOpen);
  }, [alertOpen]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (accessToken !== undefined && refreshToken !== undefined) {
      setCookieReady(true);
    }
  }, [accessToken, refreshToken]);

  useEffect(() => {
    const timer = setInterval(() => decreaseTimeLeft(), 1000);
    return () => clearInterval(timer);
  }, []);

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

  useEffect(() => {
    if (accessToken) onExtendSessionClickHandler();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const isClickOutsideProfile = dropdownRef.current && !dropdownRef.current.contains(e.target as Node);
      const isClickOutsideAlert = alertRef.current && !alertRef.current.contains(e.target as Node);

      if (isClickOutsideProfile) setDropdownOpen(false);
      if (isClickOutsideAlert) setAlertOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const getValidProfileImage = (img?: string | null) => {
    if (!img || img === 'default-profile' || img.trim() === '') return defaultProfile;
    return img;
  };

  const logout = useCallback(() => {
    removeCookie(ACCESS_TOKEN, { path: ROOT_PATH });
    removeCookie(REFRESH_TOKEN, { path: ROOT_PATH });
    localStorage.clear();
    resetUser();
    navigate(AUTH_ABSOLUTE_PATH);
  }, [navigate, removeCookie, resetUser]);

  const onSignOutClickHandler = () => {
    setIsLoggingOut(true);
    userSignOutRequest(accessToken);
    logout();
    alert('로그아웃 하셨습니다.');
  };

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

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="header-wrapper">
      <div className="header-top">
        <div className="logo" onClick={() => navigate('/')}>
          {' '}
          <img src={moaHeaderLogo} className="logo-img" alt="로고" />{' '}
        </div>
        <div className="user-info">
          {accessToken ? (
            <>
              <span onClick={() => navigate('/message')}>💬</span>
              <div className="alert-container">
                <div
                  onClick={() => {
                    setAlertOpen(true);
                    setDropdownOpen(false);
                  }}
                  className={`alert-image ${isRead ? 'read' : 'unread'}`}
                />
                {alertOpen && <AlertDropdown accessToken={accessToken} dropdownRef={alertRef} />}
              </div>

              <div className="profile-wrapper">
                <img
                  src={getValidProfileImage(userProfileImage)}
                  className="profile-img"
                  onClick={() => {
                    setDropdownOpen(true);
                    setAlertOpen(false);
                  }}
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

      {dropdownOpen && (
        <div className="user-dropdown" ref={dropdownRef}>
          <div className="profile-img-container">
            <img
              className="dropdown-profile-img"
              src={getValidProfileImage(userProfileImage)}
              onClick={() => navigate(`/userpage/${userNickname}`)}
              alt="드롭다운 프로필"
            />
            <img
              className="camera-icon"
              src={cameraIcon}
              onClick={() => navigate(`/userpage/${userNickname}`)}
              alt="카메라 변경 아이콘"
            />
          </div>
          <div className="dropdown-info">
            <strong>{userNickname}</strong>님<p className="dropdown-email">{userEmail}</p>
            <button onClick={() => navigate(`/userpage/${userNickname}`)}>마이페이지</button>
            <button onClick={onSignOutClickHandler}>로그아웃</button>
          </div>
        </div>
      )}

      <div className="nav-container">
        <nav className="nav">
          {[
            ['게시판', BOARD_ABSOLUTE_PATH],
            ['일상', DAILY_ABSOLUTE_PATH],
            ['중고거래', USED_TRADE_ABSOLUTE_PATH],
            ['공지사항', '/notice'],
          ].map(([label, path]) => (
            <div className="nav-item" key={label}>
              <button onClick={() => navigate(path)}>{label}</button>
            </div>
          ))}
        </nav>
        <div className="nav-right">
          {accessToken && (
            <div className="session-container">
              <img className="session-icon" src={sessionIcon} alt="세션" />
              <span className="session-time">세션 남은시간 : {formatTime(timeLeft)}</span>
              <button
                className="session-button"
                onClick={() => {
                  onExtendSessionClickHandler();
                  console.log('refresh clicked');
                }}
              >
                연장
              </button>
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

      <div id="main">
        <Outlet />
      </div>
    </div>
  );
};

export default Header;