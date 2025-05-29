
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createMessage, getMessagesByUserId } from "@/services/localDatabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Bot } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { generateResponse, checkOllamaConnection } from "@/services/ollamaService";

// Message interface for type safety
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
  const isFrench = language === "fr";
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaAvailable, setOllamaAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if Al-Rāzī (MedLlama2) AI assistant is available
    const checkAlRazi = async () => {
      const available = await checkOllamaConnection();
      setOllamaAvailable(available);
      
      if (!available) {
        console.log("Al-Rāzī (MedLlama2) service is not available. Using default responses.");
      }
    };
    
    checkAlRazi();

    // Load user's chat history
    if (user) {
      const userMessages = getMessagesByUserId(user.id);
      setMessages(userMessages);

      // Auto-scroll to bottom on initial load
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }
  }, [user]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !user) return;
    
    // Create and add the user message to chat
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
      // Get response from Al-Rāzī (MedLlama2) AI assistant
      let aiResponse = "أنا الرازي، مساعدك الطبي الذكي، لكنني غير متاح حالياً.";
      
      if (ollamaAvailable) {
        aiResponse = await generateResponse(message);
      } else {
        aiResponse = isArabic 
          ? "أنا الرازي (Al-Rāzī)، مساعدك الطبي الذكي المسمى على اسم الطبيب الفارسي-العربي الأسطوري. لكن خدمة MedLlama2 غير متاحة حالياً. يرجى التأكد من تشغيل Ollama محلياً مع تثبيت نموذج medllama2."
          : isFrench
          ? "Je suis Al-Rāzī (الرازي), votre assistant médical IA nommé d'après le légendaire médecin persan-arabe. Le service MedLlama2 n'est pas disponible actuellement. Veuillez vous assurer qu'Ollama fonctionne localement avec le modèle medllama2 installé."
          : "I'm Al-Rāzī (الرازي), your medical AI assistant named after the legendary Persian-Arab doctor. The MedLlama2 service is not available right now. Please ensure Ollama is running locally with the medllama2 model installed.";
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
      console.error("Error generating Al-Rāzī response:", error);
      
      // Create error message in appropriate language
      const errorMessage = createMessage({
        userId: user.id,
        content: isArabic 
          ? "عذراً، واجهت خطأ. يرجى المحاولة مرة أخرى لاحقاً."
          : isFrench
          ? "Désolé, j'ai rencontré une erreur. Veuillez réessayer plus tard."
          : "Sorry, I encountered an error. Please try again later.",
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
      <Card className="flex-1 overflow-hidden mb-4 glass-morphism">
        <div className="p-6">
          {/* Header with Al-Rāzī branding */}
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-sage-100 dark:bg-sage-900/30 p-2 rounded-full">
              <Bot className="h-6 w-6 text-sage-600 dark:text-sage-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gradient">
                {isArabic ? "الرازي - المساعد الطبي الذكي" : 
                 isFrench ? "Al-Rāzī - Assistant Médical IA" : 
                 "Al-Rāzī - AI Medical Assistant"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isArabic ? "مسمى على اسم الطبيب الفارسي-العربي الأسطوري" :
                 isFrench ? "Nommé d'après le légendaire médecin persan-arabe" :
                 "Named after the legendary Persian-Arab doctor"}
              </p>
            </div>
          </div>
          
          {/* Medical disclaimer */}
          <Alert className="mb-6 bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertTitle className="text-amber-800 dark:text-amber-300 font-medium">
              {isArabic ? "تنبيه طبي مهم" : 
               isFrench ? "Avis Médical Important" : 
               "Important Medical Disclaimer"}
            </AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              {isArabic 
                ? "الرازي هو مساعد ذكي وليس طبيباً حقيقياً وقد يرتكب أخطاء. يرجى استشارة طبيب مؤهل للحصول على المشورة الطبية الشخصية."
                : isFrench
                ? "Al-Rāzī est un assistant IA et non un vrai médecin, et peut commettre des erreurs. Veuillez consulter un professionnel de la santé qualifié pour des conseils médicaux personnels."
                : "Al-Rāzī is an AI assistant and not a real doctor, and may make mistakes. Please consult with a qualified healthcare provider for personal medical advice."}
            </AlertDescription>
          </Alert>

          {/* Chat messages container */}
          <div 
            ref={chatContainerRef}
            className="overflow-y-auto flex-1 mb-6 p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-200/50 dark:border-gray-700/50"
            style={{ maxHeight: '400px' }}
          >
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground p-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-sage-400 animate-pulse-gentle" />
                <p className="text-lg font-medium mb-2">
                  {isArabic 
                    ? "مرحباً! أنا الرازي"
                    : isFrench
                    ? "Bonjour! Je suis Al-Rāzī"
                    : "Hello! I'm Al-Rāzī"}
                </p>
                <p>
                  {isArabic 
                    ? "ابدأ محادثة مع مساعدك الطبي الذكي. تذكر أن هذا ليس بديلاً عن استشارة الطبيب."
                    : isFrench
                    ? "Commencez une conversation avec votre assistant médical IA. Rappelez-vous que ce n'est pas un substitut à une consultation médicale."
                    : "Start a conversation with your AI medical assistant. Remember this is not a substitute for consulting with a doctor."}
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`mb-4 p-4 rounded-xl transition-all duration-300 ${msg.isAi 
                    ? 'bg-white dark:bg-gray-700/50 shadow-sm border border-sage-200/50 dark:border-sage-700/50' 
                    : 'bg-sage-100 dark:bg-sage-900/30 text-right ml-8'}`}
                >
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {msg.isAi ? (
                      <>
                        <Bot className="h-4 w-4 text-sage-500" />
                        {isArabic ? 'الرازي' : 
                         isFrench ? 'Al-Rāzī' : 'Al-Rāzī'}
                      </>
                    ) : (
                      <>
                        <div className="h-4 w-4 bg-sage-500 rounded-full"></div>
                        {isArabic ? 'أنت' : 
                         isFrench ? 'Vous' : 'You'}
                      </>
                    )} 
                    - {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                  <div className={`${msg.isAi ? "text-gray-700 dark:text-gray-200" : "font-medium text-sage-800 dark:text-sage-200"}`}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center justify-center p-6">
                <div className="flex items-center gap-3">
                  <Bot className="h-6 w-6 text-sage-500 animate-pulse" />
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-sage-500 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-sage-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="h-2 w-2 bg-sage-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-sage-600 dark:text-sage-400">
                    {isArabic ? "الرازي يفكر..." : 
                     isFrench ? "Al-Rāzī réfléchit..." : 
                     "Al-Rāzī is thinking..."}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Message input form */}
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isArabic ? "اسأل الرازي عن أي استفسار طبي..." : 
                          isFrench ? "Demandez à Al-Rāzī toute question médicale..." : 
                          "Ask Al-Rāzī any medical question..."}
              className="flex-1 input-modern resize-none"
              dir={isArabic ? "rtl" : "ltr"}
              disabled={isLoading}
              rows={3}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !message.trim()}
              className="btn-modern self-end"
            >
              {isArabic ? "إرسال" : isFrench ? "Envoyer" : "Send"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AiChatAssistant;
