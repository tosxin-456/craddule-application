import React, { useState, useEffect } from "react";
import Header from "./component/header";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./config/apiConfig";
import { Toaster, toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import BreadCrumb from "./component/breadCrumb";
import { FetchUser, FetchUserNda } from "./utils/startUtils";

function getFormattedDate() {
  const date = new Date();
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${day}${suffix} ${month} ${year}`;
}

function ScrapView() {
  const navigate = useNavigate();
  const [team, setTeam] = useState([]);
  const [linkD, setLink] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nda, setNda] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [ndaGenerated, setNdaGenerated] = useState(false); // Add this state

  const projectId = localStorage.getItem("nProject");
  const access_token = localStorage.getItem("access_token");
  const projectName = localStorage.getItem("nProjectName");

  // Decode token safely
  let userId = null;
  try {
    if (access_token) {
      const decodedToken = jwtDecode(access_token);
      userId = decodedToken.userId;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    navigate("/login");
    return null;
  }

  const [formData, setFormData] = useState({
    email: "",
    projectId: projectId,
    link: ""
  });

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  // Fetch user details
  useEffect(() => {
    if (access_token && userId) {
      const fetchUserData = async () => {
        try {
          setUserLoading(true);
          await FetchUserNda(userId, access_token, (data) => {
            setUserDetails(data);
            localStorage.setItem("userDetails", JSON.stringify(data));
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setUserLoading(false);
        }
      };

      fetchUserData();
    }
  }, [userId, access_token]);
  console.log(team);

  // Generate NDA template (only once when user details are loaded)
  useEffect(() => {
    if (
      !userDetails?.firstName ||
      !projectId ||
      !access_token ||
      ndaGenerated
    ) {
      return;
    }

    const generateNdaTemplate = () => {
      const ndaTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Confidentiality and Non-Disclosure Agreement</title>
 <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    .container {
      padding: 20px;
      max-width: 800px;
      margin: auto;
    }
    h1 {
      color: #2E86C1;
      font-size: 24px;
    }
    h2 {
      color: #2874A6;
      font-size: 20px;
      margin-top: 20px;
    }
    p {
      margin: 15px 0;
    }
    .signature {
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT</h1>
    <p>This Confidentiality and Non-disclosure agreement is made this <strong>${getFormattedDate()}</strong></p>

    <h2>PARTIES</h2>
    <p>The Parties to this Agreement are:</p>
    <p><strong>${
      userDetails.firstName
    } with project ${projectName}</strong> incorporated under applicable laws with its principal offices at <strong>${projectName}</strong>, or your ideas as contained in this Craddule Project Workspace. (The Disclosing Party).</p>
    <p>And</p>
    <p><strong>{{RECIPIENT_NAME}}</strong> with a Craddule account and access to the project. (The Receiving Party/Craddule Collaborator).</p>

    <h2>INTRODUCTION</h2>
    <p>It is hereby agreed as follows:</p>
    <p>The parties are desirous of engaging in discussions for certain purposes ("the Purpose").</p>
    <p>During the course of their business discussions and transactions, it is anticipated that one party ("the Disclosing Party") may disclose certain confidential and proprietary information related to or in connection with the Parties to the other party ("the Receiving Party"). This disclosure is for the purpose of enabling the Receiving Party to assess, evaluate, provide advice, or fulfill its obligations.</p>
    <p>The Parties recognize that the unauthorized disclosure or use of the Disclosing Party's confidential information by third parties could result in significant harm or prejudice to the Disclosing Party.</p>
    <p>In acknowledgment of the need for confidentiality, the Parties have mutually agreed to enter into this Confidentiality and Non-Disclosure Agreement ("the Agreement").</p>

    <h2>DEFINITIONS AND INTERPRETATION</h2>
    <p>In this Agreement, unless the context otherwise requires:</p>
    <ul>
      <li><strong>"Affiliate"</strong> means, with respect to any person that directly, or indirectly through one or more intermediaries, controls, is controlled by, or is under common control with such person; the term "control" (including the term "controlling", "controlled by" and "under common control with") means the possession, direct or indirect, of the power to direct or cause the direction of the management and policies of a person, whether through the ownership of voting securities, by contract, or otherwise.</li>
      <li><strong>"Disclosing Party"</strong> means a Party when it discloses its Confidential Information, directly or indirectly, to the Receiving Party.</li>
      <li><strong>"Confidential Information"</strong> includes, but is not limited to:
        <ul>
          <li>All information, in any form, disclosed or supplied to a Receiving Party by a Disclosing Party relating to (i) the Purpose, (ii) past, present, or future business partners, joint ventures, or affiliates, or (iii) the Disclosing Party's, or any of the Disclosing Party's Representatives' past, present, or future research, development, or business activities.</li>
          <li>All business data, Personal Data, technical, financial, operational, administrative, legal, economic, and other information in whatever form (including in written, oral, visual, or electronic form) relating directly or indirectly to the Purpose.</li>
          <li>All information in whatever form relating to the existence, status, or progress of the Purpose, including the existence and contents of this Agreement and the fact that discussions and negotiations may be taking place in relation to the Purpose.</li>
          <li>All documents and any other material that contains, reflects, or is generated from any of the foregoing, and all copies of any of the foregoing.</li>
        </ul>
      </li>
      <li><strong>"Personal Data"</strong> means any data which relates to an identified or identifiable person, be it sensitive or non-sensitive data.</li>
      <li><strong>"Representatives"</strong> means, in relation to a Party, its Affiliates and their respective directors, officers, employees, agents, consultants, and advisers.</li>
    </ul>

    <h2>UNDERTAKING</h2>
    <p>The Receiving Party undertakes:</p>
    <ul>
      <li>That all information obtained from the Disclosing Party shall be regarded and treated as confidential and the property of the Disclosing Party.</li>
      <li>To maintain in secrecy any and all Proprietary Information of the Disclosing Party and to act in good faith at all times in performing its obligations under this Agreement.</li>
      <li>Not to disclose the Proprietary Information to any third parties, except where necessary for the performance of obligations under this Agreement.</li>
      <li>To return all Proprietary Information upon termination or expiration of this Agreement.</li>
    </ul>

    <h2>INDEMNITY</h2>
    <p>The Receiving Party indemnifies and holds the Disclosing Party harmless against any loss, expense, claim, harm, damage, or liability of whatsoever nature suffered or sustained by the Disclosing Party resulting from any action, proceeding, or claim made by any person against the Disclosing Party as a result of the breach of this Agreement by the Receiving Party or any of its employees, agents, independent contractors, or consultants.</p>

    <h2>BREACH</h2>
    <p>Should the Receiving Party commit a breach of its obligations in terms of this Agreement, the Disclosing Party has the right to claim actual damages as it may suffer. In addition, the Disclosing Party may apply to Court for an injunction restraining the Receiving Party from using, disclosing, or exploiting the Proprietary Information of the Disclosing Party.</p>

    <h2>DOMICILIUM</h2>
    <p>The Parties respectively choose their respective addresses set forth above as their domicilium citandi et executandi for all purposes of giving any notice, the serving of any process, and for any purpose arising from this Agreement.</p>

    <h2>CONFIDENTIAL INFORMATION USAGE</h2>
    <p>The Receiving Party will hold the Confidential Information in strict confidence and will not disclose, reproduce, reprocess, or distribute any Confidential Information in whole or in part, directly or indirectly, to any persons, other than to its Representatives and with the prior consent of the Disclosing Party, to the extent that such disclosure, reproduction, or distribution is strictly necessary for the Purpose of this Agreement.</p>

    <h2>CONFIDENTIAL INFORMATION STORAGE</h2>
    <p>The Receiving Party shall store the received/obtained Confidential Information under this Agreement within the country or location of the Disclosing Party, or as mutually agreed by both Parties.</p>

    <h2>RETURN OR DESTRUCTION OF CONFIDENTIAL INFORMATION</h2>
    <p>Upon termination or expiration of this Agreement, the Receiving Party shall immediately erase/delete all Confidential Information obtained under this Agreement, including operational, archived, and backup Confidential Information.</p>

    <h2>DATA PROTECTION</h2>
    <p>Both parties agree to comply with all applicable data protection laws and regulations concerning the processing of personal data. Each party shall be responsible for ensuring that it has a valid legal basis for processing personal data and obtaining any necessary consents or authorizations as required by law.</p>

    <h2>GENERAL</h2>
    <p>This Agreement contains the entire agreement between the Parties and no variation or consensual cancellation thereof shall be of any force or effect unless reduced to writing and signed by both Parties.</p>

    <div class="signature">
      <p>Signed for and on behalf of</p>
      <p><strong>${projectName}</strong></p>
      <p>____________________</p>
      <p><strong>${userDetails.firstName} ${userDetails.lastName}</strong></p>
      <p><strong>Designation</strong></p>
    </div>

    <div class="signature">
      <p>Receiving Party / Craddule Collaborator</p>
      <p>____________________</p>
      <p><strong>{{RECIPIENT_NAME}}</strong></p>
      <p><strong>Designation</strong></p>
    </div>
  </div>
</body>
</html>`;

      setNda(ndaTemplate);
      setNdaGenerated(true);
    };

    generateNdaTemplate();
  }, [userDetails, projectId, access_token, projectName, ndaGenerated]);

  // Fetch team data
  useEffect(() => {
    const fetchTeam = async () => {
      if (!projectId || !access_token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/api/team/${projectId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`
          }
        });

        if (response.status === 200) {
          const dataS = await response.json();
          setTeam(dataS.data);
        } else {
          const data = await response.json();
          console.log(data);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTeam();
  }, [projectId, access_token]);

  const createTeam = async (data) => {
    // Check if user details are loaded before proceeding
    if (!userDetails?.firstName) {
      toast.error("User details are still loading. Please wait...");
      return;
    }

    setLoading(true);

    try {
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2, 8);
      const uniqueCode = timestamp.toString() + randomString;
      const link = "/login/start/" + uniqueCode;

      let ndaC = "";
      if (isChecked && nda) {
        // Replace the placeholder with the actual email
        ndaC = nda.replace(/{{DEVELOPER_EMAIL}}/g, data.email);

        // Create the NDA in database only when sending the invitation
        const createNdaResponse = await fetch(`${API_BASE_URL}/api/nda`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`
          },
          body: JSON.stringify({
            projectId: projectId,
            nda: ndaC
          })
        });

        if (createNdaResponse.status !== 200) {
          console.log("Failed to create NDA");
          ndaC = ""; // Don't include NDA if creation failed
        }
      }

      const updatedFormData = {
        ...data,
        link: link,
        uniqueCode: uniqueCode,
        projectId: projectId,
        email: data.email,
        nda: ndaC
      };

      const response = await fetch(`${API_BASE_URL}/api/team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`
        },
        body: JSON.stringify(updatedFormData)
      });

      if (response.status === 200) {
        setLoading(false);
        setLink("https://app.craddule.com" + link);
        toast.success("Invite Sent");
        // Reset form
        setFormData({ ...formData, email: "" });
      } else {
        const result = await response.json();
        setLoading(false);
        console.error("Error:", result["error"]);
        toast.error(result["error"]);
      }
    } catch (error) {
      setLoading(false);
      console.error("An error occurred:", error);
      toast.error("An error occurred while sending the invite");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error("Please enter an email address");
      return;
    }

    createTeam(formData);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(linkD)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy the link: ", error);
        toast.error("Failed to copy link");
      });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const deleteTeam = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/team/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete team member");
      }

      setTeam(team.filter((member) => member._id !== id));
      toast.success("Team member deleted successfully");
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member");
    }
  };

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
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Show loading state while user details are being fetched
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faCircleNotch}
            className="fa-spin text-4xl mb-4"
          />
          <p>Loading user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BreadCrumb page={"Add team member"} />

      <div className="w-full max-w-4xl mx-auto mt-5 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h4 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800">
                Add Team Member
              </h4>
              <button
                onClick={() => navigate("/nda")}
                className="bg-blue600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 w-fit"
              >
                Edit NDA
              </button>
            </div>
          </div>

          {linkD && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Invitation Link:</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={linkD}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Copy Link
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Team Member Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter team member email address"
                required
                className="w-full border border-gray-300 bg-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="nda"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="nda"
                className="text-sm font-medium text-gray-700"
              >
                Include NDA (Non-Disclosure Agreement) with invitation
              </label>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading || userLoading || !userDetails?.firstName}
                className="bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto min-w-[200px] py-3 px-6 rounded-lg text-white font-medium flex items-center justify-center transition-colors duration-200"
              >
                {loading && (
                  <FontAwesomeIcon
                    icon={faCircleNotch}
                    className="fa-spin mr-2"
                  />
                )}
                <span>{loading ? "Sending Invite..." : "Send Invitation"}</span>
              </button>
            </div>
          </form>

          {/* Team Members List */}
          {team.length > 0 && (
            <>
              <div className="border-t border-gray-200 mt-8 pt-8">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">
                  Current Team Members
                </h5>
                <div className="space-y-3">
                  {team.map((member) => (
                    <div
                      key={member._id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg gap-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {member.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          {member.userId?.firstName} {member.userId?.lastName} —{" "}
                          {member.teamRole}
                        </p>
                        <p className="text-sm text-gray-600">
                          Added on {formatDate(member.timeSent)} at{" "}
                          {formatTime(member.timeSent)}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteTeam(member._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 w-fit"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}

export default ScrapView;
