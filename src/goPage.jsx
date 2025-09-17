import React, { useEffect, useState } from "react";
import bci from "./images/bc.png";
import bob from "./images/bob.png";
import Header from "./component/header";

import { Toaster, toast } from "sonner";

import { API_BASE_URL } from "./config/apiConfig";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import home from "./images/HOME.png";
import circle from "./images/circle.png";
import feedback from "./images/feedback.svg";

function GoPage() {
  const { phase } = useParams();
  const [loading, setLoading] = useState(false);
  const [gates, setGates] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [totalCountQ, setTotalCountQ] = useState(null);
  const [percentage, setPercentage] = useState("");
  const navigate = useNavigate();
  const projectId = localStorage.getItem("nProject");
  const access_token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;
  const questionType = "BusinessCaseBuilder";

  const [projectGoGates, setProjectGoGates] = useState([]);

  const fetchProjectGoGates = async () => {
    try {
      const response = await fetch(
        API_BASE_URL + `/api/project/go/${projectId}/${phase}`
      );
      if (!response.ok) {
        console.log(response);
      }
      const data = await response.json();
      setProjectGoGates(data.data);
    } catch (error) {
      console.error("Error fetching projectGoGates:", error);
    }
  };

  useEffect(() => {
    fetchProjectGoGates();
  }, [projectId, phase]);

  const handleAcceptClick = (id, goStatus) => {
    updateStatus(id, goStatus);
  };

  const updateStatus = async (id, goStatus) => {
    setLoading(true);
    try {
      const requestBody = { newStatus: goStatus, gateId: id };
      const response = await fetch(API_BASE_URL + "/api/project/go/status/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.status === 200) {
        const responseData = await response.json();
        fetchProjectGoGates();
        setLoading(false);
      } else {
        const result = await response.json();
        setLoading(false);
        toast.error(result["error"]);
        console.error("Error:", result["error"]);
      }
    } catch (error) {
      setLoading(false);
      console.error("An error occurred:", error);
    }
  };

  const calculatePercentage = () => {
    if (!totalCount || !totalCountQ) return;
    const calculatedPercentage = (totalCount / totalCountQ) * 100;
    setPercentage(calculatedPercentage.toFixed(2) + "%");
  };

  return (
    <div style={{ fontFamily: '"Manrope", sans-serif' }}>
      <div className="w-full relative">
        <Header />
        <div
          className="absolute inset-0 mt-[80px] ml-[20px] sm:ml-[60px] z-[-100] bg-no-repeat bg-cover w-[150px] sm:w-[200px] h-[150px] sm:h-[200px]"
          style={{ backgroundImage: `url(${circle})` }}
        ></div>

        <div className="main-content2">
          <div className="flex mt-[40px] mb-[30px] justify-between items-center w-[100%]">
            <button
              onClick={() => navigate(-1)}
              className="bg-[#193FAE] px-[30px] py-[5px] text-white rounded-3xl"
            >
              Back
            </button>
            <img src={home} alt="Home Icon" />
          </div>

          <div className="bacWHI">
            <div className="text-center">
              <p className="centerH pa">Go/ No-Go Gate</p>
            </div>

            <div className="wrapper">
              <div className="columns">
                {projectGoGates.map((projectGoGate) => (
                  <div
                    key={projectGoGate._id}
                    className={`columnG gogo ${
                      projectGoGate.goStatus === "not started" ||
                      projectGoGate.goStatus === "denied"
                        ? "gogoN"
                        : projectGoGate.goStatus === "Approved"
                        ? "gogoA"
                        : projectGoGate.goStatus === "Denied"
                        ? "gogoD"
                        : projectGoGate.goStatus === "ongoing"
                        ? "gogoO"
                        : ""
                    }`}
                  >
                    <p className="goP">{projectGoGate.goGateName}</p>
                    <p className="goP2">{projectGoGate.goStatus}</p>

                    {projectGoGate.goStatus === "not started" && (
                      <div className="goH">
                        <p className="goTitle"> Select Action</p>
                        <p className="goSub text-[16px] ">
                          Let's begin this phase
                        </p>
                        <span
                          className="goBtnP"
                          onClick={() =>
                            handleAcceptClick(projectGoGate._id, "Ongoing")
                          }
                        >
                          Begin
                        </span>
                      </div>
                    )}

                    {projectGoGate.goStatus === "Ongoing" && (
                      <div className="goH">
                        <p className="goTitle"> Select Action</p>
                        <p className="goSub text-[16px] ">
                          Accept or deny that this phase meets the required
                          standard
                        </p>
                        <span
                          className="goBtnP"
                          onClick={() =>
                            handleAcceptClick(projectGoGate._id, "Approved")
                          }
                        >
                          Accept
                        </span>
                        <span
                          className="goBtnPD"
                          onClick={() =>
                            handleAcceptClick(projectGoGate._id, "Denied")
                          }
                        >
                          Deny
                        </span>
                      </div>
                    )}

                    {projectGoGate.goStatus === "Denied" && (
                      <div className="goH">
                        <p className="font-bold text-[15px]"> Select Action</p>
                        <p className="goSub text-[16px] ">
                          Approve this phase if it now meets standards
                        </p>
                        <span
                          className="goBtnP"
                          onClick={() =>
                            handleAcceptClick(projectGoGate._id, "Approved")
                          }
                        >
                          Accept
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-[20px]">
            <button className="bg-[#E8C400] p-[10px] pr-[10px] w-[20rem] rounded-full">
              End Phase
            </button>
          </div>
        </div>
      </div>

      <div
        className="fixed bottom-0 right-0 z-[-100] m-0 p-0 w-[150px] h-[150px] bg-no-repeat"
        style={{
          backgroundImage: `url(${feedback})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center"
        }}
      ></div>
    </div>
  );
}

export default GoPage;
