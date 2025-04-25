import axios, { AxiosError, AxiosResponse } from "axios";
import IdCheckRequestDto from "./dto/request/auth/user-id-check.request.dto";
import ResponseDto from "./dto/response/response.dto";

import PostNoticeRequestDto from "./dto/request/notice/post-notice.request.dto";
import PatchNoticeRequestDto from "./dto/request/notice/patch-notice.request.dto";
import GetNoticeListResponseDto from "./dto/response/notice/get-notice-list.response.dto";
import GetNoticeResponseDto from "./dto/response/notice/get-notice.response.dto";
import UserIdCheckRequestDto from "./dto/request/auth/user-id-check.request.dto";
import UserNicknameCheckRequestDto from "./dto/request/auth/user-nickname-check.request.dto";
import UserEmailCheckRequestDto from "./dto/request/auth/user-email-check.request.dto";
import UserPhoneNumberCheckRequestDto from "./dto/request/auth/user-phone-number-check.request.dto";
import UserSignUpRequestDto from "./dto/request/auth/user-sign-up.request.dto";
import UserSignInRequestDto from "./dto/request/auth/user-sign-in.request.dto";
import {
  PatchBoardRequestDto,
  PostBoardCommentRequestDto,
  PostBoardRequestDto
} from "./dto/request/board";
import {
  GetBoardCommentResponseDto,
  GetBoardListResponseDto,
  GetBoardResponseDto
} from "./dto/response/board";
import {
  PatchDailyRequestDto,
  PostDailyCommentRequestDto,
  PostDailyRequestDto
} from "./dto/request/daily";
import {
  GetDailyCommentResponseDto,
  GetDailyListResponseDto,
  GetDailyResponseDto,
  GetLikedUserListResponseDto
} from "./dto/response/daily";
import { PatchUsedTradeRequestDto, PostUsedTradeRequestDto } from "./dto/request/usedtrade";
import { GetUsedTradeListResponseDto, GetUsedTradeResponseDto } from "./dto/response/usedtrade";
import GetUserPageResponseDto from "./dto/response/userpage/get-user-page.response.dto";
import UserEmailVerifyRequestDto from "./dto/request/auth/user-email-verify.request.dto";
import UserPhoneNumberVerifyRequestDto from "./dto/request/auth/user-phone-number-verify.request.dto";
import { ACCESS_TOKEN } from "../constants";
import GetUserInfoResponseDto from "./dto/response/user/get-user-info.response.dto";
import PatchPasswordRequestDto from "./dto/request/auth/patch-password.request.dto";
import PasswordVerifyRequestDto from "./dto/request/userInfo/post-verify-pawword.request.dto";
import PatchPasswordUserPageRequestDto from "./dto/request/userInfo/patch-password-userpage.request.dto";

const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;

const AUTH_MODULE_URL = `${API_DOMAIN}/api/v1/auth`;

const ID_CHECK_URL = `${AUTH_MODULE_URL}/id/check`;
const NICKNAME_CHECK_URL = `${AUTH_MODULE_URL}/nickname/check`;
const PROFILE_IMAGE_UPLOAD_URL = `${AUTH_MODULE_URL}/profileImage/upload`;
const EMAIL_CHECK_URL = `${AUTH_MODULE_URL}/email/verify/require`;
const EMAIL_VERIFY_URL = `${AUTH_MODULE_URL}/email/verify`;
const FIND_ID_EMAIL_CHECK_URL = `${AUTH_MODULE_URL}/find-id/email/verify/require`;
const FIND_ID_EMAIL_CHECK_VERIFY_URL = `${AUTH_MODULE_URL}/find-id/email/verify`;
const PHONE_NUMBER_CHECK_URL = `${AUTH_MODULE_URL}/phone/verify/require`;
const PHONE_NUMBER_VERIFY_URL = `${AUTH_MODULE_URL}/phone/verify`;

