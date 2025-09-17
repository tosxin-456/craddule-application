import React, { useState, useEffect } from "react";
import bci from "./images/bc.png";
import Header from "./component/header";
import Menu from "./component/menu";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "./config/apiConfig";
import { jwtDecode } from "jwt-decode";
import { Toaster, toast } from "sonner";

function OperatingIncomeMoM() {
  const navigate = useNavigate();

  const [visibleYears, setVisibleYears] = useState(1);
  const [monthInputs, setMonthInputs] = useState({});
  const [graphName, setGraphName] = useState("");

  const token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  // Function to handle changes in the input field
  const handleInputChangeName = (event) => {
    // Update the graphName state variable with the new value entered into the input field
    setGraphName(event.target.value);
  };

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
      data.graphType = "OperatingIncome";
      data.graphName = graphName;
      console.log(data);

      const response = await axios.post(API_BASE_URL + "/api/graph", data);
      console.log("Graph saved successfully:", response.data);
      navigate("/incomeGraph");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
        console.log(error.response.data);
        console.log(error.response.data);
      }
      console.error("Error sending data to API:", error);
    }
  };

  const handleInputChange = (year, month, value) => {
    setMonthInputs((prevInputs) => {
      const updatedYear = {
        ...prevInputs[year],
        [month]: value
      };

      // Check if any month in the year has a non-empty value
      const hasNonEmptyMonth = Object.values(updatedYear).some(
        (monthValue) => monthValue.trim() !== ""
      );

      // If no month has a non-empty value, remove the year from the state
      if (!hasNonEmptyMonth) {
        const updatedInputs = { ...prevInputs };
        delete updatedInputs[year];
        return updatedInputs;
      }

      // If the month value is empty, remove it from the year
      if (value.trim() === "") {
        const { [month]: _, ...updatedYearWithoutEmptyMonth } = updatedYear;
        return {
          ...prevInputs,
          [year]: updatedYearWithoutEmptyMonth
        };
      }

      return {
        ...prevInputs,
        [year]: updatedYear
      };
    });
  };

  const handleSubmit = () => {
    // Prepare the data to be sent to the API
    const dataToSend = {
      years: [...Array(visibleYears)].map((_, index) => ({
        year: index + 1,
        months: Object.entries(monthInputs[index + 1] || {}).map(
          ([month, value]) => ({
            month,
            value: parseFloat(value) || 0
          })
        )
      }))
    };

    sendDataToAPI(dataToSend);
  };

  return (
    <>
      <div className="container-fluid">
        <Header />
        <div className="row">
          <Menu />

          <div className="col-md-9">
            <div className="centerC">
              <p className="text-center">Operating Income</p>
              <p className="gname">Graph Name</p>
              <input
                className="monthOn1 mmj"
                value={graphName} // Bind the value of the input field to the state variable
                onChange={handleInputChangeName} // Call the handleInputChange function when the input value changes
              />
              {[...Array(visibleYears)].map((_, index) => (
                <div key={index + 1}>
                  <div className="year">Year {index + 1}</div>

                  {/* Month inputs for this year */}
                  <div className="wrapperChart">
                    <div className="columnsChart">
                      <div className="columnChart">
                        <input
                          className="monthOn1"
                          onChange={(e) =>
                            handleInputChange(index + 1, "JAN", e.target.value)
                          }
                          type="number"
                        ></input>
                        <p className="monthOn1T">JAN</p>
                      </div>
                      <div className="columnChart">
                        <input
                          className="monthOn1"
                          onChange={(e) =>
                            handleInputChange(index + 1, "FEB", e.target.value)
                          }
                          type="number"
                        ></input>
                        <p className="monthOn1T">FEB</p>
                      </div>
                      <div className="columnChart">
                        <input
                          className="monthOn1"
                          onChange={(e) =>
                            handleInputChange(index + 1, "MAR", e.target.value)
                          }
                          type="number"
                        ></input>
                        <p className="monthOn1T">MAR</p>
                      </div>
                      <div className="columnChart">
                        <input
                          className="monthOn1"
                          onChange={(e) =>
                            handleInputChange(index + 1, "APR", e.target.value)
                          }
                          type="number"
                        ></input>
                        <p className="monthOn1T">APR</p>
                      </div>

                      <div className="columnChart">
                        <input
                          className="monthOn1"
                          onChange={(e) =>
                            handleInputChange(index + 1, "MAY", e.target.value)
                          }
                          type="number"
                        ></input>
                        <p className="monthOn1T">MAY</p>
                      </div>

                      <div className="columnChart">
                        <input
                          className="monthOn1"
                          onChange={(e) =>
                            handleInputChange(index + 1, "JUN", e.target.value)
                          }
                          type="number"
                        ></input>
                        <p className="monthOn1T">JUN</p>
                      </div>

                      <div className="columnChart">
                        <input
                          className="monthOn1"
                          onChange={(e) =>
                            handleInputChange(index + 1, "JULY", e.target.value)
                          }
                          type="number"
                        ></input>
                        <p className="monthOn1T">JULY</p>
                      </div>

                      <div className="columnChart">
                        <input
                          className="monthOn1"
                          onChange={(e) =>
                            handleInputChange(index + 1, "AUG", e.target.value)
                          }
                          type="number"
                        ></input>
                        <p className="monthOn1T">AUG</p>
                      </div>

                      <div className="columnChart">
                        <input
                          className="monthOn1"
                          onChange={(e) =>
                            handleInputChange(index + 1, "SEP", e.target.value)
                          }
                          type="number"
                        ></input>
                        <p className="monthOn1T">SEP</p>
                      </div>

                      <div className="columnChart">
                        <input
                          className="monthOn1"
                          onChange={(e) =>
                            handleInputChange(index + 1, "OCT", e.target.value)
                          }
                          type="number"
                        ></input>
                        <p className="monthOn1T">OCT</p>
                      </div>

                      <div className="columnChart">
                        <input
                          className="monthOn1"
                          onChange={(e) =>
                            handleInputChange(index + 1, "NOV", e.target.value)
                          }
                          type="number"
                        ></input>
                        <p className="monthOn1T">NOV</p>
                      </div>

                      <div className="columnChart">
                        <input
                          className="monthOn1"
                          onChange={(e) =>
                            handleInputChange(index + 1, "DEC", e.target.value)
                          }
                          type="number"
                        ></input>
                        <p className="monthOn1T">DEC</p>
                      </div>
                      {/* Add more inputs for the remaining months */}
                    </div>
                  </div>

                  {/* Render plus sign for all but the last visible year */}
                </div>
              ))}
              <span className="addy" onClick={addYear}>
                +
              </span>
              {visibleYears > 1 && (
                <span className="addy mmr" onClick={removeYear}>
                  -
                </span>
              )}
              {/* Add Year button */}

              <button onClick={handleSubmit} className="subm">
                Submit Data
              </button>
            </div>
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
    </>
  );
}

export default OperatingIncomeMoM;
