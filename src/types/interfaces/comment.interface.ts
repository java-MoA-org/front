export default interface Comment {
  commentSequence: number;
  commentWriterId: string;
  commentWriteDate: string;
  commentWriterNickname: string;
  comment: string;
  anonymizedWriterId?: string; 
}
