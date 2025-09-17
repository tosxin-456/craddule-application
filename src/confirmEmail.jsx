import { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from './config/apiConfig';
import { jwtDecode } from 'jwt-decode';
import logo from './images/logo.png';

const EmailConfirmation = () => {
    const length = 6;
    const [loading, setLoading] = useState(false);
    const access_token = localStorage.getItem('access_token');
    const decodedToken = access_token ? jwtDecode(access_token) : null;
    const userId = decodedToken?.userId;
    const inputs = useRef([]);
    const [otp, setOtp] = useState(Array(length).fill(''));
    const [focusIndex, setFocusIndex] = useState(0);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [successMessage, setSuccessMessage] = useState('');

    // Extract userId from URL on component mount
    useEffect(() => {
        // Get email from localStorage if available
        const email = localStorage.getItem('userEmail');
        if (email) {
            setEmailAddress(email);
        }
    }, []);

    // Countdown timer for resend button
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (countdown === 0) {
            setResendDisabled(false);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    // Handle OTP input change
    const handleOtpChange = (e, index) => {
        const { value } = e.target;

        // Allow only digits
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value || ''; // Clear value on backspace
            setOtp(newOtp);

            // Move focus to the next input if input is valid and not empty
            if (value && index < otp.length - 1) {
                inputs.current[index + 1].focus();
            }
        }
    };

    // Handle backspace key in OTP input
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            const newOtp = [...otp];

            // Clear current input and move focus to the previous input if empty
            if (otp[index] === '') {
                if (index > 0) {
                    inputs.current[index - 1].focus();
                }
            } else {
                // Clear the current input value
                newOtp[index] = '';
                setOtp(newOtp);
            }
        }
    };

    // Handle paste for OTP fields
    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').trim();
        if (pasteData.length === otp.length && /^[0-9]+$/.test(pasteData)) {
            const newOtp = [...otp];
            pasteData.split('').forEach((digit, index) => {
                newOtp[index] = digit;
                inputs.current[index].value = digit;
            });
            setOtp(newOtp);
            inputs.current[otp.length - 1]?.focus();
        } else {
            setError("Invalid OTP format. Ensure it's the correct length and digits only.");
            setTimeout(() => setError(''), 3000);
        }
    };

    // Send OTP to the backend
    const sendOTP = async () => {
        if (!emailAddress && !userId) {
            setError('Email address or user ID is required');
            setTimeout(() => setError(''), 3000);
            return;
        }
        setLoading(true);
        try {
            const data = {
                email: emailAddress,
                userId: userId
            };

            const response = await fetch(`${API_BASE_URL}/api/user/otp/confirm-email/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            setLoading(false);

            if (response.status === 200) {
                const responseData = await response.json();
                const { userId } = responseData.data;
                localStorage.setItem('userId', userId);

                // Show success message
                setSuccessMessage('Verification code sent successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);

                // Disable resend button and start countdown
                setResendDisabled(true);
                setCountdown(60); // 60 seconds countdown
            } else {
                const { error } = await response.json();
                console.error(error);
                setError(error || 'Failed to send OTP');
            }
        } catch (error) {
            setLoading(false);
            console.error('An error occurred:', error);
            setError('Network error. Please try again.');
        }
    };

    // Handle OTP verification
    const handleVerify = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== length) {
            setError(`Please enter all ${length} digits`);
            setTimeout(() => setError(''), 3000);
            return;
        }

        setLoading(true);

        try {
            // Call your API to verify OTP
            const response = await fetch(`${API_BASE_URL}/api/user/otp/confirm-email/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
                body: JSON.stringify({ otp: otpValue }),
            });

            setLoading(false);

            if (response.status === 200) {
                setVerified(true);

                // Redirect to login after successful verification
                setTimeout(() => {
                    window.location.href = '/home';
                }, 5000); // Increased time to enjoy the animation
            } else {
                const { error } = await response.json();
                setError(error || 'Failed to verify OTP');
            }
        } catch (error) {
            setLoading(false);
            console.error('An error occurred:', error);
            setError('Network error. Please try again.');
        }
    };

    // Handle resend OTP
    const handleResend = () => {
        if (loading || resendDisabled) return;
        
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                {/* Left Panel - Only visible on md screens and above */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 relative hidden md:block">
                    <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500 opacity-20 rounded-br-full"></div>
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500 opacity-20 rounded-tl-full"></div>
                    <div className="flex justify-center items-center h-full text-white">
                        <div className="text-center p-8">
                            <div className="w-48 h-48 bg-blue-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-inner shadow-blue-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h4 className="text-2xl font-semibold">We help guide your ideas.</h4>
                            <p className="mt-2 text-blue-100">Innovate seamlessly and accomplish your goals.</p>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Content */}
                <div className="p-8 md:p-10">
                    <div className="flex justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <img src={logo} alt="Craddule Logo" className="w-[40.12px] h-[40px]" />
                            <span className="text-lg font-semibold text-gray-800">Craddule</span>
                        </div>
                    </div>

                    {/* Success message */}
                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md transition-opacity duration-500 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {successMessage}
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md transition-opacity duration-500 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {!verified ? (
                        <div className="mt-10">
                            <h3 className="text-2xl font-bold mb-2 text-gray-800">Verify your email</h3>
                            <p className="text-gray-600 mb-8">
                                Enter the verification code sent to your email address to complete your registration.
                            </p>

                            <div className="my-8">
                                <div
                                    className="flex justify-center gap-2 md:gap-3 w-full"
                                    onPaste={(e) => handlePaste(e)}
                                >
                                    {otp.map((_, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            className={`w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl border-2 border-gray-300 rounded-md transition-all duration-300 
                                                ${focusIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'hover:border-gray-400'} 
                                                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
                                            maxLength="1"
                                            value={otp[index]}
                                            onChange={(e) => handleOtpChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            onFocus={() => setFocusIndex(index)}
                                            ref={(el) => (inputs.current[index] = el)}
                                            autoFocus={index === 0}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                className={`w-full py-3 mt-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold shadow-md transition-all duration-300 
                                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:-translate-y-0.5'}`}
                                onClick={handleVerify}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verifying...
                                    </span>
                                ) : (
                                    <span>Verify Email</span>
                                )}
                            </button>

                            <p className="mt-8 font-medium text-center text-gray-700">
                                Didn't receive the code?
                                <span
                                    className={`ml-2 ${resendDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-blue-700 cursor-pointer hover:underline'}`}
                                    onClick={() => !resendDisabled && handleResend()}
                                >
                                    {resendDisabled ? `Resend in ${countdown}s` : "Resend code"}
                                </span>
                            </p>
                        </div>
                    ) : (
                        <div className="mt-10 text-center">
                            <div className="relative">
                                {/* Animated checkmark with ripple */}
                                <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
                                    {/* Ripple animation */}
                                    <div className="absolute inset-0 scale-0 bg-green-200 rounded-full animate-ping opacity-70"></div>
                                    <div className="absolute inset-0 scale-50 bg-green-200 rounded-full animate-pulse opacity-50"></div>

                                    {/* Animated checkmark */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>

                                {/* Confetti animation */}
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                                    <div className="w-2 h-8 bg-blue-500 rounded-full animate-fall origin-top" style={{ animationDelay: '0.1s', animationDuration: '2s' }}></div>
                                    <div className="w-2 h-6 bg-green-500 rounded-full animate-fall origin-top" style={{ animationDelay: '0.3s', animationDuration: '1.7s' }}></div>
                                    <div className="w-2 h-7 bg-purple-500 rounded-full animate-fall origin-top" style={{ animationDelay: '0.5s', animationDuration: '1.5s' }}></div>
                                    <div className="w-2 h-5 bg-yellow-500 rounded-full animate-fall origin-top" style={{ animationDelay: '0.7s', animationDuration: '1.8s' }}></div>
                                    <div className="w-2 h-4 bg-pink-500 rounded-full animate-fall origin-top" style={{ animationDelay: '0.2s', animationDuration: '1.9s' }}></div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-2 text-gray-800">Email Verified!</h3>
                            <p className="text-gray-600 mb-8">
                                Your email has been successfully verified. You'll be redirected to the home page shortly.
                            </p>

                            {/* Progress bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-8 overflow-hidden">
                                <div className="bg-green-500 h-2 rounded-full animate-progress origin-left"></div>
                            </div>
                        </div>
                    )}

                    {/* Progress indicators stay at bottom */}
                    <div className="flex justify-center items-center gap-2 mt-16">
                        <div className="w-24 h-1 rounded-full bg-blue-700"></div>
                        <div className="w-24 h-1 rounded-full bg-gray-300"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Add these styles to your CSS or add a style tag to your component
const styleTag = document.createElement('style');
styleTag.innerHTML = `
    @keyframes fall {
        0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateY(300px) rotate(360deg); opacity: 0; }
    }
    
    @keyframes progress {
        0% { width: 0%; }
        100% { width: 100%; }
    }
    
    .animate-fall {
        animation: fall 2s ease-in-out forwards;
    }
    
    .animate-progress {
        animation: progress 5s linear forwards;
    }
`;
document.head.appendChild(styleTag);

export default EmailConfirmation;