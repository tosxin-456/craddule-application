import React, { useState } from "react";
import ReactDOM from "react-dom";
import { jwtDecode } from "jwt-decode";
import { HiOutlineArrowSmallRight } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

export default function ModalStart({ open, onClose }) {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    projectName: '',
    projectType: 'craddule sprint',
    industry: '',
    customIndustry: ''
  });
  const [formQData, setFormQData] = useState({
    answer: '',
  });
  const category = "NONE";
  const subCategoryPassed = "NONE";
  const [question, setQuestion] = useState('');
  const [showProjectModal, setShowProjectModal] = useState(true)
  const [showQuestionsModal, setShowQuestionsModal] = useState(false)
  const [error, setError] = useState(" ")
  const access_token = localStorage.getItem('access_token');
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;

  // console.log(userId);

  const handleChange = (e) => {
    if (e.target.id === 'industry' && e.target.value === 'Other') {
      setFormData({
        ...formData,
        [e.target.id]: 'Other'
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleCustomIndustryChange = (e) => {
    setFormData({
      ...formData,
      customIndustry: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If "Other" is selected, use the custom industry value
    const dataToSubmit = { ...formData };
    if (formData.industry === 'Other' && formData.customIndustry) {
      dataToSubmit.industry = formData.customIndustry;
    }
    delete dataToSubmit.customIndustry; // Remove the customIndustry field before submission

    createProject(dataToSubmit);
  };

  const handleProceed = async () => {
    onClose();
    console.log('closing');
  }

  const createProject = async (data) => {
    setLoading(true);
    try {
      // Include user ID in the data object
      data.userId = userId;
      console.log(data);
      console.log(JSON.stringify(data));
      const response = await fetch(API_BASE_URL + '/api/project', {
        method: 'POST',
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


        const responseData = await response.json();
        // setLoading(false);
        const projectId = responseData.data._id;
        localStorage.setItem("nProject", projectId);
        localStorage.setItem("nProjectName", formData.projectName);

        // navigate(`/firstQuestion`);
        console.log(responseData); // Parse JSON response
        console.log('Project created successfully');
        navigate(`/welcome`);
      } else {

        const result = await response.json();
        setLoading(false);
        setErrorMessage(result['error']);
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
        setError(result['error'])
        console.error('Error:', result['error']);
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error);
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
      console.error('An error occurred:', error);
    }
  };


  if (!open) return null
  return ReactDOM.createPortal(
    <>
      <div className="modalOv"></div>
      {showProjectModal &&
        <div className="modalSt ">
          <div className="relative flex justify-end mb-3">
            <span onClick={handleProceed} className="block w-fit p-2 px-3 rounded-md border border-blue50 text-gray900 cursor-pointer">X</span>
          </div>
          <h4 className="text-center text-black400 mb-[30px]">New project name</h4>
          {errorMessage && <p className="createER">{error}</p>}

          <form onSubmit={handleSubmit} className="px-[40px]">
            <div className="">
              {/* <label htmlFor="projectName" className="creT">Create Project</label> */}
              <input
                type="text"
                id="projectName"
                className="w-full p18 py-[20px] ps-[40px] rounded-[15px] bg-blue-50"
                placeholder="Project Name"
                value={formData.projectName}
                onChange={handleChange}
              />
            </div>
            <div className="mt-[20px]">
              <select
                id="industry"
                className="w-full p18 py-[20px] ps-[40px] rounded-[15px] bg-blue-50"
                value={formData.industry}
                onChange={handleChange}
              >
                <option value="">Select an Industry</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Media">Media</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Transportation">Transportation</option>
                <option value="Energy">Energy</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Telecommunications">Telecommunications</option>
                <option value="Construction">Construction</option>
                <option value="Legal Services">Legal Services</option>
                <option value="Government">Government</option>
                <option value="Nonprofit">Nonprofit</option>
                <option value="Aerospace">Aerospace</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Logistics">Logistics</option>
                <option value="Automotive">Automotive</option>
                <option value="Food and Beverage">Food and Beverage</option>
                <option value="Fashion">Fashion</option>
                <option value="Pharmaceuticals">Pharmaceuticals</option>
                <option value="Environmental Services">Environmental Services</option>
                <option value="Insurance">Insurance</option>
                <option value="Sports and Recreation">Sports and Recreation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {formData.industry === 'Other' && (
              <div className="mt-[20px]">
                <input
                  type="text"
                  id="customIndustry"
                  className="w-full p18 py-[20px] ps-[40px] rounded-[15px] bg-blue-50"
                  placeholder="Specify your industry"
                  value={formData.customIndustry}
                  onChange={handleCustomIndustryChange}
                />
              </div>
            )}

            <div className="mt-[20px]">
              <select
                id="businessType"
                className="w-full p18 py-[20px] ps-[40px] rounded-[15px] bg-blue-50"
                value={formData.businessType}
                onChange={handleChange}
              >
                <option value="">Select a Business Type</option>
                <option value="Physical">Physical Product</option>
                <option value="Online">Application / Online Business</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-blue600 text-white rounded-[30px] mt-[40px] py-[14px]" disabled={loading}>
              {loading && <FontAwesomeIcon icon={faCircleNotch} className='fa-spin' />}
              {!loading && <h4 className=''>Continue</h4>}
            </button>
          </form>
        </div>}
    </>,
    document.getElementById('portal')
  )
}