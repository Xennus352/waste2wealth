"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import TransferPoints from "@/components/pages/TransferPoints";
import TransitionHistory from "@/components/pages/TransitionHistory";
import Assistance from "@/components/ai/Assistance";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeftRight, Coins, History,MessageCircleQuestion } from "lucide-react";

export default function PointsPage() {
  const user = useAuth();
  const tabs = ["transfer", "assistance", "history"];

  // ui controls fro tab labels 
const tabLabels: Record<string, React.ReactNode> = {
  transfer: (
    
    <div className="flex items-center justify-center gap-3">

      <ArrowLeftRight /> Transfer
    </div>
   
  ),
  history: (
    <div className="flex items-center justify-center gap-3">
      <History /> History
    </div>
  ),
  assistance: (
    <div className="flex items-center justify-center gap-3">
      <MessageCircleQuestion /> Assistance
    </div>
  ),
};

  const [active, setActive] = useState<string>(tabs[0]);
  const activeIndex = tabs.indexOf(active);
  const indicatorWidth = 100 / tabs.length;

  const userPoints = user?.points || 0;

  return (
    <div>
      <div className="w-full">
        {/* Balance Card */}
      <div className="bg-eco-primaryLight mb-2 text-center py-4 rounded-xl shadow-lg text-2xl font-bold flex  items-center justify-around gap-3">
       {/* balance  */}
       <div>
        <p className="text-gray-300">Current Balance</p>
       <p className=" text-white"> {userPoints.toLocaleString()}</p>
        
        </div>
       {/* coin icon  */}
       <div className=" bg-eco-primarySoft text-white rounded-full p-3"><Coins size={26}/></div>
      
      </div>

        <div className="relative">
          {/* Tabs container */}
          <div className="relative grid grid-cols-3 bg-eco-primarySoft rounded-xl p-1">
            {/* Animated sliding indicator (behind the buttons) */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 h-[calc(100%-8px)] bg-eco-primary rounded-lg shadow-md"
              style={{
                width: `${indicatorWidth}%`,
                left: `${activeIndex * indicatorWidth}%`,
              }}
              animate={{ left: `${activeIndex * indicatorWidth}%` }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 30,
              }}
            />

            {/* Tab buttons */}
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={
                  "relative z-10 py-2 px-3 text-sm font-medium rounded-md transition-all " +
                  (active === t
                    ? "text-white scale-105"
                    : "text-eco-textDark/90 hover:text-eco-textDark")
                }
                aria-pressed={active === t}
              >
                {tabLabels[t]}
              </button>
            ))}
          </div>

          {/* Tab contents */}
          <div className="mt-4">
            {active === "transfer" && <TransferPoints />}
            {active === "history" && <TransitionHistory />}
            {active === "assistance" && (
              <Assistance userId={user?.id as string} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
