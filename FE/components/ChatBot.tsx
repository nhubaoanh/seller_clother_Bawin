'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, User, Bot, ShoppingBag } from 'lucide-react';
import { aiService, ChatMessage } from '@/lib/services/aiService';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Xin chào! Tôi là SELLER CLOTH AI Stylist. Tôi có thể giúp gì cho phong cách của bạn hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiService.sendMessage([...messages, userMessage]);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Xin lỗi, hệ thống của tôi đang gặp sự cố. Vui lòng thử lại sau.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity" />
          <MessageSquare className="relative z-10" size={24} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-ping" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-500">
          
          {/* Header */}
          <div className="bg-black text-white px-8 py-6 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 text-6xl font-black opacity-10 italic pointer-events-none select-none tracking-tighter">AI</div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <Sparkles size={20} className="text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Stylist Protocol</h3>
                <h2 className="text-lg font-black uppercase tracking-tighter italic leading-none">SELLER <span className="text-gray-400">AI</span></h2>
              </div>
            </div>
            <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all relative z-10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${msg.role === 'user' ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-100 shadow-sm'}`}>
                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`p-4 rounded-3xl text-[11px] font-bold leading-loose tracking-wide ${msg.role === 'user' ? 'bg-black text-white rounded-tr-none' : 'bg-white text-black border border-gray-100 shadow-sm rounded-tl-none'}`}>
                        <div className="prose prose-sm max-w-none prose-p:my-0 prose-img:rounded-2xl prose-img:mt-4">
                            {msg.content.split('\n').map((line, i) => {
                                // Basic Markdown Image handling for suggestions
                                const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
                                if (imgMatch) {
                                    return (
                                        <div key={i} className="mt-4 group relative">
                                            <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full h-auto rounded-2xl border border-gray-100 shadow-xl" />
                                            <div className="absolute top-2 right-2 bg-black text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ShoppingBag size={14} />
                                            </div>
                                        </div>
                                    );
                                }
                                return <p key={i}>{line}</p>;
                            })}
                        </div>
                    </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-pulse">
                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-black">
                        <Loader2 size={14} className="animate-spin" />
                   </div>
                   <div className="p-4 bg-white rounded-3xl rounded-tl-none border border-gray-100 shadow-sm">
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce delay-75" />
                            <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce delay-150" />
                        </div>
                   </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-8 bg-white border-t border-gray-50">
            <div className="relative group">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="HỎI VỀ XU HƯỚNG..."
                    className="w-full px-8 py-5 bg-gray-50 border-none rounded-full outline-none focus:ring-4 ring-black/5 text-[10px] font-black uppercase tracking-widest text-black placeholder-gray-300 transition-all pr-16"
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
                >
                    <Send size={14} />
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
