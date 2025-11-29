import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  try {
    const { userId, display_name, phone } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    const supabase = createClient();

    // Check if profile exists
    const { data: existingProfile, error: selectError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116 = no rows found, safe to insert
      console.error("Select profile error:", selectError);
      return NextResponse.json({ error: selectError.message }, { status: 500 });
    }

    if (!existingProfile) {
      const { error: insertError } = await supabase.from("profiles").insert({
        id: userId,
        display_name: display_name || "",
        phone: phone || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error("Insert profile error:", insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    // Always return JSON
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Unexpected API error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create profile" },
      { status: 500 }
    );
  }
}
