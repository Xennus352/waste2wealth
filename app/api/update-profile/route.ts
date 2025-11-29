import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId, display_name, phone, avatar_url, bio, email } =
      await req.json();
    if (!userId)
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });

    // Update profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        display_name,
        phone,
        avatar_url,
        bio,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
    if (profileError) throw profileError;

    // Update auth user
    const { data: authUser, error: authError } =
      await supabase.auth.admin.updateUserById(userId, {
        email, // optional
        phone, // top-level phone
        user_metadata: { display_name }, // custom fields
      });
    if (authError) throw authError;

    return NextResponse.json({ success: true, authUser });
  } catch (err) {
    console.error("Update profile error:", err);
    return NextResponse.json(
      { error: "Failed to update profile", details: err },
      { status: 500 }
    );
  }
}
