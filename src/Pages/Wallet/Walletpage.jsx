import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Withdrawmodal from "./Withdrawmodal";
import WalletTransactions from "./WalletTransaction";
import Header from "../../Components/Sharedd/Header";
import { FiCreditCard, FiArrowUpRight, FiDollarSign, FiPlus, FiAlertCircle } from "react-icons/fi";
import { API_URL } from "../../config";

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
    const url = `${API_URL}/wallet`;
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

      const response = await fetch(`${API_URL}/bankaccount`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.status === 404) {
        setHasBankAccount(false);
        sessionStorage.setItem("hasBankAccount", "false");
        setErrors((prev) => ({ ...prev, bankAccount: null }));
        return false;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const hasAccount = !!(data.bank_account || data.account || data.data);
      setHasBankAccount(hasAccount);
      sessionStorage.setItem("hasBankAccount", hasAccount.toString());
      setErrors((prev) => ({ ...prev, bankAccount: null }));
      return hasAccount;
    } catch (err) {
      if (err.message.includes("404")) {
        setHasBankAccount(false);
        sessionStorage.setItem("hasBankAccount", "false");
        setErrors((prev) => ({ ...prev, bankAccount: null }));
        return false;
      }

      setErrors((prev) => ({
        ...prev,
        bankAccount: err.message || "Network error",
      }));

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

  useEffect(() => {
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

    fetchBalance();
    fetchBankAccount();

    const handleOnline = () => {
      if (errors.balance || errors.bankAccount) {
        fetchBalance();
        fetchBankAccount();
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [fetchBalance, fetchBankAccount]);

  // Handle bank account redirect - only redirect if check is complete and explicitly false
  useEffect(() => {
      // Disabled auto-redirect to avoid bad UX if API is flaky. User should click "Add Bank Account" manually.
  }, []);

  const handleWithdrawSuccess = useCallback(() => {
    fetchBalance();
  }, [fetchBalance]);

  const isLoading = loading.balance || loading.bankAccount;

  return (
    <>
      <Header />

      <div className="max-w-4xl mx-auto p-4 md:p-6 pb-20">
        {isLoading && !balance ? (
          <div className="flex justify-center p-12">
             <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/10 border-t-fuchsia-500"></div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-6">My Wallet</h1>

            {/* Error banners */}
            {(errors.balance || errors.bankAccount) && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                <FiAlertCircle className="text-red-400 mt-0.5" />
                <div>
                  <p className="text-red-200 text-sm">
                    {errors.balance || errors.bankAccount}
                  </p>
                  <button
                    onClick={() => { fetchBalance(); fetchBankAccount(); }}
                    className="text-white text-xs bg-red-500/20 px-3 py-1 mt-2 rounded-lg hover:bg-red-500/30 transition"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            )}

            {/* Balance Card */}
            <div className="relative overflow-hidden rounded-3xl p-8 mb-8 animate-fade-in-up">
              {/* Background Gradients */}
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900 via-purple-900 to-black"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h2 className="text-purple-200/60 font-medium mb-1 uppercase tracking-wider text-xs">Available Balance</h2>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        ₦{balance.toLocaleString("en-NG")}
                        </span>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full md:w-auto">
                     <button
                        onClick={() => {
                            if (hasBankAccount) {
                            setShowWithdrawModal(true);
                            } else {
                            navigate("/create-account"); // Assuming this is the route for creating bank account
                            }
                        }}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                             balance < 1000 
                             ? "bg-white/5 text-white/20 cursor-not-allowed" 
                             : "bg-white text-fuchsia-900 hover:bg-fuchsia-50 shadow-lg shadow-white/10"
                        }`}
                        disabled={balance < 1000}
                    >
                        {hasBankAccount === false ? (
                             <><FiPlus /> Add Bank</>
                        ) : (
                             <><FiArrowUpRight /> Withdraw</>
                        )}
                    </button>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-6">
                     <div className="flex items-center gap-3">
                         <div className="p-2 rounded-lg bg-white/5 text-purple-200">
                             <FiCreditCard />
                         </div>
                         <div className="text-sm">
                             <p className="text-purple-200/50 text-xs uppercase">Status</p>
                             <p className="text-white font-medium">
                                 {hasBankAccount ? "Bank Linked" : "No Bank Added"}
                             </p>
                         </div>
                     </div>
                     {!hasBankAccount && (
                         <div className="flex items-center gap-2 text-yellow-300/80 text-xs bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                             <FiAlertCircle /> Action Required
                         </div>
                     )}
                     {balance < 1000 && (
                        <div className="flex items-center gap-2 text-purple-300/50 text-xs">
                             Min. withdrawal: ₦1,000
                        </div>
                     )}
                </div>
              </div>
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
