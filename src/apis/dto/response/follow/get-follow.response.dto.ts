import ResponseDto from "../response.dto";

export default interface GetFollowResponseDto extends ResponseDto {
  followers: string[];
  followees: string[];
}
