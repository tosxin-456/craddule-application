import React, { useRef, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import design from './images/design.png'
import logo from './images/logo.png'
import signUpImage from './images/signup.png'
import { handleTogglePassword, handleToggleCPassword, validatePassword } from './utils/signUpUtils.js';
import { confirmOTP, resetPassword, sendOTP } from './utils/passwordUtils.js';

function Password() {
  const length = 6;
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  const navigate = useNavigate()
  const onClickHandler = () => navigate(`/viewDocument`)
  const onClickHandler1 = () => navigate(`/signup`)
  const [formData, setFormData] = useState({
    email: ''
  });
  const [otpData, setOtpData] = useState('');
  const [form3Data, setForm3Data] = useState({
    newPassword: '',
    confirmNewPassword: ''
  });
  const [otp, setOtp] = useState(Array(length).fill(''));
  const [focusIndex, setFocusIndex] = useState(0);
  const [page, setPage] = useState(1)
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    number: false,
    capital: false,
    special: false,
  });
  const [userId, setUserId] = useState(0)

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


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    if (id === 'newPassword') {
      validatePassword(value, setPasswordValid);
    }
  };

  const handleChange3 = (e) => {
    const { id, value } = e.target;
    setForm3Data({
      ...form3Data,
      [id]: value,
    });
    if (id === 'newPassword') {
      validatePassword(value, setPasswordValid);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.id);

    if (e.target.id === 'sendOtp') {
      sendOTP(formData, setLoading, setPage, navigate, toast);
    }

    if (e.target.id === 'confirmOtp') {
      const otpValue = otp.join(''); // Join OTP array into a single string
      if (otpValue.trim() === '') {
        toast.error('OTP cannot be empty');
        return;
      }
      confirmOTP({ otp: otpValue }, setLoading, setPage, navigate, toast);
    }

    if (e.target.id === 'resetPassword') {
      resetPassword(form3Data, setLoading, setPage, navigate, toast);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim(); // Get the pasted data
    if (pasteData.length === otp.length && /^[0-9]+$/.test(pasteData)) {
      const newOtp = [...otp];
      pasteData.split('').forEach((digit, index) => {
        newOtp[index] = digit;
        inputs.current[index].value = digit;
      });
      setOtp(newOtp);
      inputs.current[otp.length - 1]?.focus(); // Focus the last input
    } else {
      toast.error("Invalid OTP format. Ensure it's the correct length and digits only.");
    }
  };


  const handleResend = (e) => {
    sendOTP(formData, setLoading, setPage, navigate, toast)
  };

  return (
    <>
      <div className='mt-[100px]'></div>
      <div className='w-[90%] m-auto grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl'>
        <div className='bg-[#193FAE] relative hidden md:block '>
          <img src={design} alt="" className="w-[196px] h-[219px] absolute bottom-0 right-0" />
          <img src={design} alt="" className="w-[196px] h-[219px] absolute top-0 left-0 rotate-180" />
          <div className='flex justify-center items-center h-full'>
            <div className='w-fit m-auto'>
              <img src={signUpImage} className='m-auto'></img>
              <h4 className='font-semibold text-white w-3/4 text-center m-auto mt-3'>We help guide your ideas.</h4>
              <p className='text-[16px] text-white w-2/3 text-center m-auto mt-2'>Innovate seamlessly and accomplish your goals.</p>
            </div>
          </div>
        </div>
        <div className='md:p-10 px-10  md:px-20 pt-16 pb-3'>
          <div className='float-right'>
            <div className='flex justify-start items-center gap-[6px] relative -top-8 -right-9'>
              <img src={logo} className='w-[40.12px] h-[40px]'></img>
              <span className='text-[16px] font-semibold'>Craddule</span>
            </div>
          </div>
          <div className={page === 1 ? 'pt-32  ' : 'hidden'}>
            <h3 className='font-bold'>Forgot Password?</h3>
            <p className='texet-[16px] text-black200'>Don’t worry! it happens, we’ll send you a reset code to the email linked to your account.</p>
            <form onSubmit={handleSubmit} id='sendOtp'>
              <div className="mt-20">
                <div className="mt-[16px]">
                  <label htmlFor="email" className='text-p18 font-semibold pb-1 block'>Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    placeholder='Input Email'
                    onChange={handleChange}
                    className="w-full border border-black400 px-3 py-[10px] rounded-full"
                  />
                </div>
              </div>

              <button className={loading ? 'btn loginBtn cursor-not-allowed' : 'btn loginBtn'} type="submit" disabled={loading}>
                {loading && <FontAwesomeIcon icon={faCircleNotch} className='fa-spin' />}
                {!loading && <span>Send Code</span>}
              </button>
            </form>
            <p className='mt-8 font-medium text-[16px]'>Remember Password?<a className='ps-2 no-underline text-[#1B45BF]' href='/login'>Login</a></p>
          </div>
          <div className={page === 2 ? 'pt-32' : 'hidden'}>
            <h3 className="font-bold">Password reset</h3>
            <p className="text-[16px] text-black200">
              Enter the code sent to your email / phone number.
            </p>
            <form onSubmit={handleSubmit} id="confirmOtp">
              <div className="mt-10 md:mt-20">
                <div
                  className="flex justify-center gap-2 md:gap-3 w-full"
                  onPaste={(e) => handlePaste(e)}
                >
                  {otp.map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      className="otp-input w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      maxLength="1"
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onFocus={() => setFocusIndex(index)}
                      ref={(el) => (inputs.current[index] = el)}
                      autoFocus={focusIndex === index}
                    />
                  ))}
                </div>
              </div>

              <button
                className={loading ? 'btn loginBtn cursor-not-allowed' : 'btn loginBtn'}
                type="submit"
                disabled={loading}
              >
                {loading && (
                  <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
                )}
                {!loading && <span>Continue</span>}
              </button>
            </form>

            <p className="mt-8 font-medium text-[16px]">
              Didn’t receive the code?
              <span
                className="ps-2 no-underline text-[#1B45BF] cursor-pointer"
                onClick={() => handleResend()}
              >
                Resend code
              </span>
            </p>
          </div>

          <div className={page === 3 ? 'pt-32' : 'hidden'}>
            <h3 className='font-bold'>Set new password</h3>
            <p className='texet-[16px] text-black200'>Must be at least 8 character</p>
            <form onSubmit={handleSubmit} id='resetPassword'>
              <div className="mt-20">
                <div className="mt-[16px] relative">
                  <label htmlFor="newPassword" className='text-p18 font-semibold pb-1 block'>Enter new password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={form3Data.newPassword}
                    placeholder='Input password'
                    onChange={handleChange3}
                    className="w-full border border-black400 px-3 py-[10px] rounded-full"
                  />
                  <span className="absolute top-9 right-5 cursor-pointer" onClick={() => handleTogglePassword(showPassword, setShowPassword)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className={showPassword ? 'hidden' : 'block'}>
                      <rect width="24" height="24" fill="none" />
                      <path fill="#B0B0B0" d="M2.54 4.71L3.25 4L20 20.75l-.71.71l-3.34-3.35c-1.37.57-2.87.89-4.45.89c-4.56 0-8.5-2.65-10.36-6.5c.97-2 2.49-3.67 4.36-4.82zM11.5 18c1.29 0 2.53-.23 3.67-.66l-1.12-1.13c-.73.5-1.6.79-2.55.79C9 17 7 15 7 12.5c0-.95.29-1.82.79-2.55L6.24 8.41a10.64 10.64 0 0 0-3.98 4.09C4.04 15.78 7.5 18 11.5 18m9.24-5.5C18.96 9.22 15.5 7 11.5 7c-1.15 0-2.27.19-3.31.53l-.78-.78C8.68 6.26 10.06 6 11.5 6c4.56 0 8.5 2.65 10.36 6.5a11.47 11.47 0 0 1-4.07 4.63l-.72-.73c1.53-.96 2.8-2.3 3.67-3.9M11.5 8C14 8 16 10 16 12.5c0 .82-.22 1.58-.6 2.24l-.74-.74c.22-.46.34-.96.34-1.5A3.5 3.5 0 0 0 11.5 9c-.54 0-1.04.12-1.5.34l-.74-.74c.66-.38 1.42-.6 2.24-.6M8 12.5a3.5 3.5 0 0 0 3.5 3.5c.67 0 1.29-.19 1.82-.5L8.5 10.68c-.31.53-.5 1.15-.5 1.82" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className={showPassword ? 'block' : 'hidden'}>
                      <rect width="24" height="24" fill="none" />
                      <path fill="#B0B0B0" d="M11.5 18c4 0 7.46-2.22 9.24-5.5C18.96 9.22 15.5 7 11.5 7s-7.46 2.22-9.24 5.5C4.04 15.78 7.5 18 11.5 18m0-12c4.56 0 8.5 2.65 10.36 6.5C20 16.35 16.06 19 11.5 19S3 16.35 1.14 12.5C3 8.65 6.94 6 11.5 6m0 2C14 8 16 10 16 12.5S14 17 11.5 17S7 15 7 12.5S9 8 11.5 8m0 1A3.5 3.5 0 0 0 8 12.5a3.5 3.5 0 0 0 3.5 3.5a3.5 3.5 0 0 0 3.5-3.5A3.5 3.5 0 0 0 11.5 9" />
                    </svg>
                  </span>
                  <div className="password-validation">
                    <span className={passwordValid.length ? 'valid' : 'invalid'}>
                      Minimum 8 characters
                    </span>
                    <span className={passwordValid.number ? 'valid' : 'invalid'}>
                      At least 1 number
                    </span>
                    <span className={passwordValid.capital ? 'valid' : 'invalid'}>
                      1 capital letter
                    </span>
                    <span className={passwordValid.special ? 'valid' : 'invalid'}>
                      1 special character
                    </span>
                  </div>
                </div>

                <div className="mt-[16px] relative">
                  <label htmlFor="confirmNewPassword" className='text-p18 font-semibold pb-1 block'>Confirm Password</label>
                  <input
                    type={showCPassword ? 'text' : 'password'}
                    id="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange3}
                    className="w-full border border-black400 px-3 py-[10px] rounded-full"
                  />
                  <span className="absolute top-9 right-5 cursor-pointer" onClick={() => handleTogglePassword(showCPassword, setShowCPassword)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className={showCPassword ? 'hidden' : 'block'}>
                      <rect width="24" height="24" fill="none" />
                      <path fill="#B0B0B0" d="M2.54 4.71L3.25 4L20 20.75l-.71.71l-3.34-3.35c-1.37.57-2.87.89-4.45.89c-4.56 0-8.5-2.65-10.36-6.5c.97-2 2.49-3.67 4.36-4.82zM11.5 18c1.29 0 2.53-.23 3.67-.66l-1.12-1.13c-.73.5-1.6.79-2.55.79C9 17 7 15 7 12.5c0-.95.29-1.82.79-2.55L6.24 8.41a10.64 10.64 0 0 0-3.98 4.09C4.04 15.78 7.5 18 11.5 18m9.24-5.5C18.96 9.22 15.5 7 11.5 7c-1.15 0-2.27.19-3.31.53l-.78-.78C8.68 6.26 10.06 6 11.5 6c4.56 0 8.5 2.65 10.36 6.5a11.47 11.47 0 0 1-4.07 4.63l-.72-.73c1.53-.96 2.8-2.3 3.67-3.9M11.5 8C14 8 16 10 16 12.5c0 .82-.22 1.58-.6 2.24l-.74-.74c.22-.46.34-.96.34-1.5A3.5 3.5 0 0 0 11.5 9c-.54 0-1.04.12-1.5.34l-.74-.74c.66-.38 1.42-.6 2.24-.6M8 12.5a3.5 3.5 0 0 0 3.5 3.5c.67 0 1.29-.19 1.82-.5L8.5 10.68c-.31.53-.5 1.15-.5 1.82" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className={showCPassword ? 'block' : 'hidden'}>
                      <rect width="24" height="24" fill="none" />
                      <path fill="#B0B0B0" d="M11.5 18c4 0 7.46-2.22 9.24-5.5C18.96 9.22 15.5 7 11.5 7s-7.46 2.22-9.24 5.5C4.04 15.78 7.5 18 11.5 18m0-12c4.56 0 8.5 2.65 10.36 6.5C20 16.35 16.06 19 11.5 19S3 16.35 1.14 12.5C3 8.65 6.94 6 11.5 6m0 2C14 8 16 10 16 12.5S14 17 11.5 17S7 15 7 12.5S9 8 11.5 8m0 1A3.5 3.5 0 0 0 8 12.5a3.5 3.5 0 0 0 3.5 3.5a3.5 3.5 0 0 0 3.5-3.5A3.5 3.5 0 0 0 11.5 9" />
                    </svg>
                  </span>
                </div>
              </div>

              <button className={loading ? 'btn loginBtn cursor-not-allowed' : 'btn loginBtn'} type="submit" disabled={loading}>
                {loading && <FontAwesomeIcon icon={faCircleNotch} className='fa-spin' />}
                {!loading && <span>Reset password</span>}
              </button>
            </form>
          </div>
          <div className='flex justify-center items-center gap-2 mt-40'>
            <div className={page === 1 ? 'w-[100px] h-[4px] bg-[#193FAE]' : 'w-[100px] h-[4px] bg-[#D9D9D9]'}></div>
            <div className={page === 2 ? 'w-[100px] h-[4px] bg-[#193FAE]' : 'w-[100px] h-[4px] bg-[#D9D9D9]'}></div>
            <div className={page === 3 ? 'w-[100px] h-[4px] bg-[#193FAE]' : 'w-[100px] h-[4px] bg-[#D9D9D9]'}></div>
          </div>
        </div>
      </div>
      {/* <div className='mb-[100px]'></div> */}
      <ToastContainer />
    </>
  );
}

export default Password;
