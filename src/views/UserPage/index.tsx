import "./style.css";
import userImage from "../../assets/images/default-profile.png";
import { useNavigate, useParams } from "react-router-dom";
import {
  ACCESS_TOKEN,
  MY_USER_BOARD_ABSOLUTE_PATH,
  MY_USER_FOLLOW_ABSOLUTE_PATH,
  ROOT_ABSOULTE_PATH
} from "../../constants";
import FollowButton from "../../components/FollowButton";
import { Board, Daily, Trade } from "../../types/interfaces";
import UserInterest from "../../types/interfaces/user-interest.interface";
import UpdateButton from "../../components/UpdateButton";
import useSignInUserStore from "../../stores/sign-in-user.store";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import {
  getFollowRequest,
  getUserPageInfoRequest,
  getUserPageRequest,
  postFollowRequest
} from "../../apis";
import GetUserInfoResponseDto from "../../apis/dto/response/user/get-user-info.response.dto";
import ResponseDto from "../../apis/dto/response/response.dto";
import GetFollowResponseDto from "../../apis/dto/response/follow/get-follow.response.dto";

// interface: 게시판, 일상, 중고거래 레코드 컴포넌트 속성 //
interface MyUserPageProps {
  boards: Board[];
  dailys: Daily[];
  trades: Trade[];
  interests: UserInterest;
  userIntroduce: string;
  userProfileImage: string;
  userPageId: string;
}

