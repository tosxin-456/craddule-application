import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from './config/apiConfig';
import API_BASE_WEB_URL from './config/apiConfigW';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faFileAlt, faCommentAlt, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { Toaster } from 'sonner';
import Header from './component/header';
import { marked } from 'marked';


function ShareView() {
  const navigate = useNavigate();
  const { id, phase } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaries, setSummaries] = useState({
    summary: '',
    summary_one: '',
    summary_two: ''
  });
  const [answersV, setAnswersV] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetchSummariesAndAnswers();
  }, [phase, id]);

  const fetchSummariesAndAnswers = async () => {
    try {
      setLoading(true);

      // Fetch summaries
      const summaryResponse = await fetch(`${API_BASE_URL}/api/test-new/questions/summary/${phase}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (summaryResponse.ok) {
        const data = await summaryResponse.json();
        setSummaries({
          summary: data?.data?.summary || '',
          summary_one: data?.data?.summary_one || '',
          summary_two: data?.data?.summary_two || ''
        });
      }

      // Fetch answers
      await fetchAnswerCut();

    } catch (error) {
      setError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnswerCut = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/answer/${id}/${phase}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const data = await response.json();
        setAnswersV(data.data);
      } else {
        const result = await response.json();
        console.error('Error:', result['error']);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const createMarkup = (markdown) => {
    const html = marked(markdown);
    return { __html: html };
  };


  // Function to check if summary exists and is not empty
  const summaryExists = (summary) => {
    return summary && summary.trim() !== '';
  };

  return (<>
    <Header />
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-screen-md p-6 bg-white rounded-lg shadow-md">
        {/* Header section */}
        <div className="w-full">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
              <span className="font-medium">Back</span>
            </button>
          </div>

          <div className="text-center mb-6">
            <p className="text-2xl font-bold text-gray-800">{phase} Summary</p>
            {/* <p className="text-sm text-gray-500 mt-1">Make sure you answer all questions</p> */}
          </div>

          <div className="flex justify-end mb-6">
            <a
              className="bg-blue-700 px-6 py-2 text-white rounded-full hover:bg-blue-800 transition-colors flex items-center shadow-md"
              href={`${API_BASE_WEB_URL}/sharefeedback/${id}/${phase}`}
            >
              <FontAwesomeIcon icon={faCommentAlt} className="mr-2" />
              Give Feedback
            </a>
          </div>

          <div className="border-t border-gray-300 mb-6"></div>

          {/* Questions List */}
          {answersV.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-700 flex items-center">
                <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-blue-600" />
                Questions
              </h2>
              <div className="space-y-2">
                {answersV.map((answerV, index) => (
                  <div
                    key={answerV._id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/question/${answerV?.questionId}`)}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <p className="text-gray-700">
                      {hoveredIndex === index
                        ? answerV?.questionId?.question
                        : answerV?.questionId?.question.length > 70
                          ? `${answerV?.questionId?.question.slice(0, 70)}...`
                          : answerV?.questionId?.question}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summaries Display */}
          {loading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 p-4 rounded-md text-red-800">
              Error loading summaries: {error}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Main Summary */}
              {summaryExists(summaries.summary) && (
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center">
                    <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                    Summary
                  </h2>
                  <div

                    className="prose max-w-none text-gray-700 editor rounded-md shadow-inner min-h-[300px] p-4 break-words focus:outline-none "
                    dangerouslySetInnerHTML={createMarkup(summaries.summary)}
                  ></div>
                </div>
              )}

              {/* Summary One */}
              {summaryExists(summaries.summary_one) && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 shadow-sm">
                  <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center">
                    <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
                    Additional Summary
                  </h2>
                  <div
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={createMarkup(summaries.summary_one)}
                  ></div>
                </div>
              )}

              {/* Summary Two */}
              {summaryExists(summaries.summary_two) && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm">
                  <h2 className="text-xl font-bold mb-4 text-gray-700 flex items-center">
                    <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                    Extended Summary
                  </h2>
                  <div
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={createMarkup(summaries.summary_two)}
                  ></div>
                </div>
              )}

              {!summaryExists(summaries.summary) &&
                !summaryExists(summaries.summary_one) &&
                !summaryExists(summaries.summary_two) && (
                  <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <FontAwesomeIcon icon={faFileAlt} className="text-gray-400 text-4xl mb-3" />
                    <p className="text-gray-500">No summaries available.</p>
                  </div>
                )}
            </div>
          )}
        </div>
        <Toaster position="top-right" />
      </div>
    </div>
  </>
  );
}

export default ShareView;