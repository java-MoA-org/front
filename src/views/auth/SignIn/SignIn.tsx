import './SignIn.css';
import { useNavigate } from 'react-router-dom';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { ROOT_PATH } from '../../../constants';

import UserSignInRequestDto from '../../../apis/dto/request/auth/user-sign-in.request.dto';
import { userSignInRequest } from '../../../apis';
import ResponseDto from '../../../apis/dto/response/response.dto';
import UserSignInResponseDto from '../../../apis/dto/response/auth/user-sign-in.response.dto';

// interface: 로그인 컴포넌트 속성 //
interface Props {
  setActiveTab: Dispatch<SetStateAction<'signin' | 'signup'>>;
}

// component: 로그인 컴포넌트
export default function SignIn({ setActiveTab }: Props) {
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  const [signInHint, setSignInHint] = useState<string>('');

  // SNS 로그인 핸들러
  const handleKakaoLogin = () => {
    window.location.href = 'https://kauth.kakao.com/oauth/authorize?...';
  };

  const handleNaverLogin = () => {
    alert('네이버 로그인 연동 예정');
  };

  // 입력 핸들러
  const handleUserIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const handleUserPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserPassword(e.target.value);
  };

  // 서버 응답 처리
  const userSignInResponse = (responseBody: ResponseDto | UserSignInResponseDto | null) => {
    const message = !responseBody
      ? '서버에 문제가 있습니다'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다'
      : responseBody.code === 'SF'
      ? '로그인 정보가 일치하지 않습니다.'
      : '';
    const isSuccess = responseBody !== null && responseBody.code === 'SU';

    if (!isSuccess) {
      setSignInHint(message);
      return;
    }

    const { accessToken, expiration, userRole } = responseBody as UserSignInResponseDto;
    localStorage.setItem('userRole', userRole); // ✅ "ADMIN" 또는 "USER"
    const expires = new Date(Date.now() + expiration * 1000);

    // 토큰 + 권한 저장
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('accessTokenExpiresAt', expires.getTime().toString());
    localStorage.setItem('userRole', userRole); // 관리자 여부 판단용

    navigate('/');
  };

  const onLogoClickHandler = () => {
    navigate(ROOT_PATH);
  };

  // 로그인 요청
  const onSignInClickHandler = () => {
    if (userId.trim() === '') {
      setSignInHint('아이디를 입력해주세요');
      return;
    }
    if (userPassword.trim() === '') {
      setSignInHint('비밀번호를 입력해주세요');
      return;
    }

    const requestBody: UserSignInRequestDto = { userId, userPassword };
    userSignInRequest(requestBody).then(userSignInResponse);
  };

  return (
    <div id="auth-login-container">
      <div className="login-logo-container">
        <div className="login-logo" onClick={onLogoClickHandler}>
          MoA
        </div>
      </div>

      <div className="login-input-container">
        <div className="login-id-input-container">
          <input
            className="login-id"
            placeholder="아이디를 입력해주세요"
            onChange={handleUserIdChange}
          />
        </div>
        <div className="login-password-input-container">
          <input
            className="login-password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            onChange={handleUserPasswordChange}
          />
        </div>
        <div className="login-hint">{signInHint}</div>
      </div>

      <div className="login-button-container">
        <div className="login-login button" onClick={onSignInClickHandler}>
          로그인
        </div>

        <div className="login-others-container">
          <div className="login-find-id button">아이디 찾기</div> |
          <div className="login-find-password button">비밀번호 찾기</div> |
          <div className="login-register button" onClick={() => setActiveTab('signup')}>
            회원가입
          </div>
        </div>
      </div>

      <div className="login-sns-container">
        <div className="login-sns">SNS 로그인</div>
        <div className="login-sns-buttons-container">
          <div className="login-kakao button" onClick={handleKakaoLogin}></div>
          <div className="login-google button"></div>
        </div>
      </div>
    </div>
  );
}