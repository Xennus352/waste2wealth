import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { action } = await req.json();
    const orderId = req.url.split("/").pop();
    if (!orderId)
      return NextResponse.json({ message: "Missing orderId" }, { status: 400 });

    const supabase = createClient();

    // Fetch the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order)
      return NextResponse.json({ message: "Order not found" }, { status: 404 });

    if (action === "confirmed") {
      // Confirm order
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
        .eq("id", orderId);

      if (updateError)
        return NextResponse.json(
          { message: "Failed to confirm order", details: updateError },
          { status: 500 }
        );

      // Reward seller points
      if (order.seller_id) {
        const { data: seller, error: sellerError } = await supabase
          .from("profiles")
          .select("points")
          .eq("id", order.seller_id)
          .single();

        if (sellerError) console.error("Seller fetch error:", sellerError);

        if (seller) {
          const { error: sellerUpdateError } = await supabase
            .from("profiles")
            .update({ points: (seller.points || 0) + order.total_price })
            .eq("id", order.seller_id);

          if (sellerUpdateError)
            console.error("Seller points update error:", sellerUpdateError);

          // Log seller transaction
          const { error: sellerTxError } = await supabase
            .from("transactions")
            .insert({
              user_id: order.seller_id,
              type: "income",
              amount: order.total_price,
              status: "completed",
            });
          if (sellerTxError)
            console.error("Seller transaction error:", sellerTxError);
        }
      }

      // Notify buyer
      await supabase.from("notifications").insert({
        user_id: order.user_id,
        title: "Order Confirmed ✅",
        message: `Your order ${order.id} has been confirmed by the seller.`,
      });

      return NextResponse.json({
        message: "Order confirmed and seller rewarded",
      });
    }

    if (action === "canceled") {
      // Cancel order
      const { error: cancelError } = await supabase
        .from("orders")
        .update({ status: "canceled" })
        .eq("id", orderId);

      if (cancelError)
        return NextResponse.json(
          { message: "Failed to cancel order", details: cancelError },
          { status: 500 }
        );

      // Refund buyer points
      if (order.user_id) {
        const { data: buyer, error: buyerError } = await supabase
          .from("profiles")
          .select("points")
          .eq("id", order.user_id)
          .single();

        if (!buyerError && buyer) {
          const { error: refundError } = await supabase
            .from("profiles")
            .update({ points: buyer.points + order.total_price })
            .eq("id", order.user_id);
          if (refundError) console.error("Buyer refund error:", refundError);

          // Log refund transaction
          const { error: txError } = await supabase
            .from("transactions")
            .insert({
              user_id: order.user_id,
              type: "refund",
              amount: order.total_price,
              status: "completed",
            });
          if (txError) console.error("Refund transaction error:", txError);
        }
      }

      // Notify buyer
      await supabase.from("notifications").insert({
        user_id: order.user_id,
        title: "Order Canceled ❌",
        message: `Your order ${order.id} has been canceled.`,
      });

      // Notify seller
      await supabase.from("notifications").insert({
        user_id: order.seller_id,
        title: "Order Canceled ❌",
        message: `Order ${order.id} has been canceled by the buyer.`,
      });

      return NextResponse.json({
        message: "Order canceled and points refunded",
      });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
