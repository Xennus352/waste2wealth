import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function GET(
  req: Request,
  context: { params: Promise<{ postId: string }> } // params is a Promise
) {
  // Await the params before accessing
  const { postId } = await context.params;

  console.log("Fetched postId:", postId);

  if (!postId) {
    return NextResponse.json({ error: "PostId is required" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        id,
        content,
        created_at,
        user_id,
        profiles (
          id,
          display_name,
          avatar_url
        )
      `
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
