import { Dispatch, SetStateAction } from "react";
import userImage from "../../../../assets/images/ex-user1.png";

interface Props {
  setActiveTab: Dispatch<SetStateAction<"followee" | "follower">>;
}

export default function UserPageFollower({ setActiveTab }: Props) {
  return (
    <div id="my-user-follow">
      <div className="follow-container">
        <div className="follower-part">
          팔로잉
          <div className="follower-list">
            <div className="profile-image-container">
              <img src={userImage} alt="User" className="profile-image" />
              <div className="nickname">김우진김우진우진</div>
            </div>
            <div className="profile-introduce">안녕하세요 저는 김우진입니다</div>
            <div className="cancel follow">팔로잉</div>
          </div>
        </div>
      </div>
    </div>
  );
}
