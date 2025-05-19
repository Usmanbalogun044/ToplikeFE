import { useState, useEffect } from "react";
import { FiX, FiCreditCard } from "react-icons/fi";

const BankModal = ({ onAddAccount, onClose }) => {
  const [formData, setFormData] = useState({
    bankCode: "",
    accountNumber: "",
  });
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    
    // Fetchs the list of banks from the API
    const url = "https://toplike.up.railway.app/api/banks/list";
    const option = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    try {
      setLoadingBanks(true);
      const response = await fetch(url, option);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch banks");
      }

      const result = await response.json();
      setBanks(result.data || result.banks?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingBanks(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  //banks.data.name wo i dey go sleep
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bankCode || !formData.accountNumber) {
      setError("Please select bank and enter account number");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const selectedBank = banks.find((b) => b.code === formData.bankCode);

      await onAddAccount({
        accountNumber: formData.accountNumber,
        bankName: selectedBank?.name || "",
      });

      onClose();
    } catch (err) {
      setError(err.message || "Failed to save account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg">Add Bank Account</h3>
          <button onClick={onClose} className="text-gray-500">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Bank</label>
            <select
              name="bankCode"
              value={formData.bankCode}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
              disabled={loadingBanks}
            >
              <option value="">
                {loadingBanks ? "Loading banks..." : "Select Bank"}
              </option>
              {banks.length > 0 &&
                banks.map((bank) => (
                  <option key={bank.id} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Account Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCreditCard className="text-gray-400" />
              </div>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
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
              className={`bg-purple-600 text-white px-6 py-2 rounded-lg font-medium ${
                loading ? "opacity-50" : "hover:bg-purple-700"
              }`}
            >
              {loading ? "Saving..." : "Save Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankModal;
