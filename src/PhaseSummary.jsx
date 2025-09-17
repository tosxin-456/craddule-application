import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from "./config/apiConfig";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaDownload, FaFilePdf, FaSyncAlt, FaArrowRight, FaEdit } from "react-icons/fa";
import { MdOutlineSummarize } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import html2pdf from "html2pdf.js";
import { Toaster, toast } from 'sonner';
import home from "./images/HOME.png";
import Header from "./component/header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faChevronDown, faBold, faItalic, faUnderline, faStrikethrough, faQuoteRight, faCode, faLink, faImage, faTextHeight, faListOl, faListUl, faSubscript, faSuperscript, faOutdent, faIndent, faAlignRight, faHeading } from '@fortawesome/free-solid-svg-icons';
import {
     Bold, Italic, Underline, Strikethrough, Quote, Code, Image, AlignLeft, AlignCenter, AlignRight, Outdent, Indent, Subscript, Superscript, Edit2, Save, Trash, ListOrdered,
    ListOrderedIcon,
    ListMinus,
    Loader2,
} from 'lucide-react';
import circle from './images/circle.png';
import bg from './images/pattern_landscape.png';
import feedback from './images/feedback.svg';
import softCorrections from "./softCorrections.json";
import sentences from "./sentences.json";
import wordlist from "./wordlist.json";

// import ReactQuill, { Quill } from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import { jwtDecode } from "jwt-decode";
// import ImageResize from 'quill-image-resize-vue';
import Tooltip from './component/tooltip';
import ImagePopup from './component/cradduleModal';
import axios from 'axios';
import nspell from 'nspell';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import CarStepsProcess from './component/carsComponents';
// import GetCard from './getCard';


