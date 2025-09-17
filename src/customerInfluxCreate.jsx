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

function CustomerInflux() {
  const navigate = useNavigate();
  const [visibleYears, setVisibleYears] = useState(1);
  const [monthInputs, setMonthInputs] = useState({});
  const [graphName, setGraphName] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  const handleInputChangeName = (event) => {
    setGraphName(event.target.value);
  };

  useEffect(() => {
    const generateMonthsForYear = (year) => {
      const months = {};
      for (let i = 0; i < 12; i++) {
        months[`month${i + 1}`] = "";
      }
      return months;
    };

    setMonthInputs((prev) => ({
      ...prev,
      [`year${visibleYears}`]: generateMonthsForYear(visibleYears)
    }));
  }, [visibleYears]);

  const addYear = () => setVisibleYears(visibleYears + 1);
  const removeYear = () => {
    if (visibleYears > 1) setVisibleYears(visibleYears - 1);
  };

  const sendDataToAPI = async (data) => {
    try {
      data.userId = userId;
      data.projectId = localStorage.getItem("nProject");
      data.graphType = "CustomerInflux";
      data.graphName = graphName;

      const response = await axios.post(API_BASE_URL + "/api/graph", data);
      console.log("Graph saved successfully:", response.data);
      setLoading(false);
      navigate("/customerInflux");
    } catch (error) {
      setLoading(false);
      if (error.response) {
        toast.error(error.response.data.error);
        console.error(error.response.data);
      }
    }
  };

  const handleInputChange = (year, month, value) => {
    const updatedMonthValue = value.trim() === "" ? "0" : value;
    setMonthInputs((prevInputs) => ({
      ...prevInputs,
      [year]: {
        ...prevInputs[year],
        [month]: updatedMonthValue
      }
    }));
  };

  const handleSubmit = () => {
const dataToSend = {
  years: [...Array(visibleYears)].map((_, index) => ({
    year: index + 1,
    months: Object.entries(monthInputs[`year${index + 1}`] || {}).map(
      ([month, value]) => ({
        month,
        value: value === "" ? "0" : value
      })
    )
  }))
};

    setLoading(true);
    sendDataToAPI(dataToSend);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-4 md:px-10">
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

        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">
            Customer Influx
          </h2>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Graph Name
          </label>
          <input
            value={graphName}
            onChange={handleInputChangeName}
            className="w-full p-2 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter graph name"
          />

          {[...Array(visibleYears)].map((_, index) => (
            <div key={index + 1} className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">
                Year {index + 1}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[
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
                ].map((month) => (
                  <div key={month} className="flex flex-col items-start">
                    <input
                      type="number"
                      onChange={(e) =>
                        handleInputChange(index + 1, month, e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                    <span className="text-xs text-gray-600 mt-1">{month}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={addYear}
              className="text-blue-600 font-bold text-lg"
            >
              + Add Year
            </button>
            {visibleYears > 1 && (
              <button
                onClick={removeYear}
                className="text-red-600 font-bold text-lg"
              >
                – Remove Year
              </button>
            )}
          </div>

          {loading ? (
            <button
              disabled
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md flex justify-center items-center gap-2"
            >
              <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
              Submitting...
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
            >
              Submit Data
            </button>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default CustomerInflux;
