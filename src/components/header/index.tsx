import './style.css';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import moaHeaderLogo from '../../assets/images/moa_main_logo.png';
import userImg from '../../assets/images/ex-user1.png';
import cameraIcon from '../../assets/images/camera.png';
import sessionIcon from '../../assets/images/session.png';
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
  USED_TRADE_WRITE_ABSOLUTE_PATH,
} from '../../constants';
import { useCookies } from 'react-cookie';
import useSignInUserStore from '../../stores/sign-in-user.store';
import { refreshAccessTokenRequest, userSignOutRequest } from '../../apis';
import useSessionTimerStore from '../../stores/session-timer.store';

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
    removeCookie(REFRESH_TOKEN, { path: ROOT_PATH });
    localStorage.clear();
    resetUser();
    removeCookie(ACCESS_TOKEN, { path: ROOT_PATH });
    navigate('/');
  };

  // 세션 연장 요청
  const onExtendSessionClickHandler = async () => {
    try {
      if (!accessToken) {
        removeCookie(ACCESS_TOKEN, { path: ROOT_PATH });
        removeCookie(REFRESH_TOKEN, { path: ROOT_PATH });
        localStorage.clear();
        resetUser();
        alert('세션이 만료되어 로그아웃되었습니다. 다시 로그인해주세요.');
        navigate('/');
        return;
      }
      const expirationTime = await refreshAccessTokenRequest();

      if (!expirationTime) {
        // refresh 실패 (토큰 만료 또는 인증 오류)
        throw new Error('토큰 갱신 실패');
      }

      setTimeLeft(parseInt(expirationTime, 10));
    } catch (error) {
      console.error(error);
      removeCookie(ACCESS_TOKEN, { path: ROOT_PATH });
      removeCookie(REFRESH_TOKEN, { path: ROOT_PATH });
      localStorage.clear();
      resetUser();
      alert('세션이 만료되어 로그아웃되었습니다. 다시 로그인해주세요.');
      navigate('/');
    }
  };

  // 1초마다 세션 감소
  useEffect(() => {
    const timer = setInterval(() => {
      decreaseTimeLeft();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isLoggingOut) return;

    // ✅ 쿠키 기준으로 로그인 상태 판단
    const isLoggedIn = !!refreshToken; // refreshToken만 있으면 로그인 상태로 간주

    if (!isLoggedIn) {
      // 로그인 안 한 상태면 세션 만료 검사 스킵
      return;
    }

    if (!accessToken && refreshToken) {
      // ✅ accessToken만 사라진 경우 (refreshToken은 살아있음)
      console.log('accessToken 만료 감지: 세션 만료 처리');
      resetTime();
      alert('세션이 만료되었습니다. 다시 로그인 해주세요.');
      removeCookie(REFRESH_TOKEN, { path: ROOT_PATH });
      removeCookie(ACCESS_TOKEN, { path: ROOT_PATH });
      localStorage.clear();
      resetUser();
      navigate('/');
      return;
    }

    if (timeLeft <= 0) return;

    if (timeLeft === 0) {
      console.log('timeLeft 0: 세션 만료 처리');
      resetTime();
      alert('세션이 만료되었습니다. 다시 로그인 해주세요.');
      removeCookie(REFRESH_TOKEN, { path: ROOT_PATH });
      removeCookie(ACCESS_TOKEN, { path: ROOT_PATH });
      localStorage.clear();
      resetUser();
      navigate('/');
    }
  }, [timeLeft, accessToken, refreshToken]);

  // 페이지 이동 시 세션 연장
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 타이머 포맷
  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="header-wrapper">
      {/* 상단 로고 및 유저 영역 */}
      <div className="header-top">
        <div className="logo" onClick={() => navigate('/')}>
          <img src={moaHeaderLogo} className="logo-img" alt="로고" />
        </div>

        <div className="user-info">
          <span onClick={() => navigate('/message')}>💬</span>
          <span>⭐</span>
          <div className="profile-wrapper" ref={dropdownRef}>
            <img
              src={userProfileImage || userImg}
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
                  <strong>{userNickname}</strong>님<p className="dropdown-email">{userEmail}</p>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate(`/userpage/${userNickname}`);
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
          {['게시판', '일상', '중고거래', '공지사항'].map((menu) => (
            <div
              className="nav-item"
              key={menu}
              onMouseEnter={() => setActiveMenu(menu)}
              onMouseLeave={() => setActiveMenu(null)}
            >
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
              {activeMenu === menu && (
                <div className="dropdown-fix">
                  <h4>{menu}</h4>
                  {menu === '게시판' && (
                    <>
                      <p onClick={() => navigate(BOARD_WRITE_ABSOLUTE_PATH)}>게시글 작성</p>
                      <p onClick={() => navigate('/board')}>내 게시글 보기</p>
                    </>
                  )}
                  {menu === '일상' && (
                    <>
                      <p onClick={() => navigate(DAILY_WRITE_ABSOLUTE_PATH)}>일상글 작성</p>
                      <p onClick={() => navigate('/daily')}>내 일상글 보기</p>
                    </>
                  )}
                  {menu === '중고거래' && (
                    <>
                      <p onClick={() => navigate(USED_TRADE_WRITE_ABSOLUTE_PATH)}>판매글 작성</p>
                      <p onClick={() => navigate('/trade')}>내 판매글 관리</p>
                    </>
                  )}
                  {menu === '공지사항' && (
                    <>
                      <p onClick={() => navigate('/notice')}>설명</p>
                      <p onClick={() => navigate('/notice')}>이용방법</p>
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
              <button className="session-extend-button" onClick={onExtendSessionClickHandler}>
                연장
              </button>
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
