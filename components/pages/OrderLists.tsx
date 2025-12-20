"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Notifications from "./Notifications";
import { createClient } from "@/lib/supabase/client";

interface Order {
  id: string;
  product_id: string;
  product: { title: string; description: string; photo?: string };
  seller_id: string;
  seller: { display_name: string };
  user_id: string;
  buyerName: string;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
}

interface OrdersProps {
  userId: string;
}

const OrderLists: React.FC<OrdersProps> = ({ userId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const supabase = createClient();
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`/api/get-orders?userId=${userId}`);
      setOrders(data.orders || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to fetch orders");
    }
  };

  const handleAction = async (
    orderId: string,
    action: "confirmed" | "canceled"
  ) => {
    try {
      const { data } = await axios.post(`/api/order-confirm/${orderId}`, {
        action,
      });
      toast.success(data.message);
      // Update order locally instead of re-fetching all
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: action === "confirmed" ? "confirmed" : "canceled",
              }
            : order
        )
      );
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  useEffect(() => {
    fetchOrders();

    // Realtime subscription
    const orderChannel = supabase
      .channel(`orders-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setOrders((prev) =>
            prev.map((order) =>
              order.id === payload.new.id ? { ...order, ...payload.new } : order
            )
          );
          toast.success(`Order ${payload.new.status} ✅`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
    };
  }, [userId]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Orders</h2>
        <Notifications userId={userId} />
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col"
          >
            <img
              src={order.product.photo || "/placeholder.png"}
              alt={order.product.title}
              className="w-full h-48 object-cover rounded-lg mb-2"
            />
            <h3 className="font-bold text-lg">{order.product.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-3">
              {order.product.description}
            </p>

            <div className="mt-2 flex justify-between items-center">
              <p className="text-sm">Qty: {order.quantity}</p>
              <p className="text-sm font-semibold">
                Total: {order.total_price}
              </p>
            </div>

            <p className="mt-2 text-sm">
              Status:{" "}
              <span
                className={
                  order.status === "pending"
                    ? "text-yellow-600"
                    : order.status === "confirmed"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {order.status}
              </span>
            </p>

            {/* Seller actions */}
            {order.status === "pending" && order.user_id !== userId && (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleAction(order.id, "confirmed")}
                  className="flex-1 bg-green-500 text-white rounded-lg py-1 hover:bg-green-600"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleAction(order.id, "canceled")}
                  className="flex-1 bg-red-500 text-white rounded-lg py-1 hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Buyer cancel */}
            {order.status === "pending" && order.user_id === userId && (
              <button
                onClick={() => handleAction(order.id, "canceled")}
                className="mt-2 w-full bg-red-500 text-white rounded-lg py-1 hover:bg-red-600"
              >
                Cancel Order
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderLists;
