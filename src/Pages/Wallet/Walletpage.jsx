import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Withdrawmodal from "./Withdrawmodal";
import WalletTransactions from "./WalletTransaction";

const Walletpage = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [bankAccountExists, setBankAccountExists] = useState(null);
  const navigate = useNavigate(); // for redirect
  const [hasBankAccount, setHasBankAccount] = useState(false);

  const fetchBalance = async () => {
    // Fetch the user's wallet balance
    const url = "https://toplike.up.railway.app/api/wallet";
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
      setError(null);

      const res = await fetch(url, option);

      if (!res.ok) throw new Error("Failed to fetch balance");

      const data = await res.json();
      setBalance(parseFloat(data.wallet?.balance) || 0);
    } catch (err) {
      setError(err.message);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchBankAccount = async () => {

    // Fetch the user's bank account details
    const url = "https://toplike.up.railway.app/api/bankaccount";
    const option = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    try {
      const res = await fetch(url, option);

      if (res.status === 404) {
        // Bank account doesn't exist
        setHasBankAccount(false);
        setBankAccountExists(false);
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch bank account");

      const data = await res.json();
      setHasBankAccount(!!data.bank_account);
      setBankAccountExists(!!data.bank_account);
    } catch (error) {
      console.error("Bank account fetch error:", error);
      // Don't redirect on network errors - only on confirmed missing account
      if (error.message.includes("404")) {
        setHasBankAccount(false);
        setBankAccountExists(false);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchBalance(), fetchBankAccount()]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (bankAccountExists === false) {
      // Only redirect if we're certain the account doesn't exist
      // and not just because of a network error
      navigate("/create-account");
    }
  }, [bankAccountExists, navigate]);

  const handleWithdrawSuccess = () => {
    fetchBalance();
  };

  if (bankAccountExists === null) {
    // Show loading until we know if user has bank account
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content - Loading state only here */}

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchBalance}
              className="mt-2 text-sm text-red-600 font-medium"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-medium">Available Balance</h2>
                  <p className="text-3xl font-bold mt-2">
                    ₦{balance.toLocaleString("en-NG")}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (hasBankAccount) {
                      setShowWithdrawModal(true);
                    } else {
                      // Redirect them to create account page
                      navigate("/createaccount"); // Or show a toast/message if you want
                    }
                  }}
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-gray-100 transition"
                  disabled={balance < 1000}
                >
                  Withdraw
                </button>
              </div>
              {balance < 1000 && (
                <p className="text-sm text-purple-200 mt-3">
                  Minimum withdrawal amount is ₦1,000
                </p>
              )}
            </div>

            <WalletTransactions />

            {showWithdrawModal && (
              <Withdrawmodal
                currentBalance={balance}
                onClose={() => setShowWithdrawModal(false)}
                onWithdrawSuccess={handleWithdrawSuccess}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Walletpage;
