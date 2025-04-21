import ResponseDto from '../response.dto';

export default interface EmailVerifyResponseDto extends ResponseDto {
    token: string;
}
