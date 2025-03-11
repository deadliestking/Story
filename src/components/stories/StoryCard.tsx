import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";

interface StoryCardProps {
  id?: string;
  title?: string;
  description?: string;
  coverImage?: string;
  theme?: "medieval" | "futuristic" | "horror";
  progress?: number;
  isInProgress?: boolean;
}

const StoryCard = ({
  id = "story-1",
  title = "The Lost Kingdom",
  description = "Embark on an epic journey through ancient ruins and mystical forests to reclaim a forgotten throne.",
  coverImage = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
  theme = "medieval",
  progress = 35,
  isInProgress = false,
}: StoryCardProps) => {
  // Theme color mapping
  const themeColors = {
    medieval: "bg-amber-100 text-amber-800",
    futuristic: "bg-blue-100 text-blue-800",
    horror: "bg-red-100 text-red-800",
  };

  return (
    <Card className="w-80 h-[400px] flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg bg-white">
      <div className="relative h-48 overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge
          className={`absolute top-3 right-3 ${themeColors[theme]}`}
          variant="outline"
        >
          {theme.charAt(0).toUpperCase() + theme.slice(1)}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
      </CardContent>

      <CardFooter className="flex flex-col items-start space-y-2 pt-2">
        {isInProgress && (
          <div className="w-full space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        )}
        <button className="mt-2 w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          {isInProgress ? "Continue Reading" : "Start Reading"}
        </button>
      </CardFooter>
    </Card>
  );
};

export default StoryCard;
