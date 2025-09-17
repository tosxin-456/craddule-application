import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Palette,
  Type,
  Layout,
  Play,
  Users,
  Target,
  TrendingUp,
  DollarSign,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Globe,
  BarChart3,
  PieChart,
  Activity,
  Grid,
  ArrowDown,
  FileX,
  AlertCircle,
  Loader2,
  Plus,
  Briefcase,
  Cloud,
  Database,
  FileText,
  Folder,
  Layers,
  Lock,
  MessageSquare,
  Phone,
  Rocket,
  Search,
  Settings,
  Smile,
  Upload,
  Calendar,
  Code,
  Heart,
  Map,
  Award,
  BookOpen,
  Compass,
  Cpu,
  Package,
  Monitor,
  Inbox,
  Key,
  ThumbsUp,
  ChartLine,
  Clock,
  Image,
  Bus,
  ArrowUp,
  Edit,
  Edit3
} from "lucide-react";

import { API_BASE_URL } from "./config/apiConfig";
import Header from "./component/header";

export const iconMap = {
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  palette: Palette,
  type: Type,
  layout: Layout,
  play: Play,
  users: Users,
  target: Target,
  "trending-up": TrendingUp,
  "dollar-sign": DollarSign,
  lightbulb: Lightbulb,
  "check-circle": CheckCircle,
  "arrow-right": ArrowRight,
  star: Star,
  zap: Zap,
  shield: Shield,
  globe: Globe,
  "bar-chart-3": BarChart3,
  "chart-pie": PieChart,
  activity: Activity,
  grid: Grid,
  "arrow-down": ArrowDown,
  "file-x": FileX,
  "alert-circle": AlertCircle,
  loader: Loader2,
  plus: Plus,
  briefcase: Briefcase,
  cloud: Cloud,
  database: Database,
  "file-text": FileText,
  folder: Folder,
  layers: Layers,
  lock: Lock,
  "message-square": MessageSquare,
  phone: Phone,
  rocket: Rocket,
  search: Search,
  settings: Settings,
  smile: Smile,
  upload: Upload,
  calendar: Calendar,
  code: Code,
  heart: Heart,
  map: Map,
  award: Award,
  "book-open": BookOpen,
  compass: Compass,
  cpu: Cpu,
  package: Package,
  monitor: Monitor,
  inbox: Inbox,
  key: Key,
  "thumbs-up": ThumbsUp,
  "chart-line": ChartLine,
  bus: Bus,
  "arrow-up": ArrowUp
};

