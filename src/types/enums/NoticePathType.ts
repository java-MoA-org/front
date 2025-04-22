export enum NoticePathType {
    LIST = '/category/notice',
    WRITE = '/category/notice/write',
    VIEW = '/category/notice/view',       // + /:noticeId
    UPDATE = '/category/notice/update',   // + /:noticeId
  }