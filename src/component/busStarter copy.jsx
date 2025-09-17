import React, { useState, useEffect } from "react";
import { CheckCircle, Lock, Bus, Circle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";

export default function VerticalBusOnboarding() {
  const [activeStep, setActiveStep] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [phaseProgress, setPhaseProgress] = useState({
    Ideation: "notStarted",
    ProductDefinition: "notStarted",
    InitialDesign: "notStarted",
    ValidatingAndTesting: "notStarted",
    Commercialization: "notStarted"
  });

  const subscribed = true;
  const projectId = localStorage.getItem("nProject");
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/onboarding/${projectId}`);
        const data = await res.json();
        if (data.onboarding === true) {
          navigate("/start");
        }
      } catch (err) {
        console.error("Failed to fetch onboarding status", err);
      }
    };

    checkOnboardingStatus();
  }, [projectId, navigate]);

  const handleContinue = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ projectId })
      });

      if (!res.ok) {
        throw new Error("Failed to create onboarding data");
      }

      const result = await res.json();
      console.log("Onboarding created:", result);
    } catch (err) {
      console.error("Error creating onboarding:", err);
    } finally {
      navigate("/start");
    }
  };

  const steps = [
    {
      id: 1,
      title: "IDEATION",
      description:
        "Generate innovative concepts, identify disruptive ideas, and uncover new business opportunities.",
      phase: "Ideation"
    },
    {
      id: 2,
      title: "PRODUCT DEFINITION",
      description:
        "Clearly define your product's purpose, key features, target audience, and unique value.",
      phase: "ProductDefinition"
    },
    {
      id: 3,
      title: "INITIAL DESIGN",
      description:
        "Create early designs that bring ideas to life with a focus on quality, functionality, and user experience.",
      phase: "InitialDesign"
    },
    {
      id: 4,
      title: "VALIDATING & TESTING",
      description:
        "Test and validate your product to ensure strong market fit, functionality, and customer alignment.",
      phase: "ValidatingAndTesting"
    },
    {
      id: 5,
      title: "COMMERCIALIZATION",
      description:
        "Launch your product with a clear strategy to drive brand value, market growth, and customer engagement.",
      phase: "Commercialization"
    }
  ];

  const isStepUnlocked = (stepId) => (subscribed ? true : stepId === 1);

  const getBusIcon = (stepId) => {
    const step = steps.find((s) => s.id === stepId);
    const phaseStatus = phaseProgress[step.phase];

    if (!isStepUnlocked(stepId))
      return <Lock className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />;
    if (phaseStatus === "completed")
      return <Bus className="w-6 h-6 md:w-8 md:h-8 text-green-600" />;
    if (phaseStatus === "inProgress")
      return <Bus className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />;
    return <Bus className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />;
  };

  const getBusContainerStyle = (stepId) => {
    const step = steps.find((s) => s.id === stepId);
    const phaseStatus = phaseProgress[step.phase];

    if (!isStepUnlocked(stepId)) return "bg-gray-100 border-gray-300";
    if (phaseStatus === "completed") return "bg-green-50 border-green-300";
    if (phaseStatus === "inProgress") return "bg-yellow-50 border-yellow-300";
    return "bg-gray-50 border-gray-300";
  };

  const getPhaseStatusText = (stepId) => {
    const step = steps.find((s) => s.id === stepId);
    const status = phaseProgress[step.phase];

    if (!isStepUnlocked(stepId)) return "Locked";
    if (status === "completed") return "Completed";
    if (status === "inProgress") return "In Progress";
    return "Not Started";
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-8">
      {/* Header */}
      <div className="w-full max-w-4xl mx-auto border-b pb-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Your Journey Begins Here
          </h1>
          <p className="text-gray-600 text-sm">
            These are the steps you’ll follow to launch your product
          </p>
        </div>
      </div>
      {/* Vertical line center for large screens */}
      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-300"></div>

      {/* Steps List */}
      <div className="w-full max-w-4xl mx-auto mt-8 relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-300"></div>
        <div className="flex flex-col gap-12">
          {steps.map((step, index) => {
            const isRight = index % 2 === 0;
            const alignment = isRight ? "md:flex-row" : "md:flex-row-reverse";

            return (
              <div
                key={step.id}
                className={`flex flex-col md:${alignment} items-center gap-4 md:gap-8`}
              >
                {/* Content */}
                <div className="w-full md:w-5/12 text-left">
                  <div className="bg-white p-4 border rounded-lg shadow-md">
                    <p className="font-semibold text-sm text-gray-800">
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getPhaseStatusText(step.id)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Icon and Arrow */}
                <div className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${getBusContainerStyle(
                      step.id
                    )}`}
                  >
                    {getBusIcon(step.id)}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-px h-12 bg-gray-300"></div> // vertical line
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-4xl mx-auto mt-12 border-t pt-4 flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
