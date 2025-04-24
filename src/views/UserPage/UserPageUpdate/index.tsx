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
import { useParams } from "react-router-dom";
import GetUserInfoResponseDto from "../../../apis/dto/response/user/get-user-info.response.dto";

export default function UserPageUpdate() {
  // state: 로그인 사용자 정보 //
  const {
    userProfileImage,
    userIntroduce,
    userInterests,
    userNickname,
    userPhoneNumber,
  } = useSignInUserStore();

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
  const isUserNicknameCheckButtonActive = /^[가-힣a-zA-Z0-9]{2,8}$/.test(
    updateNickName,
  );
  const [userNicknameMessage, setUserNicknameMessage] = useState<string>("");
  const [userNicknameMessageError, setUserNicknameMessageError] =
    useState<boolean>(false);

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
    userInterestNull: false,
  });

  // variable: 프로필 이미지 스타일 //
  const profileImageStyle = {
    cursor: "pointer",
    backgroundImage: `url(${previewProfile ? previewProfile : DefaultProfile})`,
  };

  // variable: access token //
  const accessToken = cookies[ACCESS_TOKEN];

  // function: 로그인 유저 정보 불러오기 함수 //
  const getUserInfoResponse = (
    responseBody: GetUserInfoResponseDto | ResponseDto | null,
  ) => {
    const message = !responseBody
      ? "서버에 문제가 있습니다."
      : responseBody.code === "DBE"
        ? "서버에 문제가 있습니다."
        : responseBody.code === "AF"
          ? "인증에 실패했습니다."
          : "";

    const {
      userNickname,
      userProfileImage,
      userPhoneNumber,
      userIntroduce,
      userInterests,
    } = responseBody as GetUserInfoResponseDto;

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
    const requestBody: UserNicknameCheckRequestDto = { userNickname };
    userNicknameCheckRequest(requestBody).then(userNicknameCheckResponse);
  };

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

  return (
    <div id="update-userpage">
      <div className="profile-container">
        <div className="profile-image-container">
          <div
            className="profile-image"
            style={profileImageStyle}
            onClick={onProfileClickHandler}
          >
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
            />
          </div>
          <div className="interest-container">
            <div className="interest">관심사</div>
            <div className="interest-content">운동</div>
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

          <InputBox
            label="비밀번호"
            value="**********"
            placeholder=""
            type="text"
            message=""
            buttonName={"비밀번호 변경"}
            disable
          />

          <div className="user-update-save-button">저장</div>
        </div>
      </div>
    </div>
  );
}
