import React, { useState, useEffect, useRef } from 'react';
import logo from './../images/logoc.png';
import { CiBellOn, CiUser, CiChat2 } from 'react-icons/ci';
import { MdOutlineBolt } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatToolModal from './chatModal';
import { API_BASE_URL } from '../config/apiConfig';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import ModalStart from './modalTellUs';
import { handleLogout } from '../utils/startUtils';
import NotificationModal from './notificationModal';
import PhasePercentage from './graphs';

const Header = () => {
  const projectId = localStorage.getItem('nProject');
  const projectName = localStorage.getItem('nProjectName');

  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem('access_token');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenT, setIsOpenT] = useState(false);
  const [isOpenN, setIsOpenN] = useState(false);
  const [isOpenQ, setIsOpenQ] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const location = useLocation()

  const [slogan, setSlogan] = useState('');

  const [streak, setStreak] = useState('0');
  const navigate = useNavigate()

  const handleToggleMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleClick = () => {
    setIsToggled(!isToggled); // Toggle the state
    handleToggleMenu();
  };
  const handleToggle = () => {
    setIsOpenQ(!isOpenQ);
  };

  useEffect(() => {

    // Function to check if the token is invalid
    const isTokenInvalid = (token) => {
      if (!token) {
        // No token found, consider it invalid
        return true;
      }

      try {
        // Optionally, decode the token and check its expiration (JWT example)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp < currentTime) {
          // Token is expired
          return true;
        }
      } catch (error) {
        // If there's an error during decoding, assume the token is invalid
        return true;
      }

      return false;
    };

    // Check the token and navigate to login if invalid or absent
    if (isTokenInvalid(token)) {
      // Clear the token from localStorage (optional, in case it's invalid)
      localStorage.removeItem('access_token');

      // Navigate to the login page
      navigate('/login'); // Redirect the user to login
    }
  }, [navigate]);


  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await fetch(`${API_BASE_URL}/api/notification/project/${projectId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          // console.log(data);
          // Filter notifications to only include those that are unread
          const unreadNotifications = data.data.filter(notification => !notification.read);
          setNotifications(unreadNotifications);
        } else {
          console.log('Error fetching notifications:', response.status);

        }
      } catch (err) {
        console.log(err.message)
        //setError(err.message);
      } finally {
        //setLoading(false);
      }
    };

    fetchNotifications();
  }, [projectId, token]);


  useEffect(() => {

    const token = localStorage.getItem('access_token');

    if (!token) {
      // Navigate to login page if token is not found
      navigate('/login');
      return;
    }

  }, [navigate]);
  const handleCloseModal = () => setIsOpenN(false);

  const updateStreak = async () => {
    try {
      //  const projectId = localStorage.getItem('nProject');
      //   const token = localStorage.getItem('access_token'); 
      // const decodedToken = jwtDecode(token);


      const response = await axios.post(API_BASE_URL + '/api/streak/', { userId, projectId });
      console.log(response);
      console.log(response.data.streak);
      setStreak(response.data.streak);

      // setStreak(response.data.streak);
      // setLoading(false);
    } catch (error) {
      console.log(error.response)
    }
  };

  // useEffect(() => {
  //   updateStreak();
  // }, []);

  //first dropdown
  // State variables to manage dropdown behavior
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showDeleteButton1, setShowDeleteButton1] = useState(false);
  const dropdownRef = useRef(null);

  // Function to toggle dropdown visibility

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNotifyClick = () => {
    setShowDeleteButton(!showDeleteButton);
  };


  const handleNotifyClick1 = () => {
    setShowDeleteButton1(!showDeleteButton1);
  };

  // Function to handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside of it 1
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  return (
    <>
      <div className=''>
        <div className='bg-blue600 py-4 px-6 fixed w-[100%] z-[1000]'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-3'>
              <button className="lg:hidden" onClick={handleClick}>
                {isToggled ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24">
                    <path fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12L7 7m5 5l5 5m-5-5l5-5m-5 5l-5 5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 24 24">
                    <rect width="24" height="24" fill="none" />
                    <path fill="#ffff" d="M3 8V7h17v1zm17 4v1H3v-1zM3 17h17v1H3z" />
                  </svg>
                )}
              </button>

              <a href='/home' className='no-underline'>
                <div className='flex justify-start gap-1 items-center'>
                  <img src={logo} alt="" className='w-[40.12px] h-[40px]' />
                  <span className='text-white'>Craddule</span>
                </div>
              </a>
            </div>

            {/* Hamburger Menu for Mobile */}
            <div className='lg:hidden flex items-center'>
              <button onClick={handleToggleMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
                  <rect width="24" height="24" fill="none" />
                  <path fill="#fff" d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Items */}
            {isMobileMenuOpen && (
              <div className='absolute top-[70px] justify-center items-center text-white right-0 w-full bg-blue600 flex flex-col gap-3 p-4 lg:hidden'>
                <div className='flex flex-col items-center gap-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" className='cursor-pointer' width="25" height="25" viewBox="0 0 24 24" onClick={handleToggle}>
                    <rect width="24" height="24" fill="none" />
                    <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M19 8v6m3-3h-6" />
                    </g>
                  </svg>
                  Referrals
                  {isOpenQ && (
                    <ul className="members-dropdown-list">
                      <li>
                        <a onClick={() => navigate('/teamAdd')}>Invite Members</a>
                      </li>
                      <li>
                        <a onClick={() => navigate('/teamView')}>Manage Members</a>
                      </li>
                    </ul>
                  )}
                  <svg xmlns="http://www.w3.org/2000/svg" className='cursor-pointer' width="25" height="25" viewBox="0 0 24 24" onClick={() => setIsOpen(true)}>
                    <rect width="24" height="24" fill="none" />
                    <path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Messages
                  <svg xmlns="http://www.w3.org/2000/svg" className='cursor-pointer' width="25" height="25" viewBox="0 0 24 24" onClick={() => setIsOpenN(true)}>
                    <rect width="24" height="24" fill="none" />
                    <path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9m4.3 13a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  Notifications
                  <svg xmlns="http://www.w3.org/2000/svg" className='cursor-pointer' width="25" height="25" viewBox="0 0 24 24" onClick={() => navigate('/profile')}>
                    <rect width="24" height="24" fill="none" />
                    <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="10" r="3" />
                      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                    </g>
                  </svg>
                  Profiles
                  <PhasePercentage />

                  {location.pathname !== '/start' && ( // Check if not on '/start' page
                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 bg-yellow-500 text-white rounded-[5px] hover:bg-yellow-600"
                    >
                      Logout
                    </button>
                  )}
                </div>
              </div>
            )}


            {/* Desktop Menu */}
            <div className='hidden lg:flex items-center gap-5'>
              <div className='flex items-center gap-3'>
                <PhasePercentage />
                <svg xmlns="http://www.w3.org/2000/svg" className='cursor-pointer' width="25" height="25" viewBox="0 0 24 24" onClick={handleToggle}>
                  <rect width="24" height="24" fill="none" />
                  <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M19 8v6m3-3h-6" />
                  </g>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className='cursor-pointer' width="25" height="25" viewBox="0 0 24 24" onClick={() => setIsOpen(true)}>
                  <rect width="24" height="24" fill="none" />
                  <path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className='cursor-pointer' width="25" height="25" viewBox="0 0 24 24" onClick={() => setIsOpenN(true)}>
                  <rect width="24" height="24" fill="none" />
                  <path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9m4.3 13a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className='cursor-pointer' width="25" height="25" viewBox="0 0 24 24" onClick={() => navigate('/profile')}>
                  <rect width="24" height="24" fill="none" />
                  <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                  </g>
                </svg>
                {isOpenQ && (
                  <ul className="members-dropdown-list">
                    <li>
                      <a onClick={() => navigate('/teamAdd')}>Invite Members</a>
                    </li>
                    <li>
                      <a onClick={() => navigate('/teamView')}>Manage Members</a>
                    </li>
                  </ul>
                )}
              </div>
              <div>
                <button className='px-3 py-2 bg-yellow500 rounded-[5px]' onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
          <ChatToolModal open={isOpen} onClose={() => setIsOpen(false)}>
          </ChatToolModal>
          <NotificationModal open={isOpenN} onClose={handleCloseModal} />
          <ModalStart open={isOpenT}>
          </ModalStart>
        </div>
        <div className='pb-[100px]'></div>
      </div>
    </>
  );

}

export default Header
