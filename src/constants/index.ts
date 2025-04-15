// variable: 상대 path 상수 //
export const ROOT_PATH = "/";
export const MY_USER_PATH = "mypage";
export const MY_USER_FOLLOW_PATH = "follow-list";
export const MY_USER_BOARD_PATH = "user-board"; // 나중에 {nickname}으로 바꿀 예정

// variable: 절대 path 상수 //
export const ROOT_ABSOULTE_PATH = ROOT_PATH;
export const MY_USER_ABSOULTE_PATH = `${ROOT_PATH}${MY_USER_PATH}`;
export const MY_USER_FOLLOW_ABSOULTE_PATH = `${ROOT_PATH}${MY_USER_PATH}/${MY_USER_FOLLOW_PATH}`;
export const MY_USER_BOARD_ABSOLUTE_PATH = `${ROOT_PATH}${MY_USER_PATH}/${MY_USER_BOARD_PATH}`;
