
import React from 'react';
import { Message } from '../types/chat';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Save } from 'lucide-react';
import { toast } from 'sonner';

interface MessageBubbleProps {
  message: Message;
  onRetry?: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onRetry }) => {
  const isUser = message.sender === 'user';

  const handleSaveResponse = () => {
    // In a real app, this would save to localStorage or a database
    const savedResponses = JSON.parse(localStorage.getItem('savedResponses') || '[]');
    savedResponses.push({
      id: message.id,
      content: message.content,
      timestamp: message.timestamp
    });
    localStorage.setItem('savedResponses', JSON.stringify(savedResponses));
    toast.success('Respuesta guardada correctamente');
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div
        className={`rounded-lg px-4 py-3 max-w-[80%] ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        <p className="font-roboto text-sm md:text-base whitespace-pre-wrap">
          {message.content}
        </p>
        
        {!isUser && (
          <div className="flex mt-3 space-x-2">
            {onRetry && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={onRetry}
              >
                <RefreshCcw className="h-3 w-3 mr-1" />
                Intentar de nuevo
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={handleSaveResponse}
            >
              <Save className="h-3 w-3 mr-1" />
              Guardar respuesta
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
