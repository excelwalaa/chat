
"use client";

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { type Chat, type User, type Message } from '@/lib/data';
import { ChatList } from './chat-list';
import { MessageView } from './message-view';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Bot } from 'lucide-react';
import { users as initialUsers } from '@/lib/data';

const CURRENT_USER_ID = 'user1';

export default function ChatLayout() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [users] = useState<User[]>(initialUsers);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  
  const isMobile = useIsMobile();

  useEffect(() => {
    const q = query(collection(db, "chats"), where("participants", "array-contains", CURRENT_USER_ID));
    
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const chatsData: Chat[] = [];
      for (const chatDoc of querySnapshot.docs) {
        const chatData = chatDoc.data();
        const messagesQuery = query(collection(db, `chats/${chatDoc.id}/messages`), orderBy('timestamp', 'asc'));
        const messagesSnapshot = await getDocs(messagesQuery);
        const messages = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));

        chatsData.push({
          id: chatDoc.id,
          ...chatData,
          messages,
          lastMessage: messages[messages.length - 1],
        } as Chat);
      }
      
      chatsData.sort((a, b) => {
        const aTimestamp = a.lastMessage?.timestamp?.toMillis() || 0;
        const bTimestamp = b.lastMessage?.timestamp?.toMillis() || 0;
        return bTimestamp - aTimestamp;
      });

      setChats(chatsData);
      if (!selectedChatId && chatsData.length > 0) {
        setSelectedChatId(chatsData[0].id);
      }
    });

    return () => unsubscribe();
  }, [selectedChatId]);

  const handleSelectChat = useCallback((chatId: string) => {
    setSelectedChatId(chatId);
    const chatRef = doc(db, 'chats', chatId);
    updateDoc(chatRef, { unreadCount: 0 });
  }, []);

  const handleSendMessage = async (chatId: string, message: Pick<Message, 'content' | 'attachment'>) => {
    if (!chatId) return;

    const messagesColRef = collection(db, `chats/${chatId}/messages`);
    const chatRef = doc(db, 'chats', chatId);

    await addDoc(messagesColRef, {
      senderId: CURRENT_USER_ID,
      content: message.content,
      attachment: message.attachment || null,
      timestamp: serverTimestamp(),
    });
    
    await updateDoc(chatRef, {
        unreadCount: 0, // Should be incremented for other users.
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
