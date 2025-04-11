import "./Home.css";
import ImageSlider from "../../components/ImageSlider/ImageSlider";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      {/* 슬라이더 + 콘텐츠 3단 구성 전체 영역 */}
      <div className="home-container">
        <div className="content-row">
          {/* 왼쪽 사이드바: 친구 목록 */}
          <aside className="left-sidebar">
            <h2 className="section-title">친구 목록 (맞팔로우)</h2>
            <ul className="friend-list">
              <li>유저1</li>
              <li>유저2</li>
              <li>유저3</li>
            </ul>
          </aside>

          {/* 중앙 메인 콘텐츠 영역 */}
          <div className="main-container">
            {/* 상단 이미지 슬라이더 */}
            <div className="top-banner-container">
              <ImageSlider />
            </div>

            {/* 인기 게시판 */}
            <section className="hot-board-list">
              <h2 className="section-title">인기 게시물</h2>
              {[1, 2, 3, 4, 5].map((item) => (
                <div className="post-card" key={item}>
                  <div className="post-title">오늘 롯데졌다</div>
                  <div className="post-info">
                    <span>작성자1</span>
                    <span>좋아요</span>
                    <span>댓글</span>
                  </div>
                </div>
              ))}
            </section>

            {/* 익명 게시판 */}
            <section className="board-list">
              <h2 className="section-title" onClick={() => navigate("/board")}>
                게시판
              </h2>
              {[1, 2, 3, 4, 5].map((item) => (
                <div className="post-card" key={item}>
                  <div className="post-title">오늘 롯데졌다</div>
                  <div className="post-info">
                    <span>작성자1</span>
                    <span>좋아요</span>
                    <span>댓글</span>
                  </div>
                </div>
              ))}
            </section>

            {/* 일상 게시글 */}
            <section className="daily-list">
              <h2 className="section-title" onClick={() => navigate("/daily")}>
                일상
              </h2>
              {[1, 2, 3, 4, 5].map((item) => (
                <div className="post-card" key={`daily-${item}`}>
                  <div className="post-title">오늘 LG졌다</div>
                  <div className="post-info">
                    <span>작성자2</span>
                    <span>좋아요</span>
                    <span>댓글</span>
                  </div>
                </div>
              ))}
            </section>

            {/* 중고거래 */}
            <section className="trade-list">
              <h2 className="section-title" onClick={() => navigate("/trade")}>
                중고거래
              </h2>
              {[1, 2, 3, 4, 5].map((item) => (
                <div className="post-card" key={`trade-${item}`}>
                  <div className="post-title">아이폰 팔아요</div>
                  <div className="post-info">
                    <span>작성자3</span>
                    <span>관심</span>
                    <span>문의</span>
                  </div>
                </div>
              ))}
            </section>
          </div>

          {/* 오른쪽 사이드바: 뉴스 */}
          <aside className="right-sidebar">
            <div className="news-box">주요 뉴스</div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;
