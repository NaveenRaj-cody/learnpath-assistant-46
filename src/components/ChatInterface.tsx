import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, ArrowDown, Trash2, Sparkles, LogIn } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import MessageBubble from './MessageBubble';
import AnimatedTransition from './AnimatedTransition';
import { useNavigate } from 'react-router-dom';

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const { messages, isTyping, sendMessage, clearChat } = useChat();
  const { isLoggedIn } = useAuth();
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const checkScroll = () => {
      if (!chatContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollButton(isScrolledUp);
    };

    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    
    sendMessage(messageInput);
    setMessageInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center h-full p-8 text-center space-y-4 glass-panel rounded-2xl",
        className
      )}>
        <Sparkles className="h-12 w-12 text-primary/50 animate-pulse" />
        <h3 className="text-xl font-medium">Login to Access Chat Assistant</h3>
        <p className="text-muted-foreground">
          Please login to use our AI career assistant and get personalized guidance.
        </p>
        <Button 
          onClick={() => navigate('/login')}
          className="mt-4 hover:bg-primary/90 hover:shadow-md active:scale-95 transition-all"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Login Now
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col h-full overflow-hidden rounded-2xl glass-panel transition-all duration-300 ease-in-out",
      className
    )}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>AI Career Assistant</span>
        </h2>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearChat}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 active:scale-95 transition-all"
        >
          <Trash2 className="h-4 w-4 mr-1" /> Clear
        </Button>
      </div>

      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 scroll-smooth"
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && (
            <MessageBubble 
              message={{
                id: 'typing',
                content: 'Thinking',
                sender: 'bot',
                timestamp: new Date(),
                status: 'sending'
              }} 
              isTyping={true} 
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {showScrollButton && (
        <Button
          className="absolute bottom-20 right-4 rounded-full w-10 h-10 p-0 shadow-md bg-background/80 backdrop-blur-sm hover:shadow-lg active:scale-95 transition-all"
          size="icon"
          onClick={scrollToBottom}
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="relative">
          <Textarea
            ref={messageInputRef}
            placeholder="Ask about courses, colleges, or career opportunities in India..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="resize-none pr-12 glass-input min-h-[60px] max-h-[200px] focus:shadow-md transition-all"
            rows={1}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!messageInput.trim()}
            className="absolute right-2 bottom-2 rounded-full w-8 h-8 p-0 hover:bg-primary/90 active:scale-95 transition-all"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 flex justify-start gap-2">
          <AnimatedTransition>
            <SuggestionChip 
              onClick={() => sendMessage("What are the best engineering colleges in India?")}
            >
              Top IITs & NITs
            </SuggestionChip>
          </AnimatedTransition>
          <AnimatedTransition showDelay={100}>
            <SuggestionChip 
              onClick={() => sendMessage("Career options after B.Tech in India")}
            >
              B.Tech careers
            </SuggestionChip>
          </AnimatedTransition>
          <AnimatedTransition showDelay={200}>
            <SuggestionChip 
              onClick={() => sendMessage("MBBS colleges in India")}
            >
              MBBS options
            </SuggestionChip>
          </AnimatedTransition>
        </div>
      </form>
    </div>
  );
};

interface SuggestionChipProps {
  children: React.ReactNode;
  onClick: () => void;
}

const SuggestionChip: React.FC<SuggestionChipProps> = ({ children, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 active:scale-95 hover:shadow-sm transition-all"
    >
      <Sparkles className="h-3 w-3 mr-1" />
      {children}
    </button>
  );
};

export default ChatInterface;
