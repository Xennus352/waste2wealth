import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { orderId, sellerId } = await req.json();
  const supabase = createClient();

  // 1️⃣ Get order
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  // 2️⃣ Check seller
  if (order.seller_id !== sellerId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  if (order.status !== "PENDING") {
    return NextResponse.json(
      { message: "Order already processed" },
      { status: 400 }
    );
  }

  // 3️⃣ Confirm order
  await supabase
    .from("orders")
    .update({
      status: "CONFIRMED",
      confirmed_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  // 4️⃣ Notify buyer
  await supabase.from("notifications").insert({
    user_id: order.buyer_id,
    title: "Order Confirmed ✅",
    message: "Your order has been confirmed by the seller.",
  });

  return NextResponse.json({ message: "Order confirmed" });
}
