import { Dispatch, SetStateAction } from "react";
import userImage from "../../../assets/images/ex-user1.png";

interface Props {
  setActiveTab: Dispatch<SetStateAction<"followee" | "follower">>;
}

export default function UserPageFollowee({ setActiveTab }: Props) {
  return (
    <div id="my-user-follow">
      <div className="follow-container">
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
