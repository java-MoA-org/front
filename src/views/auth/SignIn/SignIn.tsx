import './SignIn.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from 'react';
import { ROOT_PATH } from '../../../constants';

import UserSignInRequestDto from '../../../apis/dto/request/auth/user-sign-in.request.dto';
import { getUserInfoRequest, SNS_SIGN_IN_URL, userSignInRequest } from '../../../apis';
import ResponseDto from '../../../apis/dto/response/response.dto';
import UserSignInResponseDto from '../../../apis/dto/response/auth/user-sign-in.response.dto';
import useSessionTimerStore from '../../../stores/session-timer.store';
import useSignInUserStore from '../../../stores/sign-in-user.store';

// interface: 로그인 컴포넌트 속성 //
interface Props {
  setActiveTab: Dispatch<SetStateAction<'signin' | 'signup' | 'findid' | 'findpassword'>>;
}

// component: 로그인 컴포넌트
export default function SignIn({ setActiveTab }: Props) {
  const navigate = useNavigate();
  const { setTimeLeft } = useSessionTimerStore();
  const { setUserAll } = useSignInUserStore();
  const [userId, setUserId] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  const [signInHint, setSignInHint] = useState<string>('');
  const [_, setCookie] = useCookies(['accessToken']);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleKakaoLogin = () => {
    window.location.href = SNS_SIGN_IN_URL('kakao');
  };

  const handleNaverLogin = () => {
    window.location.href = SNS_SIGN_IN_URL('naver');
  };

  // 입력 핸들러
  const handleUserIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const handleUserPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserPassword(e.target.value);
  };

  const userSignInResponse = async (responseBody: ResponseDto | UserSignInResponseDto | null) => {
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
    setTimeLeft(expiration);

    // 토큰 + 권한 저장
    localStorage.setItem('userRole', userRole); // 관리자 여부 판단용

    // Set accessToken cookie
    setCookie('accessToken', accessToken, { path: '/' });

    const userInfo = await getUserInfoRequest(accessToken);
    setUserAll(userInfo);

    await new Promise((res) => setTimeout(res, 500));
    navigate(ROOT_PATH);
  };

  const handleIdEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      passwordInputRef.current?.focus();
    }
  };

  const handlePasswordEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSignInClickHandler();
    }
  };

  const onLogoClickHandler = () => {
    navigate(ROOT_PATH);
  };

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
            onKeyDown={handleIdEnterKeyDown}
          />
        </div>
        <div className="login-password-input-container">
          <input
            className="login-password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            onChange={handleUserPasswordChange}
            onKeyDown={handlePasswordEnterKeyDown}
            ref={passwordInputRef}
          />
        </div>
        <div className="login-hint">{signInHint}</div>
      </div>

      <div className="login-button-container">
        <div className="login-login button" onClick={onSignInClickHandler}>
          로그인
        </div>

        <div className="login-others-container">
          <div className="login-find-id button" onClick={() => setActiveTab('findid')}>
            아이디 찾기
          </div>{' '}
          |
          <div className="login-find-password button" onClick={() => setActiveTab('findpassword')}>
            비밀번호 찾기
          </div>{' '}
          |
          <div className="login-register button" onClick={() => setActiveTab('signup')}>
            회원가입
          </div>
        </div>
      </div>

      <div className="login-sns-container">
        <div className="login-sns">SNS 로그인</div>
        <div className="login-sns-buttons-container">
          <div className="login-kakao button" onClick={handleKakaoLogin}></div>
          <div className="login-naver button" onClick={handleNaverLogin}></div>
        </div>
      </div>
    </div>
  );
}