const PitchDeckSystem = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorDisplay, setErrorDisplay] = useState(null);
  const [error, setError] = useState(null);
  const projectId = localStorage.getItem("nProject");
  const token = localStorage.getItem("access_token");
  const [showSidebar, setShowSidebar] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const slideRef = useRef(null);
  const [isNotGenerated, setIsNotGenerated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Enhanced pitch deck data with different content structures
  const [slides, setSlides] = useState([]);

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Dynamic generation messages
  const generationMessages = [
    "Analyzing your project data...",
    "Creating slide layouts...",
    "Designing visual elements...",
    "Adding content to slides...",
    "Optimizing presentation flow...",
    "Working on the conclusion...",
    "Adding final touches...",
    "Rounding up your presentation..."
  ];

  useEffect(() => {
    const fetchPresentation = async () => {
      setLoading(true);
      console.log("Fetching presentation...");

      try {
        const res = await fetch(`${API_BASE_URL}/api/ppt/${projectId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          const errorData = await res.json();
          if (res.status === 404) {
            console.log("No presentation found, setting isGenerated to false");
            setIsNotGenerated(false);
          }
          setLoading(false);
          setIsNotGenerated(true); // Presentation was found
          throw new Error(errorData.message || "Failed to fetch presentation");
        }

        const data = await res.json();
        setLoading(false);

        console.log("Backend data:", data.slides);

        setSlides(data.slides);
        console.log(slides);
        console.log("Slides updated from backend");
      } catch (err) {
        console.error("Error:", err.message);
        setError(err.message);
      } finally {
        // setLoading(false);
      }
    };

    fetchPresentation();
  }, [projectId]);

  const generatePowerPoint = async () => {
    setIsGenerating(true);
    setErrorDisplay(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ppt/generate/${projectId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`
        );
      }

      const data = await res.json();
      console.log("Generated Summary:", data.powerPoint);
      setSlides(data.powerPoint.slides);
      setIsGenerating(false);
      setIsNotGenerated(false);
    } catch (error) {
      console.error("Error generating summary:", error);
      setErrorDisplay(
        error.message || "Failed to generate summary. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const updatePowerPointFromConclusion = async (message) => {
    setIsGenerating(true);
    setErrorDisplay(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ppt/update/${projectId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`
        );
      }

      const data = await res.json();
      console.log("Generated Summary:", data.powerPoint);
      setSlides(data.powerPoint.slides);
      setIsNotGenerated(false);
      setIsOpen(false);
      setUpdateMessage(""); // Clear the textarea
    } catch (error) {
      // console.error('Error generating summary:', error);
      console.log(error);
      setErrorDisplay(
        error.message || "Failed to generate summary. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % generationMessages.length);
    }, 5000); // Change message every 2.5 seconds

    return () => clearInterval(interval);
  }, [isGenerating, generationMessages.length]);

  if (isNotGenerated) {
    return (
      <div
        style={{ fontFamily: '"Manrope", sans-serif' }}
        className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm min-h-64 animate-fade-in"
      >
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gray-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <FileX className="relative w-20 h-20 text-gray-400 animate-bounce-subtle" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 animate-slide-up">
            No PowerPoint Available
          </h3>

          <p className="text-gray-600 text-center mb-8 leading-relaxed animate-slide-up delay-100">
            Create a professional presentation from your project data. We'll
            generate slides with smart layouts and design automatically.
          </p>

          {/* Generation Time Notice */}
          <div className="w-full mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg animate-slide-up delay-200">
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800 mb-1">
                  Please be patient
                </p>
                <p className="text-sm text-amber-700">
                  Generation might take some time as our system is working to
                  put together the best presentation for you.
                </p>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {errorDisplay && (
            <div className="w-full mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800 mb-1">
                    Generation Failed
                  </p>
                  <p className="text-sm text-red-700">{errorDisplay}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={generatePowerPoint}
            disabled={isGenerating}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md disabled:cursor-not-allowed min-w-36 animate-slide-up delay-300 hover:scale-105 transform"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span
                  key={currentMessageIndex}
                  className="animate-fade-in-text"
                >
                  {generationMessages[currentMessageIndex]}
                </span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2 animate-pulse" />
                Generate PowerPoint
              </>
            )}
          </button>

          {/* Help Text */}
          <p className="text-xs text-gray-500 mt-4 animate-slide-up delay-400">
            This will create 8-16 professional slides based on your project
            summary
          </p>

          {/* Progress indicator when generating */}
          {isGenerating && (
            <div className="mt-6 w-full max-w-xs animate-slide-up delay-500">
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full animate-progress-bar"></div>
              </div>
              <p
                key={`progress-${currentMessageIndex}`}
                className="text-xs text-gray-500 mt-2 text-center animate-fade-in-text"
              >
                {generationMessages[currentMessageIndex]}
              </p>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce-subtle {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }

          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-5px);
            }
            75% {
              transform: translateX(5px);
            }
          }

          @keyframes progress-bar {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          @keyframes fade-in-text {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }

          .animate-slide-up {
            animation: slide-up 0.6s ease-out both;
          }

          .animate-bounce-subtle {
            animation: bounce-subtle 2s ease-in-out infinite;
          }

          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }

          .animate-progress-bar {
            animation: progress-bar 2s ease-in-out infinite;
          }

          .animate-fade-in-text {
            animation: fade-in-text 0.5s ease-in-out;
          }

          .delay-100 {
            animation-delay: 0.1s;
          }

          .delay-200 {
            animation-delay: 0.2s;
          }

          .delay-300 {
            animation-delay: 0.3s;
          }

          .delay-400 {
            animation-delay: 0.4s;
          }

          .delay-500 {
            animation-delay: 0.5s;
          }
        `}</style>
      </div>
    );
  }

  // Layout Templates - Different structural arrangements
  const layoutTemplates = [
    {
      name: "Split View",
      component: "SplitLayout",
      description: "Classic left-right split with icon and bullet points"
    },
    {
      name: "Center Focus",
      component: "CenterLayout",
      description: "Centered content with surrounding elements"
    },
    {
      name: "Timeline Flow",
      component: "TimelineLayout",
      description: "Horizontal timeline with connected steps"
    },
    {
      name: "Card Grid",
      component: "CardLayout",
      description: "Grid of cards with icons and content"
    },
    {
      name: "Hero Banner",
      component: "HeroLayout",
      description: "Large hero section with overlay content"
    },
    {
      name: "Stats Dashboard",
      component: "StatsLayout",
      description: "Data-focused layout with metrics and charts"
    },
    {
      name: "Process Flow",
      component: "ProcessLayout",
      description: "Step-by-step process visualization"
    },
    {
      name: "Image Layout",
      component: "ImageLayout",
      description: "Visual-centric slide with large image and minimal text"
    }
  ];

  const getBackgroundTemplates = (patternColor) => {
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : null;
    };

    const rgb = hexToRgb(patternColor);
    const encodedColor = encodeURIComponent(patternColor);

    return [
      {
        name: "Blank",
        className: "bg-transparent",
        pattern: "none"
      },
      {
        name: "Neural Network",
        className:
          "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900",
        pattern: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='neural' width='100' height='100' patternUnits='userSpaceOnUse'%3e%3ccircle cx='20' cy='20' r='2' fill='${encodedColor}' fill-opacity='0.3'/%3e%3ccircle cx='80' cy='20' r='2' fill='${encodedColor}' fill-opacity='0.3'/%3e%3ccircle cx='50' cy='50' r='2' fill='${encodedColor}' fill-opacity='0.4'/%3e%3ccircle cx='20' cy='80' r='2' fill='${encodedColor}' fill-opacity='0.3'/%3e%3ccircle cx='80' cy='80' r='2' fill='${encodedColor}' fill-opacity='0.3'/%3e%3cline x1='20' y1='20' x2='50' y2='50' stroke='${encodedColor}' stroke-opacity='0.2' stroke-width='1'/%3e%3cline x1='80' y1='20' x2='50' y2='50' stroke='${encodedColor}' stroke-opacity='0.2' stroke-width='1'/%3e%3cline x1='50' y1='50' x2='20' y2='80' stroke='${encodedColor}' stroke-opacity='0.2' stroke-width='1'/%3e%3cline x1='50' y1='50' x2='80' y2='80' stroke='${encodedColor}' stroke-opacity='0.2' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23neural)'/%3e%3c/svg%3e")`
      },
      {
        name: "Abstract Constellation",
        className: "bg-gradient-to-br from-purple-900 to-black",
        pattern: `url("data:image/svg+xml,%3csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='constellation' width='120' height='120' patternUnits='userSpaceOnUse'%3e%3ccircle cx='20' cy='20' r='1.5' fill='${encodedColor}' fill-opacity='0.4'/%3e%3ccircle cx='60' cy='30' r='2' fill='${encodedColor}' fill-opacity='0.5'/%3e%3ccircle cx='100' cy='40' r='1' fill='${encodedColor}' fill-opacity='0.3'/%3e%3ccircle cx='30' cy='70' r='1.5' fill='${encodedColor}' fill-opacity='0.4'/%3e%3ccircle cx='80' cy='80' r='2' fill='${encodedColor}' fill-opacity='0.5'/%3e%3ccircle cx='110' cy='90' r='1' fill='${encodedColor}' fill-opacity='0.3'/%3e%3cline x1='20' y1='20' x2='60' y2='30' stroke='${encodedColor}' stroke-opacity='0.2' stroke-width='0.5'/%3e%3cline x1='60' y1='30' x2='100' y2='40' stroke='${encodedColor}' stroke-opacity='0.15' stroke-width='0.5'/%3e%3cline x1='30' y1='70' x2='80' y2='80' stroke='${encodedColor}' stroke-opacity='0.2' stroke-width='0.5'/%3e%3cline x1='20' y1='20' x2='30' y2='70' stroke='${encodedColor}' stroke-opacity='0.1' stroke-width='0.5'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23constellation)'/%3e%3c/svg%3e")`
      },
      {
        name: "Simple Dots",
        className: "bg-gradient-to-br from-gray-900 to-slate-800",
        pattern: `url("data:image/svg+xml,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='dots' width='40' height='40' patternUnits='userSpaceOnUse'%3e%3ccircle cx='20' cy='20' r='2' fill='${encodedColor}' fill-opacity='0.3'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23dots)'/%3e%3c/svg%3e")`
      },
      {
        name: "Flowing Topology",
        className:
          "bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900",
        pattern: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3e%3cpath d='M0 20c20 0 20-20 40-20s20 20 40 20 20-20 20-20v20c0 20-20 20-20 40s20 20 20 40-20 20-40 20-20-20-40-20-20 20-20 20V80c0-20 20-20 20-40S0 20 0 20z' fill='${encodedColor}' fill-opacity='0.1'/%3e%3cpath d='M20 0c0 20 20 20 20 40s-20 20-20 40 20 20 20 40-20 20-20 20h60c20 0 20-20 40-20s20 20 40 20 20-20 20-20H80c-20 0-20 20-40 20s-20-20-40-20 20-20 20-40-20-20-20-40 20-20 20-40S20 0 20 0z' fill='${encodedColor}' fill-opacity='0.08'/%3e%3c/svg%3e")`
      },
      {
        name: "Wave Ripples",
        className: "bg-gradient-to-br from-blue-900 to-cyan-900",
        pattern: `url("data:image/svg+xml,%3csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='ripples' width='80' height='80' patternUnits='userSpaceOnUse'%3e%3ccircle cx='40' cy='40' r='10' fill='none' stroke='${encodedColor}' stroke-opacity='0.15' stroke-width='1'/%3e%3ccircle cx='40' cy='40' r='20' fill='none' stroke='${encodedColor}' stroke-opacity='0.1' stroke-width='1'/%3e%3ccircle cx='40' cy='40' r='30' fill='none' stroke='${encodedColor}' stroke-opacity='0.05' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23ripples)'/%3e%3c/svg%3e")`
      },
      {
        name: "Minimal Triangles",
        className: "bg-gradient-to-br from-indigo-900 to-purple-900",
        pattern: `url("data:image/svg+xml,%3csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='triangles' width='60' height='60' patternUnits='userSpaceOnUse'%3e%3cpolygon points='30,10 50,40 10,40' fill='none' stroke='${encodedColor}' stroke-opacity='0.2' stroke-width='1'/%3e%3cpolygon points='30,25 40,35 20,35' fill='${encodedColor}' fill-opacity='0.1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23triangles)'/%3e%3c/svg%3e")`
      },
      {
        name: "Soft Squares",
        className: "bg-gradient-to-br from-slate-900 to-gray-800",
        pattern: `url("data:image/svg+xml,%3csvg width='50' height='50' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='squares' width='50' height='50' patternUnits='userSpaceOnUse'%3e%3crect x='15' y='15' width='20' height='20' fill='none' stroke='${encodedColor}' stroke-opacity='0.15' stroke-width='1'/%3e%3crect x='20' y='20' width='10' height='10' fill='${encodedColor}' fill-opacity='0.08'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23squares)'/%3e%3c/svg%3e")`
      }
    ];
  };

  const updateSlidePattern = (patternIndex) => {
    const patterns = getBackgroundTemplates(currentTheme?.accentColor);
    const selectedPattern = patterns[patternIndex];

    setSlides((prev) => {
      const newSlides = [...prev];
      newSlides[currentSlide] = {
        ...newSlides[currentSlide],
        slideTheme: {
          ...newSlides[currentSlide]?.slideTheme,
          patternIndex: patternIndex,
          backgroundPattern: selectedPattern.pattern
        }
      };

      // Save to backend after state update
      saveUpdatedSlides(newSlides);

      return newSlides;
    });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 font-[Manrope,sans-serif]">
        <div className="text-center space-y-6">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

          {/* Main message */}
          <p className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Preparing your pitch deck
          </p>

          {/* Subtitle */}
          <p className="text-gray-600 text-lg sm:text-xl">
            Hang tight — we’re getting everything ready for you.
          </p>

          {/* Animated dots */}
          <div className="flex justify-center gap-2 mt-4">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0s]" />
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.15s]" />
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.3s]" />
          </div>
        </div>
      </div>
    );

  const SplitLayout = ({ slide, theme }) => {
    const SlideIcon = iconMap[slide?.icon] || Shield; // Default fallback icon

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center h-full px-4 lg:px-12 py-8">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          <div className="flex justify-center lg:justify-start">
            <div
              style={{ color: theme?.accentColor }}
              className="text-4xl lg:text-6xl animate-pulse"
            >
              {SlideIcon ? <SlideIcon size={56} /> : slide?.icon}
            </div>
          </div>

          <div className="text-center lg:text-left space-y-3">
            <h2 className="text-2xl lg:text-5xl font-extrabold tracking-tight">
              {slide?.title}
            </h2>
            <h3 className="text-base lg:text-2xl">{slide?.subtitle}</h3>
            <p className="text-sm lg:text-lg">{slide?.content}</p>
          </div>
        </div>

        {/* RIGHT SIDE - ITEM LIST */}
        <div className="space-y-4">
          {slide?.items?.map((item, index) => {
            const ItemIcon = iconMap[item?.icon];

            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl transition duration-200 bg-white/10 dark:bg-white/5 hover:shadow-md border border-gray-200 dark:border-white/10"
              >
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 dark:bg-white/10"
                  style={{ color: theme?.accentColor }}
                >
                  {ItemIcon ? <ItemIcon size={24} /> : item?.icon}
                </div>

                <div className="flex-1">
                  <p className="text-sm lg:text-lg font-medium">{item.text}</p>
                </div>

                {item.value && (
                  <div
                    className="text-lg lg:text-2xl font-bold"
                    style={{ color: theme?.accentColor }}
                  >
                    {item.value}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const ImageSplitLayout = ({ slide, theme }) => {
    const [imageUrl, setImageUrl] = useState(slide?.imageUrl);

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      const uploadedImageUrl = await uploadSlideImage(file, currentSlide);
      if (uploadedImageUrl) {
        setSlides((prev) => {
          const newSlides = [...prev];
          newSlides[currentSlide] = {
            ...newSlides[currentSlide],
            imageUrl: uploadedImageUrl
          };
          return newSlides;
        });
      }
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full px-6 py-6 lg:px-12">
        {/* Text Section */}
        <div className="space-y-6 max-w-xl mx-auto lg:mx-0">
          <h2 className="text-2xl lg:text-5xl font-bold leading-tight">
            {slide?.title}
          </h2>
          <h4 className="text-base lg:text-2xl opacity-80">
            {slide?.subtitle}
          </h4>

          {/* Item List */}
          {slide?.items?.length > 0 && (
            <div className="space-y-4">
              {slide.items.map((item, index) => {
                const ItemIcon = iconMap[item?.icon];
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg backdrop-blur-md bg-white/10 dark:bg-black/10"
                  >
                    {/* Icon */}
                    <div className="flex items-center gap-3">
                      <div
                        style={{ color: theme?.accentColor }}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-opacity-10 border border-current"
                      >
                        {ItemIcon ? <ItemIcon size={20} /> : item?.icon}
                      </div>
                      <p className="text-sm lg:text-base text-left">
                        {item.text}
                      </p>
                    </div>

                    {/* Value */}
                    {item.value && (
                      <div
                        className="text-lg lg:text-2xl font-semibold"
                        style={{ color: theme?.accentColor }}
                      >
                        {item.value}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Fallback for points */}
          {slide?.points && !slide?.items && (
            <ul className="space-y-3">
              {slide.points.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm lg:text-base"
                >
                  <div
                    className="w-3 h-3 mt-2 rounded-full"
                    style={{ backgroundColor: theme?.accentColor }}
                  ></div>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Image Section */}
        <div className="flex items-center justify-center w-full">
          {imageUrl || slide?.imageUrl ? (
            <div className="relative group w-full max-w-md">
              <img
                src={`${API_BASE_URL}${imageUrl || slide?.imageUrl}`}
                alt="Slide Visual"
                className="object-contain w-full h-auto rounded-xl shadow-md"
                style={{
                  borderRadius: `${theme?.borderRadius || 12}px`,
                  opacity: theme?.imageOpacity || 1
                }}
              />

              {/* Hover Overlay (Desktop) */}
              <div className="absolute inset-0 hidden lg:flex items-center justify-center bg-black bg-opacity-40 rounded-xl opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() =>
                    document.getElementById("image-upload-input").click()
                  }
                  className="text-white text-sm px-4 py-2 rounded shadow"
                  style={{ backgroundColor: theme?.accentColor }}
                >
                  Change Image
                </button>
              </div>

              {/* Mobile Edit Icon */}
              <button
                onClick={() =>
                  document.getElementById("image-upload-input").click()
                }
                className="absolute top-2 right-2 lg:hidden w-8 h-8 flex items-center justify-center rounded-full shadow text-xs text-white"
                style={{ backgroundColor: theme?.accentColor }}
              >
                ✎
              </button>
            </div>
          ) : (
            <div
              className="w-full max-w-md h-64 rounded-xl border-2 border-dashed border-gray-400/30 flex flex-col items-center justify-center text-gray-500 text-sm cursor-pointer hover:bg-white/10 transition"
              onClick={() =>
                document.getElementById("image-upload-input").click()
              }
            >
              <Image className="w-10 h-10 mb-2 opacity-50" />
              <p>Add image</p>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            id="image-upload-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>
    );
  };

  const CenterLayout = ({ slide, theme }) => {
    const SlideIcon = iconMap[slide?.icon] || Shield; // Use Shield as default fallback

    return (
      <div className="text-center space-y-4 lg:space-y-8 h-full flex flex-col justify-center px-2 lg:px-0">
        <div
          style={{ color: theme?.accentColor }}
          className="flex justify-center text-3xl lg:text-5xl"
        >
          {SlideIcon ? (
            <SlideIcon className="inline-block" size={48} />
          ) : (
            slide?.icon
          )}
        </div>
        <div>
          <h5 className="text-2xl lg:text-5xl font-bold mb-2 lg:mb-4">
            {slide?.title}
          </h5>
          <h6 className="text-lg lg:text-2xl mb-3 lg:mb-6 opacity-80">
            {slide?.subtitle}
          </h6>
          <p className="text-sm lg:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            {slide?.content}
          </p>
        </div>
        <div className="flex justify-center flex-wrap gap-3 lg:gap-8 mt-4 lg:mt-8">
          {slide?.stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl px-6 py-4 lg:px-8 lg:py-6 bg-white/10 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-200 min-w-[120px] text-center"
            >
              <div
                className="text-xl lg:text-3xl font-bold mb-1 lg:mb-2"
                style={{ color: theme?.accentColor }}
              >
                {stat.value}
              </div>
              <div className="text-xs lg:text-sm opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const TimelineLayout = ({ slide, theme }) => {
    const SlideIcon = iconMap[slide?.icon] || Shield;

    return (
      <div className="h-full flex flex-col justify-center px-4 lg:px-12 py-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div
            className="flex justify-center text-5xl animate-pulse"
            style={{ color: theme?.accentColor }}
          >
            {SlideIcon ? <SlideIcon size={56} /> : slide?.icon}
          </div>
          <h2 className="text-2xl lg:text-4xl font-extrabold">
            {slide?.title}
          </h2>
          <h3 className="text-base lg:text-xl">{slide?.subtitle}</h3>
          <p className="text-sm lg:text-lg text-gray-700 dark:text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {slide?.content}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Line */}
          <div
            className="absolute top-5 lg:top-8 left-0 right-0 h-1 bg-opacity-30 z-0"
            style={{ backgroundColor: theme?.accentColor }}
          />

          {/* Steps */}
          <div className="relative flex flex-wrap justify-between items-start gap-4 z-10">
            {slide?.items?.map((item, index) => {
              const ItemIcon = iconMap[item?.icon];
              return (
                <div
                  key={index}
                  className="flex-1 min-w-[120px] text-center relative"
                >
                  {/* Circle */}
                  <div
                    className="w-10 h-10 lg:w-14 lg:h-14 rounded-full mx-auto flex items-center justify-center font-bold text-white text-sm lg:text-base shadow-md"
                    style={{
                      backgroundColor: theme?.accentColor,
                      boxShadow: `0 0 8px ${theme?.accentColor}`
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Text */}
                  <div className="mt-2 lg:mt-4 px-2 lg:px-4">
                    <p className="text-xs lg:text-sm opacity-90">{item.text}</p>
                    {item.value && (
                      <div
                        className="text-sm lg:text-lg font-bold mt-1"
                        style={{ color: theme?.accentColor }}
                      >
                        {item.value}
                      </div>
                    )}
                  </div>

                  {/* Optional Arrow or Dot */}
                  {index < slide?.items.length - 1 && (
                    <ArrowRight
                      className="absolute -right-2 lg:-right-4 top-5 lg:top-7 w-4 h-4 lg:w-5 lg:h-5 opacity-60"
                      style={{ color: theme?.accentColor }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const CardLayout = ({ slide, theme }) => {
    const SlideIcon = iconMap[slide?.icon] || Shield;

    return (
      <div className="h-full flex flex-col px-4 lg:px-12 py-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div
            className="flex justify-center text-4xl lg:text-6xl animate-pulse"
            style={{ color: theme?.accentColor }}
          >
            {SlideIcon ? <SlideIcon size={56} /> : slide?.icon}
          </div>
          <h2 className="text-2xl lg:text-4xl font-extrabold">
            {slide?.title}
          </h2>
          <h3 className="text-base lg:text-xl ">{slide?.subtitle}</h3>
          <p className="text-sm lg:text-lg max-w-3xl mx-auto leading-relaxed">
            {slide?.content}
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {slide?.items.map((item, index) => {
            const ItemIcon = iconMap[item?.icon];
            return (
              <div
                key={index}
                className="rounded-xl p-6 bg-white/10 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-lg transition-all text-center space-y-4 flex flex-col items-center justify-center"
              >
                {item.icon && (
                  <div
                    className="text-2xl lg:text-4xl"
                    style={{ color: theme?.accentColor }}
                  >
                    {ItemIcon ? <ItemIcon size={36} /> : item.icon}
                  </div>
                )}
                <p className="text-sm lg:text-base opacity-90">{item.text}</p>
                {item.value && (
                  <div
                    className="text-lg lg:text-2xl font-bold"
                    style={{ color: theme?.accentColor }}
                  >
                    {item.value}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const HeroLayout = ({ slide, theme }) => {
    const SlideIcon = iconMap[slide?.icon] || Shield;

    return (
      <div className="h-full flex items-center justify-center relative px-2 lg:px-0">
        <div className="absolute inset-0 bg-grey bg-opacity-40"></div>
        <div className="relative z-10 text-center max-w-4xl">
          <div
            style={{ color: theme?.accentColor }}
            className="flex justify-center mb-3 lg:mb-6 text-4xl lg:text-6xl"
          >
            {SlideIcon ? (
              <SlideIcon className="inline-block" size={56} />
            ) : (
              slide?.icon
            )}
          </div>
          <h5 className="text-3xl lg:text-6xl font-bold mb-3 lg:mb-6">
            {slide?.title}
          </h5>
          <h6 className="text-xl lg:text-3xl mb-4 lg:mb-8 opacity-90">
            {slide?.subtitle}
          </h6>
          <p className="text-sm lg:text-xl mb-6 lg:mb-12 opacity-80 leading-relaxed">
            {slide?.content}
          </p>
          <div className="flex flex-wrap justify-center gap-6 lg:gap-12">
            {slide?.stats.slice(0, 3).map((stat, index) => (
              <div
                key={index}
                className="rounded-xl p-6 bg-white/10 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-lg transition-all text-center space-y-4 flex flex-col items-center justify-center"
              >
                <div
                  className="text-lg lg:text-xl font-bold mb-1 lg:mb-2"
                  style={{ color: theme?.accentColor }}
                >
                  {stat.value}
                </div>
                <div className="text-sm lg:text-lg opacity-80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const StatsLayout = ({ slide, theme }) => {
    const SlideIcon = iconMap[slide?.icon] || Shield;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 h-full items-center px-4 lg:px-8">
        {/* LEFT SECTION: Title & Description */}
        <div className="col-span-1 space-y-4 lg:space-y-8 text-center lg:text-left">
          {/* Icon */}
          <div style={{ color: theme?.accentColor }}>
            {SlideIcon && <SlideIcon size={56} className="inline-block" />}
          </div>

          {/* Title */}
          <h2 className="text-2xl lg:text-4xl font-bold">{slide?.title}</h2>

          {/* Subtitle */}
          <h4 className="text-sm lg:text-lg font-medium opacity-80">
            {slide?.subtitle}
          </h4>

          {/* Content */}
          <p className="text-xs lg:text-base opacity-90 leading-relaxed max-w-xl mx-auto lg:mx-0">
            {slide?.content}
          </p>
        </div>

        {/* RIGHT SECTION: Stats */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8">
          {slide?.items.map((item, index) => {
            const ItemIcon = iconMap[item?.icon];

            return (
              <div
                key={index}
                className="bg-opacity-10 rounded-2xl p-4 lg:p-6 shadow-md backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="text-2xl lg:text-4xl font-bold"
                    style={{ color: theme?.accentColor }}
                  >
                    {item.value}
                  </div>

                  {item.icon && ItemIcon && (
                    <ItemIcon
                      size={28}
                      className="text-accent"
                      style={{ color: theme?.accentColor }}
                    />
                  )}
                </div>

                <p className="text-xs lg:text-sm font-medium opacity-85">
                  {item.text}
                </p>

                {/* Stat Bar */}
                <div className="mt-3 h-2 rounded-full bg-gray-300 dark:bg-gray-700 bg-opacity-30">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      backgroundColor: theme?.accentColor,
                      width: `${75 + index * 5}%`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const ProcessLayout = ({ slide, theme }) => {
    const SlideIcon = iconMap[slide?.icon] || Shield;

    return (
      <div className="h-full flex flex-col justify-center px-4 lg:px-12 py-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div
            className="mb-4 flex justify-center text-4xl lg:text-6xl"
            style={{ color: theme?.accentColor }}
          >
            {SlideIcon && <SlideIcon size={60} className="inline-block" />}
          </div>
          <h2 className="text-2xl lg:text-4xl font-bold mb-2">
            {slide?.title}
          </h2>
          <h4 className="text-base lg:text-xl font-medium opacity-80 mb-4">
            {slide?.subtitle}
          </h4>
          <p className="text-sm lg:text-base opacity-90 max-w-3xl mx-auto leading-relaxed">
            {slide?.content}
          </p>
        </div>

        {/* Process Steps */}
        <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-8">
          {slide?.items.map((item, index) => {
            const ItemIcon = iconMap[item?.icon];

            return (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center text-center max-w-[180px] lg:max-w-[200px] space-y-3">
                  {/* Icon/Step */}
                  <div
                    className="w-14 h-14 lg:w-20 lg:h-20 flex items-center justify-center rounded-full shadow-md text-white font-semibold text-xl lg:text-2xl"
                    style={{ backgroundColor: theme?.accentColor }}
                  >
                    {ItemIcon ? <ItemIcon size={30} /> : item.icon || index + 1}
                  </div>

                  {/* Value */}
                  <h3
                    className="text-sm lg:text-base font-semibold"
                    style={{ color: theme?.accentColor }}
                  >
                    {item.value}
                  </h3>

                  {/* Description */}
                  <p className="text-xs lg:text-sm opacity-85">{item.text}</p>
                </div>

                {/* Arrow between steps */}
                {index < slide?.items.length - 1 && (
                  <>
                    {/* Horizontal arrow for large screens */}
                    <div className="hidden lg:block">
                      <ArrowRight
                        className="w-8 h-8 text-opacity-60"
                        style={{ color: theme?.accentColor }}
                      />
                    </div>

                    {/* Vertical arrow for small screens */}
                    <div className="lg:hidden">
                      <ArrowDown
                        className="w-6 h-6 text-opacity-60"
                        style={{ color: theme?.accentColor }}
                      />
                    </div>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLayout = () => {
    const currentSlideData = slides[currentSlide];
    const currentTheme = slides[currentSlide]?.slideTheme;
    // console.log(currentTheme)
    const currentLayout = layoutTemplates[currentTheme?.layoutIndex];

    const layoutProps = {
      slide: currentSlideData,
      theme: currentTheme
    };

    switch (currentLayout?.component) {
      case "SplitLayout":
        return <SplitLayout {...layoutProps} />;
      case "CenterLayout":
        return <CenterLayout {...layoutProps} />;
      case "TimelineLayout":
        return <TimelineLayout {...layoutProps} />;
      case "CardLayout":
        return <CardLayout {...layoutProps} />;
      case "HeroLayout":
        return <HeroLayout {...layoutProps} />;
      case "StatsLayout":
        return <StatsLayout {...layoutProps} />;
      case "ProcessLayout":
        return <ProcessLayout {...layoutProps} />;
      case "ImageLayout":
        return <ImageSplitLayout {...layoutProps} />;
      default:
        return <SplitLayout {...layoutProps} />;
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides?.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides?.length) % slides?.length);
  };

  const updateSlideTheme = async (property, value) => {
    setSlides((prev) => {
      const newSlides = [...prev];
      const current = newSlides[currentSlide];

      let updatedSlideTheme = {
        ...current.slideTheme,
        [property]: value
      };

      // If updating patternIndex, also update backgroundPattern
      if (property === "patternIndex") {
        const patterns = getBackgroundTemplates(currentTheme?.accentColor);
        const selectedPattern = patterns[value];
        updatedSlideTheme.backgroundPattern = selectedPattern?.pattern || "";
      }

      newSlides[currentSlide] = {
        ...current,
        slideTheme: updatedSlideTheme
      };

      // Save to backend after updating state
      saveUpdatedSlides(newSlides);

      return newSlides;
    });
  };

  const saveUpdatedSlides = async (updatedSlides) => {
    try {
      const token = localStorage.getItem("access_token");
      await fetch(`${API_BASE_URL}/api/ppt/edit/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ slides: updatedSlides })
      });
      console.log("Slides synced to backend");
    } catch (error) {
      console.error("Failed to sync slides:", error);
    }
  };

  const uploadSlideImage = async (file, slideIndex) => {
    const formData = new FormData();
    formData.append("slideImage", file); // name must match multer field
    formData.append("slideIndex", slideIndex.toString());

    // 🔍 Log all form fields before upload
    console.log("📦 FormData contents:");
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}:`, pair[1].name, pair[1].type, pair[1].size);
      } else {
        console.log(`${pair[0]}:`, pair[1]);
      }
    }

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ppt/edit-image/${projectId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
            // ❗DO NOT manually set Content-Type when using FormData
          },
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Upload failed:", data);
        throw new Error(data.message || JSON.stringify(data));
      }

      console.log("✅ Image uploaded:", data.imageUrl);
      return data.imageUrl;
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("Failed to upload image.");
      return null;
    }
  };

  const currentSlideData = slides[currentSlide];
  const currentTheme = slides[currentSlide]?.slideTheme;
  const currentLayout = layoutTemplates[currentTheme?.layoutIndex];
  const templates = getBackgroundTemplates(currentTheme?.accentColor);
  const template = templates[currentTheme?.backgroundTemplateIndex || 0];

  return (
    <>
      <Header />

      <div
        style={{
          fontFamily: "Manrope"
        }}
        className="min-h-screen bg-gray-100 p-2 sm:p-4"
      >
        {/* Enhanced Control Panel - Mobile Responsive */}
        <div className="max-w-6xl mx-auto mb-4 sm:mb-6">
          <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
            {/* Mobile: Stack controls vertically, Desktop: Horizontal */}
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-6 sm:items-center">
              {/* Current Slide Info - Full width on mobile */}
              <div className="flex items-center justify-center sm:justify-start gap-3 order-1">
                <span className="text-sm font-semibold text-gray-700 text-center sm:text-left">
                  Slide {currentSlide + 1}: {currentSlideData?.title}
                </span>
              </div>
              {/* Mobile: Two columns for selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-4 sm:gap-6 order-2 sm:order-none">
                {/* Layout Selector */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <Layout className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                  <label className="text-xs sm:text-sm font-medium text-gray-700 flex-shrink-0">
                    Layout:
                  </label>
                  <select
                    value={currentTheme?.layoutIndex}
                    onChange={(e) =>
                      updateSlideTheme("layoutIndex", Number(e.target.value))
                    }
                    className="flex-1 min-w-0 px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {layoutTemplates.map((layout, index) => (
                      <option key={index} value={index}>
                        {layout.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pattern Selector */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <Grid className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                  <label className="text-xs sm:text-sm font-medium text-gray-700 flex-shrink-0">
                    Pattern:
                  </label>
                  <select
                    value={currentTheme?.patternIndex || 0}
                    onChange={(e) => updateSlidePattern(Number(e.target.value))}
                    className="flex-1 min-w-0 px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {getBackgroundTemplates(currentTheme?.accentColor).map(
                      (pattern, index) => (
                        <option key={index} value={index}>
                          {pattern.name}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* Color Controls - Grid layout on mobile */}
              <div className="grid grid-cols-3 sm:flex gap-3 sm:gap-6 order-3 sm:order-none">
                {/* Background Color */}
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <label className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">
                      Background:
                    </label>
                    <label className="text-xs font-medium text-gray-700 sm:hidden">
                      BG
                    </label>
                  </div>
                  <input
                    type="color"
                    value={currentTheme?.backgroundColor}
                    onChange={(e) =>
                      updateSlideTheme("backgroundColor", e.target.value)
                    }
                    className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded cursor-pointer"
                  />
                </div>

                {/* Accent Color */}
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <label className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">
                      Accent:
                    </label>
                    <label className="text-xs font-medium text-gray-700 sm:hidden">
                      Accent
                    </label>
                  </div>
                  <input
                    type="color"
                    value={currentTheme?.accentColor}
                    onChange={(e) =>
                      updateSlideTheme("accentColor", e.target.value)
                    }
                    className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded cursor-pointer"
                  />
                </div>

                {/* Text Color */}
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Type className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <label className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">
                      Text:
                    </label>
                    <label className="text-xs font-medium text-gray-700 sm:hidden">
                      Text
                    </label>
                  </div>
                  <input
                    type="color"
                    value={currentTheme?.textColor}
                    onChange={(e) =>
                      updateSlideTheme("textColor", e.target.value)
                    }
                    className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded cursor-pointer"
                  />
                </div>

                {/* Edit Button */}
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">
                      Edit:
                    </label>
                    <label className="text-xs font-medium text-gray-700 sm:hidden">
                      Edit
                    </label>
                  </div>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded cursor-pointer flex items-center justify-center transition-all duration-200 ${
                      isOpen
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {isOpen ? (
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Layout Description - Hidden on mobile, visible on larger screens */}
              <div className="hidden lg:flex lg:ml-auto items-center gap-2 order-4">
                <span className="text-xs text-gray-500 max-w-48">
                  {currentLayout?.description}
                </span>
                <span className="text-sm text-gray-600">
                  {currentSlide + 1} / {slides?.length}
                </span>
              </div>

              {/* Mobile slide counter */}
              <div className="flex lg:hidden justify-center items-center order-4">
                <span className="text-sm text-gray-600 font-medium">
                  {currentSlide + 1} / {slides?.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
              {!isGenerating ? (
                // Normal modal view
                <>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold text-gray-800">
                      Update Pitch Deck
                    </p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <textarea
                    placeholder="Optional message (e.g. 'Add AI angle', 'Focus more on financials')"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    value={updateMessage}
                    onChange={(e) => setUpdateMessage(e.target.value)}
                  />

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() =>
                        updatePowerPointFromConclusion(updateMessage)
                      }
                    >
                      Update Pitch Deck
                    </button>
                  </div>
                </>
              ) : (
                // Loading view
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    Updating Pitch Deck
                  </p>
                  <p className="text-gray-600">
                    Please wait while we update your presentation...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Slide Container - Responsive aspect ratio */}
        <div className="max-w-6xl mx-auto">
          <div
            className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
            style={{ aspectRatio: window.innerWidth < 640 ? "4/3" : "16/9" }}
          >
            {/* Slide Content - Responsive padding with extra space for arrows on mobile */}
            <div
              className="relative w-full h-full px-6 py-2 sm:px-8 sm:py-8 lg:px-12 lg:py-12 text-xs sm:text-base"
              style={{
                backgroundColor: currentTheme?.backgroundColor,
                backgroundImage:
                  currentTheme?.backgroundPattern ||
                  getBackgroundTemplates(currentTheme?.accentColor)[
                    currentTheme?.patternIndex || 0
                  ].pattern,
                color: currentTheme?.textColor,
                fontSize: window.innerWidth < 640 ? "0.6rem" : undefined
              }}
            >
              <div className="h-full overflow-auto">{renderLayout()}</div>

              {/* Slide Number - Responsive positioning and size */}
              <div className="absolute bottom-1 right-1 sm:bottom-4 sm:right-4 lg:bottom-6 lg:right-6 bg-opacity-20 backdrop-blur-sm rounded-full px-1.5 py-0.5 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 z-10">
                <span className="text-xs sm:text-sm font-medium">
                  {currentSlide + 1}
                </span>
              </div>
            </div>

            {/* Navigation Arrows - Improved mobile positioning */}
            <button
              onClick={prevSlide}
              className="absolute hidden lg:block left-0 sm:left-2 lg:left-4 top-1/2 transform -translate-y-1/2 bg-blue600 bg-opacity-30 hover:bg-opacity-50 backdrop-blur-sm rounded-r-lg sm:rounded-full p-2 sm:p-3 transition-all duration-200 touch-manipulation z-20 shadow-lg"
              style={{ color: "white" }}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute  hidden lg:block bg-blue600 right-0 sm:right-2 lg:right-4 top-1/2 transform -translate-y-1/2 bg-opacity-30 hover:bg-opacity-50 backdrop-blur-sm rounded-l-lg sm:rounded-full p-2 sm:p-3 transition-all duration-200 touch-manipulation z-20 shadow-lg"
              style={{ color: "white" }}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </button>
          </div>

          {/* Mobile Navigation Buttons - Alternative approach */}
          <div className="mt-2 sm:hidden flex justify-between items-center bg-white rounded-lg shadow-md p-2">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors duration-200 text-sm touch-manipulation"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <span className="text-sm font-medium text-gray-600">
              {currentSlide + 1} / {slides?.length}
            </span>

            <button
              onClick={nextSlide}
              disabled={currentSlide === slides?.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors duration-200 text-sm touch-manipulation"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Enhanced Slide Thumbnails - Mobile responsive */}
          <div className="mt-4 sm:mt-6 flex justify-center overflow-x-auto">
            <div className="flex gap-1 sm:gap-2 bg-white rounded-lg p-2 sm:p-4 shadow-lg min-w-max">
              {slides?.map((slide, index) => {
                const thumbTheme = slide?.slideTheme;
                const thumbLayout =
                  layoutTemplates[slide?.slideTheme?.layoutIndex];

                return (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-12 h-8 sm:w-16 sm:h-10 lg:w-20 lg:h-12 rounded-md border-2 transition-all duration-200 overflow-hidden relative flex-shrink-0 touch-manipulation ${
                      currentSlide === index
                        ? "border-blue-500 ring-1 sm:ring-2 ring-blue-200"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{
                      backgroundColor: slide?.slideTheme?.backgroundColor
                    }}
                  >
                    <div className="absolute inset-0 p-0.5 sm:p-1">
                      <div className="w-full h-full flex items-center justify-center">
                        <div
                          className="text-xs font-medium opacity-75"
                          style={{ color: thumbTheme?.textColor }}
                        >
                          {index + 1}
                        </div>
                      </div>
                      {/* Layout indicator */}
                      <div
                        className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full"
                        style={{ backgroundColor: thumbTheme?.accentColor }}
                      ></div>
                    </div>

                    {/* Hover tooltip - Hidden on mobile */}
                    <div className="hidden sm:block absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                      {slide?.title} - {thumbLayout.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Presentation Controls - Mobile responsive */}
          <div className="mt-4 sm:mt-6 flex justify-center">
            <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 w-full max-w-2xl">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                {/* Mobile: Stack buttons and info */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <div className="flex gap-2 sm:gap-4">
                    <button
                      onClick={() => setCurrentSlide(0)}
                      className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 text-sm touch-manipulation"
                    >
                      <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Start Over</span>
                      <span className="sm:hidden">Reset</span>
                    </button>

                    <button
                      onClick={() => {
                        // Simple fullscreen toggle for presentation mode
                        const elem = document.documentElement;
                        if (!document.fullscreenElement) {
                          elem.requestFullscreen?.();
                        } else {
                          document.exitFullscreen?.();
                        }
                      }}
                      className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors duration-200 text-sm touch-manipulation"
                    >
                      <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                      Present
                    </button>
                  </div>

                  {/* Info text - Responsive layout */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-center sm:text-left">
                    <div className="text-xs sm:text-sm text-gray-600">
                      Layout:{" "}
                      <span className="font-medium">{currentLayout?.name}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Theme: <span className="font-medium">Custom</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PitchDeckSystem;
