'use server'
import { supabaseAdmin } from "@/lib/supabase/server-client";

export async function getTransactionHistory(userId: string) {
  if (!userId) return { success: false, data: [] };

  const { data, error } = await supabaseAdmin
    .from("transactions")
    .select(`
      id,
      amount,
      type,
      status,
      created_at
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false }); 
  if (error) {
    console.error("Error fetching transactions:", error.message);
    return { success: false, message: "Could not load transactions." };
  }

  return { success: true, data };
}