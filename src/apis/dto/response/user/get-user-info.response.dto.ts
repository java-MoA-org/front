import { InterestsType } from "../../../../types/userInterests";
import ResponseDto from "../response.dto";

// GetUserInfoResponseDto는 서버에서 응답받은 유저 전체 정보
export default interface GetUserInfoResponseDto extends ResponseDto {
  userId: string;
  userNickname: string;
  userProfileImage: string | null;
  userEmail: string;
  userRole: string;
  userPhoneNumber: string;
  userIntroduce: string;
  userInterests: InterestsType;
  joinType: string;
}
