import { User, UserRole } from '../types';

// Mock user data
const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    name: 'John Helper',
    email: 'helper@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Dedicated to helping others with social issues. 5 years experience working with NGOs.',
    role: 'helper',
    location: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Mumbai, India',
    },
    createdAt: '2023-01-15T10:30:00Z',
    helpCount: 27,
    rating: 4.8,
  },
  {
    id: 'user_2',
    name: 'Sara Needy',
    email: 'asker@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    bio: 'Looking for assistance with community projects and personal issues.',
    role: 'asker',
    location: {
      lat: 19.0330,
      lng: 73.0297,
      address: 'Navi Mumbai, India',
    },
    createdAt: '2023-02-10T14:20:00Z',
    problemCount: 5,
  },
  {
    id: 'user_3',
    name: 'Amit Volunteer',
    email: 'amit@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    bio: 'NGO worker with expertise in education and healthcare.',
    role: 'helper',
    location: {
      lat: 18.9220,
      lng: 72.8347,
      address: 'South Mumbai, India',
    },
    createdAt: '2022-11-05T09:15:00Z',
    helpCount: 42,
    rating: 4.9,
  },
  {
    id: 'user_4',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    bio: 'Seeking help with community development initiatives in my neighborhood.',
    role: 'asker',
    location: {
      lat: 19.1176,
      lng: 72.9060,
      address: 'Powai, Mumbai, India',
    },
    createdAt: '2023-03-18T11:45:00Z',
    problemCount: 3,
  },
];

// Simulate authentication
export const getUser = async (email: string, password: string): Promise<User> => {
  // In a real app, we would validate credentials against a backend
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(user => user.email === email);
      
      if (user) {
        resolve(user);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800);
  });
};

export const getUserById = async (id: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(user => user.id === id);
      
      if (user) {
        resolve(user);
      } else {
        reject(new Error('User not found'));
      }
    }, 500);
  });
};

export const getUsersByRole = async (role: UserRole): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = MOCK_USERS.filter(user => user.role === role);
      resolve(users);
    }, 500);
  });
};

export const searchUsers = async (query: string): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredUsers = MOCK_USERS.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.bio.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filteredUsers);
    }, 500);
  });
};