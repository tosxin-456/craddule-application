import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../config/apiConfig";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

function QuestionsForm() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const textareaRefs = useRef({});
  const access_token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;
  const projectId = localStorage.getItem("nProject");
  const category = "NONE";

  // Word counter
  const countWords = (text) =>
    text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;

  // Encouraging message (max 100 words)
  const getEncouragingMessage = (wordCount) => {
    if (wordCount < 100) {
      return "Keep going—Abby would love to hear a little more from you!";
    } else if (wordCount >= 100 && wordCount <= 250) {
      return "Fantastic! You're doing really well—keep sharing your thoughts.";
    }
    return "";
  };

  // Fetch questions
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
        if (!data || !data.data || data.data.length === 0) {
          navigate("/start");
        } else {
          const sortedQuestions = data.data.sort(
            (a, b) => parseInt(a.questionOrder) - parseInt(b.questionOrder)
          );
          setQuestions(sortedQuestions);

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

  // Handle textarea changes
  const handleTextChange = (e, questionId, order) => {
    const val = e.target.value;
    const words = val.trim().split(/\s+/).filter(Boolean);

    if ([1, 5, 6].includes(order)) {
      // Q1, Q5, Q6 → max 100 words
      if (words.length <= 100) {
        setAnswers((prev) => ({
          ...prev,
          [questionId]: val
        }));
      }
    } else {
      // Others → max 250 words
      if (words.length <= 250) {
        setAnswers((prev) => ({
          ...prev,
          [questionId]: val
        }));
      }
    }
  };

  // Progress bar calculation
  const calculateProgress = (wordCount) => {
    if (wordCount >= 100) return 100;
    return Math.min((wordCount / 100) * 100, 100);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      for (const question of questions) {
        const data = {
          userId,
          projectId,
          questionId: question?._id,
          answer: answers[question?._id],
          phase: category
        };

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
      }

      navigate("/start");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentStep];
  const currentAnswer = answers[currentQuestion?._id] || "";
  const wordCount = countWords(currentAnswer);
  const progress = calculateProgress(wordCount);
  const encouragingMessage = getEncouragingMessage(wordCount);

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const isLastStep = currentStep === questions.length - 1;
  const completedSteps = Object.keys(answers).filter((key) =>
    answers[key]?.trim()
  ).length;

  return (
    <div
      style={{ fontFamily: "Manrope" }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4"
    >
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-800 px-8 py-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
                Craddule
              </h1>
              <p className="text-blue-100 text-xl opacity-90">
                Bringing your vision to life
              </p>
            </div>

            {/* Progress Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <span className="text-blue-100 text-sm font-medium">
                  Progress
                </span>
                <span className="text-blue-100 text-sm font-medium">
                  {currentStep + 1} of {questions.length}
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-white to-blue-100 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${((currentStep + 1) / questions.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-12">
          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-6 mb-8 animate-shake">
              <p className="text-red-700 text-center font-medium">
                {errorMessage}
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col justify-center items-center h-80">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0"></div>
              </div>
              <p className="text-gray-600 text-lg mt-6 font-medium">
                Processing your responses...
              </p>
            </div>
          ) : (
            <div
              className={`transition-all duration-500 ${
                isTransitioning
                  ? "opacity-0 transform translate-y-8"
                  : "opacity-100 transform translate-y-0"
              }`}
            >
              {/* Question */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
                  <span className="mr-2">Question</span>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                    {currentQuestion?.questionOrder}
                  </span>
                </div>
                <p className="text-xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight max-w-4xl mx-auto mb-8">
                  {currentQuestion?.question}
                </p>
              </div>

              {/* Answer */}
              <div className="max-w-4xl mx-auto">
                <div className="relative mb-8">
                  <textarea
                    ref={(el) =>
                      (textareaRefs.current[currentQuestion?._id] = el)
                    }
                    className="w-full p-8 border-2 border-gray-200 rounded-2xl focus:border-blue-500 
      focus:ring-4 focus:ring-blue-50 transition-all duration-300 resize-none 
      text-gray-700 placeholder-gray-400 text-lg leading-relaxed min-h-[300px] 
      shadow-sm hover:shadow-md"
                    placeholder="Share your thoughts here..."
                    value={currentAnswer}
                    onChange={(e) =>
                      handleTextChange(
                        e,
                        currentQuestion?._id,
                        currentQuestion?.questionOrder
                      )
                    }
                    style={{ fontSize: "16px" }}
                  />
                  <div className="text-right text-sm text-gray-500 mt-2">
                    {countWords(currentAnswer)}/
                    {["1", "2", "5"].includes(
                      String(currentQuestion?.questionOrder)
                    )
                      ? 100
                      : 250}{" "}
                    words
                  </div>
                  {encouragingMessage && (
                    <p className="text-blue-600 text-sm mt-1">
                      {encouragingMessage}
                    </p>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-4 sm:pt-6 border-t border-gray-100 space-y-4 sm:space-y-0">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`flex items-center px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 w-full sm:w-auto justify-center ${
                    currentStep === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md"
                  }`}
                >
                  <ChevronLeft size={20} className="mr-2" />
                  Previous
                </button>

                <div className="flex flex-col-reverse sm:flex-row items-center space-y-reverse space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                  {isLastStep ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!currentAnswer.trim()}
                      className={`flex items-center px-6 sm:px-8 py-3 rounded-xl font-medium transition-all 
                      duration-200 w-full sm:w-auto justify-center ${
                        currentAnswer.trim()
                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-lg transform hover:scale-105"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Complete Setup
                      <CheckCircle size={20} className="ml-2" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!currentAnswer.trim()}
                      className={`flex items-center px-4 sm:px-6 py-3 rounded-xl font-medium transition-all 
                      duration-200 w-full sm:w-auto justify-center ${
                        currentAnswer.trim()
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:shadow-lg transform hover:scale-105"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Continue
                      <ChevronRight size={20} className="ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-t border-gray-100">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Progress: {completedSteps} of {questions.length} questions
              completed
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Auto-saved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionsForm;
