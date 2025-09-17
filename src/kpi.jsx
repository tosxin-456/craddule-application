import React, { useState, useRef, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "./config/apiConfig";
import { useNavigate } from "react-router-dom";
import Header from "./component/header";

import home from "./images/HOME.png";
import circle from "./images/circle.png";
import bg from "./images/pattern_landscape.png";
import feedback from "./images/feedback.svg";

const KPI = () => {
  const navigate = useNavigate();
  const prototypeType = localStorage.getItem("selectedPrototype");
  const projectId = localStorage.getItem("nProject");
  const access_token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;

  const [kpi, setKpi] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpi = async () => {
      try {
        const kpiResponse = await fetch(
          `${API_BASE_URL}/api/kpi/project/${projectId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`
            }
          }
        );

        if (kpiResponse.ok) {
          const data = await kpiResponse.json();
          setKpi(data.data);
        } else {
          const data = await kpiResponse.json();
          console.log(data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKpi();
  }, [projectId, access_token]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const suffix = (d) =>
      d > 3 && d < 21 ? "th" : ["th", "st", "nd", "rd"][d % 10] || "th";
    return `${day}${suffix(day)} ${month} ${year}`;
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleViewClick = (id) => {
    navigate(`/kpiView/${id}`);
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/kpi/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete KPI");
      setKpi(kpi.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="font-sans relative">
      <Header />

      {/* Background circle */}
      <div
        className="absolute top-12 left-16 w-48 h-48 bg-no-repeat bg-cover z-[-10]"
        style={{ backgroundImage: `url(${circle})` }}
      />

      {/* Main background pattern */}
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        {/* Top Navigation */}
        <div className="flex justify-between items-center px-6 py-4">
          <button
            className="bg-blue600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
            onClick={() => navigate("/start")}
          >
            Back
          </button>
          <div className="text-center">
            <h2 className="text-xl font-bold">KPI</h2>
            <p className="text-gray-600">
              Here create custom graphs that give you more insight
            </p>
          </div>
          <img src={home} alt="home" className="" />
        </div>

        {/* KPI Table Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mx-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">KPI</h3>
            <button
              className="bg-blue600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              onClick={() => navigate("/createKpi")}
            >
              Create KPI
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {kpi.length > 0 ? (
                  kpi.map((item, index) => (
                    <tr key={item._id} className="border-b text-white hover:bg-gray-50">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{item.kpiGraphName}</td>
                      <td className="px-4 py-2">{item.kpiGraphType}</td>
                      <td className="px-4 py-2">{formatDate(item.timeSent)}</td>
                      <td className="px-4 py-2">{formatTime(item.timeSent)}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                          onClick={() => handleViewClick(item._id)}
                        >
                          View
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                          onClick={() => handleDeleteClick(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No KPI data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Feedback SVG fixed to bottom-right */}
      <div
        className="fixed bottom-0 right-0 w-64 h-64 bg-no-repeat bg-cover z-[-10]"
        style={{ backgroundImage: `url(${feedback})` }}
      ></div>
    </div>
  );
};

export default KPI;
