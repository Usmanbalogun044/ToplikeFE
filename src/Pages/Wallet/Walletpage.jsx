import { useState, useEffect } from "react";
import Withdrawmodal from "./Withdrawmodal";
import WalletTransactions from "./WalletTransaction";
import Sidebar from "../../Components/Sharedd/Sidebar";
import Bottomnav from "../../Components/Sharedd/Bottomnav";

const Walletpage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("https://toplike.up.railway.app/api/wallet", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

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

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleWithdrawSuccess = () => {
    fetchBalance();
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      {/* Sidebar - Always visible */}
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      {/* Main Content - Loading state only here */}
      <div
        className={`flex-1 pb-16 md:pb-0 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
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
                    onClick={() => setShowWithdrawModal(true)}
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
      </div>

      {/* Bottom Navigation - Always visible */}
      <Bottomnav />
    </div>
  );
};

export default Walletpage;
