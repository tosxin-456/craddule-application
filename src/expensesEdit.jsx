import React, { useState, useEffect } from "react";
import Header from "./component/header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "./config/apiConfig";
import { jwtDecode } from "jwt-decode";
import { Toaster, toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import home from "./images/HOME.png";

function ExpensesMonthOnMonth() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [monthInputs, setMonthInputs] = useState({});
  const [yearsData, setYearsData] = useState([]);
  const [graphName, setGraphName] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  const handleInputChangeName = (event) => {
    setGraphName(event.target.value);
  };

  const handleInputChange = (year, month, value) => {
    const updatedValue = value.trim() === "" ? "0" : value;

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
      data.graphType = "Expenses";
      data.graphName = graphName;

      const response = await axios.post(
        API_BASE_URL + "/api/graph/update",
        data
      );
      setLoading(false);
      navigate("/expenses");
    } catch (error) {
      setLoading(false);
      if (error.response) {
        toast.error(error.response.data.error);
      }
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Expenses</h1>
            <p className="text-gray-600">Edit your monthly expenses data</p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Graph Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={graphName}
              onChange={handleInputChangeName}
              placeholder="Enter graph name..."
            />
          </div>

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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-center"
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

          <div className="flex justify-center items-center space-x-4 my-8">
            <button
              onClick={addYear}
              className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full text-2xl font-bold"
              title="Add Year"
            >
              +
            </button>
            {yearsData.length > 1 && (
              <button
                onClick={removeYear}
                className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full text-2xl font-bold"
                title="Remove Year"
              >
                −
              </button>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-semibold text-white shadow-md transition duration-200 transform hover:scale-105 ${
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
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default ExpensesMonthOnMonth;
