import { Dispatch, SetStateAction, useState } from "react";
import userImage from "../../../../assets/images/ex-user1.png";
import FollowButton from "../../../../components/FollowButton";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ACCESS_TOKEN } from "../../../../constants";
import useSignInUserStore from "../../../../stores/sign-in-user.store";
import { getFollowRequest } from "../../../../apis";
import GetFollowResponseDto from "../../../../apis/dto/response/follow/get-follow.response.dto";
import ResponseDto from "../../../../apis/dto/response/response.dto";

interface Props {
  setActiveTab: Dispatch<SetStateAction<"followee" | "follower">>;
}

export default function UserPageFollower({ setActiveTab }: Props) {
  const { nickname } = useParams(); // ✅ URL에서 :nickname 추출
  const [cookies] = useCookies();
  const accessToken = cookies[ACCESS_TOKEN];

  // state: follow 상태 관리 //
  const [follows, setFollows] = useState<string[]>([]);
  const { userNickname } = useSignInUserStore();

  const getFollow = () => {
    if (!accessToken) return;
    if (!userNickname) {
      return;
    }
    if (!nickname) {
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
      return;
    }
    const { followers } = responseBody as GetFollowResponseDto;
    setFollows(followers);
  };
  return (
    <div id="my-user-follower">
      <div className="follower-container">
        <div className="follower-part">
          <div className="profile-image-container">
            <img src={userImage} alt="User" className="profile-image" />
          </div>
          <div className="follower-list">
            <div className="nickname">김우진만세</div>
            <div className="profile-introduce">
              안녕하세요 저는 김우진입니다안녕하세요 저는 김우진입니다안녕하세요저는
              김우진입니다안녕하세요저는 김우진입니다안녕하세요저는 김우진입니다안녕하세요저는
              김우진입니다안녕하세요저는 김우진입니다안녕하세요저는 김우진입니다안녕하세요저는
              김우진입니다안녕하세요저는 김우진입니다안녕하세요
            </div>
          </div>
          <FollowButton getFollow={getFollow} />
        </div>
      </div>
    </div>
  );
}
