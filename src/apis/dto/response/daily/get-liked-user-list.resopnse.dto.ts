import ResponseDto from "../response.dto";

// interface: get liked user list response body DTO //
export default interface GetLikedUserListResponseDto extends ResponseDto {
  likedUserList: LikedUserDto[];
}

// interface: liked user DTO //
export interface LikedUserDto {
  userId: string;
  userProfileImage: string;
  userNickname: string;
}
