import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from './config/apiConfig';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, User, Calendar, Tag, Upload, HelpCircle, Plus, Palette, Users, Eye } from 'lucide-react';
//import SideMenu2P from './component/sideMenu2P';
import DatePicker from 'react-datepicker';
import { SketchPicker } from 'react-color'; // Importing SketchPicker from react-color
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
//  import HeaderIdeationfrom './component/headerIdeation';
import 'react-datepicker/dist/react-datepicker.css';
// import Select from 'react-select';
// import OrangeCheckbox from './component/checkBox';
import Header from './component/header';
import circle from './images/circle.png';
import home from './images/HOME.png';
import feedback from './images/feedback.svg';


const CreateTask = () => {
  const navigate = useNavigate()

  const projectId = localStorage.getItem('nProject');
  const prototypeType = localStorage.getItem('selectedPrototype');

  const access_token = localStorage.getItem('access_token');
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [showPicker, setShowPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(''); // Initial color value

  // State variables to manage dropdown behavior
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate1, setSelectedDate1] = useState(null);
  const dropdownRef = useRef(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [setError, error] = useState('');

  const [users, setUsers] = useState([]);



  const [loading, setLoading] = useState(false);
  const onClickHandler = () => navigate(`/pageFrontView`)

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Function to handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);

  };

  // Function to handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsDropdownOpen(false);
  };


  //Second Dropdown

  // State variables to manage dropdown behavior
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const [selectedOption1, setSelectedOption1] = useState('');
  const [selectStage, setSelectStage] = useState('');
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

  // Function to handle date selection
  const handleDateSelect1 = (date) => {
    setSelectedDate1(date);
    setIsDropdownOpen1(false);
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

  const handleButtonClick = () => {
    setShowPicker(!showPicker); // Toggle color picker visibility
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.hex); // Update selected color
  };


  const [formData, setFormData] = useState({
    task: '',

  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleChangeStage = (event) => {
    setSelectStage(event.target.value);
  };

  const handleChangeUsers = (selectedOptions) => {
    setSelectedUsers(selectedOptions);
  };
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedU, setIsCheckedU] = useState(false);

  const handleCheckboxChange = (e) => {
    console.log(e.target.checked);
    setIsChecked(e.target.checked);
  };
  const handleCheckboxChangeU = (e) => {
    console.log(e.target.checked);
    setIsCheckedU(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const projectId = localStorage.getItem('nProject');

    const updatedFormData = {
      color: selectedColor,
      startDate: selectedDate,
      endDate: selectedDate1,
      projectId: projectId,
      phase: selectStage,
      users: selectedUsers,
      question: isChecked,
      upload: isCheckedU,
      ...formData,
    };

    console.log(updatedFormData);
    createTask(updatedFormData);


  };



  useEffect(() => {
    fetchTeamMembers();
  }, []);
  const fetchTeamMembers = async () => {
    try {
      console.log(projectId);
      const response = await fetch(`${API_BASE_URL}/api/team/${projectId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}` // Include the token in the Authorization header
        }
      });

      console.log("here");
      console.log("here");
      if (response.status === 200) {
        const data = await response.json();
        console.log(data.data);
        const userOptions = data.data.map(user => ({
          value: user.userId._id,
          label: user.userId.firstName
        }));
        console.log(userOptions);
        setUsers(userOptions);

        console.log(teamMembers)
        setLoading(false);
      } else {
        const result = await response.json();
        console.error('Error:', result['error']);
      }

    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };



  const createTask = async (data) => {
    console.log("here");
    setLoading(true);

    try {
      console.log(data);
      console.log(JSON.stringify(data));
      const response = await fetch(API_BASE_URL + '/api/timeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        setLoading(false);
        console.log(response.status);
        console.log(response);
        // window.location.reload();
        toast.success('Task Added');

        console.log('Task created successfully');
      } else {
        const result = await response.json();
        setLoading(false);
        toast.error(result['error']);
        console.error('Error:', result['error']);
      }
    } catch (error) {
      setLoading(false);
      console.error('An error occurred:', error);
      console.log(error.response.data);
    }
  };
  const phasePaths = [
    "Ideation",
    "ProductDefinition",
    "InitialDesign",
    "ValidatingAndTesting",
    "Commercialization"
  ];



  const ColorPicker = () => (
    <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl p-4">
      <div className="grid grid-cols-6 gap-2 mb-4">
        {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'].map((color) => (
          <button
            key={color}
            type="button"
            className="w-8 h-8 rounded-full border-2 border-gray-200 transition-transform hover:scale-110"
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>
      <input
        type="color"
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
        className="w-full h-10 rounded-lg border border-gray-200"
      />
    </div>
  );

  return (
    <div
      style={{ fontFamily: "Manrope, sans-serif" }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <Header />

      <div className="px-4 pb-8 relative">
        {/* Decorative elements - hidden on mobile for performance */}
        <div className="hidden sm:block absolute top-8 left-0 w-48 h-48 bg-blue-100 rounded-full opacity-30 blur-3xl -z-10"></div>
        <div className="hidden sm:block fixed bottom-0 right-0 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-2xl -z-10"></div>

        {/* Mobile-optimized header */}
        <div className="flex items-center justify-between py-4">
          <button
            onClick={() => navigate('/start')}
            className="flex items-center gap-2 bg-blue600 hover:bg-blue-700 active:bg-blue-800 px-4 py-2.5 text-white rounded-full transition-colors shadow-md text-sm">
            <ArrowLeft size={16} />
            <span className="font-medium">Back</span>
          </button>


          <div className=" ">
            {/* <button
              onClick={() => navigate('/viewTask')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
              <Eye className="w-4 h-4" />
              <span>View Tasks</span>
            </button> */}
          </div>
        </div>

        <div className="text-center flex-1 mx-4">
          <p className="text-xl font-bold text-gray-800">Create Task</p>
          <p className="text-gray-600 text-xs mt-1">Assign tasks to your team</p>
        </div>
        {/* Main Form Card - Mobile optimized */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 space-y-6">

            {/* Task Name - Full width on mobile */}
            <div className="space-y-3">
              <label htmlFor="task" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Tag size={16} className="text-blue-600" />
                Task Name
              </label>
              <input
                type="text"
                id="task"
                value={formData.task}
                onChange={handleChange}
                placeholder="Enter task name..."
                className="w-full border border-gray-200 rounded-xl p-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Color Selection - Mobile optimized */}
            <div className="space-y-3 relative">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Palette size={16} className="text-blue-600" />
                Task Color
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl border-2 border-gray-200 cursor-pointer transition-transform active:scale-95"
                  style={{ backgroundColor: selectedColor }}
                  onClick={handleButtonClick}
                ></div>
                <input
                  className="flex-1 border border-gray-200 rounded-xl p-3.5 bg-gray-50 text-base focus:outline-none"
                  placeholder="Color code"
                  readOnly
                  value={selectedColor}
                />
                <button
                  className="p-3.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 active:bg-blue-200 transition-colors border border-blue-200"
                  onClick={handleButtonClick}
                  type="button"
                >
                  <Palette size={16} />
                </button>
              </div>
              {showPicker && <ColorPicker />}
            </div>

            {/* Task Stage Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar size={16} className="text-blue-600" />
                Task Stage
              </label>
              <select
                value={selectStage}
                onChange={handleChangeStage}
                className="w-full border border-gray-200 rounded-xl p-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white appearance-none"
              >
                <option value="" disabled>Select project stage</option>
                {phasePaths.map((phase) => (
                  <option key={phase} value={phase}>
                    {phase.replace(/([A-Z])/g, ' $1').trim()}
                  </option>
                ))}
              </select>
            </div>

            {/* Team Member Selection - Mobile optimized */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Users size={16} className="text-blue-600" />
                Assign to Team Members
              </label>
              <div className="border border-gray-200 rounded-xl p-3 bg-white min-h-[3rem]">
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedUsers.map((user, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      <User size={12} />
                      <span className="max-w-20 truncate">{user.label}</span>
                      <button
                        type="button"
                        onClick={() => handleChangeUsers(selectedUsers.filter((_, i) => i !== index))}
                        className="ml-1 text-blue-600 hover:text-blue-800 text-lg leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    const user = users.find(u => u.value === e.target.value);
                    if (user && !selectedUsers.find(u => u.value === user.value)) {
                      handleChangeUsers([...selectedUsers, user]);
                    }
                    e.target.value = '';
                  }}
                  className="border-none outline-none bg-transparent text-gray-600 text-base w-full"
                >
                  <option value="">+ Add member</option>
                  {users.map((user) => (
                    <option key={user.value} value={user.value}>
                      {user.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Task Options - Stacked on mobile */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Task Options</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                  />
                  <HelpCircle size={18} className="text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Include Questions</span>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={isCheckedU}
                    onChange={handleCheckboxChangeU}
                    className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                  />
                  <Upload size={18} className="text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Allow File Upload</span>
                </label>
              </div>
            </div>

            {/* Date Selection - Aligned with design */}
            <div className="space-y-6">
              {/* Start Date */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar size={16} className="text-blue-600" />
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateSelect(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* End Date */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar size={16} className="text-blue-600" />
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate1}
                    onChange={(e) => handleDateSelect1(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Selected Range Summary */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Selected Date Range</h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    Start: <span className="font-medium text-gray-800">{selectedDate || 'Not selected'}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    End: <span className="font-medium text-gray-800">{selectedDate1 || 'Not selected'}</span>
                  </p>
                </div>
              </div>
            </div>

            <Toaster position="top-right" />

            {/* Submit Button - Mobile optimized */}
            <div className="pt-4">
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-6 py-4 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-base"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Creating Task...</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Create Task</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default CreateTask;
