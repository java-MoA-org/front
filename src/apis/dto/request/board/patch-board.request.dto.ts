// interface: patch board request body DTO //
export default interface PatchBoardRequestDto {
  title: string;
  content: string;
  location?: string;
  detailLocation?: string;
  imageList?: File[];
}
