import { useNavigate } from "react-router-dom";
import { ROOT_PATH } from "../../../constants";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import SignUpInputBox from "../../../components/SignInInputBox/SignUpInputBox";
import VerifyResponseDto from "../../../apis/dto/response/auth/email-verify-response.dto";
import ResponseDto from "../../../apis/dto/response/response.dto";
import UserEmailCheckRequestDto from "../../../apis/dto/request/auth/user-email-check.request.dto";
import UserEmailVerifyRequestDto from "../../../apis/dto/request/auth/user-email-verify.request.dto";
import {
  PatchPasswordRequest,
  userEmailCheckFindIdRequest,
  UserEmailFindIdVerifyRequest,
} from "../../../apis";
import FindIdResponseDto from "../../../apis/dto/response/auth/find-id-response.dto";
import PatchPasswordRequestDto from "../../../apis/dto/request/auth/patch-password.request.dto";
import "./FindPassword.css";
interface Props {
  setActiveTab: Dispatch<
    SetStateAction<"signin" | "signup" | "findid" | "findpassword">
  >;
}

export default function FindPassword({ setActiveTab }: Props) {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [emailUserId, setEmailUserId] = useState<string>();

  const [userEmail, setUserEmail] = useState("");
  const [userEmailMessage, setUserEmailMessage] = useState<string>("");
  const [userEmailMessageError, setUserEmailMessageError] =
    useState<boolean>(false);
  const [userEmailValid, setUserEmailValid] = useState(false);
  const [userEmailChecked, setUserEmailChecked] = useState(false);

  const [emailToken, setEmailToken] = useState("");

  const [userEmailVC, setUserEmailVC] = useState("");
  const [userEmailVCValid, setUserEmailVCValid] = useState(false);
  const [userEmailVCMessage, setUserEmailVCMessage] = useState<string>("");
  const [userEmailVCMessageError, setUserEmailVCMessageError] =
    useState<boolean>(false);
  const [userEmailVerified, setUserEmailVerified] = useState(false);

  const [userPassword, setUserPassword] = useState("");
  const [userPasswordMessage, setUserPasswordMessage] = useState("");
  const [userPasswordValid, setUserPasswordValid] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const [confirmPasswordMessage, setConfirmPasswordMessage] =
    useState<string>("");
  const [confirmPasswordChecked, setConfirmPasswordChecked] = useState(false);

  const [isButtonActive, setIsButtonActive] = useState(false);

  const userEmailCheckResponse = (
    responseBody: ResponseDto | VerifyResponseDto | null,
  ) => {
    console.log("📦 이메일 중복 확인 응답:", responseBody);

    // 메시지 정의
    const message = !responseBody
      ? "서버에 문제가 있습니다"
      : responseBody.code === "DBE"
        ? "서버에 문제가 있습니다"
        : responseBody.code === "NEU"
          ? "존재하지 않는 이메일입니다"
          : responseBody.code === "VF"
            ? "이메일을 입력하세요"
            : "인증번호를 입력해주세요";

    const isSuccess = responseBody !== null && responseBody.code === "SU";

    const token =
      isSuccess && responseBody && "token" in responseBody
        ? (responseBody as VerifyResponseDto).token
        : "";

    setEmailToken(token);
    console.log("✅ 추출된 token:", token);

    // 상태 업데이트
    setUserEmailMessage(message);
    setUserEmailMessageError(!isSuccess);
    setUserEmailChecked(isSuccess);
  };
  const userEmailVerifyResponse = (responseBody: FindIdResponseDto | null) => {
    const message = !responseBody
      ? "서버에 문제가 있습니다"
      : responseBody.code === "DBE"
        ? "서버에 문제가 있습니다"
        : responseBody.code === "VCE"
          ? "인증번호가 틀렸습니다."
          : "";

    const isSuccess = responseBody !== null && responseBody.code === "SU";

    setUserEmailVCMessage(message);
    setUserEmailVCMessageError(!isSuccess);
    setUserEmailVerified(isSuccess);
    if (isSuccess) {
      setUserEmailValid(false);
      setUserEmailVCValid(false);
      setEmailUserId(responseBody.userId);
    }
  };
  const patchPasswordResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody
      ? "서버에 문제가 있습니다"
      : responseBody.code === "DBE"
        ? "서버에 문제가 있습니다"
        : "비밀번호 변경에 성공했습니다";

    const isSuccess = responseBody !== null && responseBody.code === "SU";
    alert(message);
    if (isSuccess) {
      navigate("/");
    }
  };

  const handleUserIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserId(value);
  };

  const handleUserEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserEmail(value);
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value == "";
    setUserEmailValid(isValid);
    setUserEmailChecked(false);
  };

  const handleUserEmailVCChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserEmailVC(value);
    const isValid = /^[A-Za-z0-9]{6}$/.test(value) || value == "";
    setUserEmailVCValid(isValid);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserPassword(value);
    const isValid =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]).{8,12}$/.test(
        value,
      ) || value == "";
    setUserPasswordValid(isValid);

    setUserPasswordMessage(isValid ? "" : "비밀번호를 다시 확인해주세요.");
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setConfirmPassword(value);
    const isValid = userPassword === value || value == "";
    setConfirmPasswordValid(isValid);
    setConfirmPasswordMessage(isValid ? "" : "비밀번호가 일치하지 않습니다.");
    setConfirmPasswordChecked(userPassword === value);
    setIsButtonActive(isValid);
  };

  const onLogoClickHandler = () => {
    navigate(ROOT_PATH);
  };
  const onCheckUserEmailClickHandler = () => {
    const requestbody: UserEmailCheckRequestDto = { userEmail };
    userEmailCheckFindIdRequest(requestbody).then(userEmailCheckResponse);
  };
  const onCheckUserEmailVCClickHandler = () => {
    const requestBody: UserEmailVerifyRequestDto = {
      userEmail,
      userEmailVC,
      emailToken,
    };
    UserEmailFindIdVerifyRequest(requestBody).then(userEmailVerifyResponse);
  };

  const onPatchPasswordClickHandler = () => {
    const requestbody: PatchPasswordRequestDto = { userId, userPassword };
    PatchPasswordRequest(requestbody).then(patchPasswordResponse);
  };

  const buttonClass = `patch-password-button ${isButtonActive ? "posible" : "disable"}`;
  return (
    <div id="auth-login-container">
      <div className="login-logo-container">
        <div className="login-logo" onClick={onLogoClickHandler}>
          MoA
        </div>
      </div>
      <div className="find-id-email-container">
        {!userEmailVerified && userId != null && (
          <div>
            <SignUpInputBox
              label={"아이디"}
              type={"text"}
              value={userId}
              placeholder={"아이디를 입력하세요."}
              onChange={handleUserIdChange}
              message={""}
            />
            <SignUpInputBox
              label={"이메일"}
              type={"text"}
              value={userEmail}
              placeholder={"이메일을 입력하세요."}
              onChange={handleUserEmailChange}
              message={userEmailMessage}
              isErrorMessage={userEmailMessageError}
              buttonName={"인증번호 받기"}
              onButtonClick={onCheckUserEmailClickHandler}
              isButtonActive={userEmailValid}
            />
            {userEmailChecked && (
              <SignUpInputBox
                label={"이메일 인증번호"}
                type={"text"}
                value={userEmailVC}
                placeholder={"인증번호를 입력해주세요."}
                onChange={handleUserEmailVCChange}
                message={userEmailVCMessage}
                isErrorMessage={userEmailVCMessageError}
                buttonName="인증하기"
                onButtonClick={onCheckUserEmailVCClickHandler}
                isButtonActive={userEmailVCValid}
                hint="이메일에 전송된 인증번호를 입력해주세요."
              />
            )}
          </div>
        )}
        {userEmailVerified && userId == emailUserId && (
          <div className="find-password-result-container">
            <SignUpInputBox
              label={"비밀번호"}
              type={"password"}
              value={userPassword}
              placeholder={"비밀번호를 입력하세요."}
              onChange={handlePasswordChange}
              message={userPasswordMessage}
              isErrorMessage={!userPasswordValid}
              hint={"8자 이상 13자 미만 영문 및 숫자, 특수문자로 구성"}
            />
            <SignUpInputBox
              label={"비밀번호 확인"}
              type={"password"}
              value={confirmPassword}
              placeholder={"비밀번호를 다시 입력하세요."}
              onChange={handleConfirmPasswordChange}
              message={confirmPasswordMessage}
              isErrorMessage={!confirmPasswordValid}
              hint="같은 비밀번호를 입력하세요."
            />
            <div className="patch-button-container">
              <div
                className={buttonClass}
                onClick={onPatchPasswordClickHandler}
              >
                비밀번호 변경
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="login-others-container">
        <div
          className="login-find-id button"
          onClick={() => setActiveTab("signin")}
        >
          로그인
        </div>{" "}
        |
        <div
          className="login-find-password button"
          onClick={() => setActiveTab("findpassword")}
        >
          비밀번호 찾기
        </div>{" "}
        |
        <div
          className="login-register button"
          onClick={() => setActiveTab("signup")}
        >
          회원가입
        </div>
      </div>
    </div>
  );
}
