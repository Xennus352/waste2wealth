import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, quantity, buyerInfo, userId } = body;

    const supabase = createClient();

    // Get product with ownerId
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, price, quality, ownerId")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      console.error("Product fetch error:", productError);
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    if (product.quality < quantity) {
      return NextResponse.json(
        { message: "Not enough stock" },
        { status: 400 }
      );
    }

    const totalPrice = product.price * quantity;

    // Get buyer profile to check points
    const { data: buyer, error: buyerError } = await supabase
      .from("profiles")
      .select("points")
      .eq("id", userId)
      .single();

    if (buyerError || !buyer) {
      console.error("Buyer profile fetch error:", buyerError);
      return NextResponse.json(
        { message: "Failed to fetch buyer profile" },
        { status: 500 }
      );
    }

    if (buyer.points < totalPrice) {
      return NextResponse.json(
        { message: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Deduct buyer points
    const { error: updateBuyerError } = await supabase
      .from("profiles")
      .update({ points: buyer.points - totalPrice })
      .eq("id", userId);

    if (updateBuyerError) {
      console.error("Buyer profile update error:", updateBuyerError);
      return NextResponse.json(
        { message: "Failed to deduct buyer points", details: updateBuyerError },
        { status: 500 }
      );
    }

    // Log spend transaction
    const { error: txError } = await supabase.from("transactions").insert([
      {
        user_id: userId,
        type: "spend",
        amount: totalPrice,
        status: "completed",
      },
    ]);

    if (txError) {
      console.error("Transaction insert error:", txError);
      return NextResponse.json(
        { message: "Failed to log transaction", details: txError },
        { status: 500 }
      );
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          seller_id: product.ownerId,
          product_id: productId,
          quantity,
          total_price: totalPrice,
          buyerName: buyerInfo.name,
          buyerEmail: buyerInfo.email,
          buyerPhone: buyerInfo.phone,
          buyerAddress: buyerInfo.address,
          status: "pending", // start as pending
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order insert error:", orderError);
      return NextResponse.json(
        { message: "Failed to create order", details: orderError },
        { status: 500 }
      );
    }

    // Notify seller
    await supabase.from("notifications").insert({
      user_id: product.ownerId,
      title: "New Order 📦",
      message: `Buyer: ${buyerInfo.name}\nQuantity: ${quantity}\nTotal: ${totalPrice}`,
    });

    // Update product stock
    if (product.quality - quantity <= 0) {
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);
      if (deleteError) {
        console.error("Product delete error:", deleteError);
        return NextResponse.json(
          { message: "Failed to delete product", details: deleteError },
          { status: 500 }
        );
      }
    } else {
      const { error: updateError } = await supabase
        .from("products")
        .update({ quality: product.quality - quantity })
        .eq("id", productId);
      if (updateError) {
        console.error("Product update error:", updateError);
        return NextResponse.json(
          { message: "Failed to update product stock", details: updateError },
          { status: 500 }
        );
      }
    }

    //  DO NOT reward seller here! Only reward after confirmation.

    return NextResponse.json(
      { message: "Order successful", orderId: order.id },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { message: err.message || "Order failed" },
      { status: 500 }
    );
  }
}
