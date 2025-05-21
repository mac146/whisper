
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import Message, { MessageData } from "./Message";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/components/ui/use-toast";

// Sample messages for demo purposes
const sampleMessages: Omit<MessageData, 'isCurrentUser'>[] = [
  {
    id: "1",
    text: "Hey everyone! How's it going?",
    sender: {
      id: "user1",
      age: 24,
      gender: "female"
    },
    timestamp: Date.now() - 1000 * 60 * 15 // 15 minutes ago
  },
  {
    id: "2",
    text: "Just joined the chat. This anonymous chat concept is pretty cool!",
    sender: {
      id: "user2",
      age: 32,
      gender: "male"
    },
    timestamp: Date.now() - 1000 * 60 * 10 // 10 minutes ago
  },
  {
    id: "3",
    text: "Anyone here into hiking? I went on an amazing trail last weekend!",
    sender: {
      id: "user3",
      age: 28,
      gender: "other"
    },
    timestamp: Date.now() - 1000 * 60 * 5 // 5 minutes ago
  }
];

const ChatRoom: React.FC = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Load sample messages on first render
  useEffect(() => {
    if (user) {
      const processedMessages = sampleMessages.map(msg => ({
        ...msg,
        isCurrentUser: msg.sender.id === user.id
      }));
      setMessages(processedMessages);
    }
  }, [user]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;
    
    const newMessageObj: MessageData = {
      id: Date.now().toString(),
      text: newMessage,
      sender: {
        id: user.id,
        age: user.age,
        gender: user.gender
      },
      timestamp: Date.now(),
      isCurrentUser: true
    };
    
    setMessages([...messages, newMessageObj]);
    setNewMessage("");

    // Simulate a response after a short delay
    setTimeout(() => {
      const responses = [
        "That's interesting!",
        "I agree with you",
        "Thanks for sharing that",
        "I hadn't thought about it that way before",
        "Very cool perspective!"
      ];

      const genders: ("male" | "female" | "other")[] = ["male", "female", "other"];
      const randomGender = genders[Math.floor(Math.random() * genders.length)];
      const randomAge = Math.floor(Math.random() * 30) + 18; // Random age between 18 and 48
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const responseMsg: MessageData = {
        id: Date.now().toString(),
        text: randomResponse,
        sender: {
          id: `random-${Date.now()}`,
          age: randomAge,
          gender: randomGender
        },
        timestamp: Date.now(),
        isCurrentUser: false
      };

      setMessages(prevMessages => [...prevMessages, responseMsg]);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-secondary/50 border-b">
        <h2 className="text-lg font-semibold text-center">Global Chat Room</h2>
        <p className="text-sm text-center text-muted-foreground">
          Chat anonymously with others. Only age and gender are shared.
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col space-y-1">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-background">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;
