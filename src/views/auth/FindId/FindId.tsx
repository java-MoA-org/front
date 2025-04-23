import { useNavigate } from "react-router-dom";
import { ROOT_PATH } from "../../../constants";
import "./FindId.css";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import SignUpInputBox from "../../../components/SignInInputBox/SignUpInputBox";
import UserEmailCheckRequestDto from "../../../apis/dto/request/auth/user-email-check.request.dto";
import {
  userEmailCheckFindIdRequest,
  userEmailCheckRequest,
  UserEmailFindIdVerifyRequest,
  UserEmailVerifyRequest,
} from "../../../apis";
import ResponseDto from "../../../apis/dto/response/response.dto";
import VerifyResponseDto from "../../../apis/dto/response/auth/email-verify-response.dto";
import UserEmailVerifyRequestDto from "../../../apis/dto/request/auth/user-email-verify.request.dto";
import FindIdResponseDto from "../../../apis/dto/response/auth/find-id-response.dto";

interface Props {
  setActiveTab: Dispatch<
    SetStateAction<"signin" | "signup" | "findid" | "findpassword">
  >;
}

export default function FindId({ setActiveTab }: Props) {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");

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
      setUserId(responseBody.userId);
    }
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

  return (
    <div id="auth-login-container">
      <div className="login-logo-container">
        <div className="login-logo" onClick={onLogoClickHandler}>
          MoA
        </div>
      </div>
      <div className="find-id-email-container">
        {!userEmailVerified && (
          <div>
            <SignUpInputBox
              label={"이메일"}
              type={"text"}
              value={userEmail}
              placeholder={"이메일을 입력하세요."}
              onChange={handleUserEmailChange}
              message={userEmailMessage}
              isErrorMessage={userEmailMessageError}
              buttonName={"인증번호 받기"}
              // button click 시 중복확인, 중복이면 인증번호 보내기, 아니면 에러 메시지 출력력
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
        {userEmailVerified && (
          <div className="find-id-result">아이디는 {userId}입니다.</div>
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
