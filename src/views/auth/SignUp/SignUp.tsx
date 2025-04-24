import { ChangeEvent, useEffect, useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import './SignUp.css';
import SignUpInputBox from '../../../components/SignInInputBox/SignUpInputBox';
import ResponseDto from '../../../apis/dto/response/response.dto';
import IdCheckRequestDto from '../../../apis/dto/request/auth/user-id-check.request.dto';
import {
  userEmailCheckRequest,
  UserEmailVerifyRequest,
  userIdCheckRequest,
  userNicknameCheckRequest,
  userPhoneNumberCheckRequest,
  UserPhoneNumberVerifyRequest,
  userSignInRequest,
  userSignUpRequest,
} from '../../../apis';
import UserNicknameCheckRequestDto from '../../../apis/dto/request/auth/user-nickname-check.request.dto';
import UserEmailCheckRequestDto from '../../../apis/dto/request/auth/user-email-check.request.dto';
import UserPhoneNumberCheckRequestDto from '../../../apis/dto/request/auth/user-phone-number-check.request.dto';
import UserSignUpRequestDto from '../../../apis/dto/request/auth/user-sign-up.request.dto';
import { useNavigate } from 'react-router';
import { ROOT_PATH } from '../../../constants';
import ProfileImageUploader from '../../../components/ProfileImage';
import { InterestsType } from '../../../types/userInterests';
import UserEmailVerifyRequestDto from '../../../apis/dto/request/auth/user-email-verify.request.dto';
import UserPhoneNumberVerifyRequestDto from '../../../apis/dto/request/auth/user-phone-number-verify.request.dto';
import VerifyResponseDto from '../../../apis/dto/response/auth/email-verify-response.dto';
import { Cookies, useCookies } from 'react-cookie';
import UserSignInRequestDto from '../../../apis/dto/request/auth/user-sign-in.request.dto';
import UserSignInResponseDto from '../../../apis/dto/response/auth/user-sign-in.response.dto';

interface Props {
  setActiveTab: Dispatch<SetStateAction<'signin' | 'signup' | 'findid' | 'findpassword'>>;
}

export default function SignUp({ setActiveTab }: Props) {
  const navigator = useNavigate();

  const [cookies, removeCookie] = useCookies([
    'userId',
    'userPassword',
    'userNickname',
    'userEmail',
    'userPhoneNumber',
    'profileImage',
    'joinType',
  ]);

  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  };

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  };

  const [joinType, setJoinType] = useState<'NORMAL' | 'KAKAO' | 'NAVER'>('NORMAL');

  const [userId, setUserId] = useState('');
  const [userIdMessage, setUserIdMessage] = useState<string>('');
  const [userIdMessageError, setUserIdMessageError] = useState<boolean>(false);
  const [userIdChecked, setUserIdChecked] = useState(false); // 확인 여부
  const isUserIdCheckButtonActive = /^[A-Za-z0-9]{4,12}$/.test(userId);
  const [userIdReadOnlyActive, setUserIdReadOnlyActive] = useState(false);

  const [userPassword, setUserPassword] = useState('');
  const [userPasswordMessage, setUserPasswordMessage] = useState('');
  const [userPasswordValid, setUserPasswordValid] = useState(false);
  const [userPasswordReadOnlyActive, setUserPasswordReadOnlyActive] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState<string>('');
  const [confirmPasswordChecked, setConfirmPasswordChecked] = useState(false);

  const [userNickname, setUserNickname] = useState('');
  const [userNicknameMessage, setUserNicknameMessage] = useState<string>('');
  const [userNicknameMessageError, setUserNicknameMessageError] = useState<boolean>(false);
  const [userNicknameChecked, setUserNicknameChecked] = useState(false);
  const isUserNicknameCheckButtonActive = /^[가-힣a-zA-Z0-9]{2,8}$/.test(userNickname);

  const [profileImage, setProfileImage] = useState<string>('');

  const [userEmail, setUserEmail] = useState('');
  const [userEmailValid, setUserEmailValid] = useState(false);
  const [userEmailMessage, setUserEmailMessage] = useState<string>('');
  const [userEmailMessageError, setUserEmailMessageError] = useState<boolean>(false);
  const [userEmailChecked, setUserEmailChecked] = useState(false);
  const [userEmailReadOnlyActive, setUserEmailReadOnlyActive] = useState(false);

  const [userEmailVC, setUserEmailVC] = useState('');
  const [userEmailVCValid, setUserEmailVCValid] = useState(false);
  const [emailToken, setEmailToken] = useState('');
  const [userEmailVCMessage, setUserEmailVCMessage] = useState<string>('');
  const [userEmailVCMessageError, setUserEmailVCMessageError] = useState<boolean>(false);
  const [userEmailVerified, setUserEmailVerified] = useState(false);

  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [userPhoneNumberValid, setUserPhoneNumberValid] = useState(false);
  const [userPhoneNumberToken, setUserPhoneNumberToken] = useState('');
  const [userPhoneNumberMessage, setUserPhoneNumberMessage] = useState<string>('');
  const [userPhoneNumberMessageError, setUserPhoneNumberMessageError] = useState<boolean>(false);
  const [userPhoneNumberChecked, setUserPhoneNumberChecked] = useState(false);
  const [userPhoneNumberReadOnlyActive, setUserPhoneNumberReadOnlyActive] = useState(false);

  const [userPhoneNumberVC, setUserPhoneNumberVC] = useState('');
  const [userPhoneNumberVCValid, setUserPhoneNumberVCValid] = useState(false);
  const [userPhoneNumberVCMessage, setUserPhoneNumberVCMessage] = useState<string>('');
  const [userPhoneNumberVCMessageError, setUserPhoneNumberVCMessageError] = useState<boolean>(false);
  const [userPhoneNumberVerified, setUserPhoneNumberVerified] = useState(false);

  const [userIntroduce, setUserIntroduce] = useState('');

  const [signUpPossible, setSignUpPossible] = useState<boolean>(false);

  const interests: { label: string; key: keyof InterestsType }[] = [
    { label: '🛩️여행', key: 'userInterestTrip' },
    { label: '🎮게임', key: 'userInterestGame' },
    { label: '👚패션', key: 'userInterestFashion' },
    { label: '🏀운동', key: 'userInterestWorkout' },
    { label: '🍗맛집', key: 'userInterestFood' },
    { label: '🎵음악', key: 'userInterestMusic' },
    { label: '💸경제', key: 'userInterestEconomics' },
    { label: '🏠일상', key: 'userInterestNull' }, // ✅ 선택 가능하게 포함
  ];

  const [selectedInterests, setSelectedInterests] = useState<InterestsType>({
    userInterestTrip: false,
    userInterestGame: false,
    userInterestFashion: false,
    userInterestWorkout: false,
    userInterestFood: false,
    userInterestMusic: false,
    userInterestEconomics: false,
    userInterestNull: false,
  });

  const toggleInterest = (key: keyof InterestsType) => {
    setSelectedInterests((prev: InterestsType) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const userIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserId(value);

    setUserIdChecked(false);
    setUserIdMessage('');
    setUserIdMessageError(false);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserPassword(value);
    const isValid =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]).{8,12}$/.test(value) || value == '';
    setUserPasswordValid(isValid);

    setUserPasswordMessage(isValid ? '' : '비밀번호를 다시 확인해주세요.');
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setConfirmPassword(value);
    const isValid = userPassword === value || value == '';
    setConfirmPasswordValid(isValid);
    setConfirmPasswordMessage(isValid ? '' : '비밀번호가 일치하지 않습니다.');
    setConfirmPasswordChecked(userPassword === value);
  };

  const handleUserNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserNickname(value);
    setUserNicknameChecked(false);
  };

  const handleUserEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserEmail(value);
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value == '';
    setUserEmailValid(isValid);
    setUserEmailChecked(false);
  };

  const handleUserEmailVCChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserEmailVC(value);
    const isValid = /^[A-Za-z0-9]{6}$/.test(value) || value == '';
    setUserEmailVCValid(isValid);
  };

  const handleUserPhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 남기기

    // 하이픈 자동 삽입
    if (value.length < 4) {
      value = value;
    } else if (value.length < 8) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else {
      value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }

    setUserPhoneNumber(value);

    const isValid = /^\d{3}-\d{3,4}-\d{4}$/.test(value) || value === '';
    setUserPhoneNumberValid(isValid);
    setUserPhoneNumberChecked(false);
  };

  const handleUserPhoneNumberVCChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserPhoneNumberVC(value);
    const isValid = /^[A-Za-z0-9]{6}$/.test(value) || value == '';
    setUserPhoneNumberVCValid(isValid);
  };

  const idCheckResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody
      ? '서버에 문제가 있습니다'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다'
      : responseBody.code === 'EU'
      ? '이미 사용중인 아이디입니다'
      : responseBody.code === 'VF'
      ? '아이디를 입력하세요'
      : '사용 가능한 아이디입니다';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';

    setUserIdMessage(message);
    setUserIdMessageError(!isSuccess);
    setUserIdChecked(isSuccess);
  };

  const userNicknameCheckResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody
      ? '서버에 문제가 있습니다'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다'
      : responseBody.code === 'EU'
      ? '이미 사용중인 닉네임입니다'
      : responseBody.code === 'VF'
      ? '닉네임을 입력하세요'
      : '사용 가능한 닉네임입니다';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    setUserNicknameMessage(message);
    setUserNicknameMessageError(!isSuccess);
    setUserNicknameChecked(isSuccess);
  };

  const userEmailCheckResponse = (responseBody: ResponseDto | VerifyResponseDto | null) => {
    console.log('📦 이메일 중복 확인 응답:', responseBody);

    // 메시지 정의
    const message = !responseBody
      ? '서버에 문제가 있습니다'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다'
      : responseBody.code === 'EU'
      ? '이미 사용중인 이메일입니다'
      : responseBody.code === 'VF'
      ? '이메일을 입력하세요'
      : '사용 가능한 이메일입니다';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';

    // token 안전하게 추출
    const token = isSuccess && responseBody && 'token' in responseBody ? (responseBody as VerifyResponseDto).token : '';

    console.log('✅ 추출된 token:', token);

    // 상태 업데이트
    setEmailToken(token);
    setUserEmailMessage(message);
    setUserEmailMessageError(!isSuccess);
    setUserEmailChecked(isSuccess);
  };

  const userEmailVerifyResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody
      ? '서버에 문제가 있습니다'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다'
      : responseBody.code === 'VCE'
      ? '인증번호가 틀렸습니다.'
      : '인증되었습니다.';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';

    setUserEmailVCMessage(message);
    setUserEmailVCMessageError(!isSuccess);
    setUserEmailVerified(isSuccess);
    if (isSuccess) {
      setUserEmailReadOnlyActive(true);
      setUserEmailValid(false);
      setUserEmailVCValid(false);
    }
  };

  const userPhoneNumberCheckResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody
      ? '서버에 문제가 있습니다'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다'
      : responseBody.code === 'EU'
      ? '이미 사용중인 전화번호입니다'
      : responseBody.code === 'VF'
      ? '전화번호를 입력하세요'
      : '사용 가능한 전화번호입니다';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';

    const token = isSuccess && responseBody && 'token' in responseBody ? (responseBody as VerifyResponseDto).token : '';

    setUserPhoneNumberToken(token);
    setUserPhoneNumberMessage(message);
    setUserPhoneNumberMessageError(!isSuccess);
    setUserPhoneNumberChecked(isSuccess);
  };

  const userPhoneNumberVerifyResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody
      ? '서버에 문제가 있습니다'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다'
      : responseBody.code === 'VCE'
      ? '인증번호가 틀렸습니다.'
      : '인증되었습니다.';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';

    setUserPhoneNumberVCMessage(message);
    setUserPhoneNumberVCMessageError(!isSuccess);
    setUserPhoneNumberVerified(isSuccess);

    setUserPhoneNumberReadOnlyActive(isSuccess);
    setUserPhoneNumberValid(!isSuccess);
    setUserPhoneNumberVCValid(!isSuccess);
  };

  const userSignInResponse = (responseBody: ResponseDto | UserSignInResponseDto | null) => {
    const { accessToken, expiration, userRole } = responseBody as UserSignInResponseDto;
    localStorage.setItem('userRole', userRole); // ✅ "ADMIN" 또는 "USER"
    const expires = new Date(Date.now() + expiration * 1000);

    // 토큰 + 권한 저장
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('accessTokenExpiresAt', expires.getTime().toString());
    localStorage.setItem('userRole', userRole); // 관리자 여부 판단용
  };

  const userSignUpResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody
      ? '서버에 문제가 있습니다'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다'
      : responseBody.code === 'EU'
      ? '이미 사용중인 아이디입니다'
      : responseBody.code === 'VF'
      ? '모두 입력해주세요'
      : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      if (responseBody && responseBody.code === 'EU') {
        setUserIdMessage(message);
        setUserIdMessageError(true);
        return;
      }
      alert(message);
      return;
    }
    const requestBody: UserSignInRequestDto = { userId, userPassword };
    userSignInRequest(requestBody).then(userSignInResponse);
    ['joinType', 'profileImage', 'userId', 'userNickname', 'userPassword'].forEach(deleteCookie);

    navigator('/');
  };

  const onCheckUserIdClickHandler = () => {
    const requestBody: IdCheckRequestDto = { userId };
    userIdCheckRequest(requestBody).then(idCheckResponse);
  };
  const onCheckUserNicknameClickHandler = () => {
    const requestBody: UserNicknameCheckRequestDto = { userNickname };
    userNicknameCheckRequest(requestBody).then(userNicknameCheckResponse);
  };
  const onCheckUserEmailClickHandler = () => {
    const requestbody: UserEmailCheckRequestDto = { userEmail };
    userEmailCheckRequest(requestbody).then(userEmailCheckResponse);
  };

  const onCheckUserEmailVCClickHandler = () => {
    const requestBody: UserEmailVerifyRequestDto = {
      userEmail,
      userEmailVC,
      emailToken,
    };
    UserEmailVerifyRequest(requestBody).then(userEmailVerifyResponse);
  };

  const onCheckUserPhoneNumberClickHandler = () => {
    const requestbody: UserPhoneNumberCheckRequestDto = { userPhoneNumber };
    userPhoneNumberCheckRequest(requestbody).then(userPhoneNumberCheckResponse);
  };

  const onCheckUserPhoneNumberVCClickHandler = () => {
    const requestBody: UserPhoneNumberVerifyRequestDto = {
      userPhoneNumber,
      userPhoneNumberVC,
      userPhoneNumberToken,
    };
    UserPhoneNumberVerifyRequest(requestBody).then(userPhoneNumberVerifyResponse);
  };

  const onSignUpClickHandler = () => {
    if (!signUpPossible) return;
    const joinTypeCookie = getCookie('joinType');
    const requestBody: UserSignUpRequestDto = {
      userId,
      userPassword,
      userNickname,
      userEmail,
      userPhoneNumber,
      joinType: joinTypeCookie ?? 'NORMAL',
      profileImage,
      userIntroduce,
      interests: selectedInterests,
    };

    userSignUpRequest(requestBody).then(userSignUpResponse);
  };

  useEffect(() => {
    const canSubmit =
      userIdChecked && confirmPasswordChecked && userNicknameChecked && userEmailVerified && userPhoneNumberVerified;

    setSignUpPossible(canSubmit);
  }, [userIdChecked, confirmPasswordChecked, userNicknameChecked, userEmailVerified, userPhoneNumberVerified]);

  useEffect(() => {
    const userIdFromCookie = cookies['userId'];
    const userPasswordFromCookie = cookies['userPassword'];
    const userNicknameFromCookie = cookies['userNickname'];
    const userEmailFromCookie = cookies['userEmail'];
    const userPhoneNumberFromCookie = cookies['userPhoneNumber'];
    const profileImageFromCookie = cookies['profileImage'];
    const joinTypeFromCookie = cookies['joinType'];

    if (userIdFromCookie) {
      setUserId(userIdFromCookie);
      setUserIdChecked(true);
      setUserIdReadOnlyActive(true);
    }

    if (userPasswordFromCookie) {
      setUserPassword(userPasswordFromCookie);
      setUserPasswordValid(true);
      setConfirmPassword(userPasswordFromCookie);
      setConfirmPasswordChecked(true);
      setUserPasswordReadOnlyActive(true);
    }

    if (userNicknameFromCookie) {
      setUserNickname(userNicknameFromCookie);
      setUserNicknameChecked(true);
    }

    if (userEmailFromCookie) {
      setUserEmail(userEmailFromCookie);
      setUserEmailChecked(false);
      setUserEmailVerified(true);
      setUserEmailReadOnlyActive(true); // 수정 불가능하게
    }

    if (userPhoneNumberFromCookie) {
      setUserPhoneNumber(userPhoneNumberFromCookie);
      setUserPhoneNumberChecked(false);
      setUserPhoneNumberVerified(true);
      setUserPhoneNumberReadOnlyActive(true); // 수정 불가능하게
    }

    if (profileImageFromCookie) {
      setProfileImage(profileImageFromCookie);
    }

    if (joinTypeFromCookie) {
      setJoinType(joinTypeFromCookie); // 'KAKAO' 또는 'NAVER'
    }
  }, []);

  return (
    <div id="auth-signup-container">
      <div className="signup-logo">회원가입</div>
      <div className="signup-input-group">
        <SignUpInputBox
          label={'아이디'}
          type={'text'}
          value={userId}
          placeholder={'아이디를 입력해주세요.'}
          onChange={userIdChangeHandler}
          message={userIdMessage}
          buttonName={'중복 확인'}
          onButtonClick={onCheckUserIdClickHandler}
          isErrorMessage={userIdMessageError}
          isButtonActive={isUserIdCheckButtonActive}
          hint={'4자 이상 13자 미만 영문자 및 숫자로 구성'}
          readOnly={userIdReadOnlyActive}
        />
        <SignUpInputBox
          label={'비밀번호'}
          type={'password'}
          value={userPassword}
          placeholder={'비밀번호를 입력하세요.'}
          onChange={handlePasswordChange}
          message={userPasswordMessage}
          isErrorMessage={!userPasswordValid}
          hint={'8자 이상 13자 미만 영문 및 숫자, 특수문자로 구성'}
          readOnly={userPasswordReadOnlyActive}
        />
        <SignUpInputBox
          label={'비밀번호 확인'}
          type={'password'}
          value={confirmPassword}
          placeholder={'비밀번호를 다시 입력하세요.'}
          onChange={handleConfirmPasswordChange}
          message={confirmPasswordMessage}
          isErrorMessage={!confirmPasswordValid}
          hint="같은 비밀번호를 입력하세요."
          readOnly={userPasswordReadOnlyActive}
        />
        <SignUpInputBox
          label={'닉네임'}
          type={'text'}
          value={userNickname}
          placeholder={'닉네임을 입력하세요.'}
          onChange={handleUserNicknameChange}
          message={userNicknameMessage}
          isErrorMessage={userNicknameMessageError}
          buttonName={'중복 확인'}
          onButtonClick={onCheckUserNicknameClickHandler}
          isButtonActive={isUserNicknameCheckButtonActive}
          hint="2자 이상 8자 이하, 특수문자를 포함할 수 없습니다."
        />
        <ProfileImageUploader
          onImageUpload={setProfileImage}
          initialImage={profileImage} // ✅ 여기!
        />

        <SignUpInputBox
          label={'이메일'}
          type={'text'}
          value={userEmail}
          placeholder={'이메일을 입력하세요.'}
          onChange={handleUserEmailChange}
          message={userEmailMessage}
          isErrorMessage={userEmailMessageError}
          buttonName={'인증번호 받기'}
          // button click 시 중복확인, 중복이면 에러메시지, 아니면 인증번호 보내기
          onButtonClick={onCheckUserEmailClickHandler}
          isButtonActive={userEmailValid}
          readOnly={userEmailReadOnlyActive}
        />
        {userEmailChecked && (
          <SignUpInputBox
            label={'이메일 인증번호'}
            type={'text'}
            value={userEmailVC}
            placeholder={'이메일에 전송된 인증번호를 입력해주세요.'}
            onChange={handleUserEmailVCChange}
            message={userEmailVCMessage}
            isErrorMessage={userEmailVCMessageError}
            buttonName="인증하기"
            onButtonClick={onCheckUserEmailVCClickHandler}
            isButtonActive={userEmailVCValid}
            readOnly={userEmailReadOnlyActive}
          />
        )}
        <SignUpInputBox
          label={'전화번호'}
          type={'tel'}
          value={userPhoneNumber}
          placeholder={'전화번호를 입력하세요.'}
          onChange={handleUserPhoneNumberChange}
          message={userPhoneNumberMessage}
          isErrorMessage={userPhoneNumberMessageError}
          buttonName={'인증번호 받기'}
          // button click 시 중복확인, 중복이면 에러메시지 //, 아니면 인증번호 보내기
          onButtonClick={onCheckUserPhoneNumberClickHandler}
          isButtonActive={userPhoneNumberValid}
          readOnly={userPhoneNumberReadOnlyActive}
        />
        {userPhoneNumberChecked && (
          <SignUpInputBox
            label={'휴대폰 인증번호'}
            type={'text'}
            value={userPhoneNumberVC}
            placeholder={'휴대폰에 전송된 인증번호를 입력해주세요.'}
            onChange={handleUserPhoneNumberVCChange}
            message={userPhoneNumberVCMessage}
            isErrorMessage={userPhoneNumberVCMessageError}
            buttonName="인증하기"
            onButtonClick={onCheckUserPhoneNumberVCClickHandler}
            isButtonActive={userPhoneNumberVCValid}
            readOnly={userPhoneNumberReadOnlyActive}
          />
        )}
      </div>

      <div className="signup-input-group">
        <div className="signup-input-introduce">
          <label htmlFor="introduce" style={{ fontWeight: 'bold' }}>
            자기소개
          </label>
          <textarea
            id="introduce"
            className="signup-introduction"
            placeholder="자신을 소개해 주세요. (최대 200자)"
            maxLength={200}
            value={userIntroduce}
            onChange={(e) => setUserIntroduce(e.target.value)}
          />
        </div>

        <label style={{ fontWeight: 'bold' }}>관심사 (복수 선택)</label>
        <div className="interest-list">
          {interests.map(({ label, key }) => (
            <button
              key={key}
              type="button"
              className={`interest-button ${selectedInterests[key] ? 'selected' : ''}`}
              onClick={() => toggleInterest(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <button
        className={signUpPossible ? 'signup-submit' : 'signup-submit-unauthorized'}
        onClick={onSignUpClickHandler}
      >
        회원가입
      </button>
      <div className="signup-login-link" onClick={() => setActiveTab('signin')}>
        로그인
      </div>
    </div>
  );
}
