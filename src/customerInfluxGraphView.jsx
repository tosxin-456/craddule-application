import React, { Component, useState, useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import ReactDOM from "react-dom";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import Header from "./component/header";
import Menu from "./component/menu";
import { API_BASE_URL } from "./config/apiConfig";
// import SideMenu2 from './component/sideMenu2';
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import home from "./images/HOME.png";

function OperatingIncomeGraphView({ projectId, graphType }) {
  const [graphData, setGraphData] = useState([]);
  const [selectedGraphData, setSelectedGraphData] = useState(null);
  const [graphName, setGraphName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deviceType, setDeviceType] = useState("desktop");
  const { id } = useParams();
  const access_token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;
  const navigate = useNavigate();


  // Function to update deviceType state based on window width
  const updateDeviceType = () => {
    if (window.innerWidth < 768) {
      setDeviceType("mobile");
    } else if (window.innerWidth < 1024) {
      setDeviceType("tablet");
    } else {
      setDeviceType("desktop");
    }
  };
  // Effect to update isMobile state on window resize
  useEffect(() => {
    updateDeviceType();
    window.addEventListener("resize", updateDeviceType);
    return () => window.removeEventListener("resize", updateDeviceType);
  }, []);

  useEffect(() => {
    const projectId = localStorage.getItem("nProject");
    const graphType = "CustomerInflux";
    const fetchData = async () => {
      try {
        // Fetch graph data based on projectId and graphType
        const response = await fetch(
          API_BASE_URL +
            `/api/graph?projectId=${projectId}&graphType=${graphType}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch graph data");
        }

        const data = await response.json();
        console.log(data);
        console.log(data._id);
        setGraphData(data);

        // Set the first graph name's data as selectedGraphData initially
        if (data.length > 0) {
          const selectedData = data.find((item) => item._id === id);
          setSelectedGraphData(selectedData);
          setGraphName(selectedData.graphName);
          console.log(selectedData);
        }
      } catch (error) {
        console.error("Error fetching graph data:", error);
        // Handle error, e.g., show error message to user
      }
    };

    fetchData();
  }, [projectId, graphType]);

  const transformGraphData = (graphData) => {
    if (!graphData) return null;

    const series = graphData.years.map((yearData) => ({
      name: `Year ${yearData.year}`,
      data: yearData.months.map((monthData) => parseFloat(monthData.value))
    }));

    const categories = graphData.years[0].months.map((month) => month.month);

    return {
      series,
      options: {
        chart: {
          height: 350,
          type: "bar",
          events: {
            click: function (chart, w, e) {
              // console.log(chart, w, e)
            }
          }
        },
        colors: ["#008FFB"],
        plotOptions: {
          bar: {
            columnWidth: "45%",
            distributed: true
          }
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false
        },
        xaxis: {
          categories: graphData.years[0].months.map(
            (monthData) => monthData.month
          ),
          labels: {
            style: {
              colors: ["#008FFB"],
              fontSize: "12px"
            }
          }
        }
      }
    };
  };
  const notifyDivRef = useRef(null);
  const chartData = transformGraphData(selectedGraphData);

  const handleScreenshotAndUpload = async () => {
    setLoading(true);

    try {
      const element = notifyDivRef.current;
      if (element) {
        const projectId = localStorage.getItem("nProject");
        const canvas = await html2canvas(element);
        canvas.toBlob(async (blob) => {
          const formData = new FormData();
          formData.append(
            "image",
            new File([blob], graphName + ".png", { type: "image/png" })
          ); // Append the blob as an image file
          formData.append("type", "Inflation");
          formData.append("sequence", 0);
          formData.append("projectId", projectId);
          formData.append("userId", userId);
          formData.append("imageName", graphName + ".png"); // Name of the image

          try {
            const response = await axios.post(
              `${API_BASE_URL}/api/hub/graph`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${access_token}`
                }
              }
            );
            console.log(response);
            if (response.status === 200) {
              toast.success("Screenshot uploaded successfully");
            } else {
              const result = await response.json();
              setLoading(false);
              console.error("Error:", result["error"]);
              toast.error(result["error"]);
            }
          } finally {
            setLoading(false);
          }
        });
      }
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container2">
      {/* //<SideMenu2 />     */}
      <div className="w-full">
        <Header />
        <div className="flex justify-between m-auto w-[80%] items-center px-4 py-3">
          <button className="mainBtn" onClick={() => navigate(-1)}>
            Back
          </button>
          <img src={home} alt="Home" className="h-8 w-auto" />
        </div>

        <div className="headGr">
          <p>{graphName}</p>
          <div style={{ marginRight: "70px" }}>
            <button className="btn mainBtn" onClick={handleScreenshotAndUpload}>
              Save to Hub
            </button>
          </div>
        </div>

        <div className="modG">
          <div className="graph1">
            <div className="graphC">
              <div id="chart" ref={notifyDivRef}>
                {selectedGraphData && (
                  <ReactApexChart
                    options={chartData.options}
                    series={chartData.series}
                    type="bar"
                    height={
                      deviceType === "mobile"
                        ? 250
                        : deviceType === "tablet"
                        ? 300
                        : 350
                    }
                    width={deviceType !== "desktop" ? "100%" : 700}
                  />
                )}
              </div>
              <div id="html-dist"></div>
            </div>
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default OperatingIncomeGraphView;
