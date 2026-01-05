'use server'
import { supabaseAdmin } from "@/lib/supabase/server-client";

interface TransferPayload {
  senderId: string;
  receiverId: string;
  amount: number;
}

export async function transferPoints({ senderId, receiverId, amount }: TransferPayload) {
  if (!receiverId || amount <= 0 || senderId === receiverId) {
    return { success: false, message: "❌ Invalid input." };
  }

  try {
    //Get current balances
    const { data: sender } = await supabaseAdmin.from("profiles").select("points").eq("id", senderId).single();
    const { data: receiver } = await supabaseAdmin.from("profiles").select("points").eq("id", receiverId).single();

    if (!sender || !receiver) throw new Error("User accounts not found.");
    if (sender.points < amount) throw new Error("Insufficient balance.");

    // Perform updates
    await supabaseAdmin.from("profiles").update({ points: sender.points - amount }).eq("id", senderId);
    await supabaseAdmin.from("profiles").update({ points: receiver.points + amount }).eq("id", receiverId);

    // THE TRANSACTION INSERT (The part that is failing)
    const transactionData = [
      {
        user_id: senderId,
        type: "transfer",
        amount: amount,
        status: "success",
        created_at: new Date().toISOString()
      },
      {
        user_id: receiverId,
        type: "receive",
        amount: amount,
        status: "success",
        created_at: new Date().toISOString()
      }
    ];

    const { error: transError } = await supabaseAdmin
      .from("transactions")
      .insert(transactionData);

    if (transError) {
      //  PRINT THE EXACT REASON IN  TERMINAL
      // console.error("CRITICAL DATABASE ERROR:", {
      //   message: transError.message,
      //   details: transError.details,
      //   hint: transError.hint,
      //   code: transError.code
      // });
      throw new Error(`Table Insert Failed: ${transError.message}`);
    }

    return { success: true, message: "Transfer complete." };

  } catch (err: any) {
    console.error("Transfer failed:", err.message);
    return { success: false, message: err.message };
  }
}