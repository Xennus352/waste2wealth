'use server'
import { supabaseAdmin } from "@/lib/supabase/server-client";

interface TransferPayload {
  senderId: string;
  receiverId: string;
  amount: number;
}

export async function transferPoints({
  senderId,
  receiverId,
  amount,
}: TransferPayload) {
  if (!receiverId || !amount || amount <= 0) {
    return { success: false, message: "❌ Invalid receiver or amount." };
  }

  //  Get sender balance
  const { data: sender, error: senderError } = await supabaseAdmin
    .from("profiles")
    .select("points")
    .eq("id", senderId)
    .single();

  if (senderError || !sender) {
    return { success: false, message: "❌ Sender not found." };
  }

  if (sender.points < amount) {
    return { success: false, message: "⚠️ Insufficient balance." };
  }

  //  Get receiver balance
  const { data: receiver, error: receiverError } = await supabaseAdmin
    .from("profiles")
    .select("points")
    .eq("id", receiverId)
    .single();

  if (receiverError || !receiver) {
    return { success: false, message: "❌ Receiver not found." };
  }

  try {
    //  Deduct sender points
    const { error: deductError } = await supabaseAdmin
      .from("profiles")
      .update({ points: sender.points - amount })
      .eq("id", senderId);

    if (deductError) throw deductError;

    //  Add receiver points
    const { error: addError } = await supabaseAdmin
      .from("profiles")
      .update({ points: receiver.points + amount })
      .eq("id", receiverId);

    if (addError) {
      // Rollback sender
      await supabaseAdmin
        .from("profiles")
        .update({ points: sender.points })
        .eq("id", senderId);
      throw addError;
    }

    //  Insert into transactions table
    await supabaseAdmin.from("transactions").insert([
      {
        user_id: senderId,
        type: "transfer",
        amount,
        status: "success",
        created_at: new Date().toISOString(),
      },
      {
        user_id: receiverId,
        type: "receive",
        amount,
        status: "success",
        created_at: new Date().toISOString(),
      },
    ]);

    return {
      success: true,
      message: `✅ Successfully sent ${amount} points to ${receiverId}.`,
    };
  } catch (err) {
    console.error("Transfer failed:", err);
    return { success: false, message: "⚠️ Failed to transfer points." };
  }
}
