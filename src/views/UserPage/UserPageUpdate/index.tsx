import { ChangeEvent, useState } from "react";
import InputBox from "../../../components/InputBox";
import useSignInUserStore from "../../../stores/sign-in-user.store";
import "./style.css";

export default function UserPageUpdate() {
  // state: 로그인 사용자 정보 //
  const { userProfileImage, userIntroduce, userInterests, userNickname, userPhoneNumber } =
    useSignInUserStore();

  // state: 수정 사용자 자기소개 상태 //
  const [updateIntroduce, setUpdateIntroduce] = useState<string>("");
  // state: 수정 사용자 닉네임 상태 //
  const [updateNickName, setUpdateNickName] = useState<string>("");

  // event handler: 사용자 자기소개 변경 이벤트 처리 //
  const onIntroduceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUpdateIntroduce(value);
  };
  // event handler: 사용자 닉네임 변경 이벤트 처리 //
  const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUpdateNickName(value);
  };

  return (
    <div id="update-userpage">
      <div className="profile-container">
        <div className="profile-image-container">
          <div className="profile-image"></div>
          <div className="image-update-button">프로필 이미지 변경</div>
        </div>

        <div className="profile-content-container">
          <div className="introduce-container">
            <div className="introduce-content">
              <InputBox
                label="자기소개"
                value={updateIntroduce}
                placeholder="자기소개를 작성해주세요"
                type="text"
                message=""
                onChange={onIntroduceChangeHandler}
              />
            </div>
          </div>
          <div className="interest-container">
            <div className="interest">관심사</div>
            <div className="interest-content">운동</div>
          </div>

          <div className="nickname-container">
            <InputBox
              label="닉네임"
              value={updateNickName}
              placeholder="닉네임을 작성해주세요"
              type="text"
              message=""
              onChange={onNicknameChangeHandler}
            />
            <div className="nickname-check">중복 확인</div>
          </div>

          <div className="phone-number-container">
            <InputBox
              label="전화번호"
              value="010-1111-1111"
              placeholder="Naver로 회원가입 하신분은 변경이 안됩니다."
              type="text"
              message=""
              disable
            />
          </div>
          <div className="password-container">
            <InputBox
              label="비밀번호"
              value="**********"
              placeholder=""
              type="text"
              message=""
              disable
            />
          </div>
          <div className="user-update-save-button">저장</div>
        </div>
      </div>
    </div>
  );
}
