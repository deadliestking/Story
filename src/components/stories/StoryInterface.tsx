import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFlagsmith } from "@/contexts/FlagsmithContext";
import StoryReader from "./StoryReader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface StoryInterfaceProps {
  onExit?: () => void;
}

const StoryInterface = ({ onExit }: StoryInterfaceProps) => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { hasFeature } = useFlagsmith();
  const [userProgress, setUserProgress] = useState<string | null>(null);

  // Check for saved progress on component mount
  useEffect(() => {
    // In a real app, this would come from a database or local storage
    const savedProgress = localStorage.getItem(`story-progress-${storyId}`);
    if (savedProgress) {
      setUserProgress(savedProgress);
    }
  }, [storyId]);

  const handleSaveProgress = () => {
    // In a real app, this would save to a database
    localStorage.setItem(`story-progress-${storyId}`, "current-segment-id");

    toast({
      title: "Progress Saved",
      description: "You can continue your story later.",
    });
  };

  const handleShare = () => {
    // Check if sharing is enabled via feature flag
    if (hasFeature("enable_story_sharing")) {
      // In a real app, this would generate a shareable link
      navigator.clipboard.writeText(`https://storyteller.app/story/${storyId}`);

      toast({
        title: "Link Copied",
        description: "Share this link with your friends!",
      });
    } else {
      toast({
        title: "Sharing Disabled",
        description: "This feature is currently unavailable.",
        variant: "destructive",
      });
    }
  };

  const handleExit = () => {
    if (onExit) {
      onExit();
    } else {
      navigate("/");
    }
  };

  const handleStoryComplete = (choices: string[]) => {
    // In a real app, this would save the user's choices to their profile
    console.log("Story completed with choices:", choices);

    // Remove saved progress
    localStorage.removeItem(`story-progress-${storyId}`);

    // Navigate back to home
    navigate("/");

    toast({
      title: "Story Completed",
      description: "Your choices have been saved to your profile.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-background border-b border-border p-4 flex justify-between items-center sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={handleExit}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={handleSaveProgress}>
            <Bookmark className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            disabled={!hasFeature("enable_story_sharing")}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 py-6">
        <StoryReader
          storyId={storyId || "default-story"}
          initialSegmentId={userProgress || "start"}
          onExit={handleExit}
          onComplete={handleStoryComplete}
        />
      </div>
    </div>
  );
};

export default StoryInterface;
