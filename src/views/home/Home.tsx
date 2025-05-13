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
  getUserNicknameByIdRequest,
  getUserProfileImageByIdRequest,
  getFollowInfoRequest,
} from "../../apis";

import Board from "../../types/interfaces/board.interface";
import Daily from "../../types/interfaces/daily.interface";
import UsedTrade from "../../types/interfaces/trade.interface";

import GetBoardListResponseDto from "../../apis/dto/response/board/get-board-list.response.dto";
import GetDailyListResponseDto from "../../apis/dto/response/daily/get-daily-list.response.dto";
import GetUsedTradeListResponseDto from "../../apis/dto/response/usedtrade/get-used-trade-list.response.dto";
import GetUserFollowInfoResponseDto from "../../apis/dto/response/user/get-user-follow-info.response.dto";
import UserFollowInfo from "../../types/interfaces/user-follow-info.interface";
import useSignInUserStore from "../../stores/sign-in-user.store";

const Home = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const accessToken = cookies["accessToken"];
  const { userId } = useSignInUserStore();

  const [boardList, setBoardList] = useState<Board[]>([]);
  const [dailyList, setDailyList] = useState<Daily[]>([]);
  const [tradeList, setTradeList] = useState<UsedTrade[]>([]);
  const [hotPosts, setHotPosts] = useState<(Board | Daily)[]>([]);
  const [mutualFollows, setMutualFollows] = useState<{
    userId: string;
    userNickname: string;
    profileImage: string;
  }[]>([]);

  // effect: 게시판, 일상, 중고거래 리스트 각각 최대 5개 불러오기 //
  useEffect(() => {
    getBoardListRequest("ALL", 1, "").then((res) => {
      if (res && res.code === "SU" && "boardList" in res) {
        const typed = res as GetBoardListResponseDto;
        setBoardList(typed.boardList.slice(0, 5));
      }
    });

    getDailyListRequest(1, "", accessToken).then((res) => {
      if (res && res.code === "SU" && "dailyList" in res) {
        const typed = res as GetDailyListResponseDto;
        setDailyList(typed.dailyList.slice(0, 5));
      }
    });

    getUsedTradeListRequest("ALL", 1, "LATEST", accessToken).then((res) => {
      if (res && res.code === "SU" && "usedTradeList" in res) {
        const typed = res as GetUsedTradeListResponseDto;
        setTradeList(typed.usedTradeList.slice(0, 5));
      }
    });
  }, []);

  // effect: 게시글들을 좋아요와 조회수 기준으로 정렬하여 인기 게시물 추출 //
  useEffect(() => {
    if (boardList.length > 0 && dailyList.length > 0) {
      mergeAndSortPosts(boardList, dailyList);
    }
  }, [boardList, dailyList]);

  // effect: 로그인 유저 기준 맞팔 유저 목록 조회 후 닉네임, 프로필 정보 병합 //
  useEffect(() => {
    const fetchMutualFollows = async () => {
      if (!accessToken || !userId) return;

      try {
        const nickname = await getUserNicknameByIdRequest(userId, accessToken);
        const followRes = await getFollowInfoRequest(nickname, accessToken);

        if (!followRes || followRes.code !== "SU") return;

        const { followers, followees }: {
          followers: UserFollowInfo[];
          followees: UserFollowInfo[];
        } = followRes;

        const mutuals: UserFollowInfo[] = [];

        followers.forEach((follower) => {
          const match = followees.find((followee) => followee.userId === follower.userId);
          if (match) mutuals.push(follower);
        });

        const results: {
          userId: string;
          userNickname: string;
          profileImage: string;
        }[] = [];

        // 각 맞팔 유저에 대해 닉네임과 프로필 이미지 비동기 요청
        for (const user of mutuals) {
          try {
            const userNickname = await getUserNicknameByIdRequest(user.userId, accessToken);

            let profileImage = "default-profile";
            try {
              profileImage = await getUserProfileImageByIdRequest(user.userId, accessToken);
            } catch (e) {
              console.warn(`프로필 이미지 없음: ${user.userId}`);
            }

            results.push({
              userId: user.userId,
              userNickname,
              profileImage,
            });
          } catch (err) {
            console.warn(`유저 정보 조회 실패: ${user.userId}`, err);
          }
        }

        setMutualFollows(results);
      } catch (error) {
        console.error("맞팔로우 불러오기 실패", error);
      }
    };

    fetchMutualFollows();
  }, [accessToken, userId]);

  // function: 게시판+일상 글을 병합하고 인기 순으로 정렬 //
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

  // function: 닉네임 클릭 시 해당 유저의 마이페이지로 이동 //
  const goToUserPage = (nickname: string) => {
    if (nickname && nickname !== "익명") {
      navigate(`/userpage/${nickname}`);
    }
  };

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <div className="content-row">
          {/* 왼쪽 사이드바: 맞팔로우 유저 리스트 */}
          <aside className="left-sidebar">
            <h2 className="section-title">친구 목록 (맞팔로우)</h2>
            <ul className="friend-list">
              {mutualFollows.map((user, idx) => (
                <li key={idx} onClick={() => goToUserPage(user.userNickname)}>
                  <img
                    className="profile-thumb"
                    src={
                      user.profileImage && user.profileImage !== "default-profile"
                        ? user.profileImage
                        : defaultProfile
                    }
                    alt="profile"
                  />
                  <span>{user.userNickname}</span>
                </li>
              ))}
            </ul>
          </aside>

          {/* 메인 콘텐츠: 이미지 슬라이더, 인기 게시물, 게시판/일상, 중고거래 */}
          <main className="main-container">
            <div className="top-banner-container">
              <ImageSlider />
            </div>

            {/* 인기 게시물 리스트 */}
            <section className="hot-board-list">
              <h2 className="section-title">인기 게시물</h2>
              {hotPosts.map((item, i) => (
                <div
                  className="post-card"
                  key={`hot-${i}`}
                  onClick={() =>
                    "boardSequence" in item
                      ? navigate(`/board/${item.boardSequence}`)
                      : navigate(`/daily/${item.dailySequence}`)
                  }
                >
                  <div className="post-category">
                    {"boardSequence" in item ? "[익명 게시판]" : "[일상]"}
                  </div>
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
                    <span>
                      조회수 {"views" in item ? (item as Daily).views : 0}
                    </span>
                  </div>
                </div>
              ))}
            </section>

            {/* 게시판 */}
            <div className="board-daily-row">
              <section className="board-list">
                <h2 className="section-title" onClick={() => navigate("/board")}>
                  익명 게시판
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
                  <div
                    className="post-card"
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

            {/* 중고거래 목록 */}
            <section className="trade-section">
              <h2 className="section-title" onClick={() => navigate("/trade")}>중고거래</h2>
              <div className="trade-list">
                {tradeList.map((item: UsedTrade) => (
                  <div
                    className="trade-card"
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