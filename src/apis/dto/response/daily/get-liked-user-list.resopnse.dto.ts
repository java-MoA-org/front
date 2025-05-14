import ResponseDto from "../response.dto";

// interface: get liked user list response body DTO //
export default interface GetLikedUserListResponseDto extends ResponseDto {
  likedUserList: LikedUserDto[];
  likeCount: number;
}

// interface: liked user DTO //
export interface LikedUserDto {
  userId: string;
  profileImage: string;
  userNickname: string;
}
