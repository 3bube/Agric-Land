import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ChatContextType {
  socket: Socket | null;
  onlineUsers: string[];
  sendMessage: (to: string, message: string) => void;
  sendNotification: (to: string, type: string, content: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const token = sessionStorage.getItem("token");

    if (user && token) {
      const newSocket = io("http://localhost:5000", {
        auth: {
          token,
        },
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to socket server");
      });

      newSocket.on("users_online", (users: string[]) => {
        setOnlineUsers(users);
      });

      newSocket.on("user_connected", (userId: string) => {
        setOnlineUsers((prev) => [...prev, userId]);
      });

      newSocket.on("user_disconnected", (userId: string) => {
        setOnlineUsers((prev) => prev.filter((id) => id !== userId));
      });

      return () => {
        newSocket.close();
      };
    }
  }, []);

  const sendMessage = (to: string, message: string) => {
    if (socket) {
      socket.emit("private_message", { to, message });
    }
  };

  const sendNotification = (to: string, type: string, content: string) => {
    if (socket) {
      socket.emit("send_notification", { to, type, content });
    }
  };

  return (
    <ChatContext.Provider
      value={{ socket, onlineUsers, sendMessage, sendNotification }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
