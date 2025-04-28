// variable: 상대 path 상수 //
export const ROOT_PATH = "/";
export const MY_USER_PATH = "userpage";
export const MY_USER_FOLLOW_PATH = "follow-list";
export const MY_USER_BOARD_PATH = "user-board"; // 나중에 {nickname}으로 바꿀 예정
export const MY_USER_UPDATE_PATH = "user-update";
export const BOARD_PATH = "board";
export const BOARD_WRITE_PATH = "write";
export const BOARD_VIEW_PATH = ":boardSequence";
export const BOARD_UPDATE_PATH = "update";
export const DAILY_PATH = "daily";
export const DAILY_WRITE_PATH = "write";
export const DAILY_VIEW_PATH = ":dailySequence";
export const DAILY_UPDATE_PATH = "update";
export const USED_TRADE_PATH = "usedtrade";
export const USED_TRADE_WRITE_PATH = "write";
export const USED_TRADE_VIEW_PATH = ":usedTradeSequence";
export const USED_TRADE_UPDATE_PATH = "update";
export const NOTICE_PATH = "notice";
export const NOTICE_WRITE_PATH = "write";
export const NOTICE_VIEW_PATH = ":noticeId";
export const NOTICE_UPDATE_PATH = "update";

// variable: 절대 path 상수 //
export const ROOT_ABSOULTE_PATH = ROOT_PATH;

export const MY_USER_ABSOLUTE_PATH = (nickname: string) => `/${MY_USER_PATH}/${nickname}`;

export const MY_USER_FOLLOW_ABSOLUTE_PATH = (nickname: string) =>
  `/${MY_USER_PATH}/${nickname}/${MY_USER_FOLLOW_PATH}`;

export const MY_USER_BOARD_ABSOLUTE_PATH = (nickname: string) =>
  `/${MY_USER_PATH}/${nickname}/${MY_USER_BOARD_PATH}`;

export const MY_USER_UPDATE_ABSOLUTE_PATH = (nickname: string) =>
  `/${MY_USER_PATH}/${nickname}/${MY_USER_UPDATE_PATH}`;

export const BOARD_ABSOLUTE_PATH = `${ROOT_PATH}${BOARD_PATH}`;

export const BOARD_WRITE_ABSOLUTE_PATH = `${ROOT_PATH}${BOARD_PATH}/${BOARD_WRITE_PATH}`;

export const BOARD_VIEW_ABSOLUTE_PATH = (boardSequence: number | string) =>
  `${ROOT_PATH}${BOARD_PATH}/${boardSequence}`;

export const BOARD_UPDATE_ABSOLUTE_PATH = (boardSequence: number | string) =>
  `${ROOT_PATH}${BOARD_PATH}/${boardSequence}/${BOARD_UPDATE_PATH}`;

export const GET_BOARD_LIST_ABSOLUTE_PATH = (tag: string) => `${BOARD_ABSOLUTE_PATH}/${tag}`;

export const DAILY_ABSOLUTE_PATH = `${ROOT_PATH}${DAILY_PATH}`;

export const DAILY_WRITE_ABSOLUTE_PATH = `${ROOT_PATH}${DAILY_PATH}/${DAILY_WRITE_PATH}`;

export const DAILY_VIEW_ABSOLUTE_PATH = (dailySequence: number | string) =>
  `${ROOT_PATH}${DAILY_PATH}/${dailySequence}`;

export const DAILY_UPDATE_ABSOLUTE_PATH = (dailySequence: number | string) =>
  `${ROOT_PATH}${DAILY_PATH}/${dailySequence}/${DAILY_UPDATE_PATH}`;

export const USED_TRADE_ABSOLUTE_PATH = `${ROOT_PATH}${USED_TRADE_PATH}`;

export const USED_TRADE_WRITE_ABSOLUTE_PATH = `${ROOT_PATH}${USED_TRADE_PATH}/${USED_TRADE_WRITE_PATH}`;

export const USED_TRADE_VIEW_ABSOLUTE_PATH = (usedTradeSequence: number | string) =>
  `${ROOT_PATH}${USED_TRADE_PATH}/${usedTradeSequence}`;

export const USED_TRADE_UPDATE_ABSOLUTE_PATH = (usedTradeSequence: number | string) =>
  `${ROOT_PATH}${USED_TRADE_PATH}/${usedTradeSequence}/${USED_TRADE_UPDATE_PATH}`;

// variable: access token 속성명 //
export const ACCESS_TOKEN = "accessToken";
export const REFRESH_TOKEN = "refreshToken";

// 공지사항
export const NOTICE_ABSOLUTE_PATH = `${ROOT_PATH}${NOTICE_PATH}`;
export const NOTICE_WRITE_ABSOLUTE_PATH = `${NOTICE_ABSOLUTE_PATH}/${NOTICE_WRITE_PATH}`;
export const NOTICE_VIEW_ABSOLUTE_PATH = (id: number | string) => `${NOTICE_ABSOLUTE_PATH}/${id}`;
export const NOTICE_UPDATE_ABSOLUTE_PATH = (id: number | string) =>
  `${NOTICE_ABSOLUTE_PATH}/${id}/${NOTICE_UPDATE_PATH}`;


// API 도메인 추가
export const API_DOMAIN = process.env.REACT_APP_API_DOMAIN || "http://localhost:4000"; 

// 친구 검색 API URL (수정 완료)
export const SEARCH_USER_URL = (keyword: string) => `${API_DOMAIN}/api/v1/user/search?keyword=${encodeURIComponent(keyword)}`;