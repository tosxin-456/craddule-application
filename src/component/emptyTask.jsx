import { UploadCloud } from "lucide-react"; // Optional: Icon from lucide-react
import { useNavigate } from "react-router-dom";

const EmptyState = () => {
    const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md text-center">
        <div className="flex justify-center mb-4">
          <UploadCloud className="w-12 h-12 text-blue-500" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          No Tasks Available
        </h2>
        <p className="text-gray-600 mb-6">
          Upload and create a task before you can use this section.
        </p>
        <button
          onClick={() => {
         navigate('/createTask')
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Task
        </button>
      </div>
    </div>
  );
};

export default EmptyState;