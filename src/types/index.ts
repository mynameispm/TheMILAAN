export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  role: 'helper' | 'asker';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: string;
  helpCount?: number;
  problemCount?: number;
  rating?: number;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'open' | 'in-progress' | 'solved';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images?: string[];
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
  helperIds?: string[];
  helpers?: User[];
  upvotes: number;
  commentCount: number;
  isUrgent: boolean;
}

export interface Comment {
  id: string;
  content: string;
  problemId: string;
  userId: string;
  user?: User;
  createdAt: string;
  parentId?: string;
  isSolution: boolean;
}

export interface Notification {
  id: string;
  type: 'comment' | 'solution' | 'helper' | 'upvote';
  content: string;
  read: boolean;
  userId: string;
  relatedId: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
  problemId: string;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export type AuthTabType = 'login' | 'register';
export type UserRole = 'helper' | 'asker';