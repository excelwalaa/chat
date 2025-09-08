"use client";

import { cn } from "@/lib/utils";
import type { Message as MessageType, User } from '@/lib/data';
import { UserAvatar } from "./user-avatar";

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
          "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl",
          isCurrentUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-card border rounded-bl-none"
        )}
      >
        {isGroupChat && !isCurrentUser && (
          <p className="text-xs font-bold mb-1 text-primary">{sender.name}</p>
        )}
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}
