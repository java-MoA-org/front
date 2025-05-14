import { ChangeEvent, useEffect, useRef, useState } from "react";
import InputBox from "../../../components/InputBox";
import DefaultProfile from "../../../assets/images/default-profile.png";
import useSignInUserStore from "../../../stores/sign-in-user.store";
import "./style.css";
import { useCookies } from "react-cookie";
import { UserInterest } from "../../../types/interfaces";
import {
  ACCESS_TOKEN,
  MY_USER_ABSOLUTE_PATH,
  MY_USER_BOARD_ABSOLUTE_PATH,
  ROOT_ABSOULTE_PATH
} from "../../../constants";
import ResponseDto from "../../../apis/dto/response/response.dto";
import UserNicknameCheckRequestDto from "../../../apis/dto/request/auth/user-nickname-check.request.dto";
import {
  fileUploadRequest,
  getUserPageInfoRequest,
  passwordVerifyRequest,
  PatchPasswordRequest,
  patchPasswordUserPageRequest,
  patchUserInfoRequest,
  userEmailCheckRequest,
  UserEmailVerifyRequest,
  userNicknameCheckRequest
} from "../../../apis";
import SignUpInputBox from "../../../components/SignInInputBox/SignUpInputBox";
import useSignInUser from "../../../hooks/sign-in-user.hook";
import { useNavigate, useParams } from "react-router-dom";
import GetUserInfoResponseDto from "../../../apis/dto/response/user/get-user-info.response.dto";
import { InterestsType } from "../../../types/userInterests";
import Modal from "../../../components/Modal";
import PasswordVerifyRequestDto from "../../../apis/dto/request/userInfo/post-verify-pawword.request.dto";
import PatchPasswordUserPageRequestDto from "../../../apis/dto/request/userInfo/patch-password-userpage.request.dto";
import UserEmailCheckRequestDto from "../../../apis/dto/request/auth/user-email-check.request.dto";
import VerifyResponseDto from "../../../apis/dto/response/auth/email-verify-response.dto";
import UserEmailVerifyRequestDto from "../../../apis/dto/request/auth/user-email-verify.request.dto";
import PatchUserInfoRequestDto from "../../../apis/dto/request/userInfo/patch-user-info.request.dto";

