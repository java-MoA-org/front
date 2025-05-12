// src/apis/index.ts

import axios, { AxiosError, AxiosResponse } from 'axios';
import IdCheckRequestDto from './dto/request/auth/user-id-check.request.dto';
import ResponseDto from './dto/response/response.dto';

import PostNoticeRequestDto from './dto/request/notice/post-notice.request.dto';
import PatchNoticeRequestDto from './dto/request/notice/patch-notice.request.dto';
import GetNoticeListResponseDto from './dto/response/notice/get-notice-list.response.dto';
import GetNoticeResponseDto from './dto/response/notice/get-notice.response.dto';
import UserIdCheckRequestDto from './dto/request/auth/user-id-check.request.dto';
import UserNicknameCheckRequestDto from './dto/request/auth/user-nickname-check.request.dto';
import UserEmailCheckRequestDto from './dto/request/auth/user-email-check.request.dto';
import UserPhoneNumberCheckRequestDto from './dto/request/auth/user-phone-number-check.request.dto';
import UserSignUpRequestDto from './dto/request/auth/user-sign-up.request.dto';
import UserSignInRequestDto from './dto/request/auth/user-sign-in.request.dto';

import { PatchBoardRequestDto, PostBoardCommentRequestDto, PostBoardRequestDto } from './dto/request/board';
import { GetBoardCommentResponseDto, GetBoardListResponseDto, GetBoardResponseDto } from './dto/response/board';
import { PatchDailyRequestDto, PostDailyCommentRequestDto, PostDailyRequestDto } from './dto/request/daily';
import {
  GetDailyCommentResponseDto,
  GetDailyListResponseDto,
  GetDailyResponseDto,
  GetLikedUserListResponseDto,
} from './dto/response/daily';
import { PatchUsedTradeRequestDto, PostUsedTradeRequestDto } from './dto/request/usedtrade';
import { GetUsedTradeListResponseDto, GetUsedTradeResponseDto } from './dto/response/usedtrade';
import GetUserPageResponseDto from './dto/response/userpage/get-user-page.response.dto';
import UserEmailVerifyRequestDto from './dto/request/auth/user-email-verify.request.dto';
import UserPhoneNumberVerifyRequestDto from './dto/request/auth/user-phone-number-verify.request.dto';
import { ACCESS_TOKEN } from '../constants';
import GetUserInfoResponseDto from './dto/response/user/get-user-info.response.dto';
import PatchPasswordRequestDto from './dto/request/auth/patch-password.request.dto';
import PasswordVerifyRequestDto from './dto/request/userInfo/post-verify-pawword.request.dto';
import PatchPasswordUserPageRequestDto from './dto/request/userInfo/patch-password-userpage.request.dto';
import PatchUserInfoRequestDto from './dto/request/userInfo/patch-user-info.request.dto';
import PostCommentAlertRequestDto from './dto/request/alert/post-comment-alert.request.dto';
import PostLikeAlertRequestDto from './dto/request/alert/post-like-alert.request.dto';

export { searchUserRequest } from './dto/request/usersearch/search-user.request';

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

const GET_USER_INFO_URL = `${AUTH_MODULE_URL}/userInfo`;

const SIGN_UP_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_URL = `${AUTH_MODULE_URL}/sign-in`;
export const SNS_SIGN_IN_URL = (sns: 'kakao' | 'naver') => `${AUTH_MODULE_URL}/sns/${sns}`;
const SIGN_OUT_URL = `${AUTH_MODULE_URL}/sign-out`;

const PATCH_PASSWORD_URL = (userId: string) => `${AUTH_MODULE_URL}/${userId}/password`;

const REFRESH_TOKEN_URL = `${AUTH_MODULE_URL}/refresh`;

const USER_MODULE_URL = `${API_DOMAIN}/api/v1/user`;

const BOARD_MODULE_URL = `${API_DOMAIN}/api/v1/board`;

const POST_BOARD_URL = BOARD_MODULE_URL;
const GET_BOARD_LIST_URL = (tag: string, page: number, sort = 'LATEST') => `${BOARD_MODULE_URL}/${tag}/${page}?sortOption=${sort}`;
const GET_BOARD_URL = (boardSequence: number | string) => `${BOARD_MODULE_URL}/${boardSequence}`;
const PATCH_BOARD_URL = (boardSequence: number | string) => `${BOARD_MODULE_URL}/${boardSequence}`;
const DELETE_BOARD_URL = (boardSequence: number | string) => `${BOARD_MODULE_URL}/${boardSequence}`;
const SEARCH_BOARD_LIST_URL = (tag: string, keyword: string, page: number) => `${BOARD_MODULE_URL}/search?tag=${tag}&keyword=${keyword}&page=${page}`;

