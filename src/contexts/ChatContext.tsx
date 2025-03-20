
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { processMessage } from '@/utils/chatUtils';

export type CourseLevel = 'undergraduate' | 'postgraduate' | 'diploma' | 'doctorate' | 'all';
export type SubjectArea = 'engineering' | 'medicine' | 'business' | 'arts' | 'science' | 'all';

export interface Message {
  id: string;
  content: string; // Changed from text to content to match MessageBubble component
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

interface ChatContextType {
  messages: Message[];
  loading: boolean;
  isTyping: boolean; // Added this property
  sendMessage: (text: string) => Promise<void>;
  filter: {
    level: CourseLevel;
    subject: SubjectArea;
  };
  setFilter: React.Dispatch<React.SetStateAction<{
    level: CourseLevel;
    subject: SubjectArea;
  }>>;
  clearMessages: () => void;
  clearChat: () => void; // Added this property
  setCourseFilter: (filter: { level: CourseLevel, subject: SubjectArea }) => void; // Added this property
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false); // Added isTyping state
  const [filter, setFilter] = useState<{
    level: CourseLevel;
    subject: SubjectArea;
  }>({
    level: 'all',
    subject: 'all',
  });

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error parsing saved messages:', error);
      }
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Set course filter function
  const setCourseFilter = (newFilter: { level: CourseLevel, subject: SubjectArea }) => {
    setFilter(newFilter);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: text, // Changed from text to content
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true); // Set typing to true when sending message
    
    try {
      // Process message and get response
      const response = await processMessage(text, filter);
      
      // Add bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response, // Changed from text to content
        sender: 'bot',
        timestamp: new Date(),
        status: 'sent'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error processing your request. Please try again.", // Changed from text to content
        sender: 'bot',
        timestamp: new Date(),
        status: 'error'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setIsTyping(false); // Set typing to false after message is sent
    }
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  // Added clearChat as an alias for clearMessages for backward compatibility
  const clearChat = () => {
    clearMessages();
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        isTyping,
        sendMessage,
        filter,
        setFilter,
        clearMessages,
        clearChat,
        setCourseFilter
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
