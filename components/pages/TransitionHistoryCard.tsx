'use client'
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Card } from "../ui/card";

type ItemProp = {
  item: {
    id: string;
    type: string;
    amount: number;
    status: string;
    created_at: string;
  };
};

const TransitionHistoryCard = ({ item }: ItemProp) => {

  const transitionDate = new Date(item.created_at);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: 'medium',
  timeStyle: 'short'
  }).format(transitionDate);


  return (
    <Card>
    <div className=" grid grid-cols-3 ">
      <div className=" flex items-center justify-center">
        {item.type === "transfer" ? (
          <div className="bg-eco-accent/20 p-4 rounded-xl ">
           
            <ArrowUpRight color="#EF9C06"/>{" "}
          </div>
        ) : (
          <div className="bg-eco-primaryLight/20 p-4 rounded-xl ">
           
            <ArrowDownLeft color="#00AE50" />
          </div>
        )}
      </div>
      <div className=" flex flex-col items-start justify-center gap-1">
        <p
          className={` text-xs text-center font-bold ${
            item.type === "transfer"
              ? "text-yellow-500 bg-yellow-200 rounded-xl p-1"
              : "text-eco-primary bg-eco-primarySoft rounded-xl p-1"
          }`}
        >
          {item.type === "transfer" ? "Transferred" : "Points Received"}
        </p>
        {/* <p className=' text-gray-500 text-sm'>to </p> */}
        <p>{formattedDate}</p>
      </div>
      <div className="flex flex-col items-center justify-end gap-2 ">
        <p
          className={` font-bold text-3xl ${
            item.type === "transfer" ? "text-yellow-500" : "text-green-500"
          }`}
        >
          {item.type === "transfer" ? "-" : "+"} {item.amount.toLocaleString()}
        </p>
        <p className="text-sm text-eco-primaryLight">points</p>
      </div>
    </div></Card>
  );
};

export default TransitionHistoryCard;
