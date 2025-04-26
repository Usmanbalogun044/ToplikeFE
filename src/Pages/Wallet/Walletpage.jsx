import { useState, useEffect } from "react";
import { FiDollarSign, FiPlus } from "react-icons/fi";
import Withdrawmodal from "./Withdrawmodal";
import WalletTransactions from "./WalletTransaction";
import Sidebar from "../../Components/Sharedd/Sidebar";
import Bottomnav from "../../Components/Sharedd/Bottomnav";

const Walletpage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [walletData, setWalletData] = useState({
    balance: 0,
    loading: true,
    error: null,
  });

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    const fetchWalletData = async () => {
      const walleturl = "https://toplike.up.railway.app/api/wallet";
      const options = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      try {
        setWalletData((prev) => ({ ...prev, loading: true, error: null }));

        const balanceRes = await fetch(walleturl, options);

        if (!balanceRes.ok) {
          throw new Error("Failed to fetch wallet balance");
        }

        const balanceData = await balanceRes.json();

        setWalletData({
          balance: parseFloat(balanceData.wallet) || 0,
          loading: false,
          error: null,
        });
      } catch (error) {
        setWalletData({
          balance: 0,
          loading: false,
          error: error.message,
        });
      }
    };

    fetchWalletData();
  }, []);

  const handleWithdraw = async (amount, bankDetails) => {
    // Validate amount and bank details
    const withdrawurl = "https://toplike.up.railway.app/api/withdraw";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        amount,
        bank_code: bankDetails.bankCode,
        account_number: bankDetails.accountNumber,
      }),
    };
    const walleturl = "https://toplike.up.railway.app/api/wallet";

    try {
      const response = await fetch(withdrawurl, options);

      if (!response.ok) {
        throw new Error("Withdrawal failed");
      }

      const newBalanceRes = await fetch(walleturl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const newBalance = await newBalanceRes.json();

      setWalletData((prev) => ({
        ...prev,
        balance: parseFloat(newBalance.wallet) || 0,
        transactions: [
          {
            id: Date.now(),
            amount: -amount,
            type: "withdrawal",
            status: "pending",
            date: new Date().toISOString(),
          },
          ...prev.transactions,
        ],
      }));

      setShowWithdrawModal(false);
    } catch (error) {
      alert(`Withdrawal error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      {/* Sidebar */}
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 pb-16 md:pb-0 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          {walletData.loading ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : walletData.error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
              <p className="text-red-700">{walletData.error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-600 font-medium"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Wallet Balance */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white mb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-medium">Available Balance</h2>
                    <p className="text-3xl font-bold mt-2">
                      ₦{walletData.balance.toLocaleString("en-NG")}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-gray-100 transition"
                    disabled={walletData.balance < 1000}
                  >
                    Withdraw
                  </button>
                </div>
                {walletData.balance < 1000 && (
                  <p className="text-sm text-purple-200 mt-3">
                    Minimum withdrawal amount is ₦1,000
                  </p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button className="bg-white border border-purple-600 text-purple-600 p-4 rounded-lg flex items-center justify-center cursor-pointer hover:bg-purple-50 transition">
                  <FiPlus className="mr-2" />
                  Add Money
                </button>
                <button className="bg-white border border-gray-300 p-4 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                  <FiDollarSign className="mr-2" />
                  Transaction History
                </button>
              </div>

              {/* Transactions */}
              <WalletTransactions />

              {/* Withdraw Modal */}
              {showWithdrawModal && (
                <Withdrawmodal
                  currentBalance={walletData.balance}
                  onWithdraw={handleWithdraw}
                  onClose={() => setShowWithdrawModal(false)}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <Bottomnav />
    </div>
  );
};

export default Walletpage;
