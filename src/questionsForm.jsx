import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../config/apiConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import softCorrections from "../softCorrections.json";
import sentences from "../sentences.json";
import wordlist from "../wordlist.json";

function QuestionsForm() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [suggestions, setSuggestions] = useState({});
  const navigate = useNavigate();
  const [limitMessage, setLimitMessage] = useState("");

  // Refs for textareas and suggestion overlays
  const textareaRefs = useRef({});
  const suggestionRefs = useRef({});
  const softMap = new Map(Object.entries(softCorrections));
  const dictionarySet = new Set(wordlist.map((w) => w.toLowerCase()));

  const access_token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;
  const projectId = localStorage.getItem("nProject");
  const category = "NONE";

  // Function to count words in a text
  // Count words utility
  const countWords = (text) =>
    text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;

  // Modified handleTextChange to enforce max 100 words
  const handleTextChange = (e, questionId) => {
    const val = e.target.value;
    const words = val.trim().split(/\s+/).filter(Boolean);

    if (words.length <= 100) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: val
      }));
    }
  };

  // Function to calculate progress percentage
  const calculateProgress = (wordCount, minWords = 100) => {
    return Math.min((wordCount / minWords) * 100, 100);
  };

  // Function to check if a question should show word counter (last 2 questions only)
  const shouldShowWordCounter = (question, questionsArray) => {
    const totalQuestions = questionsArray.length;
    const questionIndex = questionsArray.findIndex(
      (q) => q._id === question._id
    );
    return questionIndex >= totalQuestions - 2; // Show for last 2 questions
  };

  // Function to check if all questions meet word count requirements
  const checkWordCountRequirements = () => {
    const totalQuestions = questions.length;
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const isQuestion1 = question.questionOrder === "1";
      const isLastTwoQuestions = i >= totalQuestions - 2;

      if (!isQuestion1 && isLastTwoQuestions) {
        // Skip validation for question 1, but check last 2
        const currentAnswer = answers[question._id] || "";
        const wordCount = countWords(currentAnswer);
        if (wordCount < 100) {
          return false;
        }
      }
    }
    return true;
  };

  // Function to get questions that don't meet word count requirements
  const getInsufficientWordCountQuestions = () => {
    const insufficient = [];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const isQuestion2Or5 =
        question.questionOrder === "2" || question.questionOrder === "5";

      if (isQuestion2Or5) {
        const currentAnswer = answers[question._id] || "";
        const wordCount = countWords(currentAnswer);
        if (wordCount < 100) {
          insufficient.push(question.questionOrder);
        }
      }
    }
    return insufficient;
  };

  const grammarRules = {
    commaAfter: new Set([
      "however",
      "therefore",
      "moreover",
      "furthermore",
      "consequently",
      "nevertheless",
      "meanwhile",
      "otherwise",
      "thus",
      "hence",
      "indeed",
      "specifically",
      "particularly",
      "essentially",
      "basically",
      "generally",
      "typically",
      "usually",
      "obviously",
      "clearly",
      "fortunately",
      "unfortunately",
      "surprisingly",
      "interestingly"
    ]),
    commaBefore: new Set([
      "and",
      "but",
      "or",
      "nor",
      "for",
      "so",
      "yet",
      "while",
      "although",
      "though",
      "because",
      "since",
      "unless",
      "until",
      "after",
      "before",
      "when",
      "where",
      "if"
    ]),
    sentenceStarters: new Set([
      "the",
      "a",
      "an",
      "this",
      "that",
      "these",
      "those",
      "my",
      "your",
      "his",
      "her",
      "its",
      "our",
      "their",
      "some",
      "many",
      "few",
      "all",
      "most",
      "each",
      "every",
      "no",
      "one",
      "two",
      "first",
      "last",
      "next",
      "previous",
      "i",
      "you",
      "he",
      "she",
      "it",
      "we",
      "they"
    ]),
    questionWords: new Set([
      "what",
      "when",
      "where",
      "why",
      "how",
      "who",
      "which",
      "whose",
      "whom"
    ]),
    articles: new Set(["a", "an", "the"]),
    prepositions: new Set([
      "in",
      "on",
      "at",
      "by",
      "for",
      "with",
      "without",
      "through",
      "during",
      "before",
      "after",
      "above",
      "below",
      "under",
      "over",
      "between",
      "among",
      "within",
      "throughout"
    ])
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
        else
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
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

    const firstWord = words[0]?.toLowerCase();
    analysis.isQuestion = grammarRules.questionWords.has(firstWord);
    analysis.needsCapitalization =
      words.length > 0 && words[0] === words[0].toLowerCase();

    analysis.clauseCount =
      words.filter((word) => grammarRules.commaBefore.has(word.toLowerCase()))
        .length + 1;

    analysis.needsComma = words.some((word, index) => {
      const lowerWord = word.toLowerCase();
      return (
        (grammarRules.commaAfter.has(lowerWord) && index < words.length - 1) ||
        (grammarRules.commaBefore.has(lowerWord) &&
          index > 0 &&
          analysis.clauseCount > 1)
      );
    });

    return analysis;
  }

  // Smart punctuation insertion
  function addSmartPunctuation(text, options = {}) {
    if (!text.trim()) return text;

    const { autoAddPeriod = false, minWordsForPeriod = 3 } = options;

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

      if (grammarRules.commaAfter.has(lowerWord) && i < words.length - 1) {
        if (!word.endsWith(",")) {
          words[i] = word + ",";
        }
      }

      if (
        i > 0 &&
        grammarRules.commaBefore.has(lowerWord) &&
        words.length > 6
      ) {
        const prevWord = words[i - 1];
        if (!prevWord.endsWith(",")) {
          words[i - 1] = prevWord + ",";
        }
      }

      if (
        (lowerWord === "and" || lowerWord === "or") &&
        i > 1 &&
        i < words.length - 1
      ) {
        const prevWord = words[i - 1];
        if (!prevWord.endsWith(",") && !prevWord.endsWith(".")) {
          const hasListPattern = words
            .slice(Math.max(0, i - 3), i)
            .some((w) => w.endsWith(","));
          if (hasListPattern) {
            words[i - 1] = prevWord + ",";
          }
        }
      }
    }

    result = words.join(" ");

    const lastChar = result.slice(-1);
    if (![".", "!", "?"].includes(lastChar)) {
      if (analysis.isQuestion) {
        result += "?";
      } else if (autoAddPeriod && shouldAddPeriod(words, analysis)) {
        result += ".";
      }
    }

    return result;
  }

  function shouldAddPeriod(words, analysis) {
    if (words.length < 3) return false;
    if (words.length === 1) return false;

    const isTitle = words.every(
      (word) =>
        word.charAt(0) === word.charAt(0).toUpperCase() ||
        word.toLowerCase() === word
    );
    if (isTitle && words.length <= 5) return false;

    const incompleteMarkers = [
      "and",
      "or",
      "but",
      "because",
      "since",
      "while",
      "although",
      "if",
      "when",
      "where"
    ];
    const lastWord = words[words.length - 1].toLowerCase();
    if (incompleteMarkers.includes(lastWord)) return false;

    return analysis.hasSubject || analysis.hasVerb || words.length > 5;
  }

  // Build next word map from sentences
  function buildNextWordMapFromSentences(sentences) {
    const map = new Map();
    const contextMap = new Map();

    for (const sentence of sentences) {
      const words = sentence.trim().toLowerCase().split(/\s+/);
      for (let i = 0; i < words.length - 1; i++) {
        const word = words[i];
        const next = words[i + 1];
        const context = i > 0 ? words[i - 1] : "";

        if (!map.has(word)) map.set(word, []);
        if (!map.get(word).includes(next)) map.get(word).push(next);

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

  const { bigrams: nextWordMap, trigrams: contextMap } =
    buildNextWordMapFromSentences(sentences);

  // Modified: Only use wordlist for suggestions, not corrections
  function getWordlistSuggestion(word) {
    let best = null;
    let min = Infinity;
    const allWords = Array.from(dictionarySet);

    for (let i = 0; i < allWords.length; i++) {
      const candidate = allWords[i];
      let dist = levenshtein(word, candidate);

      if (dist < min && dist <= 2 && dist > 0) {
        // dist > 0 ensures we don't suggest exact matches
        best = candidate;
        min = dist;
      }
      if (min <= 0.5) break;
    }
    return best;
  }

  function getSmartSuggestion(currentWords, lastWord) {
    if (!lastWord) return "";

    const previousWord =
      currentWords.length > 1 ? currentWords[currentWords.length - 2] : "";
    const contextKey = previousWord ? `${previousWord}_${lastWord}` : "";

    // Priority 1: Context-based suggestions from sentences
    if (contextKey && contextMap.has(contextKey)) {
      const contextSuggestions = contextMap.get(contextKey);
      if (contextSuggestions.length > 0) {
        return contextSuggestions[0];
      }
    }

    // Priority 2: Bigram suggestions from sentences
    const bigramSuggestions = nextWordMap.get(lastWord);
    if (bigramSuggestions && bigramSuggestions.length > 0) {
      return bigramSuggestions[0];
    }

    // Priority 3: Only suggest from wordlist if word is not in dictionary and is being typed
    if (!dictionarySet.has(lastWord) && lastWord.length > 2) {
      const wordlistSuggestion = getWordlistSuggestion(lastWord);
      if (wordlistSuggestion) {
        return wordlistSuggestion;
      }
    }

    return "";
  }

  // Function to get encouraging message based on word count
  const getEncouragingMessage = (wordCount) => {
    if (wordCount < 100) {
      return "Please tell Abby some more";
    } else if (wordCount >= 100 && wordCount <= 250) {
      return "You are on a roll, keep the flow going";
    }
    return "";
  };

  const fetchUnansweredQuestions = async () => {
    setErrorMessage("");
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/test-new/questions/${category}/${projectId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (!data || !data.data || data.data.length === 0) {
          navigate("/start");
        } else {
          // Sort questions by questionOrder
          const sortedQuestions = data.data.sort((a, b) => {
            return parseInt(a.questionOrder) - parseInt(b.questionOrder);
          });
          setQuestions(sortedQuestions);

          // Initialize answers object
          const initialAnswers = {};
          sortedQuestions.forEach((q) => {
            initialAnswers[q._id] = "";
          });
          setAnswers(initialAnswers);
        }
      } else {
        throw new Error("Failed to fetch questions.");
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessage("Failed to fetch questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnansweredQuestions();
  }, []);



  const handleKeyDown = (e, questionId) => {
    const suggestion = suggestions[questionId];

    if (suggestion && (e.key === "Tab" || e.key === "ArrowRight")) {
      e.preventDefault();
      const currentText = answers[questionId].trim();
      const newText = addSmartPunctuation(currentText + " " + suggestion);
      setAnswers((prev) => ({
        ...prev,
        [questionId]: newText + " "
      }));
      setSuggestions((prev) => ({
        ...prev,
        [questionId]: ""
      }));
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const currentText = answers[questionId].trim();
      if (currentText) {
        const punctuatedText = addSmartPunctuation(currentText);
        setAnswers((prev) => ({
          ...prev,
          [questionId]: punctuatedText + "\n\n"
        }));
        setSuggestions((prev) => ({
          ...prev,
          [questionId]: ""
        }));
      }
    }
  };

  // Get suggestion text
  const getSuggestionText = (questionId) => {
    const suggestion = suggestions[questionId];
    if (!suggestion) return "";

    const words = answers[questionId]
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    const currentText = answers[questionId];

    if (currentText.endsWith(" ")) {
      return currentText + suggestion;
    }

    const lastWord = words[words.length - 1]?.toLowerCase();
    if (lastWord && suggestion.startsWith(lastWord)) {
      const completion = suggestion.slice(lastWord.length);
      return currentText + completion;
    }

    return currentText + " " + suggestion;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check word count requirements before submitting
    if (!checkWordCountRequirements()) {
      const insufficientQuestions = getInsufficientWordCountQuestions();
      setErrorMessage(
        `Please ensure the last 2 questions have at least 100 words. Question(s) ${insufficientQuestions.join(
          ", "
        )} need more content.`
      );
      return;
    }

    setLoading(true);
    setErrorMessage(""); // Clear any existing error messages

    try {
      for (const question of questions) {
        const data = {
          userId,
          projectId,
          questionId: question._id,
          answer: answers[question._id],
          phase: category
        };

        console.log("Submitting:", data);

        const response = await fetch(`${API_BASE_URL}/api/test-answer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`
          },
          body: JSON.stringify({ data })
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || "Failed to submit the answer.");
        }

        console.log("Answer submitted for question:", question._id);
      }

      navigate("/start");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if submit button should be disabled
  const isSubmitDisabled = loading || !checkWordCountRequirements();

  return (
    <div
      style={{
        fontFamily: "Manrope"
      }}
      className="min-h-screen bg-gray-50 flex items-center justify-center p-2 sm:p-4"
    >
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl p-4 sm:p-6 md:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            Welcome to Craddule
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-4 sm:mb-6 px-2 sm:px-0">
            To help us personalise your environment, we need to understand
            certain aspects of this idea you have. Please fill in the following
            questions - the more robustly you answer them, the better the output
            will be.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-red-600 text-center text-sm sm:text-base">
              {errorMessage}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-32 sm:h-40">
            <FontAwesomeIcon
              icon={faCircleNotch}
              className="fa-spin text-3xl sm:text-4xl text-blue-600"
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {questions.map((question, index) => {
              const isQuestion2Or5 =
                question.questionOrder === "2" ||
                question.questionOrder === "5";
              const showWordCounter = isQuestion2Or5;
              const currentAnswer = answers[question._id] || "";
              const wordCount = countWords(currentAnswer);
              const progress = calculateProgress(wordCount);
              const encouragingMessage = getEncouragingMessage(wordCount);
              const suggestionText = getSuggestionText(question._id);

              return (
                <div key={question._id} className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                    <label
                      htmlFor={`question-${question._id}`}
                      className="block text-base sm:text-lg font-semibold text-gray-800 leading-relaxed flex-1 sm:pr-4"
                    >
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mr-2 sm:mr-3">
                        Q {question.questionOrder}.
                      </span>
                      {question.question}
                    </label>

                    {/* Word counter with progress bar for questions 2 and 5 only */}
                    {showWordCounter && (
                      <div className="flex-shrink-0 sm:ml-4 w-full sm:w-auto">
                        <div
                          className={`border rounded-lg p-2 sm:p-3 sm:min-w-[220px] ${
                            wordCount >= 100
                              ? "bg-green-50 border-green-200"
                              : "bg-yellow-50 border-yellow-200"
                          }`}
                        >
                          <div
                            className={`text-xs sm:text-sm font-medium mb-2 text-center ${
                              wordCount >= 100
                                ? "text-green-700"
                                : "text-yellow-700"
                            }`}
                          >
                            Word Count: {wordCount} / 100
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 mb-2">
                            <div
                              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ease-out ${
                                wordCount >= 100
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                              }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>

                          {/* Progress percentage */}
                          <div
                            className={`text-xs font-medium text-center mb-2 ${
                              wordCount >= 100
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {Math.round(progress)}% complete
                          </div>

                          {encouragingMessage && (
                            <div
                              className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 sm:py-2 rounded-md ${
                                wordCount < 100
                                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                  : "bg-green-100 text-green-800 border border-green-200"
                              }`}
                            >
                              {encouragingMessage}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    {/* Suggestion overlay */}
                    {suggestionText && (
                      <div
                        className="absolute inset-0 p-3 sm:p-4 pointer-events-none text-gray-400 whitespace-pre-wrap break-words overflow-hidden"
                        style={{
                          fontFamily: "inherit",
                          fontSize: "inherit",
                          lineHeight: "inherit",
                          border: "1px solid transparent",
                          borderRadius: "0.5rem"
                        }}
                      >
                        {suggestionText}
                      </div>
                    )}

                    <textarea
                      id={`question-${question._id}`}
                      ref={(el) => (textareaRefs.current[question._id] = el)}
                      className={`relative w-full p-3 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical min-h-[100px] sm:min-h-[120px] bg-white text-sm sm:text-base ${
                        showWordCounter && wordCount < 100
                          ? "border-yellow-300"
                          : "border-gray-300"
                      }`}
                      placeholder={`Enter your answer here... ${
                        showWordCounter ? "(Minimum 100 words required)" : ""
                      } (Smart corrections and suggestions enabled)`}
                      value={currentAnswer}
                      onChange={(e) => handleTextChange(e, question._id)}
                      onKeyDown={(e) => handleKeyDown(e, question._id)}
                      rows={4}
                      style={{ zIndex: 1 }}
                    />

                    {suggestions[question._id] && (
                      <div className="absolute top-full left-0 mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded shadow-sm max-w-full truncate">
                        Press Tab or → to accept: "{suggestions[question._id]}"
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="pt-4 sm:pt-6 border-t border-gray-200">
              <button
                type="submit"
                className={`w-full rounded-lg py-3 sm:py-4 px-4 sm:px-6 font-semibold text-base sm:text-lg flex items-center justify-center transition-all duration-200 transform ${
                  isSubmitDisabled
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:scale-[1.02]"
                }`}
                disabled={isSubmitDisabled}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon
                      icon={faCircleNotch}
                      className="fa-spin mr-2"
                    />
                    Submitting Answers...
                  </>
                ) : (
                  "Submit Answers"
                )}
              </button>

              {limitMessage && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {limitMessage}
                </p>
              )}

              {!checkWordCountRequirements() && (
                <p className="text-red-600 text-xs sm:text-sm text-center mt-2 sm:mt-3 px-2 sm:px-0">
                  Please ensure questions 2 and 5 have at least 100 words before
                  submitting.
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default QuestionsForm;
