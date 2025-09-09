import { Timestamp } from "firebase/firestore";

export type User = {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  email?: string;
};

export type Message = {
  id:string;
  senderId: string;
  content: string;
  timestamp: Timestamp;
  attachment?: {
    type: 'image' | 'file';
    url: string;
    fileName?: string;
  };
};

export type Chat = {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  participants: string[];
  messages: Message[];
  unreadCount: number;
  lastMessage?: Message;
};
