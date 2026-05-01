"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles, Loader2, Info } from "lucide-react";
import { chatWithAI } from "@/service/ai.service";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export default function GenealogyChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: 'Chào bạn! Tôi là trợ lý AI của dòng họ. Bạn có thể hỏi tôi về quan hệ huyết thống, ví dụ: "Ông A là con ai?", "Liệt kê tất cả thành viên", "Ai thuộc đời thứ 2?".',
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      // Gọi API backend - backend tự lấy data từ DB
      const response = await chatWithAI(userMsg);

      if (response.success && response.data) {
        setMessages((prev) => [...prev, { role: "model", text: response.data! }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", text: response.message || "Xin lỗi, tôi không thể trả lời lúc này." },
        ]);
      }
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Đã có lỗi xảy ra khi kết nối với máy chủ AI." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col font-sans animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-4 border-b border-[#d4af37] flex items-center gap-3 shadow-sm rounded-t-lg">
        <div className="w-10 h-10 bg-gradient-to-br from-[#b91c1c] to-[#d4af37] rounded-full flex items-center justify-center text-white shadow">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-bold text-[#5d4037] text-lg">Tra Cứu Gia Phả AI</h3>
          <p className="text-xs text-green-600">Sẵn sàng hỗ trợ</p>
        </div>
        <div
          className="ml-auto text-stone-400 hover:text-[#b91c1c] cursor-pointer"
          title="AI sử dụng Gemini qua Backend API"
        >
          <Info size={20} />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-[#fdfbf7] p-4 overflow-y-auto custom-scrollbar space-y-4 border-x border-[#d4af37]/30">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user"
                  ? "bg-stone-200 text-stone-600"
                  : "bg-[#fdf6e3] text-[#b91c1c] border border-[#d4af37]"
              }`}
            >
              {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-[#5d4037] text-white rounded-tr-none"
                  : "bg-white text-[#4a4a4a] border border-[#eaddcf] rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#fdf6e3] text-[#b91c1c] border border-[#d4af37] flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-[#eaddcf] flex items-center gap-2">
              <Loader2 className="animate-spin text-[#d4af37]" size={16} />
              <span className="text-xs text-stone-500">Đang suy nghĩ...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-[#d4af37] rounded-b-lg shadow-lg">
        <form onSubmit={handleSend} className="flex gap-2 relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Hỏi về ông tổ, quan hệ giữa các thành viên..."
            className="flex-1 pl-4 pr-12 py-3 bg-[#f9f9f9] border border-[#d4af37]/30 rounded-full focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#b91c1c] text-white rounded-full flex items-center justify-center hover:bg-[#991b1b] disabled:opacity-50 disabled:hover:bg-[#b91c1c] transition-colors shadow-md"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
