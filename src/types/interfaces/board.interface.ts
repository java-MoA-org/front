import { BoardTagType } from "../enums/BoardTagType";

export default interface Board {
  boardSequence: number;
  title: string;
  views: number;
  likeCount: number;
  creationDate: string;
  tag: BoardTagType;
  content: string;
  userNickname: string;
  images: string[];
  commentCount: number;
}
