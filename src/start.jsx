import React, { useState, useEffect } from "react";
import Header from "./component/header";
import { CiLock, CiMemoPad, CiStopSign1, CiUser } from "react-icons/ci";
import bolt from "./images/bolt.png";
import ReactGA from "react-ga4";
import {
  handleClick,
  handleClickStorage,
  handleHome,
  handleLogout,
  updateStreak,
  getUserIdFromToken,
  FetchProjectDetails,
  FetchGoStatus,
  FetchTimelines,
  FetchTimelinesCount,
  FetchUser,
  UpdateOnboardingSeenStatus
} from "./utils/startUtils";
import { useNavigate, useParams } from "react-router-dom";
import ModalStart from "./component/modalStartStop";
import "./pop-up.css";
import WhereDidYouHearModal from "./gotToKnowUsModal";
import GiveFeedbackModal from "./component/giveFeedbackModal";
import { API_BASE_URL } from "./config/apiConfig";
// import GetCard from "./getCard";
import { FaTimesCircle, FaTools } from "react-icons/fa";
import { Flag, StopCircle, StopCircleIcon } from "lucide-react";
import { MdStart } from "react-icons/md";
import PhaseAccessModal from "./component/PhaseModal";
import VerticalBusOnboarding from "./component/busStarter";

function Start({ graphType }) {
  ReactGA.initialize("G-P450CRB987");
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname,
    title: "Start Page"
  });
  const [streak, setStreak] = useState("");
  const [timelineCount, setTimelineCount] = useState("");
  const [timelines, setTimelines] = useState([]);
  const [unlock, setUnlock] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [unlockIn, setUnlockIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const projectId = localStorage.getItem("nProject");
  const [projectDetails, setProjectDetails] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFeed, setIsOpenFeed] = useState(false);
  const [phaseProgress, setPhaseProgress] = useState({});
  // const subscribed = localStorage.getItem('subscribed') === 'true';
  const subscribed = true;
  const [showPayment, setShowPayment] = useState(false);
  const handleOpenModal = () => setIsOpenFeed(true);
  const handleCloseModal = () => setIsOpenFeed(false);
  const [isToolboxOpen, setIsToolboxOpen] = useState(false);
  const [blockedPhase, setBlockedPhase] = useState("");
  const [requiredPhase, setRequiredPhase] = useState("");
  const [showPhaseAccessModal, setShowPhaseAccessModal] = useState(false);
  const navigate = useNavigate();
  // const urls = phaseUrls[phase] || [];
  const [currentPhase, setCurrentPhase] = useState("Ideation");

  const [clickPosition, setClickPosition] = useState({ top: 0, left: 0 });

  // Capture the click position
  const handleClickFeed = (e) => {
    setIsOpenFeed(true);
  };
  const phases = [
    "Ideation",
    "ProductDefinition",
    "InitialDesign",
    "ValidatingAndTesting",
    "Commercialization"
  ];

  const getPreviousPhase = (currentPhase) => {
    const phaseOrder = [
      "Ideation",
      "ProductDefinition",
      "InitialDesign",
      "ValidatingAndTesting",
      "Commercialization"
    ];
    const currentIndex = phaseOrder.indexOf(currentPhase);
    return currentIndex > 0 ? phaseOrder[currentIndex - 1] : null;
  };

  const handleNavigation = async (phase) => {
    console.log("test 1");
    console.log(phase);

    // Check if the phase is accessible
    if (!isPhaseAccessible(phase)) {
      const previousPhase = getPreviousPhase(phase);
      if (previousPhase) {
        setBlockedPhase(phase);
        setRequiredPhase(previousPhase);
        setShowPhaseAccessModal(true);
      }
      console.log("Phase not accessible, showing access requirement modal...");
      return; // Prevent navigation
    }

    // Proceed with navigation logic if the phase is accessible
    const onboarding = JSON.parse(localStorage.getItem("onboarding") || "{}");

    const phasePaths = {
      Ideation: "/Ideation",
      ProductDefinition: "/ProductDefinition",
      InitialDesign: "/InitialDesign",
      ValidatingAndTesting: "/ValidatingAndTesting",
      Commercialization: "/Commercialization"
    };

    // Check if the user has completed onboarding for this phase
    if (onboarding[phase]) {
      // If the phase has been seen (onboarding completed), navigate to the phase's start page
      navigate(`/test-ai${phasePaths[phase]}`);
    } else {
      navigate(`/test-ai${phasePaths[phase]}`);

      // If the phase has not been seen (onboarding not completed), navigate to the onboarding page
      // navigate(`${phasePaths[phase]}`);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);

  useEffect(() => {
    // console.log("")
    const checkOnboardingStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/onboarding/${projectId}`);
        const data = await res.json();
        console.log(data);
        if (data.onboarding === true) {
          navigate("/start");
        } else if (data.onboarding === false) {
          navigate("/welcome-onboarding");
        }
      } catch (err) {
        console.error("Failed to fetch onboarding status", err);
      }
    };

    checkOnboardingStatus();
  }, [projectId]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(
          `${API_BASE_URL}/api/test-answer/status/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const data = await res.json();
        if (data.status === "success") {
          setPhaseProgress(data.data.phaseStatus);
          console.log(data.data.phaseStatus);

          // Update unlock status based on phase progress
          // If any phase is completed or in progress, consider it unlocked
          const hasProgress = Object.values(data.data.phaseStatus).some(
            (status) => status === "completed" || status === "inProgress"
          );
          setUnlock(hasProgress || subscribed);
        }
      } catch (err) {
        console.error("Error fetching phase progress:", err);
      }
    };

    if (projectId) {
      fetchProgress();
    }
  }, [projectId, subscribed]);

  const isPhaseAccessible = (phaseName) => {
    // Define phase order
    const phaseOrder = [
      "Ideation",
      "ProductDefinition",
      "InitialDesign",
      "ValidatingAndTesting",
      "Commercialization"
    ];
    const currentPhaseIndex = phaseOrder.indexOf(phaseName);

    // Ideation is always accessible
    if (currentPhaseIndex === 0) {
      return true;
    }

    // For both subscribed and non-subscribed users, allow access if the previous phase is completed
    const previousPhase = phaseOrder[currentPhaseIndex - 1];
    return getPhaseStatus(previousPhase) === "completed";
  };

  // /test-ai/:phase"
  const getPhaseStatus = (phaseName) => {
    return phaseProgress[phaseName] || "notStarted";
  };

  const { access_token, userId } = getUserIdFromToken();

  if (userId == null) {
    navigate("/login");
  }
  FetchUser(userId, setUserDetails, setError, setLoading);

  FetchProjectDetails(projectId, setProjectDetails, setError, setLoading);

  // FetchGoStatus(projectId, access_token, setUnlock, setUnlockIn)

  useEffect(() => {
    updateStreak(setStreak);
  }, []);

  const phaseUrls = {
    Ideation: ["/go/Ideation"],
    ProductDefinition: [
      "/customFinancial",
      "/branding",
      "/go/ProductDefinition"
    ],
    InitialDesign: ["/go/InitialDesign"],
    ValidatingAndTesting: ["/go/ValidatingAndTesting"],
    Commercialization: ["/go/Commercialization"]
  };

  //   FetchTimelines(projectId, setTimelines, setLoading, setError)

  FetchTimelinesCount(
    projectId,
    userId,
    access_token,
    setTimelineCount,
    setLoading,
    setError
  );

  const formatLabel = (url) => {
    if (url === "/customFinancial") return "Custom Financial Projection";
    if (url === "/branding") return "Branding";
    if (url.startsWith("/go/")) return "Go No Go";
    return url.replace("/go/", "").replace("/", "").toUpperCase();
  };

  // Helper functions
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const toggleToolbox = () => {
    setIsToolboxOpen(!isToolboxOpen);
  };

  const subscriptionFunction = () => {
    setShowPayment(false); // First close
    setTimeout(() => {
      setShowPayment(true); // Then open after a very tiny delay
    }, 50); //
  };
  const projectName = localStorage.getItem("nProjectName");
  const rawOnboarding = localStorage.getItem("onboarding");
  const onboarding = rawOnboarding ? JSON.parse(rawOnboarding) : {};

  // Use phaseProgress instead of onboarding for determining completed phases
  const completedPhases = phases.filter(
    (phase) => getPhaseStatus(phase) === "completed"
  );
  const allPhasesComplete = completedPhases.length === phases.length;

  let message;
  if (completedPhases.length === 0) {
    message = "Begin your path with Ideation.";
  } else if (allPhasesComplete) {
    message = "You've completed all phases — Time to launch!";
  } else {
    // Find the next phase that is not completed
    const nextPhase = phases.find(
      (phase) => getPhaseStatus(phase) !== "completed"
    );
    const readablePhase = nextPhase.replace(/([a-z])([A-Z])/g, "$1 $2");
    message = `Continue your path with ${readablePhase}.`;
  }

  const renderPhaseStatusIcon = (phaseName) => {
    const status = getPhaseStatus(phaseName);
    console.log(status);
    const isAccessible = isPhaseAccessible(phaseName);
    console.log(isAccessible);

    if (status === "completed") {
      return (
        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        </div>
      );
    }

    if (!isAccessible) {
      return (
        <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" />
          </svg>
        </div>
      );
    }

    return null;
  };

  // const preloadImages = (imageUrls) => {
  //   return Promise.all(
  //     imageUrls.map((url) => {
  //       return new Promise((resolve, reject) => {
  //         const img = new Image();
  //         img.onload = resolve;
  //         img.onerror = reject;
  //         img.src = url;
  //       });
  //     })
  //   );
  // };

  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const imageUrls = [
  //     "./images/ideation.png",
  //     "./images/product_definition.png",
  //     "./images/initial_design.png",
  //     "./images/validating.png",
  //     "./images/commercialization.png",
  //     "./images/kpi.png",
  //     "./images/scrab_book.png",
  //     "./images/pitch_deck.png",
  //     "./images/pattern.png"
  //   ];

  //   preloadImages(imageUrls)
  //     .then(() => {
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error preloading images:", error);
  //       setIsLoading(false);
  //     });
  // }, []);

  // if (isLoading) {
  //   return (
  //     <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center z-50">
  //       <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md w-full mx-4">
  //         <div className="text-center">
  //           {/* Animated Logo/Icon */}
  //           <div className="mb-6">
  //             <div className="relative">
  //               <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
  //                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
  //                   <svg
  //                     className="w-8 h-8 text-blue-500 animate-pulse"
  //                     fill="currentColor"
  //                     viewBox="0 0 24 24"
  //                   >
  //                     <path d="M12 2L2 7v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7l-10-5zM12 4.84L19 8.16v2.68l-7 3.5-7-3.5V8.16l7-3.32z" />
  //                   </svg>
  //                 </div>
  //               </div>
  //               {/* Rotating ring */}
  //               <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
  //             </div>
  //           </div>

  //           {/* Loading text with animation */}
  //           <h2 className="text-2xl font-bold text-gray-800 mb-2">
  //             Loading Experience
  //           </h2>
  //           <p className="text-gray-600 mb-6">Preparing your workspace...</p>

  //           {/* Progress bar */}
  //           <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
  //             <div
  //               className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse transition-all duration-500 ease-out"
  //               style={{ width: "60%" }}
  //             ></div>
  //           </div>

  //           {/* Loading dots */}
  //           <div className="flex justify-center space-x-2">
  //             <div
  //               className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
  //               style={{ animationDelay: "0ms" }}
  //             ></div>
  //             <div
  //               className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
  //               style={{ animationDelay: "150ms" }}
  //             ></div>
  //             <div
  //               className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
  //               style={{ animationDelay: "300ms" }}
  //             ></div>
  //           </div>

  //           {/* Optional: Loading tips */}
  //           <div className="mt-6 text-sm text-gray-500">
  //             <p className="animate-pulse">Optimizing your project phases...</p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <div>
        <Header />
        <div className="p-3">
          <WhereDidYouHearModal />

          {/* Welcome Section */}
          <div className="flex-row lg:flex lg:ml-7 justify-between items-center mt-10">
            <div>
              <h4 className="text-blue600">Hello, {userDetails?.firstName}!</h4>
              <h6 className="text-gray-700 text-base mb-1">
                Welcome to project{" "}
                <span className="text-blue600">{projectName}</span>,
              </h6>
              <p className="text-gray-800 m-[5px]">{message}</p>
            </div>
            <div className="grid">
              <button
                className="block px-3 py-2 bg-black400 rounded-[5px] mb-[15px] text-white"
                onClick={() => setIsOpen(true)}
              >
                Create new project
              </button>
              <button
                className="block px-3 py-2 bg-none border border-black500 rounded-[5px]"
                onClick={() => handleClick("/home")}
              >
                Select Project
              </button>
            </div>
          </div>

          {/* Phase Access Modal */}
          {showPhaseAccessModal && (
            <PhaseAccessModal
              isOpen={showPhaseAccessModal}
              onClose={() => setShowPhaseAccessModal(false)}
              currentPhase={blockedPhase}
              requiredPhase={requiredPhase}
            />
          )}

          {/* Main Content Grid */}
          <div className="lg:grid grid-cols-2 lg:grid-cols-5 lg:gap-3 mt-14">
            <div className="col-span-4 lg:flex lg:justify-center">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Ideation Phase */}
                <div className="lg:w-[225px] w-[180px] h-[305px] rounded-tr-[30px] rounded-bl-[30px] bg-[url('./images/ideation.jpg')] bg-no-repeat bg-cover cursor-pointer relative group">
                  <div
                    className={`tilt-box bg-[#E8C400D9] ${
                      getPhaseStatus("Ideation") === "completed"
                        ? "completed"
                        : ""
                    }`}
                    onClick={() => handleNavigation("Ideation")}
                  >
                    <button className="px-2 py-1 bg-black400 rounded-[10px] mb-[16px] text-white text-[14px]">
                      View
                    </button>
                    <p className="p18">Ideation</p>
                    <p className="text-[12px]">
                      Create your Idea from start to finish
                    </p>
                    {renderPhaseStatusIcon("Ideation")}
                  </div>
                </div>

                {/* Product Definition Phase */}
                {projectDetails &&
                  !projectDetails.includes("Product Definition") && (
                    <div className="lg:w-[225px] w-[180px] h-[305px] rounded-tr-[30px] rounded-bl-[30px] group bg-[url('./images/product_definition.jpeg')] bg-no-repeat bg-cover cursor-pointer relative">
                      <div
                        className={`tilt-box bg-[#333333DE] text-white ${
                          !isPhaseAccessible("ProductDefinition")
                            ? "lockedIn"
                            : ""
                        } ${
                          getPhaseStatus("ProductDefinition") === "completed"
                            ? "completed"
                            : ""
                        }`}
                        onClick={() => handleNavigation("ProductDefinition")}
                      >
                        <button className="px-2 py-1 bg-white rounded-[10px] mb-[16px] text-black400 text-[14px]">
                          View
                        </button>
                        <p className="p18">Product Definition</p>
                        <p className="text-[12px]">
                          Design your business processes and flow
                        </p>
                        {renderPhaseStatusIcon("ProductDefinition")}
                      </div>
                    </div>
                  )}

                {/* Initial Design Phase */}
                {projectDetails &&
                  !projectDetails.includes("Initial Design") && (
                    <div className="lg:w-[225px] w-[180px] h-[305px] rounded-tr-[30px] rounded-bl-[30px] group bg-[url('./images/initial_design.jpeg')] bg-no-repeat bg-cover cursor-pointer relative">
                      <div
                        className={`tilt-box bg-[#193FAEDE] text-white ${
                          !isPhaseAccessible("InitialDesign") ? "lockedIn" : ""
                        } ${
                          getPhaseStatus("InitialDesign") === "completed"
                            ? "completed"
                            : ""
                        }`}
                        onClick={() => handleNavigation("InitialDesign")}
                      >
                        <button className="px-2 py-1 bg-white rounded-[10px] mb-[16px] text-black400 text-[14px]">
                          View
                        </button>
                        <p className="p18">Initial Design</p>
                        <p className="text-[12px]">
                          Plan design and add members to Team
                        </p>
                        {renderPhaseStatusIcon("InitialDesign")}
                      </div>
                    </div>
                  )}

                {/* Validating and Testing Phase */}
                {projectDetails &&
                  !projectDetails.includes("Validating and Testing") && (
                    <div className="lg:w-[225px] w-[180px] h-[305px] rounded-tr-[30px] rounded-bl-[30px] group bg-[url('./images/validating.jpeg')] bg-no-repeat bg-cover cursor-pointer relative">
                      <div
                        className={`tilt-box bg-[#FFD700DE] text-white ${
                          !isPhaseAccessible("ValidatingAndTesting")
                            ? "lockedIn"
                            : ""
                        } ${
                          getPhaseStatus("ValidatingAndTesting") === "completed"
                            ? "completed"
                            : ""
                        }`}
                        onClick={() => handleNavigation("ValidatingAndTesting")}
                      >
                        <button className="px-2 py-1 bg-black400 rounded-[10px] mb-[16px] text-white text-[14px]">
                          View
                        </button>
                        <p className="p18">Validating and Testing</p>
                        <p className="text-[12px]">
                          Test and validate your product
                        </p>
                        {renderPhaseStatusIcon("ValidatingAndTesting")}
                      </div>
                    </div>
                  )}

                {/* Commercialization Phase */}
                {projectDetails &&
                  !projectDetails.includes("Commercialization") && (
                    <div className="lg:w-[225px] w-[180px] h-[305px] rounded-tr-[30px] rounded-bl-[30px] group bg-[url('./images/commercialization.jpeg')] bg-no-repeat bg-cover cursor-pointer relative">
                      <div
                        className={`tilt-box bg-[#333333DE] text-white ${
                          !isPhaseAccessible("Commercialization")
                            ? "lockedIn"
                            : ""
                        } ${
                          getPhaseStatus("Commercialization") === "completed"
                            ? "completed"
                            : ""
                        }`}
                        onClick={() => handleNavigation("Commercialization")}
                      >
                        <button className="px-2 py-1 bg-white rounded-[10px] mb-[16px] text-black400 text-[14px]">
                          View
                        </button>
                        <p className="p18">Commercialization</p>
                        <p className="text-[12px]">
                          Get your product ready to launch for production
                        </p>
                        {renderPhaseStatusIcon("Commercialization")}
                      </div>
                    </div>
                  )}

                {/* KPI Section
            <div className="lg:w-[225px] w-[180px] h-[305px] rounded-tr-[30px] rounded-bl-[30px] bg-[url('./images/kpi.jpeg')] bg-no-repeat bg-cover cursor-pointer relative group">
              <div
                className="tilt-box bg-[#133188DE] text-white"
                onClick={() => handleClickStorage("Kpi", "/kpi")}
              >
                <button className="px-2 py-1 bg-white rounded-[10px] mb-[16px] text-black400 text-[14px]">
                  View
                </button>
                <p className="p18">KPI</p>
                <p className="text-[12px]">
                  Create Custom Graphs that give you more insight
                </p>
                <p className="text-[12px]">6 Graph Types</p>
              </div>
            </div> */}

                {/* Pitch Deck Section */}
                <div className="lg:w-[225px] w-[180px] h-[305px] rounded-tr-[30px] rounded-bl-[30px] bg-[url('./images/pitch_deck.jpeg')] bg-no-repeat bg-cover cursor-pointer relative group">
                  <div
                    className={`tilt-box bg-[#193FAE99] text-white ${
                      !allPhasesComplete ? "lockedIn" : ""
                    }`}
                    onClick={() => {
                      if (allPhasesComplete) {
                        handleClick("/pitchDeckStart");
                      } else {
                        alert(
                          "Complete all phases before accessing the Pitch Deck"
                        );
                      }
                    }}
                  >
                    <button className="px-2 py-1 bg-white rounded-[10px] mb-[16px] text-black400 text-[14px]">
                      View
                    </button>
                    <p className="p18">Pitch Deck</p>
                    <p className="text-[12px]">
                      Store Pitch Decks and have access to resources
                    </p>

                    {/* Lock icon when phases are not complete */}
                    {!allPhasesComplete && (
                      <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="white"
                        >
                          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* ScrapBook Section */}
                <div className="lg:w-[225px] w-[180px] h-[305px] rounded-tr-[30px] rounded-bl-[30px] bg-[url('./images/scrab_book.jpeg')] bg-no-repeat bg-cover border-3 border-black cursor-pointer relative group">
                  <div
                    className="tilt-box bg-[#E6E6E6D9] text-black400"
                    onClick={() => handleClick("/scrapView")}
                  >
                    <button className="px-2 py-1 bg-white rounded-[10px] mb-[16px] text-black400 text-[14px]">
                      View
                    </button>
                    <p className="p18">ScrapBook</p>
                    <p className="text-[12px]">
                      Create Notes that you can look back at later
                    </p>
                    <p className="text-[12px]">6 Graph Types</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks Sidebar */}
            <div className="col-span-1">
              <div className="bg-white mt-[10px] lg:ml-[10px] p-3 rounded-[10px] bg-[url('./images/pattern.png')] bg-cover">
                <h5 className="text-center">Your Task</h5>
                <p className="block p18 p-0 mb-3 text-center text-black200">
                  Total Task : {timelines.length}
                </p>

                {timelines.map((timeline) => (
                  <div
                    className="bg-blue50 p-3 ps-4 rounded-tr-[10px] rounded-bl-[10px] mb-3"
                    key={timeline.id}
                  >
                    <p className="text-[14px]">{timeline.task}</p>
                    <div className="progress-bar -mt-3">
                      <div
                        className="progress"
                        style={{ width: `${timeline.completionPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px]">
                      {timeline.completionPercentage}%
                    </p>
                    <button className="block px-2 py-0 -mt-2 bg-black400 rounded-[10px] text-white text-[10px]">
                      View task
                    </button>
                  </div>
                ))}

                <button
                  className="block m-auto px-3 py-2 bg-black400 rounded-[5px] mb-[16px] text-white text-[14px] disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={timelines.length === 0}
                >
                  Manage tasks
                </button>
              </div>
            </div>
          </div>

          {/* Share Phases Section */}
          <div className="bg-white bg-[url('./images/pattern_landscape.png')] bg-contain rounded-[10px] mt-10 relative group">
            <div className="w-full py-16 px-5">
              <div className="flex justify-between items-center">
                <div>
                  <h5>Share Phases</h5>
                  <p className="text-[14px] text-black200">
                    You feel your file is ready for review
                  </p>
                </div>
                <button
                  className="px-5 py-2 bg-black400 rounded-[5px] text-[14px] text-white"
                  onClick={() => handleClick("/sharePhase")}
                >
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Statistics and Actions Grid */}
          <div className="grid grid-cols-12 gap-3 mt-10 md:grid-cols-6 lg:grid-cols-12">
            {/* Streak Section */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3">
              <div className="bg-white py-[42px] rounded-[10px]">
                <div className="flex justify-center items-center gap-4">
                  <img src={bolt} alt="Streak" style={{ width: "20%" }} />
                  <div>
                    <h6>{streak} Days!</h6>
                    <h6 className="font-semibold">Streak</h6>
                  </div>
                </div>
              </div>
            </div>

            {/* Craddule Hub Section */}
            <div className="col-span-12 md:col-span-6 lg:col-span-6 relative group">
              <div className="bg-white py-[42px] px-[36px] rounded-[10px] flex justify-between items-center">
                <div>
                  <h5>Craddule Hub</h5>
                  <p className="text-[14px] text-black300">
                    Upload and view uploaded files in your project
                  </p>
                </div>
                <div>
                  <button
                    className="block w-full px-3 py-2 bg-black400 rounded-[5px] mb-[16px] text-white text-[14px]"
                    onClick={() => handleClick("/craddule")}
                  >
                    View Files
                  </button>
                  <button
                    className="block w-full px-3 py-2 border border-black rounded-[5px] text-black400 text-[14px]"
                    onClick={() => handleClick("/uploadTask")}
                  >
                    Upload Files
                  </button>
                </div>
              </div>
            </div>

            {/* Create Task Section */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3">
              <div className="bg-white py-[24px] px-[36px] rounded-[10px]">
                <div>
                  <h5 className="text-center">Create Task</h5>
                  <p className="text-[14px] text-black300 text-center">
                    You can create tasks and assign them to team members
                  </p>
                  <button
                    className="block w-full px-3 py-2 bg-black400 rounded-[5px] text-white text-[14px]"
                    onClick={() => handleClick("/createTask")}
                  >
                    Create Task
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Refer a Friend Section */}
          <div className="bg-white bg-[url('./images/pattern_landscape.png')] bg-contain rounded-[10px] mt-10 relative group">
            <div className="w-full py-16 px-5">
              <div className="flex justify-between items-center">
                <div>
                  <h5>Refer a Friend</h5>
                  <p className="text-[14px] text-black200">
                    Invite friends and colleagues to join Craddule
                  </p>
                </div>
                <button
                  className="px-5 py-2 bg-black400 rounded-[5px] text-[14px] text-white"
                  onClick={() => handleClick("/referral")}
                >
                  Refer
                </button>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div
            onClick={handleClickFeed}
            className="flex justify-end gap-2 items-center mt-10 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50px"
              height="50px"
              viewBox="0 0 20 20"
            >
              <path
                fill="black"
                d="M10 0c5.342 0 10 4.41 10 9.5c0 5.004-4.553 8.942-10 8.942a11 11 0 0 1-3.43-.546c-.464.45-.623.603-1.608 1.553c-.71.536-1.378.718-1.975.38c-.602-.34-.783-1.002-.66-1.874l.4-2.319C.99 14.002 0 11.842 0 9.5C0 4.41 4.657 0 10 0m0 1.4c-4.586 0-8.6 3.8-8.6 8.1c0 2.045.912 3.928 2.52 5.33l.02.017l.297.258l-.067.39l-.138.804l-.037.214l-.285 1.658a3 3 0 0 0-.03.337v.095q0 .007-.002.008c.007-.01.143-.053.376-.223l2.17-2.106l.414.156a9.6 9.6 0 0 0 3.362.605c4.716 0 8.6-3.36 8.6-7.543c0-4.299-4.014-8.1-8.6-8.1M5.227 7.813a1.5 1.5 0 1 1 0 2.998a1.5 1.5 0 0 1 0-2.998m4.998 0a1.5 1.5 0 1 1 0 2.998a1.5 1.5 0 0 1 0-2.998m4.997 0a1.5 1.5 0 1 1 0 2.998a1.5 1.5 0 0 1 0-2.998"
              />
            </svg>
            <p className="text-[16px] font-semibold text-black500 mt-3">
              Tell us More
            </p>
          </div>

          {/* Feedback Modal */}
          {isOpenFeed && (
            <div className="modal-overlayV">
              <GiveFeedbackModal
                open={isOpenFeed}
                onClose={handleCloseModal}
                clickPosition={clickPosition}
              />
            </div>
          )}

          {/* Settings Grid */}
          <div className="grid grid-cols-12 gap-3 text-white mt-10">
            <div className="col-span-3 cursor-pointer">
              <div
                className="bg-black400 py-7 rounded-4xl"
                onClick={() => handleClick("/generalSetting")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="m-auto"
                  width="25px"
                  height="25px"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="white"
                    d="M17 9V7c0-2.8-2.2-5-5-5S7 4.2 7 7v2c-1.7 0-3 1.3-3 3v7c0 1.7 1.3 3 3 3h10c1.7 0 3-1.3 3-3v-7c0-1.7-1.3-3-3-3M9 7c0-1.7 1.3-3 3-3s3 1.3 3 3v2H9zm4.1 8.5l-.1.1V17c0 .6-.4 1-1 1s-1-.4-1-1v-1.4c-.6-.6-.7-1.5-.1-2.1s1.5-.7 2.1-.1c.6.5.7 1.5.1 2.1"
                  />
                </svg>
                <p className="p20 text-center mt-2">Change Password</p>
              </div>
            </div>

            <div className="col-span-3 cursor-pointer">
              <div
                className="bg-black400 py-7 rounded-4xl"
                onClick={() => handleClick("/profile")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="m-auto"
                  width="25px"
                  height="25px"
                  viewBox="0 0 24 24"
                >
                  <g fill="none">
                    <path
                      stroke="white"
                      strokeWidth="2"
                      d="M21 12a8.96 8.96 0 0 1-1.526 5.016A8.99 8.99 0 0 1 12 21a8.99 8.99 0 0 1-7.474-3.984A9 9 0 1 1 21 12Z"
                    />
                    <path
                      fill="white"
                      d="M13 9a1 1 0 0 1-1 1v2a3 3 0 0 0 3-3zm-1 1a1 1 0 0 1-1-1H9a3 3 0 0 0 3 3zm-1-1a1 1 0 0 1 1-1V6a3 3 0 0 0-3 3zm1-1a1 1 0 0 1 1 1h2a3 3 0 0 0-3-3zm-6.834 9.856l-.959-.285l-.155.523l.355.413zm13.668 0l.76.651l.354-.413l-.155-.523zM9 16h6v-2H9zm0-2a5 5 0 0 0-4.793 3.571l1.917.57A3 3 0 0 1 9 16zm3 6a7.98 7.98 0 0 1-6.075-2.795l-1.518 1.302A9.98 9.98 0 0 0 12 22zm3-4c1.357 0 2.506.902 2.876 2.142l1.916-.571A5 5 0 0 0 15 14zm3.075 1.205A7.98 7.98 0 0 1 12 20v2a9.98 9.98 0 0 0 7.593-3.493z"
                    />
                  </g>
                </svg>
                <p className="p20 text-center mt-2">Edit Profile</p>
              </div>
            </div>

            <div className="col-span-3 cursor-pointer">
              <div
                className="bg-black400 py-7 rounded-4xl"
                onClick={() => handleClick("/terms&conditions")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="m-auto"
                  width="25px"
                  height="25px"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="white"
                    d="m213.66 82.34l-56-56A8 8 0 0 0 152 24H56a16 16 0 0 0-16 16v176a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V88a8 8 0 0 0-2.34-5.66M160 176H96a8 8 0 0 1 0-16h64a8 8 0 0 1 0 16m0-32H96a8 8 0 0 1 0-16h64a8 8 0 0 1 0 16m-8-56V44l44 44Z"
                  />
                </svg>
                <p className="p20 text-center mt-2">Terms & Conditions</p>
              </div>
            </div>

            <div className="col-span-3 cursor-pointer">
              <div
                className="bg-black400 py-7 rounded-4xl"
                onClick={() => handleClick("/privacy")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="m-auto"
                  width="25px"
                  height="25px"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="white"
                    d="m213.66 82.34l-56-56A8 8 0 0 0 152 24H56a16 16 0 0 0-16 16v176a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V88a8 8 0 0 0-2.34-5.66M160 176H96a8 8 0 0 1 0-16h64a8 8 0 0 1 0 16m0-32H96a8 8 0 0 1 0-16h64a8 8 0 0 1 0 16m-8-56V44l44 44Z"
                  />
                </svg>
                <p className="p20 text-center mt-2">Privacy Policy</p>
              </div>
            </div>
          </div>

          <div className="startWrap"></div>
        </div>
        <ModalStart open={isOpen} onClose={() => setIsOpen(false)} />;
      </div>
    </>
  );
}

export default Start;
