import './SignIn.css';
import { useNavigate } from 'react-router-dom';
import { Dispatch, SetStateAction } from 'react';

// interface: 로그인 컴포넌트 속성 // 
interface Props {
    setActiveTab: Dispatch<SetStateAction<'signin' | 'signup'>>;
  }

// component: 로그인 컴포넌트
export default function SignIn({ setActiveTab }: Props) {
    const navigate = useNavigate();

    return (
        <div id="auth-login-container">
            <div className="login-logo-container">
                <div className="login-logo">MoA</div>
            </div>

            <div className="login-input-container">
                <div className="login-id-input-container">
                    <input className="login-id" placeholder="아이디를 입력해주세요" />
                </div>
                <div className="login-password-input-container">
                    <input className="login-password" type="password" placeholder="비밀번호를 입력해주세요" />
                </div>
            </div>

            <div className="login-button-container">
                <div className="login-login button">로그인</div>

                <div className="login-others-container">
                    <div className="login-find-id button">아이디 찾기</div> |
                    <div className="login-find-password button">비밀번호 찾기</div> |
                    <div className="login-register button" onClick={() => setActiveTab('signup')}>
                        회원가입
                    </div>
                </div>
            </div>

            <div className="login-sns-container">
                <div className="login-sns">SNS 로그인</div>
                <div className="login-sns-buttons-container">
                    <div className="login-kakao button"></div>
                    <div className="login-google button"></div>
                </div>
            </div>
        </div>
    );
}
