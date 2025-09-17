import React, { useState, useEffect, useRef } from 'react';
import {CiCamera, CiShare1, CiFaceSmile, CiUndo, CiMobile1, CiPaperplane, CiCircleRemove, CiFolderOn} from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import ReactDOM from "react-dom";
import p1 from './p1.jpeg';
import wire7 from './wire7.jpeg'
import p2 from './p2.jpeg';
import p3 from './p3.jpeg';
import p4 from './p4.jpeg';
import p5 from './p5.jpeg';
import close from './closeB.png';
import { jwtDecode } from "jwt-decode";
import io from 'socket.io-client';



export default function ChatModal ({open, onClose}) {

  //first dropdown
    // State variables to manage dropdown behavior
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const dropdownRef = useRef(null);
    const projectId = localStorage.getItem('nProject');
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const token = localStorage.getItem('access_token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    const socket = useRef(null);
    const messagesEndRef = useRef(null);
  
    // Function to toggle dropdown visibility
    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
  
    // Function to handle option selection
    const handleOptionSelect = (option) => {
      setSelectedOption(option);
      setIsDropdownOpen(false);
    };

    // State variables to manage dropdown behavior
    const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
    const [selectedOption1, setSelectedOption1] = useState('');
    const dropdownRef1 = useRef(null);

  
    // Function to toggle dropdown visibility
    const toggleDropdown1 = () => {
      setIsDropdownOpen1(!isDropdownOpen1);
    };
  
    // Function to handle option selection
    const handleOptionSelect1 = (option) => {
      setSelectedOption1(option);
      setIsDropdownOpen1(false);
    };

    useEffect(() => {
      // Establish socket connection
      socket.current = io('https://api.cradduleapi.com.ng');

      // Handle incoming messages
      socket.current.on('message', ({ projectId, content, userId, firstName, lastName, createdAt }) => {
          setMessages(prevMessages => [...prevMessages, { projectId, content, userId, firstName, lastName, createdAt }]);
      });

      // Request initial chat history
      socket.current.emit('loadChat', projectId);

      socket.current.on('initialChat', (initialMessages) => {
          setMessages(initialMessages);
          scrollToBottom();
          console.log(initialMessages);
      });

      return () => {
          socket.current.off('message');
          socket.current.disconnect();
      };
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
}, [messages]);

const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
};
  const handleSend = () => {
      if (messageInput.trim() && userId.trim()) {
          const message = {
              projectId,
              content: messageInput,
              userId
          };
          socket.current.emit('message', message);
          setMessageInput('');
      }
  };

  const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
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

// Close dropdown when clicking outside of it 2
useEffect(() => {
  const handleClickOutside = (event) => {
      if (dropdownRef1.current && !dropdownRef1.current.contains(event.target)) {
          setIsDropdownOpen1(false);
      }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
      document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);


    const [isOpen, setIsOpen]= useState(false);
    const navigate = useNavigate()
    const onClickHandler = () => navigate(`/login`)
    if(!open) return null
    return ReactDOM.createPortal(
    <>
  <div className='container-fluid1 chat modalOv3'>
  <div className='col-lg-4'>
  <div className='newMHold'>
  <div className='newMHoldNew'>
    <div className='chatIcon1'>
     {/* <span className='iconS3'><CiMobile1 /></span>
      <span className='iconSs3'>< /></span>*/}
      <img src={close} className='iconSs7' onClick={onClose} type='button'></img>
    </div>
    <div className='chatNew'>

    <div className='chatNewContain'>
    <div style={{height:"90px"}}>
<div className='chatTextT1'>
        <p className='chatText1'>Today {formatDate(new Date())}</p>
    </div>

    {messages.map((message, index) => (    
      <div key={index}>
      {message.userId._id === userId ? (
    <div>
      <div className='chatConNew' style={{justifyContent: "end"}}>
      <div className='chatConTnew'>
        <div className='textBoxNew1'>
          <p className='theChat1New'>{message.content}</p>
             <div className='chatTimeNew'>
      <p className='chatTextNew'>{formatTime(message.createdAt)}</p>
    </div>
          </div>
          </div>
        <img src={p5} className='chatImg3'></img>
      </div>
      </div>

) : (


      <div>
      <div className='chatConNew'>
        <img  src={p1} className='chatImg3'></img>
        <div className='chatConTnew1'>
          {/* <p className='theChat'>Angela Onoja</p> */}
          <div className='textBoxNew2'><p className='theChat1New'>{message.content}</p>
       <div className='chatTimeNew'>
      <p className='chatTextNew'>{formatTime(message.createdAt)}</p>
    </div>
       </div>
        </div>
      </div>
    </div>
    )}
    </div>
  ))}
  <div ref={messagesEndRef} />
    </div>

    </div>




   
        {/* <div className='inputIcon'>      </div>
        <span className='iconS3 sm' type='button'><CiShare1 /></span>
        <div ref={dropdownRef1} className="dropdown4 iconS3 sm">
                <div className={`select4 ${isDropdownOpen1 ? 'select-clicked' : ''}`} onClick={toggleDropdown1}>
                    <span classname="selected">{selectedOption1 || <CiShare1 />}</span>
                    <div class=""></div>
                </div>
                {/* <ul className={`menu5 ${isDropdownOpen1 ? 'menu-open5' : ''}`}>
                    <li type='button'><CiMobile1 /> Photo & Videos</li>
                    <hr className='listMar'></hr>
                    <li type='button'><CiCamera /> Camera</li>
                    <hr className='listMar'></hr>
                    <li type='button'><CiShare1 /> Document </li>
                </ul> 
            </div>
        <span className='iconS3 sm' type='button'><CiFaceSmile/></span>
  
        <input placeholder='Write your message' className='chatInput'></input>
       {/* <div className='chatsButton'>        </div>
        <p className='theChatButton' type='button'>Send</p> */}
        <table className="chatTable">
            <tbody>
                <tr>
                    <td className='iconChatN'>
                    <span className='iconS3' type='button'><CiShare1 /></span>
                    <span className='iconS3' type='button'><CiFaceSmile/></span>
                    </td>
                    <td>
                    <input 
                      placeholder='Write your message' 
                      className='chatInputNew'
                      id="message-input"
                      value={messageInput}
                      onChange={e => setMessageInput(e.target.value)}
                    ></input>
                    </td>
                    <td>
                    <button className="theChatButton1" onClick={handleSend}>Send</button>
                    </td>
                </tr>

            </tbody>
        </table>

  </div>
  </div>
  </div>
  </div>
  </div>
  </>,
  document.getElementById('portal')
  )
}



