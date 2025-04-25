import React, { ChangeEvent } from "react";
import "./style.css";

// interface: 공통 인풋 박스 컴포넌트 속성 //
interface Props {
  label: string;
  value: string;
  placeholder: string;
  type: "text" | "password" | "textarea";
  buttonName?: string;
  message: string;
  isErrorMessage?: boolean;
  isButtonActive?: boolean;
  readOnly?: boolean;
  disable?: boolean;
  hint?: string;
  maxLength?: number;

  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onButtonClick?: () => void;
}

// component: 공통 인풋 박스 컴포넌트 //
export default function InputBox(props: Props) {
  const {
    label,
    value,
    placeholder,
    type,
    buttonName,
    message,
    isErrorMessage,
    isButtonActive,
    readOnly,
    disable,
    hint,
    maxLength
  } = props;
  const { onChange, onButtonClick } = props;

  // variable: 메세지 클래스 //
  const messageClass = `message ${isErrorMessage ? "error" : "success"}`;
  // variable: 버튼 클래스 //
  const buttonClass = `button ${isButtonActive ? "second" : "disable"}`;

  // render: 공통 인풋 박스 컴포넌트 //
  return (
    <div className="input-box">
      <div className="label">{label}</div>
      <div className="input-contents">
        <div className="input-area">
          {type === "textarea" ? (
            <textarea
              value={value}
              placeholder={placeholder}
              onChange={onChange as any} // 타입 오류 피하기
              readOnly={readOnly}
              disabled={disable}
              className="textarea" // height 적용 위해 클래스 부여
              maxLength={maxLength}
            />
          ) : (
            <input
              type={type}
              value={value}
              placeholder={placeholder}
              onChange={onChange}
              readOnly={readOnly}
              disabled={disable}
            />
          )}
          {onButtonClick && buttonName && (
            <div className={buttonClass} onClick={onButtonClick}>
              {buttonName}
            </div>
          )}
        </div>
        <div className="sign-up-hint">{hint}</div>
        <div className={messageClass}>{message}</div>
      </div>
    </div>
  );
}
