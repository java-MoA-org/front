import { useEffect, useState } from "react";
import "./style.css";
import ResponseDto from "../../apis/dto/response/response.dto";
import { getFollowRequest, postFollowRequest } from "../../apis";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ACCESS_TOKEN, ROOT_ABSOULTE_PATH } from "../../constants";
import useSignInUserStore from "../../stores/sign-in-user.store";
import GetFollowResponseDto from "../../apis/dto/response/follow/get-follow.response.dto";

export default function FollowButton() {
  const { nickname } = useParams(); // ✅ URL에서 :nickname 추출
  const [cookies] = useCookies([ACCESS_TOKEN]);
  const accessToken = cookies[ACCESS_TOKEN];

  // function: put follow response 처리 함수 //
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
    if (!nickname) return;

    if (isSuccess) {
      getFollowRequest(nickname, accessToken).then(getFollowResponse);
    }
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
    const { followees } = responseBody as GetFollowResponseDto;
    setFollows(followees);
  };
  // effect:  //
  useEffect(() => {
    if (!accessToken) return;
    if (!nickname) return;

    getFollowRequest(nickname, accessToken).then(getFollowResponse);
  }, [nickname, getFollowRequest]);

  // event handler: 팔로우, 팔로잉 버튼 클릭 처리 //
  const onFollowButtonClickHandler = () => {
    if (!nickname || !accessToken) return;
    postFollowRequest(nickname, accessToken).then(postFollowResponse);
  };

  // state: 공감한 사용자 리스트 상태 //
  const [follows, setFollows] = useState<string[]>([]);

  // state: 로그인 사용자 아이디 상태 //
  const { userId } = useSignInUserStore();

  // variable: 팔로우 여부 //
  const isFollow = follows.includes(userId);
  // variable: 팔로우 클래스 //
  const followClass = isFollow ? "do following" : "do follow";

  return (
    <div className={followClass} onClick={onFollowButtonClickHandler}>
      {isFollow ? "팔로잉" : "팔로우"}
    </div>
  );
}
