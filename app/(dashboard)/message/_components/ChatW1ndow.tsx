

'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useChatSocket } from '@/lib/useChatSocket';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

type Member = {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
};

type Message = {
  _id: string;
  message: string;
  senderId: Member;
  receiverId: Member;
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


interface User {
  userId?: string;
  email?: string | null;
  name?: string | null;
  role?: string | null;
  profileImage?: string | null;
  accessRoutes?: string[];
  firstName?: string;
  lastName?: string;
}

export default function ChatWindow({
  conversationId,
  receiverId,
  onBack,
  isMonitoring = false,
  members = [],
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const currentUserId = session?.user?.userId as string;

  const { sendMessage } = useChatSocket({
    userId: currentUserId,
    conversationId,
    onNewMessage: () => {},
  });

  useEffect(() => {
    if (!conversationId || !token) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/message/${conversationId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setMessages(data.data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [conversationId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !currentUserId || isMonitoring) return;

 const tempMessage: Message = {
  _id: Date.now().toString(),
  message: input,
  senderId: {
    _id: currentUserId,
    firstName: (session?.user as User)?.firstName || 'You',
    lastName: (session?.user as User)?.lastName || '',
  },
  receiverId: {
    _id: receiverId,
    firstName: 'Receiver',
    lastName: '',
  },
  conversationId,
  createdAt: new Date().toISOString(),
};

    setMessages(prev => [...prev, tempMessage]);
    sendMessage?.(input, receiverId);
    setInput('');
  };

  const isMessageFromMe = (msg: Message) => msg.senderId._id === currentUserId;

  const headerName = isMonitoring
    ? members.map(m => `${m.firstName} ${m.lastName}`).join(' ↔ ')
    : messages.find(m => m.senderId._id !== currentUserId)?.senderId
    ? `${messages.find(m => m.senderId._id !== currentUserId)?.senderId.firstName} ${
        messages.find(m => m.senderId._id !== currentUserId)?.senderId.lastName
      }`.trim()
    : 'Chat';

  const headerInitials = headerName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3 shadow-sm">
        <button onClick={onBack} className="md:hidden">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
          {headerInitials || 'CH'}
        </div>

        <div>
          <h3 className="font-semibold text-lg">{headerName}</h3>
          {isMonitoring ? (
            <p className="text-sm text-orange-600 font-medium">Monitoring Mode</p>
          ) : (
            <p className="text-sm text-green-500">Online</p>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => {
            const isMe = isMessageFromMe(msg);
            const sender = msg.senderId;
            const senderName = `${sender.firstName} ${sender.lastName}`.trim();
            const senderInitials = senderName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

            return (
              <div
                key={msg._id}
                className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar - Always show in monitoring mode, hide in normal if it's me */}
                {(isMonitoring || !isMe) && (
                  <div className="flex-shrink-0">
                    {sender.profileImage ? (
                      <Image
                        src={sender.profileImage}
                        alt={senderName}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                        {senderInitials}
                      </div>
                    )}
                  </div>
                )}

                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-md`}>
                  {/* Sender Name - Only in monitoring mode */}
                  {isMonitoring && (
                    <span className="text-xs text-gray-600 font-medium mb-1 px-1">
                      {senderName}
                    </span>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    <div className={`text-xs mt-2 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                      {format(new Date(msg.createdAt), 'HH:mm')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input - Hidden in monitoring mode */}
      {!isMonitoring && (
        <div className="bg-white border-t p-4 shadow-lg">
          <div className="flex gap-3 items-center max-w-4xl mx-auto">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Write a message..."
              className="flex-1 px-5 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-blue-600 text-white p-3 rounded-full disabled:opacity-50 hover:bg-blue-700 transition shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}