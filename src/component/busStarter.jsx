import React, { useState, useEffect } from "react";
import { Lock, Bus, ArrowDown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";

// Mock navigate function
export default function VerticalBusOnboarding() {
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
    const checkOnboardingStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/onboarding/${projectId}`);
        const data = await res.json();
        console.log(data);
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
      const res = await fetch(
        `${API_BASE_URL}/api/onboarding/${projectId}/seen`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!res.ok) throw new Error("Failed to update onboarding status");

      const result = await res.json();
      console.log("Onboarding marked as seen:", result);
    } catch (err) {
      console.error("Error marking onboarding as seen:", err);
    } finally {
      // You can now navigate to the next screen2
      navigate("/start");
    }
  };

  const steps = [
    {
      id: 1,
      title: "IDEATION",
      description:
        "Generate fresh concepts and discover new business opportunities.",
      phase: "Ideation"
    },
    {
      id: 2,
      title: "PRODUCT DEFINITION",
      description:
        "Define the product’s purpose, features, audience, and value.",
      phase: "ProductDefinition"
    },
    {
      id: 3,
      title: "INITIAL DESIGN",
      description:
        "Transform ideas into early designs with focus on usability.",
      phase: "InitialDesign"
    },
    {
      id: 4,
      title: "VALIDATING & TESTING",
      description: "Test the product to ensure market fit and reliability.",
      phase: "ValidatingAndTesting"
    },
    {
      id: 5,
      title: "COMMERCIALIZATION",
      description: "Launch with a clear strategy for growth and engagement.",
      phase: "Commercialization"
    }
  ];

  const colorVariants = [
    {
      icon: "text-purple-600",
      border: "border-purple-300",
      bg: "bg-purple-50",
      text: "text-purple-600"
    },
    {
      icon: "text-pink-600",
      border: "border-pink-300",
      bg: "bg-pink-50",
      text: "text-pink-600"
    },
    {
      icon: "text-blue-600",
      border: "border-blue-300",
      bg: "bg-blue-50",
      text: "text-blue-600"
    },
    {
      icon: "text-orange-600",
      border: "border-orange-300",
      bg: "bg-orange-50",
      text: "text-orange-600"
    },
    {
      icon: "text-emerald-600",
      border: "border-emerald-300",
      bg: "bg-emerald-50",
      text: "text-emerald-600"
    }
  ];

  const isStepUnlocked = () => true;

  const getBusIcon = (stepId) => {
    const color = colorVariants[stepId - 1].icon;
    return <Bus className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ${color}`} />;
  };

  const getBusContainerStyle = (stepId) => {
    const { border, bg } = colorVariants[stepId - 1];
    return `${bg} ${border} shadow-sm`;
  };

  const getStatusColor = (stepId) => colorVariants[stepId - 1].text;

  const getPhaseStatusText = () => "Ready to Start";

  return (
    <div
      style={{ fontFamily: '"Manrope", sans-serif' }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="w-full max-w-6xl mx-auto mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-6">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
          Your Journey Begins Here
        </p>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Follow these carefully crafted steps to successfully launch your
          product
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Steps Container */}
      <div className="w-full max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Desktop Alternating Layout */}
            <div className="hidden lg:grid grid-cols-5 items-center gap-8 mb-8">
              {index % 2 === 0 ? (
                <>
                  {/* Left Content */}
                  <div className="col-span-2 text-right">
                    <div className="group bg-white/80 backdrop-blur-sm p-6 border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white">
                      <div className="flex items-center justify-end mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          Step {index + 1}
                        </span>
                      </div>
                      <p className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
                        {step.title}
                      </p>
                      <p className="text-sm text-blue-600 font-medium mb-3">
                        {getPhaseStatusText(step.id)}
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Timeline */}
                  <div className="col-span-1 flex flex-col items-center">
                    <div className="relative">
                      <div
                        className={`w-16 h-16 rounded-2xl border-4 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${getBusContainerStyle(
                          step.id
                        )}`}
                      >
                        <div className="text-xl">{getBusIcon(step.id)}</div>
                      </div>
                      {/* Glow effect */}
                      <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-blue-400/20 blur-xl -z-10"></div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex flex-col items-center mt-4">
                        <div className="w-0.5 h-6 bg-gradient-to-b from-gray-300 to-transparent"></div>
                        <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center my-2 border-2 border-gray-200">
                          <ArrowDown className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="w-0.5 h-6 bg-gradient-to-b from-transparent to-gray-300"></div>
                      </div>
                    )}
                  </div>

                  <div className="col-span-2" />
                </>
              ) : (
                <>
                  <div className="col-span-2" />

                  {/* Center Timeline */}
                  <div className="col-span-1 flex flex-col items-center">
                    <div className="relative">
                      <div
                        className={`w-16 h-16 rounded-2xl border-4 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${getBusContainerStyle(
                          step.id
                        )}`}
                      >
                        <div className="text-xl">{getBusIcon(step.id)}</div>
                      </div>
                      {/* Glow effect */}
                      <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-blue-400/20 blur-xl -z-10"></div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex flex-col items-center mt-4">
                        <div className="w-0.5 h-6 bg-gradient-to-b from-gray-300 to-transparent"></div>
                        <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center my-2 border-2 border-gray-200">
                          <ArrowDown className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="w-0.5 h-6 bg-gradient-to-b from-transparent to-gray-300"></div>
                      </div>
                    )}
                  </div>

                  {/* Right Content */}
                  <div className="col-span-2 text-left">
                    <div className="group bg-white/80 backdrop-blur-sm p-6 border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white">
                      <div className="flex items-center justify-start mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          Step {index + 1}
                        </span>
                      </div>
                      <p className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
                        {step.title}
                      </p>
                      <p className="text-sm text-blue-600 font-medium mb-3">
                        {getPhaseStatusText(step.id)}
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Tablet Layout (md screens) */}
            <div className="hidden md:block lg:hidden mb-8">
              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="relative">
                    <div
                      className={`w-14 h-14 rounded-xl border-4 flex items-center justify-center shadow-lg ${getBusContainerStyle(
                        step.id
                      )}`}
                    >
                      {getBusIcon(step.id)}
                    </div>
                    <div className="absolute inset-0 w-14 h-14 rounded-xl bg-blue-400/20 blur-lg -z-10"></div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex flex-col items-center mt-4">
                      <div className="w-0.5 h-8 bg-gradient-to-b from-gray-300 to-gray-200"></div>
                      <ArrowDown className="w-4 h-4 text-gray-400 my-2" />
                      <div className="w-0.5 h-8 bg-gradient-to-b from-gray-200 to-gray-100"></div>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="group bg-white/90 backdrop-blur-sm p-5 border border-gray-200/50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Step {index + 1}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium mb-3">
                      {getPhaseStatusText(step.id)}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="block md:hidden mb-6">
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-xl border-3 flex items-center justify-center shadow-md ${getBusContainerStyle(
                        step.id
                      )}`}
                    >
                      {getBusIcon(step.id)}
                    </div>
                    <div className="absolute inset-0 w-12 h-12 rounded-xl bg-blue-400/15 blur-md -z-10"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Step {index + 1}
                      </span>
                    </div>
                    <p className="font-bold text-md text-gray-900">
                      {step.title}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-blue-600 font-medium mb-3">
                  {getPhaseStatusText(step.id)}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="flex justify-center my-4">
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-gradient-to-b from-gray-300 to-gray-200"></div>
                    <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-200">
                      <ArrowDown className="w-3 h-3 text-gray-400" />
                    </div>
                    <div className="w-0.5 h-4 bg-gradient-to-b from-gray-200 to-gray-100"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Buttons */}
      <div className="w-full max-w-md mx-auto mt-12 px-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 group relative overflow-hidden py-3 px-6 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 hover:border-gray-300 hover:shadow-md active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </span>
            <div className="absolute inset-0 bg-gray-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>

          <button
            onClick={handleContinue}
            className="flex-1 group relative overflow-hidden py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Continue
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
