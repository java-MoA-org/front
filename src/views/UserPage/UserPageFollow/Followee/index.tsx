import { Dispatch, SetStateAction, useEffect, useState } from "react";
import userImage from "../../../../assets/images/ex-user1.png";
import FollowButton from "../../../../components/FollowButton";
import GetFollowResponseDto from "../../../../apis/dto/response/follow/get-follow.response.dto";
import ResponseDto from "../../../../apis/dto/response/response.dto";
import { getFollowInfoRequest, getFollowRequest } from "../../../../apis";
import useSignInUserStore from "../../../../stores/sign-in-user.store";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ACCESS_TOKEN, MY_USER_ABSOLUTE_PATH } from "../../../../constants";
import GetUserInfoResponseDto from "../../../../apis/dto/response/user/get-user-info.response.dto";
import GetUserFollowInfoResponseDto from "../../../../apis/dto/response/user/get-user-follow-info.response.dto";
import userFollowInfoDto from "../../../../types/interfaces/user-follow-info.interface";

interface Props {
  setActiveTab: Dispatch<SetStateAction<"followee" | "follower">>;
}

export default function UserPageFollowee({ setActiveTab }: Props) {
  // state: follow 상태 관리 //
  const [follows, setFollows] = useState<string[]>([]);
  const { nickname } = useParams(); // ✅ URL에서 :nickname 추출
  const [cookies] = useCookies();
  const accessToken = cookies[ACCESS_TOKEN];
  const [profiles, setProfiles] = useState<userFollowInfoDto[]>([]);
  const navigator = useNavigate();

  const getFollow = () => {
    if (!accessToken) return;
    if (!nickname) {
      return;
    }
    getFollowRequest(nickname, accessToken).then(getFollowResponse);
  };

  useEffect(() => {
    console.log(accessToken, nickname);
    if (!accessToken || !nickname) return;

    getFollowInfoRequest(nickname, accessToken)
      .then(getFollowInfoResponse)
      .catch((err) => {
        console.error("팔로우 정보 요청 실패", err);
      });
  }, [nickname, accessToken]);

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

  // followees에 있는 아이디를 map으로 꺼내서 이 아이디를 통해 userInfo를 불러오고 거기서 닉네임 자기소개 프로필 사진 팔로우 버튼 가져오기

  // function: get follow info 처리 함수 //
  const getFollowInfoResponse = (
    responseBody: GetUserFollowInfoResponseDto | ResponseDto | null
  ) => {
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
    const { followees } = responseBody as GetUserFollowInfoResponseDto;
    setProfiles(followees);
  };

  // event handler: 사용자 마이페이지 클릭 핸들러 //
  const onUserClickHandler = (nickname: string) => {
    if (!nickname) return;
    navigator(`${MY_USER_ABSOLUTE_PATH(nickname)}`);
  };

  return (
    <div id="my-user-followee">
      <div className="followee-container">
        {profiles.length === 0 ? (
          <p>아직 팔로잉된 사용자가 없습니다.</p>
        ) : (
          profiles.map((p) => (
            <div className="followee-part" key={p.userId}>
              <div className="profile-image-container">
                <img
                  src={p.profileImage || userImage}
                  alt={p.userNickname}
                  className="profile-image"
                  onClick={() => onUserClickHandler(p.userNickname)}
                />
              </div>
              <div className="followee-list" onClick={() => onUserClickHandler(p.userNickname)}>
                <div className="nickname">{p.userNickname}</div>
                <div className="profile-introduce">{p.userIntroduce}</div>
              </div>
              <FollowButton
                getFollow={getFollow}
                targetUserNickname={p.userNickname}
                isFollowed={p.isFollowed}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