const TOGGLE_BOARD_LIKE_URL = (boardSequence: number | string) => `${BOARD_MODULE_URL}/${boardSequence}/likes`;

const POST_BOARD_COMMENT_URL = (boardSequence: number | string) => `${BOARD_MODULE_URL}/${boardSequence}/comments`;
const GET_BOARD_COMMENT_URL = (boardSequence: number | string) => `${BOARD_MODULE_URL}/${boardSequence}/comments`;
const DELETE_BOARD_COMMENT_URL = (commentSequence: number | string) => `${BOARD_MODULE_URL}/${commentSequence}/comments`;

const DAILY_MODULE_URL = `${API_DOMAIN}/api/v1/daily`;

const POST_DAILY_URL = DAILY_MODULE_URL;
const GET_DAILY_URL = (dailySequence: number | string) => `${DAILY_MODULE_URL}/${dailySequence}`;
const GET_DAILY_LIST_URL = (page: number, sort = 'LATEST') => `${DAILY_MODULE_URL}/list/${page}?sortOption=${sort}`;
const PATCH_DAILY_URL = (dailySequence: number | string) => `${DAILY_MODULE_URL}/${dailySequence}`;
const DELETE_DAILY_URL = (dailySequence: number | string) => `${DAILY_MODULE_URL}/${dailySequence}`;
const SEARCH_DAILY_LIST_URL = (keyword: string, page: number) => `${DAILY_MODULE_URL}/search?keyword=${keyword}&page=${page}`;

const TOGGLE_DAILY_LIKE_URL = (dailySequence: number | string) => `${DAILY_MODULE_URL}/${dailySequence}/likes`;
const GET_DAILY_LIKES_URL = (dailySequence: number | string) => `${DAILY_MODULE_URL}/${dailySequence}/likes`;

const POST_DAILY_COMMENT_URL = (dailySequence: number | string) => `${DAILY_MODULE_URL}/${dailySequence}/comments`;
const GET_DAILY_COMMENT_URL = (dailySequence: number | string) => `${DAILY_MODULE_URL}/${dailySequence}/comments`;
const DELETE_DAILY_COMMENT_URL = (dailySequence: number | string) => `${DAILY_MODULE_URL}/${dailySequence}/comments`;

const USED_TRADE_MODULE_URL = `${API_DOMAIN}/api/v1/used-trade`;

const POST_USED_TRADE_URL = USED_TRADE_MODULE_URL;
const GET_USED_TRADE_URL = (tradeSequence: number | string) => `${USED_TRADE_MODULE_URL}/${tradeSequence}`;
const GET_USED_TRADE_LIST_URL = (tag: string, page: number, sort = 'LATEST') => `${USED_TRADE_MODULE_URL}/${tag}/${page}?sortOption=${sort}`;
const PATCH_USED_TRADE_URL = (tradeSequence: number | string) => `${USED_TRADE_MODULE_URL}/${tradeSequence}`;
const DELETE_USED_TRADE_URL = (tradeSequence: number | string) => `${USED_TRADE_MODULE_URL}/${tradeSequence}`;
const SEARCH_USED_TRADE_LIST_URL = (tag: string, keyword: string, page: number) => `${USED_TRADE_MODULE_URL}/search?tag=${tag}&keyword=${keyword}&page=${page}`;

const TOGGLE_USED_TRADE_LIKE_URL = (tradeSequence: number | string) => `${USED_TRADE_MODULE_URL}/${tradeSequence}/likes`;

const PATCH_USED_TRADE_TRANSACTION_URL = (tradeSequence: number | string) => `${USED_TRADE_MODULE_URL}/${tradeSequence}/status`;

const IMAGE_UPLOAD_MODULE_URL = `${API_DOMAIN}/api/v1/images`;

export  const UPLOAD_IMAGES_URL = `${IMAGE_UPLOAD_MODULE_URL}/upload`;
export  const imageUrl = (fileName: string) => `${IMAGE_UPLOAD_MODULE_URL}/${fileName}`;

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
const FILE_UPLOAD_URL = `${USER_PAGE_MODULE_URL}/images/file/upload`;
const multipartFormData = { headers: { 'Content-Type': 'multipart/form-data' } };

const POST_FOLLOW_URL = (nickname: string) => `${API_DOMAIN}/api/v1/follow/${nickname}`;
const GET_FOLLOW_URL = (nickname: string) => `${API_DOMAIN}/api/v1/follow/number/${nickname}`;
const GET_FOLLOW_INFO_URL = (nickname: string) => `${API_DOMAIN}/api/v1/follow/number/info/${nickname}`;

