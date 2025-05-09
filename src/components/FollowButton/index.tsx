import { useEffect, useState } from "react";
import "./style.css";
import ResponseDto from "../../apis/dto/response/response.dto";
import { getFollowRequest, postFollowRequest } from "../../apis";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ACCESS_TOKEN, ROOT_ABSOULTE_PATH } from "../../constants";
import useSignInUserStore from "../../stores/sign-in-user.store";
import GetFollowResponseDto from "../../apis/dto/response/follow/get-follow.response.dto";

interface Prop {
  getFollow: () => void;
  targetUserNickname?: string; // 팔로우할 대상 ID (선택)
  isFollowed?: boolean; // 외부에서 넘길 수도 있고
}

export default function FollowButton({ getFollow, targetUserNickname, isFollowed }: Prop) {
  const { nickname } = useParams(); // ✅ URL에서 :nickname 추출
  const [cookies] = useCookies([ACCESS_TOKEN]);
  const accessToken = cookies[ACCESS_TOKEN];
  // state: 공감한 사용자 리스트 상태 //
  const [follows, setFollows] = useState<string[]>([]);

  // state: 로그인 사용자 아이디 상태 //
  const { userId, userNickname } = useSignInUserStore();

  const [internalFollow, setInternalFollow] = useState<boolean | null>(null);

  const targetNickname = targetUserNickname ?? nickname; // 대상 ID 결정

  // function: fetch follow 상태 //
  const fetchFollowState = async () => {
    if (!accessToken || !targetNickname) return;
    const response = await getFollowRequest(targetNickname, accessToken);
    if (response && response.code === "SU") {
      const followees = (response as GetFollowResponseDto).followees;
      setFollows(followees);
      setInternalFollow(followees.includes(userId));
    }
  };

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
      getFollow();
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

  useEffect(() => {
    if (isFollowed !== undefined) {
      // props로 받은 경우엔 내부에서 따로 체크할 필요 없음
      setInternalFollow(isFollowed);
    } else {
      fetchFollowState(); // 직접 가져와야 하는 경우
    }
  }, [targetNickname, isFollowed]);

  // event handler: 팔로우, 팔로잉 버튼 클릭 처리 //
  const onFollowButtonClickHandler = () => {
    if (!nickname || !accessToken) return;
    postFollowRequest(nickname, accessToken).then(postFollowResponse);
  };

  const onFollowClick = () => {
    if (!targetNickname || !accessToken) return;
    postFollowRequest(targetNickname, accessToken).then(() => {
      getFollow(); // 상위 상태 갱신
      if (isFollowed === undefined) fetchFollowState(); // 외부값이 없을 경우만 갱신
    });
  };

  const isNowFollowed = isFollowed ?? internalFollow ?? false;
  // variable: 팔로우 클래스 //
  const followClass = isNowFollowed ? "do following" : "do follow";

  return (
    <div
      className={followClass}
      onClick={onFollowClick}
      style={targetNickname === userNickname ? { visibility: "hidden" } : {}}
    >
      {isNowFollowed ? "팔로잉" : "팔로우"}
    </div>
  );
}
