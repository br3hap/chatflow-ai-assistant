
/**
 * Service for handling chat API requests to n8n
 */

// Establecemos un valor predeterminado que puede ser cambiado
let webhookUrl = 'http://localhost:5678/webhook/chatgptplus';

export const setWebhookUrl = (url: string) => {
  webhookUrl = url;
};

export const getWebhookUrl = (): string => {
  return webhookUrl;
};

export const sendMessageToN8N = async (message: string): Promise<string> => {
  try {
    // Verificamos si la URL contiene localhost y mostramos una advertencia en la consola
    if (webhookUrl.includes('localhost')) {
      console.warn('Estás usando una URL de localhost. Este webhook solo funcionará si la aplicación se ejecuta localmente.');
    }
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.message || data.response || data.text || JSON.stringify(data);
  } catch (error) {
    console.error('Error sending message to n8n:', error);
    
    // Mensaje de error más descriptivo basado en el tipo de error
    if (error instanceof TypeError && error.message.includes('NetworkError')) {
      throw new Error('No se pudo conectar al webhook. Si estás usando localhost, asegúrate de que tu servidor n8n esté en ejecución y accesible.');
    }
    
    throw error;
  }
};
