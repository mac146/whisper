
import React from "react";
import { User, GenderMale, GenderFemale } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  gender: "male" | "female" | "other";
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ gender, className }) => {
  const bgColor = 
    gender === "male" ? "bg-blue-100 text-blue-500" : 
    gender === "female" ? "bg-pink-100 text-pink-500" : 
    "bg-purple-100 text-purple-500";
  
  const Icon = 
    gender === "male" ? GenderMale : 
    gender === "female" ? GenderFemale : 
    User;

  return (
    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", bgColor, className)}>
      <Icon size={18} />
    </div>
  );
};

export default Avatar;
