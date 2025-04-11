import { ChangeEvent, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { useDaumPostcodePopup, Address } from "react-daum-postcode";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

interface Props {
  setActiveTab: Dispatch<SetStateAction<"signin" | "signup">>;
}

export default function SignUp({ setActiveTab }: Props) {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

  const [userId, setUserId] = useState("");
  const [isIdDuplicated, setIsIdDuplicated] = useState(false);
  const [isIdChecked, setIsIdChecked] = useState(false);

  const [nickName, setNickName] = useState("");
  const [isNickNameDuplicated, setIsNickNameDuplicated] = useState(false);
  const [isNickNameChecked, setIsNickNameChecked] = useState(false);

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((item) => item !== interest) : [...prev, interest]
    );
  };

  const navigator = useNavigate();
  const interests = [
    "🛩️여행",
    "🎮게임",
    "👚패션",
    "🏀운동",
    "🍗맛집",
    "🎵음악",
    "💸경제",
    "🏠일상"
  ];

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value === "");
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setIsPasswordMatch(value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setIsPasswordMatch(password === value);
  };

  const handleIdCheck = () => {
    const takenIds = ["admin", "service123", "testuser"];
    const isDuplicate = takenIds.includes(userId);
    setIsIdDuplicated(isDuplicate);
    if (!isDuplicate) setIsIdChecked(true);
  };

  const nickNameCheckHandler = () => {
    const takenNickNames = ["바보", "메롱", "학생"];
    const isDuplicate = takenNickNames.includes(nickName);
    setIsNickNameDuplicated(isDuplicate);
    if (!isDuplicate) setIsNickNameChecked(true);
  };

  // 📦 카카오 주소 API
  const open = useDaumPostcodePopup();

  const handleSearchAddress = () => {
    open({ onComplete: handleCompleteAddress });
  };

  const handleCompleteAddress = (data: Address) => {
    setAddress(data.address);
  };

  return (
    <div id="auth-signup-container">
      <div className="signup-logo">회원가입</div>

      {/* 아이디 */}
      <div className="signup-input-group">
        <div className="signup-input-row">
          <input
            className="signup-input"
            placeholder="아이디를 입력해주세요"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              setIsIdChecked(false);
            }}
          />
          <button className="signup-button check-button" onClick={handleIdCheck}>
            중복 확인
          </button>
        </div>
        {isIdChecked && isIdDuplicated && (
          <div className="signup-error">이미 사용 중인 아이디입니다</div>
        )}
        {isIdChecked && !isIdDuplicated && (
          <div className="signup-correct">사용 가능한 아이디입니다</div>
        )}
      </div>

      {/* 비밀번호 */}
      <div className="signup-input-group">
        <input
          className="signup-input"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={handlePasswordChange}
        />
        {password === "" && (
          <div className="signup-error">영문, 숫자를 혼합하여 8~13자 입력해주세요</div>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div className="signup-input-group">
        <input
          className="signup-input"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        {!isPasswordMatch && <div className="signup-error">비밀번호가 일치하지 않습니다</div>}
      </div>

      {/* 닉네임 */}
      <div className="signup-input-group">
        <div className="signup-input-row">
          <input
            className="signup-input"
            placeholder="닉네임을 입력해주세요"
            value={nickName}
            onChange={(e) => {
              setNickName(e.target.value);
              setIsNickNameDuplicated(false);
            }}
          />
          <button className="signup-button check-button" onClick={nickNameCheckHandler}>
            중복 확인
          </button>
        </div>
        {isNickNameChecked && isNickNameDuplicated && (
          <div className="signup-error">이미 사용중인 닉네임입니다.</div>
        )}
        {isNickNameChecked && !isNickNameDuplicated && (
          <div className="signup-correct">사용 가능한 닉네임입니다.</div>
        )}
      </div>

      {/* 이메일 */}
      <div className="signup-input-group">
        <input
          className="signup-input"
          type="email"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={handleEmailChange}
        />
        {!isEmailValid && <div className="signup-error">올바른 이메일 형식이 아닙니다</div>}
      </div>

      {/* 주소 */}
      <div className="signup-input-group">
        <div className="signup-input-row">
          <input
            className="signup-input"
            placeholder="주소를 입력해주세요"
            value={address}
            readOnly
          />
          <button className="signup-input-address check-button" onClick={handleSearchAddress}>
            주소 찾기
          </button>
        </div>
        <input
          className="signup-input"
          placeholder="상세 주소를 입력해주세요"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
        />
      </div>

      {/* 관심사 */}
      <div className="signup-input-group">
        <label style={{ fontWeight: "bold" }}>관심사 (복수 선택)</label>
        <div className="interest-list">
          {interests.map((interest) => (
            <button
              key={interest}
              type="button"
              className={`interest-button ${
                selectedInterests.includes(interest) ? "selected" : ""
              }`}
              onClick={() => toggleInterest(interest)}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* 가입 버튼 */}
      <button
        className={
          isIdChecked &&
          !isIdDuplicated &&
          isPasswordMatch &&
          isNickNameChecked &&
          !isNickNameDuplicated &&
          isEmailValid
            ? "signup-submit"
            : "signup-submit-unauthorized"
        }
      >
        회원가입
      </button>

      {/* 로그인으로 이동 */}
      <div className="signup-login-link" onClick={() => setActiveTab("signin")}>
        로그인
      </div>
    </div>
  );
}
