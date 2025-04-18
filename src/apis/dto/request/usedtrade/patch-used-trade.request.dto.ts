// interface: patch used trade request body DTO //
export default interface PatchUsedTradeRequestDto {
  title: string;
  content: string;
  location?: string;
  detailLocation?: string;
  imageList?: string[]; 
}
