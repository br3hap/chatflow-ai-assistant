
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatState } from '../types/chat';
import { sendMessageToN8N } from '../services/chatService';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import LoadingDots from './LoadingDots';
import { toast } from 'sonner';

const ChatContainer: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const messageEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  const sendMessage = async (content: string) => {
    // Create a new user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    // Update state with user message
    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      // Send message to n8n webhook
      const response = await sendMessageToN8N(content);

      // Create AI response message
      const aiMessage: Message = {
        id: uuidv4(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
      };

      // Update state with AI response
      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      setChatState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Error al comunicarse con el servicio. Por favor, inténtalo de nuevo.',
      }));
      toast.error('Error al comunicarse con el servicio');
    }
  };

  const retryLastMessage = () => {
    // Find the last user message
    const lastUserMessage = [...chatState.messages]
      .reverse()
      .find((msg) => msg.sender === 'user');

    if (lastUserMessage) {
      sendMessage(lastUserMessage.content);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {chatState.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-3xl font-bold mb-4 font-playfair">Asistente IA</h1>
            <p className="text-muted-foreground max-w-md font-roboto">
              ¿En qué puedo ayudarte hoy? Estoy aquí para responder tus preguntas y brindarte asistencia.
            </p>
          </div>
        ) : (
          <>
            {chatState.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onRetry={message.sender === 'ai' ? retryLastMessage : undefined}
              />
            ))}
            {chatState.isLoading && (
              <div className="flex justify-start mb-4">
                <div className="rounded-lg px-4 py-3 bg-muted">
                  <LoadingDots />
                </div>
              </div>
            )}
            {chatState.error && (
              <div className="flex justify-center mb-4">
                <div className="rounded-lg px-4 py-3 bg-destructive text-destructive-foreground text-sm">
                  {chatState.error}
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messageEndRef} />
      </div>

      <ChatInput onSendMessage={sendMessage} isLoading={chatState.isLoading} />
    </div>
  );
};

export default ChatContainer;
