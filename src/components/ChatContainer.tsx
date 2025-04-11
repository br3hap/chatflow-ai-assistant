
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatState } from '../types/chat';
import { sendMessageToN8N, getWebhookUrl, setWebhookUrl } from '../services/chatService';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import LoadingDots from './LoadingDots';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import WebhookSettings from './WebhookSettings';

const ChatContainer: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });
  const [showSettings, setShowSettings] = useState(false);

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
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al comunicarse con el servicio. Por favor, inténtalo de nuevo.';
      
      setChatState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      if (getWebhookUrl().includes('localhost')) {
        toast.error('Error al conectar con el webhook local. Considera configurar una URL accesible desde Internet.');
      } else {
        toast.error(errorMessage);
      }
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

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end p-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleSettings}
          className="flex items-center gap-1"
        >
          <Settings className="h-4 w-4" />
          Configuración
        </Button>
      </div>

      {showSettings && (
        <WebhookSettings onClose={() => setShowSettings(false)} />
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {chatState.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-3xl font-bold mb-4 font-playfair">Asistente IA</h1>
            <p className="text-muted-foreground max-w-md font-roboto">
              ¿En qué puedo ayudarte hoy? Estoy aquí para responder tus preguntas y brindarte asistencia.
            </p>
            
            {getWebhookUrl().includes('localhost') && (
              <div className="mt-6 bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg max-w-md text-yellow-800 dark:text-yellow-200 text-sm">
                <p className="font-medium">⚠️ Configuración de localhost detectada</p>
                <p className="mt-2">
                  Estás usando una URL de webhook local ({getWebhookUrl()}). 
                  Esta configuración solo funcionará si la aplicación se ejecuta en tu máquina local 
                  y el servicio n8n está activo en ese puerto.
                </p>
                <p className="mt-2">
                  Haz clic en el botón "Configuración" para cambiar la URL del webhook.
                </p>
              </div>
            )}
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
