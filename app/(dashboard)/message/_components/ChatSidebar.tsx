



// 'use client';

// import { formatDistanceToNow } from 'date-fns';
// import { useQuery } from '@tanstack/react-query';
// import { useSession } from 'next-auth/react';
// import { SelectedChatType } from './ChatLayout';
// import Image from 'next/image';

// type Member = {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: 'user' | 'contractor';
//   profileImage?: string;
// };

// type Conversation = {
//   _id: string;
//   members: Member[];
//   createdAt: string;
//   updatedAt: string;
// };

// interface Props {
//   selectedChat: SelectedChatType | null;
//   onSelectChat: (data: SelectedChatType) => void;
// }

// export default function ChatSidebar({ selectedChat, onSelectChat }: Props) {
//   const { data: session, status } = useSession();
//   const token = session?.accessToken as string | undefined;
//   const currentUserId = session?.user?.userId as string | undefined;
//   const currentUserRole = session?.user?.role as 'user' | 'contractor' | undefined;

//   const fetchConversations = async (): Promise<Conversation[]> => {
//     if (!token) throw new Error('Not authenticated');
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/conversation`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       credentials: 'include',
//     });
//     if (!res.ok) {
//       const error = await res.json().catch(() => ({ message: 'Failed to fetch' }));
//       throw new Error(error.message || 'Failed to fetch conversations');
//     }
//     const json = await res.json();
//     return json.data as Conversation[];
//   };

//   const { data: conversations = [], isLoading, error } = useQuery<Conversation[]>({
//     queryKey: ['conversations'],
//     queryFn: fetchConversations,
//     enabled: !!token && status === 'authenticated',
//     staleTime: 1000 * 60,
//   });

//   const getReceiver = (members: Member[]): Member | null => {
//     if (!currentUserRole || !currentUserId) return null;
//     return members.find(m => m.role !== currentUserRole) || null;
//   };

//   const getOtherMember = (members: Member[]) => members.find(m => m._id !== currentUserId) || members[0];

//   const handleChatClick = (conversation: Conversation) => {
//     const receiver = getReceiver(conversation.members);
//     if (!receiver) return;
//     onSelectChat({
//       conversationId: conversation._id,
//       receiverId: receiver._id,
//     });
//   };

//   if (status === 'loading' || isLoading) {
//     return (
//       <div className="w-full md:w-96 bg-white border-r border-gray-200 flex items-center justify-center h-full">
//         <div className="text-gray-500">Loading chats...</div>
//       </div>
//     );
//   }

//   if (status === 'unauthenticated') {
//     return (
//       <div className="w-full md:w-96 bg-white border-r border-gray-200 flex items-center justify-center h-full">
//         <div className="text-gray-500">Please sign in</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-full md:w-96 bg-white border-r border-gray-200 flex items-center justify-center h-full">
//         <div className="text-red-500">Failed to load chats</div>
//       </div>
//     );
//   }

//   if (conversations.length === 0) {
//     return (
//       <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col items-center justify-center h-full text-gray-500">
//         <p>No messages yet</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col h-full">
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//         <h2 className="text-xl font-bold">Messages</h2>
//       </div>

//       {/* Chat List */}
//       <div className="flex-1 overflow-y-auto">
//         {conversations.map((conv) => {
//           const other = getOtherMember(conv.members);
//           const displayName = `${other.firstName} ${other.lastName}`;
//           const initials = displayName
//             .split(' ')
//             .map(n => n[0])
//             .join('')
//             .slice(0, 2)
//             .toUpperCase();

//           return (
//             <div
//               key={conv._id}
//               onClick={() => handleChatClick(conv)}
//               className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer ${
//                 selectedChat?.conversationId === conv._id
//                   ? 'bg-blue-50 border-r-4 border-blue-600'
//                   : ''
//               }`}
//             >
//               {other.profileImage ? (
//                 <Image
//                   src={other.profileImage || ''}
//                   alt={displayName}
//                   width={100}
//                   height={100}
//                   className="w-14 h-14 rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
//                   {initials}
//                 </div>
//               )}

//               <div className="flex-1">
//                 <div className="flex justify-between">
//                   <h3 className="font-semibold">{displayName}</h3>
//                   <span className="text-xs text-gray-500">
//                     {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-600">Tap to chat</p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { formatDistanceToNow } from 'date-fns';
// import { useQuery } from '@tanstack/react-query';
// import { useSession } from 'next-auth/react';
// import Image from 'next/image';
// import { SelectedChatType } from './ChatLayout';

// type Member = {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: 'user' | 'contractor' | 'superadmin';
//   profileImage?: string;
// };

// type Conversation = {
//   _id: string;
//   members: Member[];
//   createdAt: string;
//   updatedAt: string;
// };

// interface Props {
//   selectedChat: SelectedChatType & { isMonitoring?: boolean } | null;
//   onSelectChat: (
//     data: SelectedChatType,
//     isMonitoring?: boolean,
//     members?: Member[]
//   ) => void;
// }

