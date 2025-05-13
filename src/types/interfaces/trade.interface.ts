export default interface Trade {
  tradeSequence: number;
  title: string;
  views: number;
  likeCount: number;
  creationDate: string;
  location: string;
  usedItemStatusTag: string;
  images: string[];
  userNickname: string;
  profileImage: string;
  price: number;
  itemTypeTag: string;
  transactionStatus: string;
}