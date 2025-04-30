import { useState } from "react";
import "./style.css";
import ResponseDto from "../../apis/dto/response/response.dto";
import { postFollowRequest } from "../../apis";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ACCESS_TOKEN } from "../../constants";

interface FollowButtonProps {
  initialIsFollowing?: boolean; // ❗초기 상태 props로 받기 (선택적)
}

export default function FollowButton({ initialIsFollowing = false }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  const { nickname } = useParams(); // ✅ URL에서 :nickname 추출
  const [cookies] = useCookies([ACCESS_TOKEN]);
  const accessToken = cookies[ACCESS_TOKEN];

  // function: post follow response 처리 함수 //
  const postFollowResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody
      ? "서버에 문제가 있습니다."
      : responseBody.code === "DBE"
      ? "서버에 문제가 있습니다."
      : responseBody.code === "AF"
      ? "인증에 실패했습니다."
      : "";

    const isSuccess = responseBody !== null && responseBody.code === "SU";
    if (!isSuccess) {
      alert(message);
      return;
    }
  };

  // event handler: 팔로우, 팔로잉 버튼 클릭 처리 //
  const onFollowButtonClickHandler = () => {
    if (!nickname || !accessToken) return;
    postFollowRequest(nickname, accessToken).then(postFollowResponse);
  };
  const unFollowButtonClickHandler = () => {};

  const handleToggle = () => {
    // 나중에 요청 추가하면 여기서 fetch/post 등 처리 가능
    setIsFollowing((prev) => !prev);
  };

  const followClass = isFollowing ? "following" : "follow";

  return (
    <div className={`do ${followClass}`} onClick={handleToggle}>
      {isFollowing ? "팔로잉" : "팔로우"}
    </div>
  );
}
