"use client";

import { useEffect, useState } from "react";
import OrderLists from "./OrderLists";

export default function MyOrders({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch(`/api/get-orders?userId=${userId}`);
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    }

    fetchOrders();
  }, [userId]);

  if (orders.length === 0)
    return <p className="text-center py-6">No orders yet</p>;
  console.log(orders);
  return (
    <div className="space-y-4">
      <OrderLists userId={userId} />
    </div>
  );
}
