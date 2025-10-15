import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Withdrawmodal from "./Withdrawmodal";
import WalletTransactions from "./WalletTransaction";
import Header from "../../Components/Sharedd/Header";

const Walletpage = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState({
    balance: true,
    bankAccount: true,
  });
  const [errors, setErrors] = useState({
    balance: null,
    bankAccount: null,
  });
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [hasBankAccount, setHasBankAccount] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const navigate = useNavigate();

  const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
      throw error;
    }
  };

  const fetchBalance = useCallback(async () => {
    const url = "https://api.toplike.app/api/wallet";
    try {
      const data = await fetchWithRetry(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setBalance(parseFloat(data.wallet?.balance) || 0);
      sessionStorage.setItem("walletBalance", data.wallet?.balance);
      setErrors((prev) => ({ ...prev, balance: null }));
      return true;
    } catch (err) {
      console.error("Balance fetch error:", err);
      setErrors((prev) => ({
        ...prev,
        balance: err.message || "Network error",
      }));

      // Try to use cached balance if available
      const cachedBalance = sessionStorage.getItem("walletBalance");
      if (cachedBalance) {
        setBalance(parseFloat(cachedBalance));
      } else {
        setBalance(0);
      }
      return false;
    } finally {
      setLoading((prev) => ({ ...prev, balance: false }));
    }
  }, []);

  const fetchBankAccount = useCallback(async () => {
    if (retrying) return;
    setRetrying(true);

    try {
      const token = localStorage.getItem("token");
      console.log(
        "Fetching bank account with token:",
        token ? "Token exists" : "No token"
      );

      const response = await fetch("https://api.toplike.app/api/bankaccount", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Bank account response status:", response.status);
      console.log("Bank account response headers:", response.headers);

      if (response.status === 404) {
        // 404 means no bank account exists yet - this is normal for new users
        console.log(
          "No bank account found (404) - this is normal for new users"
        );
        setHasBankAccount(false);
        sessionStorage.setItem("hasBankAccount", "false");
        setErrors((prev) => ({ ...prev, bankAccount: null }));
        return false;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Bank account response data:", data);

      // Handle different possible response structures
      const hasAccount = !!(data.bank_account || data.account || data.data);
      setHasBankAccount(hasAccount);
      sessionStorage.setItem("hasBankAccount", hasAccount.toString());
      setErrors((prev) => ({ ...prev, bankAccount: null }));
      return hasAccount;
    } catch (err) {
      console.error("Bank account fetch error:", err);

      if (err.message.includes("404")) {
        // 404 is not an error - it just means no account exists
        setHasBankAccount(false);
        sessionStorage.setItem("hasBankAccount", "false");
        setErrors((prev) => ({ ...prev, bankAccount: null }));
        return false;
      }

      setErrors((prev) => ({
        ...prev,
        bankAccount: err.message || "Network error",
      }));

      // Use cached value if available
      const cachedBankAccount = sessionStorage.getItem("hasBankAccount");
      if (cachedBankAccount !== null) {
        setHasBankAccount(cachedBankAccount === "true");
        return cachedBankAccount === "true";
      }
      return null;
    } finally {
      setRetrying(false);
      setLoading((prev) => ({ ...prev, bankAccount: false }));
    }
  }, [retrying]);

  // Initial data fetch
  useEffect(() => {
    // Load cached data immediately
    const cachedBalance = sessionStorage.getItem("walletBalance");
    const cachedBankAccount = sessionStorage.getItem("hasBankAccount");

    if (cachedBalance) {
      setBalance(parseFloat(cachedBalance));
      setLoading((prev) => ({ ...prev, balance: false }));
    }

    if (cachedBankAccount !== null) {
      setHasBankAccount(cachedBankAccount === "true");
      setLoading((prev) => ({ ...prev, bankAccount: false }));
    }

    // Fetch fresh data
    fetchBalance();
    fetchBankAccount();

    // Set up network event listeners
    const handleOnline = () => {
      if (errors.balance || errors.bankAccount) {
        fetchBalance();
        fetchBankAccount();
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [fetchBalance, fetchBankAccount]);

  // Handle bank account redirect - only redirect if we're sure there's no account
  useEffect(() => {
    if (
      hasBankAccount === false &&
      !loading.bankAccount &&
      !errors.bankAccount
    ) {
      console.log("No bank account found, redirecting to create account");
      navigate("/create-account");
    }
  }, [hasBankAccount, loading.bankAccount, errors.bankAccount, navigate]);

  const handleWithdrawSuccess = useCallback(() => {
    fetchBalance();
  }, [fetchBalance]);

  const isLoading = loading.balance || loading.bankAccount;
  const hasErrors = errors.balance || errors.bankAccount;

  return (
    <>
      {/* Mobile header */}
      <Header />

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {isLoading ? (
          <div className="space-y-8">
            <div className="bg-gray-200 animate-pulse rounded-xl h-32"></div>
            <div className="space-y-4">
              <div className="h-6 w-1/4 bg-gray-200 animate-pulse rounded"></div>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 animate-pulse rounded"
                ></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Error banners that don't block the UI */}
            {errors.balance && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                <p className="text-yellow-700">
                  Balance data might be outdated: {errors.balance}
                </p>
                <button
                  onClick={fetchBalance}
                  className="mt-2 text-sm text-yellow-600 font-medium"
                >
                  Retry
                </button>
              </div>
            )}

            {errors.bankAccount && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                <p className="text-yellow-700">
                  Bank account verification failed: {errors.bankAccount}
                </p>
                <button
                  onClick={fetchBankAccount}
                  className="mt-2 text-sm text-yellow-600 font-medium"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Main content */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-medium">Available Balance</h2>
                  <p className="text-3xl font-bold mt-2">
                    ₦{balance.toLocaleString("en-NG")}
                  </p>
                  {errors.balance && (
                    <p className="text-xs text-purple-200 mt-1">
                      Showing cached data
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (hasBankAccount) {
                      setShowWithdrawModal(true);
                    } else if (hasBankAccount === false) {
                      navigate("/create-account");
                    }
                  }}
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-gray-100 transition"
                  disabled={balance < 1000}
                >
                  {hasBankAccount === false ? "Add Bank Account" : "Withdraw"}
                </button>
              </div>
              {balance < 1000 && (
                <p className="text-sm text-purple-200 mt-3">
                  Minimum withdrawal amount is ₦1,000
                </p>
              )}
              {hasBankAccount === false && (
                <p className="text-sm text-purple-200 mt-3">
                  Please add a bank account to withdraw
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
