
// Service for connecting to Ollama MedLlama2 model - Al-Rāzī AI Assistant
// Al-Rāzī (الرازي) – Named after the legendary Persian-Arab doctor
const OLLAMA_API_URL = "http://localhost:11434/api/generate";

export interface OllamaResponse {
  response: string;
}

// Generate response using Al-Rāzī (MedLlama2) AI assistant
export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    // Add context about Al-Rāzī to improve medical responses
    const contextualPrompt = `As Al-Rāzī (الرازي), a medical AI assistant named after the legendary Persian-Arab doctor, please provide helpful medical information: ${prompt}`;
    
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'medllama2', // Updated to medllama2
        prompt: contextualPrompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as OllamaResponse;
    return data.response;
  } catch (error) {
    console.error("Error connecting to Al-Rāzī (MedLlama2):", error);
    return "I'm Al-Rāzī (الرازي), your medical AI assistant, but I'm unable to connect to the service at the moment. Please ensure Ollama is running locally with the medllama2 model installed.";
  }
};

// Check if Al-Rāzī (MedLlama2) is available
export const checkOllamaConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'medllama2', // Updated to medllama2
        prompt: 'Say "Al-Rāzī is connected" if you can read this message.',
        stream: false,
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error("Al-Rāzī (MedLlama2) connection check failed:", error);
    return false;
  }
};
