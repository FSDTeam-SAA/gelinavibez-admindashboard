// hooks/useChatSocket.ts
import { useEffect, useRef } from "react";
import { connectSocket } from "@/lib/socket";

type MessageType = {
  _id: string;
  message: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  createdAt: string;
};

type UseChatSocketProps = {
  userId: string;
  conversationId: string;
  onNewMessage: (msg: MessageType) => void;
  onMessageSent?: (msg: MessageType) => void;
  onTyping?: (isTyping: boolean) => void;
};

export const useChatSocket = ({
  userId,
  conversationId,
  onNewMessage,
  onMessageSent,
}: UseChatSocketProps) => {
  //eslint-disable-next-line
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) return;

    const socket = connectSocket(userId);
    socketRef.current = socket;

    // Listen for incoming messages
    socket.on("receiveMessage", (message: MessageType) => {
      // console.log("New message received:", message);
      onNewMessage(message);
    });

    // Optional: Message sent confirmation
    socket.on("messageSent", (message: MessageType) => {
      if (onMessageSent) onMessageSent(message);
    });

    socket.on("messageError", (error) => {
      console.error("Message failed:", error);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messageSent");
      socket.off("messageError");
    };
  }, [userId, conversationId, onNewMessage, onMessageSent]);

  // Send message function
  const sendMessage = (text: string, receiverId: string) => {
    if (!socketRef.current || !text.trim()) return;

    socketRef.current.emit("sendMessage", {
      senderId: userId,
      receiverId,
      conversationId,
      message: text,
    });
  };

  // Typing indicator (optional)
  const sendTyping = (isTyping: boolean) => {
    if (!socketRef.current) return;
    socketRef.current.emit("typing", { conversationId, isTyping });
  };

  return { sendMessage, sendTyping };
};