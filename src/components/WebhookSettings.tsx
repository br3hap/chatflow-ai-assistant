
import React, { useState } from 'react';
import { getWebhookUrl, setWebhookUrl } from '../services/chatService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface WebhookSettingsProps {
  onClose: () => void;
}

const WebhookSettings: React.FC<WebhookSettingsProps> = ({ onClose }) => {
  const [url, setUrl] = useState(getWebhookUrl());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('La URL del webhook no puede estar vacía');
      return;
    }
    
    try {
      // Verificar si es una URL válida
      new URL(url);
      
      setWebhookUrl(url);
      toast.success('URL del webhook actualizada correctamente');
      onClose();
    } catch (error) {
      toast.error('La URL ingresada no es válida');
    }
  };

  const handleResetToDefault = () => {
    const defaultUrl = 'http://localhost:5678/webhook/chatgptplus';
    setUrl(defaultUrl);
    setWebhookUrl(defaultUrl);
    toast.success('URL del webhook restablecida a valores predeterminados');
    onClose();
  };

  return (
    <div className="bg-background border rounded-lg p-6 m-4 shadow-md relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute top-2 right-2" 
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <h2 className="text-xl font-bold mb-4 font-playfair">Configuración del Webhook</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="webhook-url" className="block text-sm font-medium mb-1">
            URL del Webhook de n8n
          </label>
          <Input
            id="webhook-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Ingresa la URL completa del webhook"
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Ejemplo: https://tu-dominio.n8n.cloud/webhook/chatgptplus
          </p>
        </div>
        
        {url.includes('localhost') && (
          <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-md text-yellow-800 dark:text-yellow-200 text-xs">
            ⚠️ Estás usando una URL de localhost. Esta configuración solo funcionará si la aplicación 
            se ejecuta en tu máquina local y el servicio n8n está activo en ese puerto.
          </div>
        )}
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleResetToDefault}
          >
            Restablecer predeterminado
          </Button>
          <Button type="submit">
            Guardar configuración
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WebhookSettings;
