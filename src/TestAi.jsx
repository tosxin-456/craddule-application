import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "./config/apiConfig";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
    FaRedo,
    FaCheck,
    FaEyeSlash,
    FaEye,
    FaArrowRight,
    FaArrowLeft,
    FaHome,
    FaTimesCircle,
    FaTools
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import home from './images/HOME.png';
import Header from "./component/header";
import circle from './images/circle.png';
import feedback from './images/feedback.svg';
// import GetCard from "./getCard";
import softCorrections from "./softCorrections.json";
import sentences from "./sentences.json";
import wordlist from "./wordlist.json";
import CarStepsProcess from "./component/carsComponents";

export default function QuestionOptions() {
    // State management
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingTest, setLoadingTest] = useState(true);

    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [phaseComplete, setPhaseComplete] = useState(false);
    const [twoLine, setTwoLine] = useState("");
    const [boxes, setBoxes] = useState([]);
    const [selectedBox, setSelectedBox] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [nextPhase, setNextPhase] = useState("");
    const [showPayment, setShowPayment] = useState(false);
    const [suggestion, setSuggestion] = useState("");
    const textareaRef = useRef();
    const suggestionRef = useRef();

    // Local storage and params
    const projectId = localStorage.getItem("nProject");
    const token = localStorage.getItem("access_token");
    const decodedToken = token ? jwtDecode(token) : { userId: "" };
    const userId = decodedToken.userId;
    const { phase } = useParams();
    const navigate = useNavigate();
    const softMap = new Map(Object.entries(softCorrections));
    const dictionarySet = new Set(wordlist.map((w) => w.toLowerCase()));

    // Grammar and punctuation rules
    const grammarRules = {
        // Words that typically need commas after them
        commaAfter: new Set(['however', 'therefore', 'moreover', 'furthermore', 'consequently', 'nevertheless', 'meanwhile', 'otherwise', 'thus', 'hence', 'indeed', 'specifically', 'particularly', 'essentially', 'basically', 'generally', 'typically', 'usually', 'obviously', 'clearly', 'fortunately', 'unfortunately', 'surprisingly', 'interestingly']),

        // Words that need commas before them when joining clauses
        commaBefore: new Set(['and', 'but', 'or', 'nor', 'for', 'so', 'yet', 'while', 'although', 'though', 'because', 'since', 'unless', 'until', 'after', 'before', 'when', 'where', 'if']),

        // Sentence starters that should be capitalized
        sentenceStarters: new Set(['the', 'a', 'an', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'some', 'many', 'few', 'all', 'most', 'each', 'every', 'no', 'one', 'two', 'first', 'last', 'next', 'previous', 'i', 'you', 'he', 'she', 'it', 'we', 'they']),

        // Words that typically end sentences
        sentenceEnders: new Set(['period', 'end', 'conclusion', 'finally', 'lastly', 'ultimately', 'overall', 'summary', 'result', 'outcome']),

        // Common sentence patterns that need specific punctuation
        questionWords: new Set(['what', 'when', 'where', 'why', 'how', 'who', 'which', 'whose', 'whom']),

        // Articles and determiners
        articles: new Set(['a', 'an', 'the']),

        // Prepositions that often need commas in lists
        prepositions: new Set(['in', 'on', 'at', 'by', 'for', 'with', 'without', 'through', 'during', 'before', 'after', 'above', 'below', 'under', 'over', 'between', 'among', 'within', 'throughout'])
    };

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

    // Enhanced sentence structure analysis
    function analyzeSentenceStructure(words) {
        const analysis = {
            hasSubject: false,
            hasVerb: false,
            hasObject: false,
            needsComma: false,
            needsPeriod: false,
            needsCapitalization: false,
            isQuestion: false,
            clauseCount: 0
        };

        // Simple heuristics for sentence analysis
        const firstWord = words[0]?.toLowerCase();
        analysis.isQuestion = grammarRules.questionWords.has(firstWord);
        analysis.needsCapitalization = words.length > 0 && words[0] === words[0].toLowerCase();

        // Count clauses by looking for conjunctions
        analysis.clauseCount = words.filter(word =>
            grammarRules.commaBefore.has(word.toLowerCase())
        ).length + 1;

        // Check for comma needs
        analysis.needsComma = words.some((word, index) => {
            const lowerWord = word.toLowerCase();
            return (grammarRules.commaAfter.has(lowerWord) && index < words.length - 1) ||
                (grammarRules.commaBefore.has(lowerWord) && index > 0 && analysis.clauseCount > 1);
        });

        return analysis;
    }

    // Smart punctuation insertion - FIXED VERSION
    function addSmartPunctuation(text, options = {}) {
        if (!text.trim()) return text;

        const {
            autoAddPeriod = false,  // Make this optional
            minWordsForPeriod = 3   // Only add period if sentence has enough words
        } = options;

        let result = text.trim();
        const words = result.split(/\s+/);
        const analysis = analyzeSentenceStructure(words);

        // Capitalize first word
        if (analysis.needsCapitalization && words.length > 0) {
            words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        }

        // Add commas where needed
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const lowerWord = word.toLowerCase();

            // Add comma after transitional words
            if (grammarRules.commaAfter.has(lowerWord) && i < words.length - 1) {
                if (!word.endsWith(',')) {
                    words[i] = word + ',';
                }
            }

            // Add comma before coordinating conjunctions in compound sentences
            if (i > 0 && grammarRules.commaBefore.has(lowerWord) && words.length > 6) {
                const prevWord = words[i - 1];
                if (!prevWord.endsWith(',')) {
                    words[i - 1] = prevWord + ',';
                }
            }

            // Add commas in lists (when we have 3+ items with 'and' or 'or')
            if ((lowerWord === 'and' || lowerWord === 'or') && i > 1 && i < words.length - 1) {
                const prevWord = words[i - 1];
                if (!prevWord.endsWith(',') && !prevWord.endsWith('.')) {
                    // Check if this appears to be a list
                    const hasListPattern = words.slice(Math.max(0, i - 3), i).some(w => w.endsWith(','));
                    if (hasListPattern) {
                        words[i - 1] = prevWord + ',';
                    }
                }
            }
        }

        result = words.join(' ');

        // Add end punctuation - ONLY when appropriate
        const lastChar = result.slice(-1);
        if (!['.', '!', '?'].includes(lastChar)) {
            if (analysis.isQuestion) {
                result += '?';
            } else if (autoAddPeriod && shouldAddPeriod(words, analysis)) {
                result += '.';
            }
            // Otherwise, leave it without punctuation
        }

        return result;
    }

    // Helper function to determine if a period should be added
    function shouldAddPeriod(words, analysis) {
        // Don't add period for very short inputs
        if (words.length < 3) return false;

        // Don't add period for single words or fragments
        if (words.length === 1) return false;

        // Don't add period if it looks like a title or heading
        const isTitle = words.every(word =>
            word.charAt(0) === word.charAt(0).toUpperCase() ||
            word.toLowerCase() === word
        );
        if (isTitle && words.length <= 5) return false;

        // Don't add period if it contains common incomplete markers
        const incompleteMarkers = ['and', 'or', 'but', 'because', 'since', 'while', 'although', 'if', 'when', 'where'];
        const lastWord = words[words.length - 1].toLowerCase();
        if (incompleteMarkers.includes(lastWord)) return false;

        // Add period if it seems like a complete sentence
        return analysis.hasSubject || analysis.hasVerb || words.length > 5;
    }

    // Alternative: Simple version that never auto-adds periods
    function addSmartPunctuationNoAuto(text) {
        if (!text.trim()) return text;

        let result = text.trim();
        const words = result.split(/\s+/);
        const analysis = analyzeSentenceStructure(words);

        // Capitalize first word
        if (analysis.needsCapitalization && words.length > 0) {
            words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        }

        // Add commas where needed (same logic as before)
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const lowerWord = word.toLowerCase();

            if (grammarRules.commaAfter.has(lowerWord) && i < words.length - 1) {
                if (!word.endsWith(',')) {
                    words[i] = word + ',';
                }
            }

            if (i > 0 && grammarRules.commaBefore.has(lowerWord) && words.length > 6) {
                const prevWord = words[i - 1];
                if (!prevWord.endsWith(',')) {
                    words[i - 1] = prevWord + ',';
                }
            }

            if ((lowerWord === 'and' || lowerWord === 'or') && i > 1 && i < words.length - 1) {
                const prevWord = words[i - 1];
                if (!prevWord.endsWith(',') && !prevWord.endsWith('.')) {
                    const hasListPattern = words.slice(Math.max(0, i - 3), i).some(w => w.endsWith(','));
                    if (hasListPattern) {
                        words[i - 1] = prevWord + ',';
                    }
                }
            }
        }

        result = words.join(' ');

        // ONLY add question marks for questions - never auto-add periods
        const lastChar = result.slice(-1);
        if (!['.', '!', '?'].includes(lastChar) && analysis.isQuestion) {
            result += '?';
        }

        return result;
    }

    // Build enhanced bigram prediction model from sentences
    function buildNextWordMapFromSentences(sentences) {
        const map = new Map();
        const contextMap = new Map(); // For better context-aware predictions

        for (const sentence of sentences) {
            const words = sentence.trim().toLowerCase().split(/\s+/);
            for (let i = 0; i < words.length - 1; i++) {
                const word = words[i];
                const next = words[i + 1];
                const context = i > 0 ? words[i - 1] : '';

                // Basic bigram
                if (!map.has(word)) map.set(word, []);
                if (!map.get(word).includes(next)) map.get(word).push(next);

                // Context-aware trigram
                if (context) {
                    const contextKey = `${context}_${word}`;
                    if (!contextMap.has(contextKey)) contextMap.set(contextKey, []);
                    if (!contextMap.get(contextKey).includes(next)) {
                        contextMap.get(contextKey).push(next);
                    }
                }
            }
        }

        return { bigrams: map, trigrams: contextMap };
    }

    const { bigrams: nextWordMap, trigrams: contextMap } = buildNextWordMapFromSentences(sentences);

    // Enhanced word correction with context
    function getClosestWordFromCorpus(word, context = '') {
        let best = null;
        let min = Infinity;
        const allWords = Array.from(dictionarySet);

        for (let i = 0; i < allWords.length; i++) {
            const candidate = allWords[i];
            let dist = levenshtein(word, candidate);

            // Boost score for contextually appropriate words
            if (context && nextWordMap.has(context) && nextWordMap.get(context).includes(candidate)) {
                dist -= 0.5; // Small bonus for contextual relevance
            }

            if (dist < min && dist <= 2) {
                best = candidate;
                min = dist;
            }
            if (min <= 0.5) break; // Early exit for very good matches
        }
        return best;
    }

    // Get smart suggestions with grammar awareness
    function getSmartSuggestion(currentWords, lastWord) {
        if (!lastWord) return '';

        const previousWord = currentWords.length > 1 ? currentWords[currentWords.length - 2] : '';
        const contextKey = previousWord ? `${previousWord}_${lastWord}` : '';

        // Try context-aware suggestion first
        if (contextKey && contextMap.has(contextKey)) {
            const contextSuggestions = contextMap.get(contextKey);
            if (contextSuggestions.length > 0) {
                return contextSuggestions[0];
            }
        }

        // Fall back to bigram suggestion
        const bigramSuggestions = nextWordMap.get(lastWord);
        if (bigramSuggestions && bigramSuggestions.length > 0) {
            return bigramSuggestions[0];
        }

        return '';
    }

    // Sync scroll between textarea and suggestion overlay
    const syncScroll = () => {
        if (textareaRef.current && suggestionRef.current) {
            suggestionRef.current.scrollTop = textareaRef.current.scrollTop;
            suggestionRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    };

    // Enhanced text input handler
    const handleAnswerChange = (e) => {
        const val = e.target.value;
        const endsWithSpace = val.endsWith(" ");
        let words = val.trim().split(/\s+/).filter(w => w.length > 0);
        const lastWord = words[words.length - 1]?.toLowerCase();

        if (endsWithSpace && lastWord) {
            // Step 1: Soft corrections
            if (softMap.has(lastWord)) {
                words[words.length - 1] = softMap.get(lastWord);
                const correctedText = addSmartPunctuation(words.join(" "));
                setSelectedAnswer(correctedText + " ");
                setSuggestion("");
                return;
            }

            // Step 2: Fuzzy correction with context
            if (!dictionarySet.has(lastWord)) {
                const previousWord = words.length > 1 ? words[words.length - 2] : '';
                const corrected = getClosestWordFromCorpus(lastWord, previousWord);
                if (corrected) {
                    words[words.length - 1] = corrected;
                    const correctedText = addSmartPunctuation(words.join(" "));
                    setSelectedAnswer(correctedText + " ");
                    setSuggestion("");
                    return;
                }
            }

            // Step 3: Smart prediction with grammar awareness
            const suggestion = getSmartSuggestion(words, lastWord);
            setSuggestion(suggestion);

            // Apply smart punctuation to current text
            const punctuatedText = addSmartPunctuation(words.join(" "));
            setSelectedAnswer(punctuatedText + " ");
        } else if (!endsWithSpace && lastWord && words.length > 0) {
            // Show suggestion for incomplete words
            const suggestion = getSmartSuggestion(words, lastWord);
            setSuggestion(suggestion);
            setSelectedAnswer(val);
        } else {
            setSuggestion("");
            setSelectedAnswer(val);
        }
    };

    // Handle key presses with enhanced functionality
    const handleAnswerKeyDown = (e) => {
        if (suggestion && (e.key === "Tab" || e.key === "ArrowRight")) {
            e.preventDefault();
            const currentText = selectedAnswer.trim();
            const newText = addSmartPunctuation(currentText + " " + suggestion);
            setSelectedAnswer(newText + " ");
            setSuggestion("");
        }

        // Auto-punctuation on Enter
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const currentText = selectedAnswer.trim();
            if (currentText) {
                const punctuatedText = addSmartPunctuation(currentText);
                setSelectedAnswer(punctuatedText + "\n\n");
                setSuggestion("");
            }
        }
    };

    // Calculate suggestion text with grammar awareness
    const getSuggestionText = () => {
        if (!suggestion) return "";

        const words = selectedAnswer.trim().split(/\s+/).filter(w => w.length > 0);
        const currentText = selectedAnswer;

        // If the text ends with space, show suggestion as next word
        if (currentText.endsWith(" ")) {
            return currentText + suggestion;
        }

        // If typing a word, complete it with suggestion
        const lastWord = words[words.length - 1]?.toLowerCase();
        if (lastWord && suggestion.startsWith(lastWord)) {
            const completion = suggestion.slice(lastWord.length);
            return currentText + completion;
        }

        return currentText + " " + suggestion;
    };

    useEffect(() => {
        requestAnimationFrame(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        });
    }, []);

    // Get subscription status from localStorage
    // const subscribed = localStorage.getItem('subscribed') === 'true';
    const subscribed = true

    // Constants
    const phasePaths = [
        "Ideation",
        "ProductDefinition",
        "InitialDesign",
        "ValidatingAndTesting",
        "Commercialization"
    ];

    const phaseUrls = {
        Ideation: ["/go/Ideation"],
        ProductDefinition: ["/customFinancial", "/branding", "/go/ProductDefinition"],
        InitialDesign: ["/go/InitialDesign"],
        ValidatingAndTesting: ["/go/ValidatingAndTesting"],
        Commercialization: ["/go/Commercialization"],
    };

    // Helper functions
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };
    // Your formatPhase function stays the same
    const formatPhase = (text) => {
        const sentences = text.split(/(?<=[.!?])\s+/);
        const formattedText = sentences
            .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1))
            .join(" ");
        return formattedText;
    }



    const formatLabel = (url) => {
        if (url === "/customFinancial") return "Custom Financial Projection";
        if (url === "/branding") return "Branding";
        if (url.startsWith("/go/")) return "Go No Go";
        return url.replace("/go/", "").replace("/", "").toUpperCase();
    };
    const formatPhaseName = (phase) => {
        return phase.replace(/([a-z])([A-Z])/g, '$1 $2');
    };

    // Computed properties
    const formattedPhase = formatPhaseName(phase);
    const urls = phaseUrls[phase] || [];

    // Correct way to get the third sentence
    const thirdSentence = (() => {
        const sentences = twoLine.split(/(?<=[.!?])\s+/); // Split on punctuation followed by space
        if (sentences.length > 3) {
            return sentences[3]; // If more than 3, get the fourth sentence (index 3)
        } else {
            return sentences[2] || ''; // If only 3 or less, get the third (index 2)
        }
    })();

    console.log(thirdSentence);




    const shouldShowEstimatePrompt = questions[currentIndex]?.question && (
        questions[currentIndex]?.question.includes("estimated cost to serve one user") ||
        questions[currentIndex]?.question.includes("how many users do you project")
    );

    const isUserProjectionQuestion = questions[currentIndex]?.question?.includes("how many users do you project");

    const progress = questions.length > 0 ? Math.round((currentIndex / questions.length) * 100) : 0;

    // API calls
    const fetchTask = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/timeline/projects/${projectId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                const data = await response.json();
                setBoxes(data);
            } else {
                const result = await response.json();
                console.error('Error:', result['error']);
            }
        } catch (err) {
            console.error("Error fetching tasks:", err);
        }
    };

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/test-new/questions/${phase}/${projectId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();

            if (data.data?.length > 0) {
                setQuestions(data.data);
                setCurrentIndex(0);
            } else {
                setPhaseComplete(true);
                await fetchTwoLine(); // fire and forget
                await fetchSummaries();
            }

            // fetchSummaries();

            fetchTask(); // fire and forget
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
        setLoading(false);
    };


    const fetchSummaries = async () => {
        setLoading(true);
        const startTime = Date.now();

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

            if (data.status === 200) {
                console.log(data);

            }
        } catch (error) {
            console.error("Error fetching summaries:", error);
        }

        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, 1500 - elapsed);

        setTimeout(() => {
            setLoading(false);
        }, delay);
    };

    const regenerateOptions = async (questionId) => {
        setRegenerating(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/test-new/questions/generate/${questionId}/${projectId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            if (data.data) {
                setQuestions((prev) =>
                    prev.map((q) =>
                        q._id === questionId
                            ? { ...q, options: data.data.options, optionsCount: data.data.count }
                            : q
                    )
                );
            }
        } catch (error) {
            console.error("Error regenerating options:", error);
        }
        setRegenerating(false);
    };

    const handleSubmit = async () => {
        if (!selectedAnswer.trim()) {
            alert("Please select or type an answer.");
            return;
        }

        setSubmitting(true);
        const currentQuestion = questions[currentIndex];

        try {
            const response = await fetch(`${API_BASE_URL}/api/test-answer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    data: {
                        userId,
                        questionId: currentQuestion._id,
                        phase,
                        projectId,
                        answer: selectedAnswer,
                    },
                }),
            });

            const data = await response.json();
            if (data.status === 200) {
                console.log("Answer submitted successfully:", data);
                setSelectedAnswer("");

                if (currentIndex + 1 < questions.length) {
                    setCurrentIndex((prevIndex) => prevIndex + 1);
                    // Scroll to top after going to next question
                    window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                    setPhaseComplete(true);
                    fetchTwoLine();
                    // Scroll to top after completing phase
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            }
        } catch (error) {
            console.error("Error submitting answer:", error);
        }

        setSubmitting(false);
    };


    const fetchTwoLine = async () => {
        setLoadingTest(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/two/summary/${phase}/${projectId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            if (data.status === 200) {
                setTwoLine(data.data);
                // Do NOT reload on success
            } else {
                console.warn("Unexpected response status:", data);
                window.location.reload(); // Reload only on unexpected response
            }
        } catch (error) {
            console.error("Error fetching summaries:", error);
            window.location.reload(); // Optional: reload on error too if needed
        } finally {
            setLoadingTest(false); // ✅ Always stop loading
        }
    };
    

    const getNextPhase = () => {
        const currentIndex = phasePaths.indexOf(phase);
        if (currentIndex === -1 || currentIndex >= phasePaths.length - 1) return;

        const nextPhase = phasePaths[currentIndex + 1];
        navigate(`/test-ai/${nextPhase}`);
    };

    const handleSubscriptionClick = () => {
        if (subscribed) {
            getNextPhase();
        } else {
            setShowPayment(true);
            alert("Please subscribe to see the next phase.");
        }
    };

    // Effects
    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        const currentIndex = phasePaths.indexOf(phase);
        if (currentIndex === -1 || currentIndex >= phasePaths.length - 1) return;

        const nextPickPhase = phasePaths[currentIndex + 1];
        setNextPhase(formatPhase(nextPickPhase));
    }, [phase]);

    // useEffect(() => {
    //     if (formattedPhase === "Ideation") {
    //         fetchTwoLine();
    //     }
    // }, [formattedPhase]);

    useEffect(() => {
        if (!subscribed && phase !== "Ideation") {
            navigate("/test-ai/Ideation", { replace: true });
        }
    }, [phase, navigate]);

    return (
        <div className="font-sans min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto relative px-4 md:px-6">
                {/* Background Elements */}
                <div className="absolute inset-0 mt-[50px] ml-[60px] z-[-100] bg-no-repeat bg-cover w-[200px] h-[200px]"
                    style={{ backgroundImage: `url(${circle})` }}>
                </div>

                <div className="fixed bottom-0 right-0 z-[-100] m-0 p-0 w-[250px] h-[250px] bg-no-repeat"
                    style={{
                        backgroundImage: `url(${feedback})`,
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                    }}>
                </div>

                {/* Payment Modal */}
                {/* {showPayment && <GetCard />} */}

                {/* Top Navigation */}
                <div className="flex items-center justify-between gap-5 py-4 border-b border-gray-200">
                    <button
                        className="bg-[#193FAE] px-4 md:px-6 py-2 gap-2 text-white rounded-3xl shadow-md hover:bg-[#162E8D] flex items-center transition"
                        onClick={() => navigate('/start')}
                    >
                        <FaArrowLeft size={12} />
                        <span>Phases</span>
                    </button>

                    <p className="text-center font-bold text-xl md:text-xl">
                        {formattedPhase} Phase
                    </p>

                    <div className="w-[100px] flex justify-end">
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 transition"
                            onClick={() => navigate('/start')}
                            aria-label="Home"
                        >
                            <FaHome size={20} className="text-blue-600" />
                        </button>
                    </div>
                </div>

                {/* Phase Navigation Options */}
                <div className="flex flex-col items-center gap-4 py-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleVisibility}
                            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                            aria-label={isVisible ? "Hide tools" : "Show tools"}
                        >
                            {isVisible ?
                                <FaTimesCircle className="w-5 h-5 text-gray-700" /> :
                                <FaTools className="w-5 h-5 text-gray-700" />
                            }
                        </button>

                        {isVisible && (
                            <div className="flex flex-wrap gap-3 justify-center">
                                {urls.map((url, index) => (
                                    <button
                                        key={index}
                                        onClick={() => navigate(url)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                                    >
                                        {formatLabel(url)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="min-h-[70vh] bg-white bg-[url('./images/pattern_landscape.png')] bg-cover bg-no-repeat rounded-lg shadow-sm">
                    <div className="flex flex-col items-center gap-4 p-6 min-h-screen max-w-4xl mx-auto">
                        {phaseComplete ? (
                            // Completion Message
                            <div className="text-center bg-white shadow-lg p-8 rounded-lg w-full max-w-lg border border-gray-100">
                                <div className="text-2xl md:text-3xl font-bold text-green-600 mb-6">
                                    🎉 <br /> Congratulations! <br /> 🎉
                                </div>

                                <p className="text-lg mb-6">
                                    You have successfully completed the <strong>{formattedPhase}</strong> phase.
                                </p>
                                {formattedPhase === "Ideation" && (
                                    loadingTest ? (
                                        <div className="p-5 my-6 flex justify-center">
                                            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                                        </div>
                                    ) : twoLine && twoLine.trim() !== "" ? ( // More explicit check
                                        <div
                                            className="text-base font-semibold p-5 my-6 text-gray-700 bg-gray-50 rounded-lg space-y-4 border border-gray-200"
                                            dangerouslySetInnerHTML={{
                                                __html: (() => {
                                                    const parts = typeof twoLine === "string" ? twoLine.split(/(?<=[.!?])\s+/) : [];
                                                    if (parts.length > 3) {
                                                        const newParts = [
                                                            parts[0],
                                                            parts[1] + ' ' + parts[2],
                                                            parts[3],
                                                        ];
                                                        return newParts.map(sentence => sentence.trim()).join('<br /><br />');
                                                    }
                                                    return parts.map(sentence => sentence.trim()).join('<br /><br />');
                                                })()
                                            }}
                                        />
                                    ) : (
                                        <p className="p-5 my-6 text-gray-500 text-sm text-center">No summary available.</p>
                                    )
                                )}

                                <button
                                    onClick={() => navigate(`/summary-phase/${phase}`, {
                                        state: { thirdSentence: thirdSentence }
                                    })}
                                    className="mt-6 bg-blue-600 text-white py-3 px-6 text-lg rounded-lg hover:bg-blue-700 transition-colors shadow-md w-full md:w-auto"
                                >
                                    View your Executive Business Summary
                                </button>
                            </div>
                        ) : (
                            // Questions Interface
                            <>
                                {/* Progress Bar */}
                                {questions.length > 0 && (
                                    <div className="w-full max-w-3xl mb-6">
                                        <div className="flex justify-between text-sm text-gray-600 mb-2 px-1">
                                            <span>Question {currentIndex + 1} of {questions.length}</span>
                                            <span>{progress}% Complete</span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {loading ? (
                                    // Loading State
                                        <div className="flex flex-col items-center justify-center p-8 w-full min-h-[300px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
                                            {/* Pulse ring */}
                                            <div className="relative w-16 h-16">
                                                <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
                                                <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 animate-ping"></div>
                                            </div>

                                            {/* Loading Text */}
                                            <div className="text-center mt-6">
                                                <p className="text-gray-700 text-lg font-semibold">Loading questions...</p>
                                                <p className="text-gray-500 text-sm">Please wait while we prepare your content</p>
                                            </div>

                                            {/* Progress dots */}
                                            <div className="flex space-x-2 mt-6">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                            </div>
                                        </div>

                                ) : questions.length > 0 && questions[currentIndex] ? (
                                    // Question Card
                                    <div className="w-full p-6 md:p-8 bg-white shadow-lg rounded-xl border border-gray-200">
                                        <p className="md:text-2xl text-xl font-semibold text-gray-800 border-b pb-4 mb-6">
                                            {questions[currentIndex]?.question}
                                        </p>

                                        {/* Estimate Prompt */}
                                        {shouldShowEstimatePrompt ? (
                                            <div className="my-6 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-100 flex items-start gap-3">
                                                <div className="bg-blue-100 p-2 rounded-full mt-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 space-y-6">
                                                    {questions[currentIndex]?.question?.toLowerCase().includes("revenue and cost strategy") ? (
                                                        <>
                                                            <div>
                                                                <p className="font-medium mb-1">Abby recommends you select <strong>3 or 4</strong> revenue strategies:</p>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                                                    {[
                                                                        "Advertising model",
                                                                        "Freemium model",
                                                                        "Licensing model",
                                                                        "Markup model",
                                                                        "Production model",
                                                                        "Subscription model"
                                                                    ].map((option, index) => (
                                                                        <label
                                                                            key={index}
                                                                            className={`flex items-center gap-2 p-3 border rounded-md text-sm cursor-pointer
                                        ${selectedAnswer.includes(option)
                                                                                    ? "bg-blue-100 border-blue-300"
                                                                                    : "bg-white hover:bg-blue-50 border-blue-200"}`}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                value={option}
                                                                                checked={selectedAnswer.includes(option)}
                                                                                onChange={(e) => {
                                                                                    const updated = e.target.checked
                                                                                        ? [...selectedAnswer, option]
                                                                                        : selectedAnswer.filter((item) => item !== option);
                                                                                    setSelectedAnswer(updated);
                                                                                }}
                                                                                className="form-checkbox text-blue-600"
                                                                            />
                                                                            <span>{option}</span>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="mt-6 space-y-3">
                                                                <p className="font-medium">Cost of Production / Cost to Serve</p>
                                                                <div className="flex flex-col sm:flex-row gap-4">
                                                                    <label className="flex items-center gap-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            value="Full Year"
                                                                            checked={selectedAnswer.includes("Full Year")}
                                                                            onChange={(e) => {
                                                                                const updated = e.target.checked
                                                                                    ? [...selectedAnswer, "Full Year"]
                                                                                    : selectedAnswer.filter((item) => item !== "Full Year");
                                                                                setSelectedAnswer(updated);
                                                                            }}
                                                                            className="form-checkbox text-blue-600"
                                                                        />
                                                                        Full year cost?
                                                                    </label>
                                                                    <label className="flex items-center gap-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            value="Per User"
                                                                            checked={selectedAnswer.includes("Per User")}
                                                                            onChange={(e) => {
                                                                                const updated = e.target.checked
                                                                                    ? [...selectedAnswer, "Per User"]
                                                                                    : selectedAnswer.filter((item) => item !== "Per User");
                                                                                setSelectedAnswer(updated);
                                                                            }}
                                                                            className="form-checkbox text-blue-600"
                                                                        />
                                                                        Cost per user?
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : questions[currentIndex]?.question?.includes("how many users do you project") ? (
                                                        <>
                                                            <p className="font-medium mb-1">Select your projected user range</p>
                                                            <select
                                                                className="mt-1 block w-full bg-white border border-blue-200 rounded-md shadow-sm p-2 text-sm"
                                                                value={selectedAnswer}
                                                                onChange={(e) => setSelectedAnswer(e.target.value)}
                                                            >
                                                                <option value="">Select an option</option>
                                                                <option value="1 to 100">A. 1 to 100</option>
                                                                <option value="101 to 1,000">B. 101 to 1,000</option>
                                                                <option value="1,001 to 10,000">C. 1,001 to 10,000</option>
                                                                <option value="10,001 to 100,000">D. 10,001 to 100,000</option>
                                                                <option value="Over 100,000 customers">E. Over 100,000 customers</option>
                                                            </select>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="font-medium mb-1">Provide your estimate</p>
                                                            <p className="text-sm">Consider all relevant factors and be as specific as possible with your response.</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            // Multiple Choice Options
                                            <form className="mb-6 space-y-3">
                                                {regenerating ? (
                                                    <div className="text-gray-500 italic flex items-center justify-center gap-2 p-6 bg-gray-50 rounded-lg">
                                                        <AiOutlineLoading3Quarters className="animate-spin text-blue-500" />
                                                        <span>Regenerating options...</span>
                                                    </div>
                                                ) : questions[currentIndex]?.options?.length > 0 ? (
                                                    questions[currentIndex]?.options.map((opt, index) => (
                                                        <label
                                                            key={index}
                                                            className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border transition text-lg
                                                                ${selectedAnswer === opt
                                                                    ? "bg-blue-50 border-blue-300 shadow-sm"
                                                                    : "hover:bg-gray-50 border-gray-200"}`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="answer"
                                                                value={opt}
                                                                checked={selectedAnswer === opt}
                                                                onChange={(e) => setSelectedAnswer(e.target.value)}
                                                                className="form-radio text-blue-600 h-5 w-5"
                                                            />
                                                            <span>{opt}</span>
                                                        </label>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 italic p-4 bg-gray-50 rounded-lg text-center">
                                                        No options available for this question.
                                                    </p>
                                                )}
                                            </form>
                                        )}

                                        {/* Text Input Area */}
                                        <div className="mb-6">
                                            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                                                Your Answer is below: you can further refine it to suit your thoughts
                                            </label>
                                            <div style={{ position: "relative", width: "100%" }}>
                                                {/* Active user textarea */}
                                                <textarea
                                                    ref={textareaRef}
                                                    id="answer"
                                                    className="w-full p-4 min-h-[12rem] border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-all relative z-10 bg-transparent"
                                                    placeholder="Type your answer here..."
                                                    value={selectedAnswer}
                                                    onChange={handleAnswerChange}
                                                    onKeyDown={handleAnswerKeyDown}
                                                    style={{ backgroundColor: "transparent" }}
                                                />
                                            </div>

                                            {/* Suggestion hint */}
                                            {suggestion && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Suggestion: <strong>{suggestion}</strong> – use <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Tab</kbd> or <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">→</kbd> to insert
                                                </p>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-6 flex flex-col md:flex-row gap-4">
                                            {!shouldShowEstimatePrompt && (
                                                <button
                                                    onClick={() => regenerateOptions(questions[currentIndex]._id)}
                                                    className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors
                                                        ${questions[currentIndex]?.optionsCount >= 2 || regenerating
                                                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                            : "bg-yellow-500 text-white hover:bg-yellow-600"}`}
                                                    disabled={regenerating || questions[currentIndex]?.optionsCount >= 2}
                                                >
                                                    <FaRedo />
                                                    <span>Regenerate Options ({questions[currentIndex]?.optionsCount}/2)</span>
                                                </button>
                                            )}

                                            <button
                                                onClick={handleSubmit}
                                                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors
                                                    ${!selectedAnswer.trim() || submitting
                                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                        : "bg-green-600 text-white hover:bg-green-700"}`}
                                                disabled={submitting || !selectedAnswer.trim()}
                                            >
                                                {submitting ? (
                                                    <>
                                                        <AiOutlineLoading3Quarters className="animate-spin" />
                                                        <span>Submitting...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaCheck />
                                                        <span>Submit Answer</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ) : null}
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}