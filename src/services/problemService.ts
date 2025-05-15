import { Problem, Comment, User } from '../types';
import { getUserById } from './authService';

// Mock problem data
const MOCK_PROBLEMS: Problem[] = [
  {
    id: 'problem_1',
    title: 'Need assistance with setting up a community library',
    description: 'We have collected books but need help organizing and setting up a small library in our community center. Looking for volunteers with experience in library management.',
    category: 'education',
    status: 'open',
    location: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Andheri, Mumbai, India',
    },
    images: [
      'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
      'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg',
    ],
    userId: 'user_4',
    createdAt: '2023-05-10T08:30:00Z',
    updatedAt: '2023-05-10T08:30:00Z',
    upvotes: 15,
    commentCount: 3,
    isUrgent: false,
  },
  {
    id: 'problem_2',
    title: 'Urgent: Need help with flood relief efforts',
    description: 'Our area has been affected by recent floods. We need volunteers to help distribute supplies and assist with cleanup efforts. Any help is appreciated.',
    category: 'disaster',
    status: 'in-progress',
    location: {
      lat: 19.0330,
      lng: 73.0297,
      address: 'Kalyan, Maharashtra, India',
    },
    images: [
      'https://images.pexels.com/photos/1732305/pexels-photo-1732305.jpeg',
    ],
    userId: 'user_2',
    helperIds: ['user_1', 'user_3'],
    createdAt: '2023-06-15T14:20:00Z',
    updatedAt: '2023-06-16T09:45:00Z',
    upvotes: 42,
    commentCount: 8,
    isUrgent: true,
  },
  {
    id: 'problem_3',
    title: 'Need guidance for starting a small business',
    description: 'I am a single mother looking to start a small tailoring business from home. Need advice on business registration, marketing, and securing small loans.',
    category: 'business',
    status: 'open',
    location: {
      lat: 18.9220,
      lng: 72.8347,
      address: 'Dadar, Mumbai, India',
    },
    userId: 'user_4',
    createdAt: '2023-06-01T11:15:00Z',
    updatedAt: '2023-06-01T11:15:00Z',
    upvotes: 7,
    commentCount: 2,
    isUrgent: false,
  },
  {
    id: 'problem_4',
    title: 'Seeking mentorship for underprivileged children',
    description: 'Looking for mentors who can spare 2 hours a week to guide high school students from low-income families with career advice and academic support.',
    category: 'education',
    status: 'open',
    location: {
      lat: 19.1176,
      lng: 72.9060,
      address: 'Thane, Maharashtra, India',
    },
    images: [
      'https://images.pexels.com/photos/8363104/pexels-photo-8363104.jpeg',
    ],
    userId: 'user_2',
    createdAt: '2023-05-25T16:40:00Z',
    updatedAt: '2023-05-25T16:40:00Z',
    upvotes: 23,
    commentCount: 5,
    isUrgent: false,
  },
  {
    id: 'problem_5',
    title: 'Need legal advice regarding property dispute',
    description: 'My family is facing a property dispute after my father passed away. Need guidance on legal procedures and documentation required.',
    category: 'legal',
    status: 'solved',
    location: {
      lat: 19.0178,
      lng: 72.8478,
      address: 'Bandra, Mumbai, India',
    },
    userId: 'user_4',
    helperIds: ['user_3'],
    createdAt: '2023-04-12T10:30:00Z',
    updatedAt: '2023-04-20T15:10:00Z',
    upvotes: 12,
    commentCount: 10,
    isUrgent: false,
  },
];

// Mock comments
const MOCK_COMMENTS: Comment[] = [
  {
    id: 'comment_1',
    content: 'I can help organize the books and set up a catalog system. I have experience setting up a community library in my previous locality.',
    problemId: 'problem_1',
    userId: 'user_1',
    createdAt: '2023-05-10T10:15:00Z',
    isSolution: false,
  },
  {
    id: 'comment_2',
    content: 'Our NGO has furniture that could be donated to your library setup. Please contact me to arrange logistics.',
    problemId: 'problem_1',
    userId: 'user_3',
    createdAt: '2023-05-11T09:30:00Z',
    isSolution: false,
  },
  {
    id: 'comment_3',
    content: 'My team of volunteers is heading to Kalyan tomorrow. We have supplies and equipment for cleanup. Will coordinate with you directly.',
    problemId: 'problem_2',
    userId: 'user_1',
    createdAt: '2023-06-16T08:45:00Z',
    isSolution: false,
  },
  {
    id: 'comment_4',
    content: 'Our organization can offer microloans for small businesses like yours. We also provide free business training workshops.',
    problemId: 'problem_3',
    userId: 'user_3',
    createdAt: '2023-06-02T14:20:00Z',
    isSolution: true,
  },
];

// Get all problems
export const getProblems = async (): Promise<Problem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PROBLEMS.map(problem => ({
        ...problem,
      })));
    }, 800);
  });
};

// Get problem by ID
export const getProblemById = async (id: string): Promise<Problem> => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      const problem = MOCK_PROBLEMS.find(problem => problem.id === id);
      
      if (!problem) {
        reject(new Error('Problem not found'));
        return;
      }
      
      try {
        // Fetch user data for the problem
        const user = await getUserById(problem.userId);
        
        // Fetch helper users if any
        let helpers: User[] = [];
        if (problem.helperIds && problem.helperIds.length > 0) {
          helpers = await Promise.all(
            problem.helperIds.map(helperId => getUserById(helperId))
          );
        }
        
        resolve({
          ...problem,
          user,
          helpers,
        });
      } catch (error) {
        reject(error);
      }
    }, 600);
  });
};

// Get comments for a problem
export const getCommentsByProblemId = async (problemId: string): Promise<Comment[]> => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      const comments = MOCK_COMMENTS.filter(comment => comment.problemId === problemId);
      
      try {
        // Add user data to each comment
        const commentsWithUsers = await Promise.all(
          comments.map(async (comment) => {
            const user = await getUserById(comment.userId);
            return {
              ...comment,
              user,
            };
          })
        );
        
        resolve(commentsWithUsers);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

// Get problems by user ID
export const getProblemsByUserId = async (userId: string): Promise<Problem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userProblems = MOCK_PROBLEMS.filter(problem => problem.userId === userId);
      resolve(userProblems);
    }, 600);
  });
};

// Get problems by helper ID
export const getProblemsByHelperId = async (helperId: string): Promise<Problem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const helperProblems = MOCK_PROBLEMS.filter(
        problem => problem.helperIds?.includes(helperId)
      );
      resolve(helperProblems);
    }, 600);
  });
};

// Search problems
export const searchProblems = async (query: string): Promise<Problem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredProblems = MOCK_PROBLEMS.filter(problem =>
        problem.title.toLowerCase().includes(query.toLowerCase()) ||
        problem.description.toLowerCase().includes(query.toLowerCase()) ||
        problem.category.toLowerCase().includes(query.toLowerCase()) ||
        problem.location.address.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filteredProblems);
    }, 600);
  });
};