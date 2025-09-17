import React, { useState, useEffect, useRef } from 'react';
import unlockedCar from '../images/unlocked car.svg';
import lockedCar from '../images/car locked.svg';
import lineConnector from '../images/Line 253.svg';
import unlockedCarUnfinished from '../images/unlocked car unfinished.svg';
import { API_BASE_URL } from '../config/apiConfig';
import { CheckCircle, Lock } from 'lucide-react';

export default function CarStepsProcess() {
  const [activeStep, setActiveStep] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [phaseProgress, setPhaseProgress] = useState({});

  const projectId = localStorage.getItem('nProject');
  const subscribed = localStorage.getItem('subscribed') === 'true';
  const componentRef = useRef(null);
  const popupRefs = useRef({});


  // Check if device is mobile on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setActiveStep(null);
      }
    };


    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${API_BASE_URL}/api/test-answer/status/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.status === 'success') {
          setPhaseProgress(data.data.phaseStatus);
        }
      } catch (err) {
        console.error("Error fetching phase progress:", err);
      }
    };

    if (projectId) {
      fetchProgress();
    }
  }, [projectId]);

  // Dynamic popup positioning
  useEffect(() => {
    if (activeStep && popupRefs.current[activeStep]) {
      const popup = popupRefs.current[activeStep];
      if (popup) {
        const rect = popup.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Reset positions first
        popup.style.left = '';
        popup.style.right = '';
        popup.style.top = '';
        popup.style.bottom = '';
        popup.style.marginTop = '';
        popup.style.marginBottom = '';

        // Adjust horizontal position if needed
        if (rect.right > viewportWidth - 10) {
          popup.style.left = 'auto';
          popup.style.right = '0';
        }

        // Adjust vertical position if needed
        if (rect.bottom > viewportHeight - 10) {
          popup.style.top = 'auto';
          popup.style.bottom = '100%';
          popup.style.marginTop = '0';
          popup.style.marginBottom = '8px';
        }
      }
    }
  }, [activeStep]);

  const steps = [
    {
      id: 1,
      title: "IDEATION",
      description: "Generate innovative concepts, identify disruptive ideas, and uncover new business opportunities.",
    },
    {
      id: 2,
      title: "PRODUCT DEFINITION",
      description: "Clearly define your product's purpose, key features, target audience, and unique value.",
    },
    {
      id: 3,
      title: "INITIAL DESIGN",
      description: "Create early designs that bring ideas to life with a focus on quality, functionality, and user experience.",
    },
    {
      id: 4,
      title: "VALIDATING & TESTING",
      description: "Test and validate your product to ensure strong market fit, functionality, and customer alignment.",
    },
    {
      id: 5,
      title: "COMMERCIALIZATION",
      description: "Launch your product with a clear strategy to drive brand value, market growth, and customer engagement.",
    }
  ];

  const isStepUnlocked = (stepId) => {
    if (subscribed) return true;
    return stepId === 1; // Only the first step is unlocked when not subscribed
  };

  const getStepImage = (stepId) => {
    const phase = getPhaseKey(stepId);
    const phaseStatus = phaseProgress[phase];

    if (!isStepUnlocked(stepId)) {
      return lockedCar;
    }

    if (phaseStatus === 'completed') {
      return unlockedCar;
    } else if (phaseStatus === 'inProgress') {
      return unlockedCarUnfinished;
    } else {
      return lockedCar; // Also show locked for notStarted
    }
  };

  const getPhaseKey = (stepId) => {
    switch (stepId) {
      case 1: return "Ideation";
      case 2: return "ProductDefinition";
      case 3: return "InitialDesign";
      case 4: return "ValidatingAndTesting";
      case 5: return "Commercialization";
      default: return null;
    }
  };

  const formatPhaseName = (phaseKey) => {
    if (!phaseKey) return '';
    return phaseKey
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const isPhaseCompleted = (phaseKey) => {
    return phaseProgress[phaseKey] === 'completed';
  };

  const isPhaseInProgress = (phaseKey) => {
    return phaseProgress[phaseKey] === 'inProgress';
  };

  // Toggle popup visibility on mobile - allows all steps to be clicked
  const handleStepClick = (id) => {
    if (isMobile) {
      setActiveStep(activeStep === id ? null : id);
    }
  };

  const getPhaseStatusText = (phaseKey) => {
    const status = phaseProgress[phaseKey];
    if (status === 'completed') return 'Completed';
    if (status === 'inProgress') return 'In progress';
    return 'Not started';
  };

  const getPhaseStatusColor = (phaseKey) => {
    const status = phaseProgress[phaseKey];
    if (status === 'completed') return 'bg-green-500';
    if (status === 'inProgress') return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className="px-2 py-6 md:p-8 mt-4 max-w-6xl mx-auto" ref={componentRef}>
      {/* Steps layout - better spacing for mobile */}
      <div className="flex justify-center items-center flex-wrap md:flex-nowrap space-x-1 md:space-x-3">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step item with improved transitions */}
            <div
              className="relative flex flex-col items-center cursor-pointer"
              onClick={() => handleStepClick(step.id)}
              onMouseEnter={() => !isMobile && setActiveStep(step.id)}
              onMouseLeave={() => !isMobile && setActiveStep(null)}
            >
              <div className={`
                ${isMobile ? 'w-14 h-14' : 'w-20 h-20'} 
                flex items-center justify-center 
                transition-all duration-300 
                hover:scale-110
                ${!isStepUnlocked(step.id) ? 'opacity-90' : ''}
                ${activeStep === step.id ? 'scale-110 ring-2 ring-blue-300 rounded-full' : ''}
              `}>
                <img
                  src={getStepImage(step.id)}
                  alt={step.title}
                  className="w-full h-full"
                />
              </div>

              {/* Step number with better positioning */}
              <div className={`
                ${isMobile ? 'w-5 h-5 text-xs' : 'w-6 h-6 text-xs'} 
                ${!isStepUnlocked(step.id) ? 'bg-gray-400' : 'bg-blue-500'} 
                rounded-full 
                flex items-center justify-center 
                text-white font-bold 
                absolute -top-1 -right-1
              `}>
                {step.id}
              </div>

              {/* Phase name and status - improved styling */}
              <div className="mt-2 flex items-center gap-1 min-h-6">
                <span className={`
                  ${isMobile ? 'text-xxs' : 'text-xs md:text-sm'} font-medium max-w-full truncate
                  ${isPhaseCompleted(getPhaseKey(step.id)) ? 'text-green-600' :
                    isStepUnlocked(step.id) ? 'text-gray-700' : 'text-gray-400'}
                `} style={isMobile ? { fontSize: '0.65rem' } : {}}>
                  {formatPhaseName(getPhaseKey(step.id))}
                </span>
                {isPhaseCompleted(getPhaseKey(step.id)) && (
                  <CheckCircle className="text-green-500 w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                )}
              </div>

              {/* Improved popup with animation - now works for all steps */}
              {activeStep === step.id && (
                <div
                  ref={el => popupRefs.current[step.id] = el}
                  className={`
                    absolute top-full mt-2 
                    bg-white shadow-lg rounded-lg 
                    p-3 z-10 
                    w-48 md:w-64
                    border border-blue-100
                    transition-opacity duration-200
                    animate-fadeIn
                  `}
                  style={{
                    animationDuration: '0.2s',
                  }}
                >
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rotate-45 bg-white border-t border-l border-blue-100"></div>
                  <p className="font-bold text-blue-700 text-xs md:text-base mb-1">{step.title}</p>
                  <p className="text-gray-700 text-xs md:text-sm">{step.description}</p>

                  {/* Status indicator in popup */}
                  <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-2">
                    {!isStepUnlocked(step.id) ? (
                      <>
                        <Lock className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                        <span className="text-xs text-gray-600">Subscribe to unlock</span>
                      </>
                    ) : (
                      <>
                        <div className={`w-2 h-2 rounded-full ${getPhaseStatusColor(getPhaseKey(step.id))}`}></div>
                        <span className="text-xs text-gray-600">
                          {getPhaseStatusText(getPhaseKey(step.id))}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <div className={`mx-1 md:mx-2 flex items-center ${!isStepUnlocked(step.id + 1) ? 'opacity-60' : ''}`}>
                <img
                  src={lineConnector}
                  alt="connector"
                  className={`${isMobile ? 'w-5 h-3' : 'w-10 h-3'}`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Instruction text */}
      <div className="text-center text-xs text-gray-500 mt-6 md:mt-8">
        {isMobile ? 'Tap on any car to see details' : 'Hover over any car to see details'}
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center gap-4 md:gap-8 mt-6 flex-wrap">
        <div className="flex items-center gap-2">
          <img src={unlockedCar} alt="Completed" className="w-6 h-6" />
          <span className="text-xs text-gray-600">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <img src={unlockedCarUnfinished} alt="In Progress" className="w-6 h-6" />
          <span className="text-xs text-gray-600">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <img src={lockedCar} alt="Locked" className="w-6 h-6" />
          <span className="text-xs text-gray-600">Not Started or Locked</span>
        </div>
      </div>
    </div>
  );
}