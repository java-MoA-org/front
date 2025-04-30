import "./Home.css";
import ImageSlider from "../../components/ImageSlider/ImageSlider";
import { useNavigate } from "react-router-dom";
import News from "../../components/news/news";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import iphoneImg from "../../assets/images/iphone_ex.png";

import {
  getBoardListRequest,
  getDailyListRequest,
  getUsedTradeListRequest,
} from "../../apis";

import Board from "../../types/interfaces/board.interface";
import Daily from "../../types/interfaces/daily.interface";
import UsedTrade from "../../types/interfaces/trade.interface";

import GetBoardListResponseDto from "../../apis/dto/response/board/get-board-list.response.dto";
import GetDailyListResponseDto from "../../apis/dto/response/daily/get-daily-list.response.dto";
import GetUsedTradeListResponseDto from "../../apis/dto/response/usedtrade/get-used-trade-list.response.dto";

const Home = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const accessToken = cookies["accessToken"];

  const [boardList, setBoardList] = useState<Board[]>([]);
  const [dailyList, setDailyList] = useState<Daily[]>([]);
  const [tradeList, setTradeList] = useState<UsedTrade[]>([]);

  useEffect(() => {
    getBoardListRequest("ALL", 1, "LATEST", accessToken).then((res) => {
      if (res && res.code === "SU") {
        const typed = res as GetBoardListResponseDto;
        setBoardList(typed.boardList.slice(0, 5));
      }
    });

    getDailyListRequest(1, "LATEST", accessToken).then((res) => {
      if (res && res.code === "SU") {
        const typed = res as GetDailyListResponseDto;
        setDailyList(typed.dailyList.slice(0, 5));
      }
    });

    getUsedTradeListRequest("ALL", 1, "LATEST", accessToken).then((res) => {
      if (res && res.code === "SU") {
        const typed = res as GetUsedTradeListResponseDto;
        setTradeList(typed.usedTradeList.slice(0, 5));
      }
    });
  }, []);

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <div className="content-row">
          <aside className="left-sidebar">
            <h2 className="section-title">친구 목록 (맞팔로우)</h2>
            <ul className="friend-list">
              {["유저1", "유저2", "유저3"].map((user, idx) => (
                <li key={idx}>{user}</li>
              ))}
            </ul>
          </aside>

          <main className="main-container">
            <div className="top-banner-container">
              <ImageSlider />
            </div>

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

            <div className="board-daily-row">
              <section className="board-list">
                <h2 className="section-title" onClick={() => navigate("/board")}>게시판</h2>
                {boardList.map((item) => (
                  <div className="post-card"
                    key={item.boardSequence}
                    onClick={() => navigate(`/board/${item.boardSequence}`)}
                  >
                    <div className="post-title">{item.title}</div>
                    <div className="post-info">
                      <span>익명</span>
                      <span>좋아요 {item.likeCount}</span>
                      <span>댓글 {item.commentCount}</span>
                    </div>
                  </div>
                ))}
              </section>

              <section className="daily-list">
                <h2 className="section-title" onClick={() => navigate("/daily")}>일상</h2>
                {dailyList.map((item) => (
                  <div className="post-card"
                    key={item.dailySequence}
                    onClick={() => navigate(`/daily/${item.dailySequence}`)}
                  >
                    <div className="post-title">{item.title}</div>
                    <div className="post-info">
                      <span>{item.userNickname}</span>
                      <span>좋아요 {item.likeCount}</span>
                      <span>댓글 {item.commentCount}</span>
                    </div>
                  </div>
                ))}
              </section>
            </div>

            <section className="trade-section">
              <h2 className="section-title" onClick={() => navigate("/trade")}>중고거래</h2>
              <div className="trade-list">
                {tradeList.map((item) => (
                  <div className="trade-card"
                    key={item.tradeSequence}
                    onClick={() => navigate(`/usedtrade/${item.tradeSequence}`)}
                  >
                    <img className="trade-img" src={iphoneImg} />
                    <div className="product-title">{item.title}</div>
                    <div className="product-info">
                      <span>{item.userNickname}</span>
                      <span>좋아요 {item.likeCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>

          <aside className="right-sidebar">
            <News />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;