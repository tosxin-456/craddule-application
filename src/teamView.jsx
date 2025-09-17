import React, { useState,useEffect,useRef } from 'react';
import bci from './images/bc.png';
import Header from './component/header';
import Menu from './component/menu';
import { useNavigate, Link } from 'react-router-dom';
import {API_BASE_URL} from './config/apiConfig';
import { Toaster, toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch,faChevronDown,faBold, faItalic, faUnderline, faStrikethrough, faQuoteRight, faCode, faLink, faImage, faTextHeight, faListOl, faListUl, faSubscript, faSuperscript, faOutdent, faIndent, faAlignRight, faHeading } from '@fortawesome/free-solid-svg-icons';
// import ReactQuill, { Quill } from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import { jwtDecode } from "jwt-decode";
import circle from './images/circle.png';
// import ImageResize from 'quill-image-resize-vue';
import Tooltip from './component/tooltip';
import ImagePopup from './component/cradduleModal';
import axios from 'axios';
import nspell from 'nspell';
import API_BASE_WEB_URL from './config/apiConfigW';
//  import HeaderIdeationfrom './component/headerIdeation';
//import SideMenu2P from './component/sideMenu2P';
import BreadCrumb from './component/breadCrumb';
import feedback from './images/feedback.svg';

function ScrapView ({ htmlContent })  {
    
    const navigate = useNavigate()

     const onClickHandler = () => navigate(`/video`);
     const [images, setImages] = useState([]);
     const [types, setTypes] = useState([]);
  const [showImagePopup, setShowImagePopup] = useState(false);
     const [answers, setAnswers] = useState([]);
     const [answersV, setAnswersV] = useState([]);
     const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const projectId = localStorage.getItem('nProject');
  const [scrap, setScrap] = useState('');

   const access_token = localStorage.getItem('access_token');
  console.log(access_token);
    const decodedToken = jwtDecode(access_token);
    const userId = decodedToken.userId;
    console.log(userId);

  const questionType ="BusinessCaseBuilder";
  const questionSubType ="Introduction";
  const [value, setValue] = useState('');
  const [misspelledWords, setMisspelledWords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionBoxPosition, setSuggestionBoxPosition] = useState({ top: 0, left: 0 });
  const [selectedWord, setSelectedWord] = useState(null); 
  const [team, setTeam] = useState([]);

  const handleDelete = (id) => {
  
    console.log(id);
  };

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const scrapResponse = await fetch(API_BASE_URL + `/api/team/${projectId}`, {
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${access_token}` // Include the token in the request headers
            }
          });
        
        if(scrapResponse.status === 200) {
          // If summary exists, fetch the summary data
          const dataS = await scrapResponse.json();
          console.log(dataS);
          console.log("scrap "+dataS.data.scrap);
          setTeam(dataS.data);
          setLoading(false);
        } else {
            const data = await scrapResponse.json();
            console.log(data);
            setLoading(false);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTeam();
  }, [projectId]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    // Get the correct suffix for the day
    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    const dayWithSuffix = day + getDaySuffix(day);

    return `${dayWithSuffix} ${month} ${year}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Get the correct suffix for the day
  
    return `${time}`;
  };

  const onClickHandler27 = () => navigate(`/teamAdd`);

  const handleViewClick = (id) => {
    navigate(`/createScrap/${id}`); // Navigate to the view page with the ID as a parameter
  };



  const handleDeleteClick = (id) => {
    deleteTeam(id); // Navigate to the view page with the ID as a parameter
  };

  const deleteTeam = async (id) => {
    try {
      const response = await fetch(API_BASE_URL + `/api/team/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        }
    });

        if (!response.ok) {
            throw new Error('Failed to delete');
        }

        console.log("deleted");
        setTeam(team.filter(scrap => scrap._id !== id));
        
    } catch (error) {
        console.error('Error deleting:', error);
        // Handle error, e.g., show an error message
    }
};

  return (
    <>
      <div className="font-[Manrope]">
        <Header />
        <BreadCrumb page="Manage team" />

        <div className="text-center mt-6">
          <h1 className="text-2xl font-bold">Getting your Team</h1>
          <p className="text-gray-600 mt-1">Here you add your teammate</p>
        </div>

        <div
          className="absolute inset-0 mt-[150px] ml-5 sm:ml-[60px] z-[-10] w-[150px] sm:w-[200px] h-[150px] sm:h-[200px] bg-no-repeat bg-cover"
          style={{ backgroundImage: `url(${circle})` }}
        ></div>

        <div className="max-w-6xl mx-auto mt-10 px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Manage team members</h2>
          </div>

          <div className="flex justify-between items-center mt-6">
            <p
              className="text-lg font-medium cursor-pointer"
              onClick={onClickHandler27}
            >
              The Team
            </p>
            <button
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              onClick={onClickHandler27}
            >
              Add members
            </button>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="min-w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100  text-left text-sm uppercase text-gray-600">
                  <th className="p-3">#</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Time Added</th>
                  <th className="p-3">Date Added</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-white">
                {!loading &&
                  team.map((scrap, index) => (
                    <tr
                      key={scrap._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">
                        {scrap.userId.firstName} {scrap.userId.lastName}
                      </td>
                      <td className="p-3">{formatDate(scrap.timeSent)}</td>
                      <td className="p-3">{formatTime(scrap.timeSent)}</td>
                      <td className="p-3">
                        {scrap.teamRole !== "owner" ? (
                          <button
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            onClick={() => handleDeleteClick(scrap._id)}
                          >
                            Remove
                          </button>
                        ) : (
                          <span className="text-gray-400">No Action</span>
                        )}
                      </td>
                    </tr>
                  ))}
                {loading && (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-gray-500">
                      Loading team members. Please wait...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Toaster position="top-right" />

        <div
          className="fixed bottom-0 right-0 w-[250px] h-[250px] z-[-10] bg-no-repeat bg-center bg-cover"
          style={{ backgroundImage: `url(${feedback})` }}
        ></div>
      </div>
    </>
  );}

export default ScrapView