export default function MyUserPage({
  boards,
  dailys,
  trades,
  interests,
  userIntroduce,
  userProfileImage,
  userPageId
}: MyUserPageProps) {
  const { nickname } = useParams(); // ✅ URL에서 :nickname 추출
  const [cookies] = useCookies([ACCESS_TOKEN]);
  const accessToken = cookies[ACCESS_TOKEN];
  const [id, setId] = useState<string | null>(null);

  const { userNickname, setUserNickname, userId } = useSignInUserStore();

  const [follower, setFollower] = useState<number>(0);
  const [followee, setFollowee] = useState<number>(0);

  // effect: 컴포넌트 로드시 실행할 함수 //
  useEffect(() => {
    getFollow();
  }, [nickname]);

  const activeInterests = Object.entries(interests)
    .filter(([_, value]) => value)
    .map(([key]) => key.replace("userInterest", ""));

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: get follow response 처리 함수 //
  const getFollow = () => {
    if (!accessToken) return;
    if (!userNickname) {
      navigator(ROOT_ABSOULTE_PATH);
      return;
    }
    if (!nickname) {
      navigator(ROOT_ABSOULTE_PATH);
      return;
    }
    getFollowRequest(nickname, accessToken).then(getFollowResponse);
  };

  // function: get follow response 처리 함수 //
  const getFollowResponse = (responseBody: GetFollowResponseDto | ResponseDto | null) => {
    const message = !responseBody
      ? "서버에 문제가 있습니다."
      : responseBody.code === "DBE"
      ? "서버에 문제가 있습니다."
      : responseBody.code === "AF"
      ? "인증에 실패했습니다."
      : responseBody.code === "NEU"
      ? "존재하지 않는 유저입니다."
      : "";
    const isSuccess = responseBody !== null && responseBody.code === "SU";
    if (!isSuccess) {
      alert(message);
      navigator(ROOT_ABSOULTE_PATH);
      return;
    }
    const { followers, followees } = responseBody as GetFollowResponseDto;
    const followersCount = followers.length;
    const followeesCount = followees.length;
    setFollowee(followersCount);
    setFollower(followeesCount);
  };

  // event handler: 팔로워, 팔로잉 페이지 처리 //
  const onFollowerPageClickHandler = () => {
    if (!nickname) return;
    navigator(`${MY_USER_FOLLOW_ABSOLUTE_PATH(nickname)}?type=follower`);
  };
  const onFolloweePageClickHandler = () => {
    if (!nickname) return;
    navigator(`${MY_USER_FOLLOW_ABSOLUTE_PATH(nickname)}?type=followee`);
  };

  // event handler: 채팅 페이지 처리 //
  const onChatPageClickHandler = () => {
    if (!nickname) return;
    navigator(`/message/${userId}/${userPageId}`);
  };

  // event handler: 게시판 클릭 처리 //
  const onUserDailyClickHandler = () => {
    if (!nickname) return;
    navigator(`${MY_USER_BOARD_ABSOLUTE_PATH(nickname)}?type=daily`);
  };
  const onUserTradeClickHandler = () => {
    if (!nickname) return;
    navigator(`${MY_USER_BOARD_ABSOLUTE_PATH(nickname)}?type=trade`);
  };
  const onUserBoardClickHandler = () => {
    if (!nickname) return;
    navigator(`${MY_USER_BOARD_ABSOLUTE_PATH(nickname)}?type=board`);
  };

  const interestMap: { label: string; key: keyof UserInterest }[] = [
    { label: "🛩️여행", key: "userInterestTrip" },
    { label: "🎮게임", key: "userInterestGame" },
    { label: "👚패션", key: "userInterestFashion" },
    { label: "🏀운동", key: "userInterestWorkout" },
    { label: "🍗맛집", key: "userInterestFood" },
    { label: "🎵음악", key: "userInterestMusic" },
    { label: "💸경제", key: "userInterestEconomics" },
    { label: "🏠일상", key: "userInterestNull" }
  ];

  // render: 공통 레이아웃 컴포넌트 렌더링 //
  return (
    <div id="my-user-page">
      <div className="my-container">
        <div className="profile-mypage">{nickname}의 마이페이지</div>
        <div className="my-user-container">
          <div className="profile">
            <div className="profile-container">
              <div className="profile-line">
                <div>프로필</div>
                <div className="button-tag-container">
                  {nickname !== userNickname && (
                    <div className="chatting-button" onClick={onChatPageClickHandler}>
                      채팅
                    </div>
                  )}
                  {nickname !== userNickname && <FollowButton getFollow={getFollow} />}
                  {nickname === userNickname && <UpdateButton nickname={nickname!} />}
                </div>
              </div>
              <div className="profile-image">
                <img
                  src={!userProfileImage ? userImage : userProfileImage}
                  alt="User"
                  className="profile-img"
                />
              </div>
              <div className="follower-followee-container">
                <div className="follower" onClick={onFollowerPageClickHandler}>
                  <div className="follower-text">팔로워</div>
                  <div className="number">{follower}</div>
                </div>
                <div className="followee" onClick={onFolloweePageClickHandler}>
                  <div className="followee-text">팔로잉</div>
                  <div className="number">{followee}</div>
                </div>
              </div>
              <div className="self-introdction-container">{userIntroduce}</div>
              <div className="self-interest-container">
                <div className="interest">관심사 |</div>
                {interestMap
                  .filter(({ key }) => interests[key])
                  .map(({ label }, index) => (
                    <div className="interest-map" key={index}>
                      <div className="emoji">{label.slice(0, 2)}</div>
                      <div className="text">{label.slice(2)}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="board-container">
            <div className="board-name">
              <div className="board-numbers">게시물 번호</div>
              <div className="board-titles">제목</div>
              <div className="board-views">조회수</div>
              <div className="board-likes">좋아요 수</div>
              <div className="board-date-time">날짜</div>
            </div>

            <div className="board-type">
              <div
                className="board-type-daily"
                onClick={dailys.length === 0 ? undefined : onUserDailyClickHandler}
              >
                <div className="board-type-text">일상</div>
                {dailys.length === 0 ? (
                  <div className="no-content">아직 작성한 글이 없습니다.</div>
                ) : (
                  [...dailys]
                    .reverse()
                    .slice(0, 3)
                    .map(({ dailySequence, title, views, likeCount, creationDate }) => (
                      <div className="board-content" key={dailySequence}>
                        <div className="board-number">{dailySequence}</div>
                        <div className="board-title">{title}</div>
                        <div className="board-view">{views}</div>
                        <div className="board-like">{likeCount}</div>
                        <div className="board-date">{creationDate.split("T")[0]}</div>
                      </div>
                    ))
                )}
              </div>

              <div
                className="board-type-used"
                onClick={trades.length === 0 ? undefined : onUserTradeClickHandler}
              >
                <div className="board-type-text">중고 거래</div>

                {trades.length === 0 ? (
                  <div className="no-content">아직 작성한 글이 없습니다.</div>
                ) : (
                  [...trades]
                    .reverse()
                    .slice(0, 3)
                    .map(({ tradeSequence, title, views, likeCount, creationDate }) => (
                      <div className="board-content" key={tradeSequence}>
                        <div className="board-number">{tradeSequence}</div>
                        <div className="board-title">{title}</div>
                        <div className="board-view">{views}</div>
                        <div className="board-like">{likeCount}</div>
                        <div className="board-date">{creationDate.split("T")[0]}</div>
                      </div>
                    ))
                )}
              </div>

              <div
                className="board-type-just"
                onClick={boards.length === 0 ? undefined : onUserBoardClickHandler}
              >
                <div className="board-type-text">게시글</div>

                {boards.length === 0 ? (
                  <div className="no-content">아직 작성한 글이 없습니다.</div>
                ) : (
                  [...boards]
                    .reverse()
                    .slice(0, 3)
                    .map(({ boardSequence, title, views, likeCount, creationDate }) => (
                      <div className="board-content" key={boardSequence}>
                        <div className="board-number">{boardSequence}</div>
                        <div className="board-title">{title}</div>
                        <div className="board-view">{views}</div>
                        <div className="board-like">{likeCount}</div>
                        <div className="board-date">{creationDate.split("T")[0]}</div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
