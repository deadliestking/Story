import React, { createContext, useContext, useState, useEffect } from "react";
import flagsmith from "flagsmith";

// Define the context type
type FlagsmithContextType = {
  isLoading: boolean;
  hasFeature: (flagName: string) => boolean;
  getValue: (flagName: string, defaultValue?: any) => any;
  identifyUser: (userId: string, traits?: Record<string, any>) => Promise<any>;
  logout: () => Promise<any>;
  refreshFlags: () => Promise<any>;
  toggleFlag?: (flagName: string) => void;
};

// Create the context with a default value
const defaultContext: FlagsmithContextType = {
  isLoading: true,
  hasFeature: () => false,
  getValue: (_, defaultValue) => defaultValue,
  identifyUser: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  refreshFlags: () => Promise.resolve(),
};

// Create the context
const FlagsmithContext = createContext<FlagsmithContextType>(defaultContext);

// Create a custom hook to use the context
export function useFlagsmith() {
  return useContext(FlagsmithContext);
}

// Create a provider component
const FlagsmithProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fallback flags in case Flagsmith fails to initialize
  const [fallbackFlags, setFallbackFlags] = useState({
    enable_dynamic_themes: false,
    use_first_person_narrative: false,
    enable_detective_story: false,
    show_continue_reading: true,
    enable_story_sharing: false,
    is_admin: true,
    header: "xyz",
  });

  useEffect(() => {
    // Initialize Flagsmith with the environment ID from .env
    const environmentID = import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_ID;
    console.log("Using Flagsmith environment ID:", environmentID);

    if (!isInitialized) {
      flagsmith
        .init({
          environmentID,
          cacheFlags: true,
          onChange: () => {
            console.log("Flags have been updated");
          },
        })
        .then(() => {
          console.log("Flagsmith initialized successfully");
          setIsInitialized(true);
        })
        .catch((error) => {
          console.error("Failed to initialize Flagsmith:", error);
          // Continue with fallback flags
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isInitialized]);

  const hasFeature = (flagName: string): boolean => {
    if (isInitialized) {
      try {
        return flagsmith.hasFeature(flagName);
      } catch (error) {
        console.error(`Error checking feature ${flagName}:`, error);
        return fallbackFlags[flagName] || false;
      }
    }
    return fallbackFlags[flagName] || false;
  };

  const getValue = (flagName: string, defaultValue: any = null): any => {
    if (isInitialized) {
      try {
        return flagsmith.getValue(flagName, defaultValue);
      } catch (error) {
        console.error(`Error getting value for ${flagName}:`, error);
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const identifyUser = async (
    userId: string,
    traits: Record<string, any> = {},
  ) => {
    if (isInitialized) {
      try {
        return await flagsmith.identify(userId, traits);
      } catch (error) {
        console.error(`Error identifying user ${userId}:`, error);
        return Promise.resolve();
      }
    }
    console.log(`Mock identify user: ${userId}`, traits);
    return Promise.resolve();
  };

  const logout = async () => {
    if (isInitialized) {
      try {
        return await flagsmith.logout();
      } catch (error) {
        console.error("Error logging out:", error);
        return Promise.resolve();
      }
    }
    console.log("Mock logout");
    return Promise.resolve();
  };

  const refreshFlags = async () => {
    setIsLoading(true);
    if (isInitialized) {
      try {
        await flagsmith.getFlags();
      } catch (error) {
        console.error("Error refreshing flags:", error);
      }
    } else {
      // Simulate API call if not initialized
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setIsLoading(false);
    return Promise.resolve();
  };

  const toggleFlag = (flagName: string) => {
    // This is just for the demo - in a real app, you'd update the flag in Flagsmith
    setFallbackFlags((prev) => {
      const newFlags = {
        ...prev,
        [flagName]: !prev[flagName],
      };
      console.log(`Toggled flag ${flagName} to ${newFlags[flagName]}`);
      return newFlags;
    });
  };

  // Create the context value
  const contextValue = {
    isLoading,
    hasFeature,
    getValue,
    identifyUser,
    logout,
    refreshFlags,
    toggleFlag,
  };

  return (
    <FlagsmithContext.Provider value={contextValue}>
      {children}
    </FlagsmithContext.Provider>
  );
};

export { FlagsmithProvider };
