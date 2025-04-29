import "./Home.css";
import ImageSlider from "../../components/ImageSlider/ImageSlider";
import { useNavigate } from "react-router-dom";
import News from "../../components/news/news";

import iphoneImg from "../../assets/images/iphone_ex.png";

const Home = () => {
  // function: 페이지 이동 함수 //
  const navigate = useNavigate();

  // render: 홈 전체 페이지 구성 //
  return (
    <div className="home-wrapper">
      <div className="home-container">
        <div className="content-row">
          {/* section: 왼쪽 사이드바 - 친구 목록 */}
          <aside className="left-sidebar">
            <h2 className="section-title">친구 목록 (맞팔로우)</h2>
            <ul className="friend-list">
              {["유저1", "유저2", "유저3"].map((user, idx) => (
                <li key={idx}>{user}</li>
              ))}
            </ul>
          </aside>

          {/* section: 메인 콘텐츠 */}
          <main className="main-container">
            {/* component: 상단 배너 */}
            <div className="top-banner-container">
              <ImageSlider />
            </div>

            {/* section: 인기 게시판 */}
            <section className="hot-board-list">
              <h2 className="section-title">인기 게시물</h2>
              {Array.from({ length: 5 }, (_, i) => (
                <div className="post-card" key={`hot-${i}`}>
                  <div className="post-title">오늘 롯데 졌다</div>
                  <div className="post-info">
                    <span>작성자1</span>
                    <span>좋아요</span>
                    <span>댓글</span>
                  </div>
                </div>
              ))}
            </section>

            {/* 게시판과 일상 2열 배치 */}
            <div className="board-daily-row">
              {/* 게시판 */}
              <section className="board-list">
                <h2
                  className="section-title"
                  onClick={() => navigate("/board")}
                >
                  게시판
                </h2>
                {Array.from({ length: 5 }, (_, i) => (
                  <div className="post-card" key={`board-${i}`}>
                    <div className="post-title">오늘 롯데 졌다</div>
                    <div className="post-info">
                      <span>작성자2</span>
                      <span>좋아요</span>
                      <span>댓글</span>
                    </div>
                  </div>
                ))}
              </section>

              {/* 일상 */}
              <section className="daily-list">
                <h2
                  className="section-title"
                  onClick={() => navigate("/daily")}
                >
                  일상
                </h2>
                {Array.from({ length: 5 }, (_, i) => (
                  <div className="post-card" key={`daily-${i}`}>
                    <div className="post-title">오늘 LG 졌다</div>
                    <div className="post-info">
                      <span>작성자3</span>
                      <span>좋아요</span>
                      <span>댓글</span>
                    </div>
                  </div>
                ))}
              </section>
            </div>

            {/* 중고거래 */}
            <section className="trade-section">
              <h2 className="section-title" onClick={() => navigate("/trade")}>
                중고거래
              </h2>
              <div className="trade-list">
                {[...Array(5)].map((_, i) => (
                  <div className="trade-card" key={i}>
                    <img src={iphoneImg} alt="product" className="trade-img" />
                    <div className="product-title">아이폰 14 Pro Max</div>
                    <div className="product-price">1,200,000원</div>
                    <div className="product-time">1시간 전</div>
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* section: 오른쪽 사이드바 - 뉴스 */}
          <aside className="right-sidebar">
            <News />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;