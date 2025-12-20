import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/client";

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();
  const { userId, title, description, price, stock, tags, images } = body;

  if (
    !userId ||
    !title ||
    !description ||
    price === undefined ||
    stock === undefined
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    let uploadedUrls: string[] = [];

    // Upload images to Supabase storage
    if (images && images.length > 0) {
      for (const image of images) {
        const buffer = Buffer.from(image.fileData, "base64");
        const fileName = `${userId}-${Date.now()}-${Math.floor(
          Math.random() * 1000
        )}-${image.fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, buffer, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);
        uploadedUrls.push(data.publicUrl);
      }
    }

    // Insert into products table
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          ownerId: userId,
          title,
          description,
          price,
          quality: stock, // your 'stock' is stored in 'quality'
          photo: uploadedUrls.length > 0 ? uploadedUrls[0] : null, // store first image as 'photo'
          tags,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ message: "Product created", product: data[0] });
  } catch (err: any) {
    console.error("CREATE PRODUCT ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
