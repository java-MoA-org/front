import ResponseDto from '../response.dto';

export default interface UserSignInResponseDto extends ResponseDto {
    accessToken: string;
    expiration: number;
}
