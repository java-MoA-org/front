import './style.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import moaHeaderLogo from '../../assets/images/moa_main_logo.png';
import userImg from '../../assets/images/ex-user1.png';
import cameraIcon from '../../assets/images/camera.png';
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
import { Cookies, useCookies } from 'react-cookie';
import useSignInUserStore from '../../stores/sign-in-user.store';
import { refreshAccessTokenRequest, userSignOutRequest } from '../../apis';
import { access } from 'fs';
import useSessionTimerStore from '../../stores/session-timer.store';

const Header = () => {
  const navigate = useNavigate();
  const { timeLeft, setTimeLeft, decreaseTimeLeft, resetTime } = useSessionTimerStore();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [cookies, _, removeCookie] = useCookies();

  const { resetUser } = useSignInUserStore();

  const accessToken = cookies[ACCESS_TOKEN];
  const refreshToken = cookies[REFRESH_TOKEN];

  const onSignOutClickHandler = () => {
    userSignOutRequest(accessToken);
    removeCookie(ACCESS_TOKEN, { path: ROOT_PATH });
    removeCookie(REFRESH_TOKEN, { path: ROOT_PATH });
    localStorage.clear();
    resetUser();
    window.location.reload();
  };

  const onExtendSessionClickHandler = async () => {
    const expirationTime = await refreshAccessTokenRequest();
    if (expirationTime == null) {
      removeCookie(ACCESS_TOKEN, { path: ROOT_PATH });
      removeCookie(REFRESH_TOKEN, { path: ROOT_PATH });
      localStorage.clear();
      resetUser();
      alert('인증 정보가 만료되어 연장할 수 없습니다.');
      window.location.reload();
    }
    setTimeLeft(parseInt(expirationTime, 10));
  };

  // session timer
  useEffect(() => {
    const timer = setInterval(() => {
      decreaseTimeLeft();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (accessToken) {
      if (timeLeft === 0) {
        // 자동 로그아웃 처리 등
        resetTime();
        alert('세션이 만료되었습니다.');
        // navigate('/auth');
      }
    }
  }, [timeLeft]);

  // click outside to close dropdown
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
      <div className="header-top">
        <div className="logo" onClick={() => navigate('/')}>
          <img src={moaHeaderLogo} className="logo-img" alt="로고" />
        </div>

        <div className="user-info">
          <span onClick={() => navigate('/message')}>💬</span>
          <span>⭐</span>
          <div className="profile-wrapper" ref={dropdownRef}>
            <img src={userImg} className="profile-img" onClick={() => setDropdownOpen((prev) => !prev)} alt="프로필" />
            {dropdownOpen && (
              <div className="user-dropdown">
                <div className="profile-img-container">
                  <img
                    src={userImg}
                    className="dropdown-profile-img"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/mypage');
                    }}
                    alt="드롭다운 프로필"
                  />
                  <img
                    src={cameraIcon}
                    className="camera-icon"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/mypage');
                    }}
                    alt="카메라 변경 아이콘"
                  />
                </div>
                <div className="dropdown-info">
                  <strong>LYS</strong>님<p className="dropdown-email">sella45@naver.com</p>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/mypage');
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
                      <p onClick={() => navigate("/notice")}>Moa 설명</p>
                      <p onClick={() => navigate("/notice")}>공지사항</p>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="nav-right">
          {refreshToken && accessToken && (
            <div className="session-container">
              <span className="session-time">세션 남은시간 : {formatTime(timeLeft)}</span>
              <div className="session-button" onClick={onExtendSessionClickHandler}>
                {' '}
                세션 연장하기
              </div>
            </div>
          )}
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
