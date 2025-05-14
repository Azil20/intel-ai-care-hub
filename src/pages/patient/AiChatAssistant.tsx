
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createMessage, getMessagesByUserId } from "@/services/localDatabase";

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
      <Card className="flex-1 overflow-hidden">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">AI Chat Assistant</h2>
          
          <div 
            ref={chatContainerRef}
            className="overflow-y-auto flex-1 mb-4 p-2"
            style={{ maxHeight: '400px' }}
          >
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`mb-2 p-2 rounded-md ${msg.isAi ? 'bg-gray-100 dark:bg-gray-700 text-left' : 'bg-blue-100 dark:bg-blue-700 text-right'}`}
              >
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {msg.isAi ? 'AI Assistant' : 'You'} - {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
                <div>{msg.content}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1"
            />
            <Button type="submit">Send</Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AiChatAssistant;