const SIGN_UP_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_URL = `${AUTH_MODULE_URL}/sign-in`;
export const SNS_SIGN_IN_URL = (sns: "kakao" | "naver") => `${AUTH_MODULE_URL}/sns/${sns}`;
const SIGN_OUT_URL = `${AUTH_MODULE_URL}/sign-out`;

const PATCH_PASSWORD_URL = (userId: string) => `${AUTH_MODULE_URL}/${userId}/password`;

const REFRESH_TOKEN_URL = `${AUTH_MODULE_URL}/refresh`;

const USER_MODULE_URL = `${API_DOMAIN}/api/v1/user`;

const GET_USER_INFO_URL = `${USER_MODULE_URL}/info`;

const BOARD_MODULE_URL = `${API_DOMAIN}/api/v1/board`;

const POST_BOARD_URL = BOARD_MODULE_URL;
const GET_BOARD_LIST_URL = (tag: string, page: number, sort = "LATEST") =>
  `${BOARD_MODULE_URL}/${tag}/${page}?sortOption=${sort}`;
const GET_BOARD_URL = (boardSequence: number | string) => `${BOARD_MODULE_URL}/${boardSequence}`;
const PATCH_BOARD_URL = (boardSequence: number | string) => `${BOARD_MODULE_URL}/${boardSequence}`;
const DELETE_BOARD_URL = (boardSequence: number | string) => `${BOARD_MODULE_URL}/${boardSequence}`;
const SEARCH_BOARD_LIST_URL = (tag: string, keyword: string, page: number) =>
  `${BOARD_MODULE_URL}/search?tag=${tag}&keyword=${keyword}&page=${page}`;

const TOGGLE_BOARD_LIKE_URL = (boardSequence: number | string) =>
  `${BOARD_MODULE_URL}/${boardSequence}/likes`;

const POST_BOARD_COMMENT_URL = (boardSequence: number | string) =>
  `${BOARD_MODULE_URL}/${boardSequence}/comments`;
const GET_BOARD_COMMENT_URL = (boardSequence: number | string) =>
  `${BOARD_MODULE_URL}/${boardSequence}/comments`;
const DELETE_BOARD_COMMENT_URL = (commentSequence: number | string) =>
  `${BOARD_MODULE_URL}/${commentSequence}/comments`;

const DAILY_MODULE_URL = `${API_DOMAIN}/api/v1/daily`;

const POST_DAILY_URL = DAILY_MODULE_URL;
const GET_DAILY_URL = (dailySequence: number | string) => `${DAILY_MODULE_URL}/${dailySequence}`;
const GET_DAILY_LIST_URL = (page: number, sort = "LATEST") =>
  `${DAILY_MODULE_URL}/${page}?sortOption=${sort}`;
const PATCH_DAILY_URL = (dailySequence: number | string) => `${DAILY_MODULE_URL}/${dailySequence}`;
const DELETE_DAILY_URL = (dailySequence: number | string) => `${DAILY_MODULE_URL}/${dailySequence}`;

const PUT_DAILY_LIKES_URL = (dailySequence: number | string) =>
  `${DAILY_MODULE_URL}/${dailySequence}/likes`;
const GET_DAILY_LIKES_URL = (dailySequence: number | string) =>
  `${DAILY_MODULE_URL}/${dailySequence}/likes`;

const POST_DAILY_COMMENT_URL = (dailySequence: number | string) =>
  `${DAILY_MODULE_URL}/${dailySequence}/comments`;
const GET_DAILY_COMMENT_URL = (dailySequence: number | string) =>
  `${DAILY_MODULE_URL}/${dailySequence}/comments`;
const DELETE_DAILY_COMMENT_URL = (dailySequence: number | string) =>
  `${DAILY_MODULE_URL}/${dailySequence}/comments`;

const USED_TRADE_MODULE_URL = `${API_DOMAIN}/api/v1/used-trade`;

const POST_USED_TRADE_URL = USED_TRADE_MODULE_URL;
const GET_USED_TRADE_URL = (tradeSequence: number | string) =>
  `${USED_TRADE_MODULE_URL}/${tradeSequence}`;
