import "./Home.css";
import ImageSlider from "../../components/ImageSlider/ImageSlider";
import { useNavigate } from "react-router-dom";
import News from "../../components/news/news";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import iphoneImg from "../../assets/images/iphone_ex.png";
import defaultProfile from "../../assets/images/default-profile.png";

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

// 컴포넌트: Home 페이지
const Home = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const accessToken = cookies["accessToken"];

  // state: 게시판, 일상, 중고거래, 인기 게시물 리스트 //
  const [boardList, setBoardList] = useState<Board[]>([]);
  const [dailyList, setDailyList] = useState<Daily[]>([]);
  const [tradeList, setTradeList] = useState<UsedTrade[]>([]);
  const [hotPosts, setHotPosts] = useState<(Board | Daily)[]>([]);

  // effect: 게시판 가져오기 //
  useEffect(() => {
    getBoardListRequest("ALL", 1, "", accessToken).then((res) => {
      if (res && res.code === "SU" && "boardList" in res) {
        const typed = res as GetBoardListResponseDto;
        setBoardList(typed.boardList.slice(0, 5));
      }
    });
  // effect: 일상 리스트 가져오기 //
    getDailyListRequest(1, "", accessToken).then((res) => {
      if (res && res.code === "SU" && "dailyList" in res) {
        const typed = res as GetDailyListResponseDto;
        setDailyList(typed.dailyList.slice(0, 5));
      }
    });
  // effect: 중고거래 리스트 가져오기 //
    getUsedTradeListRequest("ALL", 1, "LATEST", accessToken).then((res) => {
      if (res && res.code === "SU" && "usedTradeList" in res) {
        const typed = res as GetUsedTradeListResponseDto;
        setTradeList(typed.usedTradeList.slice(0, 5));
      }
    });
  }, []);

  // effect: (게시판 + 일상) 인기 게시물 정렬 //
  useEffect(() => {
    if (boardList.length > 0 && dailyList.length > 0) {
      mergeAndSortPosts(boardList, dailyList);
    }
  }, [boardList, dailyList]);

  // function: 게시물 합치고 좋아요+조회수 기준으로 정렬 //
  const mergeAndSortPosts = (boards: Board[], dailies: Daily[]) => {
    const merged = [...boards, ...dailies];
    const sorted = merged.sort((a, b) => {
      const aViews = "views" in a ? (a as Daily).views : 0;
      const bViews = "views" in b ? (b as Daily).views : 0;
      if (b.likeCount === a.likeCount) return bViews - aViews;
      return b.likeCount - a.likeCount;
    });
    setHotPosts(sorted.slice(0, 5));
  };

  // function: 마이페이지 이동 //
  const goToUserPage = (nickname: string) => {
    if (nickname && nickname !== "익명") {
      navigate(`/userpage/${nickname}`);
    }
  };

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <div className="content-row">
          {/* 왼쪽 사이드바: 친구 목록 */}
          <aside className="left-sidebar">
            <h2 className="section-title">친구 목록 (맞팔로우)</h2>
            <ul className="friend-list">
              {["유저1", "유저2", "유저3"].map((user, idx) => (
                <li key={idx}>{user}</li>
              ))}
            </ul>
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="main-container">
            {/* 상단 배너 */}
            <div className="top-banner-container">
              <ImageSlider />
            </div>

            {/* 인기 게시물 */}
            <section className="hot-board-list">
              <h2 className="section-title">인기 게시물</h2>
              {hotPosts.map((item, i) => (
                <div className="post-card"
                  key={`hot-${i}`}
                  onClick={() =>
                    "boardSequence" in item
                      ? navigate(`/board/${item.boardSequence}`)
                      : navigate(`/daily/${item.dailySequence}`)
                  }
                >
                  <div className="post-title">
                    <span className="hot-label">HOT</span>
                    {item.title}
                    <span className="comment-count">
                      [{"commentCount" in item ? item.commentCount : 0}]
                    </span>
                  </div>
                  <div className="post-info">
                    <img className="profile-thumb"
                      src={
                        "profileImage" in item && item.profileImage && item.profileImage !== "default-profile"
                          ? item.profileImage
                          : defaultProfile
                      }
                      alt="profile"
                      onClick={(e) => {
                        e.stopPropagation();
                        "userNickname" in item && goToUserPage(item.userNickname);
                      }}
                    />
                    <strong
                      onClick={(e) => {
                        e.stopPropagation();
                        "userNickname" in item && goToUserPage(item.userNickname);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {"userNickname" in item ? item.userNickname : "익명"}
                    </strong>
                    <span>좋아요 {item.likeCount}</span>
                    <span>조회수 {"views" in item ? (item as Daily).views : 0}</span>
                  </div>
                </div>
              ))}
            </section>

            {/* 게시판 + 일상 게시글 */}
            <div className="board-daily-row">
              {/* 게시판 */}
              <section className="board-list">
                <h2 className="section-title" onClick={() => navigate("/board")}>
                  게시판
                </h2>
                {boardList.map((item: Board) => (
                  <div
                    className="post-card"
                    key={item.boardSequence}
                    onClick={() => navigate(`/board/${item.boardSequence}`)}
                  >
                    <div className="post-title">
                      {item.title}
                      <span className="comment-count">[{item.commentCount}]</span>
                    </div>
                    <div className="post-info">
                      <img className="profile-thumb" src={defaultProfile} alt="익명" />
                      <span>익명</span>
                      <span>좋아요 {item.likeCount}</span>
                    </div>
                  </div>
                ))}
              </section>

              {/* 일상 */}
              <section className="daily-list">
                <h2 className="section-title" onClick={() => navigate("/daily")}>
                  일상
                </h2>
                {dailyList.map((item: Daily) => (
                  <div className="post-card"
                    key={item.dailySequence}
                    onClick={() => navigate(`/daily/${item.dailySequence}`)}
                  >
                    <div className="post-title">
                      {item.title}
                      <span className="comment-count">[{item.commentCount}]</span>
                    </div>
                    <div className="post-info">
                      <img
                        className="profile-thumb"
                        src={
                          item.profileImage && item.profileImage !== "default-profile"
                            ? item.profileImage
                            : defaultProfile
                        }
                        alt="profile"
                        onClick={(e) => {
                          e.stopPropagation();
                          goToUserPage(item.userNickname);
                        }}
                      />
                      <strong
                        onClick={(e) => {
                          e.stopPropagation();
                          goToUserPage(item.userNickname);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {item.userNickname}
                      </strong>
                      <span>좋아요 {item.likeCount}</span>
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
                {tradeList.map((item: UsedTrade) => (
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

          {/* 오른쪽 사이드바: 뉴스 컴포넌트 */}
          <aside className="right-sidebar">
            <News />
          </aside>
          
        </div>
      </div>
    </div>
  );
};

export default Home;