function PhaseSummary() {
    const [recentSummary, setRecentSummary] = useState("");
    const [previousSummary, setPreviousSummary] = useState(null);
    const [olderSummary, setOlderSummary] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(true);
    const [count, setCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSummary, setSelectedSummary] = useState("recent");
    const navigate = useNavigate();
    const projectId = localStorage.getItem("nProject");
    const token = localStorage.getItem("access_token");
    const { phase, category, subCategory } = useParams();
    const onClickHandler = () => navigate(`/video`);
    const [images, setImages] = useState([]);
    const [types, setTypes] = useState([]);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [answersV, setAnswersV] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [error, setError] = useState(null);
    const [combinedAnswer, setCombinedAnswer] = useState('');
    const [answered, setAnswered] = useState([]);
    const [cat, setCat] = useState([]);
    const access_token = localStorage.getItem('access_token');
    const decodedToken = jwtDecode(access_token);
    const userId = decodedToken.userId;
    const [value, setValue] = useState('');
    const [misspelledWords, setMisspelledWords] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionBoxPosition, setSuggestionBoxPosition] = useState({ top: 0, left: 0 });
    const [selectedWord, setSelectedWord] = useState(null);
    const [nextPhase, setNextPhase] = useState("")
    const [subscribed, setSubscribed] = useState(true);
    const [showScrollableDiv, setShowScrollableDiv] = useState(false);
    const [showScrollableDiv2, setShowScrollableDiv2] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [suggestion, setSuggestion] = useState("");
    const textareaRef = useRef();
    const suggestionRef = useRef();

    const softMap = new Map(Object.entries(softCorrections));
    const dictionarySet = new Set(wordlist.map((w) => w.toLowerCase()));

    // Levenshtein Distance function
    function levenshtein(a, b) {
        const dp = Array(a.length + 1)
            .fill(null)
            .map(() => Array(b.length + 1).fill(0));
        for (let i = 0; i <= a.length; i++) dp[i][0] = i;
        for (let j = 0; j <= b.length; j++) dp[0][j] = j;
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
                else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
        return dp[a.length][b.length];
    }

    // Build bigram prediction model from sentences
    function buildNextWordMapFromSentences(sentences) {
        const map = new Map();
        for (const sentence of sentences) {
            const words = sentence.trim().toLowerCase().split(/\s+/);
            for (let i = 0; i < words.length - 1; i++) {
                const word = words[i];
                const next = words[i + 1];
                if (!map.has(word)) map.set(word, []);
                if (!map.get(word).includes(next)) map.get(word).push(next);
            }
        }
        return map;
    }

    const nextWordMap = buildNextWordMapFromSentences(sentences);

    // Correction helper
    function getClosestWordFromCorpus(word) {
        let best = null;
        let min = Infinity;
        const allWords = Array.from(dictionarySet);
        for (let i = 0; i < allWords.length; i++) {
            const dist = levenshtein(word, allWords[i]);
            if (dist < min && dist <= 2) {
                best = allWords[i];
                min = dist;
            }
            if (min === 1) break;
        }
        return best;
    }

    const handleAnswerChange = (e) => {
        const val = e.target.value;
        const endsWithSpace = val.endsWith(" ");
        const words = val.trim().split(/\s+/);
        const lastWord = words[words.length - 1]?.toLowerCase();

        if (endsWithSpace && lastWord) {
            // Step 1: Soft corrections
            if (softMap.has(lastWord)) {
                words[words.length - 1] = softMap.get(lastWord);
                setSelectedAnswer(words.join(" ") + " ");
                setSuggestion("");
                return;
            }

            // Step 2: Fuzzy correction ONLY if it's not a valid dictionary word
            if (!dictionarySet.has(lastWord)) {
                const corrected = getClosestWordFromCorpus(lastWord);
                if (corrected) {
                    words[words.length - 1] = corrected;
                    setSelectedAnswer(words.join(" ") + " ");
                    setSuggestion("");
                    return;
                }
            }

            // Step 3: Prediction (only for single word)
            if (words.length === 1) {
                const next = nextWordMap.get(lastWord);
                setSuggestion(next ? next[0] : "");
            } else {
                setSuggestion("");
            }
        } else {
            setSuggestion("");
        }

        setSelectedAnswer(val);
    };

    // 5. Add this keydown handler function
    const handleAnswerKeyDown = (e) => {
        if (suggestion && (e.key === "Tab" || e.key === "ArrowRight")) {
            e.preventDefault();
            setSelectedAnswer((prev) => prev + suggestion + " ");
            setSuggestion("");
        }
    };

    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedText, setSelectedText] = useState("");
    const [selectionStart, setSelectionStart] = useState(null);
    const [selectionEnd, setSelectionEnd] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState("");

    // Enhanced mouse event handlers
    const handleMouseDown = (e) => {
        setIsSelecting(true);
        setSelectionStart({ x: e.clientX, y: e.clientY });
        // Clear previous selection
        setSelectedText("");
        setSelectionEnd(null);
    };

    const handleMouseMove = (e) => {
        if (isSelecting) {
            setSelectionEnd({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = (e) => {
        if (isSelecting) {
            setIsSelecting(false);

            // Get the selected text from the browser's selection API
            const selection = window.getSelection();
            const text = selection.toString().trim();

            if (text) {
                setSelectedText(text);
                console.log("Selected text:", text);

                // Optional: You can store the range for later use
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    // Store range if needed for operations like replace, highlight, etc.
                }
            }

            setSelectionStart(null);
            setSelectionEnd(null);
        }
    };

    const syncScroll = () => {
        if (textareaRef.current && suggestionRef.current) {
            suggestionRef.current.scrollTop = textareaRef.current.scrollTop;
            suggestionRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    };


    // Optional: Handle text selection changes
    const handleSelectionChange = () => {
        const selection = window.getSelection();
        const text = selection.toString().trim();

        if (text && text !== selectedText) {
            setSelectedText(text);
        } else if (!text) {
            setSelectedText("");
        }
    };

    // Add this useEffect to listen for selection changes
    useEffect(() => {
        document.addEventListener('selectionchange', handleSelectionChange);
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, [selectedText]);

    const handleToggle = () => {
        setShowScrollableDiv(!showScrollableDiv);
    };

    useEffect(() => {
        requestAnimationFrame(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        });
    }, []);


    const handleToggleSh = () => {
        setShowScrollableDiv2(!showScrollableDiv2);
    };

    const [formData, setFormData] = useState({
        summary: '',
    });

    //  useEffect(() => {

    //    fetchAnswerCut(); // Call the function to fetch the unanswered question
    //  }, [category, subCategory, projectId]);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/hub/types`);
                setImages(response.data);
                // setLoading(true);
            } catch (error) {
                console.error('Error fetching types:', error);
                // setError('Failed to fetch types');
                // setLoading(true);
            }
        };

        fetchTypes();
    }, []);

    const [isToolbarVisible, setIsToolbarVisible] = useState(false);

    const toggleToolbar = () => {
        setIsToolbarVisible(!isToolbarVisible);
    };

    const handleSubscriptionClick = () => {
        getNextPhase();

        // if (subscribed) {
        //     getNextPhase();
        // } else {
        //     setShowPayment(false); // First close
        //     setTimeout(() => {
        //         setShowPayment(true); // Then open after a very tiny delay
        //     }, 50); // small delay to force re-render
        // }
    };



    const handleClick = (id) => {
        // Handle click event and set the selected answer
        navigate('/questionEdit/' + id);
    };

    const handleClickSh = (id) => {
        // Handle click event and set the selected answer
        console.log(id)
        handleToggleSh();
        handleToggle();
    };

    const handleEditorChange = () => {
        // Get the current selection range


        const content = editorRef.current.innerHTML;
        const event = { target: { id: 'editor', value: content } };
        // checkSpelling(event.target.innerText);

        // Call the handleChange function to update the state with the new content


        const newText = content || '';
        setCombinedAnswer(content);
        console.log(content);
        console.log("checking error");
        console.log(newText);
        //    checkSpelling(newText);

        handleChange(event);


    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setCombinedAnswer(value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        createOrUpdateSummary();

    };




    const createOrUpdateSummary = async (data) => {
        console.log("on the save pdf.")
        try {
            setLoading(true);
            console.log(combinedAnswer);
            const summary = combinedAnswer;
            const response = await fetch(API_BASE_URL + '/api/pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ projectId, category, summary, userId, phase }),
            });

            if (!response.ok) {
                setLoading(false);
                toast.error("can't save");
                ///throw new Error('Failed to create or update summary');
            }

            const data = await response.json();
            setLoading(false);
            toast.success("Saved");
            console.log(data.message); // Log success message


        } catch (error) {
            console.error('Error creating or updating summary:', error.message);
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

    const modules = {
        toolbar: {
            container: toolbarOptions,
            // handlers: {
            //   'image': () => {
            //     setShowImagePopup(true);
            //   }
            // }
        },

        imageResize: {
            modules: ['Resize', 'DisplaySize', 'Toolbar'] // Configure the image resize module
        }
    };
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


    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    const editorRef = useRef(null);

    const handleImageSelect = (imageUrl) => {
        const quill = reactQuillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', imageUrl);
        setShowImagePopup(false);
    };

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
            console.log("in ref");
            console.log(combinedAnswer);
        }
    }, [combinedAnswer]);

    const loadDictionary = async () => {
        const affResponse = await fetch('/dictionaries/en.aff');
        const aff = await affResponse.text();

        const dicResponse = await fetch('/dictionaries/en.dic');
        const dic = await dicResponse.text();
        console.log(dic);
        return nspell({ aff, dic });
    };


    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    };



    const highlightMisspelledWords = () => {
        //if (!editorRef.current) return;


        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const startContainer = range.startContainer;
        const startOffset = range.startOffset;

        const startMarker = document.createElement("span");
        startMarker.id = "start-marker";
        range.insertNode(startMarker);

        console.log(misspelledWords);
        if (misspelledWords.length === 0) {
            console.log("no words")
            //editorRef.current.innerHTML = combinedAnswer;
            return;
        }

        let innerHTML = combinedAnswer;
        const words = innerHTML.split(/(\s+)/); // Split by spaces, keeping the spaces in the array

        //const words = innerHTML.split(/(\b|\s+)/);
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = combinedAnswer;
        const textNodes = getTextNodes(tempContainer);

        textNodes.forEach(node => {
            let nodeText = node.nodeValue;
            misspelledWords.forEach(word => {
                const escapedWord = escapeRegExp(word);
                const regex = new RegExp(`\\b${escapedWord}\\b`, 'g');
                nodeText = nodeText.replace(regex, `<span style="background-color: darkblue; color: white;">${word}</span>`);
            });
            const newNode = document.createElement('span');
            newNode.innerHTML = nodeText;
            node.replaceWith(...newNode.childNodes);
        });



        console.log(tempContainer.innerHTML);
        editorRef.current.innerHTML = tempContainer.innerHTML;
        restoreCursorPosition();

        // Highlight misspelled words
        // for (let i = 0; i < words.length; i++) {
        //   const word = words[i];
        //   if (misspelledWords.includes(word.trim())) {
        //     words[i] = `<span style="background-color: darkblue; color: white;">${word}</span>`;
        //   }
        // }

        // console.log(words);
        // setCombinedAnswer(words);
        //editorRef.current.innerHTML = words.join('');
    };

    const getTextNodes = (node) => {
        let textNodes = [];
        if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(node);
        } else {
            for (let child of node.childNodes) {
                textNodes = textNodes.concat(getTextNodes(child));
            }
        }
        return textNodes;
    };


    const restoreCursorPosition = () => {
        const startMarker = document.getElementById("start-marker");
        if (!startMarker) return;

        const range = document.createRange();
        const selection = window.getSelection();

        range.setStartBefore(startMarker);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

        // Clean up marker
        startMarker.parentNode.removeChild(startMarker);
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
        highlightMisspelledWords();

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
        // setCombinedAnswer(newHtml);
        // setSuggestions([]);

        if (!selectedWord) return; // Check if a word is selected

        const editor = editorRef.current;
        const html = editor.innerHTML;

        // Create a regex to match only the selected word
        const escapedWord = selectedWord.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const newHtml = html.replace(new RegExp(`\\b${escapedWord}\\b`, 'g'), suggestion);

        editor.innerHTML = newHtml;
        setCombinedAnswer(newHtml);
        checkSpelling(newHtml);
        setSelectedWord(null); // Reset selected word

    };

    const handleSuggestionClick = (suggestion) => {
        if (!selectedWord) return; // Check if a word is selected

        const editor = editorRef.current;
        const html = editor.innerHTML;

        // Create a regex to match only the selected word
        const escapedWord = selectedWord.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const newHtml = html.replace(new RegExp(`\\b${escapedWord}\\b`, 'g'), suggestion);

        editor.innerHTML = newHtml;
        setCombinedAnswer(newHtml);
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
    //   createOrUpdateSummary();

    const handleInsertFile = (file) => {
        const newFile = API_BASE_URL + '/images/' + file;
        console.log(newFile);
        setCombinedAnswer((prevContent) => `${prevContent}<div contenteditable="true" style="display:inline-block; width:30%;"><img src="${newFile}" style="width:100%;" /></div>`);
        // setCombinedAnswer((prevContent) => `${prevContent}<img src="${newFile}" alt="Inserted File" />`);

    };

    useEffect(() => {
        const fetchSubtypeFiles = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/hub/project/${projectId}`);
                setTypes(response.data.data);
                console.log(response.data);

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


    const onClickNext = () => navigate(`/questionBusMain/${phase}/${category}`);

    useEffect(() => {
        fetchSummaries();
    }, []);

    const phasePaths = [
        "Ideation",
        "ProductDefinition",
        "InitialDesign",
        "ValidatingAndTesting",
        "Commercialization"
    ];


    const fetchSummaries = async () => {
        setLoadingSummary(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/test-new/questions/summary/${phase}/${projectId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                // HTTP status is 200–299
                console.log("Summary data:", data);
                setRecentSummary(data.data.summary);
                setPreviousSummary(data.data.summary_one || null);
                setOlderSummary(data.data.summary_two || null);
                setCount(data.data.count);

                const storedSubscribed = localStorage.getItem('subscribed');
                console.log("Subscribed status from localStorage:", storedSubscribed);
                setSubscribed(storedSubscribed === 'true');
            } else {
                console.warn("Non-200 HTTP status:", response.status, data);

                // Provide fallback UI state or error message
                setRecentSummary(null);
                setPreviousSummary(null);
                setOlderSummary(null);
                setCount(0);
            }
        } catch (error) {
            console.error("Error fetching summaries:", error);
        } finally {
            setLoadingSummary(false);
        }
    };



    const regenerateSummary = async () => {
        setLoadingSummary(true);
        try {
            await fetch(
                `${API_BASE_URL}/api/test-new/questions/summary/${phase}/${projectId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchSummaries();
        } catch (error) {
            console.error("Error regenerating summary:", error);
        }
        setLoadingSummary(false);
    };

    const getNextPhase = () => {
        const currentIndex = phasePaths.indexOf(phase);

        if (currentIndex === -1) return;

        // If current phase is the last one, go to conclusion
        if (currentIndex === phasePaths.length - 1) {
            navigate("/conclusion");
            return;
        }

        const nextPhase = phasePaths[currentIndex + 1];
        const formattedNextPhase = formatPhase(nextPhase); // Optional: for display
        setNextPhase(formattedNextPhase);

        const onboardingData = JSON.parse(localStorage.getItem('onboarding')) || {};

        // Normalize the keys
        const normalize = (str) => str.replace(/\s/g, '').toLowerCase();

        const normalizedOnboarding = {};
        Object.keys(onboardingData).forEach(key => {
            normalizedOnboarding[normalize(key)] = onboardingData[key];
        });

        const normalizedNextPhase = normalize(nextPhase);

        if (normalizedOnboarding[normalizedNextPhase] === false) {
            // navigate(`/${nextPhase}`);
            navigate(`/test-ai/${nextPhase}`);

        } else {
            navigate(`/test-ai/${nextPhase}`);
        }
    };




    useEffect(() => {
        const currentIndex = phasePaths.indexOf(phase);

        // If current phase not found or it's the last one, do nothing
        if (currentIndex === -1 || currentIndex >= phasePaths.length - 1) return;

        const nextPickPhase = phasePaths[currentIndex + 1];
        setNextPhase(formatPhase(nextPickPhase));
    }, [phase, phasePaths]); // <- add dependencies


    const formatPhase = (text) => {
        return text
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const downloadPDF = () => {
        const element = document.getElementById("summary-content");
        html2pdf().from(element).save(`${formattedPhase}_Summary.pdf`);
    };

    const formattedPhase = formatPhase(phase);

    function Divider() {
        return <div className="h-6 border-[1.2px] border-gray-600 mx-1"></div>;
    }

    const [editedSummary, setEditedSummary] = useState("");
    const [twoLine, setTwoLine] = useState("");

    const location = useLocation();
    const thirdSentence = location.state?.thirdSentence;



    const updateSummary = async () => {
        console.log(editedSummary, selectedSummary);

        if (!editedSummary.trim()) {
            alert("Summary cannot be empty.");
            return;
        }

        // Map selectedSummary to the corresponding field name
        const fieldMap = {
            recent: "summary",
            previous: "summary_one",
            older: "summary_two",
        };

        const selectedField = fieldMap[selectedSummary]; // Get the correct field

        try {
            setLoadingSummary(true);
            const response = await fetch(`${API_BASE_URL}/api/test-new/questions/summary-update/${phase}/${projectId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    summary: editedSummary,
                    field: selectedField, // Sending mapped field to update
                }),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Summary updated successfully.");
                window.location.reload()
            } else {
                alert(result.error || "Failed to update summary.");
            }
        } catch (error) {
            console.error("Error updating summary:", error);
            alert("Error updating summary.");
        } finally {
            setLoadingSummary(false);
        }
    };

    const formatPhaseName = (slug) => {
        return slug.replace(/([a-z])([A-Z])/g, '$1 $2');
    };
    // console.log(nextPhase)


    const [selectedField, setSelectedField] = useState("summary");


    if (loadingSummary) {
        return (
            <div
                style={{
                    fontFamily: '"Manrope", sans-serif'
                }}
                className="text-center py-16 px-6"
            >
                <div className="max-w-md mx-auto">
                    <div className="flex flex-col items-center justify-center space-y-6">

                        {/* Enhanced loading spinner with multiple layers */}
                        <div className="relative">
                            {/* Outer glow effect */}
                            <div className="absolute inset-0 w-16 h-16 bg-blue-500 rounded-full opacity-20 animate-ping"></div>

                            {/* Rotating outer ring */}
                            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>

                            {/* Main spinner */}
                            <div className="relative z-10 flex items-center justify-center w-16 h-16">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>

                            {/* Secondary ring */}
                            <div className="absolute inset-2 w-12 h-12 border-2 border-blue-300 rounded-full animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
                        </div>

                        {/* Enhanced text content */}
                        <div className="space-y-3">
                            <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Generating Your Summary
                            </h2>
                            <p className="text-lg text-gray-600 font-medium">
                                Analyzing project data for <span className="text-blue-600 font-semibold">{formatPhase(phase)}</span> phase...
                            </p>
                        </div>

                        {/* Enhanced progress indicator */}
                        <div className="flex space-x-2 mt-6">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce shadow-lg"></div>
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full max-w-xs mx-auto mt-6">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        {/* Enhanced status message */}
                        <div className="space-y-2 mt-6">
                            <div className="text-sm text-gray-500 font-medium">
                                This may take a few moments...
                            </div>
                            <div className="text-xs text-gray-400 flex items-center justify-center space-x-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                                <span>Processing your data securely</span>
                            </div>
                        </div>

                        {/* Subtle background decoration */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-indigo-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div

            style={{
                fontFamily: '"Manrope", sans- serif'
            }}>
            <Header />


            <div className="absolute inset-0 mt-[50px] ml-[60px]  z-[-100] bg-no-repeat bg-cover w-[200px] h-[200px] " style={{ backgroundImage: `url(${circle})` }}></div>

            <div className="flex flex-col items-center gap-6 p-1 md:p-8 bg-gray-100 min-h-screen">
                <div className="w-full max-w-2xl flex justify-between items-center mt-4 md:mt-10">
                    <button
                        onClick={() => navigate(`/test-ai/${phase}`)}
                        className="bg-[#193FAE] px-4 md:px-6 py-2 text-white rounded-3xl shadow-md hover:bg-[#162E8D] transition"
                    >
                        Back
                    </button>
                    <img src={home} alt="Home Icon" />
                </div>


                <h5 className="text-2xl md:text-4xl font-bold text-gray-900 text-center">
                    {formattedPhase} Phase Summary
                </h5>

                <div className="flex flex-wrap gap-3 mt-4">
                    <button
                        onClick={regenerateSummary}
                        disabled={count >= 2}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition 
        ${count >= 2 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                    >
                        <FaSyncAlt /> Regenerate
                    </button>


                    {/* <button onClick={downloadPDF} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                        <FaDownload /> Download PDF
                    </button> */}
                </div>

                {/* Next Phase Button (Bottom) */}
                <div className="flex justify-center my-6">
                    <button
                        onClick={handleSubscriptionClick}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg transition shadow-sm bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <span>
                            {nextPhase ? `Proceed to ${nextPhase}` : "All done!"}
                        </span>
                        <FaArrowRight size={14} />
                    </button>
                </div>
                <img src={home} alt="Home Icon" className="flex-shrink-0" />

                <div className="flex flex-col md:flex-row gap-4 w-full ">
                    <div className="flex flex-col gap-2">
                        {recentSummary && (
                            <button
                                onClick={() => setSelectedSummary("recent")}
                                className={`p-2 rounded-lg ${selectedSummary === "recent" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
                            >
                                <MdOutlineSummarize /> Version 1
                            </button>
                        )}

                        {previousSummary && (
                            <button
                                onClick={() => setSelectedSummary("previous")}
                                className={`p-2 rounded-lg ${selectedSummary === "previous" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
                            >
                                <MdOutlineSummarize /> Version 2
                            </button>
                        )}

                        {olderSummary && (
                            <button
                                onClick={() => setSelectedSummary("older")}
                                className={`p-2 rounded-lg ${selectedSummary === "older" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
                            >
                                <MdOutlineSummarize /> Version 3
                            </button>
                        )}
                    </div>

                    {/* Payment Modal */}
                    {/* {showPayment && <GetCard />} */}





                    {/* className="min-h-[70vh] bg-white " */}
                    <div id="summary-content" className="  bg-[url('./images/pattern_landscape.png')]  bg-cover bg-no-repeat w-full p-2 md:p-6 bg-white shadow-lg rounded-xl border">
                        <div className=''>
                            <div className='flex items-center justify-between w-full px-1 py-1'>
                                {/* Summary Title */}
                                <div className="flex items-center gap-2">
                                    <MdOutlineSummarize className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                                    <h5 className="text-sm md:text-xl font-semibold text-gray-800">
                                        SUMMARY
                                    </h5>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    {/* Edit Button */}
                                    <button
                                        onClick={toggleToolbar}
                                        className="text-gray-700 hover:bg-gray-100 rounded-full p-2 transition"
                                        aria-label="Edit Summary"
                                    >
                                        <FaEdit className="w-4 h-4 md:w-6 md:h-6" />
                                    </button>

                                    {/* Save Button */}
                                    <button
                                        onClick={updateSummary}
                                        className="bg-blue-500 text-white text-xs md:text-sm px-2 py-1 md:px-3 md:py-2 rounded-lg shadow hover:bg-blue-600 transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>

                            {/* Toolbar */}
                            {isToolbarVisible && (

                                <div className="p-2 space-y-2">
                                    <div className="toolbar bg-gray-100 p-2 rounded-lg flex flex-wrap gap-1 md:justify-center justify-start items-center shadow-md">
                                        {/** Bold Button **/}
                                        <button
                                            onClick={() => formatText("bold")}
                                            type="button"
                                        >
                                            <Bold className="w-4 h-4" />
                                        </button>
                                        <Divider />
                                        {/** Italic Button **/}
                                        <button
                                            onClick={() => formatText("italic")}
                                            type="button"
                                            className="btn-icon"
                                        >
                                            <Italic className="w-4 h-4" />
                                        </button>
                                        <Divider />
                                        {/** Underline Button **/}
                                        <button
                                            onClick={() => formatText("underline")}
                                            type="button"
                                            className="btn-icon"
                                        >
                                            <Underline className="w-4 h-4" />
                                        </button>
                                        <Divider />
                                        {/** Strikethrough Button **/}
                                        <button
                                            onClick={() => formatText("strikeThrough")}
                                            type="button"
                                            className="btn-icon"
                                        >
                                            <Strikethrough className="w-4 h-4" />
                                        </button>
                                        <Divider />
                                        {/** Blockquote Button **/}
                                        <button
                                            onClick={() => formatText("formatBlock", "blockquote")}
                                            type="button"
                                            className="btn-icon"
                                        >
                                            <Quote className="w-4 h-4" />
                                        </button>
                                        <Divider />
                                        {/** Code Block Button **/}
                                        <button
                                            onClick={() => formatText("formatBlock", "pre")}
                                            type="button"
                                            className="btn-icon"
                                        >
                                            <Code className="w-4 h-4" />
                                        </button>
                                        <Divider />
                                        {/** Link Button **/}
                                        <button
                                            onClick={insertLink}
                                            type="button"
                                            className="btn-icon"
                                        >
                                            <FontAwesomeIcon icon={faLink} className="w-4 h-4" />
                                        </button>
                                        <Divider />
                                        {/** Image Button **/}
                                        <button
                                            onClick={handleImagePopup}
                                            type="button"
                                            className="btn-icon"
                                        >
                                            <Image className="w-4 h-4" />
                                        </button>
                                        <Divider />
                                        {/** Font Size Dropdown **/}
                                        <select
                                            onChange={(e) => formatText("fontSize", e.target.value)}
                                            className="select-dropdown"
                                        >
                                            <option value="">Size</option>
                                            {[...Array(23)].map((_, i) => (
                                                <option key={i} value={i + 2}>
                                                    {i + 2}
                                                </option>
                                            ))}
                                        </select>
                                        <Divider />
                                        {/** Heading Dropdown **/}
                                        <select
                                            onChange={handleHeadingChange}
                                            className="select-dropdown"
                                        >
                                            <option value="">Heading</option>
                                            {[...Array(6)].map((_, i) => (
                                                <option key={i} value={`h${i + 1}`}>
                                                    H{i + 1}
                                                </option>
                                            ))}
                                        </select>
                                        <Divider />
                                        {/** Ordered List Button **/}
                                        <button
                                            onClick={() => formatText("insertOrderedList")}
                                            type="button"
                                            className="btn-icon"
                                        >
                                            <FontAwesomeIcon icon={faListOl} className="w-4 h-4" />
                                        </button>
                                        <Divider />
                                        {/** Unordered List Button **/}
                                        <button
                                            onClick={() => formatText("insertUnorderedList")}
                                            type="button"
                                            className="btn-icon"
                                        >
                                            <FontAwesomeIcon icon={faListUl} className="w-4 h-4" />
                                        </button>
                                        <Divider />
                                        {/** Subscript Button **/}
                                        <button
                                            onClick={() => formatText("subscript")}
                                            type="button"
                                            className="btn-icon"
                                        >
                                            <Subscript className="w-4 h-4" />
                                        </button>
                                        <Divider />
                                        {/** Superscript Button **/}
                                        <button
                                            onClick={() => formatText("superscript")}
                                            type="button"
                                            className="btn-icon"
                                        >
                                            <Superscript className="w-4 h-4" />
                                        </button>
                                        <Divider />
                                        {/** Outdent Button **/}
                                        <button
                                            onClick={() => formatText("outdent")}
                                            type="button"
                                            className="btn-icon"
                                        >
                                            <Outdent className="w-4 h-4" />
                                        </button>
                                        <Divider />
                                        {/** Indent Button **/}
                                        <button
                                            onClick={() => formatText("indent")}
                                            type="button"
                                            className="btn-icon"
                                        >
                                            <Indent className="w-4 h-4" />
                                        </button>
                                        <Divider />
                                        {/** Align Right Button **/}
                                        <button
                                            onClick={() => formatText("direction", "rtl")}
                                            type="button"
                                            className="btn-icon"
                                        >
                                            <AlignRight className="w-4 h-4" />
                                        </button>
                                        <Divider />
                                        {/** Align Center Button **/}
                                        <button
                                            onClick={() => formatText("direction", "center")}
                                            type="button"
                                            className="btn-icon"
                                        >
                                            <AlignCenter className="w-4 h-4" />
                                        </button>
                                        <Divider />
                                        {/** Align Left Button **/}
                                        <button
                                            onClick={() => formatText("direction", "ltr")}
                                            type="button"
                                            className="btn-icon"
                                        >
                                            <AlignLeft className="w-4 h-4" />
                                        </button>
                                    </div>


                                </div>
                            )}

                            {loadingSummary ? (
                                // Show spinner if summary is not loaded
                                <div className="flex items-center justify-center h-screen">
                                    <AiOutlineLoading3Quarters className="animate-spin text-5xl text-indigo-500" />
                                </div>
                            ) : (
                                <div className="relative">
                                    <div
                                        ref={suggestionRef}
                                        className="absolute inset-0 w-full p-4 min-h-[12rem] border rounded-lg pointer-events-none z-0 whitespace-pre-wrap overflow-hidden font-mono text-transparent bg-transparent"
                                        style={{
                                            fontFamily: 'inherit',
                                            fontSize: 'inherit',
                                            lineHeight: 'inherit',
                                            letterSpacing: 'inherit',
                                            wordSpacing: 'inherit'
                                        }}
                                        onScroll={syncScroll}
                                    >
                                        <span style={{ color: 'transparent' }}>
                                            {selectedAnswer}
                                        </span>
                                        {suggestion && (
                                            <span style={{
                                                color: '#9CA3AF',
                                                backgroundColor: '#F3F4F6',
                                                padding: '1px 3px',
                                                borderRadius: '2px'
                                            }}>
                                                {suggestion.startsWith(selectedAnswer.split(' ').pop())
                                                    ? suggestion.slice(selectedAnswer.split(' ').pop().length)
                                                    : (selectedAnswer.endsWith(' ') ? suggestion : ' ' + suggestion)
                                                }
                                            </span>
                                        )}
                                    </div>
                                    <div
                                        ref={editorRef}
                                        contentEditable={true}
                                        className="editor rounded-md shadow-inner min-h-[300px] p-4 break-words focus:outline-none"
                                        onMouseDown={handleMouseDown}
                                        onMouseMove={handleMouseMove}
                                        onMouseUp={handleMouseUp}
                                        onInput={(e) => setEditedSummary(e.currentTarget.innerHTML)}
                                        style={{
                                            userSelect: 'text',
                                            WebkitUserSelect: 'text',
                                            MozUserSelect: 'text',
                                            msUserSelect: 'text'
                                        }}
                                    >
                                        <ReactMarkdown>
                                            {selectedSummary === "recent" ? recentSummary :
                                                selectedSummary === "previous" ? previousSummary : olderSummary}
                                        </ReactMarkdown>
                                    </div>

                                    {/* Optional: Display selected text */}
                                    {selectedText && (
                                        <div className="mt-2 p-2 bg-blue-100 rounded border">
                                            <strong>Selected:</strong> {selectedText}
                                        </div>
                                    )}

                                    {/* Optional: Selection actions */}
                                    {selectedText && (
                                        <div className="mt-2 flex gap-2">
                                            <button
                                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                                                onClick={() => {
                                                    // Copy selected text to clipboard
                                                    navigator.clipboard.writeText(selectedText);
                                                }}
                                            >
                                                Copy
                                            </button>
                                            <button
                                                className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                                                onClick={() => {
                                                    // Apply correction to selected text
                                                    console.log("Apply correction to:", selectedText);
                                                }}
                                            >
                                                Correct
                                            </button>
                                            <button
                                                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                                                onClick={() => {
                                                    // Clear selection
                                                    window.getSelection().removeAllRanges();
                                                    setSelectedText("");
                                                }}
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    )}
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

                    </div>
                </div>


                <div className="flex items-center p-5 mt-3 bg-gray-50 border-l-4 border-blue-500 rounded-md shadow-sm">
                    <div className="flex-shrink-0 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-base font-semibold text-gray-700">
                        {thirdSentence}
                    </p>
                </div>
            </div>

            <p className="text-lg text-center font-semibold my-4">
                These are the next steps.
            </p>

            {/* Car Steps Process */}
            <CarStepsProcess />


            {/* Next Phase Button (Bottom) */}
            <div className="flex justify-center my-6">
                <button
                    onClick={handleSubscriptionClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition shadow-sm bg-blue-600 text-white hover:bg-blue-700"
                >
                    <span>
                        {nextPhase ? `Proceed to ${nextPhase}` : "All done!"}
                    </span>
                    <FaArrowRight size={14} />
                </button>
            </div>
            <p className='text-center' >Let us get you started with your next steps with  <span onClick={handleSubscriptionClick} className='text-blue-500 hover:cursor-pointer uppercase ' >{nextPhase}</span></p>

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
    );
}

export default PhaseSummary;