// export default function ChatSidebar({ selectedChat, onSelectChat }: Props) {
//   const { data: session, status } = useSession();
//   const token = session?.accessToken as string | undefined;
//   const currentUserId = session?.user?.userId as string | undefined;
//   const currentUserRole = session?.user?.role as 'user' | 'contractor' | 'superadmin' | undefined;

//   const isAdmin = currentUserRole === 'superadmin';

//   const fetchConversations = async (): Promise<Conversation[]> => {
//     if (!token) throw new Error('Not authenticated');
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/conversation`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       credentials: 'include',
//     });
//     if (!res.ok) throw new Error('Failed to fetch');
//     const json = await res.json();
//     return json.data as Conversation[];
//   };

//   const { data: conversations = [], isLoading, error } = useQuery<Conversation[]>({
//     queryKey: ['conversations'],
//     queryFn: fetchConversations,
//     enabled: !!token && status === 'authenticated',
//     staleTime: 1000 * 60,
//   });

//   const getOtherMember = (members: Member[]) => {
//     return members.find(m => m._id !== currentUserId) || members[0];
//   };

//   const getDisplayName = (conv: Conversation) => {
//     if (isAdmin) {
//       return conv.members.map(m => `${m.firstName} ${m.lastName}`).join(' ↔ ');
//     }
//     const other = getOtherMember(conv.members);
//     return `${other.firstName} ${other.lastName}`;
//   };

//   const getInitials = (name: string) => {
//     return name
//       .split(' ')
//       .map(n => n[0])
//       .join('')
//       .slice(0, 2)
//       .toUpperCase();
//   };

//   const handleChatClick = (conv: Conversation) => {
//     if (isAdmin) {
//       // Monitoring mode for admin
//       onSelectChat(
//         {
//           conversationId: conv._id,
//           receiverId: '', // not used in monitoring
//         },
//         true,
//         conv.members
//       );
//     } else {
//       const other = getOtherMember(conv.members);
//       onSelectChat({
//         conversationId: conv._id,
//         receiverId: other._id,
//       });
//     }
//   };

//   if (status === 'loading' || isLoading) {
//     return (
//       <div className="w-full md:w-96 bg-white border-r border-gray-200 flex items-center justify-center h-full">
//         <div className="text-gray-500">Loading chats...</div>
//       </div>
//     );
//   }

//   if (status === 'unauthenticated') {
//     return (
//       <div className="w-full md:w-96 bg-white border-r border-gray-200 flex items-center justify-center h-full">
//         <div className="text-gray-500">Please sign in</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-full md:w-96 bg-white border-r border-gray-200 flex items-center justify-center h-full">
//         <div className="text-red-500">Failed to load chats</div>
//       </div>
//     );
//   }

//   if (conversations.length === 0) {
//     return (
//       <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col items-center justify-center h-full text-gray-500">
//         <p>No messages yet</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col h-full">
//       <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//         <h2 className="text-xl font-bold">Messages {isAdmin && '(Monitoring)'}</h2>
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         {conversations.map((conv) => {
//           const displayName = getDisplayName(conv);
//           const initials = getInitials(displayName);
//           const other = getOtherMember(conv.members);

//           return (
//             <div
//               key={conv._id}
//               onClick={() => handleChatClick(conv)}
//               className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
//                 selectedChat?.conversationId === conv._id
//                   ? 'bg-blue-50 border-r-4 border-blue-600'
//                   : ''
//               }`}
//             >
//               {other.profileImage ? (
//                 <Image
//                   src={other.profileImage}
//                   alt={displayName}
//                   width={56}
//                   height={56}
//                   className="w-14 h-14 rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg">
//                   {initials}
//                 </div>
//               )}

//               <div className="flex-1 min-w-0">
//                 <div className="flex justify-between items-start">
//                   <h3 className="font-semibold truncate">{displayName}</h3>
//                   <span className="text-xs text-gray-500 ml-2">
//                     {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-600">
//                   {isAdmin ? 'Monitoring this chat' : 'Tap to chat'}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
'use client';

import { formatDistanceToNow } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { SelectedChatType } from './ChatLayout';
import { toast } from 'sonner';

type Member = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'contractor' | 'superadmin' | 'admin';
  profileImage?: string;
};

type Conversation = {
  _id: string;
  members: Member[];
  createdAt: string;
  updatedAt: string;
};

interface Props {
  selectedChat: SelectedChatType & { isMonitoring?: boolean } | null;
  onSelectChat: (
    data: SelectedChatType,
    isMonitoring?: boolean,
    members?: Member[]
  ) => void;
}

