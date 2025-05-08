import { Alert } from '../../../../stores/alert-read.store';
import ResponseDto from '../response.dto';

// 로그인 후 사용자 정보를 전역 상태(Zustand) 등에 저장하거나 UI에 표시할 때 사용.
export default interface GetUserAlertResponseDto extends ResponseDto {
  code: string;
  message: string;
  alerts: Alert[];
}
