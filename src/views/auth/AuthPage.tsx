import { useEffect, useState } from 'react';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ROOT_PATH } from '../../constants';
import AuthPages from '../../types/aliases/auth-page.alias';

export default function AuthPage() {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

    useEffect(() => {
        const tab = searchParams.get('tab');

        // SNS 로그인 성공 후 백에서 userId 쿠키 등을 심었을 때,
        // 그 쿠키가 존재하면 자동으로 회원가입 탭 활성화
        const userId = document.cookie.includes('userId'); // 또는 useCookies 사용 가능

        if (tab === 'signup' || userId) {
            setActiveTab('signup');
        } else {
            setActiveTab('signin');
        }
    }, [searchParams]);

    const navigator = useNavigate();

    const [page, setPage] = useState<AuthPages>('sign-in');

    const onPageChangeHandler = (page: AuthPages) => {
        setPage(page);
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const joinType = localStorage.getItem('joinType');

        if (accessToken) navigator(ROOT_PATH);
        if (joinType) setPage('sign-up');
    }, []);

    return (
        <div>
            {activeTab === 'signin' ? <SignIn setActiveTab={setActiveTab} /> : <SignUp setActiveTab={setActiveTab} />}
        </div>
    );
}