const GET_USED_TRADE_LIST_URL = (tag: string, page: number, sort = "LATEST") =>
  `${USED_TRADE_MODULE_URL}/${tag}/${page}?sortOption=${sort}`;
const PATCH_USED_TRADE_URL = (tradeSequence: number | string) =>
  `${USED_TRADE_MODULE_URL}/${tradeSequence}`;
const DELETE_USED_TRADE_URL = (tradeSequence: number | string) =>
  `${USED_TRADE_MODULE_URL}/${tradeSequence}`;
const SEARCH_USED_TRADE_LIST_URL = (tag: string, keyword: string, page: number) =>
  `${USED_TRADE_MODULE_URL}/search?tag=${tag}&keyword=${keyword}&page=${page}`;

const TOGGLE_USED_TRADE_LIKE_URL = (tradeSequence: number | string) =>
  `${USED_TRADE_MODULE_URL}/${tradeSequence}/likes`;

// notice API URL
const NOTICE_MODULE_URL = `${API_DOMAIN}/api/v1/notice`;
const POST_NOTICE_URL = NOTICE_MODULE_URL;
const GET_NOTICE_LIST_URL = `${NOTICE_MODULE_URL}/list`;
const GET_NOTICE_URL = (noticeId: number | string) => `${NOTICE_MODULE_URL}/${noticeId}`;
const PATCH_NOTICE_URL = (noticeId: number | string) => `${NOTICE_MODULE_URL}/${noticeId}`;
const DELETE_NOTICE_URL = (noticeId: number | string) => `${NOTICE_MODULE_URL}/${noticeId}`;

const USER_PAGE_MODULE_URL = `${API_DOMAIN}/api/v1/user-page`;
const GET_USER_PAGE_URL = (nickname: string) => `${USER_PAGE_MODULE_URL}/boards/${nickname}`;
const GET_USER_UPDATE_PAGE_URL = `${USER_PAGE_MODULE_URL}/revise`;
const PATCH_USER_UPDATE_PAGE_URL = `${USER_PAGE_MODULE_URL}/revise`;
const POST_USER_PASSWORD_VERIFY_URL = `${USER_PAGE_MODULE_URL}/password/verify`;
const PATCH_USER_PAGE_PASSWORD_VERIFY_URL = `${USER_PAGE_MODULE_URL}/password/change`;

// function: Authorization Bearer 헤더 //
const bearerAuthorization = (accessToken: string) => ({
  headers: { Authorization: `Bearer ${accessToken}` }
});

