import Comment from "../../../../types/interfaces/comment.interface";
import ResponseDto from "../response.dto";

// interface: get board comment response body DTO //
export default interface GetBoardCommentResponseDto extends ResponseDto {
  comments: Comment[];
}
