import { useNavigate } from 'react-router-dom';
import { ROOT_PATH } from '../../../constants';
import './FindId.css';
import { Dispatch, SetStateAction } from 'react';

interface Props {
    setActiveTab: Dispatch<SetStateAction<'signin' | 'signup' | 'findid' | 'findpassword'>>;
}

export default function FindId({ setActiveTab }: Props) {
    const navigate = useNavigate();

    const onLogoClickHandler = () => {
        navigate(ROOT_PATH);
    };

    return (
        <div id="auth-login-container">
            <div className="login-logo-container">
                <div className="login-logo" onClick={onLogoClickHandler}>
                    MoA
                </div>
            </div>
            <div className="login-others-container">
                <div className="login-find-id button" onClick={() => setActiveTab('signin')}>
                    로그인
                </div>{' '}
                |
                <div className="login-find-password button" onClick={() => setActiveTab('findpassword')}>
                    비밀번호 찾기
                </div>{' '}
                |
                <div className="login-register button" onClick={() => setActiveTab('signup')}>
                    회원가입
                </div>
            </div>
        </div>
    );
}
