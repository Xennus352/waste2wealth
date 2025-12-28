"use client";
import { useAuth } from "@/context/AuthContext";
import { Coins } from "lucide-react";
import { useState } from "react";

export default function TransferPoints() {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const user = useAuth();

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-green-200  text-center py-8 rounded-xl shadow-lg text-2xl font-bold flex items-center justify-center gap-3 space-x-3">
        Total Balance
        <span className="flex items-center justify-center gap-3 space-x-3 text-yellow-400">
          {user?.points} <Coins />
        </span>
      </div>

      {/* Transfer Form */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <input
          type="text"
          placeholder="Enter User ID (e.g., 12345)"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button className="w-full py-3 bg-green-800 text-white font-bold rounded-lg hover:bg-green-700 transition">
          Transfer
        </button>
      </div>
    </div>
  );
}
