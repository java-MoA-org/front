import Comment from "../../../../types/interfaces/comment.interface";
import ResponseDto from "../response.dto";

// interface: get daily comment response body DTO //
export default interface GetDailyCommentResponseDto extends ResponseDto {
  comments: Comment[];
}
