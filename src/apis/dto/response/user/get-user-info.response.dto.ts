import { InterestsType } from '../../../../types/userInterests';
import ResponseDto from '../response.dto';

export default interface GetUserInfoResponseDto extends ResponseDto {
    userId: string;
    userNickname: string;
    userProfileImage: string;
    userPhoneNumber: string;
    userIntroduce: string;
    userInterests: InterestsType;
}
