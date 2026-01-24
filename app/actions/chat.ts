"use server";

import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function chatAssistant(formData: FormData, chatHistory: any[]) {
  const message = formData.get("message") as string;
  const imageBase64 = formData.get("image") as string | null;
  const userId = formData.get("userId") as string;

  const supabase = await createClient();

  const formattedHistory = chatHistory.slice(-5).map((msg) => ({
    role: (msg.sender === "user" ? "user" : "assistant") as
      | "user"
      | "assistant",
    content: msg.text || "",
  }));

  const currentMessageContent: any[] = [{ type: "text", text: message }];

  if (imageBase64) {
    currentMessageContent.push({
      type: "image_url",
      image_url: { url: imageBase64 },
    });
  }

  let aiResponse = "";

  //Wrap the API call to prevent 500 Server Crashes
  try {
    const response = await openai.chat.completions.create({
      model: //"mistralai/mistral-7b-instruct:free", 
      "meta-llama/llama-3.2-11b-vision-instruct:free", // "google/learnlm-1.5-pro-experimental:free", //"google/gemini-2.0-flash-exp:free",
      messages: [
        {
          role: "system",
          content: `You are Eco Admin AI. Always respond in JSON. Actions: chat, create_post, show_products, buy_points. For buy_points: Always ask for amount and screenshot. For create_post: Tags must be paper, plastic, wood, metal, glass, tire, or other.`,
        },
        ...formattedHistory,
        {
          role: "user",
          content: currentMessageContent as any,
        },
      ],
      response_format: { type: "json_object" },
    });
    aiResponse = response.choices[0].message.content || "";
  } catch (error: any) {
    console.error("AI Provider Error:", error);
    // Return a safe fallback JSON if the free tier is busy (Error 429)
    return {
      text: JSON.stringify({
        action: "chat",
        response:
          "The AI service is currently busy. Please wait a few seconds and try again! ♻️",
      }),
    };
  }

  let parsed: any;
  try {
    parsed = JSON.parse(aiResponse);
  } catch {
    return { text: aiResponse };
  }

  // =========================
  // CREATE POST
  // =========================
  if (parsed.action === "create_post" && imageBase64) {
    // const buffer = Buffer.from(imageBase64.split(",")[1], "base64");
    // const filePath = `posts/${userId}_${Date.now()}.png`;
    // const { data: upload, error: uploadError } = await supabase.storage
    //   .from("post-images")
    //   .upload(filePath, buffer, { contentType: "image/png" });
    // if (uploadError) throw uploadError;
    // const imageUrl = supabase.storage
    //   .from("post-images")
    //   .getPublicUrl(upload.path).data.publicUrl;
    // await supabase.from("posts").insert({
    //   user_id: userId,
    //   description: parsed.data?.description || "",
    //   tags: parsed.data?.tags || [],
    //   image_url: imageUrl,
    // });
    // return { text: "✅ Your eco post has been published successfully!" };

    return {
      text: `
      ✨ Create a Post — Premium Experience

🏠 Go to the **Homepage**  
⬆️ At the top, open the **Post Section**

📸 Upload your photo  
✍️ Add a short description  
🚀 Share instantly with the community  

🌿 Designed for a smooth and elegant posting experience  
Enjoy creating and sharing beautiful moments
 `,
    };
  }

  // =========================
  // SHOW PRODUCTS
  // =========================
  if (parsed.action === "show_products") {
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    return {
      text: "🛒 Here are the available products:",
      products,
    };
  }

  // =========================
  // BUY POINTS
  // =========================
  if (parsed.action === "buy_points") {
    // const declaredAmount = Number(parsed.amount);
    // if (!declaredAmount || declaredAmount <= 0)
    //   return {
    //     text: "💳 Please enter the amount and upload the payment screenshot.",
    //   };
    // if (!imageBase64)
    //   return { text: "❌ Please provide a payment screenshot." };
    // const verifiedAmount = Number(parsed.verifiedAmount || 0);
    // if (verifiedAmount !== declaredAmount) {
    //   return { text: "❌ Screenshot amount mismatch!" };
    // }
    // const { data: profile } = await supabase
    //   .from("profiles")
    //   .select("points")
    //   .eq("id", userId)
    //   .single();
    // await supabase
    //   .from("profiles")
    //   .update({ points: (profile?.points || 0) + declaredAmount })
    //   .eq("id", userId);
    // await supabase.from("transactions").insert({
    //   user_id: userId,
    //   type: "add",
    //   amount: declaredAmount,
    //   status: "approved",
    // });
    // return { text: `✅ Payment approved! ${declaredAmount} points added.` };
    return {
      text: `💳 Buy Points – Admin Information

Please contact one of our admins to complete your payment:

👤 Soe Moe Kyaw  
📧 capeloise324@gmail.com  
📞 09672712095  

👤 May Myat Thu  
📧 maymyatt385@gmail.com  
📞 09963088539  

👤 Aung Phyo Kyaw  
📧 aphyokyaw001@gmail.com  
📞 09678166383


👤 Kyi Sin Thant  
📧 kyisin000@gmail.com 
📞 09696504692  


After payment:
• Enter the amount you paid  
• Upload the payment screenshot  

✅ Your points will be added after verification  
Thank you for choosing us 💚
`,
    };
  }

  return {
    text: parsed.response || parsed.message || parsed.text || aiResponse,
  };
}
