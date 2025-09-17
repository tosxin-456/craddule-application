import React, { useState, useEffect } from "react";
import Header from "./component/header";
import Menu from "./component/menu";
import { API_BASE_URL } from "./config/apiConfig";
import { useNavigate } from "react-router-dom";
import ImageModal from "./component/imageModal";
import { Toaster, toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import circle from "./images/circle.png";
import feedbackIcon from "./images/feedback.svg";
import home from "./images/HOME.png";

function PageFeedback() {
  const access_token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;
  const projectId = localStorage.getItem("nProject");

  const [feedbackList, setFeedbackList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/feedback/${projectId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFeedbackList(data.data);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch feedback:", errorData);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <>
      <Header />
      <Toaster />

      <div className="container mx-auto px-4 relative py-6">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/start")}
            className="bg-[#193FAE] hover:bg-[#16389c] text-white px-5 py-2 rounded-full text-sm sm:text-base"
          >
            Back
          </button>
          <img src={home} alt="Home Icon" className="" />
        </div>

        {/* Decorative Background Circle */}
        <div
          className="absolute top-12 left-4 sm:left-16 z-[-10] w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] bg-no-repeat bg-cover"
          style={{ backgroundImage: `url(${circle})` }}
        ></div>

        {/* Feedback Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold">Feedback</h2>
        </div>

        {/* Feedback Cards Container */}
        <div className="space-y-6 max-w-3xl mx-auto min-h-[200px]">
          {feedbackList.length > 0 ? (
            feedbackList.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-md p-5 rounded-xl border border-gray-200"
              >
                <p className="text-lg font-bold text-[#1f2937] mb-2">
                  {item.phase}
                </p>

                <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600 mb-3">
                  <span>From: {item.userId?.email || "Unknown"}</span>
                  <span>
                    {new Date(item.timeSent).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    })}{" "}
                    {new Date(item.timeSent).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true
                    })}
                  </span>
                </div>

                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                  {item.feedback}
                </p>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="bg-white shadow-md p-6 rounded-xl border border-gray-200 text-center max-w-xl w-full">
                {/* <img
                  src={feedbackIcon}
                  alt="Feedback icon"
                  className="w-12 h-12 mx-auto mb-4"
                /> */}
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No feedback yet
                </h3>
                <p className="text-gray-500 text-sm">
                  Once someone sends feedback on this project, it’ll appear
                  here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PageFeedback;
