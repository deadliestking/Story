import React, { useState, useEffect } from "react";
import { useFlagsmith } from "@/contexts/FlagsmithContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Choice {
  id: string;
  text: string;
  nextSegmentId: string;
}

interface StorySegment {
  id: string;
  content: string;
  choices?: Choice[];
  theme?: "medieval" | "futuristic" | "horror" | "default";
  isEnding?: boolean;
}

interface StoryReaderProps {
  storyId: string;
  initialSegmentId?: string;
  onExit?: () => void;
  onComplete?: (choices: string[]) => void;
}

const StoryReader = ({
  storyId = "default-story",
  initialSegmentId = "start",
  onExit = () => {},
  onComplete = () => {},
}: StoryReaderProps) => {
  const { hasFeature, getValue } = useFlagsmith();
  const [currentSegment, setCurrentSegment] = useState<StorySegment | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [userChoices, setUserChoices] = useState<string[]>([]);
  const [narrativeStyle, setNarrativeStyle] = useState<
    "first-person" | "third-person"
  >("third-person");

  // Mock story data - in a real app, this would come from an API
  const mockStoryData: Record<string, StorySegment> = {
    start: {
      id: "start",
      content:
        "You stand at the entrance of a dark forest. The path ahead splits in two directions.",
      choices: [
        {
          id: "choice-1",
          text: "Take the left path",
          nextSegmentId: "left-path",
        },
        {
          id: "choice-2",
          text: "Take the right path",
          nextSegmentId: "right-path",
        },
      ],
      theme: "medieval",
    },
    "left-path": {
      id: "left-path",
      content:
        "The left path leads you deeper into the forest. You hear strange noises coming from the bushes.",
      choices: [
        {
          id: "choice-3",
          text: "Investigate the noise",
          nextSegmentId: "investigate",
        },
        {
          id: "choice-4",
          text: "Continue on the path",
          nextSegmentId: "continue-left",
        },
      ],
      theme: "horror",
    },
    "right-path": {
      id: "right-path",
      content:
        "The right path opens up to a clearing with an old stone structure. It looks like some kind of portal.",
      choices: [
        { id: "choice-5", text: "Examine the portal", nextSegmentId: "portal" },
        {
          id: "choice-6",
          text: "Look for another way",
          nextSegmentId: "alternative",
        },
      ],
      theme: "futuristic",
    },
    investigate: {
      id: "investigate",
      content:
        "You find a wounded magical creature. It looks at you with intelligent eyes.",
      choices: [
        {
          id: "choice-7",
          text: "Help the creature",
          nextSegmentId: "help-creature",
        },
        {
          id: "choice-8",
          text: "Leave it alone",
          nextSegmentId: "leave-creature",
        },
      ],
      theme: "medieval",
    },
    "continue-left": {
      id: "continue-left",
      content:
        "The path leads to a dead end. You feel like you're being watched.",
      choices: [
        { id: "choice-9", text: "Turn back", nextSegmentId: "start" },
        {
          id: "choice-10",
          text: "Look for a hidden path",
          nextSegmentId: "hidden-path",
        },
      ],
      theme: "horror",
    },
    portal: {
      id: "portal",
      content:
        "The portal activates as you approach. A swirling vortex of energy appears.",
      choices: [
        {
          id: "choice-11",
          text: "Step through the portal",
          nextSegmentId: "future-world",
        },
        { id: "choice-12", text: "Back away", nextSegmentId: "right-path" },
      ],
      theme: "futuristic",
    },
    "future-world": {
      id: "future-world",
      content:
        "You emerge in a world of advanced technology. Your adventure has led you to a new beginning.",
      isEnding: true,
      theme: "futuristic",
    },
    "help-creature": {
      id: "help-creature",
      content:
        "The creature leads you to a magical sanctuary. You've found a hidden world few have ever seen.",
      isEnding: true,
      theme: "medieval",
    },
    "hidden-path": {
      id: "hidden-path",
      content:
        "The hidden path reveals a terrifying truth about the forest. Some secrets are better left undiscovered.",
      isEnding: true,
      theme: "horror",
    },
  };

  useEffect(() => {
    // Check feature flags
    const useFirstPerson = hasFeature("use_first_person_narrative");
    setNarrativeStyle(useFirstPerson ? "first-person" : "third-person");

    // Load initial segment
    loadSegment(initialSegmentId);
  }, [initialSegmentId]);

  const loadSegment = (segmentId: string) => {
    setLoading(true);

    // In a real app, this would be an API call
    setTimeout(() => {
      const segment = mockStoryData[segmentId];

      // Apply narrative style transformation if needed
      if (segment) {
        let content = segment.content;

        if (narrativeStyle === "first-person" && !content.startsWith("I")) {
          // Simple transformation for demo purposes
          content = content.replace(/You /g, "I ");
          content = content.replace(/Your /g, "My ");
        } else if (
          narrativeStyle === "third-person" &&
          !content.startsWith("You")
        ) {
          content = content.replace(/I /g, "You ");
          content = content.replace(/My /g, "Your ");
        }

        setCurrentSegment({
          ...segment,
          content,
        });
      } else {
        setCurrentSegment(null);
      }

      setLoading(false);
    }, 500); // Simulate loading
  };

  const handleChoice = (choice: Choice) => {
    // Record the user's choice
    setUserChoices([...userChoices, choice.id]);

    // Load the next segment
    loadSegment(choice.nextSegmentId);
  };

  const handleComplete = () => {
    onComplete(userChoices);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentSegment) {
    return (
      <div className="text-center p-8">
        <p className="text-lg mb-4">Story segment not found.</p>
        <Button onClick={onExit}>Return to Stories</Button>
      </div>
    );
  }

  // Get theme classes based on the current segment theme
  const getThemeClasses = () => {
    // Check if theme switching is enabled via feature flag
    const themeEnabled = hasFeature("enable_dynamic_themes");

    if (!themeEnabled) return "bg-card";

    switch (currentSegment.theme) {
      case "medieval":
        return "bg-amber-50 border-amber-200";
      case "futuristic":
        return "bg-blue-50 border-blue-200";
      case "horror":
        return "bg-red-50 border-red-200";
      default:
        return "bg-card";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className={`p-6 shadow-lg ${getThemeClasses()}`}>
        <div className="prose max-w-none mb-8">
          <p className="text-lg leading-relaxed">{currentSegment.content}</p>
        </div>

        {currentSegment.isEnding ? (
          <div className="text-center mt-8">
            <p className="text-lg font-semibold mb-4">The End</p>
            <Button onClick={handleComplete} className="mr-2">
              Complete Story
            </Button>
            <Button variant="outline" onClick={onExit}>
              Return to Stories
            </Button>
          </div>
        ) : (
          <div className="space-y-4 mt-8">
            <p className="font-medium">What will you do?</p>
            <div className="flex flex-col space-y-3">
              {currentSegment.choices?.map((choice) => (
                <Button
                  key={choice.id}
                  variant="outline"
                  className="justify-start text-left py-4 px-6 hover:bg-accent"
                  onClick={() => handleChoice(choice)}
                >
                  {choice.text}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default StoryReader;
