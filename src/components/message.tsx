"use client";

import { cn } from "@/lib/utils";
import type { Message as MessageType, User } from '@/lib/data';
import { UserAvatar } from "./user-avatar";
import Image from "next/image";
import { Download } from "lucide-react";
import { Button } from "./ui/button";

interface MessageProps {
  message: MessageType;
  sender: User;
  isCurrentUser: boolean;
  isGroupChat: boolean;
}

export function Message({ message, sender, isCurrentUser, isGroupChat }: MessageProps) {
  return (
    <div
      className={cn(
        "flex items-end gap-2 my-2 animate-message-in",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      {!isCurrentUser && (
        <div className="shrink-0">
         <UserAvatar user={sender} className="w-8 h-8"/>
        </div>
      )}
      <div
        className={cn(
          "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl flex flex-col gap-2",
          isCurrentUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-card border rounded-bl-none"
        )}
      >
        {isGroupChat && !isCurrentUser && (
          <p className="text-xs font-bold mb-1 text-primary">{sender.name}</p>
        )}
        {message.attachment && (
            <div className="relative">
                {message.attachment.type === 'image' ? (
                    <Image 
                        src={message.attachment.url}
                        alt={message.attachment.fileName || 'attachment'}
                        width={300}
                        height={200}
                        className="rounded-md object-cover"
                    />
                ) : (
                    <div className="flex items-center gap-2 p-2 rounded-md bg-background/20">
                        <p className="text-sm truncate">{message.attachment.fileName}</p>
                        <a href={message.attachment.url} download={message.attachment.fileName}>
                            <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                            </Button>
                        </a>
                    </div>
                )}
            </div>
        )}
        {message.content && <p className="text-sm">{message.content}</p>}
      </div>
    </div>
  );
}
