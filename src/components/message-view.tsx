"use client";

import { ArrowLeft, Bot, Paperclip, Phone, Send, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Chat, User, Message as MessageType } from '@/lib/data';
import { Message } from "./message";
import { UserAvatar } from "./user-avatar";
import type { FormEvent } from "react";
import React, { useState, useRef } from "react";
import Image from "next/image";

interface MessageViewProps {
  chat: Chat;
  users: User[];
  currentUserId: string;
  onSendMessage: (chatId: string, message: Pick<MessageType, 'content' | 'attachment'>) => void;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);

  const partner = getChatPartner(chat, currentUserId, users);
  const chatName = chat.type === 'group' ? chat.name : partner?.name;
  
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    const content = input.value.trim();
    
    if (content || attachment) {
      const message: Pick<MessageType, 'content' | 'attachment'> = { content };
      if (attachment && attachmentPreview) {
        message.attachment = {
            type: attachment.type.startsWith('image/') ? 'image' : 'file',
            url: attachmentPreview,
            fileName: attachment.name,
        }
      }
      onSendMessage(chat.id, message);
      form.reset();
      setAttachment(null);
      setAttachmentPreview(null);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachment(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAttachmentPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachment = () => {
      setAttachment(null);
      setAttachmentPreview(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
  }

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
         {attachmentPreview && (
          <div className="relative mb-2 w-24 h-24">
            <Image
              src={attachmentPreview}
              alt="Attachment preview"
              fill
              className="object-cover rounded-md"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={removeAttachment}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <Button type="button" variant="ghost" size="icon" onClick={handleAttachmentClick}>
                <Paperclip className="h-5 w-5" />
            </Button>
            <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
          <Input name="message" placeholder="Type a message..." className="flex-1" autoComplete="off" />
          <Button type="submit" size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
