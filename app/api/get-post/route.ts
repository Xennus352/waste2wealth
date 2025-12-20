import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server-client";

export async function GET(req: NextRequest) {
  try {
    // Fetch posts with profile info and counts
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select(
        `
        *,
        profiles:profiles!inner(
          id,
          display_name,
          avatar_url
        ),
        likes!left(id,user_id),
        comments!left(id,user_id),
        shares!left(id,user_id)
      `
      )
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map posts to include counts instead of arrays
    const postsWithCounts = data?.map((post: any) => ({
      ...post,
      likes_count: post.likes?.length || 0,
      comments_count: post.comments?.length || 0,
      shares_count: post.shares?.length || 0,
      likes: post.likes || [],
      comments: post.comments || [],
      shares: post.shares || [],
    }));

    return NextResponse.json(postsWithCounts, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
