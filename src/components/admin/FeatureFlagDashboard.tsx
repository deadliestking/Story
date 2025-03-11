import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFlagsmith } from "@/contexts/FlagsmithContext";

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  value?: any;
}

const FeatureFlagDashboard = () => {
  const { hasFeature, getValue, refreshFlags } = useFlagsmith();
  const [flags, setFlags] = useState<FeatureFlag[]>([
    {
      id: "enable_dynamic_themes",
      name: "Dynamic Themes",
      description: "Enable theme changes based on story context",
      enabled: false,
    },
    {
      id: "use_first_person_narrative",
      name: "First Person Narrative",
      description: "Use first person instead of second person narrative",
      enabled: false,
    },
    {
      id: "enable_detective_story",
      name: "Detective Story",
      description: "Enable the detective story in the catalog",
      enabled: false,
    },
    {
      id: "show_continue_reading",
      name: "Continue Reading Section",
      description: "Show the continue reading section on the home page",
      enabled: true,
    },
    {
      id: "enable_story_sharing",
      name: "Story Sharing",
      description: "Allow users to share stories with others",
      enabled: false,
    },
  ]);

  // In a real app, this would fetch the actual flag states from Flagsmith
  useEffect(() => {
    const updatedFlags = flags.map((flag) => ({
      ...flag,
      enabled: hasFeature(flag.id),
    }));
    setFlags(updatedFlags);
  }, [hasFeature]);

  // This is a mock function - in a real app, this would update the flag in Flagsmith
  const toggleFlag = (flagId: string) => {
    setFlags(
      flags.map((flag) =>
        flag.id === flagId ? { ...flag, enabled: !flag.enabled } : flag,
      ),
    );

    // In a real implementation, this would call the Flagsmith API to update the flag
    console.log(`Toggled flag ${flagId}`);

    // Access the toggleFlag function from context if available
    if ((useFlagsmith() as any).toggleFlag) {
      (useFlagsmith() as any).toggleFlag(flagId);
    }

    // Refresh flags to simulate the change
    setTimeout(() => refreshFlags(), 500);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Feature Flag Dashboard</h1>

      <Tabs defaultValue="story-features">
        <TabsList className="mb-4">
          <TabsTrigger value="story-features">Story Features</TabsTrigger>
          <TabsTrigger value="ui-features">UI Features</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="story-features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {flags
              .filter((flag) =>
                [
                  "use_first_person_narrative",
                  "enable_detective_story",
                  "enable_story_sharing",
                ].includes(flag.id),
              )
              .map((flag) => (
                <Card key={flag.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{flag.name}</CardTitle>
                        <CardDescription>{flag.description}</CardDescription>
                      </div>
                      <Switch
                        checked={flag.enabled}
                        onCheckedChange={() => toggleFlag(flag.id)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Status:{" "}
                      <span
                        className={
                          flag.enabled ? "text-green-500" : "text-red-500"
                        }
                      >
                        {flag.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="ui-features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {flags
              .filter((flag) =>
                ["enable_dynamic_themes", "show_continue_reading"].includes(
                  flag.id,
                ),
              )
              .map((flag) => (
                <Card key={flag.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{flag.name}</CardTitle>
                        <CardDescription>{flag.description}</CardDescription>
                      </div>
                      <Switch
                        checked={flag.enabled}
                        onCheckedChange={() => toggleFlag(flag.id)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Status:{" "}
                      <span
                        className={
                          flag.enabled ? "text-green-500" : "text-red-500"
                        }
                      >
                        {flag.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement Analytics</CardTitle>
              <CardDescription>
                Track how users interact with different story paths and UI
                configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This is a placeholder for the analytics dashboard. In a real
                implementation, this would show charts and data about user
                engagement with different features.
              </p>
              <div className="bg-muted p-4 rounded-md">
                <p className="font-medium">Sample Metrics:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Story completion rate: 68%</li>
                  <li>Average time spent per story: 12 minutes</li>
                  <li>
                    Most popular story path: "The Enchanted Forest" → Left Path
                    → Help Creature
                  </li>
                  <li>
                    A/B test results: First-person narrative shows 15% higher
                    engagement
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Export Data</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeatureFlagDashboard;
