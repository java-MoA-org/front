import "./style.css";
import userImage from "../../assets/images/ex-user1.png";
import { useNavigate, useParams } from "react-router-dom";
import {
  MY_USER_BOARD_ABSOLUTE_PATH,
  MY_USER_FOLLOW_ABSOLUTE_PATH,
} from "../../constants";
import FollowButton from "../../components/FollowButton";
import { Board, Daily, Trade } from "../../types/interfaces";
import UserInterest from "../../types/interfaces/user-interest.interface";
import UpdateButton from "../../components/UpdateButton";

// interface: 게시판, 일상, 중고거래 레코드 컴포넌트 속성 //
interface MyUserPageProps {
  boards: Board[];
  dailys: Daily[];
  trades: Trade[];
  interests: UserInterest;
  userIntroduce: string;
}

export default function MyUserPage({
  boards,
  dailys,
  trades,
  interests,
  userIntroduce,
}: MyUserPageProps) {
  const { nickname } = useParams(); // ✅ URL에서 :nickname 추출

  const activeInterests = Object.entries(interests)
    .filter(([_, value]) => value)
    .map(([key]) => key.replace("userInterest", ""));

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // event handler: 팔로워, 팔로잉 처리 //
  const onFollowerClickHandler = () => {
    if (!nickname) return;
    navigator(`${MY_USER_FOLLOW_ABSOLUTE_PATH(nickname)}?type=follower`);
  };
  const onFolloweeClickHandler = () => {
    if (!nickname) return;
    navigator(`${MY_USER_FOLLOW_ABSOLUTE_PATH(nickname)}?type=followee`);
  };

  // event handler: 팔로워, 팔로잉 처리 //
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
                <FollowButton />
                <UpdateButton nickname={nickname!} />
              </div>
              <div className="profile-image">
                <img src={userImage} alt="User" className="profile-img" />
              </div>
              <div className="follower-followee-container">
                <div className="follower" onClick={onFollowerClickHandler}>
                  <div className="follower-text">팔로워</div>
                  <div className="number">0</div>
                </div>
                <div className="followee" onClick={onFolloweeClickHandler}>
                  <div className="followee-text">팔로잉</div>
                  <div className="number">0</div>
                </div>
              </div>
              <div className="self-introdction-container">{userIntroduce}</div>
              <div className="self-interest-container">
                <div className="interest">관심사 |</div>
                {activeInterests.map((interest, index) => (
                  <div className="interest" key={index}>
                    {interest}
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
                onClick={
                  dailys.length === 0 ? undefined : onUserDailyClickHandler
                }
              >
                <div className="board-type-text">일상</div>
                {dailys.length === 0 ? (
                  <div className="no-content">아직 작성한 글이 없습니다.</div>
                ) : (
                  [...dailys]
                    .reverse()
                    .slice(0, 3)
                    .map(
                      ({
                        dailySequence,
                        title,
                        views,
                        likeCount,
                        creationDate,
                      }) => (
                        <div className="board-content" key={dailySequence}>
                          <div className="board-number">{dailySequence}</div>
                          <div className="board-title">{title}</div>
                          <div className="board-view">{views}</div>
                          <div className="board-like">{likeCount}</div>
                          <div className="board-date">
                            {creationDate.split("T")[0]}
                          </div>
                        </div>
                      ),
                    )
                )}
              </div>

              <div
                className="board-type-used"
                onClick={
                  trades.length === 0 ? undefined : onUserTradeClickHandler
                }
              >
                <div className="board-type-text">중고 거래</div>

                {trades.length === 0 ? (
                  <div className="no-content">아직 작성한 글이 없습니다.</div>
                ) : (
                  [...trades]
                    .reverse()
                    .slice(0, 3)
                    .map(
                      ({
                        tradeSequence,
                        title,
                        views,
                        likeCount,
                        creationDate,
                      }) => (
                        <div className="board-content" key={tradeSequence}>
                          <div className="board-number">{tradeSequence}</div>
                          <div className="board-title">{title}</div>
                          <div className="board-view">{views}</div>
                          <div className="board-like">{likeCount}</div>
                          <div className="board-date">
                            {creationDate.split("T")[0]}
                          </div>
                        </div>
                      ),
                    )
                )}
              </div>

              <div
                className="board-type-just"
                onClick={
                  boards.length === 0 ? undefined : onUserBoardClickHandler
                }
              >
                <div className="board-type-text">게시글</div>

                {boards.length === 0 ? (
                  <div className="no-content">아직 작성한 글이 없습니다.</div>
                ) : (
                  [...boards]
                    .reverse()
                    .slice(0, 3)
                    .map(
                      ({
                        boardSequence,
                        title,
                        views,
                        likeCount,
                        creationDate,
                      }) => (
                        <div className="board-content" key={boardSequence}>
                          <div className="board-number">{boardSequence}</div>
                          <div className="board-title">{title}</div>
                          <div className="board-view">{views}</div>
                          <div className="board-like">{likeCount}</div>
                          <div className="board-date">
                            {creationDate.split("T")[0]}
                          </div>
                        </div>
                      ),
                    )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
