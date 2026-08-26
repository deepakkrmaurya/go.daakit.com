import { FaMapMarkedAlt } from "react-icons/fa";

function RoutePlanning() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
        <FaMapMarkedAlt className="text-indigo-600 text-5xl mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Route Planning</h1>
        <p className="text-lg text-gray-600">🚧 This feature is under development. <br /> Stay tuned!</p>
      </div>
    </div>
  );
}

export default RoutePlanning;
