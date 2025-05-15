import { ChatMessage } from '../types';

const MOCK_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'problem_1': [
    {
      id: 'chat_1_1',
      content: 'How can I effectively organize books by category?',
      role: 'user',
      createdAt: '2023-05-10T11:30:00Z',
      problemId: 'problem_1',
      userId: 'user_4',
    },
    {
      id: 'chat_1_2',
      content: 'For organizing a community library, consider using the Dewey Decimal Classification system or a simplified version. Group books by main categories like Fiction, Non-fiction, Children\'s Books, Reference, etc. Each section can be color-coded for easier identification. For a small community library, you might want to focus on user-friendliness rather than strict adherence to formal library systems.',
      role: 'assistant',
      createdAt: '2023-05-10T11:30:05Z',
      problemId: 'problem_1',
      userId: 'system',
    },
    {
      id: 'chat_1_3',
      content: 'What\'s the best way to track book loans without expensive software?',
      role: 'user',
      createdAt: '2023-05-10T11:31:20Z',
      problemId: 'problem_1',
      userId: 'user_4',
    },
    {
      id: 'chat_1_4',
      content: 'You can set up a simple loan tracking system using Google Sheets or even Excel, which is free and effective for small community libraries. Create a spreadsheet with columns for Book Title, Author, Borrower Name, Contact Info, Date Borrowed, and Expected Return Date. There are also free open-source library management systems like OpenBiblio or Koha that can be installed on a basic computer. For a completely offline solution, a simple notebook or card system can work, where each book has a card that borrowers sign when taking it out.',
      role: 'assistant',
      createdAt: '2023-05-10T11:31:25Z',
      problemId: 'problem_1',
      userId: 'system',
    },
  ],
  'problem_2': [
    {
      id: 'chat_2_1',
      content: 'What are the most urgent supplies needed for flood relief?',
      role: 'user',
      createdAt: '2023-06-15T15:10:00Z',
      problemId: 'problem_2',
      userId: 'user_2',
    },
    {
      id: 'chat_2_2',
      content: 'For immediate flood relief, the most critical supplies include: 1) Clean drinking water and water purification tablets, 2) Ready-to-eat, non-perishable food items, 3) First aid kits and essential medications, 4) Blankets, dry clothes, and hygiene kits, 5) Temporary shelter materials like tarps and ropes, 6) Battery-powered flashlights and power banks, 7) Sanitation supplies like portable toilets and disinfectants. Prioritize distributing these items to vulnerable populations such as elderly people, children, pregnant women, and people with disabilities.',
      role: 'assistant',
      createdAt: '2023-06-15T15:10:05Z',
      problemId: 'problem_2',
      userId: 'system',
    },
  ],
  'problem_3': [
    {
      id: 'chat_3_1',
      content: 'What permits do I need for a home tailoring business?',
      role: 'user',
      createdAt: '2023-06-02T12:45:00Z',
      problemId: 'problem_3',
      userId: 'user_4',
    },
    {
      id: 'chat_3_2',
      content: 'For a home tailoring business in India, you typically need: 1) Shop and Establishment License from your local municipal corporation, 2) MSME (Micro, Small and Medium Enterprises) Registration which can be done online through the Udyam Registration portal, 3) GST Registration if your annual turnover exceeds ₹20 lakhs (₹10 lakhs for some states), 4) Income Tax registration (PAN card). If you\'re in a residential area, check if home-based businesses are permitted under local zoning regulations. Some localities may require a No Objection Certificate (NOC) from your housing society or neighborhood association.',
      role: 'assistant',
      createdAt: '2023-06-02T12:45:05Z',
      problemId: 'problem_3',
      userId: 'system',
    },
  ],
};

export const getChatHistory = async (problemId: string): Promise<ChatMessage[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const messages = MOCK_CHAT_MESSAGES[problemId] || [];
      resolve(messages);
    }, 500);
  });
};

export const sendChatMessage = async (message: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create the user message
      const newUserMessage: ChatMessage = {
        ...message,
        id: `chat_${Date.now()}_1`,
        createdAt: new Date().toISOString(),
      };
      
      // Simulate AI response
      const aiResponse = generateAIResponse(message.content, message.problemId);
      
      // Add messages to chat history
      if (!MOCK_CHAT_MESSAGES[message.problemId]) {
        MOCK_CHAT_MESSAGES[message.problemId] = [];
      }
      
      MOCK_CHAT_MESSAGES[message.problemId].push(newUserMessage);
      MOCK_CHAT_MESSAGES[message.problemId].push(aiResponse);
      
      resolve(newUserMessage);
    }, 600);
  });
};

// Helper function to generate AI responses
const generateAIResponse = (userMessage: string, problemId: string): ChatMessage => {
  let responseContent = '';
  
  // Simple pattern matching for responses
  if (userMessage.toLowerCase().includes('help') || userMessage.toLowerCase().includes('assist')) {
    responseContent = 'I can help you with your problem. Could you provide more specific details about what kind of assistance you need?';
  } else if (userMessage.toLowerCase().includes('thank')) {
    responseContent = 'You\'re welcome! If you need any more assistance, feel free to ask.';
  } else if (userMessage.toLowerCase().includes('how to') || userMessage.toLowerCase().includes('advice')) {
    responseContent = 'For specific advice, I\'d recommend first researching best practices in this area. You might also want to connect with one of our helper volunteers who specializes in this domain.';
  } else if (userMessage.toLowerCase().includes('contact') || userMessage.toLowerCase().includes('reach')) {
    responseContent = 'The best way to contact helpers is through the comment section of your post. This keeps communication transparent and allows others to benefit from the advice given.';
  } else {
    // Default response
    responseContent = 'I understand your question. The community helpers on this platform may be able to provide more specific assistance. In the meantime, consider adding more details to your problem description to attract the right helpers.';
  }
  
  return {
    id: `chat_${Date.now()}_2`,
    content: responseContent,
    role: 'assistant',
    createdAt: new Date().toISOString(),
    problemId,
    userId: 'system',
  };
};