
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Bot, Send, User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const AiChatAssistant: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI Health Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);
    
    // Simulate AI response (in a real app, this would call a local ML model)
    setTimeout(() => {
      const botResponse = generateResponse(userMessage.content);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: botResponse,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setIsProcessing(false);
    }, 1500);
  };

  // Mock AI response generator
  const generateResponse = (query: string): string => {
    // Simple keyword-based responses for demo
    const lowerQuery = query.toLowerCase();
    
    if (/fever|temperature|hot/.test(lowerQuery)) {
      return "For mild fevers (below 100.4°F or 38°C), rest and drink plenty of fluids. If your fever is higher, persists for more than three days, or is accompanied by severe symptoms, you should consult with a healthcare provider.";
    }
    
    if (/headache|head pain|migraine/.test(lowerQuery)) {
      return "Headaches can be caused by many factors including stress, dehydration, lack of sleep, or eye strain. For occasional headaches, rest in a dark quiet room and over-the-counter pain relievers may help. If headaches are severe, sudden, or accompanied by other symptoms, please consult your doctor.";
    }
    
    if (/cold|cough|sneez|runny nose/.test(lowerQuery)) {
      return "For common colds, rest, staying hydrated, and over-the-counter cold medications can help manage symptoms. If symptoms worsen after 7-10 days or you develop a high fever, you should consult with a healthcare provider.";
    }
    
    if (/diet|nutrition|eat|food/.test(lowerQuery)) {
      return "A balanced diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats is recommended. Try to limit processed foods, added sugars, and excessive salt. It's important to stay hydrated by drinking plenty of water throughout the day.";
    }
    
    if (/exercise|workout|physical activity/.test(lowerQuery)) {
      return "Regular physical activity is important for overall health. Aim for at least 150 minutes of moderate activity or 75 minutes of vigorous activity per week, plus muscle-strengthening activities twice a week. Always consult your doctor before starting a new exercise routine.";
    }
    
    if (/sleep|insomnia|tired/.test(lowerQuery)) {
      return "Adults should aim for 7-9 hours of quality sleep per night. To improve sleep, maintain a regular sleep schedule, create a restful environment, limit screen time before bed, avoid caffeine and large meals before sleeping, and establish a relaxing bedtime routine.";
    }
    
    if (/stress|anxiety|depress|mental health/.test(lowerQuery)) {
      return "Managing stress through techniques like deep breathing, meditation, physical activity, and maintaining social connections can help. If you're experiencing persistent feelings of anxiety or depression that interfere with daily life, please speak with a healthcare provider.";
    }
    
    // Default response
    return "I'm your AI health assistant running locally on your device. While I can provide general health information, I'm not a substitute for professional medical advice. For specific health concerns, please consult with your healthcare provider.";
  };

  return (
    <Card className="h-[calc(100vh-12rem)]">
      <CardHeader>
        <CardTitle>AI Health Assistant</CardTitle>
        <CardDescription>Ask questions about your health and get instant guidance</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100%-5rem)]">
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg p-4",
                    message.sender === "user"
                      ? "ml-auto max-w-[80%] bg-primary text-primary-foreground"
                      : "mr-auto max-w-[80%] bg-muted"
                  )}
                >
                  <div className={cn(
                    "rounded-full p-2 flex items-center justify-center",
                    message.sender === "user" ? "bg-primary-foreground" : "bg-primary"
                  )}>
                    {message.sender === "user" ? (
                      <User className={cn("h-4 w-4", message.sender === "user" ? "text-primary" : "text-primary-foreground")} />
                    ) : (
                      <Bot className={cn("h-4 w-4", message.sender === "user" ? "text-primary" : "text-primary-foreground")} />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p>{message.content}</p>
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-center gap-2 mr-auto max-w-[80%] rounded-lg p-4 bg-muted">
                  <div className="animate-pulse-slow h-2 w-2 bg-primary rounded-full"></div>
                  <div className="animate-pulse-slow h-2 w-2 bg-primary rounded-full animation-delay-200"></div>
                  <div className="animate-pulse-slow h-2 w-2 bg-primary rounded-full animation-delay-400"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>
        
        <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-2">
          <Input
            placeholder="Type your health question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isProcessing || !input.trim()}
            className="bg-teal-500 hover:bg-teal-600"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p className="text-center">
            This AI runs locally on your device. No data is sent to external servers.
            <br />
            For medical emergencies, please call emergency services immediately.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function for class names
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default AiChatAssistant;
