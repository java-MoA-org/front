import ResponseDto from '../response.dto';

export default interface VerifyResponseDto extends ResponseDto {
    token: string;
}
