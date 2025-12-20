import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
    *,
    owner:profiles!inner(
      id,
      display_name,
      avatar_url
    )
  `
      )
      .order("updated_at", { ascending: false });
    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
