import { useState } from "react";
import { FiX, FiDollarSign } from "react-icons/fi";

const Withdrawmodal = ({ currentBalance, onWithdraw, onClose }) => {
  const [amount, setAmount] = useState("");
  const [bankDetails, setBankDetails] = useState({
    bankCode: "",
    accountNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!amount || isNaN(amount)) {
      setError("Please enter a valid amount");
      return;
    }
    if (parseFloat(amount) < 1000) {
      setError("Minimum withdrawal is ₦1,000");
      return;
    }
    if (parseFloat(amount) > currentBalance) {
      setError("Amount exceeds your balance");
      return;
    }
    if (!bankDetails.bankCode || !bankDetails.accountNumber) {
      setError("Please provide bank details");
      return;
    }

    setLoading(true);
    onWithdraw(parseFloat(amount), bankDetails);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-bold text-lg">Withdraw Funds</h3>
            <button onClick={onClose} className="text-gray-500">
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Amount Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
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
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg"
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

            {/* Bank Details */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Bank</label>
              <select
                value={bankDetails.bankCode}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, bankCode: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Bank</option>
                <option value="044">Access Bank</option>
                <option value="063">Diamond Bank</option>
                <option value="050">Ecobank</option>
                <option value="070">Fidelity Bank</option>
                {/* Add more banks as needed */}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Account Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiBank className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      accountNumber: e.target.value,
                    })
                  }
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="1234567890"
                  required
                />
              </div>
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
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {loading ? "Processing..." : "Withdraw"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Withdrawmodal;
