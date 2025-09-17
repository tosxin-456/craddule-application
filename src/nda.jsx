import React, { useState, useEffect, useRef } from "react";
import bci from "./images/bc.png";
import Header from "./component/header";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "./config/apiConfig";
import { Toaster, toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleNotch,
  faChevronDown,
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faQuoteRight,
  faCode,
  faLink,
  faImage,
  faTextHeight,
  faListOl,
  faListUl,
  faSubscript,
  faSuperscript,
  faOutdent,
  faIndent,
  faAlignRight,
  faHeading
} from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import ImageResize from "quill-image-resize-vue";
import Tooltip from "./component/tooltip";
import ImagePopup from "./component/cradduleModal";
import axios from "axios";
import nspell from "nspell";
import { useParams } from "react-router-dom";
import home from "./images/HOME.png";

function getFormattedDate() {
  const date = new Date();

  // Get the day
  const day = date.getDate();

  // Add the appropriate suffix (st, nd, rd, th)
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  // Get the month name
  const month = date.toLocaleString("default", { month: "long" });

  // Get the year
  const year = date.getFullYear();

  // Return the formatted string
  return `${day}${suffix} ${month} ${year}`;
}

function ScrapCreate({ htmlContent }) {
  const navigate = useNavigate();

  const onClickHandler = () => navigate(`/video`);
  const [images, setImages] = useState([]);
  const [types, setTypes] = useState([]);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [answersV, setAnswersV] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);
  const projectId = localStorage.getItem("nProject");
  const [scrap, setScrap] = useState("");
  const [scrapName, setScrapName] = useState("");

  const access_token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const projectName = localStorage.getItem("nProjectName");
  console.log(userDetails);

  const questionType = "BusinessCaseBuilder";
  const questionSubType = "Introduction";
  const token = localStorage.getItem("access_token");
  const [value, setValue] = useState("");
  const [misspelledWords, setMisspelledWords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionBoxPosition, setSuggestionBoxPosition] = useState({
    top: 0,
    left: 0
  });
  const [selectedWord, setSelectedWord] = useState(null);
  const { id } = useParams();
  console.log("create id " + id);
  const [formData, setFormData] = useState({
    scrap: ""
  });

  function getFormattedDate() {
    const date = new Date();

    // Get the day
    const day = date.getDate();

    // Add the appropriate suffix (st, nd, rd, th)
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    // Get the month name
    const month = date.toLocaleString("default", { month: "long" });

    // Get the year
    const year = date.getFullYear();

    // Return the formatted string
    return `${day}${suffix} ${month} ${year}`;
  }

  const handleEditorChange = () => {
    // Get the current selection range

    const content = editorRef.current.innerHTML;
    const event = { target: { id: "editor", value: content } };
    // checkSpelling(event.target.innerText);

    // Call the handleChange function to update the state with the new content

    const newText = content || "";
    function updateContentWithDate(content) {
      // Check if the content contains XXXXX
      if (content.includes("XXXXX")) {
        // Replace XXXXX with the formatted date
        const formattedDate = getFormattedDate();
        content = content.replace(/XXXXX/g, formattedDate);
      }
      // Set the updated content
      setScrap(content);
    }
    console.log(content);
    console.log("checking error");
    console.log(newText);
    checkSpelling(newText);

    handleChange(event);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setScrap(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateNda();
  };

  useEffect(() => {
    const fetchOrCreateNda = async () => {
      try {
        const scrapResponse = await fetch(
          `${API_BASE_URL}/api/nda/project/${projectId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // Include the token in the request headers
            }
          }
        );

        if (scrapResponse.status === 200) {
          // If NDA exists, fetch the NDA data
          const dataS = await scrapResponse.json();
          console.log(dataS);
          console.log("NDA found: " + dataS.nda);

          function updateContentWithDate(content) {
            const formattedDate = getFormattedDate();
            content = content.replace(/X+/g, formattedDate);
            setScrap(content);
            setScrapName(dataS.scrapName);
          }

          updateContentWithDate(dataS.nda);
        } else if (scrapResponse.status === 404) {
          // If NDA does not exist (404), create a new NDA
const newNdaContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Confidentiality and Non-Disclosure Agreement</title>
 <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    .container {
      padding: 20px;
      max-width: 800px;
      margin: auto;
    }
    h1 {
      color: #2E86C1;
      font-size: 24px;
    }
    h2 {
      color: #2874A6;
      font-size: 20px;
      margin-top: 20px;
    }
    p {
      margin: 15px 0;
    }
    .signature {
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT</h1>
    <p>This Confidentiality and Non-disclosure agreement is made this <strong>${getFormattedDate()}</strong></p>

    <h2>PARTIES</h2>
    <p>The Parties to this Agreement are:</p>
    <p><strong>${
      userDetails.firstName
    } with project ${projectName}</strong> incorporated under applicable laws with its principal offices at <strong>${projectName}</strong>, or your ideas as contained in this Craddule Project Workspace. (The Disclosing Party).</p>
    <p>And</p>
    <p><strong>{{RECIPIENT_NAME}}</strong> with a Craddule account and access to the project. (The Receiving Party/Craddule Collaborator).</p>

    <h2>INTRODUCTION</h2>
    <p>It is hereby agreed as follows:</p>
    <p>The parties are desirous of engaging in discussions for certain purposes ("the Purpose").</p>
    <p>During the course of their business discussions and transactions, it is anticipated that one party ("the Disclosing Party") may disclose certain confidential and proprietary information related to or in connection with the Parties to the other party ("the Receiving Party"). This disclosure is for the purpose of enabling the Receiving Party to assess, evaluate, provide advice, or fulfill its obligations.</p>
    <p>The Parties recognize that the unauthorized disclosure or use of the Disclosing Party's confidential information by third parties could result in significant harm or prejudice to the Disclosing Party.</p>
    <p>In acknowledgment of the need for confidentiality, the Parties have mutually agreed to enter into this Confidentiality and Non-Disclosure Agreement ("the Agreement").</p>

    <h2>DEFINITIONS AND INTERPRETATION</h2>
    <p>In this Agreement, unless the context otherwise requires:</p>
    <ul>
      <li><strong>"Affiliate"</strong> means, with respect to any person that directly, or indirectly through one or more intermediaries, controls, is controlled by, or is under common control with such person; the term "control" (including the term "controlling", "controlled by" and "under common control with") means the possession, direct or indirect, of the power to direct or cause the direction of the management and policies of a person, whether through the ownership of voting securities, by contract, or otherwise.</li>
      <li><strong>"Disclosing Party"</strong> means a Party when it discloses its Confidential Information, directly or indirectly, to the Receiving Party.</li>
      <li><strong>"Confidential Information"</strong> includes, but is not limited to:
        <ul>
          <li>All information, in any form, disclosed or supplied to a Receiving Party by a Disclosing Party relating to (i) the Purpose, (ii) past, present, or future business partners, joint ventures, or affiliates, or (iii) the Disclosing Party's, or any of the Disclosing Party's Representatives' past, present, or future research, development, or business activities.</li>
          <li>All business data, Personal Data, technical, financial, operational, administrative, legal, economic, and other information in whatever form (including in written, oral, visual, or electronic form) relating directly or indirectly to the Purpose.</li>
          <li>All information in whatever form relating to the existence, status, or progress of the Purpose, including the existence and contents of this Agreement and the fact that discussions and negotiations may be taking place in relation to the Purpose.</li>
          <li>All documents and any other material that contains, reflects, or is generated from any of the foregoing, and all copies of any of the foregoing.</li>
        </ul>
      </li>
      <li><strong>"Personal Data"</strong> means any data which relates to an identified or identifiable person, be it sensitive or non-sensitive data.</li>
      <li><strong>"Representatives"</strong> means, in relation to a Party, its Affiliates and their respective directors, officers, employees, agents, consultants, and advisers.</li>
    </ul>

    <h2>UNDERTAKING</h2>
    <p>The Receiving Party undertakes:</p>
    <ul>
      <li>That all information obtained from the Disclosing Party shall be regarded and treated as confidential and the property of the Disclosing Party.</li>
      <li>To maintain in secrecy any and all Proprietary Information of the Disclosing Party and to act in good faith at all times in performing its obligations under this Agreement.</li>
      <li>Not to disclose the Proprietary Information to any third parties, except where necessary for the performance of obligations under this Agreement.</li>
      <li>To return all Proprietary Information upon termination or expiration of this Agreement.</li>
    </ul>

    <h2>INDEMNITY</h2>
    <p>The Receiving Party indemnifies and holds the Disclosing Party harmless against any loss, expense, claim, harm, damage, or liability of whatsoever nature suffered or sustained by the Disclosing Party resulting from any action, proceeding, or claim made by any person against the Disclosing Party as a result of the breach of this Agreement by the Receiving Party or any of its employees, agents, independent contractors, or consultants.</p>

    <h2>BREACH</h2>
    <p>Should the Receiving Party commit a breach of its obligations in terms of this Agreement, the Disclosing Party has the right to claim actual damages as it may suffer. In addition, the Disclosing Party may apply to Court for an injunction restraining the Receiving Party from using, disclosing, or exploiting the Proprietary Information of the Disclosing Party.</p>

    <h2>DOMICILIUM</h2>
    <p>The Parties respectively choose their respective addresses set forth above as their domicilium citandi et executandi for all purposes of giving any notice, the serving of any process, and for any purpose arising from this Agreement.</p>

    <h2>CONFIDENTIAL INFORMATION USAGE</h2>
    <p>The Receiving Party will hold the Confidential Information in strict confidence and will not disclose, reproduce, reprocess, or distribute any Confidential Information in whole or in part, directly or indirectly, to any persons, other than to its Representatives and with the prior consent of the Disclosing Party, to the extent that such disclosure, reproduction, or distribution is strictly necessary for the Purpose of this Agreement.</p>

    <h2>CONFIDENTIAL INFORMATION STORAGE</h2>
    <p>The Receiving Party shall store the received/obtained Confidential Information under this Agreement within the country or location of the Disclosing Party, or as mutually agreed by both Parties.</p>

    <h2>RETURN OR DESTRUCTION OF CONFIDENTIAL INFORMATION</h2>
    <p>Upon termination or expiration of this Agreement, the Receiving Party shall immediately erase/delete all Confidential Information obtained under this Agreement, including operational, archived, and backup Confidential Information.</p>

    <h2>DATA PROTECTION</h2>
    <p>Both parties agree to comply with all applicable data protection laws and regulations concerning the processing of personal data. Each party shall be responsible for ensuring that it has a valid legal basis for processing personal data and obtaining any necessary consents or authorizations as required by law.</p>

    <h2>GENERAL</h2>
    <p>This Agreement contains the entire agreement between the Parties and no variation or consensual cancellation thereof shall be of any force or effect unless reduced to writing and signed by both Parties.</p>

    <div class="signature">
      <p>Signed for and on behalf of</p>
      <p><strong>${projectName}</strong></p>
      <p>____________________</p>
      <p><strong>${userDetails.firstName} ${userDetails.lastName}</strong></p>
      <p><strong>Designation</strong></p>
    </div>

    <div class="signature">
      <p>Receiving Party / Craddule Collaborator</p>
      <p>____________________</p>
      <p><strong>{{RECIPIENT_NAME}}</strong></p>
      <p><strong>Designation</strong></p>
    </div>
  </div>
</body>
</html>`;



          const createNdaResponse = await fetch(`${API_BASE_URL}/api/nda`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // Include the token in the request headers
            },
            body: JSON.stringify({
              projectId: projectId,
              nda: newNdaContent
            })
          });

          if (createNdaResponse.status === 200) {
            const createdNda = await createNdaResponse.json();
            console.log("New NDA created: " + createdNda);
            setScrap(createdNda.nda);
          } else {
            console.log("Failed to create NDA");
            setLoading(false);
          }
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

    fetchOrCreateNda();
  }, [projectId, token]);

  const updateNda = async (data) => {
    try {
      setLoading(true);
      console.log(scrap);
      const summary = scrap;
      const response = await fetch(API_BASE_URL + "/api/nda/" + projectId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nda: scrap })
      });

      if (response.status === 200) {
        setLoading(false);
        toast.success("Saved");
        console.log(response);

        ///throw new Error('Failed to create or update summary');
      } else {
        const data = await response.json();
        setLoading(false);
        toast.error("can't save");
        console.log(data.message); // Log success message
      }
    } catch (error) {
      console.error("Error creating or updating scrapbook:", error.message);
      // Handle error
    }
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image"
  ];
  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    ["link", "image"],
    [{ size: [] }],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"]
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
      const toolbar = quill.getModule("toolbar").handlers.image;
      toolbar.addHandler("image", console.log("image toolbar"));
      //console.log(toolbar.handlers.image);
    } else {
      console.error("ReactQuill ref is not initialized");
    }
  };

  const editorRef = useRef(null);

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };
  const insertLink = () => {
    const url = prompt("Enter the link URL:");
    if (url) {
      formatText("createLink", url);
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
    const affResponse = await fetch("/dictionaries/en.aff");
    const aff = await affResponse.text();

    const dicResponse = await fetch("/dictionaries/en.dic");
    const dic = await dicResponse.text();
    return nspell({ aff, dic });
  };
  const checkSpelling = async (text) => {
    if (!text) return;
    console.log("now checking");
    const spell = await loadDictionary();
    const words = text.split(/\s+/);
    const misspelled = words.filter((word) => !spell.correct(word));
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
    const escapedWord = selectedWord.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const newHtml = html.replace(
      new RegExp(`\\b${escapedWord}\\b`, "g"),
      suggestion
    );

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
      formatText("formatBlock", heading);
    }
  };

  const handleImagePopup = () => {
    setShowImagePopup(!showImagePopup);
  };

  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);

  const toggleHeadingDropdown = () =>
    setShowHeadingDropdown(!showHeadingDropdown);
  //   updateNda();

  const handleInsertFile = (file) => {
    const newFile = API_BASE_URL + "/images/" + file;
    console.log(newFile);
    setScrap(
      (prevContent) =>
        `${prevContent}<div contenteditable="true" style="display:inline-block; width:30%;"><img src="${newFile}" style="width:100%;" /></div>`
    );
    // setScrap((prevContent) => `${prevContent}<img src="${newFile}" alt="Inserted File" />`);
  };

  useEffect(() => {
    const fetchSubtypeFiles = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/hub/project/${projectId}`
        );
        setTypes(response.data.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchSubtypeFiles();
  }, []);

  const [resizingImage, setResizingImage] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [initialX, setInitialX] = useState(null);
  const [initialY, setInitialY] = useState(null);

  function handleImageResizing(event) {
    if (event.type === "mousemove" && !isResizing) {
      return; // Ignore mousemove event if not resizing
    }

    const imageElement = event.target;
    if (imageElement.nodeName !== "IMG") {
      return; // Ignore if the target is not an image element
    }

    if (event.type === "mousedown") {
      startImageResize(event);
    } else if (event.type === "mousemove") {
      if (isResizing) {
        resizeImage(event, imageElement);
      }
    } else if (event.type === "mouseup") {
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
    if (event.target.tagName === "IMG") {
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

  return (
    <>
      <Header />
      <div className="container">
        <div className="flex mt-[40px] justify-between items-center w-[100%]">
          <div className="w-fit">
            <button
              onClick={() => navigate(-1)}
              className="bg-[#193FAE] px-[30px] py-[5px] text-white rounded-3xl"
            >
              Back
            </button>
          </div>
          <div>
            <img src={home} alt="Home Icon" />
          </div>
        </div>
        <div className="mt-3 text-center text-red-600 ">
          <p>
            We do not offer legal advice, please discuss this template NDA with
            a legal proffesional before adopting it, thank you
          </p>
        </div>
        <div
          className="upload-container"
          style={{ textAlign: "justify", width: "100%" }}
        >
          <div className="main-content2">
            <div className="bacWHI">
              <div className="text-center">
                <p className="centerH" onClick={accessToolbar}>
                  {scrapName}
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <button className="btn btn-primary buttonE" type="submit">
                  {loading && (
                    <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
                  )}
                  {!loading && <span>Save</span>}
                </button>
                {/* <button className="btn btn-primary buttonS">Edit</button> */}
                {/*<p className= "buttonE">Save</p>
            <p className= "buttonS">Edit</p>*/}
                <div class="break"></div>

                <div className="container-textBs">
                  <div class="toolbar">
                    <button onClick={() => formatText("bold")} type="button">
                      <FontAwesomeIcon icon={faBold} />
                    </button>
                    <button onClick={() => formatText("italic")} type="button">
                      <FontAwesomeIcon icon={faItalic} />
                    </button>
                    <button
                      onClick={() => formatText("underline")}
                      type="button"
                    >
                      <FontAwesomeIcon icon={faUnderline} />
                    </button>
                    <button
                      onClick={() => formatText("strikeThrough")}
                      type="button"
                    >
                      <FontAwesomeIcon icon={faStrikethrough} />
                    </button>
                    <button
                      onClick={() => formatText("formatBlock", "blockquote")}
                      type="button"
                    >
                      <FontAwesomeIcon icon={faQuoteRight} />
                    </button>
                    <button
                      onClick={() => formatText("formatBlock", "pre")}
                      type="button"
                    >
                      <FontAwesomeIcon icon={faCode} />
                    </button>
                    <button onClick={insertLink} type="button">
                      <FontAwesomeIcon icon={faLink} />
                    </button>
                    {/* <button onClick={handleImagePopup} type='button'>
          <FontAwesomeIcon icon={faImage} />
        </button> */}
                    <select
                      onChange={(e) => formatText("fontSize", e.target.value)}
                    >
                      <option value="">Font Size</option>
                      {[...Array(23)].map((_, i) => (
                        <option key={i} value={i + 2}>
                          {i + 2}
                        </option>
                      ))}
                    </select>
                    <div className="dropdownM">
                      <button
                        className="dropdown-toggle"
                        onClick={toggleHeadingDropdown}
                        type="button"
                      >
                        <FontAwesomeIcon icon={faHeading} />{" "}
                        <FontAwesomeIcon icon={faChevronDown} />
                      </button>

                      <select
                        onChange={handleHeadingChange}
                        className="headingDropdown"
                      >
                        <option value="">Heading</option>
                        {[...Array(6)].map((_, i) => (
                          <option key={i} value={`h${i + 1}`}>
                            H{i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => formatText("insertOrderedList")}
                      type="button"
                    >
                      <FontAwesomeIcon icon={faListOl} />
                    </button>
                    <button
                      onClick={() => formatText("insertUnorderedList")}
                      type="button"
                    >
                      <FontAwesomeIcon icon={faListUl} />
                    </button>
                    <button
                      onClick={() => formatText("subscript")}
                      type="button"
                    >
                      <FontAwesomeIcon icon={faSubscript} />
                    </button>
                    <button
                      onClick={() => formatText("superscript")}
                      type="button"
                    >
                      <FontAwesomeIcon icon={faSuperscript} />
                    </button>
                    <button onClick={() => formatText("outdent")} type="button">
                      <FontAwesomeIcon icon={faOutdent} />
                    </button>
                    <button onClick={() => formatText("indent")} type="button">
                      <FontAwesomeIcon icon={faIndent} />
                    </button>
                    <button
                      onClick={() => formatText("direction", "rtl")}
                      type="button"
                    >
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
                      const word = range.startContainer.textContent.slice(
                        range.startOffset,
                        range.endOffset
                      );
                      console.log(word);
                      if (misspelledWords.includes(word)) {
                        const rect = e.target.getBoundingClientRect();
                        handleWordClick(word, rect);
                      }
                    }}
                    style={{
                      whiteSpace: "pre-wrap",
                      minHeight: "200px",
                      border: "1px solid #ccc",
                      padding: "10px"
                    }}
                  />

                  {suggestions.length > 0 && (
                    <div
                      className="suggestion-box"
                      style={{
                        position: "absolute",
                        top: suggestionBoxPosition.top,
                        left: suggestionBoxPosition.left,
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        zIndex: 1000
                      }}
                    >
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={() => applySuggestion(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}

                  {showImagePopup && (
                    <ImagePopup
                      onClose={() => setShowImagePopup(false)}
                      types={types}
                      onInsertFile={handleInsertFile}
                    />
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
    </>
  );
}

export default ScrapCreate;
