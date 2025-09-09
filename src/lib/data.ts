import { Timestamp } from "firebase/firestore";

export type User = {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
};

export type Message = {
  id: string;
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

export const users: User[] = [
  { id: 'user1', name: 'You', avatar: 'https://picsum.photos/id/1005/200/200', status: 'online' },
  { id: 'user2', name: 'Alice', avatar: 'https://picsum.photos/id/1011/200/200', status: 'online' },
  { id: 'user3', name: 'Bob', avatar: 'https://picsum.photos/id/1012/200/200', status: 'offline' },
  { id: 'user4', name: 'Charlie', avatar: 'https://picsum.photos/id/1025/200/200', status: 'online' },
  { id: 'user5', name: 'Diana', avatar: 'https://picsum.photos/id/1027/200/200', status: 'offline' },
  { id: 'user6', name: 'Eve', avatar: 'https://picsum.photos/id/1035/200/200', status: 'online' },
];
