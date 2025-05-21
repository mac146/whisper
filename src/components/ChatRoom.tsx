
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, SkipForward, StopCircle } from "lucide-react";
import Message, { MessageData } from "./Message";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/components/ui/use-toast";

// Define proper type for chat partners
type ChatPartner = {
  id: string;
  age: number;
  gender: "male" | "female" | "other";
  intro: string;
};

// Sample chat partners for one-on-one chats
const chatPartners: ChatPartner[] = [
  {
    id: "partner1",
    age: 24,
    gender: "female",
    intro: "Hi there! I love photography and traveling. How are you today?"
  },
  {
    id: "partner2",
    age: 32,
    gender: "male",
    intro: "Hello! I'm interested in technology and sports. What about you?"
  },
  {
    id: "partner3",
    age: 28,
    gender: "other",
    intro: "Hey! I enjoy reading books and hiking. What do you like to do in your free time?"
  },
  {
    id: "partner4",
    age: 22,
    gender: "female",
    intro: "Hey there! I'm into music and art. What kind of music do you listen to?"
  },
  {
    id: "partner5",
    age: 35,
    gender: "male",
    intro: "Hi! I love cooking and watching movies. What's your favorite dish?"
  }
];

const ChatRoom: React.FC = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentPartner, setCurrentPartner] = useState<ChatPartner | null>(null);
  const [isChatActive, setIsChatActive] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Start a new chat with a random partner when component mounts or when skipped
  useEffect(() => {
    if (user && isChatActive) {
      startNewChat();
    }
  }, [user, isChatActive]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startNewChat = () => {
    // Clear previous messages
    setMessages([]);
    
    // Get random partner
    const randomIndex = Math.floor(Math.random() * chatPartners.length);
    const partner = chatPartners[randomIndex];
    setCurrentPartner(partner);
    
    // Add intro message from partner
    const introMessage: MessageData = {
      id: Date.now().toString(),
      text: partner.intro,
      sender: {
        id: partner.id,
        age: partner.age,
        gender: partner.gender
      },
      timestamp: Date.now(),
      isCurrentUser: false
    };
    
    setMessages([introMessage]);
  };

  const handleSkipPartner = () => {
    toast({
      title: "Skipping to next person",
      description: "Finding a new chat partner...",
    });
    
    startNewChat();
  };

  const handleStopChat = () => {
    setIsChatActive(false);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        text: "You've ended this chat. Click 'Start New Chat' to chat with someone else.",
        sender: {
          id: "system",
          age: 0,
          gender: "other" as "male" | "female" | "other"
        },
        timestamp: Date.now(),
        isCurrentUser: false,
        isSystemMessage: true
      }
    ]);
    
    toast({
      title: "Chat ended",
      description: "You've stopped the current conversation.",
    });
  };

  const handleRestartChat = () => {
    setIsChatActive(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user || !isChatActive) return;
    
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

    // Simulate partner response after a short delay
    if (currentPartner) {
      setTimeout(() => {
        const responses = [
          "That's interesting!",
          "I agree with you",
          "Thanks for sharing that",
          "I hadn't thought about it that way before",
          "Very cool perspective!",
          "Tell me more about that",
          "What else do you enjoy doing?",
          "That sounds fun!",
          "I've had a similar experience once",
          "How long have you been interested in that?"
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        const responseMsg: MessageData = {
          id: Date.now().toString(),
          text: randomResponse,
          sender: {
            id: currentPartner.id,
            age: currentPartner.age,
            gender: currentPartner.gender
          },
          timestamp: Date.now(),
          isCurrentUser: false
        };

        setMessages(prevMessages => [...prevMessages, responseMsg]);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-secondary/50 border-b">
        <h2 className="text-lg font-semibold text-center">One-on-One Chat</h2>
        <p className="text-sm text-center text-muted-foreground">
          {currentPartner ? `Chatting with a ${currentPartner.age} year old (${currentPartner.gender})` : "Loading chat..."}
        </p>
        <div className="flex justify-center space-x-4 mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-yellow-600 border-yellow-600 hover:bg-yellow-100 hover:text-yellow-700" 
            onClick={handleSkipPartner}
            disabled={!isChatActive}
          >
            <SkipForward className="mr-1" size={16} />
            Skip
          </Button>
          {isChatActive ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 border-red-600 hover:bg-red-100 hover:text-red-700"
              onClick={handleStopChat}
            >
              <StopCircle className="mr-1" size={16} />
              End Chat
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-green-600 border-green-600 hover:bg-green-100 hover:text-green-700"
              onClick={handleRestartChat}
            >
              Start New Chat
            </Button>
          )}
        </div>
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
            placeholder={isChatActive ? "Type your message..." : "Chat has ended"}
            className="flex-1"
            disabled={!isChatActive}
          />
          <Button type="submit" size="icon" disabled={!isChatActive}>
            <Send size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;
