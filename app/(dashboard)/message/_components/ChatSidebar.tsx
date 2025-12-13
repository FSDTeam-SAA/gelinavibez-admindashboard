



'use client';

import { formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { SelectedChatType } from './ChatLayout';
import Image from 'next/image';

type Member = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'contractor';
  profileImage?: string;
};

type Conversation = {
  _id: string;
  members: Member[];
  createdAt: string;
  updatedAt: string;
};

interface Props {
  selectedChat: SelectedChatType | null;
  onSelectChat: (data: SelectedChatType) => void;
}

export default function ChatSidebar({ selectedChat, onSelectChat }: Props) {
  const { data: session, status } = useSession();
  const token = session?.accessToken as string | undefined;
  const currentUserId = session?.user?.userId as string | undefined;
  const currentUserRole = session?.user?.role as 'user' | 'contractor' | undefined;

  const fetchConversations = async (): Promise<Conversation[]> => {
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/conversation`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to fetch' }));
      throw new Error(error.message || 'Failed to fetch conversations');
    }
    const json = await res.json();
    return json.data as Conversation[];
  };

  const { data: conversations = [], isLoading, error } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
    enabled: !!token && status === 'authenticated',
    staleTime: 1000 * 60,
  });

  const getReceiver = (members: Member[]): Member | null => {
    if (!currentUserRole || !currentUserId) return null;
    return members.find(m => m.role !== currentUserRole) || null;
  };

  const getOtherMember = (members: Member[]) => members.find(m => m._id !== currentUserId) || members[0];

  const handleChatClick = (conversation: Conversation) => {
    const receiver = getReceiver(conversation.members);
    if (!receiver) return;
    onSelectChat({
      conversationId: conversation._id,
      receiverId: receiver._id,
    });
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="w-full md:w-96 bg-white border-r border-gray-200 flex items-center justify-center h-full">
        <div className="text-gray-500">Loading chats...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="w-full md:w-96 bg-white border-r border-gray-200 flex items-center justify-center h-full">
        <div className="text-gray-500">Please sign in</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full md:w-96 bg-white border-r border-gray-200 flex items-center justify-center h-full">
        <div className="text-red-500">Failed to load chats</div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col items-center justify-center h-full text-gray-500">
        <p>No messages yet</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => {
          const other = getOtherMember(conv.members);
          const displayName = `${other.firstName} ${other.lastName}`;
          const initials = displayName
            .split(' ')
            .map(n => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

          return (
            <div
              key={conv._id}
              onClick={() => handleChatClick(conv)}
              className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer ${
                selectedChat?.conversationId === conv._id
                  ? 'bg-blue-50 border-r-4 border-blue-600'
                  : ''
              }`}
            >
              {other.profileImage ? (
                <Image
                  src={other.profileImage || ''}
                  alt={displayName}
                  width={100}
                  height={100}
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  {initials}
                </div>
              )}

              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{displayName}</h3>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Tap to chat</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
