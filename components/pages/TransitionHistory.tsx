'use client'

import { useEffect, useState } from "react";
import { getTransactionHistory } from "@/app/actions/getTransactionHistory";
import { useAuth } from "@/context/AuthContext";
import Loading from "./Loading";


interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function TransitionHistory() {
  const user  = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!user?.id) return;
      
      setIsLoading(true);
      const result = await getTransactionHistory(user.id);
      
      if (result.success && result.data) {
        setTransactions(result.data);
      }
      setIsLoading(false);
    }

    fetchHistory();
  }, [user?.id]); 

  if (isLoading) {
    <Loading/>
  }
  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <div className="text-center p-4 text-gray-500">No transactions found.</div>
      ) : (
        transactions.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md"
          >
            <div>
              <div className="text-gray-600 text-sm">
                {new Date(item.created_at).toLocaleDateString()}
              </div>
              <div className="font-semibold text-lg capitalize">
                {item.type === "transfer" ? "Points Sent" : "Points Received"}
              </div>
              <div className="text-gray-400 text-xs italic">
                Status: {item.status}
              </div>
            </div>

            <div
              className={`font-bold text-xl ${
                item.type === "receive" ? "text-green-600" : "text-red-600"
              }`}
            >
              {item.type === "receive" ? "+" : "-"}{item.amount} pts
            </div>
          </div>
        ))
      )}
    </div>
  );
}