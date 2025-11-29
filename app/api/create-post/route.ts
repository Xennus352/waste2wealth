import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/client";

export async function POST(req: NextRequest) {
  const supabase = createServerClient(); // server-side client
  const body = await req.json();
  const { userId, description, tags, images } = body;

  if (!userId || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const uploadedUrls: string[] = [];

    // Upload images one by one
    if (images && images.length > 0) {
      for (const image of images) {
        const buffer = Buffer.from(image.fileData, "base64");
        const fileName = `${userId}-${Date.now()}-${image.fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(fileName, buffer, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("post-images").getPublicUrl(fileName);
        uploadedUrls.push(data.publicUrl);
      }
    }

    // Insert post with image URLs
    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          user_id: userId,
          description,
          tags,
          image_url: uploadedUrls,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ message: "Post created", post: data[0] });
  } catch (err: any) {
    console.error("CREATE POST ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
