"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImagePlus,
  SendHorizontal,
  Camera,
  Sparkles,
  X,
  Bot,
  Zap,
  ShoppingBag,
} from "lucide-react";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";
import Linkify from "linkify-react";

type Message = {
  id: number;
  text?: string;
  image?: string;
  sender: "user" | "ai";
  model?: string;
  products?: any[];
};
declare global {
  interface Window {
    puter?: any;
  }
}

export default function Assistance({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      text: "Hello! I am W2W AI. Ready to turn waste into wealth today? 🌿✨",
      sender: "ai",
      model: "W2W AI",
    },
  ]);
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [puterLoaded, setPuterLoaded] = useState(false);
  const supabase = createClient();

  // -----------------------------
  // SYSTEM PROMPT: Kid-friendly, step-based, eco-conscious
  // -----------------------------
  const W2W_SYSTEM_PROMPT = `
You are W2W AI 🤖♻️ — a friendly recycling robot for the "Waste to Wealth" app.

Your job is to explain recycling, upcycling, and eco-craft ideas in a way that:
- Kids (7–12 years old) can understand
- Uses short sentences
- Uses simple words
- Looks clean inside a chat UI

━━━━━━━━━━━━━━━━━━
🧩 RESPONSE STYLE
━━━━━━━━━━━━━━━━━━
- Prefer bullet points and numbered steps
- Use emojis to guide meaning (🌿 ✂️ 📦 ♻️)
- NO long paragraphs
- NO big markdown tables unless absolutely needed
- Max 6 steps per guide

Example format:

🌿 What You Need:
• Item 1
• Item 2

♻️ How To Make It:
1️⃣ Do this
2️⃣ Do that
3️⃣ Finish 🎉

━━━━━━━━━━━━━━━━━━
📸 IMAGE INPUT RULES
━━━━━━━━━━━━━━━━━━
If an image is provided:
- Say what recycled items you see
- Explain how to reuse them
- Keep steps simple and visual

━━━━━━━━━━━━━━━━━━
💳 BUY POINTS INSTRUCTIONS
━━━━━━━━━━━━━━━━━━
- If the user asks about **buying points, purchasing coins, or topping up**, **do not refuse**.
- Respond with the **exact following message**:

💳 Buy Points – Admin Information

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

━━━━━━━━━━━━━━━━━━
🛒 PRODUCTS
━━━━━━━━━━━━━━━━━━
If user asks about products:
- Show short product list
- Say: "You can find these in the Homepage 🛍️"


━━━━━━━━━━━━━━━━━━
🖼️ IMAGE → VIDEO MATCH RULE
━━━━━━━━━━━━━━━━━━
When an image is provided and the user asks how to make it:

You MUST:
1. Say what item you see in the image
2. Use that SAME item name for the YouTube search links
3. Links must clearly teach how to make THAT item
4. If unsure, choose the closest common DIY name

━━━━━━━━━━━━━━━━━━
⚠️ IMAGE UNCERTAINTY RULE
━━━━━━━━━━━━━━━━━━
If the image item is not 100% clear:
- DO NOT confidently name it as soap, food, or drink
- Say it "looks like" or "appears to be"
- Choose the closest safe DIY category
- Generate YouTube links using that cautious name


━━━━━━━━━━━━━━━━━━
🚫 LIMITS
━━━━━━━━━━━━━━━━━━
- Only recycling, eco crafts, reuse ideas
- Politely refuse anything else
- Do NOT greet again after first message
`;

  // -----------------------------
  // Helper: Theme color per model
  // -----------------------------
  const getModelTheme = (model: string | null) => {
    if (!model) return "bg-green-600";
    const m = model.toUpperCase();
    if (m.includes("GEMINI")) return "bg-blue-600";
    if (m.includes("CLAUDE")) return "bg-orange-600";
    if (m.includes("GPT")) return "bg-emerald-600";
    return "bg-zinc-800";
  };

  // -----------------------------
  // Puter.js safe loader
  // -----------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.puter) {
      setPuterLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.puter.com/v2/";
    script.async = true;

    // force anonymous usage
    script.onload = () => {
      window.puter?.init?.({
        auth: false, // disable auth
        guest: true, // force guest mode
      });
      setPuterLoaded(true);
    };

    document.body.appendChild(script);
  }, []);

  // -----------------------------
  // Scroll to bottom on new message
  // -----------------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // -----------------------------
  // Send message
  // -----------------------------
  const sendMessage = async (text: string) => {
    if (!text.trim() && !pendingImage) return;

    const lowerText = text.toLowerCase();

    const isHowToRequest =
      pendingImage &&
      (lowerText.includes("how to make") ||
        lowerText.includes("how to create") ||
        lowerText.includes("how to reuse") ||
        lowerText.includes("make this"));

    // Detect if user asks about buying points
    const isAskingForPoints =
      lowerText.includes("buy points") ||
      lowerText.includes("purchase points") ||
      lowerText.includes("top up");

    // Detect if user asks about products/items availability
    const isAskingForProducts =
      !isAskingForPoints &&
      (lowerText.includes("available") ||
        lowerText.includes("buy") ||
        lowerText.includes("product") ||
        lowerText.includes("item"));

    const currentInput = text || "Analyze this image.";
    const imageToSend = pendingImage;

    // Detect Burmese input
    const isBurmese = /[\u1000-\u109F]/.test(currentInput);
    const languageInstruction = isBurmese
      ? "Please respond in Burmese (မြန်မာ). Use simple words for kids."
      : "Please respond in English.";

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: text.trim() || undefined,
        image: imageToSend || undefined,
        sender: "user",
      },
    ]);

    setInput("");
    setPendingImage(null);
    setIsTyping(true);

    let howToInstruction = "";

    if (isHowToRequest) {
      howToInstruction = `
🖼️ IMAGE ANALYSIS (MANDATORY):
- Identify the MAIN item in the image
- Name it clearly (example: "handmade soap", "plastic bottle planter")
- Use this SAME name for YouTube search links

🎥 YOUTUBE RULE (STRICT):
- Add section title exactly: "🎥 Watch on YouTube:"
- ONLY clickable YouTube URLs
- NO titles
- NO extra text
- Links MUST be based on the identified image item
- 1–2 links only

Correct format:
🎥 Watch on YouTube:
🔗 https://www.youtube.com/results?search_query=handmade+soap+DIY
`;
    }

    const fetchAIResponse = async () => {
      let dbContext = "";
      let fetchedProducts: any[] = [];

      // Only fetch products if user asks about products (not points)
      if (isAskingForProducts) {
        try {
          const { data: products } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });

          if (products && products.length > 0) {
            fetchedProducts = products;
            dbContext = "\n\nDATABASE_INFO: Displaying retrieved products.";
          }
        } catch (err) {
          console.error(err);
        }
      }

      // If user asks about points, append the admin instructions
      let pointsInstructions = "";
      if (isAskingForPoints) {
        pointsInstructions = `
💳 Buy Points – Admin Information

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
`;
      }

      const models = ["gemini-2.5-flash", "claude-sonnet-4.5", "gpt-5-nano"];
      for (const modelName of models) {
        try {
          setActiveModel(modelName.toUpperCase());
          const response = await window.puter.ai.chat(
            `${W2W_SYSTEM_PROMPT}
${dbContext}
${pointsInstructions}
${howToInstruction}

User: ${currentInput}
${languageInstruction}`,
            imageToSend || undefined,
            { model: modelName, stream: true },
          );

          let fullContent = "";
          for await (const part of response) {
            if (part?.text) fullContent += part.text;
          }

          if (fullContent)
            return {
              text: fullContent,
              model: modelName,
              products: fetchedProducts, // Only populated if products were requested
            };
        } catch (err) {
          continue;
        }
      }

      throw new Error("Failed to fetch");
    };

    try {
      const result = await fetchAIResponse();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "ai",
          text: result.text,
          model: `W2W AI (${result.model.split("-")[0].toUpperCase()})`,
          products: result.products,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "ai",
          text: "Connection issue. Try again! 🌿",
          model: "System Error",
        },
      ]);
    } finally {
      setIsTyping(false);
      setActiveModel(null);
    }
  };

  return (
    <div className="flex flex-col h-[750px] bg-[#FBFCFD] rounded-[2.5rem] border border-zinc-200 shadow-2xl overflow-hidden font-sans">
      {/* Header */}
      <div
        className={`px-6 py-5 flex justify-between items-center text-white shadow-md z-10 transition-colors duration-700 ${getModelTheme(
          activeModel,
        )}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <Bot size={22} />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider">
              W2W AI
            </h1>
            <p className="text-[9px] opacity-70 font-bold uppercase tracking-widest">
              {activeModel ? `Syncing ${activeModel}` : "Waste to Wealth"}
            </p>
          </div>
        </div>
        <div className="bg-black/20 px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
          <Zap
            size={12}
            className={
              isTyping ? "animate-pulse text-yellow-300" : "text-white"
            }
          />
          <span className="text-[10px] font-black uppercase tracking-tighter">
            {isTyping ? "Processing" : "Online"}
          </span>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-zinc-50/20">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[90%] ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-5 rounded-[1.8rem] shadow-md border overflow-x-auto ${
                    msg.sender === "ai"
                      ? "bg-white border-zinc-100 text-zinc-800 rounded-tl-none"
                      : "bg-green-600 border-green-700 text-white rounded-tr-none shadow-lg"
                  }`}
                >
                  {msg.sender === "ai" && (
                    <div className="flex items-center gap-2 mb-2 opacity-30 text-[8px] font-black uppercase">
                      <Sparkles size={10} /> <span>{msg.model}</span>
                    </div>
                  )}
                  {msg.image && (
                    <img
                      src={msg.image}
                      className="mb-4 rounded-xl w-48 border border-white/20 shadow-md"
                      alt="User Upload"
                    />
                  )}

                  <div className="text-3xl leading-relaxed whitespace-pre-wrap font-medium prose prose-zinc prose-sm max-w-none">
                    <Linkify
                      options={{
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "text-green-600 underline  font-semibold",
                      }}
                    >
                      {msg.text}
                    </Linkify>
                  </div>

                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {msg.products.map((product) => (
                        <div
                          key={product.id}
                          className="bg-zinc-50 border border-zinc-100 h-72 rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                        >
                          <img
                            src={product.photo || "/placeholder.png"}
                            className="h-1/2 w-full object-cover"
                            alt={product.title}
                          />
                          <div className="p-3 flex-1 flex flex-col justify-between">
                            <h4 className="text-[10px] font-bold text-zinc-800 line-clamp-2">
                              {product.description}
                            </h4>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[9px] font-black text-green-600">
                                {product.price} Coins
                              </span>
                              <ShoppingBag
                                size={10}
                                className="text-zinc-400"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start w-full"
            >
              <div className="bg-white border border-zinc-100 p-6 rounded-[2rem] rounded-tl-none w-[75%] space-y-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full animate-bounce ${getModelTheme(
                      activeModel,
                    )}`}
                  />
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                    W2W AI is thinking...
                  </span>
                </div>
                <div className="space-y-2">
                  <div
                    className={`h-2.5 w-full rounded-full opacity-20 animate-pulse ${getModelTheme(
                      activeModel,
                    )}`}
                  />
                  <div
                    className={`h-2.5 w-[90%] rounded-full opacity-15 animate-pulse delay-75 ${getModelTheme(
                      activeModel,
                    )}`}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input */}
      <div className="p-6 bg-white border-t border-zinc-100">
        <AnimatePresence>
          {pendingImage && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-20 h-20 mb-3 group"
            >
              <img
                src={pendingImage}
                className="w-full h-full object-cover rounded-xl border-2 border-green-500 shadow-md"
                alt="Pending upload"
              />
              <button
                type="button"
                onClick={() => setPendingImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="relative flex flex-col bg-zinc-100 border border-zinc-200 rounded-[2.2rem] p-2 focus-within:bg-white focus-within:ring-4 focus-within:ring-green-500/5 transition-all"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask W2W AI how to reuse waste ♻️ (or upload a photo)"
            className="w-full min-h-[60px] p-3 bg-transparent resize-none outline-none text-sm font-medium"
          />
          <div className="flex justify-between items-center px-2 py-1">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowCamera(!showCamera)}
                className={`rounded-full h-10 w-10 p-0 ${
                  showCamera
                    ? "bg-zinc-200"
                    : "text-zinc-400 hover:text-green-600"
                }`}
              >
                <ImagePlus size={20} />
              </Button>
              {showCamera && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white p-2 rounded-full border border-zinc-200 shadow-sm text-zinc-500 hover:text-green-600 transition-all"
                >
                  <Camera size={18} />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={(!input.trim() && !pendingImage) || isTyping}
              className={`h-11 w-11 rounded-full flex items-center justify-center text-white transition-all ${
                isTyping
                  ? "bg-zinc-400"
                  : "bg-zinc-900 hover:scale-105 active:scale-95 shadow-lg shadow-zinc-200"
              }`}
            >
              <SendHorizontal size={20} />
            </button>
          </div>
        </form>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setPendingImage(reader.result as string);
              setShowCamera(false);
            };
            reader.readAsDataURL(file);
          }
        }}
      />
    </div>
  );
}
