
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SendHorizontal } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4 border-t dark:border-gray-700">
      <div className="relative flex-grow">
        <textarea
          className="w-full p-3 pr-10 rounded-md border border-input bg-background text-sm resize-none font-roboto focus:outline-none focus:ring-2 focus:ring-ring min-h-[60px] max-h-[200px]"
          placeholder="Escribe tu mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={isLoading}
          rows={1}
        />
      </div>
      <Button 
        type="submit" 
        disabled={isLoading || !message.trim()}
        className="h-10 w-10 p-0 rounded-full"
      >
        <SendHorizontal className="h-5 w-5" />
        <span className="sr-only">Enviar mensaje</span>
      </Button>
    </form>
  );
};

export default ChatInput;
