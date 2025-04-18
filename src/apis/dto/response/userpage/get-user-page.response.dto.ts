import { Board, Daily, Trade } from "../../../../types/interfaces";
import UserInterest from "../../../../types/interfaces/user-interest.interface";
import ResponseDto from "../response.dto";

export default interface GetUserPageResponseDto extends ResponseDto {
  boards: Board[];
  dailys: Daily[];
  trades: Trade[];
  interests: UserInterest;
}
