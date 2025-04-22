
// 공통 루트 경로
export const ROOT_PATH = "/"; // 루트 상대경로
export const ROOT_ABSOLUTE_PATH = ROOT_PATH;

// 마이페이지 관련 경로
export const MY_USER_PATH = "userpage";
export const MY_USER_FOLLOW_PATH = "follow-list";
export const MY_USER_BOARD_PATH = "user-board";
export const MY_USER_UPDATE_PATH = "user-update";
export const MY_USER_ABSOLUTE_PATH = (nickname: string) => `/userpage/${nickname}`;
export const MY_USER_FOLLOW_ABSOLUTE_PATH = (nickname: string) => `/userpage/${nickname}/follow-list`;
export const MY_USER_BOARD_ABSOLUTE_PATH = (nickname: string) => `/userpage/${nickname}/user-board`;
export const MY_USER_UPDATE_ABSOLUTE_PATH = () => `/userpage/user-update`;


// 게시판 관련 경로
export const BOARD_PATH = "board";
export const BOARD_WRITE_PATH = "write";
export const BOARD_VIEW_PATH = ":boardSequence";
export const BOARD_UPDATE_PATH = "update";
export const BOARD_ABSOLUTE_PATH = `/board`;
export const BOARD_WRITE_ABSOLUTE_PATH = `/board/write`;
export const BOARD_VIEW_ABSOLUTE_PATH = (boardSequence: number | string) => `/board/${boardSequence}`;
export const BOARD_UPDATE_ABSOLUTE_PATH = (boardSequence: number | string) => `/board/${boardSequence}/update`;

export const GET_BOARD_LIST_URL = (tag: string, page: number, sort: string = 'LATEST') =>
  `/board/${tag}/${page}?sortOption=${sort}`;


// 일상글 관련 경로
export const DAILY_PATH = "daily";
export const DAILY_WRITE_PATH = "write";
export const DAILY_VIEW_PATH = ":dailySequence";
export const DAILY_UPDATE_PATH = "update";
export const DAILY_ABSOLUTE_PATH = `/daily`;
export const DAILY_WRITE_ABSOLUTE_PATH = `/daily/write`;
export const DAILY_VIEW_ABSOLUTE_PATH = (dailySequence: number | string) => `/daily/${dailySequence}`;
export const DAILY_UPDATE_ABSOLUTE_PATH = (dailySequence: number | string) => `/daily/${dailySequence}/update`;


// 중고거래 관련 경로
export const USED_TRADE_PATH = "usedtrade";
export const USED_TRADE_WRITE_PATH = "write";
export const USED_TRADE_VIEW_PATH = ":usedTradeSequence";
export const USED_TRADE_UPDATE_PATH = "update";
export const USED_TRADE_ABSOLUTE_PATH = `/usedtrade`;
export const USED_TRADE_WRITE_ABSOLUTE_PATH = `/usedtrade/write`;
export const USED_TRADE_VIEW_ABSOLUTE_PATH = (usedTradeSequence: number | string) => `/usedtrade/${usedTradeSequence}`;
export const USED_TRADE_UPDATE_ABSOLUTE_PATH = (usedTradeSequence: number | string) => `/usedtrade/${usedTradeSequence}/update`;


// 공지사항 관련 경로
export const NOTICE_PATH = "notice";
export const NOTICE_WRITE_PATH = "write";
export const NOTICE_VIEW_PATH = ":noticeId";
export const NOTICE_UPDATE_PATH = "update";
export const NOTICE_ABSOLUTE_PATH = `/notice`;
export const NOTICE_WRITE_ABSOLUTE_PATH = `/notice/write`;
export const NOTICE_VIEW_ABSOLUTE_PATH = (noticeId: number | string) => `/notice/${noticeId}`;
export const NOTICE_UPDATE_ABSOLUTE_PATH = (noticeId: number | string) => `/notice/${noticeId}/update`;


// 인증 관련
export const ACCESS_TOKEN = "accessToken"; // localStorage 저장 키