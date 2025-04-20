import { BoardTagType } from "../../../../types/enums/BoardTagType";
import ResponseDto from "../response.dto";

// interface: get board list response body DTO //
export default interface GetBoardListResponseDto extends ResponseDto {
  boardList: BoardSummaryResponseDto[];
  totalPages: number;
}

// interface: board summary response body DTO //
export interface BoardSummaryResponseDto {
  boardSequence: number;
  title: string;
  content: string;
  creationDate: string;
  tag: BoardTagType;
  views: number;
  writerId: string;
  likeCount: number;
  commentCount: number;
}
