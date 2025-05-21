
import React from "react";
import { formatDistanceToNow } from "date-fns";
import Avatar from "./Avatar";

export interface MessageData {
  id: string;
  text: string;
  sender: {
    id: string;
    age: number;
    gender: "male" | "female" | "other";
  };
  timestamp: number;
  isCurrentUser: boolean;
}

interface MessageProps {
  message: MessageData;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div className={`flex gap-2 mb-3 ${message.isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar gender={message.sender.gender} />
      <div className="flex flex-col">
        <div className={message.isCurrentUser ? "user-message" : "other-message"}>
          <p>{message.text}</p>
        </div>
        <div className={`text-xs text-muted-foreground mt-1 ${message.isCurrentUser ? 'text-right' : 'text-left'}`}>
          <span>{message.sender.age}, {message.sender.gender}</span>
          <span className="mx-1">•</span>
          <span>{formatDistanceToNow(message.timestamp)} ago</span>
        </div>
      </div>
    </div>
  );
};

export default Message;
