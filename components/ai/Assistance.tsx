"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { chatAssistant } from "@/app/actions/chat";
import { Coins } from "lucide-react";

type Message = {
  id: number;
  text?: string;
  image?: string;
  sender: "user" | "ai";
  products?: any[];
};

export default function Assistance({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now() + Math.random(),
      text: "Hello! How can I help? Would you like to buy points today?",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingImage, isTyping]);

  // Send message to AI server
  const sendMessage = async (text: string) => {
    if (!text.trim() && !pendingImage) return;

    //  UI Update & CLEAR INPUT IMMEDIATELY
    const userMsg: Message = {
      id: Date.now() + Math.random(),
      text: text || undefined,
      image: pendingImage || undefined,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");
    setPendingImage(null);
    setIsTyping(true);

    const formData = new FormData();
    formData.append("message", text);
    if (pendingImage) formData.append("image", pendingImage);
    formData.append("userId", userId);

    try {
      const res = await chatAssistant(formData, messages);
      const rawText = res.text || "";
      const cleanJsonString = rawText.replace(/```json|```/g, "").trim();

      let parsed: any = {};
      let displayMessage = "";

      try {
        parsed = JSON.parse(cleanJsonString);
        displayMessage = parsed.response || parsed.message || parsed.text || "";
      } catch {
        displayMessage = rawText;
        parsed = { action: "chat" };
      }

      // Pretty Formatting Logic
      const formatAIResponse = (txt: string) => {
        if (!txt) return "";
        return txt
          .replace(/\*\*/g, "") // Remove double stars if they appear as text
          .split(/[.!?]\s+/) // Split by sentences
          .map((s) => s.trim())
          .filter((s) => s.length > 5)
          .map((s) => `♻️ ${s}`) // Add a clean icon to each sentence
          .join("\n\n"); // Add double spacing
      };

      const aiMsg: Message = {
        id: Date.now() + Math.random(),
        sender: "ai",
        products: res.products || [],
        text: formatAIResponse(displayMessage),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  // File selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPendingImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = ""; // reset input
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (choice: boolean) => {
    sendMessage(choice ? "I want to buy points" : "No thanks");
  };

  return (
    <div>
      <div className="flex flex-col h-[665px] bg-green-50 rounded-xl p-4">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <div key={msg.id} className="mb-4">
                {/* THE MAIN BUBBLE */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-xl max-w-xs break-words ${
                    msg.sender === "ai"
                      ? "bg-green-200 text-gray-800"
                      : "bg-eco-primarySoft text-white ml-auto"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="upload"
                      className="mt-2 rounded-lg max-w-full"
                    />
                  )}
                  {msg.text && (
                    <span className="text-sm leading-relaxed whitespace-pre-line block">
                      {msg.text}
                    </span>
                  )}
                </motion.div>

                {/* THE PRODUCT CAROUSEL */}
                {msg.sender === "ai" &&
                  msg.products &&
                  msg.products.length > 0 && (
                    <div
                      className="flex overflow-x-auto gap-3 mt-3 pb-4 cursor-grab active:cursor-grabbing"
                      style={{
                        scrollbarWidth: "thin", // Shows a small scrollbar for mouse users
                        msOverflowStyle: "auto",
                        WebkitOverflowScrolling: "touch",
                      }}
                      // This helper allows mouse wheel to scroll horizontally
                      onWheel={(e) => {
                        if (e.deltaY !== 0) {
                          e.currentTarget.scrollLeft += e.deltaY;
                        }
                      }}
                    >
                      {msg.products.map((product: any) => (
                        <div
                          key={product.id}
                          className="min-w-[160px] max-w-[160px] bg-white rounded-xl shadow-md border border-gray-100 p-2 flex-shrink-0 transition-transform hover:scale-[1.02]"
                        >
                          <img
                            src={product.photo}
                            className="w-full h-24 object-cover rounded-lg mb-2"
                            alt={product.title}
                            draggable={false} // Prevents image ghosting while dragging
                          />
                          <p className="text-[12px] font-bold text-gray-900 truncate px-1">
                            {product.title}
                          </p>
                          <div className="flex justify-between items-center mt-2 px-1">
                            <span className="text-[11px] text-green-600 font-extrabold">
                              {product.price} pts
                            </span>
                            {/* <button className="bg-green-600 text-white text-[10px] px-3 py-1.5 rounded-lg hover:bg-green-700">
                              Buy
                            </button> */}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {/* AI typing indicator */}
            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 rounded-xl max-w-xs break-words bg-green-200 text-gray-800"
              >
                <span>AI is processing...</span>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Quick actions */}
        <div className="flex space-x-2 mb-2">
          <button
            onClick={() => handleQuickAction(true)}
            className="bg-yellow-400 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-gray-800 hover:bg-yellow-300 transition"
          >
            Buy Points <Coins />
          </button>
          {/* <button
            onClick={() => handleQuickAction(false)}
            className="bg-gray-300 px-4 py-2 rounded-lg font-semibold text-gray-800 hover:bg-gray-200 transition"
          >
            No, thanks
          </button> */}
        </div>

        {/* Pending Image Preview */}
        {pendingImage && (
          <div className="mb-2 relative max-w-xs">
            <img
              src={pendingImage}
              alt="preview"
              className="rounded-xl max-w-full border-2 border-gray-300"
            />
            <button
              onClick={() => setPendingImage(null)}
              className="absolute top-1 right-1 bg-gray-200 rounded-full p-1 hover:bg-gray-300 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input + upload */}
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-300 px-4 py-3 rounded-xl hover:bg-gray-200 transition"
          >
            +
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-green-500 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
