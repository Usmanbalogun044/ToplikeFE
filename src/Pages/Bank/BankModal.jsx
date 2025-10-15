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
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      setLoadingBanks(true);
      const response = await fetch("https://api.toplike.app/api/banks/list", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch banks");
      }

      const result = await response.json();
      // console.log("=== BANKS DATA ===");
      // console.log("Full banks response:", result);

      const list = Array.isArray(result?.banks?.data) ? result.banks.data : [];
      // console.log("Banks list:", list);

      // Check if OPay is in the list and what its data looks like
      const opayBank = list.find((bank) =>
        bank.name.toLowerCase().includes("opay")
      );
      // console.log("OPay bank data:", opayBank);

      setBanks(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingBanks(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "accountNumber") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, accountNumber: digitsOnly }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bankCode || !formData.accountNumber) {
      setError("Please select bank and enter account number");
      return;
    }

    if (formData.accountNumber.length !== 10) {
      setError("Account number must be exactly 10 digits");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const selectedBank = banks.find((b) => b.code === formData.bankCode);

      console.log("Sending bank data:", {
        account_number: formData.accountNumber,
        bank_code: formData.bankCode,
        bank_name: selectedBank?.name || "",
      });

      await onAddAccount({
        accountNumber: formData.accountNumber,
        bankCode: formData.bankCode,
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
                maxLength={10}
                inputMode="numeric"
                pattern="\d{10}"
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
