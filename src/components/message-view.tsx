"use client";

import { ArrowLeft, Bot, Phone, Send, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Chat, User } from '@/lib/data';
import { Message } from "./message";
import { UserAvatar } from "./user-avatar";
import { Separator } from "./ui/separator";
import type { FormEvent } from "react";
import React from "react";

interface MessageViewProps {
  chat: Chat;
  users: User[];
  currentUserId: string;
  onSendMessage: (chatId: string, content: string) => void;
  onBack?: () => void;
  isMobile: boolean;
}

const getChatPartner = (chat: Chat, currentUserId: string, users: User[]) => {
  if (chat.type === 'direct') {
    const partnerId = chat.participants.find(p => p !== currentUserId);
    return users.find(u => u.id === partnerId);
  }
  return undefined;
};

export function MessageView({ chat, users, currentUserId, onSendMessage, onBack, isMobile }: MessageViewProps) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const partner = getChatPartner(chat, currentUserId, users);
  const chatName = chat.type === 'group' ? chat.name : partner?.name;
  
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    const content = input.value.trim();
    if (content) {
      onSendMessage(chat.id, content);
      form.reset();
    }
  };

  React.useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [chat.messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b">
        {isMobile && (
          <Button variant="ghost" size="icon" className="mr-2" onClick={onBack}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
        )}
        {partner ? <UserAvatar user={partner} /> : <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mr-3"><Bot className="w-6 h-6 text-secondary-foreground" /></div> }
        <div className="flex-1 ml-3">
          <h2 className="font-semibold text-lg">{chatName}</h2>
          <p className="text-sm text-muted-foreground">
            {partner?.status === 'online' ? 'Online' : 'Offline'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {chat.messages.map((message) => {
            const sender = users.find((user) => user.id === message.senderId);
            if (!sender) return null;
            return (
              <Message
                key={message.id}
                message={message}
                sender={sender}
                isCurrentUser={sender.id === currentUserId}
                isGroupChat={chat.type === 'group'}
              />
            );
          })}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t bg-card">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <Input name="message" placeholder="Type a message..." className="flex-1" autoComplete="off" />
          <Button type="submit" size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
