import { ChangeEvent } from "react";
import "./SignUpInputBox.css";

interface Props {
  label: string;
  value: string;
  placeholder: string;
  type: "text" | "password" | "tel";
  buttonName?: string;
  message?: string;
  isErrorMessage?: boolean;
  isButtonActive?: boolean;
  readOnly?: boolean;
  hint?: string;
  disable?: boolean;

  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onButtonClick?: () => void;
}

export default function SignUpInputBox(props: Props) {
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
    hint,
    disable
  } = props;
  const { onChange, onButtonClick } = props;

  const messageClass = `sign-up-message ${isErrorMessage ? "error" : "success"}`;
  const buttonClass = `sign-up-button ${
    disable ? "disabled" : isButtonActive ? "posible" : "disable"
  }`;

  return (
    <div className="sign-up-input-box">
      <div className="sign-up-label">{label}</div>
      <div className="sign-up-input-contents">
        <div className="sign-up-input-area">
          <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            readOnly={readOnly}
            disabled={disable}
          />
          {onButtonClick && buttonName && (
            <div
              className={buttonClass}
              onClick={() => {
                if (disable || !isButtonActive) return;
                onButtonClick();
              }}
            >
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
