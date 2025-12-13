
'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useChatSocket } from '@/lib/useChatSocket';
import { useSession } from 'next-auth/react';



type Message = {
  _id: string;
  message: string;
  senderId: { _id: string; firstName: string ; lastName: string; profileImage?: string };
  receiverId: { _id: string; firstName: string; lastName: string; profileImage?: string };
  conversationId: string;
  createdAt: string;
};

type SocketMessage = {
  _id: string;
  message: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  createdAt: string;
};

interface Props {
  conversationId: string;
  receiverId: string;
  onBack: () => void;
  selectedChat: { conversationId: string; receiverId: string } | null;
}

export default function ChatWindow({ conversationId, receiverId, onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const currentUserId = session?.user?.userId as string;

  const { sendMessage } = useChatSocket({
    userId: currentUserId,
    conversationId,
    onNewMessage: (msg: SocketMessage) => {
      const normalized: Message = {
        ...msg,
        senderId: { _id: msg.senderId, firstName: 'User', lastName: '' },
        receiverId: { _id: msg.receiverId, firstName: 'User', lastName: '' },
      };
      setMessages(prev => [...prev, normalized]);
    },
    onMessageSent: (msg: SocketMessage) => {
      const normalized: Message = {
        ...msg,
        senderId: { _id: msg.senderId, firstName: 'User', lastName: '' },
        receiverId: { _id: msg.receiverId, firstName: 'User', lastName: '' },
      };
      setMessages(prev => prev.map(m => (m._id === 'temp' ? normalized : m)));
    },
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
    if (!input.trim() || !currentUserId) return;
    const tempId = Date.now().toString();

const tempMessage: Message = {
  _id: tempId,
  message: input,
  senderId: { _id: currentUserId, firstName: (session?.user as { firstName?: string | undefined; lastName?: string | undefined }).firstName || 'You', lastName: (session?.user as { firstName?: string | undefined; lastName?: string | undefined }).lastName || '' },
  receiverId: { _id: receiverId, firstName: 'Receiver', lastName: '' },
  conversationId,
  createdAt: new Date().toISOString(),
};

    setMessages(prev => [...prev, tempMessage]);
    sendMessage(input, receiverId);
    setInput('');
  };

  const isMessageFromMe = (msg: Message) => msg.senderId._id === currentUserId;

  const receiverName =
    messages.find(m => m.senderId._id !== currentUserId)?.senderId
      ? `${messages.find(m => m.senderId._id !== currentUserId)?.senderId.firstName} ${
          messages.find(m => m.senderId._id !== currentUserId)?.senderId.lastName
        }`
      : 'User';

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* HEADER */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="md:hidden">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
          {receiverName.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>

        <div>
          <h3 className="font-semibold">{receiverName}</h3>
          <p className="text-sm text-green-500">Online</p>
        </div>
      </div>

      {/* MESSAGE LIST */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map(msg => {
            const isMe = isMessageFromMe(msg);

            return (
              <div key={msg._id} className={`flex items-end gap-2 max-w-xs lg:max-w-md ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`rounded-2xl px-4 py-3 ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border rounded-bl-none'}`}>
                  <p>{msg.message}</p>
                  <div className="text-xs mt-1">{format(new Date(msg.createdAt), 'HH:mm')}</div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* INPUT */}
      <div className="bg-white border-t p-4">
        <div className="flex gap-3 items-center">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Write a message..."
            className="flex-1 px-5 py-3 bg-gray-100 rounded-full"
          />

          <button onClick={handleSend} className="bg-blue-600 text-white p-3 rounded-full">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
