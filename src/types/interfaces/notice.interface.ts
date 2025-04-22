// 공지사항 리스트 및 상세에 사용할 공통 타입

export interface NoticeItem {
    notificationSequence: number;
    title: string;
    creationDate: string;
    views: number;
  }
  
  export interface NoticeDetail extends NoticeItem {
    content: string;
  }