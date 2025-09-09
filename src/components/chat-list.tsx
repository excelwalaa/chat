
"use client";

import type { FC } from 'react';
import { Bot, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Chat, User } from '@/lib/data';
import { cn } from "@/lib/utils";
import { UserAvatar } from './user-avatar';
import { Badge } from './ui/badge';

interface ChatListProps {
  chats: Chat[];
  users: User[];
  currentUserId: string;
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

const getChatPartner = (chat: Chat, currentUserId: string, users: User[]) => {
  if (chat.type === 'direct') {
    const partnerId = chat.participants.find(p => p !== currentUserId);
    return users.find(u => u.id === partnerId);
  }
  return undefined;
};

const getChatDisplayInfo = (chat: Chat, currentUserId: string, users: User[]) => {
  if (chat.type === 'group') {
    return {
      name: chat.name || 'Group Chat',
      avatarUser: undefined,
    };
  }
  const partner = getChatPartner(chat, currentUserId, users);
  return {
    name: partner?.name || 'Unknown User',
    avatarUser: partner,
  };
};

function formatTimestamp(timestamp: any) {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const ChatList: FC<ChatListProps> = ({ chats, users, currentUserId, selectedChatId, onSelectChat }) => {
  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-primary-dark font-headline">Connect Now</h1>
          <Button size="icon" variant="ghost">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search" className="pl-10" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {chats.map((chat) => {
            const displayInfo = getChatDisplayInfo(chat, currentUserId, users);
            const lastMessage = chat.lastMessage;

            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  "flex items-start w-full text-left p-3 rounded-lg transition-colors",
                  selectedChatId === chat.id ? "bg-accent" : "hover:bg-accent/50"
                )}
              >
                <div className="mr-3 shrink-0">
                  {displayInfo.avatarUser ? (
                    <UserAvatar user={displayInfo.avatarUser} />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                      <Bot className="w-6 h-6 text-secondary-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold truncate">{displayInfo.name}</h3>
                    <p className="text-xs text-muted-foreground">{formatTimestamp(lastMessage?.timestamp)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground truncate pr-2">
                      {lastMessage?.content}
                    </p>
                    {chat.unreadCount > 0 && (
                      <Badge variant="default" className="flex-shrink-0 bg-primary h-5 w-5 p-0 flex items-center justify-center">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
};
