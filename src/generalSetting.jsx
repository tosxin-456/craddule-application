import React, { useState } from 'react';
import bci from './images/bc.png'; 
import bob from './images/bob.png'; 
import Header from './component/header';
import {API_BASE_URL} from './config/apiConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
//  import HeaderIdeationfrom './component/headerIdeation';
import { jwtDecode } from "jwt-decode";
import BreadCrumb from './component/breadCrumb';
import { validatePassword } from './utils/signUpUtils';




function GeneralSetting ()  {
    const navigate = useNavigate()

    const onClickHandler = () => navigate(`/introduction1`)

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        confirmNewPassword: '',
        newPassword: '',
        currentPassword: '',
      });
    const [passwordValid, setPasswordValid] = useState({
      length: false,
      number: false,
      capital: false,
      special: false,
    });

    const access_token = localStorage.getItem('access_token');
    const decodedToken = jwtDecode(access_token);
    const userId = decodedToken.userId;
    
      const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
          ...formData,
          [id]: value,
        });
        if (id === 'newPassword' || id === 'ConfirmNewPassword') {
          validatePassword(value, setPasswordValid);
        }
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmNewPassword) {
          console.error('New password and confirmation password do not match');
          toast.error('New password and confirmation password do not match');
          return;
        }
        console.log(formData);
        console.log("check before")
        changePassword(formData);
      };
    
      const changePassword = async (data) => {
        setLoading(true);
        console.log("at change");
        try {

          
        console.log(data);
        console.log(JSON.stringify(data));
          const response = await fetch(API_BASE_URL+'/api/user/change-password/'+userId, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`,
            },
            body: JSON.stringify(data),
          });

         // const data = response.json();
    
          if (response.status === 200) {
            console.log(response.status);
            console.log(response);
            const responseData = await response.json(); // Parse JSON response
            console.log(responseData);
     
      //const { token } = responseData; // Access token directly from response
      setLoading(false);
      // Save access token to local storage
    
         
          } else {
            const result = await response.json();
            setLoading(false);
            toast.error(result['error']);
              console.error('Error:', result['error']);
            //console.error('Failed to create User');
          }
        } catch (error) {
          setLoading(false);
          console.error('An error occurred:', error);
        }
      };


    return (
      <>
        <div className=''>
          <Header />
          <BreadCrumb page={'Change Password'}/>

          <div className='w-full m-auto mt-5 bg-white rounded-xl'>
            <div className='p-10 md:px-44 m-auto pt-16 pb-20'>
              <h4 className='font-semibold text-center'>Change Password</h4>
              <h6 className='texet-[16px] text-black200 text-center font-light'>Set a new password</h6>
              <form onSubmit={handleSubmit} className='mt-14'>
                <div className='relative mb-4'>
                  <label htmlFor="password" className='text-[14px] font-light pb-1 block'>Current password</label>
                  <div className='flex gap-5 items-center '>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full border border-black400 px-3 py-[10px] rounded-full"
                        placeholder='Input current password'
                      />
                      <span className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className={showPassword ? 'hidden' : 'block'}>
                          <rect width="24" height="24" fill="none" />
                          <path fill="#B0B0B0" d="M2.54 4.71L3.25 4L20 20.75l-.71.71l-3.34-3.35c-1.37.57-2.87.89-4.45.89c-4.56 0-8.5-2.65-10.36-6.5c.97-2 2.49-3.67 4.36-4.82zM11.5 18c1.29 0 2.53-.23 3.67-.66l-1.12-1.13c-.73.5-1.6.79-2.55.79C9 17 7 15 7 12.5c0-.95.29-1.82.79-2.55L6.24 8.41a10.64 10.64 0 0 0-3.98 4.09C4.04 15.78 7.5 18 11.5 18m9.24-5.5C18.96 9.22 15.5 7 11.5 7c-1.15 0-2.27.19-3.31.53l-.78-.78C8.68 6.26 10.06 6 11.5 6c4.56 0 8.5 2.65 10.36 6.5a11.47 11.47 0 0 1-4.07 4.63l-.72-.73c1.53-.96 2.8-2.3 3.67-3.9M11.5 8C14 8 16 10 16 12.5c0 .82-.22 1.58-.6 2.24l-.74-.74c.22-.46.34-.96.34-1.5A3.5 3.5 0 0 0 11.5 9c-.54 0-1.04.12-1.5.34l-.74-.74c.66-.38 1.42-.6 2.24-.6M8 12.5a3.5 3.5 0 0 0 3.5 3.5c.67 0 1.29-.19 1.82-.5L8.5 10.68c-.31.53-.5 1.15-.5 1.82" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className={showPassword ? 'block' : 'hidden'}>
                          <rect width="24" height="24" fill="none" />
                          <path fill="#B0B0B0" d="M11.5 18c4 0 7.46-2.22 9.24-5.5C18.96 9.22 15.5 7 11.5 7s-7.46 2.22-9.24 5.5C4.04 15.78 7.5 18 11.5 18m0-12c4.56 0 8.5 2.65 10.36 6.5C20 16.35 16.06 19 11.5 19S3 16.35 1.14 12.5C3 8.65 6.94 6 11.5 6m0 2C14 8 16 10 16 12.5S14 17 11.5 17S7 15 7 12.5S9 8 11.5 8m0 1A3.5 3.5 0 0 0 8 12.5a3.5 3.5 0 0 0 3.5 3.5a3.5 3.5 0 0 0 3.5-3.5A3.5 3.5 0 0 0 11.5 9" />
                        </svg>
                      </span>
                    </div>
                </div>
                <div className='relative mb-4'>
                  <label htmlFor="password" className='text-[14px] font-light pb-1 block'>Enter new password</label>
                  <div className='flex gap-5 items-center '>
                      <input
                        type={showPassword1 ? 'text' : 'password'}
                        id="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full border border-black400 px-3 py-[10px] rounded-full"
                        placeholder='Input new password'
                      />
                      <span className="cursor-pointer" onClick={() => setShowPassword1(!showPassword1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className={showPassword1 ? 'hidden' : 'block'}>
                          <rect width="24" height="24" fill="none" />
                          <path fill="#B0B0B0" d="M2.54 4.71L3.25 4L20 20.75l-.71.71l-3.34-3.35c-1.37.57-2.87.89-4.45.89c-4.56 0-8.5-2.65-10.36-6.5c.97-2 2.49-3.67 4.36-4.82zM11.5 18c1.29 0 2.53-.23 3.67-.66l-1.12-1.13c-.73.5-1.6.79-2.55.79C9 17 7 15 7 12.5c0-.95.29-1.82.79-2.55L6.24 8.41a10.64 10.64 0 0 0-3.98 4.09C4.04 15.78 7.5 18 11.5 18m9.24-5.5C18.96 9.22 15.5 7 11.5 7c-1.15 0-2.27.19-3.31.53l-.78-.78C8.68 6.26 10.06 6 11.5 6c4.56 0 8.5 2.65 10.36 6.5a11.47 11.47 0 0 1-4.07 4.63l-.72-.73c1.53-.96 2.8-2.3 3.67-3.9M11.5 8C14 8 16 10 16 12.5c0 .82-.22 1.58-.6 2.24l-.74-.74c.22-.46.34-.96.34-1.5A3.5 3.5 0 0 0 11.5 9c-.54 0-1.04.12-1.5.34l-.74-.74c.66-.38 1.42-.6 2.24-.6M8 12.5a3.5 3.5 0 0 0 3.5 3.5c.67 0 1.29-.19 1.82-.5L8.5 10.68c-.31.53-.5 1.15-.5 1.82" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className={showPassword1 ? 'block' : 'hidden'}>
                          <rect width="24" height="24" fill="none" />
                          <path fill="#B0B0B0" d="M11.5 18c4 0 7.46-2.22 9.24-5.5C18.96 9.22 15.5 7 11.5 7s-7.46 2.22-9.24 5.5C4.04 15.78 7.5 18 11.5 18m0-12c4.56 0 8.5 2.65 10.36 6.5C20 16.35 16.06 19 11.5 19S3 16.35 1.14 12.5C3 8.65 6.94 6 11.5 6m0 2C14 8 16 10 16 12.5S14 17 11.5 17S7 15 7 12.5S9 8 11.5 8m0 1A3.5 3.5 0 0 0 8 12.5a3.5 3.5 0 0 0 3.5 3.5a3.5 3.5 0 0 0 3.5-3.5A3.5 3.5 0 0 0 11.5 9" />
                        </svg>
                      </span>
                    </div>
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
                <div className='relative mb-4'>
                  <label htmlFor="password" className='font-light pb-1 block text-[14px]'>Confirm new password</label>
                  <div className='flex gap-5 items-center '>
                      <input
                        type={showPassword2 ? 'text' : 'password'}
                        id="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        className="w-full border border-black400 px-3 py-[10px] rounded-full"
                        placeholder='Confirm new password'
                      />
                      <span className="cursor-pointer" onClick={() => setShowPassword2(!showPassword2)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className={showPassword2 ? 'hidden' : 'block'}>
                          <rect width="24" height="24" fill="none" />
                          <path fill="#B0B0B0" d="M2.54 4.71L3.25 4L20 20.75l-.71.71l-3.34-3.35c-1.37.57-2.87.89-4.45.89c-4.56 0-8.5-2.65-10.36-6.5c.97-2 2.49-3.67 4.36-4.82zM11.5 18c1.29 0 2.53-.23 3.67-.66l-1.12-1.13c-.73.5-1.6.79-2.55.79C9 17 7 15 7 12.5c0-.95.29-1.82.79-2.55L6.24 8.41a10.64 10.64 0 0 0-3.98 4.09C4.04 15.78 7.5 18 11.5 18m9.24-5.5C18.96 9.22 15.5 7 11.5 7c-1.15 0-2.27.19-3.31.53l-.78-.78C8.68 6.26 10.06 6 11.5 6c4.56 0 8.5 2.65 10.36 6.5a11.47 11.47 0 0 1-4.07 4.63l-.72-.73c1.53-.96 2.8-2.3 3.67-3.9M11.5 8C14 8 16 10 16 12.5c0 .82-.22 1.58-.6 2.24l-.74-.74c.22-.46.34-.96.34-1.5A3.5 3.5 0 0 0 11.5 9c-.54 0-1.04.12-1.5.34l-.74-.74c.66-.38 1.42-.6 2.24-.6M8 12.5a3.5 3.5 0 0 0 3.5 3.5c.67 0 1.29-.19 1.82-.5L8.5 10.68c-.31.53-.5 1.15-.5 1.82" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className={showPassword2 ? 'block' : 'hidden'}>
                          <rect width="24" height="24" fill="none" />
                          <path fill="#B0B0B0" d="M11.5 18c4 0 7.46-2.22 9.24-5.5C18.96 9.22 15.5 7 11.5 7s-7.46 2.22-9.24 5.5C4.04 15.78 7.5 18 11.5 18m0-12c4.56 0 8.5 2.65 10.36 6.5C20 16.35 16.06 19 11.5 19S3 16.35 1.14 12.5C3 8.65 6.94 6 11.5 6m0 2C14 8 16 10 16 12.5S14 17 11.5 17S7 15 7 12.5S9 8 11.5 8m0 1A3.5 3.5 0 0 0 8 12.5a3.5 3.5 0 0 0 3.5 3.5a3.5 3.5 0 0 0 3.5-3.5A3.5 3.5 0 0 0 11.5 9" />
                        </svg>
                      </span>
                  </div>
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
                <div className='flex gap-5 mt-5 m-auto'>
                  <button type='submit' className='py-3 px-12 bg-blue600 rounded-full text-white'>
                    {loading ? <FontAwesomeIcon icon={faCircleNotch} className='fa-spin' /> : <span>Change password</span>}
                  </button>
                  <div className='w-6'></div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <ToastContainer/>
      </>
    );
}

export default GeneralSetting
