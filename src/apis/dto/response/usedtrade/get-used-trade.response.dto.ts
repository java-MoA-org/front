import { ItemTypeTag } from "../../../../types/enums/ItemTypeTag";
import { TransactionStatus } from "../../../../types/enums/TransactionStatus";
import { UsedItemStatusTag } from "../../../../types/enums/UsedItemStatusTag";
import ResponseDto from "../response.dto";

export default interface GetUsedTradeResponseDto extends ResponseDto {
  tradeSequence: number;
  title: string;
  content: string;
  creationDate: string;
  profileImage: string;
  writerNickname: string;
  views: number;
  itemTypeTag: ItemTypeTag;
  usedItemStatusTag: UsedItemStatusTag;
  price: string;
  location: string;
  detailLocation: string;
  transactionStatus: TransactionStatus;
  imageUrls: string[];
  likeCount: number;
  hasChatRoom: boolean;
}
