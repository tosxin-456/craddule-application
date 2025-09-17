import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import folder from './images/file image.svg';
import pdf from './images/pdf.svg';
import { API_BASE_URL } from './config/apiConfig';
import Header from './component/header';
import circle from './images/circle.png';
import home from './images/HOME.png';
import axios from 'axios';
import { Toaster, toast } from 'sonner';

const Subfolder = () => {
  const location = useLocation();
  const { files } = location.state || {};
  const { hubType } = useParams();
  console.log(hubType)
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const access_token = localStorage.getItem('access_token');
  console.log(files)
  const navigate = useNavigate();

  const handleSubmit = () => {
    handleUpload();
  };
  const projectId = localStorage.getItem('nProject');
  const prototypeType = localStorage.getItem('selectedPrototype');

  const handleUpload = async () => {
    setLoading(true);
    for (let index = 0; index < images.length; index++) {
      const selectedFile = images[index];
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('type', hubType);
      formData.append('projectId', projectId);
      formData.append('sequence', index); // Use the index as the sequence number
      formData.append('imageName', selectedFile.name); // Use the file name as the image name

      try {
        const response = await axios.post(`${API_BASE_URL}/api/pitchDeck/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${access_token}`,
          }
        });
        console.log(response);
        toast.success("Image Uploaded");
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <div>
      <Header />
      <div className="container relative">
        <div className="absolute inset-0 mt-[60px] ml-[-20px] z-[-100] bg-no-repeat bg-cover w-[200px] h-[200px]" style={{ backgroundImage: `url(${circle})` }}></div>
        <div className="flex mt-[40px] justify-between items-center w-[100%]">
          <div className="w-fit">
            <button onClick={() => navigate(-1)} className='bg-[#193FAE] px-[30px] py-[5px] text-white rounded-3xl'>
              Back
            </button>
          </div>
          <div>
            <img src={home} alt="Home Icon" />
          </div>
        </div>
        <div className='const' >
          <div className='row' >
            <div className='text-center'>
              <p className='taskHeader'>{hubType}</p>
              <p>Here you can view and upload your files</p>
            </div>
            <div className='modalStTask'>
              <div className="flex flex-wrap justify-between">
                {files.map((fileDetail, index) => {
                  // Determine the file type and set the appropriate image
                  const isPdf = fileDetail.hubFileName.toLowerCase().endsWith('.pdf');
                  const isFolder = fileDetail.hubSubType; // Check if subType exists
                  const fileSrc = isFolder
                    ? folder
                    : isPdf
                      ? pdf
                      : `${API_BASE_URL}/images/${fileDetail.hubFile}`;

                  return (
                    <div key={index} className="w-full sm:w-1/2 md:w-1/4 p-2">
                      <div className="hub-item bg-white rounded-lg p-4 text-center">
                        <img
                          src={fileSrc}
                          alt={isFolder ? "Folder Icon" : isPdf ? "PDF Icon" : fileDetail.hubFileName}
                          className="fol mx-auto"
                          onClick={() => isFolder && console.log(`Open folder: ${fileDetail.hubName}`)} // Handle folder click
                        />
                        <p className="text-gray-600 mt-2 text-[20px]">{fileDetail.hubFileName}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center items-center">
                <button onClick={() => navigate(`/craddule/${hubType}/upload`)} className='submit-button rounded-3xl'>Upload file</button>
                <button onClick={handleSubmit} className='border-solid border-[1px] p-[10px] border-[red] rounded-3xl delete-button ml-4'>Delete</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Subfolder;
