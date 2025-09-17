import React, { useState, useEffect, useRef } from "react";
import p1 from "./images/p1.jpeg";
import Header from "./component/header";
import {
  API_BASE_URL,
  API_IMAGE_BASE_URL,
  APP_BASE_URL,
  APP_REFER_URL
} from "./config/apiConfig";
import { useNavigate } from "react-router-dom";
import ImageModal from "./component/imageModal";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import BreadCrumb from "./component/breadCrumb";
import PhoneInput from "react-phone-input-2";

const Profile = () => {
  // State variables to manage dropdown behavior
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(null);
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Function to handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  //Second Dropdown
  // State variables to manage dropdown behavior
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const [selectedOption1, setSelectedOption1] = useState("");
  const dropdownRef1 = useRef(null);

  // Function to toggle dropdown visibility
  const toggleDropdown1 = () => {
    setIsDropdownOpen1(!isDropdownOpen1);
  };

  // Function to handle option selection
  const handleOptionSelect1 = (option) => {
    setSelectedOption1(option);
    setIsDropdownOpen1(false);
  };

  //Third Dropdown
  // State variables to manage dropdown behavior
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [selectedOption2, setSelectedOption2] = useState("");
  const dropdownRef2 = useRef(null);

  // Function to toggle dropdown visibility
  const toggleDropdown2 = () => {
    setIsDropdownOpen2(!isDropdownOpen2);
  };

  // Function to handle option selection
  const handleOptionSelect2 = (option) => {
    setSelectedOption2(option);
    setIsDropdownOpen2(false);
  };

  //fourth Dropdown
  // State variables to manage dropdown behavior
  const [isDropdownOpen3, setIsDropdownOpen3] = useState(false);
  const [selectedOption3, setSelectedOption3] = useState("");
  const dropdownRef3 = useRef(null);

  // Function to toggle dropdown visibility
  const toggleDropdown3 = () => {
    setIsDropdownOpen3(!isDropdownOpen3);
  };

  // Function to handle option selection
  const handleOptionSelect3 = (option) => {
    setSelectedOption3(option);
    setIsDropdownOpen3(false);
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phoneNumber: value });
  };

  // Close dropdown when clicking outside of it 1
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown when clicking outside of it 2
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef1.current &&
        !dropdownRef1.current.contains(event.target)
      ) {
        setIsDropdownOpen1(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown when clicking outside of it 3
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef2.current &&
        !dropdownRef2.current.contains(event.target)
      ) {
        setIsDropdownOpen2(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown when clicking outside of it 4
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef3.current &&
        !dropdownRef3.current.contains(event.target)
      ) {
        setIsDropdownOpen3(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const access_token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;

  //Register

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingDiscard, setLoadingDiscard] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: ""
  });

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(API_BASE_URL + "/api/user/" + userId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`
        }
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        // Update user details state with fetched data
        const { firstName, lastName, email, phoneNumber, image } = data;
        setFormData({ firstName, lastName, email, phoneNumber });
        const imageFile = image.split("/");
        console.log(imageFile);
        setImage(imageFile[2]);
      } else {
        const data = await response.json();
        console.log(data);
        console.error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  console.log(formData);
  useEffect(() => {
    // Simulating fetching user details from an API
    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("click");
    updateUser(formData); // Directly call updateUser with form data
  };

  const updateUser = async (data) => {
    setLoading(true);
    console.log("at change");
    try {
      console.log(data);
      const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`
        },
        body: JSON.stringify(data)
      });

      // const data = response.json();

      if (response.status === 200) {
        console.log(response.status);
        console.log(response);

        const responseData = await response.json();
        console.log(responseData);
        toast.success(responseData.message);

        setLoading(false);
      } else {
        const result = await response.json();
        setLoading(false);
        toast.error(result["error"]);
        console.log("Error:", result);
      }
    } catch (error) {
      setLoading(false);
      console.error("An error occurred:", error);
    }
  };

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`${APP_REFER_URL}/${referralCode}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 5000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const submitForm = () => {
    document.getElementById("userUpdateForm").click();
  };

  const handleDiscard = () => {
    setLoadingDiscard(true);
    fetchUserDetails();
    setLoadingDiscard(false);
  };

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/user/referralcode/get/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
          }
        );
        console.log(response);
        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
          setReferralCode(data.referralCode);
        } else {
          console.error(
            "Error fetching user referral code:",
            await response.json()
          );
        }
      } catch (err) {
        console.log("here");
        console.log(err);
      }
    };
    fetchCode();
  }, []);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/user/referral/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
          }
        );
        console.log(response);
        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
          setReferralCount(data);
        } else {
          console.error(
            "Error fetching user referrals:",
            await response.json()
          );
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchReferrals();
  }, []);

  console.log(image);

  return (
    <>
      <Header />
      <BreadCrumb page={"Profile"} />

      <div className="mx-4 sm:mx-10 md:mx-20 lg:mx-40 mt-5 p-5 sm:p-10 px-5 sm:px-20 bg-white rounded-[20px] sm:rounded-[30px] shadow-md">
        <h4 className="text-center mt-8 text-[20px] sm:text-[26px] font-semibold text-gray900">
          Welcome to Your Profile
        </h4>
        <p className="text-gray800 text-center mb-10 text-[14px] sm:text-[16px]">
          Keep your information up to date so we can serve you better.
        </p>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-5">
          <button
            className="px-5 py-2 bg-blue600 text-white rounded-full min-w-[120px] flex items-center justify-center"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
            ) : (
              <span>Save Changes</span>
            )}
          </button>
          <button
            className="px-5 py-2 border border-gray900 rounded-full min-w-[120px] flex items-center justify-center"
            disabled={loadingDiscard}
            onClick={handleDiscard}
          >
            {loadingDiscard ? (
              <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
            ) : (
              <span>Cancel</span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 mt-5">
          <div className="col-span-4 mt-10 text-center">
            <p className="font-semibold text-[16px] sm:text-[18px]">
              Profile Picture / Company Logo
            </p>
            <div className="mt-4">
              <img
                src={
                  image
                    ? `${API_BASE_URL}/images/${image}`
                    : "https://www.gravatar.com/avatar/c7763a1c6be16ffb347e8500434b61eb?s=200&r=pg&d=mm"
                }
                className="rounded-full w-[150px] sm:w-[300px] h-[150px] sm:h-[300px] m-auto object-cover"
                alt="User avatar"
              />
              <button
                className="px-5 py-3 mt-4 bg-blue600 rounded-[30px] text-white text-[14px]"
                onClick={() => setIsOpen(true)}
              >
                Change Picture
              </button>
            </div>
          </div>

          <div className="col-span-1 hidden sm:block"></div>

          <div className="col-span-7 mt-10 sm:mt-16">
            <form onSubmit={handleSubmit}>
              <div className="mt-[16px]">
                <label
                  htmlFor="firstName"
                  className="text-[16px] sm:text-[18px] font-semibold pb-1 block"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border border-black400 px-3 py-[10px] rounded-full"
                />
              </div>

              <div className="mt-[16px]">
                <label
                  htmlFor="lastName"
                  className="text-[16px] sm:text-[18px] font-semibold pb-1 block"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border border-black400 px-3 py-[10px] rounded-full"
                />
              </div>

              <div className="mt-[16px]">
                <label
                  htmlFor="email"
                  className="text-[16px] sm:text-[18px] font-semibold pb-1 block"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-black400 px-3 py-[10px] rounded-full"
                />
              </div>

              <div className="mt-[16px]">
                <label
                  htmlFor="phoneNumber"
                  className="text-[16px] sm:text-[18px] font-semibold pb-1 block"
                >
                  Phone Number
                </label>
                <PhoneInput
                  country={"ng"}
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  inputProps={{
                    name: "phoneNumber",
                    required: true,
                    autoFocus: true,
                    className: "custom-input2"
                  }}
                />
              </div>
            </form>
          </div>
        </div>

        <ImageModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          setImage={setImage}
        />
        <ToastContainer />

        <div className="mt-10 border border-dashed border-black100 rounded-[20px] sm:rounded-[30px] p-5 sm:p-6">
          <h4 className="text-center mt-5 sm:mt-10 text-[16px] sm:text-[18px] font-semibold">
            🎁 Refer a Friend
          </h4>
          <p className="text-gray800 text-center mb-5 text-[14px] sm:text-[16px]">
            Invite your friends and get a special gift when they join and
            complete their application!
          </p>

          <div className="w-full h-full flex justify-center items-center">
            <div className="w-fit m-auto text-center">
              <p className="mb-1 text-[14px] sm:text-[16px] font-medium">
                Your Referral Link:
              </p>
              <div className="flex flex-col lg:flex-row gap-2 items-center justify-center">
                <div className="px-4 py-2 bg-black50 rounded-lg text-center text-sm">
                  {`${APP_REFER_URL}/${referralCode}`}
                </div>
                <button
                  className="px-4 py-2 bg-blue600 rounded-full text-white text-sm"
                  onClick={handleCopy}
                >
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 m-auto p-4 sm:p-6 w-fit bg-gray200 rounded-[20px]">
            <h5 className="text-center text-[14px] sm:text-[16px] font-medium">
              Referral Progress
            </h5>

            <div className="mt-4">
              <div className="flex justify-between text-[14px] sm:text-[16px]">
                <p>Visited Craddule</p>
                <p>{referralCount ? referralCount.visited : "0"}</p>
              </div>
              <div className="flex justify-between text-[14px] sm:text-[16px] mt-2">
                <p>Subscribed</p>
                <p>{referralCount ? referralCount.subscribed : "0"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
