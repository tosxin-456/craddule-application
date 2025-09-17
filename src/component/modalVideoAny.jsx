import React, { useState, useEffect }from  "react";
import ReactDOM from "react-dom";
import { jwtDecode } from "jwt-decode";
import { HiOutlineArrowSmallRight } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';
import {API_BASE_URL} from '../config/apiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
// import YouTube from 'react-youtube';

export default function ModalVideo({ open, onClose,link}){

    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const [showButton, setShowButton] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');  
    const access_token = localStorage.getItem('access_token');
    
   // const link = videoId.videoLink;
    //const newLink = link.replace('https://youtu.be/', '');
     
    console.log("modal");
    console.log(link);


   
    useEffect(() => {
      // Set loading to true initially
      setLoading(true);
  
      // After ten seconds, set loading to false and show the button
      const timer = setTimeout(() => {
        setLoading(false);
        setShowButton(true);
      }, 10000);
  
      // Clear the timer when the component unmounts to avoid memory leaks
      return () => clearTimeout(timer);
    }, []); 
   
    const handleProceed = async () => {
      // Perform any action here, for example, log the event or update a state
      console.log('Proceed action performed');
      onClose();


      
    
    };
    if(!open) return null
    return ReactDOM.createPortal(
        <>
            <div className="modalOv"></div>
            <div className="modalSt mdN">
            { errorMessage &&  <p className="createER">Project name is empty</p>}
               
            {/* <YouTube videoId={link} /> */}
            
            {/* {showButton && ( */}
            <p onClick={handleProceed} className="closeMMM">Proceed</p>
              
            {/* )} */}
                
                
               
            </div>
        </>,
        document.getElementById('portalH')
    )

}
