import Comment from "../../../../types/interfaces/comment.interface";
import ResponseDto from "../response.dto";

// interface: get daily response body DTO //
export default interface GetDailyResponseDto extends ResponseDto {
  dailySequence: number;
  title: string;
  content: string;
  profileImage: string;
  creationDate: string;
  writerNickname: string;
  views: number;
  likeCount: number;
  comments: Comment[];
  imageUrls: string[];
}
