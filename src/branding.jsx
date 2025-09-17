import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Upload,
  Palette,
  Type,
  Eye,
  Target,
  Lightbulb,
  MessageSquare,
  Save,
  Home,
  Loader2,
  Info
} from "lucide-react";
import bci from "./images/bc.png";
import success from "./images/success.png";
import defaultImage from "./images/upload_dfeault.png";
import Header from "./component/header";
import { SketchPicker } from "react-color";
// import { useNavigate } from 'react-router-dom';
import SelectFont from "./component/selectFonts";
import LogoModal from "./component/logoModal";
import { Toaster, toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "./config/apiConfig";
import { useNavigate } from "react-router-dom";

function PagePositioning() {
  const navigate = useNavigate(); // Commented out for artifact compatibility
  const [loading, setLoading] = useState(false);
  const [font, setFont] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isOpenY, setIsOpenY] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  const access_token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;
  const [types, setTypes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [successMessage, setSuccessMessage] = useState("");

  const [showFontPicker, setShowFontPicker] = useState(false);
  const [selectedFont, setSelectedFont] = useState("");
  const fonts = [
    "Select",
    "Arial",
    "Verdana",
    "Times New Roman",
    "Helvetica",
    "Courier New"
  ];

  const projectId = localStorage.getItem("nProject");

  const handleAddFontClick = () => {
    setShowFontPicker(true);
  };

  const handleChangeF = (e) => {
    setFont({
      [e.target.id]: e.target.value
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleFontSelect = (font) => {
    setSelectedFont(font);
    setShowFontPicker(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file");
    }
  };

  const handleButtonClick = () => {
    setShowPicker(!showPicker);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBrand(formData);
  };

  const [formData, setFormData] = useState({
    brandName: "",
    vision: "",
    philosophy: "",
    mission: "",
    slogan: ""
  });

  const updateBrand = async () => {
    setLoading(true);
    console.log(formData);
    try {
      formData.image = selectedImage;
      formData.projectId = projectId;
      formData.font = selectedFont;
      formData.color = selectedColor;

      console.log(formData);

      const response = await fetch(`${API_BASE_URL}/api/brand/${projectId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        toast.success(responseData.message);
        setFormData({
          brandName: "",
          vision: "",
          philosophy: "",
          mission: "",
          slogan: ""
        });
      } else {
        const result = await response.json();
        toast.error(result.error);
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An error occurred while updating the brand");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBrandDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/brand/${projectId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`
          }
        });
        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
          const {
            brandName,
            vision,
            philosophy,
            mission,
            slogan,
            font,
            color
          } = data;
          setFormData({ brandName, vision, philosophy, mission, slogan });
          setSelectedColor(color);
          setSelectedFont(font);
        } else {
          const data = await response.json();
          console.log(data);
          console.error("Failed to fetch  details");
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchBrandDetails();
  }, []);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/hub/types/project/Brand/${projectId}`
        );
        const data = await response.json();
        console.log(data);
        setTypes(data.hubs);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    fetchTypes();
  }, []);

  const handleB = () => {
    navigate("/brandingUpload");
  };
  console.log(types);
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="w-full">
        <div className="px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 max-w-7xl mx-auto">
          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <button
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm text-sm sm:text-base"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Back</span>
            </button>
            <div className="flex items-center">
              <Home size={20} className="sm:w-6 sm:h-6 text-gray-600" />
            </div>
          </div>

          {/* Page Title */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 sm:gap-3 text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg mb-3 sm:mb-4">
              <Palette size={20} className="sm:w-6 sm:h-6" />
              <h1 className="text-xl sm:text-2xl text-black font-bold">
                Branding
              </h1>
            </div>
            <p className="text-gray-600 text-base sm:text-lg px-4">
              Create and customize your brand identity
            </p>
          </div>

          {/* Logo Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="text-center">
              <div
                onClick={handleB}
                className="relative inline-block mb-4 sm:mb-6"
              >
                <img
                  src={defaultImage}
                  alt="Selected"
                  className="brandlogo mb-[30px] "
                />
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-blue-600 text-white rounded-full p-1.5 sm:p-2 shadow-lg">
                  <Upload size={12} className="sm:w-4 sm:h-4" />
                </div>
              </div>

              <button
                onClick={handleB}
                className="flex items-center gap-2 mx-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium text-sm sm:text-base"
              >
                <Upload size={16} className="sm:w-5 sm:h-5" />
                Upload/Change Logo
              </button>
            </div>

            {/* Logo Gallery - Only show if types exist */}
            {types.length > 0 && (
              <div className="mt-6 sm:mt-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <Eye size={18} className="sm:w-5 sm:h-5" />
                  Logo Variations
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-4">
                  {types.map((imageDetail, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-50 rounded-lg sm:rounded-xl border-2 border-gray-200 overflow-hidden hover:border-blue-300 transition-colors duration-200">
                        <img
                          src={`${API_BASE_URL}/images/${imageDetail.hubFile}`}
                          alt={`Logo variation ${index + 1}`}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Brand Details Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
            <div className="space-y-6 sm:space-y-8">
              {/* Brand Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-800">
                  <Type size={18} className="sm:w-5 sm:h-5 text-blue-600" />
                  Brand Name
                </label>
                <input
                  type="text"
                  id="brandName"
                  placeholder="Enter your brand name"
                  value={formData.brandName}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200 text-base sm:text-lg"
                />
              </div>

              {/* Color and Font Selection */}
              <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6 xl:gap-8">
                {/* Color Picker */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-800">
                    <Palette
                      size={18}
                      className="sm:w-5 sm:h-5 text-blue-600"
                    />
                    Brand Color
                  </label>
                  <div className="flex flex-col xs:flex-row gap-3">
                    <div className="flex-1 relative">
                      <input
                        id="color"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                        placeholder="Select Color"
                        readOnly
                        value={selectedColor}
                      />
                      <div
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: selectedColor }}
                      ></div>
                    </div>
                    <button
                      className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm text-sm sm:text-base whitespace-nowrap"
                      onClick={handleButtonClick}
                    >
                      <Palette size={16} className="sm:w-5 sm:h-5" />
                      {showPicker ? "Close" : "Select"}
                    </button>
                  </div>
                  {showPicker && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <SketchPicker
                        color={selectedColor}
                        onChange={handleColorChange}
                        presetColors={[]}
                        disableAlpha
                        width="100%"
                      />
                    </div>
                  )}
                </div>

                {/* Font Picker */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-800">
                    <Type size={18} className="sm:w-5 sm:h-5 text-blue-600" />
                    Writing Font/Style
                  </label>
                  <div className="flex flex-col xs:flex-row gap-3">
                    <input
                      id="font"
                      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      placeholder="Select font"
                      readOnly
                      value={selectedFont}
                      onChange={handleChangeF}
                    />
                    {!showFontPicker && (
                      <button
                        className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm text-sm sm:text-base whitespace-nowrap"
                        onClick={handleAddFontClick}
                      >
                        <Type size={16} className="sm:w-5 sm:h-5" />
                        Select
                      </button>
                    )}
                  </div>
                  {showFontPicker && (
                    <div className="mt-4">
                      <SelectFont fonts={fonts} onSelect={handleFontSelect} />
                    </div>
                  )}
                </div>
              </div>

              {/* Slogan */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-800">
                  <MessageSquare
                    size={18}
                    className="sm:w-5 sm:h-5 text-blue-600"
                  />
                  Slogan
                </label>
                <input
                  type="text"
                  id="slogan"
                  placeholder="Enter your brand slogan"
                  value={formData.slogan}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                />
              </div>

              {/* Vision */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-800">
                  <Eye size={18} className="sm:w-5 sm:h-5 text-blue-600" />
                  Vision
                </label>
                <textarea
                  id="vision"
                  placeholder="Describe your brand's vision for the future"
                  value={formData.vision}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200 resize-none"
                />
              </div>

              {/* Mission */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-800">
                  <Target size={18} className="sm:w-5 sm:h-5 text-blue-600" />
                  Mission
                </label>
                <textarea
                  id="mission"
                  placeholder="Define your brand's mission and purpose"
                  value={formData.mission}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200 resize-none"
                />
              </div>

              {/* Philosophy */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-800">
                  <Lightbulb
                    size={18}
                    className="sm:w-5 sm:h-5 text-blue-600"
                  />
                  Philosophy
                </label>
                <textarea
                  id="philosophy"
                  placeholder="Share your brand's core philosophy and values"
                  value={formData.philosophy}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200 resize-none"
                />
              </div>
            </div>
            <Toaster richColors position="top-right" />
            {/* Save Button */}
            <div className="mt-8 sm:mt-10 text-center">
              <button
                type="submit"
                className="w-full xs:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white rounded-lg sm:rounded-xl hover:bg-green-700 transition-colors duration-200 font-semibold text-base sm:text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="sm:w-5 sm:h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} className="sm:w-5 sm:h-5" />
                    Save Brand
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PagePositioning;
