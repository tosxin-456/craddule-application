import React from "react";
import { X, Lock, ArrowRight } from "lucide-react";

const PhaseAccessModal = ({ isOpen, onClose, currentPhase, requiredPhase }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 sm:px-6">
      <div className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-sm sm:max-w-md relative shadow-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Lock icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <Lock size={32} className="text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-3 text-gray-800">
          Phase Locked
        </h2>

        {/* Message */}
        <div className="text-center mb-5">
          <p className="text-gray-600 text-sm sm:text-base mb-4">
            To access{" "}
            <span className="font-semibold text-blue-600">{currentPhase}</span>,
            you need to complete the previous phase first.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 bg-gray-50 p-3 rounded-lg text-sm sm:text-base">
            <span className="text-gray-700">Complete</span>
            <span className="font-semibold text-blue-600">{requiredPhase}</span>
            <ArrowRight size={16} className="text-gray-400" />
            <span className="text-gray-700">Access</span>
            <span className="font-semibold text-green-600">{currentPhase}</span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default PhaseAccessModal;
