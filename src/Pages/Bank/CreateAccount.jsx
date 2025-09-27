import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiCheck, FiArrowLeft, FiCreditCard } from "react-icons/fi";
import BankModal from "./BankModal";

const CreateAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingAccount, setAddingAccount] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else fetchAccounts();
  }, [navigate]);

  const fetchAccounts = async () => {

    const url = "https://api.toplike.app/api/bankaccount";
    const option = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    try {
      setLoading(true);
      setError("");
      const response = await fetch(url, option);

      if (!response.ok) throw new Error("Failed to load accounts");

      const data = await response.json();
      setAccounts(data.bank_account ? [data.bank_account] : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (newAccount) => {
    // If a bank account already exists, backend supports PUT /bankaccount to update; otherwise POST /bankaccount/create
    const hasExisting = accounts && accounts.length > 0;
    const url = hasExisting
      ? "https://api.toplike.app/api/bankaccount"
      : "https://api.toplike.app/api/bankaccount/create";
    const option = {
      method: hasExisting ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        account_number: newAccount.accountNumber,
        bank_name: newAccount.bankName,
      }),
    };
    
    try {
      setAddingAccount(true);
      setError("");
      const response = await fetch(url, option);

      if (!response.ok) {
        let msg = "Failed to save account";
        try {
          const data = await response.json();
          msg = data?.message || data?.error || msg;
        } catch (_) {}
        throw new Error(msg);
      }

      // Refresh list to reflect latest account and resolved account_name
      await fetchAccounts();
      setShowAddModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingAccount(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto p-4 md:p-6 w-full">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">Bank Accounts</h1>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-12">
            <FiPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No bank accounts</h3>
            <p className="text-gray-500 mb-6">
              Add your bank account to withdraw earnings
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700"
            >
              <FiPlus className="inline mr-2" /> Add Bank Account
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center text-purple-600 font-medium mb-6"
            >
              <FiPlus className="mr-2" /> Add New Account
            </button>

            <div className="space-y-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-white p-4 rounded-lg shadow mb-4"
                >
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                      <FiCreditCard className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{account.bank_name}</h3>
                      <p className="text-gray-500 text-sm">
                        {account.account_number} • {account.account_name}
                      </p>
                    </div>
                    <FiCheck className="ml-auto text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {showAddModal && (
          <BankModal
            onAddAccount={handleAddAccount}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default CreateAccount;
