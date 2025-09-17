import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreateTellUs, getUserIdFromToken } from "../utils/startUtils";

export default function GiveFeedbackModal({ open, onClose, clickPosition }) {
  const navigate = useNavigate();
  const projectId = localStorage.getItem("nProject");
  const { access_token, userId } = getUserIdFromToken();
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  const handleFeedbackSubmit = async () => {
    const feedbackData = {
      projectId,
      userId,
      feedback
    };

    await CreateTellUs(
      feedbackData,
      (response) => {
        console.log("Feedback Submitted:", response);
        setFeedback("");
        setError(null);
        onClose();
      },
      setError,
      setLoading
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blac/20 bg-opacity-50">
      <div
        ref={modalRef}
        className="relative w-[90%] max-w-md bg-white rounded-lg shadow-lg"
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-white hover:text-red-500 text-xl"
          aria-label="Close"
          onClick={() => {
            setFeedback("");
            setError(null);
            onClose();
          }}
        >
          &times;
        </button>

        {/* Modal Header */}
        <div className="text-center bg-[#193FAE] text-white rounded-t-lg py-4 px-6">
          <p className="text-lg font-semibold">Tell us more</p>
          <p className="text-sm">Let us know what you think</p>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#193FAE]"
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}

          <div className="mt-4">
            <button
              className="w-full bg-[#193FAE] text-white py-2 rounded-lg hover:bg-blue-700"
              type="button"
              onClick={handleFeedbackSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Share Feedback"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
