import { useEffect, useState } from "react";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

const WalletTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionsurl =
          "https://toplike.up.railway.app/api/wallet/transactions";
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
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold">Recent Transactions</h2>
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16 ml-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold">Recent Transactions</h2>
      </div>

      {transactions.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No transactions yet</div>
      ) : (
        <div className="divide-y divide-gray-200">
          {transactions.slice(0, 5).map((txn) => (
            <div key={txn.id} className="p-4 flex items-center">
              <div
                className={`p-3 rounded-full mr-4 ${
                  txn.amount > 0
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {txn.amount > 0 ? <FiArrowDown /> : <FiArrowUp />}
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {txn.amount > 0 ? "Credit" : "Debit"}
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  {txn.type} • {new Date(txn.date).toLocaleDateString()}
                </p>
              </div>
              <div
                className={`font-medium ${
                  txn.amount > 0 ? "text-green-600" : "text-red-600"
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
