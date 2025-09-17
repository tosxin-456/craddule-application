import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Toaster, toast } from 'sonner'
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from './config/apiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom';
import logo from './images/logo.png';
import loginImage from './images/login.png';
import design from './images/design.png';
import { ToastContainer } from 'react-toastify';

function LoginStart() {

  //useEffect(() => {
  //     const wow = new WOW.WOW();
  //     wow.init();
  //   }, []);

  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const link = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;
  const match = link.match(/\/start\/(.+)/);
  const uniqueCode = match ? match[1] : '';
  const { id } = useParams();
  // console.log('Unique Code:', uniqueCode);
  const [rememberMe, setRememberMe] = useState(false)
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate()
  const onClickHandler = () => navigate(`/signup/start/` + uniqueCode);



  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    "https://craddule.com/bg4.jpg",
    "https://craddule.com/bg3.jpg",
    "https://craddule.com/bg5.jpg",
  ];



  //Start
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    link: link,
    email: '',
    password: '',
    uniqueCode: id,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    login(formData);


  };

  const login = async (data) => {
    setLoading(true);
    try {


      console.log(data);
      console.log(JSON.stringify(data));
      const response = await fetch(API_BASE_URL + '/api/team/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // const data = response.json();

      if (response.status === 200) {
        console.log(response.status);
        console.log(response);
        const responseData = await response.json(); // Parse JSON response


        const { token } = responseData; // Access token directly from response
        setLoading(false);
        // Save access token to local storage

        console.log('Logged successfully');
        const userStatus = responseData.user.status
        console.log(responseData.user.status);
        if (userStatus === 'deactivated') {
          toast.error("This Account as been Deactivated");
        } else {
          localStorage.setItem('access_token', token);
          console.log('Access Token:', token);
          localStorage.setItem('access_token', token);
          navigate(`/home`);
        }

        // navigate(`/introduction1`)
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <>
      <div className='mt-[100px]'></div>
      <div className='w-[90%] m-auto lg:grid lg:grid-cols-2 bg-white rounded-xl'>
        {/* Left Section */}
        <div className='lg:p-10 lg:px-20 p-5 px-12 pt-10 lg:pt-16 lg:pb-20'>
          <div className='flex justify-start items-center lg:gap-[6px] relative -top-8 lg:-left-12 -left-10'>
            <img src={logo} className='w-[40.12px] h-[40px]' alt="Craddule Logo"></img>
            <span className='text-[16px] font-semibold'>Craddule</span>
          </div>
          <div>
            <h3 className='font-bold'>Welcome back!</h3>
            <p className='text-[16px] text-black200'>Continue your growth with Craddule!</p>
            <form onSubmit={handleSubmit} className='mt-14'>
              <div className="mb-8">
                <label htmlFor="email" className='text-p18 font-semibold pb-1'>Email</label>
                <input
                  type="text"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-black400 px-3 py-[10px] rounded-full"
                />
              </div>
              <div className='relative'>
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
              </div>
              <div className='flex justify-between items-center text-[16px] mt-3'>
                <div className='flex justify-start items-center gap-1'>
                  <input type="checkbox" name="remember_me" id="rememberMe" className='cursor-pointer' checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <label htmlFor="remember-me" className='font-semibold'>Remember me</label>
                </div>
                <div>
                  <a href='password' className='no-underline'><span className='text-[#1B45BF] font-semibold'>Forgot password?</span></a>
                </div>
              </div>
              <button type="submit" className='btn loginBtn' disabled={loading}>
                {loading ? <FontAwesomeIcon icon={faCircleNotch} className='fa-spin' /> : <span>Login</span>}
              </button>
            </form>
            <p className='mt-8 font-medium text-[16px]'>Not registered yet?<a className='ps-2 no-underline text-[#1B45BF] cursor-pointer' onClick={onClickHandler}>Create an Account</a></p>
          </div>
        </div>

        {/* Right Section */}
        <div className='hidden lg:flex items-center bg-[#193FAE] relative'>
          <div className='absolute inset-0'>
            <img src={design} alt="" className="absolute w-[196px] h-[219px] bottom-0 right-0 object-contain" />
            <img src={design} alt="" className="absolute w-[196px] h-[219px] top-0 left-0 object-contain rotate-180" />
          </div>
          <div className='w-full text-center'>
            <img src={loginImage} alt="Login Illustration" className='m-auto' />
            <h4 className='font-semibold text-white text-lg w-2/3 mx-auto mt-4'>Turn your ideas into reality</h4>
            <p className='text-white text-[16px] w-2/3 mx-auto'>We know that your ideas are unique. We provide requisite tailored tools.</p>
          </div>
        </div>

        <ToastContainer />
      </div>
    </>

  );
}

export default LoginStart;
