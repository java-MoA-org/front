import { ChangeEvent, useEffect, useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import './SignUp.css';
import SignUpInputBox from '../../../components/SignInInputBox/SignUpInputBox';
import ResponseDto from '../../../apis/dto/response/response.dto';
import IdCheckRequestDto from '../../../apis/dto/request/auth/user-id-check.request.dto';
import {
    userEmailCheckRequest,
    userIdCheckRequest,
    userNicknameCheckRequest,
    userPhoneNumberCheckRequest,
    userSignUpRequest,
} from '../../../apis';
import UserNicknameCheckRequestDto from '../../../apis/dto/request/auth/user-nickname-check.request.dto';
import UserEmailCheckRequestDto from '../../../apis/dto/request/auth/user-email-check.request.dto';
import UserPhoneNumberCheckRequestDto from '../../../apis/dto/request/auth/user-phone-number-check.request.dto';
import UserSignUpRequestDto from '../../../apis/dto/request/auth/user-sign-up.request.dto';
import { useNavigate } from 'react-router';

interface Props {
    setActiveTab: Dispatch<SetStateAction<'signin' | 'signup'>>;
}

export default function SignUp({ setActiveTab }: Props) {
    const navigator = useNavigate();

    const [userId, setUserId] = useState('');
    const [userIdMessage, setUserIdMessage] = useState<string>('');
    const [userIdMessageError, setUserIdMessageError] = useState<boolean>(false);
    const [UserIdChecked, setUserIdChecked] = useState(false); // 확인 여부
    const isUserIdCheckButtonActive = /^[A-Za-z0-9]{4,12}$/.test(userId);

    const [userPassword, setUserPassword] = useState('');
    const [userPasswordMessage, setUserPasswordMessage] = useState('');
    const [userPasswordValid, setUserPasswordValid] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
    const [confirmPasswordMessage, setConfirmPasswordMessage] = useState<string>('');
    const [confirmPasswordChecked, setConfirmPasswordChecked] = useState(false);

    const [userNickname, setUserNickname] = useState('');
    const [userNicknameValid, setUserNicknameValid] = useState(false);
    const [userNicknameMessage, setUserNicknameMessage] = useState<string>('');
    const [userNicknameMessageError, setUserNicknameMessageError] = useState<boolean>(false);
    const [userNicknameChecked, setUserNicknameChecked] = useState(false);
    const isUserNicknameCheckButtonActive = /^[A-Za-z0-9]{2,8}$/.test(userNickname);

    const [userEmail, setUserEmail] = useState('');
    const [userEmailValid, setUserEmailValid] = useState(false);
    const [userEmailMessage, setUserEmailMessage] = useState<string>('');
    const [userEmailMessageError, setUserEmailMessageError] = useState<boolean>(false);
    const [userEmailChecked, setUserEmailChecked] = useState(false);

    const [userEmailVC, setUserEmailVC] = useState('');
    const [userEmailVCValid, setUserEmailVCValid] = useState(false);
    const [userEmailVCMessage, setUserEmailVCMessage] = useState<string>('');
    const [userEmailVCMessageError, setUserEmailVCMessageError] = useState<boolean>(false);
    const [userEmailVerified, setUserEmailVerified] = useState(false);

    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [userPhoneNumberValid, setUserPhoneNumberValid] = useState(false);
    const [userPhoneNumberMessage, setUserPhoneNumberMessage] = useState<string>('');
    const [userPhoneNumberMessageError, setUserPhoneNumberMessageError] = useState<boolean>(false);
    const [userPhoneNumberChecked, setUserPhoneNumberChecked] = useState(false);

    const [userPhoneNumberVC, setUserPhoneNumberVC] = useState('');
    const [userPhoneNumberVCValid, setUserPhoneNumberVCValid] = useState(false);
    const [userPhoneNumberVCMessage, setUserPhoneNumberVCMessage] = useState<string>('');
    const [userPhoneNumberVCMessageError, setUserPhoneNumberVCMessageError] = useState<boolean>(false);
    const [userPhoneNumberVerified, setUserPhoneNumberVerified] = useState(false);

    const [userIntroduce, setUserIntroduce] = useState('');

    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const [signUpPossible, setSignUpPossible] = useState<boolean>(false);

    const toggleInterest = (interest: string) => {
        setSelectedInterests((prev) =>
            prev.includes(interest) ? prev.filter((item) => item !== interest) : [...prev, interest]
        );
    };

    const interests = ['🛩️여행', '🎮게임', '👚패션', '🏀운동', '🍗맛집', '🎵음악', '💸경제', '🏠일상'];

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
        const isValid = /^[A-Za-z0-9]{2,8}$/.test(value) || value == '';
        setUserNicknameValid(isValid);
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

    const userEmailCheckResponse = (responseBody: ResponseDto | null) => {
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

        setUserEmailMessage(message);
        setUserEmailMessageError(!isSuccess);
        setUserEmailChecked(isSuccess);
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

        setUserPhoneNumberMessage(message);
        setUserPhoneNumberMessageError(!isSuccess);
        setUserPhoneNumberChecked(isSuccess);
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
        setUserEmailVerified(true);
    };
    const onCheckUserPhoneNumberClickHandler = () => {
        const requestbody: UserPhoneNumberCheckRequestDto = { userPhoneNumber };
        userPhoneNumberCheckRequest(requestbody).then(userPhoneNumberCheckResponse);
    };
    const onCheckUserPhoneNumberVCClickHandler = () => {
        setUserPhoneNumberVerified(true);
    };

    const onSignUpClickHandler = () => {
        if (!signUpPossible) return;
        const requestbody: UserSignUpRequestDto = {
            userId,
            userPassword,
            userNickname,
            userEmail,
            userPhoneNumber,
            joinType: 'NORMAL',
            profileImage: 'https://cdn.test.com/image.jpg',
            userIntroduce,
        };
        userSignUpRequest(requestbody).then(userSignUpResponse);
    };

    useEffect(() => {
        const canSubmit =
            UserIdChecked &&
            confirmPasswordChecked &&
            userNicknameChecked &&
            userEmailVerified &&
            userPhoneNumberVerified;

        setSignUpPossible(canSubmit);
    }, [UserIdChecked, confirmPasswordChecked, userNicknameChecked, userEmailVerified, userPhoneNumberVerified]);

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
                        className="signup-introduce"
                        placeholder="자신을 소개해 주세요. (최대 200자)"
                        maxLength={200}
                        value={userIntroduce}
                        onChange={(e) => setUserIntroduce(e.target.value)}
                    />
                </div>

                <label style={{ fontWeight: 'bold' }}>관심사 (복수 선택)</label>
                <div className="interest-list">
                    {interests.map((interest) => (
                        <button
                            key={interest}
                            type="button"
                            className={`interest-button ${selectedInterests.includes(interest) ? 'selected' : ''}`}
                            onClick={() => toggleInterest(interest)}
                        >
                            {interest}
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
