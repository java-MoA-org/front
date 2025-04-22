import "./style.css";

export default function UserPageUpdate() {
  return (
    <div id="update-userpage">
      <div className="profile-container">
        <div className="profile-image-container">
          <div className="profile-image"></div>
          <div className="image-update-button">프로필 이미지 변경</div>
        </div>

        <div className="profile-content-container">
          <div className="introduce-container">
            <div className="introduce">자기소개</div>
            <div className="introduce-content">
              <input type="text" />
            </div>
          </div>
          <div className="interest-container">
            <div className="interest">관심사</div>
            <div className="interest-content">운동</div>
          </div>
          <div className="nickname-container">
            <div className="nickname">닉네임</div>
            <div className="nickname-content">우진우진</div>
          </div>
          <div className="phone-number-container">
            <div className="phone-number">전화번호</div>
            <div className="phone-number-content">010-1111-2222</div>
          </div>
          <div className="password-container">
            <div className="password">비밀번호</div>
            <div className="password-content">***********</div>
          </div>
        </div>
        <div>저장</div>
      </div>
    </div>
  );
}