export default function UserPageUpdate() {
  // state: 로그인 사용자 정보 //
  const { userProfileImage, userIntroduce, userInterests, userNickname, userEmail } =
    useSignInUserStore();
  const navigate = useNavigate();

  // //! 받아오는걸 기다린 후 비교 하는 형식
  // useEffect(() => {
  //   if (!userNickname) {
  //     // accessToken이 있고 zustand 상태가 비어있으면 fetch
  //     if (accessToken) {
  //       getUserPageInfoRequest(accessToken).then((response) => {
  //         if (response && response.code === "SU") {
  //           // Zustand에 정보 저장
  //           const { userNickname } = response as GetUserInfoResponseDto;
  //           useSignInUserStore.getState().setUserNickname(userNickname);
  //         }
  //       });
  //     }
  //     return;
  //   }

  //   // 유저 닉네임이 세팅된 이후 접근 제한 처리
  //   if (nickname !== userNickname) {
  //     alert("접근 권한이 없습니다.");
  //     navigate(-1);
  //   }
  // }, [nickname, userNickname, ACCESS_TOKEN]); // 이거 필요없음... 닉네임을 안가져오고 그냥 token값 추출해서 자기 편집페이지만 보이게 하면 되기에...
  // state: 쿠키 상태 //
  const [cookies] = useCookies();

  // state: 파일 인풋 참조 상태 //
  const fileRef = useRef<HTMLInputElement | null>(null);

  // state: join type 상태 //
  const [joinType, setJoinType] = useState<"NORMAL" | "KAKAO" | "NAVER" | null>("NORMAL");

  // state: 프로필 이미지 미리보기 상태 //
  const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  // state: 사용자 프로필 이미지 상태 //
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  // state: 수정 사용자 자기소개 상태 //
  const [updateIntroduce, setUpdateIntroduce] = useState<string>("");
  // state: 수정 사용자 닉네임 상태 //
  const [updateNickName, setUpdateNickName] = useState<string>("");
  const [userNicknameChecked, setUserNicknameChecked] = useState(false);
  const isUserNicknameCheckButtonActive =
    /^[가-힣a-zA-Z0-9]{2,8}$/.test(updateNickName) && updateNickName !== userNickname;
  const [userNicknameMessage, setUserNicknameMessage] = useState<string>("");
  const [userNicknameMessageError, setUserNicknameMessageError] = useState<boolean>(false);

  // state: 수정 사용자 이메일 상태 //

  const [updateUserEmail, setUpdateUserEmail] = useState<string>("");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  const [newUserEmail, setNewUserEmail] = useState("");
  const [userEmailValid, setUserEmailValid] = useState(false);
  const [userEmailChecked, setUserEmailChecked] = useState(false);
  const [userEmailReadOnlyActive, setUserEmailReadOnlyActive] = useState(false);

  const [userEmailVC, setUserEmailVC] = useState("");
  const [userEmailVCValid, setUserEmailVCValid] = useState(false);
  const [userEmailVerified, setUserEmailVerified] = useState(false);

  const [userEmailMessage, setUserEmailMessage] = useState("");
  const [userEmailMessageError, setUserEmailMessageError] = useState(false);
  const [userEmailVCMessage, setUserEmailVCMessage] = useState("");
  const [userEmailVCMessageError, setUserEmailVCMessageError] = useState(false);

  const [emailToken, setEmailToken] = useState("");

  const isUserEmailCheckButtonActive = joinType !== "NAVER" ? true : false;

  // variable: 저장 버튼 활성화 변수 //
  const isSaveButtonActive =
    (!isUserNicknameCheckButtonActive || userNicknameChecked) && !!updateNickName;

  const openEmailModal = () => setIsEmailModalOpen(true);
  const resetEmailModalState = () => {
    setNewUserEmail("");
    setUserEmailValid(false);
    setUserEmailChecked(false);
    setUserEmailReadOnlyActive(false);
    setUserEmailVC("");
    setUserEmailVCValid(false);
    setUserEmailVerified(false);
    setUserEmailMessage("");
    setUserEmailMessageError(false);
    setUserEmailVCMessage("");
    setUserEmailVCMessageError(false);
  };

  const closeEmailModal = () => {
    resetEmailModalState();
    setIsEmailModalOpen(false);
  };

  const onCheckUserEmailClickHandler = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(newUserEmail);

    if (!isValid) {
      setUserEmailMessage("유효한 이메일을 입력하세요.");
      setUserEmailMessageError(true);
      return;
    }

    const requestBody: UserEmailCheckRequestDto = {
      userEmail: newUserEmail
    };

    const response = await userEmailCheckRequest(requestBody);
    if (!response || response.code !== "SU") {
      setUserEmailMessage("이메일 전송 실패 또는 이미 사용 중입니다.");
      setUserEmailMessageError(true);
      return;
    }

    // 성공 시
    setUserEmailMessage("인증 코드가 이메일로 전송되었습니다.");
    setUserEmailMessageError(false);
    setEmailToken((response as VerifyResponseDto).token); // 토큰 저장
    setUserEmailChecked(true);
  };

  const onCheckUserEmailVCClickHandler = async () => {
    if (newUserEmail === "" || userEmailVC === "") {
      return;
    }

    const requestBody: UserEmailVerifyRequestDto = {
      userEmail: newUserEmail,
      userEmailVC: userEmailVC,
      emailToken: emailToken
    };

    const response = await UserEmailVerifyRequest(requestBody);

    if (!response || response.code !== "SU") {
      setUserEmailVCMessage("인증번호가 일치하지 않습니다.");
      setUserEmailVCMessageError(true);
      return;
    }

    // 인증 성공
    setUserEmailVCMessage("인증 완료되었습니다.");
    setUserEmailVCMessageError(false);
    setUserEmailVerified(true);
    setUserEmailReadOnlyActive(true);
    setUpdateUserEmail(newUserEmail);
  };

  // state: 수정 사용자 관심사 상태 //
  const [updateInterest, setUpdateInterest] = useState<UserInterest>({
    userInterestTrip: false,
    userInterestGame: false,
    userInterestFashion: false,
    userInterestWorkout: false,
    userInterestFood: false,
    userInterestMusic: false,
    userInterestEconomics: false,
    userInterestNull: false
  });

  // 비밀번호
  // state: 모달 오픈 상태 //
  const isUserPasswordCheckButtonActive = joinType === "NORMAL" ? true : false;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [step, setStep] = useState<1 | 2>(1); // 1: 현재 비번, 2: 새 비번
  const [tempCurrentPassword, setTempCurrentPassword] = useState<string>("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setStep(1); // 닫을 때는 초기화
  };

  // variable: 프로필 이미지 스타일 //
  const profileImageStyle = {
    cursor: "pointer",
    backgroundImage: `url(${previewProfile ? previewProfile : DefaultProfile})`
  };

  // variable: access token //
  const accessToken = cookies[ACCESS_TOKEN];

  // function: 로그인 유저 정보 불러오기 함수 //
  const getUserInfoResponse = (responseBody: GetUserInfoResponseDto | ResponseDto | null) => {
    const message = !responseBody
      ? "서버에 문제가 있습니다."
      : responseBody.code === "DBE"
      ? "서버에 문제가 있습니다."
      : responseBody.code === "AF"
      ? "인증에 실패했습니다."
      : "";

    const { userNickname, userProfileImage, userEmail, userIntroduce, userInterests, joinType } =
      responseBody as GetUserInfoResponseDto;

    setUpdateNickName(userNickname);
    setPreviewProfile(userProfileImage);
    setUpdateInterest(userInterests);
    setUpdateIntroduce(userIntroduce);
    setUpdateUserEmail(userEmail);
    setJoinType(joinType as "NORMAL" | "KAKAO" | "NAVER");
  };

  // function: 닉네임 중복 확인 response 처리 함수
  const userNicknameCheckResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody
      ? "서버에 문제가 있습니다"
      : responseBody.code === "DBE"
      ? "서버에 문제가 있습니다"
      : responseBody.code === "EU"
      ? "이미 사용중인 닉네임입니다"
      : responseBody.code === "VF"
      ? "닉네임을 입력하세요"
      : "사용 가능한 닉네임입니다";

    const isSuccess = responseBody !== null && responseBody.code === "SU";
    setUserNicknameMessage(message);
    setUserNicknameMessageError(!isSuccess);
    setUserNicknameChecked(isSuccess);
  };

  // function: 닉네임 중복 클릭 이벤트 처리 //
  const onCheckUserNicknameClickHandler = () => {
    const requestBody: UserNicknameCheckRequestDto = { userNickname: updateNickName };
    userNicknameCheckRequest(requestBody).then(userNicknameCheckResponse);
  };

  // function: 현재 비밀번호 입력 처리 함수 //
  function CurrentPasswordStep({
    onNext,
    onCancel
  }: {
    onNext: (currentPassword: string) => void;
    onCancel: () => void;
  }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [cookies] = useCookies();
    const accessToken = cookies[ACCESS_TOKEN];

    const checkPassword = async () => {
      if (!currentPassword) {
        setErrorMessage("비밀번호를 입력해주세요");
        return;
      }

      const requestBody: PasswordVerifyRequestDto = { userPassword: currentPassword };
      const response = await passwordVerifyRequest(accessToken, requestBody);

      if (!response || response.code === "DBE") {
        setErrorMessage("서버 오류가 발생했습니다");
      } else if (response.code === "PNR") {
        setErrorMessage("비밀번호가 일치하지 않습니다.");
      } else if (response.code === "SU") {
        onNext(currentPassword);
      }
    };

    return (
      <div>
        <InputBox
          label="현재 비밀번호"
          value={currentPassword}
          type="password"
          placeholder="현재 비밀번호 입력"
          onChange={(e) => setCurrentPassword(e.target.value)}
          message={errorMessage}
          isErrorMessage={!!errorMessage}
          hint="비밀번호 변경 시 마이페이지로 이동합니다"
        />
        <div className="modal-button-container">
          <button className="button-modal-ok" onClick={checkPassword}>
            확인
          </button>
          <button className="button-modal-cancel" onClick={onCancel}>
            취소
          </button>
        </div>
      </div>
    );
  }

  // function: 새 비밀번호 입력 처리 함수 //
  function NewPasswordStep({
    currentPassword,
    onSave,
    onCancel
  }: {
    currentPassword: string;
    onSave: (password: string) => void;
    onCancel: () => void;
  }) {
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [pwMessage, setPwMessage] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");

    const handleNewPwChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setNewPw(value);

      const isValid =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]).{8,12}$/.test(value) ||
        value === "";
      setPwMessage(isValid ? "" : "비밀번호를 다시 확인해주세요.");
    };

    const handleConfirmPwChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setConfirmPw(value);

      const isValid = newPw === value || value === "";
      setConfirmMessage(isValid ? "" : "비밀번호가 일치하지 않습니다.");
    };

    const handleSave = () => {
      if (newPw !== confirmPw) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      onSave(newPw); // 새 비밀번호 전달
    };

    return (
      <div>
        <InputBox
          label="새 비밀번호"
          value={newPw}
          type="password"
          placeholder="새 비밀번호"
          onChange={handleNewPwChange}
          message={pwMessage}
          hint="8자 이상 13자 미만 영문 및 숫자, 특수문자로 구성"
        />
        <InputBox
          label="비밀번호 확인"
          value={confirmPw}
          type="password"
          placeholder="비밀번호 확인"
          onChange={handleConfirmPwChange}
          message={confirmMessage}
        />
        <div className="modal-button-container">
          <button className="button-modal-ok" onClick={handleSave}>
            저장
          </button>
          <button className="button-modal-cancel" onClick={onCancel}>
            취소
          </button>
        </div>
      </div>
    );
  }

  // event handler: 프로필 사진 클릭 이벤트 처리 //
  const onProfileClickHandler = () => {
    if (!fileRef.current) return;
    fileRef.current.click();
  };
  // event handler: 기본 프로플 클릭 이벤트 처리 //
  const onProfileDefaultClickHandler = () => {
    setPreviewProfile(DefaultProfile); // 미리보기 이미지 변경
    setProfileImageFile(null);
  };

  // event handler: 파일 인풋 변경 이벤트 처리 //
  const onFileChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target; // files는 리스트 형태
    if (!files || !files.length) return;

    const file = files[0];
    setProfileImageFile(file);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
      setPreviewProfile(fileReader.result as string);
    };
  };

  // event handler: 사용자 자기소개 변경 이벤트 처리 //
  const onIntroduceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUpdateIntroduce(value);
  };
  // event handler: 사용자 닉네임 변경 이벤트 처리 //
  const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUpdateNickName(value);
    setUserNicknameChecked(false);
  };
  //event handler: 취소 버튼 클릭 이벤트 처리 //
  const onClickCancelHandler = () => {
    navigate(-1);
  };
  // event handler: 저장 버튼 클릭 이벤트 처리 //
  const onSaveUserInfoClickHandler = async () => {
    let interestsToSave = { ...updateInterest };

    const isAllUnselected = Object.entries(interestsToSave) //! interestsToSave 객체를 [key, value] 쌍 배열로 변환한다.
      .filter(([k]) => k !== "userInterestNull" && k !== "userId") // userId가 있어서 머가 있다고 생각이 들어 일상을 true로 안보내는 거임 //! 필터링해서 관심사 관련 key만 남긴다.
      .every(([_, v]) => v === false); //! 남은 값들이 모두 false인지 검사한다

    if (isAllUnselected) {
      interestsToSave = {
        userInterestTrip: false,
        userInterestGame: false,
        userInterestFashion: false,
        userInterestWorkout: false,
        userInterestFood: false,
        userInterestMusic: false,
        userInterestEconomics: false,
        userInterestNull: true
      };
    }

    let newProfileImage: string | null = null;
    if (profileImageFile) {
      const formData = new FormData();
      formData.append("file", profileImageFile); // 키 'file', 값 profileImageFile
      newProfileImage = await fileUploadRequest(formData);
    }

    newProfileImage = userProfileImage === previewProfile ? userProfileImage : newProfileImage;

    const requestBody: PatchUserInfoRequestDto = {
      userNickname: updateNickName,
      userIntroduce: updateIntroduce,
      userEmail: updateUserEmail,
      profileImage: newProfileImage,
      userInterests: interestsToSave
    };

    const response = await patchUserInfoRequest(accessToken, requestBody);
    if (response?.code === "SU") {
      alert("회원 정보가 수정되었습니다.");
      // navigate(MY_USER_ABSOLUTE_PATH(updateNickName)); 애매한게 바로 열로 보내면 지금 바뀐 닉네임이 자기인지 인지를 못함
      // 상태 업데이트 후 바로 navigate 호출
      useSignInUserStore.getState().setUserNickname(updateNickName);
      useSignInUserStore.getState().setUserIntroduce(updateIntroduce);
      useSignInUserStore.getState().setUserEmail(updateUserEmail);
      useSignInUserStore.getState().setUserInterests(updateInterest);
      useSignInUserStore.getState().setUserProfileImage(newProfileImage ?? "");
      navigate(MY_USER_ABSOLUTE_PATH(updateNickName));
    } else {
      alert("회원 정보 수정에 실패했습니다.");
    }
  };
  // effect: 컴포넌트 로드 시 실행할 함수 //
  useEffect(() => {
    getUserPageInfoRequest(accessToken).then(getUserInfoResponse);
  }, [accessToken]);
  const [isUserInterestNullSelectedManually, setIsUserInterestNullSelectedManually] =
    useState(false);

  const interests: { label: string; key: keyof InterestsType }[] = [
    { label: "🛩️여행", key: "userInterestTrip" },
    { label: "🎮게임", key: "userInterestGame" },
    { label: "👚패션", key: "userInterestFashion" },
    { label: "🏀운동", key: "userInterestWorkout" },
    { label: "🍗맛집", key: "userInterestFood" },
    { label: "🎵음악", key: "userInterestMusic" },
    { label: "💸경제", key: "userInterestEconomics" },
    { label: "🏠일상", key: "userInterestNull" } // ✅ 선택 가능하게 포함
  ];

  useEffect(() => {
    if (!updateInterest) return;

    const isAllUnselected = Object.entries(updateInterest)
      .filter(([k]) => k !== "userInterestNull")
      .every(([_, v]) => v === false);

    if (isAllUnselected && updateInterest.userInterestNull) {
      setIsUserInterestNullSelectedManually(false); // 🚀 자동 켜진 일상으로 간주
    } else {
      setIsUserInterestNullSelectedManually(true); // 🚀 직접 누른 일상으로 간주
    }
  }, [updateInterest]);

  return (
    <div id="update-userpage">
      <div className="profile-container">
        <div className="profile-image-container">
          <div className="profile-image" style={profileImageStyle} onClick={onProfileClickHandler}>
            <input
              ref={fileRef}
              style={{ display: "none" }}
              type="file"
              accept="image/png, image/jpeg"
              onChange={onFileChangeHandler}
            />
          </div>
          <div className="image-update-conainer">
            <div className="image-update-button" onClick={onProfileClickHandler}>
              프로필 이미지 변경
            </div>
            <div className="image-default-button" onClick={onProfileDefaultClickHandler}>
              기본 이미지로 변경
            </div>
          </div>
        </div>

        <div className="introduce-container">
          <div className="introduce-content">
            <InputBox
              label="자기소개"
              value={updateIntroduce}
              placeholder="자기소개를 작성해주세요"
              type="textarea"
              message=""
              onChange={onIntroduceChangeHandler}
              hint="자기소개는 50자까지 쓸 수 있습니다"
              maxLength={50}
            />
          </div>

          <div className="interest-container">
            <div className="interest">관심사</div>
            <div className="interest-content">
              {interests.map(({ key, label }) => (
                <button
                  key={key}
                  className={`interest-button ${updateInterest[key] ? "selected" : ""}`}
                  onClick={() => {
                    if (!updateInterest) return;
                    setUpdateInterest((prev) => {
                      const updated = { ...prev, [key]: !prev[key] };

                      if (key === "userInterestNull") {
                        setIsUserInterestNullSelectedManually(updated.userInterestNull);
                        return updated;
                      }

                      // 다른 관심사를 눌렀을 때
                      const isAllUnselected = Object.entries(updated)
                        .filter(([k]) => k !== "userInterestNull")
                        .every(([_, v]) => v === false);

                      if (isAllUnselected) {
                        setIsUserInterestNullSelectedManually(false);
                        return {
                          userInterestTrip: false,
                          userInterestGame: false,
                          userInterestFashion: false,
                          userInterestWorkout: false,
                          userInterestFood: false,
                          userInterestMusic: false,
                          userInterestEconomics: false,
                          userInterestNull: true
                        };
                      }

                      // 하나라도 선택되어 있으면
                      if (updated.userInterestNull && !isUserInterestNullSelectedManually) {
                        updated.userInterestNull = false; // 자동 일상만 꺼줌
                      }

                      return updated;
                    });
                  }}
                >
                  {label}
                </button>
              ))}
              <div className="interest-explain">
                아무것도 선택하지 않을 시 자동으로 일상이 선택됩니다
              </div>
            </div>
          </div>

          <SignUpInputBox
            label={"닉네임"}
            type={"text"}
            value={updateNickName}
            placeholder={"닉네임을 입력하세요."}
            onChange={onNicknameChangeHandler}
            message={userNicknameMessage}
            isErrorMessage={userNicknameMessageError}
            buttonName={"중복 확인"}
            onButtonClick={onCheckUserNicknameClickHandler}
            isButtonActive={isUserNicknameCheckButtonActive}
            hint="2자 이상 8자 이하, 특수문자를 포함할 수 없습니다."
          />

          <SignUpInputBox
            type={"text"}
            label="이메일"
            value={updateUserEmail}
            placeholder={"이메일을 입력하세요."}
            onChange={(e) => setNewUserEmail(e.target.value)}
            buttonName={"이메일 변경"}
            onButtonClick={openEmailModal}
            isButtonActive={isUserEmailCheckButtonActive}
            readOnly
            hint="NAVER로 회원가입 하신 분들은 이메일을 변경할 수 없습니다"
          />
          {isEmailModalOpen && (
            <Modal title="이메일 변경" onClose={closeEmailModal}>
              <div className="email-modal-container">
                {/* 이메일 입력 */}
                <SignUpInputBox
                  type="text"
                  label="새 이메일"
                  value={newUserEmail}
                  placeholder="새 이메일을 입력하세요"
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewUserEmail(value);

                    const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
                    setUserEmailValid(isValid);
                  }}
                  buttonName="인증 코드 보내기"
                  onButtonClick={onCheckUserEmailClickHandler}
                  isButtonActive={userEmailValid}
                  message={userEmailMessage}
                  isErrorMessage={userEmailMessageError}
                  readOnly={userEmailReadOnlyActive}
                />

                {/* 인증번호 입력 */}
                {userEmailChecked && (
                  <SignUpInputBox
                    type="text"
                    label="인증번호"
                    value={userEmailVC}
                    placeholder="6자리 인증번호 입력"
                    onChange={(e) => {
                      const value = e.target.value;
                      setUserEmailVC(value);

                      const isValid = /^[A-Za-z0-9]{6}$/.test(value);
                      setUserEmailVCValid(isValid);
                    }}
                    buttonName="확인"
                    onButtonClick={onCheckUserEmailVCClickHandler}
                    isButtonActive={userEmailVCValid}
                    message={userEmailVCMessage}
                    isErrorMessage={userEmailVCMessageError}
                    readOnly={userEmailVerified}
                  />
                )}

                {/* 완료 버튼 */}
                <div className="modal-button-container">
                  {userEmailVerified && (
                    <button
                      className="button-modal-ok"
                      onClick={() => {
                        setUpdateUserEmail(newUserEmail); // 이메일 최종 적용
                        closeEmailModal(); // 모달 닫기
                      }}
                    >
                      완료
                    </button>
                  )}
                  <button className="button-modal-cancel" onClick={closeEmailModal}>
                    닫기
                  </button>
                </div>
              </div>
            </Modal>
          )}

          <div className="button-container">
            <div
              className={`user-update-save-button ${!isSaveButtonActive ? "disabled" : ""}`}
              onClick={isSaveButtonActive ? onSaveUserInfoClickHandler : undefined}
            >
              저장
            </div>
            <div className="user-update-cancel-button" onClick={onClickCancelHandler}>
              취소
            </div>
          </div>

          <SignUpInputBox
            type={"password"}
            label="비밀번호 변경"
            value="**********"
            placeholder={""}
            onChange={onNicknameChangeHandler}
            buttonName={"비밀번호 변경"}
            onButtonClick={openModal}
            isButtonActive={isUserPasswordCheckButtonActive}
            readOnly
            hint="NAVER 및 KAKAO로 회원가입 하신 분들은 비밀번호 변경할 수 없습니다"
          />
          {isModalOpen && (
            <Modal title="비밀번호 변경" onClose={closeModal}>
              {step === 1 ? (
                <CurrentPasswordStep
                  onNext={(currentPassword: string) => {
                    setTempCurrentPassword(currentPassword); // ✅ 비밀번호 받아서 저장
                    setStep(2);
                  }}
                  onCancel={closeModal}
                />
              ) : (
                <NewPasswordStep
                  currentPassword={tempCurrentPassword}
                  onSave={async (newPw: string) => {
                    const requestBody: PatchPasswordUserPageRequestDto = {
                      currentPassword: tempCurrentPassword,
                      userPassword: newPw
                    };

                    const response = await patchPasswordUserPageRequest(accessToken, requestBody);
                    if (response?.code === "SU") {
                      alert("비밀번호가 변경되었습니다!");
                      closeModal();
                      navigate(MY_USER_ABSOLUTE_PATH(userNickname));
                    } else {
                      alert("비밀번호 변경에 실패했습니다.");
                    }
                  }}
                  onCancel={closeModal}
                />
              )}
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}
