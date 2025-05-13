import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { saveMessage, getMessagesByUser, Message } from "@/services/localDatabase";
import { generateResponse } from "@/services/ollamaService";
import { useLanguage } from "@/contexts/LanguageContext";

const AiChatAssistant: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { t, language } = useLanguage();

  // Arabic specific style adjustments
  const rtlClass = language === "ar" ? "rtl text-right" : "ltr text-left";

  // Load message history
  useEffect(() => {
    if (user) {
      getMessagesByUser(user.id)
        .then((chatHistory) => {
          if (chatHistory.length === 0) {
            // Add welcome message if no history
            const welcomeMessage: Omit<Message, "id"> = {
              userId: user.id,
              content: language === "ar" 
                ? "مرحبًا! أنا مساعد الصحة الخاص بك. كيف يمكنني مساعدتك اليوم؟" 
                : "Hello! I'm your AI health assistant. How can I help you today?",
              timestamp: new Date().toISOString(),
              role: "bot"
            };
            
            saveMessage(welcomeMessage)
              .then(savedMessage => {
                setMessages([savedMessage]);
              });
          } else {
            setMessages(chatHistory);
          }
        })
        .catch(error => {
          console.error("Error loading chat history:", error);
        });
    }
  }, [user, language]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !user) return;
    
    const userMessage: Omit<Message, "id"> = {
      userId: user.id,
      content: input,
      timestamp: new Date().toISOString(),
      role: "user"
    };
    
    // Save user message
    const savedUserMessage = await saveMessage(userMessage);
    
    setMessages(prev => [...prev, savedUserMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Try to use Ollama Phi model first
      const response = await generateResponse(input);
      
      const botMessage: Omit<Message, "id"> = {
        userId: user.id,
        content: response,
        timestamp: new Date().toISOString(),
        role: "bot"
      };
      
      // Save bot message
      const savedBotMessage = await saveMessage(botMessage);
      
      setMessages(prev => [...prev, savedBotMessage]);
    } catch (error) {
      // Fallback to the simple AI response logic
      console.error("Error using Ollama:", error);
      setTimeout(async () => {
        const fallbackResponse = generateAIResponse(input);
        
        const botMessage: Omit<Message, "id"> = {
          userId: user.id,
          content: fallbackResponse,
          timestamp: new Date().toISOString(),
          role: "bot"
        };
        
        // Save bot message
        const savedBotMessage = await saveMessage(botMessage);
        
        setMessages(prev => [...prev, savedBotMessage]);
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (language === "ar") {
      // Arabic responses
      if (input.includes("صداع") || input.includes("ألم في الرأس")) {
        return "يمكن أن يكون للصداع أسباب عديدة بما في ذلك التوتر والجفاف وقلة النوم أو إجهاد العين. للصداع العرضي، قد يساعد الراحة والترطيب ومسكنات الألم التي لا تستلزم وصفة طبية. إذا كان الصداع حادًا أو مستمرًا، يرجى استشارة طبيبك.";
      }
      
      if (input.includes("حمى") || input.includes("درجة حرارة")) {
        return "الحمى غالبًا ما تكون علامة على أن جسمك يحارب العدوى. استرح، وابق رطبًا، وتناول الأسيتامينوفين أو الإيبوبروفين لخفض الحمى. إذا تجاوزت درجة حرارتك 39.4 درجة مئوية أو استمرت لأكثر من ثلاثة أيام، يرجى الاتصال بمقدم الرعاية الصحية الخاص بك.";
      }
      
      return "أنا هنا لتقديم معلومات صحية عامة. يرجى ملاحظة أنني لست بديلاً عن المشورة الطبية المهنية. إذا كنت تعاني من أعراض خطيرة، يرجى الاتصال بطبيبك أو خدمات الطوارئ.";
    } else {
      // English responses (keep the original logic)
      if (input.includes("headache") || input.includes("head ache") || input.includes("head pain")) {
        return "Headaches can have many causes including stress, dehydration, lack of sleep, or eye strain. For occasional headaches, rest, hydration, and over-the-counter pain relievers may help. If headaches are severe or persistent, please consult with your doctor.";
      }
      
      if (input.includes("fever") || input.includes("temperature")) {
        return "Fever is often a sign that your body is fighting an infection. Rest, stay hydrated, and take acetaminophen or ibuprofen to reduce fever. If your temperature exceeds 103°F (39.4°C) or lasts more than three days, please contact your healthcare provider.";
      }
      
      if (input.includes("cough") || input.includes("cold") || input.includes("flu")) {
        return "Rest, stay hydrated, and consider over-the-counter medications for symptom relief. If symptoms worsen or last more than a week, please schedule an appointment with your doctor.";
      }
      
      if (input.includes("appointment") || input.includes("book") || input.includes("schedule")) {
        return "You can schedule an appointment using our appointment booking feature in the patient dashboard. Would you like more information about that?";
      }
      
      return "I'm here to provide general health information. Please note that I'm not a replacement for professional medical advice. If you're experiencing serious symptoms, please contact your doctor or emergency services.";
    }
  };

  return (
    <div className={`h-full flex flex-col ${rtlClass}`}>
      <div className="bg-hospital-600 text-white p-4">
        <h2 className="text-xl font-bold">{t("healthAssistant")}</h2>
        <p className="text-sm opacity-80">
          {language === "ar" 
            ? "اسأل أسئلة حول الأعراض أو الأدوية أو النصائح الصحية العامة" 
            : "Ask questions about symptoms, medications, or general health advice"}
        </p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id || index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`p-3 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-hospital-100 dark:bg-hospital-900 border-hospital-200"
                    : "bg-white dark:bg-gray-800"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString(language === "ar" ? "ar-SA" : "en-US")}
                </p>
              </Card>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <Card className="p-3 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="border-t p-4 bg-white dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === "ar" ? "اكتب سؤالك الصحي..." : "Type your health question..."}
            disabled={isLoading}
            className="flex-1"
            dir={language === "ar" ? "rtl" : "ltr"}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()} 
            className="bg-hospital-600 hover:bg-hospital-700"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">{language === "ar" ? "إرسال" : "Send"}</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AiChatAssistant;
