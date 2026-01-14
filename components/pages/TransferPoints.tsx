"use client";
import { useAuth } from "@/context/AuthContext";
import {
  AlertCircle,
  CheckCircle2,
  CircleUserRound,
  Coins,
  Loader,
  Send,
  X,
} from "lucide-react";
import { useState } from "react";
import { transferPoints } from "@/app/actions/transfer";
import { Card } from "../ui/card";

export default function TransferPoints() {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useAuth();

  const handleTransfer = async () => {
    if (!userId || !amount) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      const res = await transferPoints({
        senderId: user?.id!,
        receiverId: userId,
        amount: Number(amount),
      });

      // Formatting the message if successful to show the 999,999 style
      if (res.success) {
        const formattedAmount = Number(amount).toLocaleString();
        setMessage(
          `Successfully transferred ${formattedAmount} points to ${userId}!`
        );
        setUserId("");
        setAmount("");
      } else {
        setMessage(`⚠️ ${res.message}`);
      }
    } catch (err) {
      setMessage("⚠️ Connection error. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  // user points
  const userPoints = user?.points || 0;

  return (
    <Card className="p-6 bg-eco-primarySoft shadow-md">
      <p className="text-3xl font-bold text-white">Send Points</p>
      <div className="space-y-6">
        {/* Transfer Form */}
        <div className="  space-y-4">
          <p>Recipient User ID</p>
          <div className="relative w-full">
            {/* The Icon */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <CircleUserRound size={20} />
            </div>

            {/* The Input */}
            <input
              type="text"
              placeholder="Enter Receiver's User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <p>Amount to Transfer</p>

          <div className="relative w-full">
            {/* The Icon */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Coins size={20} />
            </div>

            {/* The Input */}
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <p className="text-md text-white font-bold">
            Available: {userPoints.toLocaleString()} points
          </p>

          <button
            onClick={handleTransfer}
            disabled={loading}
            className={`w-full py-3 bg-green-800 text-white font-bold rounded-lg hover:bg-green-700 transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className=" flex items-center justify-center gap-2">
                <Loader /> Processing...
              </div>
            ) : (
              <div className=" flex items-center justify-center gap-2">
                <Send /> Transfer
              </div>
            )}
          </button>

          {message && (
            <div
              className={`mt-4 p-4 rounded-xl flex items-start gap-3 border animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                message.includes("⚠️") ||
                message.toLowerCase().includes("wrong") ||
                message.toLowerCase().includes("error")
                  ? "bg-red-50 border-red-100 text-red-700"
                  : "bg-emerald-50 border-emerald-100 text-emerald-700"
              }`}
            >
              {/* Icon Logic */}
              <div className="mt-0.5">
                {message.includes("⚠️") ? (
                  <AlertCircle size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold leading-none">
                  {message.includes("⚠️")
                    ? "Transaction Failed"
                    : "System Notification"}
                </p>
                <p className="text-xs mt-1 opacity-90">{message}</p>
              </div>

              <button
                onClick={() => setMessage("")}
                className="text-current opacity-50 hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
