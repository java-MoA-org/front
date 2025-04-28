import { InterestsType } from "../../../../types/userInterests";

export default interface PatchUserInfoRequestDto {
  userNickname: string;
  userIntroduce: string;
  userEmail: string;
  profileImage: string;
  userIntersets: InterestsType;
}
