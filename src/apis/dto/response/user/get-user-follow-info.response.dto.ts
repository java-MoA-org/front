import userFollowInfoDto from "../../../../types/interfaces/user-follow-info.interface";
import ResponseDto from "../response.dto";

export default interface GetUserFollowInfoResponseDto extends ResponseDto {
  followers: userFollowInfoDto[];
  followees: userFollowInfoDto[];
}
