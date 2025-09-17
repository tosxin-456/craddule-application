import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleNotch,
  faCheckCircle,
  faChevronLeft,
  faChevronRight,
  faTimes,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FetchUser, getUserIdFromToken } from "./utils/startUtils";
import updateProject from "./utils/projectUtils";
import { phases } from "./component/phases";

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.4, ease: "easeInOut" }
};

const Accelerate = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState([]);
  const [phaseSelections, setPhaseSelections] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [error, setError] = useState(null);
  const phase = phases[currentPhase];
  const selection = phaseSelections[phase.title];
  const navigate = useNavigate();
  const { userId } = getUserIdFromToken();

  // Fetch user details
  FetchUser(userId, setUserDetails, setError, setLoading);

  const handlePhaseCompletion = (hasUnderstood) => {
    const phase = phases[currentPhase];
    setPhaseSelections((prev) => ({
      ...prev,
      [phase.title]: hasUnderstood
    }));

    if (
      hasUnderstood &&
      !completedPhases.some((p) => p.title === phase.title)
    ) {
      setCompletedPhases((prev) => [...prev, phase]);
    } else if (
      !hasUnderstood &&
      completedPhases.some((p) => p.title === phase.title)
    ) {
      setCompletedPhases((prev) => prev.filter((p) => p.title !== phase.title));
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    setApiResponse(null);

    try {
      await updateProject(
        completedPhases,
        "Craddule sprint",
        setLoading,
        navigate
      );

      setApiResponse({
        success: true,
        message: `Assessment completed successfully! You understood ${completedPhases.length} out of ${phases.length} phases.`,
        data: {
          completedPhases,
          projectName: "Craddule sprint",
          phaseSelections,
          totalPhases: phases.length,
          understoodCount: completedPhases.length
        }
      });
    } catch (error) {
      setApiResponse({
        success: false,
        message: "Failed to submit assessment. Please try again.",
        error: error.message
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex flex-col">
      <div className="w-full text-center py-4 shadow bg-white border-b">
        <p className="text-blue-600 text-xl md:text-2xl">
          Hello, {userDetails?.firstName}!
        </p>
        <p className="text-gray-600 text-sm md:text-base mt-1">
          Let’s walk you through the 5 key phases of business development.
        </p>
        <div className="mt-4 text-lg font-bold text-gray-800">
          Phase {currentPhase + 1} of {phases.length}
        </div>
        <div className="w-full mt-2 bg-gray-200 h-2 rounded-full max-w-lg mx-auto">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentPhase + 1) / phases.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 md:px-12 lg:px-24 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageVariants.transition}
            className="w-full max-w-4xl bg-white shadow-xl rounded-3xl p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={phase.icon}
                  className="text-3xl text-blue-600"
                />
              </div>
              <p className="text-2xl font-bold text-gray-800">{phase.title}</p>
              <p className="text-xl text-blue-600">{phase.subtitle}</p>
              <p className="text-gray-600 mt-4">{phase.content}</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-6 flex items-start">
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="text-blue-600 mr-3 mt-1"
              />
              <div>
                <p className="text-blue-800 font-medium mb-2">Phase Overview</p>
                <p className="text-blue-700 text-sm">
                  Read through and let us know if you understand this phase.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200 text-center mb-6">
              <p className="text-2xl font-bold text-gray-800 mb-4">
                Do you understand this phase?
              </p>
              {selection === undefined && (
                <p className="text-yellow-800 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  Please select your understanding
                </p>
              )}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => handlePhaseCompletion(true)}
                  className={`px-8 py-4 rounded-xl font-semibold ${
                    selection === true
                      ? "bg-green-600 text-white"
                      : "bg-white text-green-600 border-2 border-green-600 hover:bg-green-50"
                  }`}
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                  Yes, I understand
                </button>
                <button
                  onClick={() => handlePhaseCompletion(false)}
                  className={`px-8 py-4 rounded-xl font-semibold ${
                    selection === false
                      ? "bg-red-600 text-white"
                      : "bg-white text-red-600 border-2 border-red-600 hover:bg-red-50"
                  }`}
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />I don't
                  quite get it yet, but soon
                </button>
              </div>
            </div>

            {apiResponse && (
              <div
                className={`rounded-2xl p-6 mb-8 ${
                  apiResponse.success
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                } border`}
              >
                <FontAwesomeIcon
                  icon={apiResponse.success ? faCheckCircle : faTimes}
                  className="mr-2"
                />
                <span
                  className={`font-medium ${
                    apiResponse.success ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {apiResponse.message}
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={() => setCurrentPhase((p) => Math.max(0, p - 1))}
                disabled={currentPhase === 0}
                className={`px-6 py-3 rounded-xl ${
                  currentPhase === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
                Previous
              </button>
              {currentPhase === phases.length - 1 ? (
                <button
                  onClick={handleFinish}
                  disabled={loading}
                  className="px-8 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:to-green-800 shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon
                        icon={faCircleNotch}
                        className="fa-spin mr-2"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                      Complete Assessment
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setCurrentPhase((p) => p + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:to-blue-800 shadow-lg"
                >
                  Next
                  <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Accelerate;
