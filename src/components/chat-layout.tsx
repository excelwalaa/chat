
"use client";

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { type Chat, type User, type Message } from '@/lib/data';
import { ChatList } from './chat-list';
import { MessageView } from './message-view';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Bot, UserPlus } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import { UserAvatar } from './user-avatar';


export default function ChatLayout() {
  const [user] = useAuthState(auth);
  const [chats, setChats] = useState<Chat[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  
  const isMobile = useIsMobile();
  const currentUserId = user?.uid;

  useEffect(() => {
    if (!currentUserId) return;

    const usersUnsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map(doc => doc.data() as User);
      setUsers(usersData);
    });

    const q = query(collection(db, "chats"), where("participants", "array-contains", currentUserId));
    
    const chatsUnsubscribe = onSnapshot(q, async (querySnapshot) => {
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

    return () => {
      usersUnsubscribe();
      chatsUnsubscribe();
    }
  }, [selectedChatId, currentUserId]);

  const handleSelectChat = useCallback((chatId: string) => {
    setSelectedChatId(chatId);
    const chatRef = doc(db, 'chats', chatId);
    updateDoc(chatRef, { unreadCount: 0 });
  }, []);

  const handleSendMessage = async (chatId: string, message: Pick<Message, 'content' | 'attachment'>) => {
    if (!chatId || !currentUserId) return;

    const messagesColRef = collection(db, `chats/${chatId}/messages`);
    const chatRef = doc(db, 'chats', chatId);

    await addDoc(messagesColRef, {
      senderId: currentUserId,
      content: message.content,
      attachment: message.attachment || null,
      timestamp: serverTimestamp(),
    });
    
    await updateDoc(chatRef, {
        unreadCount: 0, // Should be incremented for other users.
    });
  };

  const handleCreateNewChat = async (partnerId: string) => {
    if (!currentUserId) return;

    const existingChat = chats.find(chat => 
        chat.type === 'direct' && chat.participants.includes(partnerId)
    );

    if (existingChat) {
      setSelectedChatId(existingChat.id);
      setIsNewChatDialogOpen(false);
      return;
    }

    const newChatRef = await addDoc(collection(db, 'chats'), {
      type: 'direct',
      participants: [currentUserId, partnerId],
      unreadCount: 0,
    });

    setSelectedChatId(newChatRef.id);
    setIsNewChatDialogOpen(false);
  };

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);
  const currentUser = users.find(u => u.id === currentUserId);

  if (isMobile) {
    return (
      <div className="h-screen w-screen">
        {selectedChat ? (
          <MessageView
            chat={selectedChat}
            users={users}
            currentUserId={currentUserId!}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedChatId(null)}
            isMobile={true}
          />
        ) : (
          <ChatList
            chats={chats}
            users={users}
            currentUserId={currentUserId!}
            selectedChatId={selectedChatId}
            onSelectChat={handleSelectChat}
            onNewChat={() => setIsNewChatDialogOpen(true)}
            currentUser={currentUser}
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
          currentUserId={currentUserId!}
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
          onNewChat={() => setIsNewChatDialogOpen(true)}
          currentUser={currentUser}
        />
      </div>
      <main className="flex-1 bg-background">
        {selectedChat ? (
          <MessageView
            chat={selectedChat}
            users={users}
            currentUserId={currentUserId!}
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
                <p>Select a conversation from the list to start chatting, or start a new one!</p>
              </CardContent>
              <CardFooter>
                 <Button onClick={() => setIsNewChatDialogOpen(true)} className="w-full">
                    <UserPlus className="mr-2" />
                    New Chat
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
      <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a new chat</DialogTitle>
            <DialogDescription>Select a user to start a conversation with.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            {users.filter(u => u.id !== currentUserId).map(user => (
              <div key={user.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                <div className="flex items-center gap-3">
                  <UserAvatar user={user} />
                  <span>{user.name}</span>
                </div>
                <Button onClick={() => handleCreateNewChat(user.id)}>Chat</Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
