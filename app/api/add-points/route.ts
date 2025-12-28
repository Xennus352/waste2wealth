import { supabaseAdmin } from "@/lib/supabase/server-client";
//TODO: NEED TO CHECK WHETHER THAT IS WORKING OR NOT
export async function POST(req: Request) {
  try {
    const { userId, amount } = await req.json();
    if (!userId || !amount) {
      return new Response(JSON.stringify({ message: "Missing parameters" }), {
        status: 400,
      });
    }

    // Insert transaction
    const { data: transaction, error: insertError } = await supabaseAdmin
      .from("transactions")
      .insert({
        user_id: userId,
        type: "add",
        amount,
        status: "completed",
      })
      .select()
      .single();
    if (insertError) throw insertError;

    // Increment points via RPC
    const { error: updateError } = await supabaseAdmin.rpc("increment_points", {
      user_id: userId,
      inc: amount,
    });
    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ message: "Points added successfully", transaction }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in /api/add-points:", error.message);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
