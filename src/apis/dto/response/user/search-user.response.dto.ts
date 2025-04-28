// 친구 검색 결과 단일 항목 타입
export interface SearchUserItem {
  userNickname: string;
  userProfileImage: string | null;
}

// 친구 검색 API 전체 응답 타입
export interface SearchUserResponseDto {
  success: boolean;
  message: string;
  userList: SearchUserItem[];
}