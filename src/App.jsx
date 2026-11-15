import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "./Pages/Landing";
import RecipePage from "./Pages/RecipePage";
import WelcomeCard from "./Components/WelcomeCard";
import QuotaPreview from "./dev/QuotaPreview";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/recipes" element={<RecipePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <WelcomeCard />
      {/* DEV ONLY: preview the API-limit screen (stripped from production builds). */}
      {import.meta.env.DEV && <QuotaPreview />}
    </>
  );
}
