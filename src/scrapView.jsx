import React, { useState, useEffect } from "react";
import bci from "./images/bc.png";
import Header from "./component/header";
import Menu from "./component/menu";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./config/apiConfig";
import { Toaster, toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import home from "./images/HOME.png";
import circle from "./images/circle.png";
import feedback from "./images/feedback.svg";

function ScrapView() {
  const navigate = useNavigate();
  const projectId = localStorage.getItem("nProject");
  const access_token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;

  const [scraps, setScraps] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScrap = async () => {
      try {
        const scrapResponse = await fetch(
          `${API_BASE_URL}/api/scrap/project/${projectId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`
            }
          }
        );

        if (scrapResponse.status === 200) {
          const dataS = await scrapResponse.json();
          setScraps(dataS.data);
        } else {
          const data = await scrapResponse.json();
          setError(data.message || "Failed to fetch");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchScrap();
  }, [projectId]);

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
    return `${day}${getDaySuffix(day)} ${month} ${year}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleCreate = () => navigate(`/createScrapName`);
  const handleView = (id) => navigate(`/createScrap/${id}`);
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/scrap/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete scrap");
      setScraps(scraps.filter((scrap) => scrap._id !== id));
      toast.success("Scrap deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <Header />
      <div className="container font-[Manrope,sans-serif]">
        <div
          className="absolute inset-0 mt-[180px] ml-[60px] z-[-100] bg-no-repeat bg-cover w-[200px] h-[200px]"
          style={{ backgroundImage: `url(${circle})` }}
        ></div>

        <div className="flex justify-evenly mt-[50px]">
          <div className="mr-auto">
            <button className="mainBtn" onClick={() => navigate("/start")}>
              Back
            </button>
          </div>
          <div className="m-auto text-center">
            <p className="font-bold text-[17px]">ScrapBook</p>
            <p className="text-[#545454] font-semibold">
              Create notes you can look back on later
            </p>
          </div>
          <div>
            <img src={home} alt="home" />
          </div>
        </div>

        <div className="upload-container mt-8">
          <div className="main-content2">
            <div className="bacWHI p-4 rounded-lg shadow-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold text-lg">ScrapBook</p>
                <button className="mainBtn" onClick={handleCreate}>
                  Create
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-gray-100">
                    <tr className="text-left">
                      <th>#</th>
                      <th>Name</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-white bg-[#1c1c1c]">
                    {scraps.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-4 text-gray-300"
                        >
                          No scraps found.
                        </td>
                      </tr>
                    ) : (
                      scraps.map((scrap, index) => (
                        <tr
                          key={scrap._id}
                          className="border-b border-gray-700 hover:bg-[#2a2a2a] transition"
                        >
                          <td className="py-2 px-3">{index + 1}</td>
                          <td className="py-2 px-3">{scrap.scrapName}</td>
                          <td className="py-2 px-3">
                            {formatDate(scrap.timeSent)}
                          </td>
                          <td className="py-2 px-3">
                            {formatTime(scrap.timeSent)}
                          </td>
                          <td className="py-2 px-3 space-x-2">
                            <button
                              className="mainBtnView"
                              onClick={() => handleView(scrap._id)}
                            >
                              View
                            </button>
                            <button
                              className="mainBtnDelete"
                              onClick={() => handleDelete(scrap._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <Toaster position="top-right" />
        <div
          className="fixed bottom-0 right-0 z-[-100] w-[250px] h-[250px] bg-no-repeat"
          style={{
            backgroundImage: `url(${feedback})`,
            backgroundSize: "100% 100%",
            backgroundPosition: "center"
          }}
        ></div>
      </div>
    </>
  );
}

export default ScrapView;
