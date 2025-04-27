import { useState } from "react";
import { FiX, FiDollarSign, FiCheck } from "react-icons/fi";

const Withdrawmodal = ({ currentBalance, onClose, onWithdrawSuccess }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
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

    const url = "https://toplike.up.railway.app/api/withdraw";
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        amount: withdrawalAmount,
      }),
    };

    try {
      const response = await fetch(url, option);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Withdrawal failed");
      }

      setSuccess(true);
      if (onWithdrawSuccess) onWithdrawSuccess(withdrawalAmount);
    } catch (error) {
      setError(error.message || "An error occurred during withdrawal");
    } finally {
      setLoading(false);
    }
  };

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
            Your withdrawal request of ₦
            {parseFloat(amount).toLocaleString("en-NG")} has been received.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer font-medium hover:bg-purple-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg">Withdraw Funds</h3>
          <button
            onClick={onClose}
            className="text-gray-500 cursor-pointer hover:text-gray-700"
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
                className="py-2 pl-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="1000"
                min="1000"
                max={currentBalance}
                step="100"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Available: ₦{currentBalance.toLocaleString("en-NG")}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg cursor-pointer font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Withdraw"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Withdrawmodal;
