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
// import ImageResize from 'quill-image-resize-vue';
import Tooltip from './component/tooltip';
import ImagePopup from './component/cradduleModal';
import axios from 'axios';
import API_BASE_WEB_URL from './config/apiConfigW';
import { useParams } from 'react-router-dom';

// Quill.register("modules/imageResize", ImageResize);



function ShareFeedback ({ htmlContent })  {
    
    const navigate = useNavigate()
    const { id,phase } = useParams();

     const [images, setImages] = useState([]);
     const [types, setTypes] = useState([]);
  const [showImagePopup, setShowImagePopup] = useState(false);
     const [answers, setAnswers] = useState([]);
     const [answersV, setAnswersV] = useState([]);
     const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [combinedAnswer, setCombinedAnswer] = useState('');

  const access_token = localStorage.getItem('access_token');
    const decodedToken = jwtDecode(access_token);
    const userId = decodedToken.userId;

  const questionType ="BusinessCaseBuilder";
  const questionSubType ="Introduction";
  const token = localStorage.getItem('access_token');
  const [value, setValue] = useState('');
  const [formData, setFormData] = useState({
    summary: '',
    });


 
  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const editorRef = useRef(null);



  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const createMarkup = (html) => {
    return { __html: html };
  };
  const insertLink = () => {
    const url = prompt('Enter the link URL:');
    if (url) {
      formatText('createLink', url);
    }
  };

  const insertImage = () => {
    const imageUrl = prompt('Enter the image URL:');
    if (imageUrl) {
      formatText('insertImage', imageUrl);
    }
  };
  const handleInput = () => {
    setCombinedAnswer(editorRef.current.innerHTML);
  };
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== combinedAnswer) {
      editor.innerHTML = combinedAnswer;
    }
  }, [combinedAnswer]);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      // Move the cursor to the end of the content
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editor);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, []);

  const handleHeadingChange = (event) => {
    const heading = event.target.value;
    if (heading) {
      formatText('formatBlock', heading);
    }
  };



  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);

  const toggleHeadingDropdown = () => setShowHeadingDropdown(!showHeadingDropdown);
//   createOrUpdateSummary();
  


 



  const createFeedBack = async () => {
    try {
        setLoading(true);
        console.log(combinedAnswer);
        const summary = combinedAnswer;
        const projectId = id;
      const response = await fetch(API_BASE_URL +'/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ projectId, phase,userId, summary }),
      });
  
      if (response.status === 200) {
        setLoading(false);
        toast.error("can't save");
        const data = await response.json();
        setLoading(false);
        toast.success("Saved");
        console.log(data.message); // Log success message
        ///throw new Error('Failed to create or update summary');
      }else{
        const result = await response.json();
        setLoading(false);
        toast.error(result['error']);
          console.error('Error:', result['error']);
      }

     
  
     
    } catch (error) {
      console.error('Error creating or updating summary:', error.message);
      // Handle error
    }
  };
    return (
        <>

<div className='container-fluid'>
   
    <div className='row'>

      <div className='col-md-2'>
      </div>
        
        <div className='col-md-9'>
            <img src={bci} className='bcA'></img>
        <div className='lenght'>
                    <div className='text-center'>
                <p className='centerH'>Give Feedback</p>
                
                </div>

   
            <button className="btn btn-primary buttonE" onClick={createFeedBack}>
               
             { loading && <FontAwesomeIcon icon={faCircleNotch} className='fa-spin'/>}
                { !loading && <span>Give Feedback</span>}
            </button>
          
            <div class = "break"></div>
            
           
            <div className='container-textBs'>

            <div class="toolbar">
  <button onClick={() => formatText('bold')} type='button'>
          <FontAwesomeIcon icon={faBold} />
        </button>
        <button onClick={() => formatText('italic')} type='button'>
          <FontAwesomeIcon icon={faItalic} />
        </button>
        <button onClick={() => formatText('underline')} type='button'>
          <FontAwesomeIcon icon={faUnderline} />
        </button>
        <button onClick={() => formatText('strikeThrough')} type='button'>
          <FontAwesomeIcon icon={faStrikethrough} />
        </button>
        <button onClick={() => formatText('formatBlock', 'blockquote')} type='button'>
          <FontAwesomeIcon icon={faQuoteRight} />
        </button>
        <button onClick={() => formatText('formatBlock', 'pre')} type='button'>
          <FontAwesomeIcon icon={faCode} />
        </button>
        <button onClick={insertLink} type='button'>
          <FontAwesomeIcon icon={faLink} />
        </button>
      
        <select onChange={(e) => formatText('fontSize', e.target.value)}>
          <option value="">Font Size</option>
          {[...Array(23)].map((_, i) => (
            <option key={i} value={i + 2}>{i + 2}</option>
          ))}
        </select>
        <div className="dropdownM">
          <button className="dropdown-toggle" onClick={toggleHeadingDropdown} type='button'>
            <FontAwesomeIcon icon={faHeading} /> <FontAwesomeIcon icon={faChevronDown} />
          </button>

        
            <select onChange={handleHeadingChange} className="headingDropdown">
                <option value="">Heading</option>
                {[...Array(6)].map((_, i) => (
                  <option key={i} value={`h${i + 1}`}>H{i + 1}</option>
                ))}
          </select>
     
        </div>
        <button onClick={() => formatText('insertOrderedList')} type='button'>
          <FontAwesomeIcon icon={faListOl} />
        </button>
        <button onClick={() => formatText('insertUnorderedList')} type='button'>
          <FontAwesomeIcon icon={faListUl} />
        </button>
        <button onClick={() => formatText('subscript')} type='button'>
          <FontAwesomeIcon icon={faSubscript} />
        </button>
        <button onClick={() => formatText('superscript')} type='button'>
          <FontAwesomeIcon icon={faSuperscript} />
        </button>
        <button onClick={() => formatText('outdent')} type='button'>
          <FontAwesomeIcon icon={faOutdent} />
        </button>
        <button onClick={() => formatText('indent')} type='button'>
          <FontAwesomeIcon icon={faIndent} />
        </button>
        <button onClick={() => formatText('direction', 'rtl')} type='button'>
          <FontAwesomeIcon icon={faAlignRight} />
        </button>
      
  </div>

            
           

  <div
      ref={editorRef}
      contentEditable={true}
      className="editor"
      onInput={handleInput}
    ></div>



              
            
            </div>


           
            
           
           
        </div> 

       
  </div>
  <div className='col-md-2'>
      </div>
  </div>
  <Toaster  position="top-right" />
  </div>
  </>
    );
}

export default ShareFeedback
