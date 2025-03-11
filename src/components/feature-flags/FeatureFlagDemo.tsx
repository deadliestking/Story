import React from "react";
import { useFlagsmith } from "@/contexts/FlagsmithContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import Header from "../layout/Header";

const FeatureFlagDemo = () => {
  const { hasFeature, getValue, refreshFlags, isLoading } = useFlagsmith();
  const [refreshing, setRefreshing] = React.useState(false);
  const [envId, setEnvId] = React.useState<string>("");
  const { toggleFlag } = useFlagsmith() as any;

  React.useEffect(() => {
    // Get the environment ID from .env
    setEnvId(import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_ID || "Not configured");
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshFlags();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleToggle = (flagName: string) => {
    // In a real implementation, this would call the Flagsmith API
    console.log(
      `Toggling flag ${flagName} via Flagsmith API would happen here`,
    );

    // For demo purposes, we're using the local toggle function
    if (toggleFlag) {
      toggleFlag(flagName);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 space-y-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Feature Flags</h1>

          <div className="mb-6 p-4 border rounded-md bg-muted">
            <h2 className="text-lg font-semibold mb-2">
              Environment Configuration
            </h2>
            <p className="text-sm mb-2">
              <strong>Environment ID:</strong> {envId}
            </p>
            {envId === "Not configured" && (
              <div className="flex items-center text-amber-600 text-sm mt-2">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span>
                  No environment ID found in .env file. Using fallback flags.
                </span>
              </div>
            )}
          </div>

          <div className="mb-6 flex items-center">
            <Button
              onClick={handleRefresh}
              disabled={refreshing || isLoading}
              className="mb-4 flex items-center space-x-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>{refreshing ? "Refreshing..." : "Refresh Flags"}</span>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            These feature flags control various aspects of the StoryTeller
            application. Toggle them to see how they affect the user experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Header</CardTitle>
                <CardDescription>
                  Custom header value from Flagsmith
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Status:{" "}
                    <span
                      className={
                        hasFeature("header") ? "text-green-500" : "text-red-500"
                      }
                    >
                      {hasFeature("header") ? "Enabled" : "Disabled"}
                    </span>
                  </span>
                  <Switch
                    checked={hasFeature("header")}
                    onCheckedChange={() => handleToggle("header")}
                  />
                </div>
                {hasFeature("header") && (
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">
                      Value:{" "}
                      <span className="font-mono bg-background px-2 py-1 rounded">
                        "{getValue("header", "xyz")}"
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dynamic Themes</CardTitle>
                <CardDescription>
                  Enable theme changes based on story context
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Status:{" "}
                  <span
                    className={
                      hasFeature("enable_dynamic_themes")
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {hasFeature("enable_dynamic_themes")
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </span>
                <Switch
                  checked={hasFeature("enable_dynamic_themes")}
                  onCheckedChange={() => handleToggle("enable_dynamic_themes")}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>First Person Narrative</CardTitle>
                <CardDescription>
                  Use first person instead of second person narrative
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Status:{" "}
                  <span
                    className={
                      hasFeature("use_first_person_narrative")
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {hasFeature("use_first_person_narrative")
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </span>
                <Switch
                  checked={hasFeature("use_first_person_narrative")}
                  onCheckedChange={() =>
                    handleToggle("use_first_person_narrative")
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detective Story</CardTitle>
                <CardDescription>
                  Enable the detective story in the catalog
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Status:{" "}
                  <span
                    className={
                      hasFeature("enable_detective_story")
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {hasFeature("enable_detective_story")
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </span>
                <Switch
                  checked={hasFeature("enable_detective_story")}
                  onCheckedChange={() => handleToggle("enable_detective_story")}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Continue Reading Section</CardTitle>
                <CardDescription>
                  Show the continue reading section on the home page
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Status:{" "}
                  <span
                    className={
                      hasFeature("show_continue_reading")
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {hasFeature("show_continue_reading")
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </span>
                <Switch
                  checked={hasFeature("show_continue_reading")}
                  onCheckedChange={() => handleToggle("show_continue_reading")}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Story Sharing</CardTitle>
                <CardDescription>
                  Allow users to share stories with others
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Status:{" "}
                  <span
                    className={
                      hasFeature("enable_story_sharing")
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {hasFeature("enable_story_sharing")
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </span>
                <Switch
                  checked={hasFeature("enable_story_sharing")}
                  onCheckedChange={() => handleToggle("enable_story_sharing")}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Admin Access</CardTitle>
                <CardDescription>
                  Enable access to admin dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Status:{" "}
                  <span
                    className={
                      hasFeature("is_admin") ? "text-green-500" : "text-red-500"
                    }
                  >
                    {hasFeature("is_admin") ? "Enabled" : "Disabled"}
                  </span>
                </span>
                <Switch
                  checked={hasFeature("is_admin")}
                  onCheckedChange={() => handleToggle("is_admin")}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-background border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2023 StoryTeller. All rights reserved.</p>
          <p className="mt-2">Feature flags powered by Flagsmith.</p>
        </div>
      </footer>
    </div>
  );
};

export default FeatureFlagDemo;
