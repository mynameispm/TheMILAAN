import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot } from 'lucide-react';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';
import { getChatHistory, sendChatMessage } from '../../services/chatService';
import { ChatMessage } from '../../types';
import { formatTimeAgo } from '../../utils/formatters';

interface AIChatBoxProps {
  problemId: string;
}

const AIChatBox: React.FC<AIChatBoxProps> = ({ problemId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await getChatHistory(problemId);
        setMessages(history);
      } catch (error) {
        console.error('Failed to load chat history', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, [problemId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('You need to be logged in to use the chat');
      return;
    }
    
    if (!newMessage.trim()) return;
    
    setIsSending(true);
    
    try {
      // Add user message to UI immediately
      const userMessage: ChatMessage = {
        id: `temp_${Date.now()}`,
        content: newMessage,
        role: 'user',
        createdAt: new Date().toISOString(),
        problemId,
        userId: user.id,
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // Send to API and get AI response
      await sendChatMessage({
        content: newMessage,
        role: 'user',
        problemId,
        userId: user.id,
      });
      
      // Reload chat history to get AI response
      const updatedHistory = await getChatHistory(problemId);
      setMessages(updatedHistory);
    } catch (error) {
      console.error('Failed to send message', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="bg-primary-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <div className="p-1.5 bg-primary-500 rounded-full text-white mr-2">
            <Bot size={18} />
          </div>
          <h3 className="font-medium">AI Assistant</h3>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Ask questions about this problem to get immediate help
        </p>
      </div>
      
      <div className="h-[300px] overflow-y-auto p-4 bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <Bot size={32} className="mx-auto mb-2 text-primary-300" />
                <p>No messages yet. Ask a question to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`
                      max-w-[80%] rounded-lg p-3 
                      ${message.role === 'user' 
                        ? 'bg-primary-100 text-gray-800 rounded-br-none' 
                        : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none'}
                    `}>
                      <div className="mb-1 flex items-center justify-between">
                        <div className="flex items-center">
                          {message.role === 'assistant' ? (
                            <div className="p-1 bg-primary-500 rounded-full text-white mr-1">
                              <Bot size={12} />
                            </div>
                          ) : (
                            <Avatar
                              src={user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                              alt={user?.name || 'User'}
                              size="xs"
                              className="mr-1"
                            />
                          )}
                          <span className="text-xs font-medium">
                            {message.role === 'assistant' ? 'AI Assistant' : user?.name || 'You'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 ml-2">
                          {formatTimeAgo(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="p-3 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ask a question..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!user || isSending}
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSending}
            disabled={!user}
            icon={<Send size={16} />}
          >
            Send
          </Button>
        </form>
        {!user && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            You need to be logged in to use the chat
          </p>
        )}
      </div>
    </div>
  );
};

export default AIChatBox;