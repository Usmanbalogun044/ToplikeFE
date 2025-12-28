import { useState } from "react";
import { FiX, FiCheck, FiAlertCircle } from "react-icons/fi";
import { FaNairaSign } from "react-icons/fa6";
import { API_URL } from "../../config";

const Withdrawmodal = ({ currentBalance, onClose, onWithdrawSuccess }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
        `${API_URL}/withdraw`,
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

      setSuccess(true);
      if (onWithdrawSuccess) onWithdrawSuccess(withdrawalAmount);
    } catch (error) {
      setError(error.message || "Failed to process withdrawal");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="glass-panel w-full max-w-sm p-8 text-center rounded-3xl border border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mb-6 border border-green-500/30">
            <FiCheck className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Withdrawal Successful!
          </h3>
          <p className="text-purple-200/60 mb-8">
            ₦{parseFloat(amount).toLocaleString("en-NG")} will be processed within 24 hours.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-600/20"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-panel w-full max-w-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
          <h3 className="font-bold text-xl text-white">Withdraw Funds</h3>
          <button
            onClick={onClose}
            className="text-purple-300/50 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <div className="mb-8">
            <label className="block text-xs font-bold text-purple-200/50 uppercase tracking-wider mb-2">
              Amount to Withdraw
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaNairaSign className="text-fuchsia-400 text-xl" />
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-2xl font-bold text-white placeholder-purple-500/20 focus:outline-none focus:border-fuchsia-500/50 transition-all"
                placeholder="0.00"
                min="1000"
                max={currentBalance}
                step="100"
                autoFocus
              />
            </div>
            <div className="flex justify-between mt-3 text-xs">
                 <p className="text-purple-300/50">Min: ₦1,000</p>
                 <p className="text-fuchsia-300/80 font-medium">Available: ₦{currentBalance.toLocaleString("en-NG")}</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
              <FiAlertCircle className="text-red-400 flex-shrink-0" />
              <span className="text-red-200 text-sm">{error}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 border border-white/10 rounded-xl text-purple-200/60 hover:text-white hover:bg-white/5 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-xl font-bold shadow-lg shadow-fuchsia-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                </div>
              ) : (
                "Withdraw Funds"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Withdrawmodal;
