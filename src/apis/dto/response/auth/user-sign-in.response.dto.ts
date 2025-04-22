import ResponseDto from '../response.dto';

export default interface UserSignInResponseDto extends ResponseDto {
    accessToken: string;
    expiration: number;
    userRole: string; // 관리자 확인용 
}
