import ResponseDto from "../response.dto";

// interface: get used trade list response body DTO //
export default interface GetUsedTradeListResponseDto extends ResponseDto {
  usedTradeList: UsedTradeSummaryResponseDto[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  currentSection: number;
  totalSection: number;
  pageList: number[];
}

// interface: used trade summary response body DTO //
export interface UsedTradeSummaryResponseDto {
  tradeSequence: number;
  title: string;
  views: number;
  likeCount: number;
  creationDate: string;
  userNickname: string;
  thumbnailImage: string;
  price: number;
}
