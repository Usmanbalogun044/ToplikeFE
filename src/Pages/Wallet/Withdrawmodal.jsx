import { useState } from "react";
import { FiX, FiDollarSign, FiCheck, FiAlertCircle } from "react-icons/fi";

const Withdrawmodal = ({ currentBalance, onClose, onWithdrawSuccess }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate amount
    if (!amount || isNaN(amount)) {
      setError("Please enter a valid amount");
      return;
    }

    const withdrawalAmount = parseFloat(amount);

    if (withdrawalAmount < 1000) {
      setError("Minimum withdrawal is ₦1,000");
      return;
    }

    if (withdrawalAmount > currentBalance) {
      setError("Amount exceeds your balance");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://toplike.up.railway.app/api/withdraw",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ amount: withdrawalAmount }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Withdrawal failed");
      }

      // Success case
      setSuccess(true);
      if (onWithdrawSuccess) onWithdrawSuccess(withdrawalAmount);
    } catch (error) {
      setError(error.message || "Failed to process withdrawal");
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <FiCheck className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Withdrawal Successful!
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            ₦{parseFloat(amount).toLocaleString("en-NG")} will be processed
            within 24 hours.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // Main Form
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg">Withdraw Funds</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Amount (₦)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="text-gray-400" />
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="py-2 pl-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="1000"
                min="1000"
                max={currentBalance}
                step="100"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Available balance: ₦{currentBalance.toLocaleString("en-NG")}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 flex items-start bg-red-50 border-l-4 border-red-500 p-3 rounded-r">
              <FiAlertCircle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-70 transition-colors"
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Withdraw"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Withdrawmodal;
