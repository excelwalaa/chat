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
  timestamp: string;
};

export type Chat = {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  participants: string[];
  messages: Message[];
  unreadCount: number;
};

export const users: User[] = [
  { id: 'user1', name: 'You', avatar: 'https://picsum.photos/id/1005/200/200', status: 'online' },
  { id: 'user2', name: 'Alice', avatar: 'https://picsum.photos/id/1011/200/200', status: 'online' },
  { id: 'user3', name: 'Bob', avatar: 'https://picsum.photos/id/1012/200/200', status: 'offline' },
  { id: 'user4', name: 'Charlie', avatar: 'https://picsum.photos/id/1025/200/200', status: 'online' },
  { id: 'user5', name: 'Diana', avatar: 'https://picsum.photos/id/1027/200/200', status: 'offline' },
  { id: 'user6', name: 'Eve', avatar: 'https://picsum.photos/id/1035/200/200', status: 'online' },
];

export const chats: Chat[] = [
  {
    id: 'chat1',
    type: 'direct',
    participants: ['user1', 'user2'],
    messages: [
      { id: 'msg1', senderId: 'user2', content: 'Hey, how are you?', timestamp: '10:30 AM' },
      { id: 'msg2', senderId: 'user1', content: 'I am good, thanks! How about you?', timestamp: '10:31 AM' },
      { id: 'msg3', senderId: 'user2', content: 'Doing great! Just working on the new project.', timestamp: '10:32 AM' },
    ],
    unreadCount: 1,
  },
  {
    id: 'chat2',
    type: 'group',
    name: 'Project Team',
    participants: ['user1', 'user3', 'user4'],
    messages: [
      { id: 'msg4', senderId: 'user3', content: 'Hey team, I pushed the latest updates.', timestamp: 'Yesterday' },
      { id: 'msg5', senderId: 'user4', content: 'Awesome, I will take a look.', timestamp: 'Yesterday' },
      { id: 'msg6', senderId: 'user1', content: 'Sounds good, let me know if you need any help.', timestamp: 'Yesterday' },
    ],
    unreadCount: 0,
  },
  {
    id: 'chat3',
    type: 'direct',
    participants: ['user1', 'user5'],
    messages: [
      { id: 'msg7', senderId: 'user5', content: 'Can we schedule a meeting for tomorrow?', timestamp: 'Tuesday' },
    ],
    unreadCount: 3,
  },
  {
    id: 'chat4',
    type: 'direct',
    participants: ['user1', 'user6'],
    messages: [
      { id: 'msg8', senderId: 'user6', content: 'Just saw your email. I will reply shortly.', timestamp: 'Tuesday' },
      { id: 'msg9', senderId: 'user1', content: 'No rush!', timestamp: 'Tuesday' },
    ],
    unreadCount: 0,
  },
    {
    id: 'chat5',
    type: 'group',
    name: 'Weekend Plans',
    participants: ['user1', 'user2', 'user6'],
    messages: [
      { id: 'msg10', senderId: 'user2', content: 'Any plans for the weekend?', timestamp: 'Monday' },
      { id: 'msg11', senderId: 'user6', content: 'I was thinking of going for a hike.', timestamp: 'Monday' },
    ],
    unreadCount: 0,
  },
];
