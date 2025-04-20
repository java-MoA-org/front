// interface: patch daily request body DTO //
export default interface PatchDailyRequestDto {
  title: string;
  content: string;
  location?: string;
  detailLocation?: string;
  imageList?: string[]; 
}
