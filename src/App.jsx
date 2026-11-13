import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "./Pages/Landing";
import RecipePage from "./Pages/RecipePage";
import WelcomeCard from "./Components/WelcomeCard";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/recipes" element={<RecipePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <WelcomeCard />
    </>
  );
}
