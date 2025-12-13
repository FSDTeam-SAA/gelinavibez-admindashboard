
'use client';

import { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatW1ndow';


export type SelectedChatType = {
  conversationId: string;
  receiverId: string;
};

export default function ChatLayout() {
  const [selectedChat, setSelectedChat] = useState<SelectedChatType | null>(null);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`md:w-96 w-full md:flex ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        <ChatSidebar selectedChat={selectedChat} onSelectChat={setSelectedChat} />
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
        {selectedChat ? (
          <ChatWindow
            conversationId={selectedChat.conversationId}
            receiverId={selectedChat.receiverId}
            selectedChat={selectedChat}
            onBack={() => setSelectedChat(null)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-xl">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
