import './Home.css'
import ImageSlider from '../../components/ImageSlider/ImageSlider'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="home-wrapper">
      {/* 🔹 슬라이더 배너 */}
      <div className="top-banner-container">
        <ImageSlider />
      </div>

      <div className="home-container">
        {/* 🔹 메인 콘텐츠 영역 */}
        <div className="main-container">
          {/* 🔵 게시판 리스트 */}
          <section className="board-list">
            <h2 className="section-title" onClick={() => navigate('/board')}>
              게시판
            </h2>
            {[1, 2, 3, 4].map((item) => (
              <div className="post-card" key={item}>
                <div className="post-title">오늘 롯데졌다</div>
                <div className="post-info">
                  <span>작성자1</span>
                  <span>❤️</span>
                  <span>💬</span>
                </div>
              </div>
            ))}
          </section>

          {/* 🟢 일상 리스트 최근 (미정)개 */}
          <section className="daily-list">
            <h2 className="section-title" onClick={() => navigate('/daily')}>일상</h2>
            {[1, 2, 3, 4].map((item) => (
              <div className="post-card" key={`daily-${item}`}>
                <div className="post-title">오늘 LG졌다</div>
                <div className="post-info">
                  <span>작성자2</span>
                  <span>🧡</span>
                  <span>📝</span>
                </div>
              </div>
            ))}
          </section>

          {/* 중고거래 리스트 최근 (미정)개 */}
          <section className="trade-list">
            <h2 className="section-title" onClick={() => navigate('/trade')}>중고거래</h2>
            {[1, 2, 3, 4].map((item) => (
              <div className="post-card" key={`trade-${item}`}>
                <div className="post-title">아이폰 팔아요</div>
                <div className="post-info">
                  <span>작성자3</span>
                  <span>🙋🏻‍♂️</span>
                  <span>📝</span>
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* 🔹 사이드바 */}
        <aside className="sidebar">
          <div className="profile-box">인기 게시물</div>
          <div className="news-box">주요 뉴스</div>
        </aside>
      </div>
    </div>
  )
}

export default Home