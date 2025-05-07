import { Dispatch, SetStateAction, useState } from "react";
import userImage from "../../../../assets/images/ex-user1.png";
import FollowButton from "../../../../components/FollowButton";
import GetFollowResponseDto from "../../../../apis/dto/response/follow/get-follow.response.dto";
import ResponseDto from "../../../../apis/dto/response/response.dto";

interface Props {
  setActiveTab: Dispatch<SetStateAction<"followee" | "follower">>;
}

export default function UserPageFollowee({ setActiveTab }: Props) {
  // state: follow 상태 관리 //
  const [follows, setFollows] = useState<string[]>([]);

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
      return;
    }
    const { followees } = responseBody as GetFollowResponseDto;
    setFollows(followees);
  };

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
              안녕하세요 저는 김우진입니다안녕하세요 저는 김우진입니다안녕하세요저는
              김우진입니다안녕하세요저는 김우진입니다안녕하세요저는 김우진입니다안녕하세요저는
              김우진입니다안녕하세요저는 김우진입니다안녕하세요저는 김우진입니다안녕하세요저는
              김우진입니다안녕하세요저는 김우진입니다안녕하세요저는 김우진입니다안녕하세요저는
              김우진입니다안녕하세요
            </div>
          </div>
          <FollowButton />
        </div>
      </div>
    </div>
  );
}
