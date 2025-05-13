
// Service for connecting to Ollama Phi model
const OLLAMA_API_URL = "http://localhost:11434/api/generate";

export interface OllamaResponse {
  response: string;
}

export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'phi',
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as OllamaResponse;
    return data.response;
  } catch (error) {
    console.error("Error connecting to Ollama:", error);
    return "I'm unable to connect to the AI service at the moment. Please ensure Ollama is running locally with the phi model installed.";
  }
};
