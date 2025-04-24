import ResponseDto from '../response.dto';

export default interface PhoneNumberVerifyResponseDto extends ResponseDto {
  token: string;
  verifyCode: string;
}
