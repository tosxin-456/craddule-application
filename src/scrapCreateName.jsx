import React, { useState, useEffect, useRef } from 'react';
import bci from './images/bc.png';
import Header from './component/header';
import Menu from './component/menu';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from './config/apiConfig';
import { Toaster, toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faChevronDown, faBold, faItalic, faUnderline, faStrikethrough, faQuoteRight, faCode, faLink, faImage, faTextHeight, faListOl, faListUl, faSubscript, faSuperscript, faOutdent, faIndent, faAlignRight, faHeading } from '@fortawesome/free-solid-svg-icons';
// import ReactQuill, { Quill } from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import { jwtDecode } from "jwt-decode";
import home from './images/HOME.png';
import circle from './images/circle.png';
import feedback from './images/feedback.svg';

function ScrapCreateName({ htmlContent }) {

  const navigate = useNavigate()

  const onClickHandler = () => navigate(`/video`);
  const [images, setImages] = useState([]);
  const [types, setTypes] = useState([]);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [answersV, setAnswersV] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const projectId = localStorage.getItem('nProject');
  const [scrap, setScrap] = useState('');

  const access_token = localStorage.getItem('access_token');
  console.log(access_token);
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;
  console.log(userId);

  const questionType = "BusinessCaseBuilder";
  const questionSubType = "Introduction";
  const [value, setValue] = useState('');
  const [misspelledWords, setMisspelledWords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionBoxPosition, setSuggestionBoxPosition] = useState({ top: 0, left: 0 });
  const [selectedWord, setSelectedWord] = useState(null);

  const [formData, setFormData] = useState({
    scrapName: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    scrapCreate(formData);


  };

  const scrapCreate = async (data) => {
    setLoading(true);
    try {
      data.userId = userId;
      data.projectId = localStorage.getItem('nProject');
      console.log(data);
      console.log(JSON.stringify(data));
      const response = await fetch(API_BASE_URL + '/api/scrap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}` // Include the token in the Authorization header
        },
        body: JSON.stringify(data),
      });

      // const data = response.json();

      if (response.status === 200) {
        setLoading(false);

        const responseData = await response.json(); // Parse JSON response
        console.log(responseData);
        console.log(responseData.status);
        console.log(responseData.id);



        // Save access token to local storage

        console.log('successful');


        navigate(`/createScrap/${responseData.id}`)
      } else {
        const result = await response.json();
        setLoading(false);
        toast.error(result['error']);
        console.error('Error:', result['error']);
        //console.error('Failed to create User');
      }
    } catch (error) {
      setLoading(false);
      console.error('An error occurred:', error);
    }
  };



  return (
    <>

      <Header />
      <div
        style={{
          fontFamily: '"Manrope", sans- serif'
        }}
        className='container'>

        <div className="absolute inset-0 mt-[180px] ml-[60px]  z-[-100] bg-no-repeat bg-cover w-[200px] h-[200px] " style={{ backgroundImage: `url(${circle})` }}></div>
        <div className=' flex justify-evenly mt-[50px] ' >
          <div className="mr-auto ">
            <button className="mainBtn" onClick={() => navigate('/start')} >Back</button>
          </div>
          <div className=' m-auto' >
            <p className='text-center font-bold text-[17px] ' > ScrapBook</p>
            <p className='text-center text-[#545454] font-semibold ' >Create note that you can look back to later</p>
          </div>
          <div>
            <img src={home} />

          </div>
        </div>

        <div className="upload-container">

          <div className='main-content2'>

            <div className='bacWHI'>
              <div className='text-start'>
                <p className=' text-start text-[20px] font-bold '>Scrapbook Name</p>
              </div>

              <form onSubmit={handleSubmit}>

                <div class="break"></div>

                <div className='row'>
                  <div className='col-md-12'>
                    <div className='container-textBs'>
                      <p style={{ width: '100%', marginTop: 30, fontSize: 15, fontWeight: 700 }}>Fill in ScrapBook Name</p>
                      <input
                        type="text"
                        id="scrapName"
                        value={formData.cpassword}
                        onChange={handleChange}
                        className="custom-input"
                        style={{ width: '100%' }}
                      />


                    </div>
                  </div>
                </div>
                <div className=' w-fit m-auto' >

                  <button className="mainBtnSave" type='submit'>
                    {loading && <FontAwesomeIcon icon={faCircleNotch} className='fa-spin' />}
                    {!loading && <span>Create</span>}
                  </button>
                </div>



              </form>



            </div>



          </div>
        </div>
        <Toaster position="top-right" />
        <div
          className="fixed bottom-0 right-0 z-[-100] m-0 p-0 w-[250px] h-[250px] bg-no-repeat"
          style={{
            backgroundImage: `url(${feedback})`,
            backgroundSize: '100% 100%', // Stretches image to fit exactly
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            margin: '0',
            padding: '0',
          }}
        ></div>
      </div>
    </>
  );
}

export default ScrapCreateName
