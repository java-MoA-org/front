// src/apis/dto/request/usersearch/search-user.request.ts

import axios from "axios";
import { SEARCH_USER_URL } from "../../../../constants";
import { bearerAuthorization } from "../../../../utils/tokenUtils";
import { SearchUserResponseDto, SearchUserItem } from "../../response/user/search-user.response.dto";

// function: 친구(유저) 검색 API 요청 함수
export const searchUserRequest = async (keyword: string, accessToken: string): Promise<SearchUserItem[]> => {
  if (!accessToken) {
    console.error("AccessToken 없음. 로그인 필요");
    return [];
  }

  try {
    const { data } = await axios.get<SearchUserResponseDto>(
      SEARCH_USER_URL(keyword),
      bearerAuthorization(accessToken)
    );

    if (data && data.success && Array.isArray(data.userList)) {
      return data.userList;
    }

    return [];
  } catch (error) {
    console.error("친구 검색 요청 중 에러:", error);
    return [];
  }
};