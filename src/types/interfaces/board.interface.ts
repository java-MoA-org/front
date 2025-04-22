import { BoardTagType } from "../enums/BoardTagType";

export default interface Board {
  boardSequence: number;
  title: string;
  content: string;
  creationDate: string;
  tag: BoardTagType;
  views: number;
  writerId: string;
  likeCount: number;
  commentCount: number;
  images: string[];
}
