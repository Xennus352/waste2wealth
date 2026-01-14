'use client'

import { useEffect, useState } from "react";
import { getTransactionHistory } from "@/app/actions/getTransactionHistory";
import { useAuth } from "@/context/AuthContext";
import Loading from "./Loading";
import TransitionHistoryCard from "./TransitionHistoryCard";


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

          <TransitionHistoryCard item={item} key={item.id}/>
        
        ))
      )}
    </div>
  );
}