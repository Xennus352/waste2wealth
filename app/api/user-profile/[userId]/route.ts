import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> } // params is a Promise!
) {
  const { userId } = await context.params; 

  if (!userId) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("display_name, phone, avatar_url")
    .eq("id", userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
