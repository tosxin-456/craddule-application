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
// import ImageResize from 'quill-image-resize-vue';
import Tooltip from './component/tooltip';
import ImagePopup from './component/cradduleModal';
import axios from 'axios';
import nspell from 'nspell';
import API_BASE_WEB_URL from './config/apiConfigW';
//  import HeaderIdeationfrom './component/headerIdeation';
// // import SideMenu2 from './component/sideMenu2';
import { useParams } from 'react-router-dom';
import home from './images/HOME.png';
import circle from './images/circle.png';
import feedback from './images/feedback.svg';


function ScrapCreate({ htmlContent }) {

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
  const [scrapName, setScrapName] = useState('');

  const access_token = localStorage.getItem('access_token');
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;

  const questionType = "BusinessCaseBuilder";
  const questionSubType = "Introduction";
  const token = localStorage.getItem('access_token');
  const [value, setValue] = useState('');
  const [misspelledWords, setMisspelledWords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionBoxPosition, setSuggestionBoxPosition] = useState({ top: 0, left: 0 });
  const [selectedWord, setSelectedWord] = useState(null);
  const { id } = useParams();
  console.log("create id " + id)
  const [formData, setFormData] = useState({
    scrap: '',
  });




  const handleEditorChange = () => {
    // Get the current selection range

    const content = editorRef.current.innerHTML;
    const event = { target: { id: 'editor', value: content } };
    // checkSpelling(event.target.innerText);

    // Call the handleChange function to update the state with the new content


    const newText = content || '';
    setScrap(content);
    console.log(content);
    console.log("checking error");
    console.log(newText);
    checkSpelling(newText);

    handleChange(event);


  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setScrap(value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    createOrUpdateScrap();

  };



  useEffect(() => {
    const fetchScrap = async () => {
      try {
        const scrapResponse = await fetch(API_BASE_URL + `/api/scrap/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the request headers
          }
        });

        if (scrapResponse.status === 200) {
          // If summary exists, fetch the summary data
          const dataS = await scrapResponse.json();
          console.log(dataS);
          console.log("scrap " + dataS.data.scrap);
          setScrap(dataS.data.scrap);
          setScrapName(dataS.data.scrapName)
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

    fetchScrap();
  }, [id]);


  const createOrUpdateScrap = async (data) => {
    try {
      setLoading(true);
      console.log(scrap);
      const summary = scrap;
      const response = await fetch(API_BASE_URL + '/api/scrap/scrap/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ scrap }),
      });

      if (response.status === 200) {
        setLoading(false);
        toast.success("Saved");

        ///throw new Error('Failed to create or update summary');
      } else {
        const data = await response.json();
        setLoading(false);
        toast.error("can't save");
        console.log(data.message); // Log success message
      }




    } catch (error) {
      console.error('Error creating or updating scrapbook:', error.message);
      // Handle error
    }
  };




  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    [{ size: [] }],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']
  ];


  const module = {

    toolbar: toolbarOptions
  };

  const reactQuillRef = React.useRef(null);
  const accessToolbar = () => {
    // Check if ref is initialized
    if (reactQuillRef.current) {
      // Get the Quill editor instance
      const quill = reactQuillRef.current.getEditor();

      // Access the toolbar
      const toolbar = quill.getModule('toolbar').handlers.image;
      toolbar.addHandler('image', console.log("image toolbar"));
      //console.log(toolbar.handlers.image);

    } else {
      console.error('ReactQuill ref is not initialized');
    }
  };


  const editorRef = useRef(null);


  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };
  const insertLink = () => {
    const url = prompt('Enter the link URL:');
    if (url) {
      formatText('createLink', url);
    }
  };


  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== scrap) {
      if (scrap) {
        editor.innerHTML = scrap;
      }

    }
  }, [scrap]);

  const loadDictionary = async () => {
    const affResponse = await fetch('/dictionaries/en.aff');
    const aff = await affResponse.text();

    const dicResponse = await fetch('/dictionaries/en.dic');
    const dic = await dicResponse.text();
    return nspell({ aff, dic });
  };
  const checkSpelling = async (text) => {
    if (!text) return;
    console.log("now checking");
    const spell = await loadDictionary();
    const words = text.split(/\s+/);
    const misspelled = words.filter(word => !spell.correct(word));
    console.log(misspelled);
    setMisspelledWords(misspelled);
    console.log("what was passed");
    console.log(misspelledWords);
  };

  const showSuggestions = async (word, rect) => {
    const spell = await loadDictionary();
    const suggestions = spell.suggest(word);
    console.log(word);
    console.log(spell);
    console.log(suggestions);
    setSuggestions(suggestions);
    setSuggestionBoxPosition({ top: rect.bottom, left: rect.left });
  };

  const handleWordClick = (word, rect) => {
    console.log("here sugg");
    console.log(word);
    setSelectedWord(word);
    showSuggestions(word, rect);
  };

  const applySuggestion = (suggestion) => {
    // const editor = editorRef.current;
    // const html = editor.innerHTML;
    // const newHtml = html.replace(new RegExp(`\\b${misspelledWords[0]}\\b`, 'g'), suggestion);
    // editor.innerHTML = newHtml;
    // setScrap(newHtml);
    // setSuggestions([]);

    if (!selectedWord) return; // Check if a word is selected

    const editor = editorRef.current;
    const html = editor.innerHTML;

    // Create a regex to match only the selected word
    const escapedWord = selectedWord.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const newHtml = html.replace(new RegExp(`\\b${escapedWord}\\b`, 'g'), suggestion);

    editor.innerHTML = newHtml;
    setScrap(newHtml);
    checkSpelling(newHtml);
    setSelectedWord(null); // Reset selected word

  };



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


  const handleImagePopup = () => {
    setShowImagePopup(!showImagePopup);
  };

  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);

  const toggleHeadingDropdown = () => setShowHeadingDropdown(!showHeadingDropdown);
  //   createOrUpdateScrap();

  const handleInsertFile = (file) => {
    const newFile = API_BASE_URL + '/images/' + file;
    console.log(newFile);
    setScrap((prevContent) => `${prevContent}<div contenteditable="true" style="display:inline-block; width:30%;"><img src="${newFile}" style="width:100%;" /></div>`);
    // setScrap((prevContent) => `${prevContent}<img src="${newFile}" alt="Inserted File" />`);

  };

  useEffect(() => {
    const fetchSubtypeFiles = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/hub/project/${projectId}`);
        setTypes(response.data.data);
        console.log(response.data.data);

      } catch (error) {
        console.error('Error fetching files:', error);


      }
    };

    fetchSubtypeFiles();
  }, []);


  const [resizingImage, setResizingImage] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [initialX, setInitialX] = useState(null);
  const [initialY, setInitialY] = useState(null);

  function handleImageResizing(event) {
    if (event.type === 'mousemove' && !isResizing) {
      return; // Ignore mousemove event if not resizing
    }

    const imageElement = event.target;
    if (imageElement.nodeName !== 'IMG') {
      return; // Ignore if the target is not an image element
    }

    if (event.type === 'mousedown') {
      startImageResize(event);
    } else if (event.type === 'mousemove') {
      if (isResizing) {
        resizeImage(event, imageElement);
      }
    } else if (event.type === 'mouseup') {
      stopImageResize();
    }
  }

  function startImageResize(event) {
    setIsResizing(true);
    setInitialX(event.clientX);
    setInitialY(event.clientY);
  }

  function resizeImage(event, imageElement) {
    const newWidth = imageElement.offsetWidth + (event.clientX - initialX);
    const newHeight = imageElement.offsetHeight + (event.clientY - initialY);
    imageElement.style.width = `${newWidth}px`;
    imageElement.style.height = `${newHeight}px`;
  }

  function stopImageResize() {
    setIsResizing(false);
    setInitialX(null);
    setInitialY(null);
  }







  const handleMouseDown = (event) => {
    if (event.target.tagName === 'IMG') {
      setResizingImage(event.target);
      setInitialX(event.clientX);
      setInitialY(event.clientY);
      setIsResizing(true);
    }
  };

  const handleMouseMove = (event) => {
    if (isResizing && resizingImage) {
      const deltaX = event.clientX - initialX;
      const deltaY = event.clientY - initialY;
      const newWidth = resizingImage.clientWidth + deltaX;
      const newHeight = resizingImage.clientHeight + deltaY;
      resizingImage.style.width = `${newWidth}px`;
      resizingImage.style.height = `${newHeight}px`;
      setInitialX(event.clientX);
      setInitialY(event.clientY);
    }
  };

  const handleMouseUp = () => {
    if (isResizing) {
      setIsResizing(false);
      setResizingImage(null);
    }
  };

  function handleHome() {
    // Redirect to login page or any other appropriate action
    window.location.href = '/home';
  }

  function handleCrea() {
    // Redirect to login page or any other appropriate action
    window.location.href = '/createScrapName';
  }


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
            <button className="mainBtn" onClick={() => navigate(-1)} >Back</button>
          </div>
          <div className=' m-auto' >
            <p className='text-center font-bold text-[17px] ' > ScrapBook</p>
            <p className='text-center text-[#545454] font-semibold ' >Create note that you can look back to later</p>
          </div>
          <div>
            <img src={home} />

          </div>
        </div>

        <div className="upload-container" style={{ textAlign: 'justify' }}>

          <div className='main-content2'>
            <button className=" text-[#193FAE] bg-white border-[1px] border-[#193FAE] rounded-2xl p-[5px] " onClick={handleCrea} >Create another scrap book</button>


            <div className='bacWHI'>
              <div className='text-center'>
                <p className='centerH' onClick={accessToolbar}>{scrapName}</p>

              </div>

              <form onSubmit={handleSubmit}>
                <button className="mainBtn" type='submit'>
                  {loading && <FontAwesomeIcon icon={faCircleNotch} className='fa-spin' />}
                  {!loading && <span>Save</span>}
                </button>
                {/* <button className="btn btn-primary buttonS">Edit</button> */}
                {/*<p className= "buttonE">Save</p>
            <p className= "buttonS">Edit</p>*/}
                <div class="break"></div>

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
                    <button onClick={handleImagePopup} type='button'>
                      <FontAwesomeIcon icon={faImage} />
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
                    onInput={handleEditorChange}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onClick={(e) => {
                      const selection = window.getSelection();
                      if (!selection.rangeCount) return;

                      const range = selection.getRangeAt(0);
                      const word = range.startContainer.textContent.slice(range.startOffset, range.endOffset);
                      console.log(word);
                      if (misspelledWords.includes(word)) {
                        const rect = e.target.getBoundingClientRect();
                        handleWordClick(word, rect);
                      }
                    }}
                    style={{ whiteSpace: "pre-wrap", minHeight: "200px", border: "1px solid #ccc", padding: "10px" }}
                  />





                  {suggestions.length > 0 && (
                    <div
                      className="suggestion-box"
                      style={{
                        position: 'absolute',
                        top: suggestionBoxPosition.top,
                        left: suggestionBoxPosition.left,
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                      }}
                    >
                      {suggestions.map((suggestion, index) => (
                        <div key={index} onClick={() => applySuggestion(suggestion)}>
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}

                  {showImagePopup &&
                    <ImagePopup


                      onClose={() => setShowImagePopup(false)}
                      types={types}
                      onInsertFile={handleInsertFile}
                    />
                  }

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

export default ScrapCreate
