import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId)
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });

    const supabase = createClient();

    // Fetch orders where user is buyer or seller
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .or(`user_id.eq.${userId},seller_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Orders fetch error:", ordersError);
      return NextResponse.json(
        { message: "Failed to fetch orders", details: ordersError },
        { status: 500 }
      );
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    //  Fetch related products
    const productIds = orders.map(o => o.product_id);
    const { data: products } = await supabase
      .from("products")
      .select("id, title, price, description , photo")
      .in("id", productIds);

    //  Fetch related sellers
    const sellerIds = orders.map(o => o.seller_id);
    const { data: sellers } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", sellerIds);

    //  Merge data
    const enrichedOrders = orders.map(order => ({
      ...order,
      product: products?.find(p => p.id === order.product_id) || null,
      seller: sellers?.find(s => s.id === order.seller_id) || null
    }));

    return NextResponse.json({ orders: enrichedOrders });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
