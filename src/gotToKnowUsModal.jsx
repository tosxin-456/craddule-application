import React, { useState, useEffect } from 'react';
import { getUserIdFromToken } from './utils/startUtils';
import { API_BASE_URL } from './config/apiConfig';

const WhereDidYouHearModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasDismissed, setHasDismissed] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [otherText, setOtherText] = useState("");
    const { userId, access_token } = getUserIdFromToken();

    const handleOptionChange = (e) => {
        const value = e.target.value;
        setSelectedOption(value);
        if (value !== "other") setOtherText(""); // Clear other text if another option is selected
    };

    const showModalAfterRandomInterval = () => {
        const randomTime = Math.floor(Math.random() * (30000 - 10000 + 1)) + 10000;
        setTimeout(() => {
            setIsVisible(true);
        }, randomTime);
    };

    const showModalAfterFiveHours = () => {
        const fiveHours = 5 * 60 * 60 * 1000;
        setTimeout(() => {
            setHasDismissed(false);
            setIsVisible(true);
        }, fiveHours);
    };

    useEffect(() => {
        const gottenThrough = JSON.parse(localStorage.getItem("gottenThrough"));
        if (gottenThrough) return; // If gottenThrough is true, do not show the modal

        if (!hasDismissed) {
            setIsVisible(true);
        }

        const interval = setInterval(() => {
            if (!isVisible && !hasDismissed) {
                showModalAfterRandomInterval();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [isVisible, hasDismissed]);

    const handleNoClick = () => {
        setIsVisible(false);
        setHasDismissed(true);
        showModalAfterFiveHours();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const responseText = selectedOption === "other" ? otherText : selectedOption;

        const data = {
            howDidYouKnowUs: true,
            WheredidYouMeetUs: responseText
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/user/${userId}/gotten-by`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Update successful:', responseData.message);
                setIsVisible(false);
                setHasDismissed(true);
                localStorage.setItem("gottenThrough", JSON.stringify(true)); // Set gottenThrough to true
            } else {
                const result = await response.json();
                console.error('Error:', result.error);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
      <>
        {isVisible && (
          <div className="random-overlay fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 bg-opacity-50">
            <div className="random-content bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-end">
                <button
                  onClick={handleNoClick}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <h2 className="text-2xl font-semibold text-center mb-4">
                How Did You Hear About Us?
              </h2>
              <p className="text-center text-gray-600 mb-6">
                We’d love to know how you found out about our service!
              </p>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="social_media"
                    checked={selectedOption === "social_media"}
                    onChange={handleOptionChange}
                    className="text-blue-500"
                  />
                  <span>Social Media</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="friend"
                    checked={selectedOption === "friend"}
                    onChange={handleOptionChange}
                    className="text-blue-500"
                  />
                  <span>A Friend</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="search_engine"
                    checked={selectedOption === "search_engine"}
                    onChange={handleOptionChange}
                    className="text-blue-500"
                  />
                  <span>Search Engine</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="other"
                    checked={selectedOption === "other"}
                    onChange={handleOptionChange}
                    className="text-blue-500"
                  />
                  <span>Other</span>
                </label>
                {selectedOption === "other" && (
                  <input
                    type="text"
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    placeholder="Please specify..."
                    className="border border-gray-300 rounded px-3 py-2 mt-2 w-full"
                  />
                )}
              </div>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Submit
                </button>
                <button
                  onClick={handleNoClick}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
};

export default WhereDidYouHearModal;
