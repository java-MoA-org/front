import { ChangeEvent } from 'react';
import './SignUpInputBox.css';

interface Props {
    label: string;
    value: string;
    placeholder: string;
    type: 'text' | 'password' | 'tel';
    buttonName?: string;
    message: string;
    isErrorMessage?: boolean;
    isButtonActive?: boolean;
    readOnly?: boolean;
    hint?: string;

    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onButtonClick?: () => void;
}

export default function SignUpInputBox(props: Props) {
    const { label, value, placeholder, type, buttonName, message, isErrorMessage, isButtonActive, readOnly, hint } =
        props;
    const { onChange, onButtonClick } = props;

    const messageClass = `message ${isErrorMessage ? 'error' : 'success'}`;
    const buttonClass = `button ${isButtonActive ? 'posible' : 'disable'}`;

    return (
        <div className="input-box">
            <div className="label">{label}</div>
            <div className="input-contents">
                <div className="input-area">
                    <input
                        type={type}
                        value={value}
                        placeholder={placeholder}
                        onChange={onChange}
                        readOnly={readOnly}
                    />
                    {onButtonClick && buttonName && (
                        <div
                            className={buttonClass}
                            onClick={() => {
                                if (!isButtonActive) return;
                                onButtonClick();
                            }}
                        >
                            {buttonName}
                        </div>
                    )}
                </div>
                <div className="hint">{hint}</div>
                <div className={messageClass}>{message}</div>
            </div>
        </div>
    );
}
