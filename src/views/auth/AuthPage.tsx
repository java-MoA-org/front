import { useEffect, useState } from 'react';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import { Navigate, useNavigate } from 'react-router-dom';
import { ROOT_PATH } from '../../constants';
import AuthPages from '../../types/aliases/auth-page.alias';

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

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
