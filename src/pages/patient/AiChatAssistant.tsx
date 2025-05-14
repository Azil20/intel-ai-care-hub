
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
  const { language } = useLanguage();
  const isArabic = language === "ar";

  useEffect(() => {
    if (user) {
      const userMessages = getMessagesByUserId(user.id);
      setMessages(userMessages);

      // Scroll to the bottom of the chat on initial load and when new messages are added
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }
  }, [user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !user) return;
    
    // Create a new message
    const newMessage = createMessage({
      userId: user.id,
      content: message,
      isAi: false,
      timestamp: new Date()
    });
    
    // Add the new message to the state
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setMessage("");
    
    // Scroll to the bottom after sending a message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 overflow-hidden mb-4">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">{isArabic ? "المساعد الصحي الذكي" : "AI Chat Assistant"}</h2>
          
          <Alert className="mb-4 bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertTitle className="text-amber-800 dark:text-amber-300 font-medium">
              {isArabic ? "تنبيه طبي مهم" : "Important Medical Disclaimer"}
            </AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              {isArabic 
                ? "هذا المساعد الذكي ليس طبيباً وقد يرتكب أخطاء. يرجى استشارة طبيب مؤهل للحصول على المشورة الطبية الشخصية. لا تعتمد على هذه المعلومات لاتخاذ قرارات صحية مهمة."
                : "This AI assistant is not a doctor and may make mistakes. Please consult with a qualified healthcare provider for personal medical advice. Do not rely on this information for critical health decisions."}
            </AlertDescription>
          </Alert>

          <div 
            ref={chatContainerRef}
            className="overflow-y-auto flex-1 mb-4 p-2"
            style={{ maxHeight: '400px' }}
          >
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground p-4">
                {isArabic 
                  ? "ابدأ محادثة مع المساعد الصحي الذكي. تذكر أن هذا ليس بديلاً عن استشارة الطبيب."
                  : "Start a conversation with the AI health assistant. Remember this is not a substitute for consulting with a doctor."}
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`mb-2 p-2 rounded-md ${msg.isAi 
                    ? 'bg-gray-100 dark:bg-gray-700 text-left' 
                    : 'bg-blue-100 dark:bg-blue-900 text-right'}`}
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {msg.isAi ? (isArabic ? 'المساعد الذكي' : 'AI Assistant') : (isArabic ? 'أنت' : 'You')} - {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                  <div>{msg.content}</div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isArabic ? "اكتب سؤالك هنا..." : "Type your message here..."}
              className="flex-1"
              dir={isArabic ? "rtl" : "ltr"}
            />
            <Button type="submit">{isArabic ? "إرسال" : "Send"}</Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AiChatAssistant;
