"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageCircle,
  Send,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Loader2,
  RefreshCw,
  MoreVertical,
  Phone,
  Mail,
  ShieldAlert
} from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { IChat, IChatMessage } from "@/types/chat";
import { searchChats, getChatMessages, sendMessageAPI, assignChat, closeChat } from "@/service/chat.service";
import storage from "@/utils/storage";

export default function ChatPage() {
  const [chats, setChats] = useState<IChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<IChat | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isConnected, joinRoom, sendMessage, on, off } = useSocket();

  useEffect(() => {
    const user = storage.getUser();
    setCurrentUser(user);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChats = useCallback(async () => {
    setIsLoadingChats(true);
    try {
      const result = await searchChats({
        pageIndex: 1,
        pageSize: 50,
        status: "open",
      });
      if (result?.data) {
        setChats(result.data);
      }
    } catch (error) {
      console.error("Load chats error:", error);
    } finally {
      setIsLoadingChats(false);
    }
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    const handleNewCustomerMessage = (data: any) => {
      setChats((prev) => {
        const existingIndex = prev.findIndex((c) => c.chat_id === data.chatId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            last_message: data.message,
            lu_updated: data.timestamp,
            unread_count: (updated[existingIndex].unread_count || 0) + 1,
          };
          const [chat] = updated.splice(existingIndex, 1);
          return [chat, ...updated];
        } else {
          loadChats();
          return prev;
        }
      });
    };
    on("new_customer_message", handleNewCustomerMessage);
    return () => off("new_customer_message", handleNewCustomerMessage);
  }, [on, off, loadChats]);

  useEffect(() => {
    if (selectedChat) {
      joinRoom(selectedChat.chat_id);
      loadMessages(selectedChat.chat_id);
    }
  }, [selectedChat, joinRoom]);

  useEffect(() => {
    if (!selectedChat || !currentUser) return;
    const handleReceiveMessage = (data: any) => {
      if (data.room === selectedChat.chat_id && data.userId !== currentUser.user_id) {
        setMessages((prev) => {
          const exists = prev.some((m) => m.message === data.message && m.sender_id === data.userId && Math.abs(new Date(m.sent_at).getTime() - new Date(data.timestamp).getTime()) < 5000);
          if (exists) return prev;
          return [...prev, {
            message_id: Date.now().toString(),
            chat_id: data.room,
            sender_id: data.userId,
            message: data.message,
            sent_at: data.timestamp,
            active_flag: 1,
            lu_updated: data.timestamp,
            lu_user_id: data.userId,
            sender_name: data.name,
            sender_role: data.sender === "staff" ? "staff" : "customer",
          }];
        });
      }
    };
    on("receive_message", handleReceiveMessage);
    return () => off("receive_message", handleReceiveMessage);
  }, [selectedChat, currentUser, on, off]);

  const loadMessages = async (chatId: string) => {
    setIsLoading(true);
    try {
      const result = await getChatMessages(chatId);
      if (result?.data) {
        setMessages(result.data.map((m: any) => ({
          ...m,
          sender_role: m.sender_role || (m.sender_id === selectedChat?.customer_id ? "customer" : "staff"),
        })));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedChat || !currentUser) return;
    const messageText = inputMessage.trim();
    setInputMessage("");
    const newMsg: IChatMessage = {
      message_id: Date.now().toString(),
      chat_id: selectedChat.chat_id,
      sender_id: currentUser.user_id,
      message: messageText,
      sent_at: new Date().toISOString(),
      active_flag: 1,
      lu_updated: new Date().toISOString(),
      lu_user_id: currentUser.user_id,
      sender_name: currentUser.full_name || "Agent",
      sender_role: "staff",
    };
    setMessages((prev) => [...prev, newMsg]);
    sendMessage({
      room: selectedChat.chat_id,
      message: messageText,
      sender: "staff",
      userId: currentUser.user_id,
      name: currentUser.full_name || "Agent",
    });
    try {
      await sendMessageAPI({
        chat_id: selectedChat.chat_id,
        sender_id: currentUser.user_id,
        message: messageText,
        lu_user_id: currentUser.user_id,
      });
    } catch (error) {}
  };

  const handleAssignChat = async (chat: IChat) => {
    if (!currentUser) return;
    try {
      await assignChat(chat.chat_id, currentUser.user_id, currentUser.user_id);
      loadChats();
    } catch (error) {}
  };

  const handleCloseChat = async () => {
    if (!selectedChat || !currentUser) return;
    try {
      await closeChat(selectedChat.chat_id, currentUser.user_id);
      setSelectedChat(null);
      setMessages([]);
      loadChats();
    } catch (error) {}
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.last_message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-2xl">
      
      {/* Sidebar - Transmission Feed */}
      <div className="w-[450px] bg-gray-50/50 border-r border-gray-100 flex flex-col">
        {/* Header */}
        <div className="p-10 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-black flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-black animate-pulse" : "bg-gray-200"}`} />
              Inbound Feed
            </h2>
            <button onClick={loadChats} disabled={isLoadingChats} className="p-3 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all">
              <RefreshCw size={14} className={isLoadingChats ? "animate-spin" : ""} />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Identity..."
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 ring-black/5 text-[10px] font-black uppercase tracking-widest"
            />
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoadingChats ? (
            <div className="flex items-center justify-center py-10"><Loader2 className="animate-spin text-black" size={24} /></div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center py-20 text-gray-300">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-5" />
              <p className="text-[10px] font-black uppercase tracking-widest">No active transmissions</p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.chat_id}
                onClick={() => {
                  setSelectedChat(chat);
                  setChats((prev) => prev.map((c) => (c.chat_id === chat.chat_id ? { ...c, unread_count: 0 } : c)));
                }}
                className={`p-8 rounded-[2rem] cursor-pointer transition-all duration-500 border border-transparent hover:bg-white hover:border-gray-100 group ${
                  selectedChat?.chat_id === chat.chat_id ? "bg-white border-black shadow-xl shadow-black/5" : ""
                }`}
              >
                <div className="flex items-start gap-6">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border border-gray-100 transition-all ${selectedChat?.chat_id === chat.chat_id ? 'bg-black text-white' : 'bg-white text-black'}`}>
                    <User size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-black uppercase tracking-tight text-black truncate">
                        {chat.customer_name || "Unknown Identity"}
                      </span>
                      {(chat.unread_count || 0) > 0 && (
                        <span className="bg-black text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-bounce">
                          {chat.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate italic mb-4">"{chat.last_message || "Awaiting protocol..."}"</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-gray-300">
                        <Clock size={10} /> {formatTime(chat.lu_updated || chat.started_at)}
                      </div>
                      {chat.staff_id ? (
                        <div className="text-black flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                          <CheckCircle size={10} /> Active
                        </div>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); handleAssignChat(chat); }} className="px-4 py-2 bg-black text-white rounded-full text-[8px] font-black uppercase tracking-widest hover:scale-105 transition-all">Intercept</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Terminal Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedChat ? (
          <>
            {/* Terminal Header */}
            <div className="px-12 py-10 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-black rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-black/20">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-black tracking-tighter uppercase leading-none mb-3">{selectedChat.customer_name || "Secure Identity"}</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-300"><Mail size={12} /> {selectedChat.customer_email || "PRIVATE"}</div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-300"><Phone size={12} /> {selectedChat.customer_phone || "PRIVATE"}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                  <button className="p-4 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all"><MoreVertical size={20} /></button>
                  <button onClick={handleCloseChat} className="px-8 py-4 bg-gray-50 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">Terminate</button>
              </div>
            </div>

            {/* Transmission Log */}
            <div className="flex-1 overflow-y-auto p-12 space-y-8 bg-gray-50/30">
              {isLoading ? (
                <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-black" size={32} /></div>
              ) : messages.length === 0 ? (
                <div className="text-center py-20 text-gray-300">
                    <ShieldAlert size={48} className="mx-auto mb-4 opacity-5" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No log entries found in this session</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.message_id} className={`flex ${msg.sender_role === "staff" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[60%] p-8 rounded-[2.5rem] shadow-sm border ${
                        msg.sender_role === "staff" ? "bg-black text-white border-black rounded-tr-md shadow-xl shadow-black/10" : "bg-white text-black border-gray-100 rounded-tl-md"
                    }`}>
                      <p className="text-[11px] font-bold uppercase tracking-widest leading-loose">{msg.message}</p>
                      <div className={`text-[8px] font-black uppercase tracking-[0.2em] mt-4 flex items-center gap-3 ${msg.sender_role === "staff" ? "text-white/40" : "text-gray-300"}`}>
                        <Clock size={10} /> {formatTime(msg.sent_at)} • {msg.sender_role === "staff" ? "AGENT_ALPHA" : "IDENTITY_MASTER"}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Module */}
            <div className="p-12 bg-white border-t border-gray-50">
              <div className="flex items-center gap-6 bg-gray-50 p-3 rounded-[2.5rem] border border-gray-100 focus-within:border-black transition-all">
                <input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Inject response protocol..."
                  className="flex-1 bg-transparent px-8 py-4 outline-none text-[11px] font-black uppercase tracking-widest"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="p-5 bg-black text-white rounded-full hover:scale-110 transition-all disabled:opacity-20 shadow-xl shadow-black/20"
                >
                  <Send size={24} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-300">
            <div className="text-center">
              <MessageCircle size={100} className="mx-auto mb-8 opacity-5" />
              <p className="text-[11px] font-black uppercase tracking-[0.5em] italic">Select Transmission Channel to Interface</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
