
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createMessage, getMessagesByUserId } from "@/services/localDatabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { generateResponse, checkOllamaConnection } from "@/services/ollamaService";

// Define Message type since it's not exported from localDatabase
interface Message {
  id: string;
  userId: string;
  content: string;
  isAi: boolean;
  timestamp: Date;
}

const AiChatAssistant = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();
  const isArabic = language === "ar";
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaAvailable, setOllamaAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if Ollama service is available
    const checkOllama = async () => {
      const available = await checkOllamaConnection();
      setOllamaAvailable(available);
      
      if (!available) {
        console.log("Ollama service is not available. Using default responses.");
      }
    };
    
    checkOllama();

    if (user) {
      const userMessages = getMessagesByUserId(user.id);
      setMessages(userMessages);

      // Scroll to the bottom of the chat on initial load
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }
  }, [user]);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !user) return;
    
    // Create and add the user message
    const userMessage = createMessage({
      userId: user.id,
      content: message,
      isAi: false,
      timestamp: new Date()
    });
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setMessage("");
    setIsLoading(true);
    
    try {
      // Get response from medllama
      let aiResponse = "I'm unable to connect to the medical AI service at the moment.";
      
      if (ollamaAvailable) {
        aiResponse = await generateResponse(message);
      } else {
        aiResponse = "The MedLlama AI service is not available. Please ensure Ollama is running locally with the medllama model installed. To install the medllama model, run: 'ollama pull medllama' in your terminal.";
      }
      
      // Create and add the AI response
      const aiMessage = createMessage({
        userId: user.id,
        content: aiResponse,
        isAi: true,
        timestamp: new Date()
      });
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      
      // Create error message
      const errorMessage = createMessage({
        userId: user.id,
        content: "Sorry, I encountered an error. Please try again later.",
        isAi: true,
        timestamp: new Date()
      });
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 overflow-hidden mb-4">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">{isArabic ? "المساعد الصحي الذكي" : language === "fr" ? "Assistant Santé IA" : "AI Chat Assistant"}</h2>
          
          <Alert className="mb-4 bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertTitle className="text-amber-800 dark:text-amber-300 font-medium">
              {isArabic ? "تنبيه طبي مهم" : language === "fr" ? "Avis Médical Important" : "Important Medical Disclaimer"}
            </AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              {isArabic 
                ? "هذا المساعد الذكي ليس طبيباً وقد يرتكب أخطاء. يرجى استشارة طبيب مؤهل للحصول على المشورة الطبية الشخصية. لا تعتمد على هذه المعلومات لاتخاذ قرارات صحية مهمة."
                : language === "fr"
                ? "Cet assistant IA n'est pas un médecin et peut commettre des erreurs. Veuillez consulter un professionnel de la santé qualifié pour des conseils médicaux personnels. Ne vous fiez pas à ces informations pour prendre des décisions critiques concernant votre santé."
                : "This AI assistant is not a doctor and may make mistakes. Please consult with a qualified healthcare provider for personal medical advice. Do not rely on this information for critical health decisions."}
            </AlertDescription>
          </Alert>

          <div 
            ref={chatContainerRef}
            className="overflow-y-auto flex-1 mb-4 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            style={{ maxHeight: '400px' }}
          >
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground p-4">
                {isArabic 
                  ? "ابدأ محادثة مع المساعد الصحي الذكي. تذكر أن هذا ليس بديلاً عن استشارة الطبيب."
                  : language === "fr"
                  ? "Commencez une conversation avec l'assistant santé IA. Rappelez-vous que ce n'est pas un substitut à une consultation médicale."
                  : "Start a conversation with the AI health assistant. Remember this is not a substitute for consulting with a doctor."}
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`mb-2 p-3 rounded-lg ${msg.isAi 
                    ? 'bg-white dark:bg-gray-700 shadow-sm' 
                    : 'bg-blue-100 dark:bg-blue-900 text-right'}`}
                >
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {msg.isAi ? (
                      isArabic ? 'المساعد الذكي' : 
                      language === "fr" ? 'Assistant IA' : 'AI Assistant'
                    ) : (
                      isArabic ? 'أنت' : 
                      language === "fr" ? 'Vous' : 'You'
                    )} - {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                  <div className={msg.isAi ? "" : "font-medium"}>{msg.content}</div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isArabic ? "اكتب سؤالك هنا..." : language === "fr" ? "Tapez votre message ici..." : "Type your message here..."}
              className="flex-1"
              dir={isArabic ? "rtl" : "ltr"}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !message.trim()}>
              {isArabic ? "إرسال" : language === "fr" ? "Envoyer" : "Send"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AiChatAssistant;
