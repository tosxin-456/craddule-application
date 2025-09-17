import { GoogleLogin } from '@react-oauth/google';
import { API_BASE_URL } from './config/apiConfig';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorToast from './component/errorComponent';

export default function SignWithGoogle() {
    const [referralCode, setReferralCode] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const pathname = location.pathname.split('/');
        const lastPath = pathname[pathname.length - 1];

        if (lastPath === 'signup') {
            setReferralCode('');
        } else {
            setReferralCode(lastPath);
        }
    }, [location]);

    const handleSuccess = async (credentialResponse) => {
        try {
            const url = referralCode
                ? `${API_BASE_URL}/api/user/auth/google/${referralCode}`
                : `${API_BASE_URL}/api/user/auth/google`;

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ credential: credentialResponse.credential }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Server error: ${res.status}`);
            }

            const data = await res.json();
            localStorage.setItem('access_token', data.data.access_token);
            
            setError('');
            navigate('/home');

        } catch (error) {
            console.error('❌ Login error:', error);
            setError(error.message || 'Login failed. Please try again.');
        }
    };

    const handleError = () => {
        setError('Google login was cancelled or failed. Please try again.');
    };

    const clearError = () => {
        setError('');
    };

    return (
        <>
            <ErrorToast
                error={error}
                onClose={clearError}
                duration={6000}
            />

            <div className="flex justify-center mt-6">
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                />
            </div>
        </>
    );
}
