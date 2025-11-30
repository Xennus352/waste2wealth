import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function POST(req: NextRequest) {
  try {
    const { postId, userId, text } = await req.json();

    if (!postId || !userId || !text) {
      return NextResponse.json(
        { error: "postId, userId, and text are required" },
        { status: 400 }
      );
    }

    // Insert new comment
    const { data: comment, error: insertError } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_id: userId,
        content: text,
      })
      .select("*")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Fetch user profile to attach to the comment
    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .eq("id", userId)
      .single();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // Return the comment with user info
    return NextResponse.json({ ...comment, user });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
