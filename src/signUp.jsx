// SignUp.js
import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import design from './images/design.png'
import logo from './images/logo.png'
import signUpImage from './images/signup.png'
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ReactGA from "react-ga4";
import { handleTogglePassword, handleToggleCPassword, validatePassword, createUser } from './utils/signUpUtils.js';
import SignWithGoogle from './GoogleSignUp.jsx';

function SignUp() {
  ReactGA.initialize("G-P450CRB987");
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname,
    title: "Sign Up"
  });

  const [showPassword, setShowPassword] = useState(false);
  // const [showCPassword, setShowCPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // });
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    // cpassword: '',
  });

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phoneNumber: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!passwordValid.length || !passwordValid.number || !passwordValid.capital || !passwordValid.special) {
    //   toast.error('Password does not meet the requirements');
    //   return;
    // }
    createUser(formData, referralCode, setLoading, toast, navigate);
  };

  useEffect(() => {
    const pathname = location.pathname.split('/');
    const lastPath = pathname[pathname.length - 1];
    if (lastPath == 'signup') {
      setReferralCode(0);
    } else {
      setReferralCode(lastPath)
    }
  })

  return (
    <>
      <div className='mt-[100px]'></div>
      <div className='lg:w-[90%] w-[95%] m-auto lg:grid lg:grid-cols-2 bg-white rounded-xl'>
        <div className='bg-[#193FAE] hidden lg:block relative'>
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
        <div className=' lg:p-10 lg:px-20 p-2 px-5 pt-10 lg:pt-16 lg:pb-20'>
          <div className='flex justify-start items-center lg:gap-[6px] relative -top-0 lg:-left-12 -left-10'>
            <img src={logo} className='w-[40.12px] h-[40px]'></img>
            <span className='text-[16px] font-semibold'>Craddule</span>
          </div>
          <div className='pt-3 '>
            <h3 className='font-bold'>Sign Up</h3>
            <p className='texet-[16px] text-black200'>Begin your success story with Craddule</p>
            <SignWithGoogle />
            <div className="flex items-center my-6">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="mx-4 text-gray-500 text-sm font-medium">OR</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="">
                <div className="mt-[16px]">
                  <label htmlFor="firstName" className='text-p18 font-semibold pb-1 block'>First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-black400 px-3 py-[10px] rounded-full"
                  />
                </div>

                <div className="mt-[16px]">
                  <label htmlFor="lastName" className='text-p18 font-semibold pb-1 block'>Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-black400 px-3 py-[10px] rounded-full"
                  />
                </div>

                <div className="mt-[16px]">
                  <label htmlFor="email" className='text-p18 font-semibold pb-1 block'>Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-black400 px-3 py-[10px] rounded-full"
                  />
                </div>

                <div className="mt-[16px]">
                  <label htmlFor="phoneNumber" className='text-p18 font-semibold pb-1 block'>Phone Number</label>
                  <PhoneInput
                    country={'ng'}
                    value={formData.phoneNumber}
                    onChange={handlePhoneChange}
                    inputProps={{
                      name: 'phoneNumber',
                      required: true,
                      autoFocus: true,
                      className: 'custom-input2',
                    }}
                  />
                </div>

                <div className="mt-[16px] relative">
                  <label htmlFor="password" className='text-p18 font-semibold pb-1 block'>Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
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
                  {/* <div className="password-validation">
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
                  </div> */}
                </div>


                {/* <div className="mt-[16px] relative">
                  <label htmlFor="cpassword" className='text-p18 font-semibold pb-1 block'>Confirm Password</label>
                  <input
                    type={showCPassword ? 'text' : 'password'}
                    id="cpassword"
                    value={formData.cpassword}
                    onChange={handleChange}
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
                </div> */}
                <div className='flex justify-start items-center gap-1  mt-3'>
                  <input type="checkbox" name="agree" id="agree" className='cursor-pointer' onChange={(e) => setAgreed(e.target.checked)} />
                  <label htmlFor="agree" className='font-semibold'>I agree to the <a href='/terms&conditions' rel="noopener" target='_blank' className='no-underline text-[#1B45BF]'>Terms & Conditions</a></label>
                </div>
              </div>

              <button className={loading | !agreed ? 'btn loginBtn cursor-not-allowed' : 'btn loginBtn'} type="submit" disabled={loading | !agreed}>
                {loading && <FontAwesomeIcon icon={faCircleNotch} className='fa-spin' />}
                {!loading && <span>Proceed</span>}
              </button>
            </form>

            <p className='mt-8 font-medium text-[16px]'>Already on Craddule?<a className='ps-2 no-underline text-[#1B45BF]' href='/login'>Login</a></p>
          </div>
        </div>
      </div>
      <div className='mb-[200px]'></div>
      <ToastContainer />
    </>
  );
}

export default SignUp;
