import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function POST(req: NextRequest) {
  const { post_id, user_id } = await req.json();

  try {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", post_id)
      .eq("user_id", user_id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
