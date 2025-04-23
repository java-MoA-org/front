import { useCookies } from "react-cookie";
import useSignInUserStore from "../stores/sign-in-user.store";
import { ACCESS_TOKEN, REFRESH_TOKEN, ROOT_PATH } from "../constants";
import ResponseDto from "../apis/dto/response/response.dto";
import GetUserInfoResponseDto from "../apis/dto/response/user/get-user-info.response.dto";
import { getUserInfoRequest } from "../apis";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const useSignInUser = (nickname: string) => {
  // state: 쿠키상태 //
  const [cookies, _, removeCookie] = useCookies();

  // state: 로그인 유저 정보 상태 //
  const {
    setUserNickname,
    setUserProfileImage,
    setUserInterests,
    setUserIntroduce,
    setUserPhoneNumber,
    resetUser,
  } = useSignInUserStore();

  const getSignInUserResponse = (
    responseBody: GetUserInfoResponseDto | ResponseDto | null,
  ) => {
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
      removeCookie(ACCESS_TOKEN, { path: ROOT_PATH });
      removeCookie(REFRESH_TOKEN, { path: ROOT_PATH });
      resetUser();
      return;
    }

    const {
      userNickname,
      userProfileImage,
      userPhoneNumber,
      userIntroduce,
      userInterests,
    } = responseBody as GetUserInfoResponseDto;
    setUserNickname(userNickname);
    setUserProfileImage(userProfileImage);
    setUserInterests(userInterests);
    setUserIntroduce(userIntroduce);
    setUserPhoneNumber(userPhoneNumber);
  };

  // function: 로그인 사용자 정보 불러오기 //
  const getSignInUser = (nickname: string) => {
    getUserInfoRequest(cookies[ACCESS_TOKEN]).then(getSignInUserResponse);
  };

  useEffect(() => {
    if (!nickname) return;
    getSignInUser(nickname); // nickname 기반으로 요청
  }, [nickname]);

  return getSignInUser;
};

export default useSignInUser;
