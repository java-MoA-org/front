import "./style.css";
import userImage from "../../assets/images/ex-user1.png";
import { useNavigate } from "react-router-dom";
import { MY_USER_FOLLOW_ABSOULTE_PATH } from "../../constants";
export default function MyUserPage() {
  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // event handler: 팔로워, 팔로잉잉 처리 //
  const onFollowClickHandler = () => {
    navigator(MY_USER_FOLLOW_ABSOULTE_PATH);
  };

  // render: 공통 레이아웃 컴포넌트 렌더링 //
  return (
    <div id="my-user-page">
      <div className="my-container">
        <div className="profile-mypage">닉네임의 마이페이지</div>
        <div className="my-user-container">
          <div className="profile">
            <div className="profile-container">
              <div className="profile-line">
                <div>프로필</div>
                <div className="follow">팔로우</div>
              </div>
              <div className="profile-image">
                <img src={userImage} alt="User" className="profile-img" />
              </div>
              <div className="nickname">닉네임 :</div>
              <div className="follower-followee-container">
                <div className="follower" onClick={onFollowClickHandler}>
                  <div className="follower-text">팔로워</div>
                  <div className="number">0</div>
                </div>
                <div className="followee" onClick={onFollowClickHandler}>
                  <div className="followee-text">팔로잉</div>
                  <div className="number">0</div>
                </div>
              </div>
              <div className="self-introdction-container">반갑습니다</div>
              <div className="self-interest-container">
                <div className="interest">관심사 |</div>
                <div className="interest">운동</div>
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
              <div className="board-type-daily">
                <div className="board-type-daily-text">일상</div>
                <div className="board-content">
                  <div className="board-number">400</div>
                  <div className="board-title">날씨가 좋디그런가그래?</div>
                  <div className="board-view">10</div>
                  <div className="board-like">3</div>
                  <div className="board-date">2025-04-10</div>
                </div>
                <div className="board-content">
                  <div className="board-number">1</div>
                  <div className="board-title">날씨가 좋디</div>
                  <div className="board-view">10</div>
                  <div className="board-like">3</div>
                  <div className="board-date">2025-04-10</div>
                </div>
                <div className="board-content">
                  <div className="board-number">1</div>
                  <div className="board-title">날씨가 좋디</div>
                  <div className="board-view">10</div>
                  <div className="board-like">3</div>
                  <div className="board-date">2025-04-10</div>
                </div>
              </div>

              <div className="board-type-used">
                중고 거래
                <div className="board-content">
                  <div className="board-number">1</div>
                  <div className="board-title">날씨가 좋디</div>
                  <div className="board-view">10</div>
                  <div className="board-like">3</div>
                  <div className="board-date">2025-04-10</div>
                </div>
                <div className="board-content">
                  <div className="board-number">1</div>
                  <div className="board-title">날씨가 좋디</div>
                  <div className="board-view">10</div>
                  <div className="board-like">3</div>
                  <div className="board-date">2025-04-10</div>
                </div>
                <div className="board-content">
                  <div className="board-number">1</div>
                  <div className="board-title">날씨가 좋디</div>
                  <div className="board-view">10</div>
                  <div className="board-like">3</div>
                  <div className="board-date">2025-04-10</div>
                </div>
              </div>

              <div className="board-type-just">
                게시글
                <div className="board-content">
                  <div className="board-number">1</div>
                  <div className="board-title">날씨가 좋디</div>
                  <div className="board-view">10</div>
                  <div className="board-like">3</div>
                  <div className="board-date">2025-04-10</div>
                </div>
                <div className="board-content">
                  <div className="board-number">1</div>
                  <div className="board-title">날씨가 좋디</div>
                  <div className="board-view">10</div>
                  <div className="board-like">3</div>
                  <div className="board-date">2025-04-10</div>
                </div>
                <div className="board-content">
                  <div className="board-number">1</div>
                  <div className="board-title">날씨가 좋디</div>
                  <div className="board-view">10</div>
                  <div className="board-like">3</div>
                  <div className="board-date">2025-04-10</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>Footer</div>
    </div>
  );
}
