import { BoardTagType } from "../../../../types/enums/BoardTagType";
import Comment from "../../../../types/interfaces/comment.interface";
import ResponseDto from "../response.dto";

// interface: get board response body DTO //
export default interface GetBoardResponseDto extends ResponseDto {
  boardSequence: number;
  title: string;
  content: string;
  creationDate: string;
  tag: BoardTagType;
  views: number;
  writerId: string;
  likeCount: number;
  comments: Comment[];
}