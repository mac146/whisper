
import React, { useState, useEffect } from "react";
import { UserProvider, useUser } from "@/contexts/UserContext";
import OnboardingScreen from "@/components/OnboardingScreen";
import ChatRoom from "@/components/ChatRoom";
import { v4 as uuidv4 } from "uuid";

const ChatApp: React.FC = () => {
  const { user, setUser } = useUser();

  const handleOnboardingComplete = (age: number, gender: "male" | "female" | "other") => {
    setUser({
      id: uuidv4(),
      age,
      gender,
      isOnboarded: true,
    });
  };

  if (!user || !user.isOnboarded) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500">
            OneChat
          </h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto my-4 overflow-hidden">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-[calc(100vh-140px)]">
          <ChatRoom />
        </div>
      </main>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <UserProvider>
      <ChatApp />
    </UserProvider>
  );
};

export default Index;
