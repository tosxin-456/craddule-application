import React, { useState, useEffect } from "react";
import Header from "./component/header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "./config/apiConfig";
import { jwtDecode } from "jwt-decode";
import { Toaster, toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import home from "./images/HOME.png";

function NetProfit() {
  const navigate = useNavigate();
  const [visibleYears, setVisibleYears] = useState(1);
  const [monthInputs, setMonthInputs] = useState({});
  const [graphName, setGraphName] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");
  const decodedToken = token ? jwtDecode(token) : {};
  const userId = decodedToken.userId;

  const monthLabels = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JULY",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC"
  ];

  useEffect(() => {
    setMonthInputs((prev) => {
      const key = `year${visibleYears}`;
      if (prev[key]) return prev;
      const newMonths = {};
      monthLabels.forEach((m) => (newMonths[m] = ""));
      return {
        ...prev,
        [key]: newMonths
      };
    });
  }, [visibleYears]);

  const handleInputChangeName = (e) => setGraphName(e.target.value);

  const handleInputChange = (year, month, value) => {
    const cleanValue = value.trim() === "" ? "0" : value;
    const yearKey = `year${year}`;
    setMonthInputs((prev) => ({
      ...prev,
      [yearKey]: {
        ...prev[yearKey],
        [month]: cleanValue
      }
    }));
  };

  const addYear = () => setVisibleYears((prev) => prev + 1);
  const removeYear = () =>
    visibleYears > 1 && setVisibleYears((prev) => prev - 1);

  const sendDataToAPI = async (data) => {
    try {
      data.userId = userId;
      data.projectId = localStorage.getItem("nProject");
      data.graphType = "NetProfit";
      data.graphName = graphName;

      const response = await axios.post(`${API_BASE_URL}/api/graph`, data);
      console.log("Graph saved successfully:", response.data);
      setLoading(false);
      navigate("/netProfit");
    } catch (error) {
      setLoading(false);
      if (error.response) {
        toast.error(error.response.data.error || "Failed to save graph.");
        console.error(error.response.data);
      }
    }
  };

  const handleSubmit = () => {
    if (!graphName.trim()) {
      toast.error("Graph name is required.");
      return;
    }

    const dataToSend = {
      years: [...Array(visibleYears)].map((_, index) => {
        const key = `year${index + 1}`;
        return {
          year: index + 1,
          months: Object.entries(monthInputs[key] || {}).map(
            ([month, value]) => ({
              month,
              value: parseFloat(value) || 0 // Converts to number, defaults to 0 if empty/invalid
            })
          )
        };
      })
    };

    setLoading(true);
    sendDataToAPI(dataToSend);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="px-10 py-8">
        <div className=" flex justify-evenly">
          <div className="mr-auto ">
            <button className="mainBtn" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
          <div>
            <img src={home} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Net Profit
            </h1>
            <p className="text-gray-600">Enter your monthly net profit data</p>
          </div>

          {/* Graph Name Input */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Graph Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={graphName}
              onChange={handleInputChangeName}
              placeholder="Enter graph name..."
            />
          </div>

          {/* Year Inputs */}
          <div className="space-y-8">
            {[...Array(visibleYears)].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Year {index + 1}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {monthLabels.map((month) => (
                    <div key={month} className="flex flex-col">
                      <input
                        type="number"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-center"
                        onChange={(e) =>
                          handleInputChange(index + 1, month, e.target.value)
                        }
                        placeholder="0.0"
                      />
                      <label className="text-xs font-medium text-gray-600 text-center mt-2">
                        {month}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Add/Remove Year Controls */}
          <div className="flex justify-center items-center space-x-4 my-8">
            <button
              onClick={addYear}
              className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full text-2xl font-bold transition transform hover:scale-105 shadow-md"
              title="Add Year"
            >
              +
            </button>
            {visibleYears > 1 && (
              <button
                onClick={removeYear}
                className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full text-2xl font-bold transition transform hover:scale-105 shadow-md"
                title="Remove Year"
              >
                −
              </button>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition transform hover:scale-105 shadow-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faCircleNotch} spin />
                  <span>Submitting...</span>
                </div>
              ) : (
                "Submit Data"
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-1">Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Enter monthly net profit in numbers (e.g., 80000)</li>
              <li>• Leave empty for months with no data — default is 0</li>
              <li>• Use the "+" to add a new year</li>
              <li>• Use the "−" to remove the last year</li>
            </ul>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default NetProfit;
