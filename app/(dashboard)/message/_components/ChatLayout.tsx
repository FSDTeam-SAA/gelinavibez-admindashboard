
// 'use client';

// import { useState } from 'react';
// import ChatSidebar from './ChatSidebar';
// import ChatWindow from './ChatW1ndow';


// export type SelectedChatType = {
//   conversationId: string;
//   receiverId: string;
// };

// export default function ChatLayout() {
//   const [selectedChat, setSelectedChat] = useState<SelectedChatType | null>(null);

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className={`md:w-96 w-full md:flex ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
//         <ChatSidebar selectedChat={selectedChat} onSelectChat={setSelectedChat} />
//       </div>

//       {/* Chat Window */}
//       <div className={`flex-1 flex flex-col ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
//         {selectedChat ? (
//           <ChatWindow
//             conversationId={selectedChat.conversationId}
//             receiverId={selectedChat.receiverId}
//             selectedChat={selectedChat}
//             onBack={() => setSelectedChat(null)}
//           />
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-gray-500">
//             <div className="text-center">
//               <div className="text-6xl mb-4">💬</div>
//               <p className="text-xl">Select a chat to start messaging</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useState } from 'react';
// import ChatSidebar from './ChatSidebar';
// import ChatWindow from './ChatW1ndow';


// export type SelectedChatType = {
//   conversationId: string;
//   receiverId: string;
// };

// export type ExtendedSelectedChat = SelectedChatType & {
//   isMonitoring?: boolean;
// };

// type Member = {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   profileImage?: string;
// };

// export default function ChatLayout() {
//   const [selectedChat, setSelectedChat] = useState<ExtendedSelectedChat | null>(null);
//   const [monitoringMembers, setMonitoringMembers] = useState<Member[]>([]);

//   const handleSelectChat = (
//     data: SelectedChatType,
//     isMonitoring: boolean = false,
//     members?: Member[]
//   ) => {
//     setSelectedChat({
//       ...data,
//       isMonitoring,
//     });
//     if (isMonitoring && members) {
//       setMonitoringMembers(members);
//     } else {
//       setMonitoringMembers([]);
//     }
//   };

//   const handleBack = () => {
//     setSelectedChat(null);
//     setMonitoringMembers([]);
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div
//         className={`absolute inset-y-0 left-0 z-30 w-full md:w-96 md:relative md:z-auto bg-white transition-transform duration-300 ease-in-out ${
//           selectedChat ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
//         }`}
//       >
//         <ChatSidebar
//           selectedChat={selectedChat || null}
//           onSelectChat={handleSelectChat}
//         />
//       </div>

//       {/* Chat Window / Empty State */}
//       <div className="flex-1 flex flex-col">
//         {selectedChat ? (
//           <ChatWindow
//             conversationId={selectedChat.conversationId}
//             receiverId={selectedChat.receiverId}
//             onBack={handleBack}
//             isMonitoring={selectedChat.isMonitoring || false}
//             members={monitoringMembers}
//           />
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-gray-500">
//             <div className="text-center">
//               <div className="text-6xl mb-4">💬</div>
//               <p className="text-xl font-medium">Select a chat to start messaging</p>
//               <p className="text-sm mt-2">Your conversations will appear here</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatW1ndow';

export type SelectedChatType = {
  conversationId: string;
  receiverId: string;
};

export type ExtendedSelectedChat = SelectedChatType & {
  isMonitoring?: boolean;
};

type Member = {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
};

export default function ChatLayout() {
  const [selectedChat, setSelectedChat] = useState<ExtendedSelectedChat | null>(null);
  const [monitoringMembers, setMonitoringMembers] = useState<Member[]>([]);

  const handleSelectChat = (
    data: SelectedChatType,
    isMonitoring: boolean = false,
    members?: Member[]
  ) => {
    setSelectedChat({
      ...data,
      isMonitoring,
    });
    if (isMonitoring && members) {
      setMonitoringMembers(members);
    } else {
      setMonitoringMembers([]);
    }
  };

  const handleBack = () => {
    setSelectedChat(null);
    setMonitoringMembers([]);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`absolute inset-y-0 left-0 z-30 w-full md:w-96 md:relative md:z-auto bg-white transition-transform duration-300 ease-in-out ${
          selectedChat ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
        }`}
      >
        <ChatSidebar
          selectedChat={selectedChat || null}
          onSelectChat={handleSelectChat}
        />
      </div>

      {/* Chat Window / Empty State */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatWindow
            conversationId={selectedChat.conversationId}
            receiverId={selectedChat.receiverId}
            onBack={handleBack}
            isMonitoring={selectedChat.isMonitoring || false}
            members={monitoringMembers}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-xl font-medium">Select a chat to start messaging</p>
              <p className="text-sm mt-2">Your conversations will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}