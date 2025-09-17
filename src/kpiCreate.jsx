import React, { useState, useEffect } from "react";
import bci from "./images/bc.png";
import Header from "./component/header";
import Menu from "./component/menu";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "./config/apiConfig";
import { jwtDecode } from "jwt-decode";
import { Toaster, toast } from "sonner";
import home from "./images/Create.svg";
import plus from "./images/plus.svg";
import feedback from "./images/feedback.svg";
import circle from "./images/circle.png";
import bg from "./images/pattern_big.png";

function CreateKpi() {
  const navigate = useNavigate();

  const onClickHandler = () => navigate(`/inflationRateGraph`);
  const onClickHandler1 = () => navigate(`/financialPintegrate`);
  const [selectedType, setSelectedType] = useState("");

  const [visibleYears, setVisibleYears] = useState(1);
  const [monthInputs, setMonthInputs] = useState({});
  const [graphName, setGraphName] = useState("");

  const token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  const [inputPairs, setInputPairs] = useState([{ x: "", y: "" }]);

  const handleInputChange = (index, field, value) => {
    const newPairs = [...inputPairs];
    newPairs[index][field] = value;
    setInputPairs(newPairs);
  };

  const addNewPair = () => {
    setInputPairs([...inputPairs, { x: "", y: "" }]);
  };

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
      data.kpiGraphType = selectedType;
      data.kpiGraphName = graphName;
      console.log(data);

      const response = await axios.post(API_BASE_URL + "/api/kpi", data);
      console.log("Graph saved successfully:", response.data);
      navigate("/kpi");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
        console.log(error.response.data);
        console.log(error.response.data);
      }
      console.error("Error sending data to API:", error);
    }
  };

  const handleInputChange2 = (year, month, value) => {
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

  const handleSubmit = async () => {
    // const formattedData = {
    //     Axix: inputPairs
    //       .filter(pair => pair.x.trim() !== '') // Filter out pairs with empty x values
    //       .map((pair, index) => ({
    //         [`x${index + 1}`]: pair.x,
    //         [`Y${index + 1}`]: pair.y,
    //       })),
    //   };

    const formattedData = {
      Axix: inputPairs
        .filter((pair) => pair.x.trim() !== "") // Filter out pairs with empty x values
        .map((pair) => ({
          x: pair.x,
          y: pair.y
        }))
    };

    console.log(formattedData);
    sendDataToAPI(formattedData);

    // try {
    //   const response = await fetch('https://your-api-endpoint.com/submit', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formattedData),
    //   });

    //   if (!response.ok) {
    //     throw new Error('Network response was not ok');
    //   }

    //   const result = await response.json();
    //   console.log('Success:', result);
    //   // Handle success (e.g., show a success message or redirect)
    // } catch (error) {
    //   console.error('Error:', error);
    //   // Handle error (e.g., show an error message)
    // }
  };

  const handleSubmit2 = () => {
    // Prepare the data to be sent to the API
    const dataToSend = {
      years: [...Array(visibleYears)].map((_, index) => {
        const key = `year${index + 1}`;
        return {
          year: index + 1,
          months: Object.entries(monthInputs[key] || {}).map(
            ([month, value]) => ({
              month,
              value: parseFloat(value) || 0
            })
          )
        };
      })
    };

    sendDataToAPI(dataToSend);
  };
  return (
    <div
      style={{
        fontFamily: '"Manrope", sans- serif'
      }}
    >
      <Header />
      <div className="container">
        <div className="main-content2">
          <div className=" flex justify-evenly">
            <div className="mr-auto ">
              <button className="mainBtn" onClick={() => navigate("/kpi")}>
                Back
              </button>
            </div>
            <div
              className="absolute inset-0 mt-[150px] ml-[60px]  z-[-100] bg-no-repeat bg-cover w-[200px] h-[200px] "
              style={{ backgroundImage: `url(${circle})` }}
            ></div>
            <div className=" m-auto">
              <p className="text-center font-bolder text-[17px] "> KPI</p>
              <p className="text-center text-[#545454] font-semibold ">
                Here Create custom graphs that gives you more insight
              </p>
            </div>

            <div>
              <img src={home} />
            </div>
          </div>
          <div>
            <div className="bacWHITe">
              <p className="text-center text-black font-bolder ">Create KPI</p>
              <p className="gname">Kpi Name</p>
              <input
                placeholder="Input KPI name"
                className="monthOn1 mmj"
                value={graphName} // Bind the value oTef the input field to the state variable
                onChange={handleInputChangeName} // Call the handleInputChange function when the input value changes
              />
              <p className="mt-[10px] text-[#BOBOBO] mb-[7px]  ">Kpi Name</p>
              <select
                className="border-solid border-[#B0B0B0] p-[10px] rounded-lg border-[1px] w-[50%]   "
                style={{ marginBottom: 20 }}
                id="dropdown"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">Select Kpi Type</option>
                <option value="Histogram">Histogram</option>
                <option value="Area">Spline Area</option>
                <option value="Donut">Donut</option>
                <option value="Pie">Pie</option>
                <option value="Radar">Radar</option>
                <option value="Polar">Polar</option>
                <option value="Treemap">Treemap</option>
              </select>
              {inputPairs.map((pair, index) => (
                <div
                  className="columnChart"
                  key={index}
                  style={{ marginBottom: "20px" }}
                >
                  <div className="flex justify-between">
                    {/* First input (Input Name) */}
                    <div style={{ flex: "1", marginRight: "10px" }}>
                      <p className="mt-[10px] text-[#B0B0B0] mb-[7px]">
                        Input Name
                      </p>
                      <input
                        className="monthOn1"
                        onChange={(e) =>
                          handleInputChange(index, "x", e.target.value)
                        }
                        type="text"
                        placeholder="Enter Input Name"
                        value={pair.x}
                        style={{ width: "100%" }} // Use 100% for full width within its container
                      />
                    </div>

                    {/* Second input (Input Value) */}
                    <div style={{ flex: "1", marginLeft: "10px" }}>
                      <p className="mt-[10px] text-[#B0B0B0] mb-[7px]">
                        Input Value
                      </p>
                      <input
                        className="monthOn1"
                        onChange={(e) =>
                          handleInputChange(index, "y", e.target.value)
                        }
                        type="number"
                        placeholder="Enter Input Value"
                        value={pair.y}
                        style={{ width: "100%" }} // Use 100% for full width within its container
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add new input pair */}
              <img
                onClick={addNewPair}
                className="w-[20px] mt-[-10px] "
                src={plus}
              />

              {visibleYears > 1 && (
                <span className="addy mmr" onClick={removeYear}>
                  -
                </span>
              )}
              {/* Add Year button */}
              <div className="w-fit m-auto">
                <button onClick={handleSubmit} className="subm  ">
                  Submit Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
      <div
        className="fixed bottom-0 right-0 z-[-100] m-0 p-0 w-[150px] h-[150px] bg-no-repeat"
        style={{
          backgroundImage: `url(${feedback})`,
          backgroundSize: "100% 100%", // Stretches image to fit exactly
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          margin: "0",
          padding: "0"
        }}
      ></div>
    </div>
  );
}

export default CreateKpi;
