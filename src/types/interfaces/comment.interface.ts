export default interface Comment {
  commentSequence: number;
  commentWriterId: string;
  commentWriteDate: string;
  writerNickname: string;
  profileImage: string;
  comment: string;
  anonymizedWriterId?: string; 
}
