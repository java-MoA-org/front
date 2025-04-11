import "./style.css";

export default function UserPageFollow() {
  return (
    <div id="my-user-follow">
      <div className="follow-container">
        <div className="follower-part">
          팔로잉
          <div className="follower-list">
            <div className="profile-image">프로필</div>
            <div className="profile-introduce">안녕하세요 저는 김우진입니다</div>

            <div className="cancel follow">팔로우 취소</div>
          </div>
        </div>
        <div className="followee-part">
          팔로워
          <div className="followee-list">
            <div className="profile-image">프로필</div>
            <div className="profile-introduce">안녕하세요 저는 김우진입니다</div>
            <div className="do follow">팔로우</div>
          </div>
        </div>
      </div>
    </div>
  );
}
