import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) return NextResponse.json({ message: "Missing userId" }, { status: 400 });

    const supabase = createClient();

    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Notifications fetch error:", error);
      return NextResponse.json({ message: "Failed to fetch notifications", details: error }, { status: 500 });
    }

    return NextResponse.json({ notifications });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ message: err.message || "Internal Server Error" }, { status: 500 });
  }
}
