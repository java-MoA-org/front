// interface: post daily request body DTO //
export default interface PostDailyRequestDto {
  creationDate: string;
  title: string;
  content: string;
  location: string;
  detailLocation: string;
  imageList: string[];
}