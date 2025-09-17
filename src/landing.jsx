// LandingPage.js
import React, { useEffect, useState } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import logo from "./images/logoc.png";
import { useNavigate } from "react-router-dom";
import ModalStart from "./component/modalStartStop";
import Loading from "./loading.jsx"; // Import the Loading component
import {
  useValidateToken,
  useFetchUserProjects,
  useFetchTeamProjects,
  useFetchReviewProjects,
  formatDate
} from "./utils/landingPageUtils.js"; // Import utilities
import {
  CheckOnboarding,
  FetchUserNda,
  getUserIdFromToken,
  handleLogoutLanding
} from "./utils/startUtils.js";
import { API_BASE_URL } from "./config/apiConfig.js";

function LandingPage() {
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [reviewProjects, setReviewProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [backgroundLoaded, setBackgroundLoaded] = useState(false); // Add background loading state
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const userInside = localStorage.getItem("access_token");
    if (!userInside) {
      navigate("/login");
    }
  }, [navigate]);

  const [userDetails, setUserDetails] = useState(() => {
    // Load from localStorage if available
    const storedUser = localStorage.getItem("userDetails");
    return storedUser ? JSON.parse(storedUser) : {};
  });
  const [userLoading, setUserLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { userId } = getUserIdFromToken();

  // Preload background image
  useEffect(() => {
    const preloadBackgroundImage = () => {
      // Get the background image URL from CSS
      const tempDiv = document.createElement("div");
      tempDiv.className = "landP";
      document.body.appendChild(tempDiv);

      const computedStyle = window.getComputedStyle(tempDiv);
      const backgroundImage = computedStyle.backgroundImage;

      // Remove the temporary div
      document.body.removeChild(tempDiv);

      if (backgroundImage && backgroundImage !== "none") {
        // Extract URL from background-image CSS property
        const imageUrl = backgroundImage.slice(4, -1).replace(/"/g, "");

        const img = new Image();
        img.onload = () => {
          setBackgroundLoaded(true);
        };
        img.onerror = () => {
          // If image fails to load, still show the page
          setBackgroundLoaded(true);
        };
        img.src = imageUrl;
      } else {
        // If no background image found, proceed anyway
        setBackgroundLoaded(true);
      }
    };

    preloadBackgroundImage();
  }, []);

  // Fetch data and update loading state
  useFetchUserProjects(userId, (data) => {
    setProjects(data);
    setIsLoading(false); // Set loading to false after fetching
  });
  useFetchTeamProjects(userId, setTeamMembers);
  useFetchReviewProjects(userId, setReviewProjects);

  // const projectId = localStorage.getItem("nProject");
  const category = "NONE";
  const access_token = localStorage.getItem("access_token");
  // console.log(projects)

  // const subCategoryPassed = "NONE";

  const handleProjectClick = async (
    projectId,
    name,
    count,
    date,
    recurring
  ) => {
    localStorage.setItem("nProject", projectId);
    localStorage.setItem("nProjectName", name);
    localStorage.setItem("nProjectCount", count);

    console.log("Project selected:", {
      projectId,
      name,
      count,
      date,
      recurring
    });

    let subscribed = false;

    if (recurring === false) {
      if (date) {
        console.log("Manual payment detected. Subscribed = true.");
        subscribed = true;
      } else {
        console.log("No manual payment date found. Subscribed = false.");
        subscribed = false;
      }
    } else if (recurring === true) {
      if (date) {
        const daysSincePayment =
          (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24);
        console.log(
          `Recurring payment. Days since last payment: ${daysSincePayment.toFixed(
            2
          )} days.`
        );

        if (daysSincePayment <= 30) {
          console.log(
            "Subscription still active (within 30 days). Subscribed = true."
          );
          subscribed = true;
        } else {
          console.log(
            "Subscription expired (over 30 days). Subscribed = false."
          );
          subscribed = false;
        }
      } else {
        console.log("Recurring is true but no date found. Subscribed = false.");
        subscribed = false;
      }
    } else {
      console.log("Unexpected case: recurring neither true nor false.");
    }

    console.log("Final subscribed value being saved:", subscribed);
    localStorage.setItem("subscribed", true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/test-new/questions/${category}/${projectId}`,
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
        if (!data || !data.data || data.data.length === 0) {
          await CheckOnboarding();
          navigate("/start");
          //  // Navigate to start if no questions
          return;
        }
      } else {
        throw new Error("Failed to fetch questions.");
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessage("Failed to fetch questions.");
    }

    await CheckOnboarding();
    navigate(`/welcome-form`);
  };

  const handleProjectTeamClick = (projectId, name, count) => {
    localStorage.setItem("nProject", projectId);
    localStorage.setItem("nProjectName", name);
    localStorage.setItem("nProjectCount", count);
    navigate(`/start`);
  };

  const handleProjectReviewClick = (reviewId, name, count) => {
    console.log(name);
    localStorage.setItem("nReview", reviewId);
    localStorage.setItem("nProjectName", name);
    localStorage.setItem("nProjectCount", count);
    navigate(`/sharereview/${reviewId}`);
  };
  //  console.log(reviewProjects.projectId)

  // Show loading screen if data is still being fetched OR background image hasn't loaded
  if (isLoading || !backgroundLoaded) {
    return <Loading label="Loading your projects..." />;
  }

  return (
    <div>
      <div className="fixed w-full h-full top-0 left-0 z-[-999] landP"></div>
      <div className="absolute top-10 left-10 flex items-center justify-between gap-4">
        <img src={logo} alt="Logo" className="w-[86.49px] h-[90px]" />
        <button
          onClick={handleLogoutLanding}
          className="px-3 py-2 bg-yellow-500 text-white rounded-[5px] hover:bg-yellow-600 transition"
        >
          Logout
        </button>
      </div>
      <div className="container">
        <div className="proSeg2">
          <div className="text-center">
            <p className="text-[18px] lg:text-[80px]  font-bold text-white">{`${
              projects.length == 0 ? `BEGIN YOUR LAUNCH` : "CONTINUE YOUR"
            }`}</p>
          </div>

          <div className="flex flex-col lg:flex-row lg:flex-wrap lg:justify-center gap-6 items-center">
            <div
              className={`${
                projects.length == 0 ? "lg:col-span-12" : "lg:col-span-4"
              } mb-5`}
            >
              <div
                className="w-[311px] h-[202px] text-white cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                <div className="bg-blue800 h-full flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30px"
                    height="30px"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#FFFFFF"
                      d="M10 0c.423 0 .766.343.766.766v8.467h8.468a.766.766 0 1 1 0 1.533h-8.468v8.468a.766.766 0 1 1-1.532 0l-.001-8.468H.766a.766.766 0 0 1 0-1.532l8.467-.001V.766A.77.77 0 0 1 10 0"
                    />
                  </svg>
                </div>
                <div className="bg-blue900 h-8 flex justify-center items-center">
                  <span className="text-center">Create Project</span>
                </div>
              </div>
            </div>
            {projects.map((project) => (
              <div className="lg:col-span-4 mb-5" key={project._id}>
                <div
                  className="block w-[311px] h-[202px] text-white cursor-pointer"
                  onClick={() =>
                    handleProjectClick(
                      project?._id,
                      project?.projectName,
                      project?.projectCount,
                      project?.lastSubscriptionDate,
                      project?.recurring
                    )
                  }
                >
                  <div className="bg-blue800 h-full flex justify-center items-center">
                    <span>Continue</span>
                  </div>
                  <div className="bg-blue900 h-8 flex justify-center items-center">
                    <span className="text-center">{project?.projectName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional sections for team members and review projects */}
      <div className="container">
        <div className="flex flex-col items-center lg:grid lg:grid-cols-12 lg:gap-0 gap-5">
          {teamMembers?.map((member) => (
            <div className="lg:col-span-4 mb-5" key={member?.projectId}>
              <div
                className="block w-[311px] h-[202px] text-white cursor-pointer"
                onClick={() =>
                  handleProjectTeamClick(
                    member?.projectId,
                    member?.projectDetails.project,
                    member?.projectDetails.projectCount
                  )
                }
              >
                <div className="bg-blue800 h-full flex justify-center items-center">
                  <span>Continue</span>
                </div>
                <div className="bg-blue900 h-8 flex justify-center items-center">
                  <span className="text-center">
                    {" "}
                    Team Project {member?.projectDetails.project}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {reviewProjects.map((review) => (
            <div className="lg:col-span-4 mb-5" key={review._id}>
              <div
                className="block w-[311px] h-[202px] text-white cursor-pointer"
                onClick={() =>
                  handleProjectReviewClick(
                    review._id,
                    review.projectId.projectName,
                    review.projectId.projectCount
                  )
                }
              >
                <div className="bg-blue800 h-full flex justify-center items-center">
                  <span>Continue</span>
                </div>
                <div className="bg-blue900 h-8 flex justify-center items-center">
                  <span className="text-center">
                    {" "}
                    Review Project {review?.projectId?.projectName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalStart open={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}

export default LandingPage;
