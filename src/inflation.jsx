import React, { useEffect, useState } from "react";
import bci from "./images/bc.png";
import bro from "./images/bro.png";
import Header from "./component/header";
import { API_BASE_URL } from "./config/apiConfig";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import home from "./images/HOME.png";

function InflationRate() {
  const navigate = useNavigate();
  const access_token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;

  const projectId = localStorage.getItem("nProject");
  console.log(userId);

  const [graphData, setGraphData] = useState([]);
  const [selectedGraphData, setSelectedGraphData] = useState(null);
  const [selectedGraphId, setSelectedGraphId] = useState("");
  const graphType = "Inflation";

  const handleViewClick = (id) => {
    navigate(`/inflationGraphView/${id}`);
  };

  const handleEditClick = (id) => {
    navigate(`/inflationEdit/${id}`);
  };

  const handleDeleteClick = (id) => {
    deleteGraph(id);
  };

  const deleteGraph = async (id) => {
    try {
      const response = await fetch(API_BASE_URL + `/api/graph/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Failed to delete graph");
      }

      console.log("deleted");
      setGraphData(graphData.filter((entry) => entry._id !== id));
    } catch (error) {
      console.error("Error deleting all graphs:", error);
    }
  };

  useEffect(() => {
    const projectId = localStorage.getItem("nProject");

    const fetchData = async () => {
      try {
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

        if (data.length > 0) {
          setSelectedGraphData(data[0]);
          setSelectedGraphId(data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    fetchData();
  }, [projectId, graphType]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const dayWithSuffix = day + getDaySuffix(day);

    return `${dayWithSuffix} ${month} ${year}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
    return `${time}`;
  };

  const onClickHandler = () => navigate(`/inflationCreate`);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full">
        <Header />
        <div className="px-10 py-8">
          {/* Header Section */}
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
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Inflation</h1>
            <p className="text-lg text-gray-600">
              You will need a Professional
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Inflation</h2>
              <button
                className="bg-blue600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
                onClick={onClickHandler}
              >
                Create
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      #
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      BY
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Time
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {graphData.map((entry, index) => (
                    <tr
                      key={entry._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition duration-150"
                    >
                      <td className="py-3 px-4 text-white">{index + 1}</td>
                      <td className="py-3 px-4 text-white font-medium">
                        {entry.graphName}
                      </td>
                      <td className="py-3 px-4 text-white">
                        {entry.userId.firstName}
                      </td>
                      <td className="py-3 px-4 text-white">
                        {formatDate(entry.timeSent)}
                      </td>
                      <td className="py-3 px-4 text-white">
                        {formatTime(entry.timeSent)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-1 px-3 rounded transition duration-200"
                            onClick={() => handleViewClick(entry._id)}
                          >
                            View
                          </button>
                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium py-1 px-3 rounded transition duration-200"
                            onClick={() => handleEditClick(entry._id)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded transition duration-200"
                            onClick={() => handleDeleteClick(entry._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {graphData.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">
                  No inflation data available
                </div>
                <div className="text-gray-400 text-sm">
                  Create your first inflation graph to get started
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InflationRate;
