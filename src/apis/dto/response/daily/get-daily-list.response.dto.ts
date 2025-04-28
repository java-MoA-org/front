import ResponseDto from "../response.dto";

// interface: get daily list response body DTO //
export default interface GetDailyListResponseDto extends ResponseDto {
  dailyList: DailySummaryResponseDto[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  currentSection: number;
  totalSection: number;
  pageList: number[];
}

// interface: daily summary response body DTO //
export interface DailySummaryResponseDto {
  dailySequence: number;
  title: string;
  content: string;
  creationDate: string;
  profileImage: string;
  userNickname: string;
  views: number;
  likeCount: number;
  commentCount: number;
  images: string[];
}
