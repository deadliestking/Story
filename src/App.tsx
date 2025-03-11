import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { useFlagsmith } from "./contexts/FlagsmithContext";

// Lazy load components for better performance
const StoryInterface = lazy(
  () => import("./components/stories/StoryInterface"),
);
const FeatureFlagDashboard = lazy(
  () => import("./components/admin/FeatureFlagDashboard"),
);
const FeatureFlagDemo = lazy(
  () => import("./components/feature-flags/FeatureFlagDemo"),
);
const FlagsmithAdmin = lazy(
  () => import("./components/feature-flags/FlagsmithAdmin"),
);

function App() {
  const { hasFeature } = useFlagsmith();
  const isAdmin = hasFeature("is_admin");

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story/:storyId" element={<StoryInterface />} />
        <Route path="/feature-flags" element={<FeatureFlagDemo />} />
        <Route path="/flagsmith" element={<FlagsmithAdmin />} />
        {isAdmin && <Route path="/admin" element={<FeatureFlagDashboard />} />}
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </Suspense>
  );
}

export default App;
