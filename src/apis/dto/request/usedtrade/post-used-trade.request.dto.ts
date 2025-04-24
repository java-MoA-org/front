import { ItemTypeTag } from "../../../../types/enums/ItemTypeTag";
import { UsedItemStatusTag } from "../../../../types/enums/UsedItemStatusTag";

// interface: post used trade request body DTO //
export default interface PostUsedTradeRequestDto {
  creationDate: string;
  title: string;
  content: string;
  itemTypeTag: ItemTypeTag;
  usedItemStatusTag: UsedItemStatusTag;
  price: string;
  location: string;
  detailLocation: string;
  imageList: string[];
}
