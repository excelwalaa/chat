"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { User } from '@/lib/data';

type UserAvatarProps = {
  user: User;
  className?: string;
};

export function UserAvatar({ user, className }: UserAvatarProps) {
  return (
    <div className="relative">
      <Avatar className={cn("border-2 border-background", className)}>
        <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="profile picture" />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      {user.status === 'online' && (
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
      )}
    </div>
  );
}
