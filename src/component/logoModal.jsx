import React, { useState } from 'react';
import cloud from './cloud.png'; 
import ReactDOM from "react-dom";
import {API_BASE_URL} from '../config/apiConfig';
import { Toaster, toast } from 'sonner'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { jwtDecode } from "jwt-decode";




export default function LogoModal ( {open, onClose})  {
  const [isOpen, setIsOpen]= useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const access_token = localStorage.getItem('access_token');
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;
  const navigate = useNavigate()
  const onClickHandler = () => navigate(`/pageFrontView`)
  if(!open) return null

   return ReactDOM.createPortal (
      <>
        <div className='modalOv'>
           <div className='modalSt2'>
                <p className='closeIcon' type='button' onClick={onClose} >X</p>
              <p className='txt2a'>Drag and Drop or Choose from Files</p>
              <hr></hr>
              <div className='uploadImage1'>
              <input 
              className='txtCa'
              type="file" 
              name='image'
              />
              <img src={cloud} className='logoIcon1'></img>
               {/* <p className='txtC'>Drag and drop </p>*/}
               {/* <p className='txt1'>Maximum 50MB file size <br></br>JPG, PNG, or GIF format</p>  */}           
           </div>
          
           <div className='shareImageDiv'><button type="submit" className="btn btn-primary curveImage" disabled={loading}>{ loading && <FontAwesomeIcon icon={faCircleNotch} className='fa-spin'/>}
                { !loading && <span>Upload Image</span>}
                
              </button>
                    </div>
           </div> 
           
             <Toaster  position="top-right" />
        </div>
        </>,
        document.getElementById('portal')
     );
}