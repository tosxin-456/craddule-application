import React, { useState, useRef } from 'react';
import ReactDOM from "react-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../config/apiConfig';

export default function ImageModal({ open, onClose, setImage }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Decode the user ID from the JWT token
  const access_token = localStorage.getItem('access_token');
  const decodedToken = access_token ? jwtDecode(access_token) : null;
  const userId = decodedToken?.userId;

  const onClickHandler = () => navigate(`/pageFrontView`);

  // Return null if modal is not open
  if (!open) return null;

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB size limit
        toast.error('File is too large. Maximum size is 5MB.');
      } else if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type. Please upload an image.');
      } else {
        setSelectedFile(file);
      }
    }
  };
  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('No file selected');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/user/image/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${access_token}`,
          },
        }
      );

      toast.success(response.data.message || 'Image uploaded successfully');
      const imageFile = response.data.image.split('/');
      setImage(imageFile[3]); // Update image state with the filename
      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.response?.data?.error || 'Error uploading image');
    } finally {
      setLoading(false);
    }
  };

  // Trigger file input click
  const handleClick = () => {
    fileInputRef.current.click();
  };

  return ReactDOM.createPortal(
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          className="absolute inset-0"
          onClick={() => {
            setSelectedFile(null);
            onClose();
          }}
        ></div>
        <div className="relative bg-white w-full max-w-md md:max-w-lg lg:max-w-xl rounded-lg p-6 mx-4 md:mx-0 shadow-lg z-10">
          <h4 className="text-center font-semibold text-lg md:text-xl mb-2">Upload Picture</h4>
          <p className="text-center text-sm md:text-base text-gray-500 mb-6">Set a new profile picture</p>
          <form onSubmit={handleUpload} className="space-y-6">
            <div
              className="w-32 h-32 mx-auto border-dashed border-2 border-gray-400 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all"
              onClick={handleClick}
            >
              {selectedFile ? (
                <p className="text-center text-sm text-gray-600">Image Selected</p>
              ) : (
                <p className="text-center text-sm text-gray-600">Click to select image</p>
              )}
              <input
                id="profileImage"
                className="hidden"
                type="file"
                name="image"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className={`py-2 px-6 md:px-8 bg-blue-600 text-white rounded-full focus:outline-none hover:bg-blue-700 transition-all ${(!selectedFile || loading) && 'opacity-50 cursor-not-allowed'
                  }`}
                disabled={!selectedFile || loading}
              >
                {loading ? (
                  <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
                ) : (
                  'Upload'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>,
    document.getElementById('portal')
  );
}
