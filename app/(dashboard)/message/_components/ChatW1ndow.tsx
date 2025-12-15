



'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useChatSocket } from '@/lib/useChatSocket';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

type UserRef =
  | string
  | {
      _id: string;
      firstName: string;
      lastName: string;
      profileImage?: string;
    };

type Message = {
  _id: string;
  message: string;
  senderId: UserRef;
  receiverId: UserRef;
  conversationId: string;
  createdAt: string;
};

interface Props {
  conversationId: string;
  receiverId: string;
  onBack: () => void;
  isMonitoring?: boolean;
  members?: Member[];
}

export default function ChatWindow({
  conversationId,
  receiverId,
  isMonitoring ,
  onBack,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  console.log(isMonitoring)

  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const currentUserId = session?.user?.userId;

  const { sendMessage } = useChatSocket({
    userId: currentUserId!,
    conversationId,
    onNewMessage: (msg: Message) =>
      setMessages((prev) => [...prev, msg]),
    onMessageSent: (msg: Message) =>
      setMessages((prev) =>
        prev.map((m) => (m._id === 'temp' ? msg : m))
      ),
  });

  /* ================= FETCH MESSAGES ================= */
  useEffect(() => {
    if (!conversationId || !token) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/message/${conversationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setMessages(data.data || []);
      } catch (error) {
        console.error('Fetch message error:', error);
      }
    };

    fetchMessages();
  }, [conversationId, token]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const handleSend = () => {
    if (!input.trim() || !currentUserId) return;

    const tempMessage: Message = {
      _id: 'temp',
      message: input,
      senderId: currentUserId,
      receiverId,
      conversationId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    sendMessage(input, receiverId);
    setInput('');
  };

  const isMe = (msg: Message) =>
    typeof msg.senderId === 'string'
      ? msg.senderId === currentUserId
      : msg.senderId._id === currentUserId;

  /* ================= RECEIVER NAME (HEADER) ================= */
  const receiverMsg = messages.find(
    (m) => !isMe(m)
  );

  const receiverName =
    receiverMsg && typeof receiverMsg.senderId !== 'string'
      ? `${receiverMsg.senderId.firstName} ${receiverMsg.senderId.lastName}`
      : 'User';

  /* ================= UI ================= */
  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* ================= HEADER ================= */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="md:hidden">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          {receiverName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()}
        </div>

        <div>
          <h3 className="font-semibold">{receiverName}</h3>
          <p className="text-xs text-green-500">Online</p>
        </div>
      </div>

      {/* ================= MESSAGE LIST ================= */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((msg) => {
            const mine = isMe(msg);
            const sender =
              typeof msg.senderId === 'string'
                ? null
                : msg.senderId;

            return (
              <div
                key={msg._id}
                className={`flex w-full ${
                  mine ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex gap-3 max-w-xs lg:max-w-md ${
                    mine
                      ? 'flex-row-reverse text-right'
                      : 'flex-row text-left'
                  }`}
                >
                  {/* PROFILE IMAGE */}
                  <Image
                    src={
                      sender?.profileImage ||
                      '/default-profile.png'
                    }
                    alt="profile"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  {/* MESSAGE */}
                  <div>
                    {/* NAME */}
                    <p className="text-xs text-gray-500 mb-1">
                      {sender
                        ? `${sender.firstName} ${sender.lastName}`
                        : 'User'}
                    </p>

                    {/* BUBBLE */}
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        mine
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white border rounded-bl-none'
                      }`}
                    >
                      <p>{msg.message}</p>
                      <div className="text-[10px] mt-1 opacity-70">
                        {new Date(
                          msg.createdAt
                        ).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ================= INPUT ================= */}
      
      <div className="bg-white border-t p-4">
        {isMonitoring === true ? null : (

        <div className="flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && handleSend()
            }
            placeholder="Write a message..."
            className="flex-1 px-5 py-3 bg-gray-100 rounded-full outline-none"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white p-3 rounded-full"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        )}
      </div>
    </div>
  );
}
