import React, { Component, useState, useEffect } from "react";
import cloud from './cloud.png'; 
import ReactDOM from "react-dom";
import {API_BASE_URL} from '../config/apiConfig';
import { Toaster, toast } from 'sonner'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { jwtDecode } from "jwt-decode";




export default function PresentModal ( {open, onClose})  {
   const [isOpen, setIsOpen]= useState(false);
   const [selectedFile, setSelectedFile] = useState(null);
   const [loading, setLoading] = useState(false);

 
  const [formData, setFormData] = useState({
    imageName: '',
    sequence: '',
  });
 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
 
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
 
    
    createPrototype(formData);
 
   
  };
 
  const createPrototype = async (data) => {
    setLoading(true);
    console.log(formData)
    handleUpload(formData)
  }
 
   const access_token = localStorage.getItem('access_token');
   const decodedToken = jwtDecode(access_token);
   const userId = decodedToken.userId;
   const navigate = useNavigate()
   const onClickHandler = () => navigate(`/pageFrontView`)
   if(!open) return null
 
 
    
   const handleFileChange = (e) => {
     setSelectedFile(e.target.files[0]);
   };
 
   const handleUpload = async (data) => {
    console.log(data);
 
    
 
     if (!selectedFile) {
       console.error('No file selected');
       return;
     }
 
 
     
 console.log(selectedFile);
 const projectId = localStorage.getItem('nProject');
 
     const formData = new FormData();
     formData.append('image', selectedFile);
 
     Object.keys(data).forEach(key => {
       formData.append(key, data[key]);
     }); 
    formData.append("type", "3D Design" );
    formData.append("subtype", "3D Angle Presentation" );
    console.log("front")
    formData.append("projectId", projectId );
     console.log("data");
     console.log(formData);
     
 
     try {
       const response = await axios.post(API_BASE_URL+'/api/prototype/upload', formData, {
         headers: {
           'Content-Type': 'multipart/form-data',
           'Authorization': `Bearer ${access_token}`,
         }
       });
       console.log(response);
       // Handle successful upload
       // Reload the page after successful upload
      window.location.reload();
     } catch (error) {
       console.error('Error uploading image:', error);
       console.log(error.response);
       // Handle error
     }
   };


   
   return ReactDOM.createPortal (
      <>
        <div className='modalOv' >
           <div className='modalSt'>
                <p className='closeIcon' type='button' onClick={onClose} >X</p>
              <p className='txt2'>Upload Images</p>
              <hr></hr>

              <form onSubmit={handleSubmit}>

              <div className='uploadLogo'>
                <div className='ProtoImage'>
              <input 
              className='typeInput'
              type="text" 
              id='imageName'
              value= {formData.imageName}
              placeholder="Enter image name"
               onChange={handleChange}// Update imageName state on input change
              />
               <input 
              className='typeInput'
              type="number" 
              id='sequence'
              value= {formData.sequence}
              placeholder="Enter the image number"
              onChange={handleChange} // Update imageName state on input change
              />
              
              </div>
              <input 
              className='txtCa'
              type="file" 
              id='image'
              onChange={handleFileChange}
              />
              <img src={cloud} className='logoIcon'></img>
                <p className='txt'>Drag and drop your Image here</p>
               {/*} <p className='txt1'>Maximum 50MB file size</p>
                <p className='txt1'>JPG, PNG, or GIF format</p>*/}
             <button type="submit" className="btn btn-primary curveLogo" disabled={loading}>
              { loading && <FontAwesomeIcon icon={faCircleNotch} className='fa-spin'/>}
              { !loading && <span>Upload Images</span>}
            </button>
            </div>
           </form>

           </div>  
           <Toaster  position="top-right" />        
        </div>
        </>,
        document.getElementById('portal')
     );
}