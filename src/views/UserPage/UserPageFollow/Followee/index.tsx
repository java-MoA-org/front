import { Dispatch, SetStateAction } from "react";
import userImage from "../../../../assets/images/ex-user1.png";
import FollowButton from "../../../../components/FollowButton";

interface Props {
  setActiveTab: Dispatch<SetStateAction<"followee" | "follower">>;
}

export default function UserPageFollowee({ setActiveTab }: Props) {
  return (
    <div id="my-user-followee">
      <div className="followee-container">
        <div className="followee-part">
          <div className="profile-image-container">
            <img src={userImage} alt="User" className="profile-image" />
          </div>
          <div className="followee-list">
            <div className="nickname">김우진만세</div>
            <div className="profile-introduce">
              안녕하세요 저는 김우진입니다안녕하세요 저는
              김우진입니다안녕하세요저는 김우진입니다안녕하세요저는
              김우진입니다안녕하세요저는 김우진입니다안녕하세요저는
              김우진입니다안녕하세요저는 김우진입니다안녕하세요저는
              김우진입니다안녕하세요저는 김우진입니다안녕하세요저는
              김우진입니다안녕하세요저는 김우진입니다안녕하세요저는
              김우진입니다안녕하세요
            </div>
          </div>
          <FollowButton initialIsFollowing={true} />
        </div>
      </div>
    </div>
  );
}
