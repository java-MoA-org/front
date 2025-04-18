import { BoardTagType } from "../../../../types/enums/BoardTagType";

// interface: post board request body DTO //
export default interface PostBoardRequestDto {
  creationDate: string;
  title: string;
  content: string;
  location: string;
  detailLocation: string;
  imageList: string[];
  tag: BoardTagType;
}