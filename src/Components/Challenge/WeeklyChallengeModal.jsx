import { useState } from "react";
import { FaNairaSign } from "react-icons/fa6";

const WeeklyChallengeModal = ({ onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const handleSubscribe = async () => {
    setLoading(true);
    setError("");

    try {
      const url = "https://api.toplike.app/api/join/challenge";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.redirect_url) {
          window.location.href = data.redirect_url;
        } else {
          onSuccess();
        }
      } else {
        setError(data.message || "Failed to subscribe");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
              <FaNairaSign className="h-6 w-6 text-purple-600" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Join Weekly Challenge
            </h3>

            <p className="text-gray-600 mb-4">
              Subscribe to the weekly challenge to start posting and competing
              for amazing prizes!
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 text-left">
              <p className="font-medium text-yellow-800">₦500 Entry Fee</p>
              <p className="text-sm text-yellow-700">
                Weekly prize pool: ₦100,000
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 text-left">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition hover:bg-gray-50"
              >
                Maybe Later
              </button>

              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium transition disabled:opacity-50 hover:bg-purple-700 flex items-center justify-center"
              >
                {loading ? "Processing..." : "Subscribe Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WeeklyChallengeModal;
