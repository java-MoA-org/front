import { ChangeEvent, useEffect, useRef, useState } from "react";
import InputBox from "../../../components/InputBox";
import DefaultProfile from "../../../assets/images/default-profile.png";
import useSignInUserStore from "../../../stores/sign-in-user.store";
import "./style.css";
import { useCookies } from "react-cookie";
import { UserInterest } from "../../../types/interfaces";
import { ACCESS_TOKEN } from "../../../constants";
import ResponseDto from "../../../apis/dto/response/response.dto";
import UserNicknameCheckRequestDto from "../../../apis/dto/request/auth/user-nickname-check.request.dto";
import { getUserInfoRequest, userNicknameCheckRequest } from "../../../apis";
import SignUpInputBox from "../../../components/SignInInputBox/SignUpInputBox";
import useSignInUser from "../../../hooks/sign-in-user.hook";
import { useNavigate, useParams } from "react-router-dom";
import GetUserInfoResponseDto from "../../../apis/dto/response/user/get-user-info.response.dto";
import { InterestsType } from "../../../types/userInterests";
import Modal from "../../../components/Modal";

export default function UserPageUpdate() {
  // state: 로그인 사용자 정보 //
  const { userProfileImage, userIntroduce, userInterests, userNickname, userPhoneNumber } =
    useSignInUserStore();
  const { nickname } = useParams();
  const navigate = useNavigate();

  // URL 닉네임과 로그인 유저 닉네임이 다르면 메인으로 이동
  // useEffect(() => {
  //   if (!nickname || nickname !== userNickname) {
  //     alert("접근 권한이 없습니다.");
  //     navigate("/main"); // 혹은 홈 페이지 등으로 리다이렉트
  //   }
  // }, [nickname, userNickname]);

  //! 받아오는걸 기다린 후 비교 하는 형식
  useEffect(() => {
    if (!userNickname) {
      // accessToken이 있고 zustand 상태가 비어있으면 fetch
      if (accessToken) {
        getUserInfoRequest(accessToken).then((response) => {
          if (response && response.code === "SU") {
            // Zustand에 정보 저장
            const { userNickname } = response as GetUserInfoResponseDto;
            useSignInUserStore.getState().setUserNickname(userNickname);
          }
        });
      }
      return;
    }

    // 유저 닉네임이 세팅된 이후 접근 제한 처리
    if (nickname !== userNickname) {
      alert("접근 권한이 없습니다.");
      navigate(-1);
    }
  }, [nickname, userNickname, ACCESS_TOKEN]);
  // state: 쿠키 상태 //
  const [cookies] = useCookies();

  // state: 파일 인풋 참조 상태 //
  const fileRef = useRef<HTMLInputElement | null>(null);

  // state: 프로필 이미지 미리보기 상태 //
  const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  // state: 사용자 프로필 이미지 상태 //
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  // state: 수정 사용자 자기소개 상태 //
  const [updateIntroduce, setUpdateIntroduce] = useState<string>("");
  // state: 수정 사용자 닉네임 상태 //
  const [updateNickName, setUpdateNickName] = useState<string>("");
  const [userNicknameChecked, setUserNicknameChecked] = useState(false);
  const isUserNicknameCheckButtonActive = /^[가-힣a-zA-Z0-9]{2,8}$/.test(updateNickName);
  const [userNicknameMessage, setUserNicknameMessage] = useState<string>("");
  const [userNicknameMessageError, setUserNicknameMessageError] = useState<boolean>(false);

  // state: 수정 사용자 전화번호 상태 //
  const [updatePhoneNumber, setUpdatePhoneNumber] = useState<string>("");
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [step, setStep] = useState<1 | 2>(1); // 1: 현재 비번, 2: 새 비번

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

    const { userNickname, userProfileImage, userPhoneNumber, userIntroduce, userInterests } =
      responseBody as GetUserInfoResponseDto;

    setUpdateNickName(userNickname);
    setPreviewProfile(userProfileImage);
    setUpdateInterest(userInterests);
    setUpdateIntroduce(userIntroduce);
    setUpdatePhoneNumber(userPhoneNumber);
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
  function CurrentPasswordStep({ onNext, onCancel }: { onNext: () => void; onCancel: () => void }) {
    const [password, setPassword] = useState("");

    const checkPassword = () => {
      if (password === "") onNext();
      else alert("비밀번호가 틀렸습니다");
    };

    return (
      <div>
        <InputBox
          label="현재 비밀번호"
          value={password}
          type="password"
          placeholder="현재 비밀번호 입력"
          onChange={(e) => setPassword(e.target.value)}
          message=""
        />
        <button onClick={checkPassword}>확인</button>
        <button onClick={onCancel}>취소</button>
      </div>
    );
  }

  // const [userPassword, setUserPassword] = useState("");
  // const [userPasswordMessage, setUserPasswordMessage] = useState("");
  // const [userPasswordValid, setUserPasswordValid] = useState(false);
  // // const [userPasswordReadOnlyActive, setUserPasswordReadOnlyActive] = useState(false);

  // const [confirmPassword, setConfirmPassword] = useState("");
  // const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  // const [confirmPasswordMessage, setConfirmPasswordMessage] = useState<string>("");
  // const [confirmPasswordChecked, setConfirmPasswordChecked] = useState(false);

  // function: 새 비밀번호 입력 처리 함수 //
  function NewPasswordStep({
    onSave,
    onCancel
  }: {
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
        <button onClick={handleSave}>저장</button>
        <button onClick={onCancel}>취소</button>
      </div>
    );
  }

  // function: 기존 비밀번호 확인 처리 함수 //

  // // function: 새 비밀번호 유효 함수 //
  // const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { value } = e.target;
  //   setUserPassword(value);
  //   const isValid =
  //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]).{8,12}$/.test(value) ||
  //     value == "";
  //   setUserPasswordValid(isValid);

  //   setUserPasswordMessage(isValid ? "" : "비밀번호를 다시 확인해주세요.");
  // };
  // // function: 새 비밀번호 확인 함수
  // const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { value } = e.target;
  //   setConfirmPassword(value);
  //   const isValid = userPassword === value || value == "";
  //   setConfirmPasswordValid(isValid);
  //   setConfirmPasswordMessage(isValid ? "" : "비밀번호가 일치하지 않습니다.");
  //   setConfirmPasswordChecked(userPassword === value);
  // };

  // function: patch userinfo response 처리 함수 //
  const patchUserInfoResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody
      ? "서버에 문제가 있습니다"
      : responseBody.code === "DBE"
      ? "서버에 문제가 있습니다"
      : responseBody.code === "AF"
      ? "인증에 실패했습니다"
      : "";
  };

  // event handler: 프로필 사진 클릭 이벤트 처리 //
  const onProfileClickHandler = () => {
    if (!fileRef.current) return;
    fileRef.current.click();
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

  // effect: 컴포넌트 로드 시 실행할 함수 //
  useEffect(() => {
    getUserInfoRequest(accessToken).then(getUserInfoResponse);
  }, [accessToken]);

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
          <div className="image-update-button" onClick={onProfileClickHandler}>
            프로필 이미지 변경
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
                    setUpdateInterest((prev) => {
                      const updated = { ...prev, [key]: !prev[key] };

                      // 선택된 관심사가 하나도 없으면 userInterestNull만 true로
                      const isAllUnselected = Object.values(updated).every((v) => v === false);
                      if (isAllUnselected) {
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
                      // 하나라도 선택되어 있다면 일상을 false로
                      if (key !== "userInterestNull" && updated.userInterestNull) {
                        updated.userInterestNull = false;
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

          {/* 수정!!! */}
          <SignUpInputBox
            type={"text"}
            label="전화번호"
            value={updatePhoneNumber}
            placeholder={"전화번호를 입력하세요."}
            onChange={onNicknameChangeHandler}
            message={userNicknameMessage}
            isErrorMessage={userNicknameMessageError}
            buttonName={"전화번호 변경"}
            onButtonClick={onCheckUserNicknameClickHandler}
            isButtonActive={isUserNicknameCheckButtonActive}
            hint="Naver로 회원가입 하신분은 변경이 안됩니다."
            readOnly
          />

          <SignUpInputBox
            type={"password"}
            label="비밀번호"
            value="**********"
            placeholder={""}
            onChange={onNicknameChangeHandler}
            buttonName={"비밀번호 변경"}
            onButtonClick={openModal}
            isButtonActive={isUserNicknameCheckButtonActive}
            readOnly
          />
          {isModalOpen && (
            <Modal title="비밀번호 변경" onClose={closeModal}>
              {step === 1 ? (
                <CurrentPasswordStep onNext={() => setStep(2)} onCancel={closeModal} />
              ) : (
                <NewPasswordStep onSave={closeModal} onCancel={closeModal} />
              )}
            </Modal>
          )}

          <div className="user-update-save-button">저장</div>
        </div>
      </div>
    </div>
  );
}
