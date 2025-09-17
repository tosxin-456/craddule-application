import React, { useState, useEffect } from "react";
import Header from "./component/header";
import BreadCrumb from "./component/breadCrumb";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL, APP_REFER_URL } from "./config/apiConfig";
import { jwtDecode } from "jwt-decode";

const Referral = () => {
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(null);
  const [copied, setCopied] = useState(false);

  const access_token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/user/referralcode/get/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`
            }
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          setReferralCode(data.referralCode);
        } else {
          console.error("Failed to fetch referral code");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCode();
  }, [userId, access_token]);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/user/referral/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`
            }
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          setReferralCount(data);
        } else {
          console.error("Failed to fetch referral count");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchReferrals();
  }, [userId, access_token]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`${APP_REFER_URL}/${referralCode}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
  };

  return (
    <>
      <Header />
      <BreadCrumb page={"Referrals"} />
      <div className="mx-4 sm:mx-10 md:mx-20 lg:mx-40 mt-5 p-5 sm:p-10 bg-white rounded-[20px] sm:rounded-[30px] shadow-md">
        <h4 className="text-center text-[20px] sm:text-[26px] font-semibold text-gray900">
          🎁 Invite Friends, Get Rewards!
        </h4>
        <p className="text-gray800 text-center mb-6 text-[14px] sm:text-[16px]">
          Share your referral link and earn rewards when your friends join and
          subscribe.
        </p>

        <div className="w-full flex justify-center items-center">
          <div className="w-fit text-center">
            <p className="mb-2 text-[14px] sm:text-[16px] font-medium">
              Your Referral Link:
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2">
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

        <div className="mt-6 mx-auto p-6 bg-gray200 rounded-[20px] max-w-[400px]">
          <h5 className="text-center text-[14px] sm:text-[16px] font-medium mb-4">
            Referral Progress
          </h5>
          <div className="flex justify-between mb-2 text-sm">
            <span>Visited Craddule</span>
            <span>{referralCount ? referralCount.visited : "0"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Subscribed</span>
            <span>{referralCount ? referralCount.subscribed : "0"}</span>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Referral;
