
import React, { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Male, Female, User } from "lucide-react";

interface OnboardingScreenProps {
  onComplete: (age: number, gender: "male" | "female" | "other") => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female" | "other" | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!age || !gender) {
      toast({
        title: "Missing information",
        description: "Please provide both your age and gender to continue.",
        variant: "destructive",
      });
      return;
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 13 || parsedAge > 120) {
      toast({
        title: "Invalid age",
        description: "Please enter a valid age between 13 and 120.",
        variant: "destructive",
      });
      return;
    }

    onComplete(parsedAge, gender);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to AnonyChat</CardTitle>
          <CardDescription>
            Chat anonymously with others. We only need minimal info to get started.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="age">Your Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                min="13"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Your Gender</Label>
              <RadioGroup value={gender || ""} onValueChange={(value) => setGender(value as "male" | "female" | "other")}>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-secondary">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="flex items-center cursor-pointer">
                      <Male className="w-5 h-5 mr-2 text-blue-500" />
                      Male
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-secondary">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="flex items-center cursor-pointer">
                      <Female className="w-5 h-5 mr-2 text-pink-500" />
                      Female
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-secondary">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="flex items-center cursor-pointer">
                      <User className="w-5 h-5 mr-2 text-purple-500" />
                      Other
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600">
              Start Chatting
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default OnboardingScreen;
