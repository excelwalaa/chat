"use client";

import { useState, useEffect, useCallback } from 'react';
import { chats as initialChats, users as initialUsers, type Chat, type User, type Message } from '@/lib/data';
import { ChatList } from './chat-list';
import { MessageView } from './message-view';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Bot } from 'lucide-react';

const CURRENT_USER_ID = 'user1';

export default function ChatLayout() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [users] = useState<User[]>(initialUsers);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(chats[0]?.id || null);
  
  const isMobile = useIsMobile();

  const handleSelectChat = useCallback((chatId: string) => {
    setSelectedChatId(chatId);
    setChats(prevChats => prevChats.map(c => c.id === chatId ? {...c, unreadCount: 0} : c))
  }, []);

  const handleSendMessage = (chatId: string, message: Pick<Message, 'content' | 'attachment'>) => {
    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.id === chatId) {
          const newMessage: Message = {
            id: `msg${Date.now()}`,
            senderId: CURRENT_USER_ID,
            content: message.content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            attachment: message.attachment,
          };
          return { ...chat, messages: [...chat.messages, newMessage] };
        }
        return chat;
      });
    });
  };

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  if (isMobile) {
    return (
      <div className="h-screen w-screen">
        {selectedChat ? (
          <MessageView
            chat={selectedChat}
            users={users}
            currentUserId={CURRENT_USER_ID}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedChatId(null)}
            isMobile={true}
          />
        ) : (
          <ChatList
            chats={chats}
            users={users}
            currentUserId={CURRENT_USER_ID}
            selectedChatId={selectedChatId}
            onSelectChat={handleSelectChat}
          />
        )}
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex">
      <div className="w-full max-w-xs xl:max-w-sm">
        <ChatList
          chats={chats}
          users={users}
          currentUserId={CURRENT_USER_ID}
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
        />
      </div>
      <main className="flex-1 bg-background">
        {selectedChat ? (
          <MessageView
            chat={selectedChat}
            users={users}
            currentUserId={CURRENT_USER_ID}
            onSendMessage={handleSendMessage}
            isMobile={false}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Card className="w-96 text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3 font-headline">
                  <Bot className="w-10 h-10 text-primary" />
                   Welcome to Connect Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Select a conversation from the list to start chatting.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