export const userIdCheckRequest = async (requestBody: UserIdCheckRequestDto) => {
  const responseBody = await axios
    .post(ID_CHECK_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

export const userNicknameCheckRequest = async (requestBody: UserNicknameCheckRequestDto) => {
  const responseBody = await axios
    .post(NICKNAME_CHECK_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

export const userEmailCheckRequest = async (requestBody: UserEmailCheckRequestDto) => {
  const responseBody = await axios
    .post(EMAIL_CHECK_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

export const UserEmailVerifyRequest = async (requestBody: UserEmailVerifyRequestDto) => {
  const responseBody = await axios
    .post(EMAIL_VERIFY_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

export const userEmailCheckFindIdRequest = async (requestBody: UserEmailCheckRequestDto) => {
  const responseBody = await axios
    .post(FIND_ID_EMAIL_CHECK_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

export const UserEmailFindIdVerifyRequest = async (requestBody: UserEmailVerifyRequestDto) => {
  const responseBody = await axios
    .post(FIND_ID_EMAIL_CHECK_VERIFY_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

export const userPhoneNumberCheckRequest = async (requestBody: UserPhoneNumberCheckRequestDto) => {
  const responseBody = await axios
    .post(PHONE_NUMBER_CHECK_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

export const UserPhoneNumberVerifyRequest = async (
  requestBody: UserPhoneNumberVerifyRequestDto
) => {
  const responseBody = await axios
    .post(PHONE_NUMBER_VERIFY_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

export const userSignUpRequest = async (requestBody: UserSignUpRequestDto) => {
  const responseBody = await axios
    .post(SIGN_UP_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

export const userSignInRequest = async (requestBody: UserSignInRequestDto) => {
  const responseBody = await axios
    .post(SIGN_IN_URL, requestBody, { withCredentials: true })
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

export const userSignOutRequest = async (accessToken: string) => {
  await axios.post(SIGN_OUT_URL, bearerAuthorization(accessToken));
};

export const PatchPasswordRequest = async (requestBody: PatchPasswordRequestDto) => {
  const responseBody = await axios
    .patch(PATCH_PASSWORD_URL(requestBody.userId), requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

export const userProfileImageUpload = async (requestBody: FormData) => {
  const url = await axios.post(PROFILE_IMAGE_UPLOAD_URL, requestBody, {
    withCredentials: true
  });
  return url;
};

export const refreshAccessTokenRequest = async () => {
  const response = await axios.post(REFRESH_TOKEN_URL, {}, { withCredentials: true });
  const { accessToken, expiration } = response.data;

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    return expiration;
  }

  return null;
};

// function: get user info API 요청 함수 //
export const getUserInfoRequest = async (accessToken: string) => {
  const responseBody = await axios
    .get(GET_USER_UPDATE_PAGE_URL, bearerAuthorization(accessToken))
    .then(responseSuccessHandler<GetUserInfoResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: user page API 요청 함수 //
export const getUserPageRequest = async (nickname: string) => {
  const url = GET_USER_PAGE_URL(nickname);
  const responseBody = await axios
    // .get(url, bearerAuthorization(accessToken))
    .get(url)
    .then(responseSuccessHandler<GetUserPageResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: 현재 비밀번호 확인 API 요청 함수 //
export const passwordVerifyRequest = async (
  accessToken: string,
  body: PasswordVerifyRequestDto
): Promise<ResponseDto | null> => {
  try {
    const response = await axios.post(POST_USER_PASSWORD_VERIFY_URL, body, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
  } catch {
    return null;
  }
};
// function: 새 비밀번호 수정 API 요청 함수 //
export const patchPasswordUserPageRequest = async (
  accessToken: string,
  body: PatchPasswordUserPageRequestDto
): Promise<ResponseDto | null> => {
  try {
    const response = await axios.patch(PATCH_USER_PAGE_PASSWORD_VERIFY_URL, body, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
  } catch {
    return null;
  }
};

const responseSuccessHandler = <T = ResponseDto>(response: AxiosResponse<T>) => {
  // response.data: Response Body
  const { data } = response;
  return data;
};

const responseErrorHandler = (error: AxiosError<ResponseDto>) => {
  if (!error.response) return null;
  const { data } = error.response;
  return data;
};

// function: post board API 요청 함수 //
export const postBoardRequest = async (requestBody: PostBoardRequestDto, accessToken: string) => {
  const responseBody = await axios
    .post(POST_BOARD_URL, requestBody, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: get board API 요청 함수 //
export const getBoardRequest = async (boardSequence: number | string, accessToken: string) => {
  const responseBody = await axios
    .get(GET_BOARD_URL(boardSequence), bearerAuthorization(accessToken))
    .then(responseSuccessHandler<GetBoardResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: get board list API 요청 함수 //
export const getBoardListRequest = async (
  tag: string,
  page: number,
  sort: string = "LATEST",
  accessToken: string
) => {
  const responseBody = await axios
    .get(GET_BOARD_LIST_URL(tag, page, sort), bearerAuthorization(accessToken))
    .then(responseSuccessHandler<GetBoardListResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: patch board API 요청 함수 //
export const patchBoardRequest = async (
  boardSequence: number | string,
  requestBody: PatchBoardRequestDto,
  accessToken: string
) => {
  const responseBody = await axios
    .patch(PATCH_BOARD_URL(boardSequence), requestBody, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: delete board API 요청 함수 //
export const deleteBoardRequest = async (boardSequence: number | string, accessToken: string) => {
  const responseBody = await axios
    .delete(DELETE_BOARD_URL(boardSequence), bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: search board API 요청 함수 //
export const searchBoardRequest = async (
  tag: string,
  keyword: string,
  page: number,
  accessToken: string
) => {
  const responseBody = await axios
    .get(SEARCH_BOARD_LIST_URL(tag, keyword, page), bearerAuthorization(accessToken))
    .then(responseSuccessHandler<GetBoardListResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: put board like API 요청 함수 //
export const putBoardLikeRequest = async (boardSequence: number | string, accessToken: string) => {
  const responseBody = await axios
    .put(TOGGLE_BOARD_LIKE_URL(boardSequence), {}, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: post board comment API 요청 함수 //
export const postBoardCommentRequest = async (
  requestBody: PostBoardCommentRequestDto,
  boardSequence: number | string,
  accessToken: string
) => {
  const responseBody = await axios
    .post(POST_BOARD_COMMENT_URL(boardSequence), requestBody, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: get board comment API 요청 함수 //
export const getBoardCommentRequest = async (
  boardSequence: number | string,
  accessToken: string
) => {
  const responseBody = await axios
    .get(GET_BOARD_COMMENT_URL(boardSequence), bearerAuthorization(accessToken))
    .then(responseSuccessHandler<GetBoardCommentResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: delete board comment API 요청 함수 //
export const deleteBoardCommentRequest = async (
  commentSequence: number | string,
  accessToken: string
) => {
  const responseBody = await axios
    .delete(DELETE_BOARD_COMMENT_URL(commentSequence), bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: post daily API 요청 함수 //
export const postDailyRequest = async (requestBody: PostDailyRequestDto, accessToken: string) => {
  const responseBody = await axios
    .post(POST_DAILY_URL, requestBody, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: get daily API 요청 함수 //
export const getDailyRequest = async (dailySequence: number | string, accessToken: string) => {
  const responseBody = await axios
    .get(GET_DAILY_URL(dailySequence), bearerAuthorization(accessToken))
    .then(responseSuccessHandler<GetDailyResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: get daily list API 요청 함수 //
export const getDailyListRequest = async (
  page: number,
  sort: string = "LATEST",
  accessToken: string
) => {
  const responseBody = await axios
    .get(GET_DAILY_LIST_URL(page, sort), bearerAuthorization(accessToken))
    .then(responseSuccessHandler<GetDailyListResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: patch daily API 요청 함수 //
export const patchDailyRequest = async (
  dailySequence: number | string,
  requestBody: PatchDailyRequestDto,
  accessToken: string
) => {
  const responseBody = await axios
    .patch(PATCH_DAILY_URL(dailySequence), requestBody, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: delete daily API 요청 함수 //
export const deleteDailyRequest = async (dailySequence: number | string, accessToken: string) => {
  const responseBody = await axios
    .delete(DELETE_DAILY_URL(dailySequence), bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: put daily like API 요청 함수 //
export const putDailyLikeRequest = async (dailySequence: number | string, accessToken: string) => {
  const responseBody = await axios
    .put(PUT_DAILY_LIKES_URL(dailySequence), {}, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: get daily likes API 요청 함수 //
export const getDailyLikesRequest = async (dailySequence: number | string, accessToken: string) => {
  const responseBody = await axios
    .get(GET_DAILY_LIKES_URL(dailySequence), bearerAuthorization(accessToken))
    .then(responseSuccessHandler<GetLikedUserListResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: post daily comment API 요청 함수 //
export const postDailyCommentRequest = async (
  requestBody: PostDailyCommentRequestDto,
  dailySequence: number | string,
  accessToken: string
) => {
  const responseBody = await axios
    .post(POST_DAILY_COMMENT_URL(dailySequence), requestBody, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: get daily comment API 요청 함수 //
export const getDailyCommentRequest = async (
  dailySequence: number | string,
  accessToken: string
) => {
  const responseBody = await axios
    .get(GET_DAILY_COMMENT_URL(dailySequence), bearerAuthorization(accessToken))
    .then(responseSuccessHandler<GetDailyCommentResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: delete daily comment API 요청 함수 //
export const deleteDailyCommentRequest = async (
  commentSequence: number | string,
  accessToken: string
) => {
  const responseBody = await axios
    .delete(DELETE_DAILY_COMMENT_URL(commentSequence), bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: post used trade API 요청 함수 //
export const postUsedTradeRequest = async (
  requestBody: PostUsedTradeRequestDto,
  accessToken: string
) => {
  const responseBody = await axios
    .post(POST_USED_TRADE_URL, requestBody, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: get used trade API 요청 함수 //
export const getUsedTradeRequest = async (tradeSequence: number | string, accessToken: string) => {
  const responseBody = await axios
    .get(GET_USED_TRADE_URL(tradeSequence), bearerAuthorization(accessToken))
    .then(responseSuccessHandler<GetUsedTradeResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: get used trade list API 요청 함수 //
export const getUsedTradeListRequest = async (
  tag: string,
  page: number,
  sort: string = "LATEST",
  accessToken: string
) => {
  const responseBody = await axios
    .get(GET_USED_TRADE_LIST_URL(tag, page, sort), bearerAuthorization(accessToken))
    .then(responseSuccessHandler<GetUsedTradeListResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: patch used trade API 요청 함수 //
export const patchUsedTradeRequest = async (
  tradeSequence: number | string,
  requestBody: PatchUsedTradeRequestDto,
  accessToken: string
) => {
  const responseBody = await axios
    .patch(PATCH_USED_TRADE_URL(tradeSequence), requestBody, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: delete used trade API 요청 함수 //
export const deleteUsedTradeRequest = async (
  tradeSequence: number | string,
  accessToken: string
) => {
  const responseBody = await axios
    .delete(DELETE_USED_TRADE_URL(tradeSequence), bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: search used trade API 요청 함수 //
export const searchUsedTradeRequest = async (
  tag: string,
  keyword: string,
  page: number,
  accessToken: string
) => {
  const responseBody = await axios
    .get(SEARCH_USED_TRADE_LIST_URL(tag, keyword, page), bearerAuthorization(accessToken))
    .then(responseSuccessHandler<GetUsedTradeListResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: put used trade like API 요청 함수 //
export const putUsedTradeLikeRequest = async (
  tradeSequence: number | string,
  accessToken: string
) => {
  const responseBody = await axios
    .put(TOGGLE_USED_TRADE_LIKE_URL(tradeSequence), {}, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: post notice API 요청 함수
export const postNoticeRequest = async (requestBody: PostNoticeRequestDto, accessToken: string) => {
  const responseBody = await axios
    .post(POST_NOTICE_URL, requestBody, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: get notice list API 요청 함수
export const getNoticeListRequest = async () => {
  const responseBody = await axios
    .get(GET_NOTICE_LIST_URL)
    .then(responseSuccessHandler<GetNoticeListResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: get notice API 요청 함수
export const getNoticeRequest = async (noticeId: number | string, accessToken: string) => {
  const responseBody = await axios
    .get(GET_NOTICE_URL(noticeId), bearerAuthorization(accessToken))
    .then(responseSuccessHandler<GetNoticeResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: patch notice API 요청 함수
export const patchNoticeRequest = async (
  noticeId: number | string,
  requestBody: PatchNoticeRequestDto,
  accessToken: string
) => {
  const responseBody = await axios
    .patch(PATCH_NOTICE_URL(noticeId), requestBody, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: delete notice API 요청 함수
export const deleteNoticeRequest = async (noticeId: number | string, accessToken: string) => {
  const responseBody = await axios
    .delete(DELETE_NOTICE_URL(noticeId), bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};
