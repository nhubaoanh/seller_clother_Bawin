"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:6001";

interface UseSocketOptions {
  autoConnect?: boolean;
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const { autoConnect = true } = options;
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    if (!autoConnect) return;

    // Tạo socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socket.on("receive_message", (data) => {
      setLastMessage(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [autoConnect]);

  // Join room
  const joinRoom = useCallback((roomId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("join_room", roomId);
    }
  }, []);

  // Leave room
  const leaveRoom = useCallback((roomId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("leave_room", roomId);
    }
  }, []);

  // Send message
  const sendMessage = useCallback((data: {
    room: string;
    message: string;
    sender: "user" | "staff";
    userId: string;
    name?: string;
  }) => {
    if (socketRef.current) {
      socketRef.current.emit("send_message", {
        ...data,
        timestamp: new Date().toISOString(),
      });
    }
  }, []);

  // Listen to event
  const on = useCallback((event: string, callback: (data: any) => void) => {
    const socket = socketRef.current;
    if (socket) {
      socket.on(event, callback);
    }
  }, []);

  // Remove listener
  const off = useCallback((event: string, callback?: (data: any) => void) => {
    const socket = socketRef.current;
    if (socket) {
      if (callback) {
        socket.off(event, callback);
      } else {
        socket.off(event);
      }
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    lastMessage,
    joinRoom,
    leaveRoom,
    sendMessage,
    on,
    off,
  };
};
