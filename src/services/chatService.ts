
/**
 * Service for handling chat API requests to n8n
 */

const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/chatgptplus';

export const sendMessageToN8N = async (message: string): Promise<string> => {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
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
    throw error;
  }
};
