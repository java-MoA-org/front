import './style.css'
import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import moaLogo from '../../assets/images/moa-logo-little.png'
import userImg from '../../assets/images/ex-user1.png'

const Header = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const navigate = useNavigate()

  return (
    <div className="header-wrapper">
      {/* ✅ 로고 + 아이콘 영역 */}
      <div className="header-top">
        <div className="logo" onClick={() => navigate('/')}>
          <img src={moaLogo} alt="MOA Logo" className="logo-img" />
        </div>

        <div className="user-info">
          <span onClick={() => navigate('/message')}>💬</span>
          <span>⭐</span>
          <img
            src={userImg}
            className="profile-img"
            onClick={() => navigate('/mypage')}
          />
          <span>☰</span>
        </div>
      </div>

      {/* ✅ 카테고리 메뉴 (중앙 정렬) */}
      <div className="nav-container">
        <nav className="nav">
          {['게시판', '일기', '중고거래', '공지사항'].map((menu) => (
            <div
              className="nav-item"
              key={menu}
              onMouseEnter={() => setActiveMenu(menu)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                onClick={() => {
                  if (menu === '게시판') navigate('/board')
                  if (menu === '일기') navigate('/diary')
                  if (menu === '중고거래') navigate('/trade')
                  if (menu === '공지사항') navigate('/notice')
                }}
              >
                {menu}
              </button>

              {activeMenu === menu && (
                <div className="dropdown-fix">
                  <h4>{menu}</h4>

                  {/* 게시판 */}
                  {menu === '게시판' && (
                    <>
                      <p onClick={() => navigate('/board')}>자유게시판</p>
                      <p onClick={() => navigate('/board')}>익명게시판</p>
                      <p onClick={() => navigate('/board')}>후기게시판</p>
                    </>
                  )}

                  {/* 일기 */}
                  {menu === '일기' && (
                    <>
                      <p onClick={() => navigate('/diary')}>일기 작성</p>
                      <p onClick={() => navigate('/diary')}>이웃 일기 보기</p>
                      <p onClick={() => navigate('/diary')}>내 일기 보기</p>
                    </>
                  )}

                  {/* 중고거래 */}
                  {menu === '중고거래' && (
                    <>
                      <p onClick={() => navigate('/trade')}>판매글</p>
                      <p onClick={() => navigate('/trade')}>구매글</p>
                      <p onClick={() => navigate('/trade')}>거래완료</p>
                    </>
                  )}

                  {/* 공지사항 */}
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
      </div>
    <div id='main'>
      <Outlet />
    </div>
    </div>
  )
}

export default Header