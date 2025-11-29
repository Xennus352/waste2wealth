import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function POST(req: NextRequest) {
  const { post_id, user_id } = await req.json();

  try {
    // Insert like (will fail if duplicate due to unique constraint)
    const { error } = await supabase.from("likes").insert({ post_id, user_id });

    if (error) {
      // If duplicate, treat as "already liked"
      if (error.code === "23505") return NextResponse.json({ success: true });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
