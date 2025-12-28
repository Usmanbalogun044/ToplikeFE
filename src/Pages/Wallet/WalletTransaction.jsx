import { useEffect, useState } from "react";
import { FiArrowUp, FiArrowDown, FiActivity } from "react-icons/fi";
import { API_URL } from "../../config";

const WalletTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionsurl =
          `${API_URL}/wallet/transactions`;
        const options = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        };
        const res = await fetch(transactionsurl, options);
        const data = await res.json();
        setTransactions(data.transactions || []);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-6">Recent Transactions</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center animate-pulse">
              <div className="w-10 h-10 bg-white/10 rounded-full mr-4"></div>
              <div className="flex-1">
                <div className="h-4 bg-white/10 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-white/5 rounded w-1/4"></div>
              </div>
              <div className="h-4 bg-white/10 rounded w-16 ml-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden animate-fade-in-up delay-100">
      <div className="p-6 border-b border-white/5 flex items-center gap-2">
        <FiActivity className="text-fuchsia-400" />
        <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
      </div>

      {transactions.length === 0 ? (
        <div className="p-12 text-center text-purple-300/40">
           <p>No transaction history found.</p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {transactions.slice(0, 5).map((txn) => (
            <div key={txn.id} className="p-4 flex items-center hover:bg-white/5 transition-colors">
              <div
                className={`p-3 rounded-xl mr-4 ${
                  txn.amount > 0
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {txn.amount > 0 ? <FiArrowDown /> : <FiArrowUp />}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">
                  {txn.amount > 0 ? "Credit" : "Debit"}
                </p>
                <p className="text-xs text-purple-300/50 capitalize mt-1">
                  {txn.type} • {new Date(txn.date).toLocaleDateString()}
                </p>
              </div>
              <div
                className={`font-bold ${
                  txn.amount > 0 ? "text-green-400" : "text-white"
                }`}
              >
                {txn.amount > 0 ? "+" : ""}₦
                {Math.abs(txn.amount).toLocaleString("en-NG")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WalletTransaction;
