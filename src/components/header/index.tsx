import './style.css';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { searchUserRequest } from '../../apis';
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
import { useCookies } from 'react-cookie';
import useSignInUserStore from '../../stores/sign-in-user.store';
import { refreshAccessTokenRequest, userSignOutRequest } from '../../apis';
import useSessionTimerStore from '../../stores/session-timer.store';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { timeLeft, setTimeLeft, decreaseTimeLeft, resetTime } = useSessionTimerStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const [cookies, , removeCookie] = useCookies();
  const { userNickname, userEmail, userProfileImage, resetUser } = useSignInUserStore();
  const accessToken = cookies[ACCESS_TOKEN];
  const refreshToken = cookies[REFRESH_TOKEN];

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 프로필 이미지 정리 함수
  const getValidProfileImage = (img?: string | null) => {
    if (!img || img.trim() === '' || img === 'default-profile') {
      return defaultProfile;
    }
    return img;
  };

  const logout = () => {
    removeCookie(ACCESS_TOKEN, { path: ROOT_PATH });
    removeCookie(REFRESH_TOKEN, { path: ROOT_PATH });
    localStorage.clear();
    resetUser();
    navigate(AUTH_ABSOLUTE_PATH);
  };

  const onSignOutClickHandler = () => {
    setIsLoggingOut(true);
    userSignOutRequest(accessToken);
    logout();
    alert('로그아웃 하셨습니다.');
  };

  const onExtendSessionClickHandler = async () => {
    try {
      if (!accessToken) {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        logout();
        return;
      }
      const expirationTime = await refreshAccessTokenRequest();
      if (!expirationTime) throw new Error('토큰 갱신 실패');
      setTimeLeft(parseInt(expirationTime, 10));
    } catch (error) {
      console.error(error);
      alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      logout();
    }
  };

  useEffect(() => {
    if (!searchKeyword.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const fetchUsers = async () => {
      if (!accessToken) {
        console.warn('accessToken이 없습니다. 요청 중단');
        return;
      }

      try {
        const response = await searchUserRequest(searchKeyword, accessToken);
        if (Array.isArray(response)) {
          setSearchResults(
            response.map((user: any) => ({
              userNickname: user.userNickname,
              userProfileImage: user.userProfileImage || null,
            }))
          );
          setShowSearchDropdown(true);
        }
      } catch (error) {
        console.error('친구 검색 중 에러:', error);
      }
    };

    fetchUsers();
  }, [searchKeyword]);

  useEffect(() => {
    const timer = setInterval(() => {
      decreaseTimeLeft();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isLoggingOut) return;
    const isLoggedIn = !!refreshToken;
    if (!isLoggedIn) return;

    if (!accessToken && refreshToken) {
      resetTime();
      alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      logout();
      return;
    }

    if (timeLeft === 0) {
      resetTime();
      alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      logout();
    }
  }, [timeLeft, accessToken, refreshToken]);

  useEffect(() => {
    if (accessToken) {
      onExtendSessionClickHandler();
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="header-wrapper">
      {/* 상단 로고 */}
      <div className="header-top">
        <div className="logo" onClick={() => navigate('/')}>
          <img src={moaHeaderLogo} className="logo-img" alt="로고" />
        </div>

        <div className="user-info">
          <span onClick={() => navigate('/message')}>💬</span>
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
        </div>
      </div>

      {/* 드롭다운 */}
      {dropdownOpen && (
        <div className="user-dropdown" ref={dropdownRef}>
          <div className="profile-img-container">
            <img
              src={getValidProfileImage(userProfileImage)}
              className="dropdown-profile-img"
              onClick={() => {
                setDropdownOpen(false);
                navigate(`/userpage/${userNickname}`);
              }}
              alt="드롭다운 프로필"
              onError={(e) => (e.currentTarget.src = defaultProfile)}
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
            <strong>{userNickname}</strong>님<p className="dropdown-email">{userEmail}</p>
            <button onClick={() => navigate(`/userpage/${userNickname}`)}>마이페이지</button>
            <button onClick={onSignOutClickHandler}>로그아웃</button>
          </div>
        </div>
      )}

      {/* 네비게이션 */}
      <div className="nav-container">
        <nav className="nav">
          {['게시판', '일상', '중고거래', '공지사항'].map((menu) => (
            <div className="nav-item" key={menu}>
              <button
                onClick={() => {
                  if (menu === '게시판') navigate(BOARD_ABSOLUTE_PATH);
                  if (menu === '일상') navigate(DAILY_ABSOLUTE_PATH);
                  if (menu === '중고거래') navigate(USED_TRADE_ABSOLUTE_PATH);
                  if (menu === '공지사항') navigate('/notice');
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
              <button className="session-button" onClick={() => setTimeLeft(1800)}>
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
                      src={getValidProfileImage(result.userProfileImage)}
                      alt={result.userNickname}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        marginRight: '8px',
                      }}
                      onError={(e) => (e.currentTarget.src = defaultProfile)}
                    />
                    {result.userNickname}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* 메인 */}
      <div id="main">
        <Outlet />
      </div>
    </div>
  );
};

export default Header;
