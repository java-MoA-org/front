export default interface Daily {
  dailySequence: number;
  title: string;
  views: number;
  likeCount: number;
  creationDate: string;
  content: string;
  userNickname: string;
  profileImage: string | null;
  commentCount: number;
  images: string[];
}
