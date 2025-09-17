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
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
// import HeaderIdeation from './component/headerIdeation';
import { useParams } from "react-router-dom";
import home from "./images/HOME.png";

function InflationMonthOnMonth() {
  const navigate = useNavigate();
  const onClickHandler = () => navigate(`/inflationRateGraph`);
  const onClickHandler1 = () => navigate(`/financialPintegrate`);

  const [monthInputs, setMonthInputs] = useState({});
  const [yearsData, setYearsData] = useState([]);
  const [graphName, setGraphName] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  const { id } = useParams();

  const projectId = localStorage.getItem("nProject");
  const graphType = "Inflation";

  // Function to handle changes in the input field
  const handleInputChangeName = (event) => {
    setGraphName(event.target.value);
  };

  const handleInputChange = (year, month, value) => {
    const updatedValue = value.trim() === "" ? "0" : value;

    // Update monthInputs state
    setMonthInputs((prevInputs) => {
      const updatedYear = {
        ...prevInputs[`year${year}`],
        [month]: updatedValue
      };

      return {
        ...prevInputs,
        [`year${year}`]: updatedYear
      };
    });

    // Update yearsData state
    setYearsData((prevYearsData) => {
      const updatedYearsData = [...prevYearsData];
      const yearIndex = updatedYearsData.findIndex((y) => y.year === year);
      if (yearIndex !== -1) {
        updatedYearsData[yearIndex].months = updatedYearsData[
          yearIndex
        ].months.map((m) =>
          m.month === month ? { ...m, value: updatedValue } : m
        );
      }
      return updatedYearsData;
    });
  };

  // const handleInputChange = (year, month, value) => {
  //     const updatedValue = value.trim() === '' ? '0' : value;

  //     setMonthInputs(prevInputs => {
  //         const updatedYear = {
  //             ...prevInputs[`year${year}`],
  //             [month]: value
  //         };

  //         return {
  //             ...prevInputs,
  //             [`year${year}`]: updatedYear
  //         };
  //     });

  //     setYearsData(prevYearsData => {
  //         const updatedYearsData = [...prevYearsData];
  //         const yearIndex = updatedYearsData.findIndex(y => y.year === year);
  //         if (yearIndex !== -1) {
  //             updatedYearsData[yearIndex].months = updatedYearsData[yearIndex].months.map(m =>
  //                 m.month === month ? { ...m, value } : m
  //             );
  //         }
  //         return updatedYearsData;
  //     });
  // };

  const addYear = () => {
    const newYear = {
      year: yearsData.length + 1,
      months: [
        { month: "JAN", value: "" },
        { month: "FEB", value: "" },
        { month: "MAR", value: "" },
        { month: "APR", value: "" },
        { month: "MAY", value: "" },
        { month: "JUN", value: "" },
        { month: "JULY", value: "" },
        { month: "AUG", value: "" },
        { month: "SEP", value: "" },
        { month: "OCT", value: "" },
        { month: "NOV", value: "" },
        { month: "DEC", value: "" }
      ]
    };
    setYearsData([...yearsData, newYear]);
    setMonthInputs((prev) => ({
      ...prev,
      [`year${newYear.year}`]: newYear.months.reduce((acc, month) => {
        acc[month.month] = month.value;
        return acc;
      }, {})
    }));
  };

  const removeYear = () => {
    if (yearsData.length > 1) {
      setYearsData(yearsData.slice(0, -1));
      const newMonthInputs = { ...monthInputs };
      delete newMonthInputs[`year${yearsData.length}`];
      setMonthInputs(newMonthInputs);
    }
  };

  const sendDataToAPI = async (data) => {
    setLoading(true);
    try {
      data.id = id;
      data.userId = userId;
      data.projectId = localStorage.getItem("nProject");
      data.graphType = "Inflation";
      data.graphName = graphName;

      const response = await axios.post(
        API_BASE_URL + "/api/graph/update",
        data
      );
      setLoading(false);
      console.log("Graph saved successfully:", response.data);
      navigate("/inflation");
    } catch (error) {
      setLoading(false);
      if (error.response) {
        toast.error(error.response.data.error);
        console.error(error.response.data);
      }
      console.error("Error sending data to API:", error);
    }
  };

  const handleSubmit = () => {
    const dataToSend = {
      years: yearsData.map((yearData) => ({
        year: yearData.year,
        months: Object.entries(monthInputs[`year${yearData.year}`] || {}).map(
          ([month, value]) => ({
            month,
            value: parseFloat(value) || 0
          })
        )
      }))
    };

    sendDataToAPI(dataToSend);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_BASE_URL + `/api/graph/single/${id}`);
        if (response.status === 200) {
          const data = await response.json();
          setGraphName(data.graphName);

          const initialYearsData = data.years.map((year) => ({
            ...year,
            months: [
              { month: "JAN", value: "" },
              { month: "FEB", value: "" },
              { month: "MAR", value: "" },
              { month: "APR", value: "" },
              { month: "MAY", value: "" },
              { month: "JUN", value: "" },
              { month: "JULY", value: "" },
              { month: "AUG", value: "" },
              { month: "SEP", value: "" },
              { month: "OCT", value: "" },
              { month: "NOV", value: "" },
              { month: "DEC", value: "" }
            ].map((month) => {
              const existingMonth = year.months.find(
                (m) => m.month === month.month
              );
              return existingMonth || month;
            })
          }));

          setYearsData(initialYearsData);

          const initialMonthInputs = {};
          initialYearsData.forEach((year) => {
            initialMonthInputs[`year${year.year}`] = year.months.reduce(
              (acc, month) => {
                acc[month.month] = month.value;
                return acc;
              },
              {}
            );
          });

          setMonthInputs(initialMonthInputs);
        } else {
          throw new Error("Failed to fetch graph data");
        }
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    fetchData();
  }, [id]);

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
              <p className="text-gray-600">Edit your inflation data</p>
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
              {yearsData.map((yearData, yearIndex) => (
                <div key={yearIndex + 1} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Year {yearIndex + 1}
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {yearData.months.map((monthData) => (
                      <div key={monthData.month} className="flex flex-col">
                        <input
                          type="number"
                          step="0.1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 text-center"
                          onChange={(e) =>
                            handleInputChange(
                              yearData.year,
                              monthData.month,
                              e.target.value
                            )
                          }
                          value={
                            monthInputs[`year${yearData.year}`]?.[
                              monthData.month
                            ] || ""
                          }
                          placeholder="0.0"
                        />
                        <label className="text-xs font-medium text-gray-600 text-center mt-2">
                          {monthData.month}
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

              {yearsData.length > 1 && (
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
                    <span>Updating...</span>
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

export default InflationMonthOnMonth;
