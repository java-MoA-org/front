import { InterestsType } from "../../../../types/userInterests";
import ResponseDto from "../response.dto";

// 로그인 후 사용자 정보를 전역 상태(Zustand) 등에 저장하거나 UI에 표시할 때 사용.
export default interface GetUserInfoResponseDto extends ResponseDto {
  userId: string;
  userNickname: string;
  userProfileImage: string | null;
  userEmail: string;
  userRole: string;
  userPhoneNumber: string;
  userIntroduce: string;
  userInterests: InterestsType;
}