export default function ChatSidebar({ selectedChat, onSelectChat }: Props) {
  const { data: session, status } = useSession();
  const token = session?.accessToken as string | undefined;
  const currentUserId = session?.user?.userId as string | undefined;
  const currentUserRole = session?.user?.role as 'user' | 'contractor' | 'superadmin' | 'admin' | undefined;
  const queryClient = useQueryClient();

  // Check if current user is admin or superadmin
  const isAdminOrSuper = currentUserRole === 'superadmin' || currentUserRole === 'admin';
  const isSuperadmin = currentUserRole === 'superadmin';

  // Fetch all conversations
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
    if (!res.ok) throw new Error('Failed to fetch');
    const json = await res.json();
    return json.data as Conversation[];
  };

  const { data: conversations = [], isLoading, error } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
    enabled: !!token && status === 'authenticated',
    staleTime: 1000 * 60,
  });

  // My individual chats (where I am a member)
  const myConversations = conversations.filter(conv =>
    conv.members.some(m => m._id === currentUserId)
  );

  // Monitorable chats: 
  // - Must not include current user
  // - If current user is only 'admin', exclude conversations that have a superadmin member
  const monitorConversations = isAdminOrSuper
    ? conversations.filter(conv => {
        // Exclude chats where current user is a member
        if (conv.members.some(m => m._id === currentUserId)) return false;

        // If current user is regular admin (not superadmin), exclude chats with any superadmin
        if (!isSuperadmin && conv.members.some(m => m.role === 'superadmin')) return false;

        return true;
      })
    : [];

  // Mutation to create new conversation
  const createConversationMutation = useMutation({
    mutationFn: async (receiverId: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token!}`,
        },
        body: JSON.stringify({ receiverId }),
      });
      if (!res.ok) throw new Error('Failed to create conversation');
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      const newConv = data.data;
      toast.success('Conversation created!');
      onSelectChat({
        conversationId: newConv._id,
        receiverId: newConv.members.find((m: Member) => m._id !== currentUserId)?._id || '',
      }, false);
    },
    onError: () => {
      toast.error('Failed to create conversation');
    },
  });

  const getOtherMember = (members: Member[]) => {
    return members.find(m => m._id !== currentUserId) || members[0];
  };

  const getDisplayName = (conv: Conversation, isMonitoring: boolean) => {
    if (isMonitoring) {
      return conv.members.map(m => `${m.firstName} ${m.lastName}`).join(' ↔ ');
    }
    const other = getOtherMember(conv.members);
    return `${other.firstName} ${other.lastName}`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const handleIndividualChatStart = (receiverId: string) => {
    createConversationMutation.mutate(receiverId);
  };

  const handleMonitorClick = (conv: Conversation) => {
    onSelectChat(
      { conversationId: conv._id, receiverId: '' },
      true,
      conv.members
    );
  };

  if (status === 'loading' || isLoading) return <div className="w-full h-full flex items-center justify-center text-gray-500">Loading...</div>;
  if (status === 'unauthenticated') return <div className="w-full h-full flex items-center justify-center text-gray-500">Please sign in</div>;
  if (error) return <div className="w-full h-full flex items-center justify-center text-red-500">Failed to load chats</div>;

  return (
    <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Monitor Other Chats Section */}
        {isAdminOrSuper && monitorConversations.length > 0 && (
          <>
            <div className="px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-50">
              Monitor Other Chats
            </div>
            {monitorConversations.map((conv) => {
              const displayName = getDisplayName(conv, true);
              const initials = getInitials(displayName);
              const other = conv.members[0];

              return (
                <div
                  key={conv._id + '-monitor'}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                >
                  {other.profileImage ? (
                    <Image src={other.profileImage} alt="" width={56} height={56} className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                      {initials}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{displayName}</h3>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <button
                        onClick={() => handleMonitorClick(conv)}
                        className="text-xs text-orange-600 font-medium hover:underline"
                      >
                        Monitor
                      </button>
                      {conv.members.map((member) => (
                        <button
                          key={member._id}
                          onClick={() => handleIndividualChatStart(member._id)}
                          className="text-xs text-blue-600 font-medium hover:underline"
                        >
                          Chat with {member.firstName}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="border-t border-gray-200 my-2" />
          </>
        )}

        {/* My Messages Section */}
        {myConversations.length > 0 ? (
          <>
            {isAdminOrSuper && <div className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50">My Messages</div>}
            {myConversations.map((conv) => {
              const displayName = getDisplayName(conv, false);
              const initials = getInitials(displayName);
              const other = getOtherMember(conv.members);

              return (
                <div
                  key={conv._id}
                  onClick={() => onSelectChat({
                    conversationId: conv._id,
                    receiverId: other._id,
                  }, false)}
                  className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedChat?.conversationId === conv._id && !selectedChat?.isMonitoring
                      ? 'bg-blue-50 border-r-4 border-blue-600'
                      : ''
                  }`}
                >
                  {other.profileImage ? (
                    <Image src={other.profileImage} alt="" width={56} height={56} className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                      {initials}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold truncate">{displayName}</h3>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Tap to chat</p>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
}