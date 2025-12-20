"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Coins } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  photo?: string;
  tags: string[];
  quality: number;
}

export default function ProductCard({
  id,
  title,
  description,
  price,
  photo,
  tags,
  quality,
}: ProductCardProps) {
  const [orderQty, setOrderQty] = useState(1);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const { points, id: userId } = useAuth() as { points: number; id: string };

  const increment = () => setOrderQty((prev) => Math.min(prev + 1, quality));
  const decrement = () => setOrderQty((prev) => Math.max(prev - 1, 1));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOrder = async () => {
    const totalPrice = price * orderQty;
    if (points < totalPrice) {
      toast.error("Insufficient balance!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/api/place-order", {
        productId: id,
        userId,
        quantity: orderQty,
        buyerInfo: formData,
      });
      console.log("Order created:", data);
      setLoading(false);
      setOpen(false);
      toast.success("Order placed successfully!");
    } catch (error: any) {
      console.error(
        "Error creating order:",
        error.response?.data?.message || error.message
      );
      setLoading(false);
      toast.error("Failed to place order.");
    }
  };

  const totalPrice = price * orderQty;
  const isInsufficient = points < totalPrice;

  return (
    <div className="relative group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform transition hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative h-56 w-full overflow-hidden rounded-t-3xl">
        {photo ? (
          <img
            src={photo}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-[#F1F8F2] text-[#1B5E20] font-semibold">
            No Image
          </div>
        )}

        {quality <= 5 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded">
            Low Stock
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="p-4 bg-white backdrop-blur-sm bg-opacity-80 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-[#1B5E20]">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-yellow-500  flex items-center gap-2">
            <Coins />
            {price.toFixed(2)} / item
          </span>
          <span className="text-eco-secondary text-sm font-medium">
            Stock: {quality}
          </span>
          <span className="text-sm text-gray-500">
            Total: {totalPrice.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full text-white font-semibold"
              style={{
                background: `linear-gradient(45deg, #66BB6A, #2E7D32)`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Order Section */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center border rounded-xl border-[#A5D6A7] overflow-hidden">
            <button
              type="button"
              onClick={decrement}
              className="px-3 py-1 bg-[#F1F8F2] hover:bg-[#E0F2E9] transition"
            >
              -
            </button>
            <span className="px-4 text-[#1B5E20] font-medium">{orderQty}</span>
            <button
              type="button"
              onClick={increment}
              disabled={orderQty >= quality}
              className={`px-3 py-1 transition ${
                orderQty >= quality
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#F1F8F2] hover:bg-[#E0F2E9]"
              }`}
            >
              +
            </button>
          </div>
          <Button
            variant="default"
            className="ml-auto"
            disabled={quality === 0 || isInsufficient}
            onClick={() => setOpen(true)}
          >
            {isInsufficient ? (
              <p className="text-red-600">Insufficient Balance</p>
            ) : (
              "Order"
            )}
          </Button>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg bg-eco-background">
          <DialogHeader>
            <DialogTitle>{title} - Order Form</DialogTitle>
            <DialogDescription>
              Fill in your information to complete the order.
            </DialogDescription>
          </DialogHeader>

          {/* Buyer Form */}
          <div className="flex flex-col gap-3 mt-4">
            <Input
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              placeholder="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              placeholder="Phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <textarea
              className="border rounded-md px-3 py-2 w-full resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />

            {/* Order Summary */}
            <div className="mt-2 p-2 border rounded-md bg-gray-50">
              <p>Total Quantity: {orderQty}</p>
              <p>Total Price: ${totalPrice.toFixed(2)}</p>
              {isInsufficient && (
                <p className="text-red-500 font-bold mt-1">
                  Insufficient Balance!
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleOrder} disabled={loading || isInsufficient}>
              {loading ? "Ordering..." : "Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
