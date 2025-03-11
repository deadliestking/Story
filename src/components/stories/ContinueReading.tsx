import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ChevronRight, BookOpen } from "lucide-react";

interface StoryProgress {
  id: string;
  title: string;
  coverImage: string;
  progress: number;
  lastReadDate: string;
  theme: "medieval" | "futuristic" | "horror";
}

interface ContinueReadingProps {
  stories?: StoryProgress[];
  onContinueReading?: (storyId: string) => void;
}

const ContinueReading = ({
  stories = [
    {
      id: "story-1",
      title: "The Lost Kingdom",
      coverImage:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
      progress: 35,
      lastReadDate: "2 days ago",
      theme: "medieval",
    },
    {
      id: "story-2",
      title: "Neon Horizons",
      coverImage:
        "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=400&q=80",
      progress: 68,
      lastReadDate: "Yesterday",
      theme: "futuristic",
    },
    {
      id: "story-3",
      title: "Whispers in the Dark",
      coverImage:
        "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&q=80",
      progress: 12,
      lastReadDate: "3 days ago",
      theme: "horror",
    },
    {
      id: "story-4",
      title: "The Enchanted Forest",
      coverImage:
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80",
      progress: 50,
      lastReadDate: "1 week ago",
      theme: "medieval",
    },
  ],
  onContinueReading = (storyId) =>
    console.log(`Continue reading story: ${storyId}`),
}: ContinueReadingProps) => {
  // Theme color mapping
  const themeColors = {
    medieval: "bg-amber-100 text-amber-800 border-amber-200",
    futuristic: "bg-blue-100 text-blue-800 border-blue-200",
    horror: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Continue Reading</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
        >
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mb-2" />
          <p className="text-gray-500">You haven't started any stories yet.</p>
          <Button className="mt-4">Discover Stories</Button>
        </div>
      ) : (
        <ScrollArea className="w-full">
          <div className="flex space-x-6 pb-4">
            {stories.map((story) => (
              <div
                key={story.id}
                className={`flex-shrink-0 w-64 border rounded-lg overflow-hidden ${themeColors[story.theme].split(" ")[2] || "border-gray-200"}`}
              >
                <div className="relative h-32">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute top-0 right-0 px-2 py-1 text-xs rounded-bl-lg ${themeColors[story.theme].split(" ").slice(0, 2).join(" ")}`}
                  >
                    {story.theme.charAt(0).toUpperCase() + story.theme.slice(1)}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-medium mb-1 line-clamp-1">
                    {story.title}
                  </h3>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Last read {story.lastReadDate}</span>
                    <span>{story.progress}%</span>
                  </div>
                  <Progress value={story.progress} className="h-1 mb-3" />
                  <Button
                    onClick={() => onContinueReading(story.id)}
                    className="w-full text-sm"
                    size="sm"
                  >
                    Continue Reading
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default ContinueReading;
