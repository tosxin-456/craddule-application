import React, { useState, useEffect } from "react";
import bci from "./images/bc.png";
import Header from "./component/header";
// import SideMenu2 from './component/sideMenu2';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "./config/apiConfig";
import { jwtDecode } from "jwt-decode";
import { Toaster, toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import home from "./images/HOME.png";

function InflationCreate() {
  const navigate = useNavigate();
  const [visibleYears, setVisibleYears] = useState(1);
  const [monthInputs, setMonthInputs] = useState({});
  const [graphName, setGraphName] = useState("");
  const [loading, setLoading] = useState(false);

  const onClickHandler = () => navigate(`/inflationRateGraph`);
  const onClickHandler1 = () => navigate(`/financialPintegrate`);

  const token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  // Function to handle changes in the input field
  const handleInputChangeName = (event) => {
    // Update the graphName state variable with the new value entered into the input field
    setGraphName(event.target.value);
  };

  const months = [
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
    // Function to generate months for a given year
    const generateMonthsForYear = (year) => {
      const months = {};
      for (let i = 0; i < 12; i++) {
        months[`month${i + 1}`] = ""; // Initialize each month with an empty string
      }
      return months;
    };

    // Initialize monthInputs with months for the first year
    setMonthInputs({
      ...monthInputs,
      [`year${visibleYears}`]: generateMonthsForYear(visibleYears)
    });
  }, [visibleYears]);

  const addYear = () => {
    setVisibleYears(visibleYears + 1);
  };

  const removeYear = () => {
    if (visibleYears > 1) {
      setVisibleYears(visibleYears - 1);
    }
  };

  const sendDataToAPI = async (data) => {
    console.log(data);
    try {
      data.userId = userId;
      data.projectId = localStorage.getItem("nProject");
      data.graphType = "Inflation";
      data.graphName = graphName;
      console.log(data);

      const response = await axios.post(API_BASE_URL + "/api/graph", data);
      console.log("Graph saved successfully:", response.data);
      setLoading(false);
      navigate("/inflation");
    } catch (error) {
      setLoading(false);
      if (error.response) {
        toast.error(error.response.data.error);
        console.log(error.response.data);
        console.log(error.response.data);
      }
      console.error("Error sending data to API:", error);
    }
  };

  const deleteAllGraphs = async () => {
    const graphName = "tourism event";
    try {
      const response = await fetch(
        `http://localhost:3001/api/graph/${graphName}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete all graphs");
      }

      console.log("deleted");
      // Handle success, e.g., show a success message
    } catch (error) {
      console.error("Error deleting all graphs:", error);
      // Handle error, e.g., show an error message
    }
  };

  const handleInputChange = (year, month, value) => {
    setMonthInputs((prevInputs) => {
      // Set the value to "0" if the input is empty
      const updatedMonthValue = value.trim() === "" ? "0" : value;

      const updatedYear = {
        ...prevInputs[year],
        [month]: updatedMonthValue // Set the month value to either the input value or "0"
      };

      return {
        ...prevInputs,
        [year]: updatedYear
      };
    });
  };

  // const handleInputChange = (year, month, value) => {
  //     setMonthInputs(prevInputs => {
  //         const updatedYear = {
  //             ...prevInputs[year],
  //             [month]: value
  //         };

  //         // Check if any month in the year has a non-empty value
  //         const hasNonEmptyMonth = Object.values(updatedYear).some(monthValue => monthValue.trim() !== '');

  //         // If no month has a non-empty value, remove the year from the state
  //         if (!hasNonEmptyMonth) {
  //             const updatedInputs = { ...prevInputs };
  //             delete updatedInputs[year];
  //             return updatedInputs;
  //         }

  //         // If the month value is empty, remove it from the year
  //         if (value.trim() === '') {
  //             const { [month]: _, ...updatedYearWithoutEmptyMonth } = updatedYear;
  //             return {
  //                 ...prevInputs,
  //                 [year]: updatedYearWithoutEmptyMonth
  //             };
  //         }

  //         return {
  //             ...prevInputs,
  //             [year]: updatedYear
  //         };
  //     });
  // };

  const handleSubmit = () => {
    // Prepare the data to be sent to the API
    const dataToSend = {
      years: [...Array(visibleYears)].map((_, index) => {
        const key = `year${index + 1}`;
        return {
          year: index + 1,
          months: Object.entries(monthInputs[key] || {}).map(
            ([month, value]) => ({
              month,
              value: parseFloat(value) || 0 // Ensures numeric values; empty or invalid = 0
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
      <div className="w-full">
        {/* Header placeholder */}
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
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Inflation
              </h1>
              <p className="text-gray-600">Create your inflation data</p>
            </div>

            {/* Graph Name Input */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Graph Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                value={graphName}
                onChange={handleInputChangeName}
                placeholder="Enter graph name..."
              />
            </div>

            {/* Years Data */}
            <div className="space-y-8">
              {[...Array(visibleYears)].map((_, index) => (
                <div key={index + 1} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Year {index + 1}
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {months.map((month) => (
                      <div key={month} className="flex flex-col">
                        <input
                          type="number"
                          step="0.1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 text-center"
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
                className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full text-2xl font-bold transition duration-200 transform hover:scale-105 shadow-md flex items-center justify-center"
                title="Add Year"
              >
                +
              </button>

              {visibleYears > 1 && (
                <button
                  onClick={removeYear}
                  className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full text-2xl font-bold transition duration-200 transform hover:scale-105 shadow-md flex items-center justify-center"
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
                className={`px-8 py-3 rounded-lg font-semibold text-white transition duration-200 transform hover:scale-105 shadow-md ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Submit Data"
                )}
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-blue-500 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-1">
                    Tips for entering data:
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>
                      • Enter inflation rates as percentages (e.g., 2.5 for
                      2.5%)
                    </li>
                    <li>• Leave fields empty for months with no data</li>
                    <li>• Use the + button to add additional years</li>
                    <li>• Use the − button to remove the last year</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InflationCreate;
