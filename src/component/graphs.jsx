import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/apiConfig';
import { FaChevronDown, FaChevronUp, FaLock, FaTimes } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom'; // You'll need to import this in your actual project
// import GetCard from '../getCard';
import { useNavigate } from 'react-router-dom';

function PhasePercentage() {
    const [phaseData, setPhaseData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedPhase, setExpandedPhase] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate(); // Uncomment this in your actual project

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const access_token = localStorage.getItem('access_token');
                const decodedToken = jwtDecode(access_token);
                const userId = decodedToken.userId;
                const projectId = localStorage.getItem('nProject');

                if (!userId || !projectId) {
                    throw new Error("Missing user ID or project ID");
                }

                const response = await fetch(`${API_BASE_URL}/api/user/graph-data/${userId}/${projectId}`, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch phase data");
                }

                const result = await response.json();
                setPhaseData(result.data.phasePercentages);
            } catch (err) {
                console.error("Error fetching phase data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGraphData();
    }, []);

    const togglePhase = (phaseId) => {
        if (expandedPhase === phaseId) {
            setExpandedPhase(null);
        } else {
            setExpandedPhase(phaseId);
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const subscriptionFunction = () => {
        setShowPayment(false);
        setTimeout(() => {
            setShowPayment(true);
        }, 50);
    };

    const formatLabel = (url) => {
        if (url === "/customFinancial") return "Custom Financial Projection";
        if (url === "/branding") return "Branding";
        if (url.startsWith("/go/")) return "Go No Go";
        return url.replace("/go/", "").replace("/", "").toUpperCase();
    };

    const phaseUrls = {
        Ideation: ["/go/Ideation"],
        ProductDefinition: ["/customFinancial", "/branding", "/go/ProductDefinition"],
        InitialDesign: ["/go/InitialDesign"],
        ValidatingAndTesting: ["/go/ValidatingAndTesting"],
        Commercialization: ["/go/Commercialization"],
    };

    const isPhaseAccessible = (phaseName) => {
        const subscribed = localStorage.getItem('subscribed') === 'true';
        if (subscribed) {
            return true;
        }
        return phaseName === 'Ideation';
    };

    // Phase configuration with colors
    const phases = [
        { id: "Ideation", title: "Ideation", color: "bg-blue-800", borderColor: "border-blue-800", textColor: "text-blue-800" },
        { id: "ProductDefinition", title: "Product Definition", color: "bg-blue-800", borderColor: "border-blue-800", textColor: "text-blue-800" },
        { id: "InitialDesign", title: "Initial Design", color: "bg-blue-800", borderColor: "border-blue-800", textColor: "text-blue-800" },
        { id: "ValidatingAndTesting", title: "Validating & Testing", color: "bg-blue-800", borderColor: "border-blue-800", textColor: "text-blue-800" },
        { id: "Commercialization", title: "Commercialization", color: "bg-blue-800", borderColor: "border-blue-800", textColor: "text-blue-800" }
    ];

    // Function to safely display percentages
    const displayPercentage = (value) => {
        if (value === null || value === undefined || isNaN(value)) return 0;
        return Math.round(value);
    };

    // Function to determine status color
    const getStatusColor = (percentage, accessible) => {
        if (!accessible) return "bg-gray-400";
        if (percentage >= 100) return "bg-green-500";
        if (percentage > 0) return "bg-yellow-500";
        return "bg-blue-200";
    };

    // Function to determine stroke color for SVG circle
    const getStrokeColor = (percentage, accessible) => {
        if (!accessible) return "stroke-gray-400";
        if (percentage >= 100) return "stroke-green-500";
        if (percentage > 0) return "stroke-yellow-500";
        return "stroke-blue-200";
    };

    // Calculate incomplete phases count
    const getIncompleteCount = () => {
        return phases.filter(phase => {
            const percentage = displayPercentage(phaseData[phase.id] || 0);
            return percentage < 100;
        }).length;
    };

    if (loading) {
        return (
            <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-800 rounded flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center">
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    !
                </div>
            </div>
        );
    }

    const incompleteCount = getIncompleteCount();

    return (
      <>
        {/* Navbar Component */}
        <div className="relative">
          <button
            onClick={toggleModal}
            className="flex items-center space-x-2 hover:bg-gray-100 rounded-md px-2 py-1 transition-colors duration-200"
            title={`${incompleteCount} incomplete phases`}
          >
            <div className="relative w-8 h-8 bg-gray-500 rounded flex items-center justify-center text-white text-sm font-bold">
              P
              {incompleteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold leading-none">
                  {incompleteCount}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b bg-blue-800 text-white rounded-t-lg">
                <h2 className="text-xl font-semibold">Project Phases</h2>
                <button
                  onClick={toggleModal}
                  className="p-1 hover:bg-blue-700 rounded transition-colors duration-200"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {phases.map((phase) => {
                    const rawPercentage = phaseData[phase.id] || 0;
                    const percentage = displayPercentage(rawPercentage);
                    const isExpanded = expandedPhase === phase.id;
                    const accessible = isPhaseAccessible(phase.id);
                    const urls = phaseUrls[phase.id] || [];
                    const statusColor = getStatusColor(percentage, accessible);
                    const strokeColor = getStrokeColor(percentage, accessible);

                    const circumference = 2 * Math.PI * 20;
                    const dash = Math.min(percentage / 100, 1) * circumference;
                    const strokeDasharray = `${dash} ${circumference}`;

                    return (
                      <div
                        key={phase.id}
                        className={`rounded-lg shadow-md overflow-hidden border ${
                          accessible ? "border-gray-200" : "border-gray-300"
                        } 
                                                    ${
                                                      !accessible
                                                        ? "bg-gray-50"
                                                        : "bg-white"
                                                    }`}
                      >
                        <button
                          onClick={() => togglePhase(phase.id)}
                          className={`w-full px-4 py-4 flex items-center justify-between transition-all duration-200
                                                        ${
                                                          accessible
                                                            ? "hover:bg-gray-50"
                                                            : "cursor-default"
                                                        }`}
                          aria-expanded={isExpanded}
                          disabled={!accessible && urls.length === 0}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <svg className="w-12 h-12" viewBox="0 0 48 48">
                                <circle
                                  cx="24"
                                  cy="24"
                                  r="20"
                                  fill="none"
                                  strokeWidth="4"
                                  className="stroke-gray-200"
                                />
                                <circle
                                  cx="24"
                                  cy="24"
                                  r="20"
                                  fill="none"
                                  strokeWidth="4"
                                  className={strokeColor}
                                  strokeDasharray={strokeDasharray}
                                  strokeDashoffset="0"
                                  transform="rotate(-90 24 24)"
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span
                                  className={`text-sm font-semibold ${
                                    accessible
                                      ? "text-gray-800"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {percentage}%
                                </span>
                              </div>
                            </div>

                            <div>
                              <p
                                className={`font-semibold ${
                                  accessible ? phase.textColor : "text-gray-500"
                                }`}
                              >
                                {phase.title}
                                {!accessible && (
                                  <span className="inline-flex items-center ml-2">
                                    <FaLock className="text-gray-400 text-sm" />
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          {urls.length > 0 && (
                            <div className="flex items-center">
                              <span
                                className={`text-sm ${
                                  accessible ? "text-gray-500" : "text-gray-400"
                                } mr-2`}
                              >
                                Tools
                              </span>
                              {isExpanded ? (
                                <FaChevronUp
                                  className={`text-sm ${
                                    accessible
                                      ? "text-gray-500"
                                      : "text-gray-400"
                                  }`}
                                />
                              ) : (
                                <FaChevronDown
                                  className={`text-sm ${
                                    accessible
                                      ? "text-gray-500"
                                      : "text-gray-400"
                                  }`}
                                />
                              )}
                            </div>
                          )}
                        </button>

                        {urls.length > 0 && (
                          <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden border-t 
                                                            ${
                                                              isExpanded
                                                                ? "max-h-screen opacity-100 border-gray-200"
                                                                : "max-h-0 opacity-0 border-transparent"
                                                            }`}
                          >
                            <div className="p-4">
                              <div className="flex flex-wrap gap-2">
                                {urls.map((url, urlIndex) => (
                                  <button
                                    key={`${phase.id}-${urlIndex}`}
                                    onClick={() =>
                                      accessible
                                        ? navigate(`${url}`)
                                        : subscriptionFunction()
                                    }
                                    className={`px-3 py-2 text-white rounded-md transition text-sm flex items-center gap-2
                                                                        ${
                                                                          !accessible
                                                                            ? "bg-gray-400 hover:bg-gray-500 cursor-pointer"
                                                                            : "bg-blue-800 hover:bg-blue-900"
                                                                        } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                      accessible
                                        ? "focus:ring-blue-600"
                                        : "focus:ring-gray-300"
                                    }`}
                                    title={
                                      !accessible
                                        ? "Requires subscription"
                                        : formatLabel(url)
                                    }
                                  >
                                    <span>{formatLabel(url)}</span>
                                    {!accessible && (
                                      <FaLock className="text-white text-xs" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex justify-center items-center gap-6 mt-8 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span className="text-sm text-gray-600">In Progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-200"></div>
                    <span className="text-sm text-gray-600">Not Started</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                    <span className="text-sm text-gray-600">Locked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription modal */}
        {/* {showPayment && <GetCard />} */}
      </>
    );
}

export default PhasePercentage;