const ALERT_MODULE_URL = `${API_DOMAIN}/api/v1/alert`;
const POST_COMMENT_ALERT_URL = `${ALERT_MODULE_URL}/comment`;
const POST_LIKE_ALERT_URL = `${ALERT_MODULE_URL}/like`;
const GET_USER_ALERT_URL = `${ALERT_MODULE_URL}`;
const PATCH_READ_ALERT_URL = `${ALERT_MODULE_URL}/read`;
const PATCH_READ_ALL_ALERT_URL = `${ALERT_MODULE_URL}/readAll`;
const DELETE_ALERT_URL = (alert_id: number) => `${ALERT_MODULE_URL}/delete/${alert_id}`;
const DELETE_ALERT_ALL_URL = `${ALERT_MODULE_URL}/deleteAll`;

const SET_READ_MESSAGE_URL = `${API_DOMAIN}/api/message/read`;
const GET_NEW_ALERT_BY_USER_ID_URL = `${API_DOMAIN}/api/message/get-alert`;
const HIDE_CHAT_URL = `${API_DOMAIN}/api/message/hide`;

// function: Authorization Bearer 헤더 //
const bearerAuthorization = (accessToken: string) => ({
  headers: { Authorization: `Bearer ${accessToken}` },
});

// function: User Id 중복 확인 요청 함수 //
export const userIdCheckRequest = async (requestBody: UserIdCheckRequestDto) => {
  const responseBody = await axios
    .post(ID_CHECK_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: User Nickname 중복 확인 요청 함수 //
export const userNicknameCheckRequest = async (requestBody: UserNicknameCheckRequestDto) => {
  const responseBody = await axios
    .post(NICKNAME_CHECK_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: User Email 중복확인 및 인증번호 요청 함수 //
export const userEmailCheckRequest = async (requestBody: UserEmailCheckRequestDto) => {
  const responseBody = await axios
    .post(EMAIL_CHECK_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};
// function: User Email 인증번호 확인 요청 함수 //
export const UserEmailVerifyRequest = async (requestBody: UserEmailVerifyRequestDto) => {
  const responseBody = await axios
    .post(EMAIL_VERIFY_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: User Email Id 찾기 인증번호 요청 함수 //
export const userEmailCheckFindIdRequest = async (requestBody: UserEmailCheckRequestDto) => {
  const responseBody = await axios
    .post(FIND_ID_EMAIL_CHECK_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: User Email Id 찾기 요청 함수 //
export const UserEmailFindIdVerifyRequest = async (requestBody: UserEmailVerifyRequestDto) => {
  const responseBody = await axios
    .post(FIND_ID_EMAIL_CHECK_VERIFY_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: User 전화번호 중복 확인 및 인증번호 요청 함수 //
export const userPhoneNumberCheckRequest = async (requestBody: UserPhoneNumberCheckRequestDto) => {
  const responseBody = await axios
    .post(PHONE_NUMBER_CHECK_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: User 전화번호 인증번호 확인 요청 함수 //
export const UserPhoneNumberVerifyRequest = async (requestBody: UserPhoneNumberVerifyRequestDto) => {
  const responseBody = await axios
    .post(PHONE_NUMBER_VERIFY_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: User 회원가입 요청 함수 //
export const userSignUpRequest = async (requestBody: UserSignUpRequestDto) => {
  const responseBody = await axios
    .post(SIGN_UP_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: User 로그인 요청 함수 //
export const userSignInRequest = async (requestBody: UserSignInRequestDto) => {
  const responseBody = await axios
    .post(SIGN_IN_URL, requestBody, { withCredentials: true })
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: User Information 요청 함수 //
export const getUserInfoRequest = async (accessToken: string) => {
  const responseBody = await axios
    .get(GET_USER_INFO_URL, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: User Alert 요청 함수 //
export const GetUserAlertRequest = async (accessToken: string) => {
  const responseBody = await axios
    .get(GET_USER_ALERT_URL, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: 로그아웃 요청 함수 //
export const userSignOutRequest = async (accessToken: string) => {
  await axios.post(SIGN_OUT_URL, bearerAuthorization(accessToken));
};

// function: User Password 수정 요청 함수 //
export const PatchPasswordRequest = async (requestBody: PatchPasswordRequestDto) => {
  const responseBody = await axios
    .patch(PATCH_PASSWORD_URL(requestBody.userId), requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: profile Image Upload 요청 함수 //
export const userProfileImageUpload = async (requestBody: FormData) => {
  const url = await axios.post(PROFILE_IMAGE_UPLOAD_URL, requestBody, {
    withCredentials: true,
  });
  return url;
};
// function: Access Token 새로고침 요청 함수 //
export const refreshAccessTokenRequest = async () => {
  const response = await axios.post(REFRESH_TOKEN_URL, {}, { withCredentials: true });
  const { accessToken, expiration } = response.data;

  if (accessToken) {
    return expiration;
  }

  return null;
};

// function: get user info API 요청 함수 //
export const getUserPageInfoRequest = async (accessToken: string) => {
  const responseBody = await axios
    .get(GET_USER_UPDATE_PAGE_URL, bearerAuthorization(accessToken))
    .then(responseSuccessHandler<GetUserInfoResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: get follow API 요청 함수 //
export const getFollowRequest = async (nickname: string, accessToken: string) => {
  const url = GET_FOLLOW_URL(nickname);
  const responseBody = await axios
    .get(url, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: get user follow info API 요청 함수 //
export const getFollowInfoRequest = async (nickname: string, accessToken: string) => {
  const url = GET_FOLLOW_INFO_URL(nickname);
  const responseBody = await axios
    .get(url, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
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

// function: post follow API 요청 함수 //
export const postFollowRequest = async (nickname: string, accessToken: string) => {
  const url = POST_FOLLOW_URL(nickname);
  const responseBody = await axios
    .post(url, {}, bearerAuthorization(accessToken)) //! put은 body가 있기에 {}가 위치만 잡게 만들고 세번째 매개변수로 bearer를 보내게 하기 위해
    .then(responseSuccessHandler)
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
      headers: { Authorization: `Bearer ${accessToken}` },
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
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch {
    return null;
  }
};
// function: 유저 정보 수정 API 요청 함수 //
export const patchUserInfoRequest = async (
  accessToken: string,
  requestBody: PatchUserInfoRequestDto
): Promise<ResponseDto | null> => {
  try {
    const response = await axios.patch(PATCH_USER_UPDATE_PAGE_URL, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

// function: 파일 업로드 요청 함수 //
export const fileUploadRequest = async (requestBody: FormData) => {
  const responseBody = await axios
    .post(FILE_UPLOAD_URL, requestBody, multipartFormData)
    .then(responseSuccessHandler<string>)
    .catch((error) => null); // responseDto로 반환하기에 직접 에러는 적은 것
  return responseBody;
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
export const getBoardListRequest = async (tag: string, page: number, sort: string = 'LATEST', accessToken: string) => {
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
export const searchBoardRequest = async (tag: string, keyword: string, page: number, accessToken: string) => {
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
export const getBoardCommentRequest = async (boardSequence: number | string, accessToken: string) => {
  const responseBody = await axios
    .get(GET_BOARD_COMMENT_URL(boardSequence), bearerAuthorization(accessToken))
    .then(responseSuccessHandler<GetBoardCommentResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: delete board comment API 요청 함수 //
export const deleteBoardCommentRequest = async (commentSequence: number | string, accessToken: string) => {
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
export const getDailyListRequest = async (page: number, sort: string = 'LATEST', accessToken: string) => {
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

// function: search Daily API 요청 함수 //
export const searchDailyRequest = async (keyword: string, page: number, accessToken: string) => {
  const responseBody = await axios
    .get(SEARCH_DAILY_LIST_URL(keyword, page), bearerAuthorization(accessToken))
    .then(responseSuccessHandler<GetDailyListResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: put daily like API 요청 함수 //
export const putDailyLikeRequest = async (dailySequence: number | string, accessToken: string) => {
  const responseBody = await axios
    .put(TOGGLE_DAILY_LIKE_URL(dailySequence), {}, bearerAuthorization(accessToken))
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
export const getDailyCommentRequest = async (dailySequence: number | string, accessToken: string) => {
  const responseBody = await axios
    .get(GET_DAILY_COMMENT_URL(dailySequence), bearerAuthorization(accessToken))
    .then(responseSuccessHandler<GetDailyCommentResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: delete daily comment API 요청 함수 //
export const deleteDailyCommentRequest = async (commentSequence: number | string, accessToken: string) => {
  const responseBody = await axios
    .delete(DELETE_DAILY_COMMENT_URL(commentSequence), bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: post used trade API 요청 함수 //
export const postUsedTradeRequest = async (dto: PostUsedTradeRequestDto, imageList: File[], accessToken: string): Promise<ResponseDto | null> => {
  const formData = new FormData();
  formData.append(
    "dto",
    new Blob([JSON.stringify(dto)], { type: "application/json" })
  );
  imageList.forEach((file) => formData.append("imageList", file));

  try {
    const response = await axios.post("/api/v1/usedtrade", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("중고거래 글 작성 실패", error);
    return null;
  }
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
  sort: string = 'LATEST',
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
export const deleteUsedTradeRequest = async (tradeSequence: number | string, accessToken: string) => {
  const responseBody = await axios
    .delete(DELETE_USED_TRADE_URL(tradeSequence), bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: search used trade API 요청 함수 //
export const searchUsedTradeRequest = async (tag: string, keyword: string, page: number, accessToken: string) => {
  const responseBody = await axios
    .get(SEARCH_USED_TRADE_LIST_URL(tag, keyword, page), bearerAuthorization(accessToken))
    .then(responseSuccessHandler<GetUsedTradeListResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: put used trade like API 요청 함수 //
export const putUsedTradeLikeRequest = async (tradeSequence: number | string, accessToken: string) => {
  const responseBody = await axios
    .put(TOGGLE_USED_TRADE_LIKE_URL(tradeSequence), {}, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: patch used trade transaction status API 요청 함수 //
export const patchTransactionStatusRequest = async (tradeSequence: number | string, accessToken: string) => {
  const responseBody = await axios
    .patch(PATCH_USED_TRADE_TRANSACTION_URL(tradeSequence), bearerAuthorization(accessToken))
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

// function: delete notice API 요청 함수 //
export const deleteNoticeRequest = async (noticeId: number | string, accessToken: string) => {
  const responseBody = await axios
    .delete(DELETE_NOTICE_URL(noticeId), bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: post comment alert API 요청 함수 //
export const postCommentAlertRequest = async (commentData: PostCommentAlertRequestDto, accessToken: string) => {
  const responseBody = await axios
    .post(POST_COMMENT_ALERT_URL, commentData, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: post like alert API 요청 함수 //
export const postLikeAlertRequest = async (likeData: PostLikeAlertRequestDto, accessToken: string) => {
  const responseBody = await axios
    .post(POST_LIKE_ALERT_URL, likeData, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: patch read alert API 요청 함수 //
export const patchReadAlertRequest = async (alertId: number, accessToken: string) => {
  const responseBody = await axios
    .patch(`${PATCH_READ_ALERT_URL}/${alertId}`, {}, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: patch read all alert API 요청 함수 //
export const patchReadAllAlertRequest = async (accesstoken: string) => {
  const responseBody = await axios
    .patch(PATCH_READ_ALL_ALERT_URL, {}, bearerAuthorization(accesstoken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: delete alert API 요청 함수 //
export const deleteAlertRequest = async (alertId: number, accessToken: string) => {
  const responseBody = await axios
    .delete(DELETE_ALERT_URL(alertId), bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: delete alert all API 요청 함수 //
export const deleteAlertAllRequest = async (accesstoken: string) => {
  const responseBody = await axios
    .delete(DELETE_ALERT_ALL_URL, bearerAuthorization(accesstoken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: userId를 기반으로 유저 정보 조회 API 요청 함수 //
export const getUserInfoByIdRequest = async (userId: string, accessToken: string) => {
  return await axios
    .get(`/api/v1/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);
};

// function: userId를 기반으로 프로필 이미지 URL만 조회하는 API 요청 함수 //
export const getUserProfileImageByIdRequest = async (userId: string, accessToken: string) => {
  const url = `/api/v1/user/${userId}/profile-image`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data; // string
};

// function: userId를 기반으로 닉네임만 조회하는 API 요청 함수 //
export const getUserNicknameByIdRequest = async (userId: string, accessToken: string) => {
  const url = `/api/v1/user/${userId}/nickname`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data; // string
};

// function: userId 기반 새 메시지 알림 조회 API 요청 함수 //
export const getNewAlertCountByUserIdRequest = async (accessToken: string) => {
  const response = await axios
    .get(GET_NEW_ALERT_BY_USER_ID_URL, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  console.log('response', response);
  return response;
};

export const patchMessageInvisibleByIdRequest = async (id: number, accessToken: string) => {
  await axios.post(
    HIDE_CHAT_URL,
    {
      messageNumber: id,
    },
    bearerAuthorization(accessToken)
  );
};

export const patchReadMessageRequest = async (userId: string, partnerId: string, accessToken: string) => {
  const response = await axios.post(SET_READ_MESSAGE_URL, { userId, partnerId }, bearerAuthorization(accessToken));
  return response;
};
